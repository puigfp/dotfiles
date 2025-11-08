// ==UserScript==
// @name         GitLab Log Term Highlighter (Line-Level)
// @namespace    Violentmonkey Scripts
// @match        https://gitlab.ddbuild.io/*/-/jobs/*
// @grant        none
// @run-at       document-idle
// @version      3.0
// @description  Highlights terms like 'fail' or 'error' within log lines
// ==/UserScript==

(function () {
    'use strict';

    const TERMS = [
        { keyword: 'fail', bg: '#ff0000', color: '#fff' },
        { keyword: 'error', bg: '#ffa500', color: '#000' },
        { keyword: 'nogo', bg: '#ffff00', color: '#000' }
    ];

    function highlightSpan(span) {
        if (span.dataset.highlighted) return;

        let html = span.innerHTML;
        let matched = false;

        TERMS.forEach(({ keyword, bg, color }) => {
            const re = new RegExp(`(${keyword})`, 'gi');
            if (re.test(html)) {
                html = html.replace(re, `<span style="background:${bg};color:${color};font-weight:bold;">$1</span>`);
                matched = true;
            }
        });

        if (matched) {
            span.innerHTML = html;
            span.dataset.highlighted = 'true';
        }
    }

    function highlightAll() {
        const spans = document.querySelectorAll('.xterm-rows span, .job-log-line span');
        spans.forEach(highlightSpan);
    }

    function waitForLog() {
        const container = document.querySelector('.xterm-rows, .job-log');
        if (!container) return setTimeout(waitForLog, 500);

        const observer = new MutationObserver(() => setTimeout(highlightAll, 100));
        observer.observe(container, { childList: true, subtree: true });

        highlightAll(); // initial
    }

    waitForLog();
})();
