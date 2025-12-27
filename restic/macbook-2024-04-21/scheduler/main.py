from datetime import datetime, timedelta
import json
from pathlib import Path
import pty
import subprocess
import os
import logging
import sys

WORKING_DIR = "/Users/francisco/dev/dotfiles/restic/macbook-2024-04-21"
RESTIC_PROFILE = "puigfp-2025-12-23"
BACKUP_TIME_JSON_FILE = "/Users/francisco/dev/dotfiles/restic/macbook-2024-04-21/scheduler/data/last_backup_timestamp.json"
LOG_FILE = "/Users/francisco/dev/dotfiles/restic/macbook-2024-04-21/scheduler/data/scheduler.log"
BACKUP_FREQ = 60 * 60 * 24 # 24 hours

log = logging.getLogger(__name__)
log.setLevel(logging.INFO)

formatter = logging.Formatter("%(asctime)s %(levelname)s %(message)s")

# log to stdout
stdout_handler = logging.StreamHandler(sys.stdout)
stdout_handler.setFormatter(formatter)
log.addHandler(stdout_handler)

# log to file
file_handler = logging.FileHandler(LOG_FILE)
file_handler.setFormatter(formatter)
log.addHandler(file_handler)


def is_running_on_battery() -> bool:
    result = subprocess.run(
        ["pmset", "-g", "batt"],
        capture_output=True,
        text=True,
        check=True, # crash if exit code is non-zero
    )
    return "AC Power" not in result.stdout

def is_low_data_mode() -> bool:
    # Call an AI-generated Swift script because the API is only available for Swift.
    script_path = Path(__file__).parent / "check_low_data_mode.swift"
    result = subprocess.run(
        ["swift", str(script_path)],
        capture_output=True,
        text=True,
        check=True, # crash if exit code is non-zero
    )
    return "true" in result.stdout

def get_last_backup_timestamp() -> int | None:
    import json

    json_path = Path(BACKUP_TIME_JSON_FILE)
    if not json_path.exists():
        return None

    with open(json_path, "r") as f:
        data = json.load(f)
        last_backup_ts = data.get("last_backup_timestamp")
        if last_backup_ts is None:
            return None

    return int(last_backup_ts)

def write_last_backup_timestamp(timestamp: int) -> None:
    json_path = Path(BACKUP_TIME_JSON_FILE)
    with open(json_path, "w") as f:
        json.dump({"last_backup_timestamp": timestamp}, f)

def run_restic_command(command: str):
    # AI-generated code to capture output and forwarding it to the logger
    master_fd, slave_fd = pty.openpty()
    process = subprocess.Popen(
        ["dotenvx", "run", "--", "resticprofile", command],
        stdout=slave_fd,
        stderr=slave_fd,
        close_fds=True,
    )
    os.close(slave_fd)
    with os.fdopen(master_fd, "r") as master:
        for line in master:
            log.info(line.rstrip())
    process.wait()
    if process.returncode != 0:
        raise subprocess.CalledProcessError(process.returncode, command)

def notify(title: str, text: str, sound: str | None = "default") -> None:
    if sound:
        cmd = 'display notification "{}" with title "{}" sound name "{}"'.format(text, title, sound)
    else:
        cmd = 'display notification "{}" with title "{}"'.format(text, title)
    subprocess.call(['osascript', '-e', cmd])

def main():
    log.info("Starting backup")
    log.info(f"Changing working directory to \"{WORKING_DIR}\"")
    os.chdir(WORKING_DIR)

    # do not run on battery
    if is_running_on_battery():
        log.info("Running on battery, skipping backup")
        return

    # do not run on iPhone hotspot
    if is_low_data_mode():
        log.info("Current connection is using low data mode, skipping backup")
        return
    
    # do not run if last backup is recent-enough
    now = int(datetime.now().timestamp())
    last_backup_timestamp = get_last_backup_timestamp()
    if last_backup_timestamp is not None and now - last_backup_timestamp < BACKUP_FREQ:
        log.info(f"Last backup was less than '{timedelta(seconds=BACKUP_FREQ)}' ago, skipping backup")
        return

    # run backup
    run_restic_command(f"backup@{RESTIC_PROFILE}")
    write_last_backup_timestamp(now)
    notify("Backup succeeded", "Automated Restic backup succeeded", sound=None)

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        log.exception("Restic backup failed")
        notify("Restic backup failed", f"Automated Restic backup failed: {str(e)}", sound="Basso")
        raise
