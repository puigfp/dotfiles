// ==UserScript==
// @name         Slack - Autologin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto-click single sign on button
// @author       Hadrien Patte
// @match        https://dd.enterprise.slack.com/?redir*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=slack.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (document.querySelector('body')) {
        document.querySelector('a#enterprise_member_guest_account_signin_link_SAML').click();
    }
})();