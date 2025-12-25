# Sample commands

- installing dotenvx: `brew install dotenvx/brew/dotenvx`
  - the private key needs to be in a `.env.keys` file
  - adding secret: `dotenvx set SECRET "value"`
  - adding regular env variable: `dotenvx set --plain CONFIG "value"`
- running resticprofile commands: `dotenvx run -- resticprofile snapshots`
- initializing restic repository: `dotenvx run -- resticprofile init`
- schedule CRON task: `dotenvx run -- resticprofile schedule`
  - validate that it worked: `crontab -l`
  - edit the line to prefix the call with `dotenvx -- run`:
    ```
    2 */6 * * * cd /Users/francisco/dev/dotfiles/restic/2025-12-23-puigfp-dd && dotenvx run -- /opt/homebrew/bin/resticprofile --no-ansi --config profiles.yaml run-schedule backup@puigfp-2025-12-23
    ```
- restoring a folder to a specific place: `dotenvx run -- resticprofile restore latest:/Users/francisco/dev --target ~/tmp/dev-restored`
