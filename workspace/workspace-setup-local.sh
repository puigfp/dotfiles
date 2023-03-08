#!/usr/bin/env bash

WORKSPACE=workspace-francisco-puig-blue

rsync -Lar \
  ~/.zshrc ~/.p10k.zsh ~/.secrets ~/.oh-my-zsh-custom \
  ~/dev/dotfiles/workspace/.gitconfig \
  ~/.vimrc ~/.vim \
  ~/.tmux.conf \
  $WORKSPACE:~/

rsync -Lar \
    ~/.config/nvim \
    ~/.config/tmux \
  $WORKSPACE:~/.config/

rsync -Lar \
    ~/dev/dotfiles/workspace/pyrightconfig.json \
    $WORKSPACE:~/dd/dogweb/
