// ==UserScript==
// @name         Temporal autologin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Clicks the login button for temporal UI instances.
// @author       klara.weidemann@datadoghq.com
// @match        https://temporal-staging.ddbuild.io/login?*
// @match        https://temporal.ddbuild.io/login?*
// @match        https://atlas.ddbuild.io/login?*
// @match        https://temporal.us1.ddbuild.io/login?*
// @include      /^https:\/\/temporal\.[a-z]{2}\d(?:\-build)?\.(?:staging|prod|fed|staging-fed)\.dog.*$/
// @run-at       document-start
// @icon         https://temporal.ddbuild.io/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function check(changes, observer) {
        const b = document.querySelector('[data-testid="login-button"]')
        if (b) {
            observer.disconnect();
            b.click();
        }
    }

    new MutationObserver(check).observe(document, {childList: true, subtree: true})
})();
