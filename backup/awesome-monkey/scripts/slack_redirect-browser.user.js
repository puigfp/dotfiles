// ==UserScript==
// @name         Slack Redirect To Browser
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Clicks the open this link in your browser
// @author       drew.csillag@datadoghq.com
// @match        https://dd.slack.com/archives/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const r = document.getElementsByClassName('p-ssb_redirect__loading_messages');
    if (r.length == 0) {
        return;
    }
    const m = r[0];
    const t = m.getElementsByTagName('a');
    if (t.length < 2) {
        return;
    }
    const l = t[1].href;
    document.location.href = l;

})();