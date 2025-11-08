// ==UserScript==
// @name         Docker auto-close
// @namespace    https://hub.docker.com/
// @version      0.2
// @description  Closes the Docker login tab after its been opened
// @author       Eric Mountain
// @match        https://hub.docker.com/auth/desktop/redirect*
// @grant        window.close
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(window.close, 2000);
  })();