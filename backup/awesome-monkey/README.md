# Awesome-Monkey

Collection of [Tampermonkey](https://www.tampermonkey.net/) | [Violentmonkey](https://violentmonkey.github.io/) scripts to make Datadog's life easier.


## Use

Please refer to this confluence page for more information about how to install the tools and scripts : https://datadoghq.atlassian.net/wiki/spaces/ENG/pages/3047490020/Tampermonkey+ViolentMonkey+GreaseMonkey+useful+scripts


## Contribution

### Step 1

* Add your script as a single file in `/scripts`.
* Please use the pattern `<website>_<short-description>.user.js`, and put details in `@description`.

### Step 2

Grab the raw URL and :
* Update the [confluence page](https://datadoghq.atlassian.net/wiki/spaces/ENG/pages/3047490020/Tampermonkey+ViolentMonkey+GreaseMonkey+useful+scripts) to add a new entry + link to your raw `.user.js` file
* Add the raw URL in `@downloadURL` header for auto-update ([more info](https://www.tampermonkey.net/documentation.php?locale=en#meta:downloadURL))


### If you are in a rush
Just add your script to the confluence page, we will tidy it up / park it later on.
