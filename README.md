# dotfiles

## cheatsheet

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

- pull latest master of all submodules

  ```sh
  git submodule foreach git pull origin master
  ```

### visual studio code extensions

- backup

  ```sh
  code --list-extensions | sort > vscode_extensions
  ```

- restore

  ```sh
  code --install-extension <extension>
  # or
  for ext in $(cat vscode_extensions); do code --install-extension $ext; done
  ```
