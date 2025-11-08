// ==UserScript==
// @name         Highlight staging websites
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a repeating "staging" watermark to the background on staging sites
// @author       aaron.lunansky@datadoghq.com
// @match        *://*.staging.dog/*
// @match        *://ddstaging.datadoghq.com/*
// @match        *://*.datad0g.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
            <text x="0" y="100" font-size="32" font-family="Arial" fill="rgba(255, 182, 193, 0.22)" transform="rotate(-30 100 100)">
                STAGING
            </text>
        </svg>`;

    const encodedSvg = encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22");
    const dataUri = `url("data:image/svg+xml,${encodedSvg}")`;

    const style = document.createElement("style");
    style.textContent = `
        html, body {
            background-color: white !important;
            background-image: ${dataUri};
            background-repeat: repeat;
            background-size: 200px 200px;
        }
    `;
    document.head.appendChild(style);
})();
