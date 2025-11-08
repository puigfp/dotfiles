// ==UserScript==
// @name         Vault auto-close
// @namespace    https://datadog.zoom.com/
// @version      0.2
// @description  Closes the vault callback tab 1 second after its been opened
// @icon         https://www.datocms-assets.com/2885/1676497447-vault-favicon-color.png?h=128&w=128
// @author       Mathieu Rousse <mathieu@rousse.me>
// @match        http://127.0.0.1:29001/saml
// @match        http://127.0.0.1:2622/
// @match        http://localhost:8250/oidc/callback*
// @match        http://localhost:8251/oidc/callback*
// @match        http://localhost:8252/oidc/callback*
// @match        http://localhost:8253/oidc/callback*
// @match        http://localhost:8254/oidc/callback*
// @match        http://localhost:8255/oidc/callback*
// @match        http://localhost:8256/oidc/callback*
// @match        http://localhost:8257/oidc/callback*
// @match        http://localhost:8258/oidc/callback*
// @match        http://localhost:8259/oidc/callback*
// @grant        window.close
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(window.close, 1000);
  })();