// ==UserScript==
// @name         PagerDuty - autologin
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  auto-click single sign on button
// @author       Anatole Beuzon (anatole.beuzon@datadoghq.com)
// @author       Tim Visher (tim.visher@datadoghq.com)
// @match        https://identity.pagerduty.com/global/authn/authentication/PagerDutyGlobalLogin/subdomain
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pagerduty.com
// ==/UserScript==

(function() {
    'use strict';

    var clicked = false;

    setInterval(
        () => {
            const button = document.querySelector("#sso_submit");
            if (button && ! clicked) {
                button.click();
                clicked = true;
            }
        },
        100
    );
})();