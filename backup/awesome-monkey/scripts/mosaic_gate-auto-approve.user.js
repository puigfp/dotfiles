// ==UserScript==
// @name         Auto-Approve Deploy Gates
// @namespace    http://tampermonkey.net/
// @version      2025-10-06
// @description  Auto-approve monitor and sleep gates; only activated by adding caution_fastDeploy=true to url params and opening 'Prompts' tab
// @author       Paul Bauer
// @match        https://mosaic.static-app.us1.ddbuild.io/services/details*
// @icon         https://mosaic.static-app.us1.ddbuild.io/v/35.78241619/static/favicon.svg
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function checkForGatePassPrompt() {
        const params = new URLSearchParams(location.search);
        if (params.get('deployTab') === 'prompts' &&
            params.get('caution_fastDeploy') === 'true'
           ) {
            // Only auto-clicks monitor and sleep gates
            // Other prompts e.g. forcing k8s chart changes are still manual
            const buttons = document.querySelectorAll("button[aria-label='Pass the Gate Now'],button[aria-label='Continue']");
            if (buttons.length > 0) {
                console.log(`Found ${buttons.length} gate passing button(s), clicking.`);
                buttons.forEach(button => button.click());
            }
        }
    }

    // run anytime the url changes
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        checkForGatePassPrompt();
    };

    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        checkForGatePassPrompt();
    };

    window.addEventListener('popstate', checkForGatePassPrompt);
    window.addEventListener('hashchange', checkForGatePassPrompt);

    // leave the tab open and let the automation do its thing
    setInterval(checkForGatePassPrompt, 5000);

    checkForGatePassPrompt();
})();
