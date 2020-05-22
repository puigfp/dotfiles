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

- Desktop & Screen Saver
  - Desktop: RGB color -> (20, 0, 30)
  - Screen Saver:
    - Start after -> Never
- General
  - Appearance: dark
  - Accent color: purple
  - Hightlight color: graphite
  - Close windows when quitting an app: false (see [iterm2 doc](https://iterm2.com/documentation-restoration.html))
- Displays
  - Scale -> More Space
- Dock
  - Minimize windows using -> Scale effect
  - Minimize windows into application icon -> Enable
  - Show recent applications in dock -> Disable
  - Position on Screen -> Left
- Keyboard
  - Turn keyboard backlight off after 5 seconds of inactivity
  - Customize Touch Bar -> Brightness Slider, Play/Pause, Volume Slider, Mute
- Bluetooth
  - Show Bluetooth in menu bar -> Enable
- Sound
  - Sound Effects
    - Play user interface sound effects -> Disable
    - Show volume in menu bar -> Enable
- Language & Region
  - Region -> France
- Users & Groups
  - Update user picture
- Touchpad
  - Tap to click -> Enable
- Mission Control
  - Automatically rearange Spaces based on most recent use -> Disable
- Accessibility
  - Pointer Control
    - Ignore built-in trackpad ... -> Enable
- Via CLI
  - Hide desktop icons `defaults write com.apple.finder CreateDesktop false` (requires a `killall Finder` to be effective)
  - Fix font rendering ([blog post](https://ahmadawais.com/fix-macos-mojave-font-rendering-issue/)): `defaults write -g CGFontRenderingFontSmoothingDisabled -bool FALSE` (requires a logout to be effective)

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
