// ==UserScript==
// @name         Azure CLI login
// @namespace    http://localhost:*/?code=
// @version      0.2
// @description  Closes Azure CLI login tab after its been opened
// @author       Eric Mountain
// @match        http://localhost:*/?code=*
// @grant        window.close
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(window.close, 1500);
  })();