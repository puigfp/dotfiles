// ==UserScript==
// @name         AWS SSO dismisser
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Clicks allow and closes AWS SSO pages after successful login
// @author       nlopez
// @author       timvisher
// @author       hadrienpatte
// @match        https://d-906757b57c.awsapps.com/*
// @match        https://d-90674ca049.awsapps.com/*
// @match        https://start.*.us-gov-home.awsapps.com/*
// @match        https://device.sso.*.amazonaws.com/*
// @match        http://127.0.0.1/?code=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aws.com
// @grant        window.close
// @run-at       document-idle
// ==/UserScript==
const id = setInterval(() => {
  try {
    if (/request approved/i.test(document.body.innerHTML)) { window.close(); };
    var cli_verification_btn = document.querySelector('button#cli_verification_btn');
    var cli_login_btn = document.querySelector('button#cli_login_button');
    var cli_allow_access = document.querySelector('button[data-testid="allow-access-button"]');
    if (cli_verification_btn) { cli_verification_btn.click(); }
    if (cli_login_btn) { cli_login_btn.click(); }
    if (cli_allow_access) { cli_allow_access.click(); }
  } catch (e) {}
}, 1000)
