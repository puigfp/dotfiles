// ==UserScript==
// @name         Figma autofill
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  autofill figma email login field
// @author       Giuseppe Bandiera
// @match        https://www.figma.com/email_only
// @icon         https://www.google.com/s2/favicons?sz=64&domain=figma.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const userName = "firstname.lastname";
    let submitted = false;
    let filled = false;

    setTimeout(
        () => {
            const input = document.querySelector('input#email');
            if (input && !filled) {
                input.value = `${userName}@datadoghq.com`;
                filled = true;
            }

            const submitButton = document.querySelector('button[type="submit"]');
            if (submitButton && filled && !submitted) {
                submitButton.click();
                submitted = true
            }
        },
        100
    );
})();