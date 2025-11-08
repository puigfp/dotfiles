// ==UserScript==
// @name         Disable Jira Click Edit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disable click edit in Jira issue descriptions
// @author       fanuch
// @match        https://*.atlassian.net/browse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addCustomEventListener(selector, event, handler) {
        document.querySelector('body').addEventListener(event, (e) => {
            let targetElement = e.target;
            while (targetElement != null) {
                if (targetElement.matches(selector)) return handler(e);
                targetElement = targetElement.parentElement;
            }
        }, true);
    }

    addCustomEventListener('.ak-renderer-document', 'click', (e) => {
        e.stopPropagation();
        console.log('Blocked click-edit of Jira issue description. You\'re welcome.');
    });
})();