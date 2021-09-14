import json
import subprocess

import click


@click.command()
@click.option("--datacenter")
@click.option("--flavor")
@click.option("--command")
def delancie_exec(datacenter, flavor, command):
    with open("config.json", "rb") as f:
        config = json.load(f)
    config = config["delancie"][datacenter][flavor]
    c = [
        "kubectl",
        "get",
        "pods",
        "--context",
        config["context"],
        "--namespace",
        config["namespace"],
        "--field-selector",
        "status.phase=Running",
        "-l",
        "app=worker,service=delancie-insights",
        "--sort-by",
        ".metadata.creationTimestamp",
        "--output",
        "json",
    ]
    print(" ".join(c))
    res = subprocess.run(c, capture_output=True,)
    res = json.loads(res.stdout)
    pod = res["items"][-1]["metadata"]["name"]

    c = [
        "kubectl",
        "exec",
        "--context",
        config["context"],
        "--namespace",
        config["namespace"],
        "-it",
        "-c",
        "delancie-worker",
        pod,
        "--",
        "bash",
        "-c",
        "(while true ; do echo -ne '\\000' ; sleep 30 ; done ) & {command}".format(
            command=command
        ),
    ]
    print(" ".join(c))
    subprocess.run(c)


if __name__ == "__main__":
    delancie_exec()
