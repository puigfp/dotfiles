// ==UserScript==
// @name         SSO to Vault Every 👏 Damn 👏 Time 👏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  SSO to Vault Every 👏 Damn 👏 Time 👏
// @author       Yohann Jardin <yohann.jardin@datadoghq.com>
// @include      /^https:\/\/vault\..*\.dog\/.*/
// @icon         https://www.datocms-assets.com/2885/1676497447-vault-favicon-color.png?h=128&w=128
// @grant        none
// ==/UserScript==

const reauthLink = function() {
    const links = document.querySelectorAll('a');
    return Array.from(links).find(link => link.innerText == 'Reauthenticate');
}

const authButton = function() {
    const button = document.querySelector("button[id='auth-submit']");
    if (button && button.textContent.includes('Sign in with Google')) {
        return button;
    }
}

const interval = setInterval(() => {
    const button = reauthLink() || authButton();

    if (button) {
        button.click();
        clearInterval(interval);
    }
}, 1000);
