import json
import os.path
import subprocess

import click


@click.command()
@click.option("--datacenter")
@click.option("--flavor")
@click.option("--command")
def delancie_exec(datacenter, flavor, command):
    with open("{}/config.json".format(os.path.dirname(os.path.abspath(__file__))), "rb") as f:
        config = json.load(f)
    config = config["delancie"][datacenter][flavor]
    context = config["context"]
    namespace = config["namespace"]
    c = [
        "kubectl",
        "get",
        "pods",
        "--context",
        context,
        "--namespace",
        namespace,
        "--field-selector",
        "status.phase=Running",
        "-l",
        "app=worker,service=delancie-{}".format(flavor),
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
        context,
        "--namespace",
        namespace,
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
