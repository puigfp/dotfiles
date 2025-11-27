# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

### START ANYSPHERE CODEBLOCK
[ -f "/Users/francisco/anysphere/everysphere/scripts/setup/rcfiles/zshrc" ] && source "/Users/francisco/anysphere/everysphere/scripts/setup/rcfiles/zshrc"
### END ANYSPHERE CODEBLOCK

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
  export PATH="/usr/local/opt/findutils/libexec/gnubin:$PATH" # find
fi

# colors
export CLICOLOR=1
export TERM=xterm-256color

# neovim
alias vim=nvim
export EDITOR=nvim
export VISUAL=nvim

# Go
export GOPATH="${HOME?}/go"
export PATH="${GOPATH}/bin:${PATH}"

# To customize prompt, run `p10k configure` or edit ~/.p10k.zsh.
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh

[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
