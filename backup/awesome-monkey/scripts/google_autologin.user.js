// ==UserScript==
// @name         Google Auth Challenge 'Next' clicker
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Clicks the next and continue buttons when initiating the Google auth flow
// @author       tim.visher@datadoghq.com
// @author       mat.brown@datadoghq.com
// @match        https://accounts.google.com/v3/signin/confirmidentifier?authuser=*
// @match        https://accounts.google.com/v3/signin/confirmidentifier?dsh=*
// @match        https://accounts.google.com/signin/oauth/id?authuser*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    onUrlChange();

    if (self.navigation) {
        navigation.addEventListener('navigatesuccess', onUrlChange);
    } else {
        let u = location.href;
        new MutationObserver(() => u !== (u = location.href) && onUrlChange())
            .observe(document, {subtree: true, childList: true});
    }

    function onUrlChange() {
        // PassKey prompt
        if (location.pathname.startsWith('/v3/signin/challenge/pk/presend')) {
            const interval = setInterval(() => {
                const continueButton = Array.from(document.querySelectorAll("button"))
                    .filter((x) => x.innerText === "Continue")[0];
                if (continueButton != null) {
                    continueButton.click();
                    clearInterval(interval);
                }
            }, 100);
        // Password prompt
        } else if (location.pathname.startsWith('/v3/signin/confirmidentifier')) {
            Array.from(document.querySelectorAll('button')).filter(x => x.innerText == 'Next')[0].click();
        }
    }
})();
