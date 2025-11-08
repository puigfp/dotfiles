// ==UserScript==
// @name         GCP autoclose
// @namespace    http://localhost:*/?code=
// @version      0.2
// @description  Closes GCP CLI login tab after its been opened
// @author       Eric Mountain
// @match        https://cloud.google.com/sdk/auth_success
// @grant        window.close
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(window.close, 1500);
  })();