// ==UserScript==
// @name         SSO to Datadog Every 👏 Damn 👏 Time 👏
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  SSO to Datadog Every 👏 Damn 👏 Time 👏
// @author       Tim Visher (tim.visher@datadoghq.com)
// @match        https://*.datadoghq.com/account/login*
// @match        https://dd.datad0g.com/account/login*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=datadoghq.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const interval = setInterval(
        () => {
            const x = document.querySelector("button[title='Sign in with Google']");

            if (x) {
                x.click();
                clearInterval(interval);
            }
        },
        1000
    );
})();
