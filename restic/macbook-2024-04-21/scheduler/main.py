from datetime import datetime, timedelta
import json
from pathlib import Path
import subprocess
import os
import logging
import sys

WORKING_DIR = "/Users/francisco/dev/dotfiles/restic/macbook-2024-04-21"
RESTIC_PROFILE = "puigfp-2025-12-23"
BACKUP_TIME_JSON_FILE = "/Users/francisco/dev/dotfiles/restic/macbook-2024-04-21/scheduler/data/last_backup_timestamp.json"
BACKUP_FREQ = 60 * 60 * 24 # 24 hours
LOG_FILE = "/Users/francisco/dev/dotfiles/restic/macbook-2024-04-21/scheduler/data/scheduler.log"

log = logging.getLogger(__name__)
log.setLevel(logging.INFO)

# send log to stdout
handler = logging.StreamHandler(sys.stdout)
formatter = logging.Formatter("%(asctime)s %(levelname)s %(message)s")
handler.setFormatter(formatter)
log.addHandler(handler)

# send log to file
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
    subprocess.run(
        ["dotenvx", "run", "--", "resticprofile", command],
        capture_output=False,
        text=True,
        check=True, # crash if exit code is non-zero
    )


CMD = '''
on run argv
  display notification (item 2 of argv) with title (item 1 of argv) sound name (item 3 of argv)
end run
'''

def notify(title: str, text: str, sound: str = "default") -> None:
  subprocess.call(['osascript', '-e', CMD, title, text, sound])

def main():
    log.info("Starting backup")
    log.info(f"Changing working directory to \"{WORKING_DIR}\"")
    os.chdir(WORKING_DIR)
    if is_running_on_battery():
        log.info("Running on battery, skipping backup")
        exit(0)
    if is_low_data_mode():
        log.info("Current connection is using low data mode, skipping backup")
        exit(0)
    now = datetime.now().timestamp()
    last_backup_timestamp = get_last_backup_timestamp()
    time_since_last_backup = now - last_backup_timestamp
    if last_backup_timestamp is not None and time_since_last_backup < BACKUP_FREQ:
        log.info(f"Last backup was less than '{timedelta(seconds=BACKUP_FREQ)}' ago, skipping backup")
        exit(0)
    run_restic_command(f"backup@{RESTIC_PROFILE}")

if __name__ == "__main__":
    try:
        main()
        notify("Backup succeeded", "Automated Restic backup succeeded")
    except Exception as e:
        notify("Restic backup failed", f"Automated Restic backup failed: {str(e)}", sound="Basso")
        raise
