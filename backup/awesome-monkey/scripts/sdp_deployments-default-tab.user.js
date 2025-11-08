// ==UserScript==
// @name         SDP default tab deployments
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Set the deployments tab as the default tab on SDP service pages
// @author       AI
// @match        https://sdp.ddbuild.io/*
// @match        https://sdp.us1.build-fed.dog/*
// @match        https://mosaic.us1.ddbuild.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addParameter() {
        const currentUrl = window.location.href;

        // Check the URL pattern and whether the parameter is present
        if (currentUrl.includes('services/details') && !currentUrl.includes('service_tab=allDeployments')) {
            // Force reload with the deployments tab parameter
            window.location.href = currentUrl + '&service_tab=allDeployments';
        }
    }

    // Initial check
    addParameter();

    // Set up a MutationObserver to detect changes in the URL
    const observer = new MutationObserver(addParameter);

    // Observe changes to the body element
    observer.observe(document.body, { childList: true, subtree: true });

    // Clean up observer when not needed anymore
    window.addEventListener('beforeunload', () => observer.disconnect());
})();
