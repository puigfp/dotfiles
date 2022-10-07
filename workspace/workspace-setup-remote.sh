#!/usr/bin/env bash

# install random packages
sudo apt update
sudo apt install htop pipx python3.8-venv neovim fzf rsync

# install isort/black in the global PATH
pipx install isort==5.8.0
pipx install black==19.10b0
pipx runpip black install click==8.0.4

# install oh-my-zsh and powerlevel10k
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/powerlevel10k

# login to image registry
ddtool auth whoami --datacenter us1.ddbuild.io

# setup workspace
unset CONSUL_HTTP_ADDR
SEED_REPOS=dogweb setup-workspace
cd dd/dogweb
rake setup_workspace
