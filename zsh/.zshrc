# this was added to prevent git from trying to set the locale to "en_FR" when running
# (the language of my system is English but the region is France)
LANG="en_US.UTF-8"

# zsh initialization
ZSH="$HOME/.oh-my-zsh"
ZSH_CUSTOM="$HOME/.oh-my-zsh-custom"

ZSH_THEME="puigfp-bira/bira"

plugins=(
  fzf
  zsh-autosuggestions # fish-like suggestions
  zsh-syntax-highlighting

  # completions
  docker
  docker-compose
  golang
  npm
  vagrant
)

# make Homebrew's completions available
# please see https://docs.brew.sh/Shell-Completion
if type brew &>/dev/null; then
  FPATH=$(brew --prefix)/share/zsh/site-functions:$FPATH
fi

source $ZSH/oh-my-zsh.sh

# macOS: add GNU commands and brew-installed binaries to path
if [[ "$(uname)" == "Darwin" ]]; then
  export PATH="/usr/local/bin:$PATH";
  export PATH="/usr/local/opt/coreutils/libexec/gnubin:$PATH"; # gnu stuff
  export PATH="/usr/local/opt/grep/libexec/gnubin:$PATH"; # grep
  export PATH="/usr/local/opt/gnu-sed/libexec/gnubin:$PATH"; # sed
fi

# colors
export CLICOLOR=1
export TERM=xterm-256color

# neovim
export EDITOR="nvim"
alias vim=nvim

# Go
export GOPATH="${HOME?}/go"
export PATH="${GOPATH}/bin:${PATH}"

# Rust
export PATH="$HOME/.cargo/bin:$PATH"

# Python
export PIPENV_VENV_IN_PROJECT="enabled"
export PIP_REQUIRE_VIRTUALENV=true
export PATH="$HOME/.poetry/bin:$PATH"
eval "$(pyenv init -)"

# Brew
brew-upgrade-all() {
  brew upgrade
  brew cask upgrade --greedy # --greedy forces all GUI apps to update
}
