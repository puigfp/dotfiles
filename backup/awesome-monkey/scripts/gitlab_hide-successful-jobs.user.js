// ==UserScript==
// @name         Gitlab hide succesful jobs
// @namespace    https://gitlab.ddbuild.io/
// @version      0.1
// @description  try to take over the world!
// @author       nplanel
// @match        https://gitlab.ddbuild.io/DataDog/datadog-agent/-/pipelines/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitlab.com
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';
    console.log("gitlab hide succesful jobs 1");

    window.addEventListener('load', function() {

        setTimeout(function() {
            console.log("gitlab hide succesful jobs");

            var jobs = document.getElementsByClassName("gl-pipeline-job-width")
            for(let i=0;i<jobs.length;i++) {
                var j = jobs[i];
                if (j.getElementsByClassName("job-success").length > 0) {
                    if (j.id.includes("system_probe") == false) {
                        jobs[i].hidden = true;
                        //console.log("hide "+jobs[i].id);
                    }
                }
            }
        }, 4000);

    }, false);
})();