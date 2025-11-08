// ==UserScript==
// @name         Temporal - Do not open links in new tab
// @namespace    Violentmonkey Scripts
// @match        https://atlas.ddbuild.io/namespaces/default/workflows/*
// @grant        none
// @version      1.0
// @author       Ayaz Badouraly
// @description  Reuse the current tab to open links to parent or child workflows in temporal
// @icon         https://www.google.com/s2/favicons?sz=64&domain=temporal.io
// ==/UserScript==

(function() {
    'use strict';
  
    // Only run this code after some delay because why not https://stackoverflow.com/a/66194047
    // And run it multiple times because temporal will override href tags as it lazy loads links in the relationships section
    for (let i = 0; i < 20; i++) {
      setTimeout(function() {
        for (const a of document.getElementsByTagName('a')) {
          a.removeAttribute('target');
        }
      }, 500*i);
    }
  })();