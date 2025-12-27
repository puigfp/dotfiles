from datetime import datetime, timedelta
import json
import logging
import os
from pathlib import Path
import sys

import sh

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
    result = sh.pmset("-g", "batt")
    return "AC Power" not in result

def is_low_data_mode() -> bool:
    result = sh.swift(Path(__file__).parent / "check_low_data_mode.swift")
    return "true" in result

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
    def log_line(line):
        log.info(line.rstrip())
    sh.dotenvx("run", "--", "resticprofile", command, _out=log_line, _err=log_line, _tty_out=True)

def notify(title: str, text: str, sound: str | None = "default") -> None:
    if sound:
        cmd = f'display notification "{text}" with title "{title}" sound name "{sound}"'
    else:
        cmd = f'display notification "{text}" with title "{title}"'
    sh.osascript("-e", cmd)

def main():
    now = int(datetime.now().timestamp())

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
    last_backup_timestamp = get_last_backup_timestamp()
    if last_backup_timestamp is not None and now - last_backup_timestamp < BACKUP_FREQ:
        log.info(f"Last backup was done on '{datetime.fromtimestamp(last_backup_timestamp).strftime('%Y-%m-%d %H:%M:%S')}', less than '{timedelta(seconds=BACKUP_FREQ)}' ago, skipping backup")
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
