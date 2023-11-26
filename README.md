# dotfiles

## cheatsheet

### sane macOS parameters

```sh
./defaults.sh
```

### xcode commands line tools

- install cli tools (C/C++ compiler and other things)

  ```sh
  xcode-select --install
  ```

### brew

- install brew: https://brew.sh/

- setup completions: https://docs.brew.sh/Shell-Completion

- install/upgrade all the things

  ```sh
  brew bundle --verbose
  ```

- check which things are missing from the `Brewfile`

  ```sh
  brew bundle cleanup
  ```

- actually remove those things

  ```sh
  brew bundle cleanup --force
  ```

- figure where a package is in the dependency tree

  ```sh
  brew deps --tree --installed | less
  ```

### zsh

- add brew-installed zsh to standard shells:

  ```sh
  sudo sh -c "echo $(which zsh) >> /etc/shells"
  ```

- change user shell

  ```sh
  chsh -s $(which zsh)
  ```

### stow

- simlink dotfiles dry run

  ```sh
  stow --simulate --verbose --target $HOME <folder>
  ```

- simlimk dotfiles

  ```sh
  stow --verbose --target $HOME <folder>
  ```

### submodules

- clone repository, including submodules

  ```sh
  git clone --recurse-submodules
  ```

- init submodules (useful when you forgot the `--recurse-submodules` when cloning)

  ```sh
  git submodule update --init --recursive
  ```

- pull latest master of all submodules

  ```sh
  git submodule foreach git pull origin HEAD
  ```

### iterm

- [install patched Meslo font for powerline10k](https://github.com/romkatv/powerlevel10k#meslo-nerd-font-patched-for-powerlevel10k)

  ```sh
  p10k configure
  ```

  (quit after the font is installed)

### visual studio code

- backup extensions

  ```sh
  code --list-extensions | sort > vscode_extensions
  ```

- restore extensions

  ```sh
  code --install-extension <extension>
  # or
  for ext in $(cat vscode_extensions); do code --install-extension $ext; done
  ```

### emacs

```sh
doom install
```

#### when nothign works

```sh
rm -rf .emacs.d/.local/
doom install
```
