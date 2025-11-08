// ==UserScript==
// @name         [Gitlab] Update title on the "all" pipelines view
// @namespace    http://tampermonkey.net/
// @version      2024-11-22
// @description  try to take over the world!
// @author       You
// @match        https://gitlab.ddbuild.io/DataDog/datadog-agent/-/pipelines*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitlab.com
// @grant        none
// ==/UserScript==

(function updateWindowTitle() {
    'use strict';
    function updateURL() {
        const regex = /^https:\/\/gitlab.ddbuild.io\/DataDog\/datadog-agent\/-\/pipelines\?(page=[0-9]+&scope=all&)?ref=(.*)$/;
        const URL = document.URL;
        if (regex.test(URL)) {
            const match = regex.exec(URL);
            document.title = "Pipeline - " + decodeURIComponent(match[match.length - 1]);
        }
    }
    setTimeout(updateURL, 200);
    window.navigation.addEventListener("navigate", (event) => {
        setTimeout(updateURL, 200);
    });
})();
