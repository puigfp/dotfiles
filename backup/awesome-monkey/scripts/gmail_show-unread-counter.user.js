// ==UserScript==
// @name         Show unread counter in Gmail Chrome App
// @namespace    mail.google.com
// @version      0.1
// @description  Show unread counter in Gmail Chrome App
// @author       klara.weidemann@datadoghq.com
// @match        https://mail.google.com/mail/u/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function getUnreadCount() {
        const text = document.querySelector(`a[href$='#inbox'][target='_top']`).getAttribute('aria-label');
        const match = text.match(/Inbox ([0-9]+) unread/);
        if (match) {
            return parseInt(match[1], 10);
        } else {
            return 0;
        }
    }

    async function updateBadgeIcon() {
        navigator.setAppBadge(getUnreadCount());
    }

    setInterval(updateBadgeIcon, 1000);
})();
