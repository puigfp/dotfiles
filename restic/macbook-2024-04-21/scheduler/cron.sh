#!/bin/zsh

# Cron runs with minimal PATH - add Homebrew first
eval "$(/opt/homebrew/bin/brew shellenv)"

cd /Users/francisco/dev/dotfiles/restic/macbook-2024-04-21/scheduler
uv run python main.py