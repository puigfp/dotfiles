// ==UserScript==
// @name         Open GitHub Job in New Tab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Open GitHub job links in a new tab automatically
// @author       brice.parent@datadoghq.com
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function modifyLinks() {
        const links = document.querySelectorAll('a[href*="/job"], a[href*="/build"]');
        links.forEach(link => {
            link.target = '_blank'; // Sets the link to open in a new tab
        });
    }

    modifyLinks();

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                modifyLinks(); // Re-apply the function if new nodes are added
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
