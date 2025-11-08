// ==UserScript==
// @name         StackOverflow - Autologin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto-click single sign on button
// @author       Hadrien Patte
// @match        https://datadog.stackenterprise.co/users/login
// @grant        none
// ==/UserScript==

const id = setInterval(() => {
    try {
      Array.from(document.querySelectorAll('a[href^="/users/samlstart"]')).click();
      clearInterval(id);
    } catch (e) {}
  }, 100)