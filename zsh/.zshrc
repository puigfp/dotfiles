# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# this was added to prevent git from trying to set the locale to "en_FR" when running
# (the language of my system is English but the region is France)
export LANGUAGE="en_US.UTF-8"
export LANG="en_US.UTF-8"
export LC_ALL="en_US.UTF-8"

# zsh initialization
ZSH="$HOME/.oh-my-zsh"
ZSH_CUSTOM="$HOME/.oh-my-zsh-custom"

ZSH_THEME="powerlevel10k/powerlevel10k"

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

# longer history
HISTSIZE=10000000
SAVEHIST=10000000

is_mac () {
  if [[ "$(uname)" == "Darwin" ]]; then
    return 0
  else
    return 1
  fi
}
IS_MAC=$(is_mac)

is_workspace () {
  if [[ "$(uname)" == "Linux" ]]; then
    return 0
  else
    return 1
  fi
}
IS_WORKSPACE=$(is_workspace)

# make Homebrew's completions available
# please see https://docs.brew.sh/Shell-Completion
if $IS_MAC; then
  # TODO: new homebrew stuff for M1 macs only
  echo '# Set PATH, MANPATH, etc., for Homebrew.' >> /Users/francisco.puig/.zprofile
  echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> /Users/francisco.puig/.zprofile
  eval "$(/opt/homebrew/bin/brew shellenv)"
  # end
  if type brew &>/dev/null; then
    FPATH=$(brew --prefix)/share/zsh/site-functions:$FPATH

    autoload -Uz compinit
    compinit
  fi
fi

source $ZSH/oh-my-zsh.sh

# macOS: add GNU commands and brew-installed binaries to path
if $IS_MAC; then
  export PATH="/usr/local/bin:$PATH";
  export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:${PATH?}"
  export PATH="/usr/local/opt/coreutils/libexec/gnubin:$PATH"; # gnu stuff
  export PATH="/usr/local/opt/grep/libexec/gnubin:$PATH"; # grep
  export PATH="/usr/local/opt/gnu-sed/libexec/gnubin:$PATH"; # sed
  export PATH="/usr/local/opt/findutils/libexec/gnubin:$PATH" # find
fi

# colors
export CLICOLOR=1
export TERM=xterm-256color

# emacs
if $IS_MAC; then
  export PATH="$HOME/.emacs.d/bin:$PATH"
fi

# neovim
alias vim=nvim
export EDITOR=nvim
export VISUAL=nvim

# Go
export GOPATH="${HOME?}/go"
export PATH="${GOPATH}/bin:${PATH}"
# Go 1.16+ sets GO111MODULE to off by default with the intention to
# remove it in Go 1.18, which breaks projects using the dep tool.
# https://blog.golang.org/go116-module-changes
export GO111MODULE=auto
export GOPRIVATE=github.com/DataDog

# Rust
if $IS_MAC; then
  export PATH="$HOME/.cargo/bin:$PATH"
fi

# Haskell
if $IS_MAC; then
  export PATH="$HOME/.ghcup/bin:$PATH"
fi

# LateX
# for some reasons, path_helper doesn't pick up /etc/paths.d/TeX
if $IS_MAC; then
  export PATH="/Library/TeX/texbin:$PATH"
fi

# Python
if $IS_MAC; then
  eval "$(pyenv init -)"
fi
# pipx
export PATH="${HOME}/.local/bin:${PATH}$"

# -------
# Datadog
# -------

# Force certain more-secure behaviors from homebrew
if $IS_MAC; then
  export HOMEBREW_NO_INSECURE_REDIRECT=1
  export HOMEBREW_CASK_OPTS=--require-sha
  export HOMEBREW_DIR=/opt/homebrew
  export HOMEBREW_BIN=/opt/homebrew/bin
fi

# Load ruby shims
if $IS_MAC; then
  eval "$(rbenv init -)"
fi

# Add AWS CLI to PATH
if $IS_MAC; then
  export PATH="/usr/local/opt/awscli@1/bin:$PATH"
fi

# store key in the login keychain instead of aws-vault managing a hidden keychain
if $IS_MAC; then
  export AWS_VAULT_KEYCHAIN_NAME=login
fi

# tweak session times so you don't have to re-enter passwords every 5min
if $IS_MAC; then
  export AWS_SESSION_TTL=24h
  export AWS_ASSUME_ROLE_TTL=1h
fi

# # google-cloud-sdk brew caveat
if $IS_MAC; then
  source "/opt/homebrew/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/path.zsh.inc"
  source "/opt/homebrew/Caskroom/google-cloud-sdk/latest/google-cloud-sdk/completion.zsh.inc"
fi

# Add datadog devtools binaries to the PATH
if $IS_MAC; then
  export PATH="${HOME?}/dd/devtools/bin:${PATH?}"
fi

# Point DATADOG_ROOT to ~/dd symlink
export DATADOG_ROOT="${HOME?}/dd"

# create GITLAB_TOKEN env var
source $HOME/.secrets

# aws aliases
if $IS_MAC; then
  alias aws-us1-staging="aws-vault exec staging-engineering -- aws s3"
  alias aws-us1-prod="aws-vault exec prod-engineering -- aws"
  alias aws-us1-fed="aws --profile govcloud-us1-fed-human-engineering"

  alias aws-govcloud-login="saml2aws login -a govcloud-us1-fed-human-engineering"
fi

# usage: vault-login us1.prod
if $IS_MAC; then
  vault-login() {
    export VAULT_ADDR=https://vault.$1.dog
    export VAULT_TOKEN=$(vault login -method oidc -token-only)
  }
fi

if $IS_WORKSPACE; then
  alias py2="source venv2/bin/activate"
  alias py3="source venv3/bin/activate"
  export DOGWEB_DEFAULT_CONFIG_PATH=$DATADOG_ROOT/dogweb/workspace.ini
fi

# --------------
# node js things
# --------------
export NODE_OPTIONS="--max-old-space-size=12288"
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"

# init nodenv
if $IS_MAC; then
  # eval "$(nodenv init -)"
   export NVM_DIR="$HOME/.nvm"
  [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"  # This loads nvm
  [ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
fi


# BEGIN DATA-ENG-TOOLS MANAGED BLOCK
# Add data-eng-tools binaries and helpers to the path
export PATH="${DATADOG_ROOT}/data-eng-tools/bin:${PATH?}"
source ${DATADOG_ROOT}/data-eng-tools/dotfiles/helpers
export DYLD_LIBRARY_PATH=/usr/local/opt/openssl/lib
# END DATA-ENG-TOOLS MANAGED BLOCK

# BEGIN DD-ANALYTICS MANAGED BLOCK
# Add required dd-analytics binaries to the path
if [ -z "$LIBRARY_PATH" ]
then
    export LIBRARY_PATH="/opt/homebrew/opt/openssl/lib/"
else
    export LIBRARY_PATH="/opt/homebrew/opt/openssl/lib/:${LIBRARY_PATH?}"
fi

alias j8="export JAVA_HOME=\`/usr/libexec/java_home -v 1.8\`; java -version"
alias j11="export JAVA_HOME=\`/usr/libexec/java_home -v 11\`; java -version"

# Set java 8 as default
export JAVA_HOME=`/usr/libexec/java_home -v 1.8`

# For Spark 3.1.2:
export SCALA_HOME="/opt/homebrew/opt/scala@2.12/"
export PATH=$PATH:$SCALA_HOME/bin
export SPARK_HOME=/usr/local/src/spark-3.3.2-bin-hadoop3
export PATH=$PATH:$SPARK_HOME/bin

# Python and Virtualenv Paths
export PATH="/opt/homebrew/opt/virtualenv/bin:$PATH"

# Add dda-cli to the PATH
export PATH=$PATH:${DATADOG_ROOT}/data-eng-tools/bin
# END DD-ANALYTICS MANAGED BLOCK

# XXX: which one of these is actually the one we need?

# add git signing key to agent
ssh-add -l | grep "+git-commit-signing@datadoghq.com" > /dev/null || ssh-add --apple-use-keychain ~/.ssh/datadog_git_commit_signing 2> /dev/null

# git signing key
eval "$(dd-gitsign load-key)"


# ------------
# powerline10k
# ------------

POWERLEVEL9K_INSTANT_PROMPT=verbose

# To customize prompt, run `p11k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
