// ==UserScript==
// @name        Prevent GitHub link unfurling
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*
// @grant       none
// @version     1.0
// @author      Mat Brown <mat.brown@datadoghq.com>
// @description Unfurled GitHub pull request links in Slack are annoying. This script appends an `/s` to the URL path, which prevents unfurling but is still a valid PR URL.
// @icon        https://www.google.com/s2/favicons?sz=64&domain=github.com
// @downloadURL https://github.com/DataDog/awesome-monkey/raw/refs/heads/main/scripts/github_prevent-unfurling.user.js
// ==/UserScript==

setInterval(() => {
    if (/^\/[-\w]+\/[-\w]+\/pull\/\d+$/.test(location.pathname)) {
        const url = new URL(window.location);
        url.pathname += "/s";
        history.replaceState(null, undefined, url.toString());
    }
}, 1000);
