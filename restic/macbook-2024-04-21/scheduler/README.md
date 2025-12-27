# scheduler

This is a small Restic-wrapper meant to be called as a CRON-job.

It's meantly here to provide semantics that CRON + resticprofile don't provide:
- skip backup if using a "low data mode" internet access point (eg. my iPhone in hotspot mode)
- skip backup if Macbook runnning on battery
- skip backup if previous backup is recent-enough
    With a CRON or launchd-scheduled backup, we can say "run a backup every day", but if was skipped for any reason – Macbook was sleeping or running on battery – the next attempt would only occur a day later. We could make the schedule shorter (eg. "run a backup every hour"), but then, we would run the backup even if the previous hour's backup has succeeded, which is wasteful.

## Crontab

### Entry

Make sure to run this command manually before updating the crontab:

```
*/15 * * * * zsh /Users/francisco/dev/dotfiles/restic/macbook-2024-04-21/scheduler/cron.sh
```

### If nothing runs

Check failure logs in `/var/mail/francisco`.
