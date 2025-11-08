// ==UserScript==
// @name         Slack sign-in and link opened auto-close
// @namespace    https://dd.slack.com
// @version      0.3
// @description  Closes slack callback tabs
// @author       Denis Rampnoux <denis.rampnoux@datadoghq.com>
// @author       Eric Mountain <eric.mountain@datadoghq.com>
// @match        https://dd.slack.com/ssb/signin_redirect*
// @match        https://dd.slack.com/account/profile
// @match        https://dd.slack.com/archives/*
// @match        https://*.slack.com/ssb/signin_redirect*
// @match        https://*.slack.com/archives/*
// @match        https://dd.enterprise.slack.com/?redir=*
// @icon         https://www.google.com/s2/favicons?sz=128&domain=slack.com
// @grant        window.close
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(window.close, 3000);
  })();
