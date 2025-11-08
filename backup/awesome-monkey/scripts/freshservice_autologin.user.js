// ==UserScript==
// @name         Freshservice - Autologin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto-click single sign on button
// @icon         https://assets.freshservice.com/fs-portal/fs-logo.svg
// @author       Hadrien Patte
// @match        https://datadog.myfreshworks.com/login*
// @grant        none
// ==/UserScript==

const id = setInterval(() => {
    try {
      Array.from(document.querySelectorAll('p')).find(el => el.textContent === 'Sign in with SSO').click();
      clearInterval(id);
    } catch (e) {}
  }, 100)