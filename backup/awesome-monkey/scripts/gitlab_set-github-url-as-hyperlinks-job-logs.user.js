// ==UserScript==
// @name         URL as real links in gitlab logs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       nschweitzer
// @match        https://gitlab.ddbuild.io/DataDog/*/-/jobs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitlab.com
// @grant        none
// ==/UserScript==

(function applyChanges () {
    'use strict';
    function changeURL() {
        // Select all elements with the class "js-log-line job-log-line"
        const logLines = document.querySelectorAll('.js-log-line.job-log-line');
        const branch = document.querySelector('[data-testid="source-ref-link"]');
        const repo = document.querySelector('[class="gl-display-inline-flex!"]');

        // Regular expression pattern to match the desired string
        const regex = new RegExp(String.raw`\/go\/src\/github\.com\/DataDog\/${repo.textContent}\/([^ ]*\.\w+):?(\d+)?`, "g");

        logLines.forEach(logLine => {
            const spanElement = logLine.querySelector('span.gl-white-space-pre-wrap');
            if (spanElement && regex.test(spanElement.textContent)) {
                // Replace the matched pattern with the desired HTML anchor element
                spanElement.innerHTML = spanElement.textContent.replace(regex, (match, path, num) => {
                    const urlNum = num ? `#L${num}` : '';
                    const displayNum = num ? `:${num}` : '';
                    return `<a href="https://github.com/DataDog/${repo.textContent}/blob/${branch.textContent}/${path}${urlNum}">/go/src/github.com/DataDog/${repo.textContent}/${path}${displayNum}</a>`;
                });
            }
        });

    }
    const jobLog = document.querySelector(".job-log");
    if (jobLog) {
        new MutationObserver(() => {
            console.log("call me");
            changeURL();
        }).observe(document.querySelector(".job-log"), {
            childList: true,
        });
    } else {
        setTimeout(applyChanges, 100);
    }

})();
