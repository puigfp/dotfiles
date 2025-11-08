// ==UserScript==
// @name         GitHub - generate review request
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Generate a review request and copy to clipboard
// @author       António Ramadas
// @match        https://github.com/DataDog/*/pull/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        // Key code 71 is 'g'
        // On mac this is: ctrl + option + g
        if (event.ctrlKey && event.altKey && event.keyCode === 71) {
            const url = window.location.href;
            let title = document.title;
            title = title.substring(0, title.lastIndexOf(' by '));

            GM_setClipboard(':pr: ' + title + '\n' + url);
        }
    });
})();
