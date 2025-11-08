// ==UserScript==
// @name         Atlassian Auto-Approve MCP Server Access
// @namespace    https://mcp.atlassian.com/
// @version      1.0
// @description  Automatically clicks the "Approve" button on Atlassian MCP server authorization pages.
// @author       syed.ashrafulla@datadoghq.com
// @match        https://mcp.atlassian.com/v1/authorize*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function clickApproveButton() {
        const button = document.querySelector('button.button-submit');
        if (button && button.textContent.trim() === 'Approve' && !button.disabled) {
            try {
                button.click();
                return true;
            } catch (error) {
                console.error('Error clicking the button:', error);
                return false;
            }
        }
        return false;
    }
    const observer = new MutationObserver((mutations, obs) => {
        if (clickApproveButton()) {
            obs.disconnect();
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    if (clickApproveButton()) {
        observer.disconnect();
    }
})();
