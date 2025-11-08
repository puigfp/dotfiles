// ==UserScript==
// @name         gitlab title and jump to pipeline
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       nplanel
// @match        https://gitlab.ddbuild.io/DataDog/datadog-agent/-/pipelines/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitlab.com
// @grant        none
// ==/UserScript==

// Features :
// o Change the gitlab pipeline window title with the branch name (useful when you go down the page and have all the jobs)
// o If you click on the branch link it will jump to the pipeline list for this branch instead the gitlab source code view
// o If you click on the copyright © link added below the branch it will copy the branch name.

(function updatePipelineHeader() {
    'use strict';
    const header = document.querySelector("#content-body > div.js-pipeline-container > div.gl-my-4 > div > div:nth-child(1) > div.gl-mb-3");
    if (header) {
        // Change the window title
        const branch = header.querySelector('a');
        document.title = "Pipeline - " + branch.textContent;
        // Update the branch link to point to the pipeline list
        branch.href = "https://gitlab.ddbuild.io/DataDog/datadog-agent/-/pipelines?page=1&scope=all&ref=" + branch.textContent;

        // Add a new element to copy the branch name
        const container = document.querySelector("#content-body > div.js-pipeline-container > div.gl-my-4 > div > div:nth-child(1) > div:nth-child(4)");
        let copy = document.createElement("a");
        copy.setAttribute("class", "gl-icon gl-ml-2");
        copy.textContent = "©";
        copy.onclick=function pbcopy() { navigator.clipboard.writeText(branch.textContent); };
        container.appendChild(copy);
    } else {
        setTimeout(updatePipelineHeader, 500);
    }
})();
