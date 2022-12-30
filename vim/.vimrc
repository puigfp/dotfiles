" remap jk to esc
:imap jk <Esc>

" install vim-plug
if empty(glob('~/.vim/autoload/plug.vim'))
  silent !curl -fLo ~/.vim/autoload/plug.vim --create-dirs
    \ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
  autocmd VimEnter * PlugInstall --sync | source $MYVIMRC
endif

" plugins
call plug#begin('~/.config/nvim/plugged')
Plug 'christoomey/vim-tmux-navigator'
Plug 'scrooloose/nerdtree', { 'on':  'NERDTreeToggle' }

" fzf
Plug 'junegunn/fzf', { 'dir': '~/.fzf', 'do': './install --all' }
Plug 'junegunn/fzf.vim'

" theme
Plug 'chriskempson/base16-vim'

call plug#end()

" mouse mode
set mouse=a

" disable vi compatibility
set nocompatible

" show line numbers
set number

" show cursor position
set ruler

" wrap long lines
set wrap

" display at least 10 lines around cusror
set scrolloff=10

" display toolbar
set guioptions=T

" ingore case when searching
set ignorecase
" except if there is an uppercase character in the search terms
set smartcase

" highlight search results when typing
set incsearch

" highlight search results
set hlsearch

" prevent vim from beeping
set visualbell
set noerrorbells

" usual backspace behavior
set backspace=indent,eol,start

" update the title of your window or your terminal
set title

" Hide buffer (file) instead of abandoning when switching
" to another buffer
set hidden

filetype on
filetype plugin on
filetype indent on

set guifont=Fira\ Code:h13

" sync vim clipboard with system clipboard
set clipboard+=unnamedplus

" NERD Tree
let NERDTreeShowHidden=1

" colors
if (has("termguicolors"))
 set termguicolors
endif

syntax enable
colorscheme base16-tomorrow
