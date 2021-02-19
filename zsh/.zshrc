# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# this was added to prevent git from trying to set the locale to "en_FR" when running
# (the language of my system is English but the region is France)
export LANG="en_US.UTF-8"

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

# make Homebrew's completions available
# please see https://docs.brew.sh/Shell-Completion
if type brew &>/dev/null; then
  FPATH=$(brew --prefix)/share/zsh/site-functions:$FPATH

  autoload -Uz compinit
  compinit
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

# LateX
# for some reasons, path_helper doesn't pick up /etc/paths.d/TeX
export PATH="/Library/TeX/texbin:$PATH"

# Python
# export PIPENV_VENV_IN_PROJECT="enabled"
# export PIP_REQUIRE_VIRTUALENV=true
# export PATH="$HOME/.poetry/bin:$PATH"
eval "$(pyenv init -)"

# Brew
brew-upgrade-all() {
  brew upgrade
  brew cask upgrade --greedy # --greedy forces all GUI apps to update
}

# -------
# Datadog
# -------

# Force certain more-secure behaviours from homebrew
export HOMEBREW_NO_INSECURE_REDIRECT=1
export HOMEBREW_CASK_OPTS=--require-sha

# Load ruby shims
eval "$(rbenv init -)"

# Add AWS CLI to PATH
export PATH="/usr/local/opt/awscli@1/bin:$PATH"

# Add datadog devtools binaries to the PATH
export PATH="${HOME?}/dd/devtools/bin:${PATH?}"

# Point DATADOG_ROOT to ~/dd symlink
export DATADOG_ROOT="${HOME?}/dd"

# Tell the devenv vm to mount $GOPATH/src rather than just dd-go
export MOUNT_ALL_GO_SRC=1

# store key in the login keychain instead of aws-vault managing a hidden keychain
export AWS_VAULT_KEYCHAIN_NAME=login

# tweak session times so you don't have to re-enter passwords every 5min
export AWS_SESSION_TTL=24h
export AWS_ASSUME_ROLE_TTL=1h

# create GITLAB_TOKEN env var
source $HOME/.gitlabrc

# use java 8 for dd-analytics
export JAVA_HOME=`/usr/libexec/java_home -v 1.8`

export PATH="/usr/local/opt/postgresql@9.6/bin:$PATH"
export LIBRARY_PATH=$LIBRARY_PATH:/usr/local/opt/openssl/lib/

# black
alias black="/Users/francisco.puig/.pyenv/versions/3.8.5/envs/black/bin/black"

# isort
alias isort="/Users/francisco.puig/.pyenv/versions/3.8.5/envs/isort/bin/isort"

# init nodenv
eval "$(nodenv init -)"
export NODE_OPTIONS="--max-old-space-size=8192"

# aws aliases
alias aws-us1-staging="aws-vault exec staging-engineering -- aws s3"
alias aws-us1-prod="aws-vault exec prod-engineering -- aws"
alias aws-us1-fed="aws --profile govcloud-us1-fed-human-engineering"

alias aws-govcloud-login="saml2aws login -a govcloud-us1-fed-human-engineering"

# k8s aliases
delancie-insights() {
  context=$1
  namespace=$2
  cmd=$3
  pod=$(kubectl get pods --context $context --namespace $namespace --field-selector=status.phase=Running -l app=worker,service=delancie-insights --sort-by=.metadata.creationTimestamp --output=json | jq -r ".items[-1].metadata.name" )
  kubectl exec --context $context --namespace $namespace -it -c delancie-worker $pod -- $(echo $cmd)
}

alias delancie-insights-us1-staging='delancie-insights plain2.us1.staging.dog delancie "dogg shell"'
alias delancie-insights-us1-prod='delancie-insights plain2.us1.prod.dog delancie "dogg shell"'
alias delancie-insights-us1-fed='delancie-insights plain1.us1.fed.dog delancie "dogg shell"'
alias delancie-insights-us3-prod='delancie-insights plain4.us3.prod.dog delancie "dogg shell"'
alias delancie-insights-eu1-prod='delancie-insights app3.eu1.prod.dog datadog "dogg shell"'
alias delancie-insights-us1-staging-sh='delancie-insights plain2.us1.staging.dog delancie "bash"'
alias delancie-insights-us1-prod-sh='delancie-insights plain2.us1.prod.dog delancie "bash"'
alias delancie-insights-us1-fed-sh='delancie-insights plain1.us1.fed.dog delancie "bash"'
alias delancie-insights-us3-prod-sh='delancie-insights plain4.us3.prod.dog delancie "bash"'
alias delancie-insights-eu1-prod-sh='delancie-insights app3.eu1.prod.dog datadog "bash"'

elasticsearch-port-forward() {
  context=$1
  namespace=$2
  pod=$(kubectl get pods --context $context --namespace $namespace --field-selector=status.phase=Running -l cluster=watchdog,elasticsearch-role=client --output=json | jq -r ".items[-1].metadata.name" )
  kubectl --context $context port-forward $pod 9200
}

alias elasticsearch-port-forward-us1-staging='elasticsearch-port-forward chinook.us1.staging.dog watchdog'
alias elasticsearch-port-forward-us1-prod='elasticsearch-port-forward general1.us1.prod.dog watchdog'

# nbt aliases
nbt-open() {
  context=$1
  nbt open --context $context francisco
}
alias nbt-open-us1-staging='nbt-open nbt-ds-staging'
alias nbt-open-us1-prod='nbt-open nbt-ds-us1-prod'

nbt-init() {
  context=$1
  nbt init --context $context francisco
}
alias nbt-init-us1-staging='nbt-init nbt-ds-staging'
alias nbt-init-us1-prod='nbt-init nbt-ds-us1-prod'

nbt-sync() {
  context=$1
  nbt sync --context $context francisco
}
alias nbt-sync-us1-staging='nbt-sync nbt-ds-staging'
alias nbt-sync-us1-prod='nbt-sync nbt-ds-us1-prod'

nbt-resume() {
  context=$1
  nbt resume --context $context francisco
}
alias nbt-resume-us1-staging='nbt-resume nbt-ds-staging'
alias nbt-resume-us1-prod='nbt-resume nbt-ds-us1-prod'

# vault aliases
vault-login() {
  vault=$1
  export VAULT_ADDR=https://vault.$1
  vault login -method=oidc
}

# appgate aliases
GOVCLOUD_APPGATE_URL="appgate://sdp.fed.d.dog/eyJzcGEiOnsibW9kZSI6IlRDUCIsIm5hbWUiOiJkZWZhdWx0Iiwia2V5IjoiMGI4NDMyZTEyYWQ5Yzk1YjY4ZDRlOTAwM2YzMDFkMmMxYTJkN2NlY2E5ZjhmZDM5MDQxOTljMjgwN2MyNjczNCJ9LCJjYUZpbmdlcnByaW50IjoiYzQ2YjA3NGU4OGJmNTk2MzlmNGVjMDFiMTIwNDE2ZjcyNTExYzM1ZmQ0YmY5M2M2Y2I3NDIyNDVjNmM2MzEwYyIsImlkZW50aXR5UHJvdmlkZXJOYW1lIjoiZ29vZ2xlIn0="
DATADOG_APPGATE_URL="appgate://appgate.datadoghq.com/eyJjYUZpbmdlcnByaW50IjoiN2MxMTEwNWZkNzAzNWYzMjE5NTdiYjdhZDQ0ZTIwZjc0YTZkZTNiYWM3ZWIzZTkzNWJmNjAzMDAzOTI4NmYwYyIsImlkZW50aXR5UHJvdmlkZXJOYW1lIjoiTG9naW4gV2l0aCBHb29nbGUifQ=="

alias appgate-fed="killall -9 'AppGate SDP' || true && open $GOVCLOUD_APPGATE_URL"
alias appgate-dd="killall -9 'AppGate SDP' || true && open $DATADOG_APPGATE_URL"

# ------------
# powerline10k
# ------------

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
