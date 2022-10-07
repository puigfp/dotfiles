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

is_mac() {
  if [[ "$(uname)" == "Darwin" ]]; then
    return 0
  else
    return 1
  fi
}

is_workspace() {
  if [[ "$(uname)" == "Linux" ]]; then
    return 0
  else
    return 1
  fi
}

# make Homebrew's completions available
# please see https://docs.brew.sh/Shell-Completion
if is_mac; then
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
if is_mac; then
  export PATH="/usr/local/bin:$PATH";
  export PATH="/usr/local/opt/coreutils/libexec/gnubin:$PATH"; # gnu stuff
  export PATH="/usr/local/opt/grep/libexec/gnubin:$PATH"; # grep
  export PATH="/usr/local/opt/gnu-sed/libexec/gnubin:$PATH"; # sed
  export PATH="/usr/local/opt/findutils/libexec/gnubin:$PATH" # find
fi

# colors
export CLICOLOR=1
export TERM=xterm-256color

# emacs
if is_mac; then
  export PATH="$HOME/.emacs.d/bin:$PATH"
fi

# neovim
alias vim=nvim
export EDITOR=nvim
export VISUAL=nvim

# Go
export GOPATH="${HOME?}/go"
export PATH="${GOPATH}/bin:${PATH}"

# Rust
if is_mac; then
  export PATH="$HOME/.cargo/bin:$PATH"
fi

# LateX
# for some reasons, path_helper doesn't pick up /etc/paths.d/TeX
if is_mac; then
  export PATH="/Library/TeX/texbin:$PATH"
fi

# Python
if is_mac; then
  eval "$(pyenv init -)"
fi
# pipx
export PATH="${HOME}/.local/bin:${PATH}$"

# Brew
if is_mac; then
  brew-upgrade-all() {
    brew upgrade --greddy # --greedy forces all GUI apps to update
  }
fi

# -------
# Datadog
# -------

# Force certain more-secure behaviours from homebrew
if is_mac; then
  export HOMEBREW_NO_INSECURE_REDIRECT=1
  export HOMEBREW_CASK_OPTS=--require-sha
fi

# Load ruby shims
if is_mac; then
  eval "$(rbenv init -)"
fi

# Add AWS CLI to PATH
if is_mac; then
  export PATH="/usr/local/opt/awscli@1/bin:$PATH"
fi

# store key in the login keychain instead of aws-vault managing a hidden keychain
if is_mac; then
  export AWS_VAULT_KEYCHAIN_NAME=login
fi

# tweak session times so you don't have to re-enter passwords every 5min
if is_mac; then
  export AWS_SESSION_TTL=24h
  export AWS_ASSUME_ROLE_TTL=1h
fi

# Add datadog devtools binaries to the PATH
if is_mac; then
  export PATH="${HOME?}/dd/devtools/bin:${PATH?}"
fi

# Point DATADOG_ROOT to ~/dd symlink
export DATADOG_ROOT="${HOME?}/dd"

# Tell the devenv vm to mount $GOPATH/src rather than just dd-go
if is_mac; then
  export MOUNT_ALL_GO_SRC=1
fi

# create GITLAB_TOKEN env var
source $HOME/.gitlabrc

# use java 8 for dd-analytics
if is_mac; then
  export JAVA_HOME=`/usr/libexec/java_home -v 1.8`
fi


# Add dda-cli to the PATH
if is_mac; then
  export PATH=$PATH:${DATADOG_ROOT}/data-eng-tools/bin
fi

if is_mac; then
  export PATH="/usr/local/opt/postgresql@9.6/bin:$PATH"
  export LIBRARY_PATH=$LIBRARY_PATH:/usr/local/opt/openssl/lib/
fi

# init nodenv
if is_mac; then
  eval "$(nodenv init -)"
  export NODE_OPTIONS="--max-old-space-size=8192"
fi

# aws aliases
if is_mac; then
  alias aws-us1-staging="aws-vault exec staging-engineering -- aws s3"
  alias aws-us1-prod="aws-vault exec prod-engineering -- aws"
  alias aws-us1-fed="aws --profile govcloud-us1-fed-human-engineering"

  alias aws-govcloud-login="saml2aws login -a govcloud-us1-fed-human-engineering"
fi


# k8s aliases
if is_mac; then
  alias delancie-exec="/Users/francisco.puig/.pyenv/versions/3.9.7/envs/delancie-exec/bin/python /Users/francisco.puig/dev/dotfiles/tools/.tools/delancie-exec/main.py"
fi

if is_mac; then
  elasticsearch-port-forward() {
    context=$1
    namespace=$2
    pod=$(kubectl get pods --context $context --namespace $namespace --field-selector=status.phase=Running -l cluster=watchdog,elasticsearch-role=client --output=json | jq -r ".items[-1].metadata.name" )
    kubectl --context $context port-forward $pod 9200
  }
  alias elasticsearch-port-forward-us1-staging='elasticsearch-port-forward chinook.us1.staging.dog watchdog'
  alias elasticsearch-port-forward-us1-prod='elasticsearch-port-forward general1.us1.prod.dog watchdog'
fi

# vault aliases
# usage: vault-login us1.prod
if is_mac; then
  vault-login() {
    export VAULT_ADDR=https://vault.$1.dog
    export VAULT_TOKEN=$(vault login -method oidc -token-only)
  }
fi

# appgate aliases
if is_mac; then
  GOVCLOUD_APPGATE_URL="appgate://sdp.fed.d.dog/eyJzcGEiOnsibW9kZSI6IlRDUCIsIm5hbWUiOiJkZWZhdWx0Iiwia2V5IjoiMGI4NDMyZTEyYWQ5Yzk1YjY4ZDRlOTAwM2YzMDFkMmMxYTJkN2NlY2E5ZjhmZDM5MDQxOTljMjgwN2MyNjczNCJ9LCJjYUZpbmdlcnByaW50IjoiYzQ2YjA3NGU4OGJmNTk2MzlmNGVjMDFiMTIwNDE2ZjcyNTExYzM1ZmQ0YmY5M2M2Y2I3NDIyNDVjNmM2MzEwYyIsImlkZW50aXR5UHJvdmlkZXJOYW1lIjoiZ29vZ2xlIn0="
  DATADOG_APPGATE_URL="appgate://appgate.datadoghq.com/eyJjYUZpbmdlcnByaW50IjoiN2MxMTEwNWZkNzAzNWYzMjE5NTdiYjdhZDQ0ZTIwZjc0YTZkZTNiYWM3ZWIzZTkzNWJmNjAzMDAzOTI4NmYwYyIsImlkZW50aXR5UHJvdmlkZXJOYW1lIjoiTG9naW4gV2l0aCBHb29nbGUifQ=="

  alias appgate-fed="killall -9 'AppGate SDP' || true && open $GOVCLOUD_APPGATE_URL"
  alias appgate-dd="killall -9 'AppGate SDP' || true && open $DATADOG_APPGATE_URL"
fi

# this is working on zsh, I haven't tested it in other shells
function _update_stubs {
    sub=$1
    # replace with your path to `protoc-gen-mypy`
    protoc --plugin=protoc-gen-mypy=/Users/francisco.puig/.pyenv/versions/3.8.5/envs/prototypehint/bin/protoc-gen-mypy \
        --mypy_out=dd/pb \
        -I dd/pb/proto/ \
        -I vendor/ \
        $(find dd/pb/proto/$sub -name "*.proto" -exec echo -n "{} " \;)
    find dd/pb/$sub -name "*.pyi" -exec /usr/bin/sed -i "" "s/from $sub/from dd.pb.$sub/" {} \;
    # using well know types import
    # allows to add autocompletion for official google protobuf wrappers, e.g. `ToSeconds` on a Timestamp
    find dd/pb/$sub -name "*.pyi" -exec /usr/bin/sed -i "" "s/from google.protobuf.timestamp_pb2 import/from google.protobuf.internal.well_known_types import /" {} \;
}

function update_dogweb_stubs {
    cd $DATADOG_ROOT/dogweb
    for sub in $(find dd/pb/proto -mindepth 1 -maxdepth 1 -type d -printf "%f\n"); do
        _update_stubs $sub
    done
    # parallel version that I can not get to work
    # find dd/pb/proto -mindepth 1 -maxdepth 1 -type d -printf "%f\n" | xargs -I {} -P8 sh -c '_update_stubs {}'
    cd -
}

if is_mac; then
  export PATH=$PATH:$HOME/dd/experimental/teams/metrics-query
fi

if is_workspace; then
  alias py2="source venv2/bin/activate"
  alias py3="source venv3/bin/activate"

  export DOGWEB_DEFAULT_CONFIG_PATH=$DATADOG_ROOT/dogweb/workspace.ini
fi

# ------------
# powerline10k
# ------------

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
