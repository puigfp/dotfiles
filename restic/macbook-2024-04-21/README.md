# macbook-2024-04-21 restic repostitory

This is the restic repository I used to back up the most important files on all my laptops. Restic deduplicates content so backup data is actually shared across them.

To prevent data from being lost, the retention rules are applied on a per-laptop level (ie. I keep a minimum amount of snapshots for every single laptop).

Note that I only have one personal laptop at a time, but this is to ensure I'm not backups of files I might have forgotten to move from one laptop to another when switching.

## Sample commands

- installing dotenvx: `brew install dotenvx/brew/dotenvx`
  - the private key needs to be in a `.env.keys` file
  - adding secret: `dotenvx set SECRET "value"`
  - adding regular env variable: `dotenvx set --plain CONFIG "value"`
- initializing restic repository: `dotenvx run -- resticprofile init`
- running resticprofile commands: `dotenvx run -- resticprofile snapshots@profile-name`
- schedule CRON task: `dotenvx run -- resticprofile schedule@profile-name`
  - validate that it worked: `crontab -l`
  - edit the line to prefix the call with `dotenvx -- run`:
    ```
    2 */2 * * * cd /Users/francisco/dev/dotfiles/restic/macbook-2024-04-21 && dotenvx run -- /opt/homebrew/bin/resticprofile --no-ansi --config profiles.yaml run-schedule backup@profile-name
    ```
- restoring a folder to a specific place: `dotenvx run -- resticprofile restore snapshot-hash:/Users/francisco/dev --target ~/tmp/dev-restored`
