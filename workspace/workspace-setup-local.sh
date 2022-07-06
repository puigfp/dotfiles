#!/usr/bin/env bash

rsync -Lar \
  ~/.zshrc ~/.p10k.zsh ~/.gitlabrc ~/.oh-my-zsh-custom \
  ~/dev/dotfiles/workspace/.gitconfig \
  ~/.vimrc ~/.vim \
  workspace-francisco-puig:~

rsync -Lar \
    ~/.config/nvim \
  workspace-francisco-puig:~/.config/

rsync -Lar \
    ~/dev/dotfiles/workspace/pyrightconfig.json \
    workspace-francisco-puig:~/dd/dogweb/
