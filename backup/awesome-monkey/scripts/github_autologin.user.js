// ==UserScript==
// @name         Click GitHub Single sign-on every 👏 damn 👏 time 👏
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Click GitHub Single sign-on every 👏 damn 👏 time 👏
// @author       tim.visher@datadoghq.com
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const interval = setInterval(
        () => {
            const x = Array.from(document.querySelectorAll('p.note')).filter(x => x.innerText.includes("Datadog, Inc."));
            const y = Array.from(document.querySelectorAll('div.business-sso'));
            const z = Array.from(document.querySelectorAll('section[aria-label="Single sign on information"] a'));

            if (0 < x.length) {
                x[0].querySelector('a').click();
                clearInterval(interval);
                return;
            }

            if (0 < y.length) {
                y[0].querySelector('button').click();
                clearInterval(interval);
                return;
            }

            if (0 < z.length) {
                z[0].click();
                clearInterval(interval);
                return;
            }
        },
        100
    )
})();