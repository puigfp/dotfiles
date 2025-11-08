// ==UserScript==
// @name         Login to Metabase
// @namespace    https://metabase-analytics.*
// @version      2025-10-31
// @description  Automatically clicks the "Sign in with Google" button on the Metabase login page.
// @author       syed.ashrafulla@datadoghq.com
// @include      /^https:\/\/metabase-analytics\..*\..*\.dog\//
// @grant        none
// ==/UserScript==

const interval = setInterval(() => {
    let buttonTextSpan = Array.from(document.querySelectorAll('span'))
            .find(span => span.textContent.includes('Sign in with Google'));

    if (!buttonTextSpan) {
        return;
    }

    let clickableElement = buttonTextSpan.closest('[role="button"]') || buttonTextSpan.closest('div');
    if (clickableElement) {
        clickableElement.click();
        clearInterval(interval);
    }
}, 1000);
