// ==UserScript==
// @name         Click Google Workspace Account 'FILL_THIS_IN@datadoghq.com' every 👏 damn 👏 time 👏
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Click Google Workspace Account 'FILL_THIS_IN@datadoghq.com' every 👏 damn 👏 time 👏
// @author       Tim Visher <tim.visher@datadoghq.com>
// @author       Pierre Gimalac <pierre.gimalac@datadoghq.com>
// @match        https://accounts.google.com/o/oauth2/*
// @match        https://accounts.google.com/InteractiveLogin*
// @match        https://accounts.google.com/AccountChooser*
// @match        https://accounts.google.com/v3/signin/accountchooser*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var clicked = false;
    const userName = "FILL_THIS_IN"

    setTimeout(
        () => {
            const email = document.querySelector(`div[data-email="${userName}@datadoghq.com"][role=link]`);
            if (email && ! clicked) {
                email.click();
                clicked = true;
            }

            const opEmail = document.querySelector(`div[data-op-email="${userName}@datadoghq.com"][role=link]`);
            if (opEmail && ! clicked) {
                opEmail.click();
                clicked = true;
            }

            const identifier = document.querySelector(`div[data-identifier="${userName}@datadoghq.com"][role=link]`);
            if (identifier && ! clicked) {
                identifier.click();
                clicked = true
            }
        },
        100
    );
})();
