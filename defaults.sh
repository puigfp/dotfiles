#! /bin/bash -euxo pipefail

# heavily inspired from https://github.com/mathiasbynens/dotfiles/blob/main/.macos

# Close any open System Preferences panes, to prevent them from overriding
# settings we’re about to change
osascript -e 'tell application "System Preferences" to quit'

# Ask for the administrator password upfront
sudo -v

# Keep-alive: update existing `sudo` time stamp until script has finished
while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &

# Disable "close windows when quitting an app"
# See iTerm2's documentation: https://iterm2.com/documentation-restoration.html
defaults write NSGlobalDomain NSQuitAlwaysKeepsWindows -bool true

# Do not re-arrange spaces based on most recent use
defaults write com.apple.dock mru-spaces -bool false

# Disable sound effects
defaults write com.apple.systemsound com.apple.sound.uiaudio.enabled -bool false

# Expand save panel by default
defaults write NSGlobalDomain NSNavPanelExpandedStateForSaveMode -bool true
defaults write NSGlobalDomain NSNavPanelExpandedStateForSaveMode2 -bool true

# Expand print panel by default
defaults write NSGlobalDomain PMPrintingExpandedStateForPrint -bool true
defaults write NSGlobalDomain PMPrintingExpandedStateForPrint2 -bool true

# Fix font rendering
# See https://ahmadawais.com/fix-macos-mojave-font-rendering-issue/
defaults write -g CGFontRenderingFontSmoothingDisabled -bool false

# ----------
# Appearance
# ----------

# Set appearance to "Dark"
defaults write "Apple Global Domain" "AppleInterfaceStyle" "Dark"

# Set highlight color to "Purple"
defaults write NSGlobalDomain AppleHighlightColor -string "0.968627 0.831373 1.000000"

# Set wallpaper
osascript -e "
tell application \"System Events\"
	tell every desktop
		set picture to \"$(pwd)/wallpaper.png\"
	end tell
end tell
"

# ----
# Dock
# ----

# Show doc on left side of screen
defaults write com.apple.dock orientation -string left

# Disable dock icon magnification
defaults write com.apple.dock magnification -bool false

# Minimize windows using "Scale effect"
defaults write com.apple.dock mineffect -string scale

# Minimize windows into application icons
defaults write com.apple.dock minimize-to-application -bool true

# Do not show recent applications in dock
defaults write com.apple.dock show-recents -bool false

# ------
# Finder
# ------

# Do not show desktop icons
defaults write com.apple.finder CreateDesktop -bool false

# Show hidden files
defaults write com.apple.finder AppleShowAllFiles -bool true

# Show filename extensions
defaults write NSGlobalDomain AppleShowAllExtensions -bool false

# Show path bar
defaults write com.apple.finder ShowPathbar -bool true

# ------------
# Localization
# ------------

# Set language and text formats
defaults write NSGlobalDomain AppleLanguages -array "en" "fr"
defaults write NSGlobalDomain AppleLocale -string "en_FR@currency=EUR"
defaults write NSGlobalDomain AppleMetricUnits -bool true
defaults write NSGlobalDomain AppleMeasurementUnits -string "Centimeters"
defaults write AppleTemperatureUnit -string "Celsius"

# Set keyboard layout to US International
defaults write com.apple.HIToolbox AppleEnabledInputSources -array \
	'{
		InputSourceKind = "Keyboard Layout";
		"KeyboardLayout ID" = 15000;
		"KeyboardLayout Name" = "USInternational-PC";
	}'

# --------
# Touchpad
# --------

# Enable tap to click
# See https://osxdaily.com/2014/01/31/turn-on-mac-touch-to-click-command-line/
defaults write com.apple.AppleMultitouchTrackpad Clicking -bool true
defaults write com.apple.driver.AppleBluetoothMultitouch.trackpad Clicking -bool true
defaults -currentHost write NSGlobalDomain com.apple.mouse.tapBehavior -int 1
defaults write NSGlobalDomain com.apple.mouse.tapBehavior -int 1

# --------
# Menu Bar
# --------

# Enable relevant menu-bar icons
# (some system menu-bar icons are provided by iStat Menus)
defaults write com.apple.systemuiserver menuExtras -array \
    "/System/Library/CoreServices/Menu Extras/AirPort.menu" \
    "/System/Library/CoreServices/Menu Extras/Bluetooth.menu" \
    "/System/Library/CoreServices/Menu Extras/Volume.menu"

# -------------
# Google Chrome
# -------------

# Use the system-native print preview dialog
defaults write com.google.Chrome DisablePrintPreview -bool true

# Expand the print dialog by default
defaults write com.google.Chrome PMPrintingExpandedStateForPrint2 -bool true

# ---------------------
# Restart affected apps
# ---------------------
for app in "cfprefsd" \
	"Dock" \
	"Finder" \
	"Google Chrome" \
	"PowerChime" \
	"SystemUIServer"; do
	killall "${app}" &> /dev/null
done
echo "Done. Note that some of these changes require a logout/restart to take effect."

