// ==UserScript==
// @name         Always Select Datadog HQ On Org Switcher
// @namespace    https://app.datadoghq.com/
// @version      2025-09-24
// @description  When doing org switching for API access, always select Datadog HQ.
// @author       syed.ashrafulla@datadoghq.com
// @match        https://app.datadoghq.com/account/org_switcher*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=datadoghq.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var checkOrgSwitcher;
    function clickDatadogHQ() {
        const orgSpan = Array.from(document.querySelectorAll('span')).find(el => el.textContent.trim() === 'Datadog HQ');
        if (!orgSpan) {
            return;
        }
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        orgSpan.parentElement.dispatchEvent(clickEvent);
        clearInterval(checkOrgSwitcher);
    }
    window.onload = function() {
        checkOrgSwitcher = setInterval(clickDatadogHQ, 1000);
    };
})();
