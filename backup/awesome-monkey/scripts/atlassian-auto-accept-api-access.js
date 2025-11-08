// ==UserScript==
// @name         Atlassian Auto-Accept API Access
// @namespace    https://api.atlassian.com/
// @version      1.0
// @description  Automatically clicks the "Accept" button on Atlassian consent pages.
// @author       syed.ashrafulla@datadoghq.com
// @match        https://api.atlassian.com/oauth2/authorize/server/consent*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function clickAcceptButton() {
        const buttons = document.querySelectorAll('button');
        for (const button of buttons) {
            if (button.textContent.trim() === 'Accept' && !button.disabled) {
                button.click();
            }
        }
        return false;
    }
    const observer = new MutationObserver((mutations, obs) => {
        if (clickAcceptButton()) {
            obs.disconnect();
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
