// ==UserScript==
// @name         Snowflake SSO auto-close
// @namespace    http://localhost
// @version      0.1
// @description  Closes Snowflake callback tabs
// @author       Yohann Jardin <yohann.jardin@datadoghq.com>
// @match        http://localhost/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=snowflakecomputing.com
// @grant        window.close
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        const regex = /^Your identity was confirmed and propagated to Snowflake .+?\. You can close this window now and go back where you started from\.$/;
        if (regex.test(document.documentElement.innerText.trim())) {
            window.close();
        }
    }, 1000);
})();
