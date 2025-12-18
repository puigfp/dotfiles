# Sample commands

- installing dotenvx: `brew install dotenvx/brew/dotenvx`
  - adding secret: `dotenvx set SECRET "value"`
  - adding regular env variable: `dotenvx set --plain CONFIG "value"`
- running resticprofile commands: `dotenvx run -- resticprofile snapshots`
- schedule CRON task: `dotenvx run -- resticprofile schedule`
  - validate that it worked: `crontab -l`
