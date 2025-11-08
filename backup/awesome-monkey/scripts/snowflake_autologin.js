// ==UserScript==
// @name         SSO to Snowflake Every 👏 Damn 👏 Time 👏
// @namespace    http://tampermonkey.net/
// @version      2025-11-03
// @description  SSO to Snowflake Every 👏 Damn 👏 Time 👏
// @author       Yohann Jardin <yohann.jardin@datadoghq.com>
// @match        https://sza96462.us-east-1.snowflakecomputing.com/oauth/authorize*
// @match        https://sza96462.us-east-1.snowflakecomputing.com/console/login*
// @match        https://oq96266.europe-west4.gcp.snowflakecomputing.com/oauth/authorize*
// @match        https://oq96266.europe-west4.gcp.snowflakecomputing.com/console/login*
// @match        https://xnb96993.us-east-1.snowflakecomputing.com/oauth/authorize*
// @match        https://xnb96993.us-east-1.snowflakecomputing.com/console/login*
// @match        https://nec88225.us-east-1.snowflakecomputing.com/oauth/authorize*
// @match        https://nec88225.us-east-1.snowflakecomputing.com/console/login*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=snowflakecomputing.com
// @grant        none
// ==/UserScript==

const authButton = function() {
    const buttons = document.getElementsByTagName("button");
    for (const button of buttons) {
        if (button.textContent == 'Sign in using Google SSO') {
            return button;
        }
    }
}

const interval = setInterval(() => {
    const button = authButton();

    if (button) {
        button.click();
        clearInterval(interval);
    }
}, 1000);
