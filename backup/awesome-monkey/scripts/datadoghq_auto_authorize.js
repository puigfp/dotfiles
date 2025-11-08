// ==UserScript==
// @name         Click Authorize for Datadog HQ
// @namespace    https://datadoghq.com/
// @version      2025-10-14
// @description  Auto-authorizes requesting clients to access Datadog HQ (either via OAuth or for MCP).
// @author       syed.ashrafulla@datadoghq.com
// @match        https://app.datadoghq.com/oauth2/v1/authorize*
// @match        https://mcp.datadoghq.com/api/unstable/mcp-server/consent*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=datadoghq.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function clickAuthorizeButton() {
        const authorizeButton = document.querySelector('button[type="submit"]');
        if (authorizeButton) {
            authorizeButton.click();
        } else {
            setTimeout(clickAuthorizeButton, 1000);
        }
    }
    window.onload = function() {
        clickAuthorizeButton();
    };
})();
