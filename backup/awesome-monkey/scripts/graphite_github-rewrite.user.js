// ==UserScript==
// @name         Graphite PR to GitHub Redirect (Immediate)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Instantly redirects any DataDog PR on Graphite to GitHub as soon as the URL matches
// @match        https://app.graphite.com/*
// @run-at       document-start
// @grant        none
// @author       Benjamin Liu <benjamin.liu@datadoghq.com>
// ==/UserScript==

(function () {
  'use strict';

  const redirectIfGraphitePR = (url) => {
      const match = url.match(/^https:\/\/app\.graphite\.com\/github\/pr\/DataDog\/([^/]+)\/(\d+)\//);
      if (match) {
          const [_, repo, pr] = match;
          window.location.replace(`https://github.com/DataDog/${repo}/pull/${pr}`);
      }
  };

  // Redirect immediately on initial load
  redirectIfGraphitePR(location.href);

  // Patch navigation methods for SPA updates
  const observeHistory = (method) => {
      const original = history[method];
      history[method] = function () {
          const result = original.apply(this, arguments);
          redirectIfGraphitePR(location.href);
          return result;
      };
  };

  observeHistory('pushState');
  observeHistory('replaceState');
  window.addEventListener('popstate', () => redirectIfGraphitePR(location.href));
})();
