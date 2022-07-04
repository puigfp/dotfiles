#!/usr/bin/env bash

rsync -La ~/.zshrc ~/.p10k.zsh ~/.gitlabrc ~/.oh-my-zsh-custom ~/dev/dotfiles/workspace/.gitconfig -r workspace-francisco-puig:~
