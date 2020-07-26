# macOS setup notes

## First boot configuration

### Configuration screens

- Location: United States
- Language: English (US)
- Keyboard Layout: US International (makes typing French accents much easier)
- Account Name: `francisco`
- iCloud Keychain: setup later
- Privacy Settings
  - Enable localization
  - Disable app analytics (Apple / third party developers)
  - Disable "Ask Siri"
- iCloud: do not store files from Documents and Desktop in iCloud Drive
- FileVault: enable full-disk encryption and allow iCloud account to unlock disk
- Apple Pay: setup later
- Theme: Dark Theme
- True Tone: enable

### Preferences

#### Hostname

- Sharing -> Computer name -> `puigfp`

#### Appearance

- Keyboard
  - Turn keyboard backlight off after 5 seconds of inactivity
  - Customize Touch Bar -> Brightness Slider, Play/Pause, Volume Slider, Mute
- Users & Groups
  - Update user picture
- Accessibility
  - Pointer Control
    - Ignore built-in trackpad ... -> Enable

### SSH

- Generate SSH key: `ssh-keygen -t rsa -b 8192 -C francisco@puigfp -o`

### Stuff not available on Brew

- Manual install

  - [Xbox Controller driver](https://github.com/360Controller/360Controller/releases/)
  - Google Drive Backup & Sync
  - Docker for Mac
  - IntelliJ Idea Ultimate
  - [Poetry](https://poetry.eustace.io/docs/#installation)

- Using `npm install --global`
  - `gitmoji-cli`

### iTerm2

- [Instructions for syncing its config with this repo](http://stratus3d.com/blog/2015/02/28/sync-iterm2-profile-with-dotfiles-repository/)
- [Night Owl theme](https://github.com/nickcernis/iterm2-night-owl)
- [Bring back delete word/line shortcuts](https://stackoverflow.com/questions/12335787/with-iterm2-on-mac-how-to-delete-forward-a-word-from-cursor-on-command-line)
- [Bring back word by word movement shortcuts](https://apple.stackexchange.com/questions/154292/iterm-going-one-word-backwards-and-forwards)

### Neovim

- Install plugins: `:PlugInstall`

### DNS

- Configure CloudFlare DNS: https://1.1.1.1/dns/
