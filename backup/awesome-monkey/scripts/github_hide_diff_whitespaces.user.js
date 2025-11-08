// ==UserScript==
// @name         Hide whitespaces by default
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide whitespaces by default
// @author       michel.daviot@datadoghq.com
// @author       mat.brown@datadoghq.com
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  let currentPage;

  // listen for url changes from the initial github load, otherwise this is not triggered when clicking on "files changed" tab from the PR
  setInterval(() => {
    if (currentPage !== location.href) {
      currentPage = location.href;
      const url = new URL(currentPage);
      if (url.pathname.match(/^\/[^/]+\/[^/]+\/pull\/\d+\/(commits|files)/)) {
        if (!url.searchParams.has("w")) {
          // allow user to force with w=0
          url.searchParams.set("w", "1");
          console.log("Updating URL to remove whitespace");
          window.location.replace(url.toString());
        }
      }
    }
  }, 100);
})();
