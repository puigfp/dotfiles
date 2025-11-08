// ==UserScript==
// @name         Zoom auto-close
// @namespace    https://datadog.zoom.com/
// @version      0.2
// @description  Closes the zoom callback tab 3 seconds after its been opened
// @icon         https://st1.zoom.us/zoom.ico
// @author       Mathieu Rousse <mathieu@rousse.me>
// @match        https://*.zoom.us/j/*
// @match        https://*.zoom.us/s/*
// @grant        window.close
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(window.close, 3000);
  })();
