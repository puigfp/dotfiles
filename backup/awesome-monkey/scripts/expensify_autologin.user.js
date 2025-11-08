// ==UserScript==
// @name         Expensify - Autologin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto-click single sign on button
// @icon         https://d2k5nsl2zxldvw.cloudfront.net/images/expensify__favicon.png
// @author       Hadrien Patte
// @match        https://www.expensify.com/?*email=*%40datadoghq.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (document.querySelector('div#signin-flow')) {
        document.querySelector('button#js_click_submitLogin').click();
    }
})();