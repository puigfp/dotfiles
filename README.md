# dotfiles

## cheatsheet

### brew

- install brew: https://brew.sh/

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

- pull latest master of all submodules

  ```sh
  git submodule foreach git pull origin master
  ```
