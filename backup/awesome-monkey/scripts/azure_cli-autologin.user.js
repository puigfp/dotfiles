// ==UserScript==
// @name         Azure CLI - Autologin
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  auto-click single sign on button
// @author       Hadrien Patte <hadrien.patte@datadoghq.com>
// @author       Tim Visher <tim.visher@datadoghq.com>
// @match        https://login.microsoftonline.com/*/oauth2/v2.0/authorize*
// @grant        none
// @downloadURL  https://github.com/DataDog/awesome-monkey/raw/refs/heads/main/scripts/azure_cli-autologin.user.js
// ==/UserScript==

(() => {
  'use strict';

  console.log("Installing interval for attempting to login for the Azure CLI");

  const tenantIds = {
    'ddstaging': 'cc0b82f3-7c2e-400b-aec3-40a3d720505b',
    'datadoghq': 'ecc2b97b-844b-414e-8123-b925dddf87ed',
    'devdatadoghq': '4d3bac44-0230-4732-9e70-cc00736f0a97'
  }

  const intervalId = setInterval(() => {
    console.log("Trying to login for the Azure CLI");

    let accountDomainToClick;

    if (document.location.pathname.startsWith(`/${tenantIds.ddstaging}`) || document.location.pathname.startsWith(`/${tenantIds.datadoghq}`)) {
      accountDomainToClick = 'datadoghq';
    } else if (document.location.pathname.startsWith(`/${tenantIds.devdatadoghq}`)) {
      accountDomainToClick = 'devdatadoghq.onmicrosoft';
    } else {
      console.log(`Can't infer accountDomainToClick based on pathname ${document.location.pathname}`);
      clearInterval(intervalId);
      return;
    }

    console.log(`accountDomainToClick: ${accountDomainToClick}`);

    Array.from(document.querySelectorAll('.table-cell')).filter(x => x.innerText.includes(`@${accountDomainToClick}.com`))[0].click();

    clearInterval(intervalId);
  },
                                 100);
})();
