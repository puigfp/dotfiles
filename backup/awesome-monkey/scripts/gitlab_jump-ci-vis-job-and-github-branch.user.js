// ==UserScript==
// @name         Jump to CI Vis job
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change the gitlab job name to be a link to CI Visibility
// @author       Guy Bolton King
// @match        https://gitlab.ddbuild.io/DataDog/*/-/jobs/*
// @grant        none
// ==/UserScript==

(function createLinks () {
    // Get the requested containers
    const infoContainer = document.querySelector("#content-body .right-sidebar .blocks-container > div:nth-child(2)");
    const pipelinePathElement = document.querySelector('[data-testid="pipeline-path"]');
    const jobNameElement = document.querySelector('[data-testid="job-name"]');
    const branchElement = document.querySelector('[data-testid="source-ref-link"]');

    // Be sure the containers are loaded
    if (infoContainer && pipelinePathElement && jobNameElement && branchElement) {
        let content = infoContainer.innerHTML;
        if (content.length) {
            const pipelinePath = new URL(pipelinePathElement.href).pathname.split("/")

            const pipelineId = pipelinePath[pipelinePath.length - 1];
            const pipelineName = pipelinePath[1] + "/" + pipelinePath[2];
            const jobName = jobNameElement.textContent.trim();
            const jobPath = window.location.pathname.split("/")
            const jobId = jobPath[jobPath.length - 1]
            const gitBranch = branchElement.textContent.trim();

            const createLink = function(href, text) {
              const link = document.createElement("p")
              link.setAttribute("class", "build-detail-row");
              link.innerHTML = `<span class="font-weight-bold"><a href="${href}">${text}</a></span>`;
              infoContainer.appendChild(link);
            };

            const ciVisQuery = `@ci.pipeline.name:"${pipelineName}" @ci.job.name:"${jobName}" @git.branch:${gitBranch}`;

            createLink("https://app.datadoghq.com/ci/pipeline-executions?query=" +
                       encodeURIComponent(`ci_level:job ${ciVisQuery}`),
                      "🔗 CI Visibility Job");

            // ci.job.id doesn't exist in tests; we have to use ci.job.url
            createLink("https://app.datadoghq.com/ci/test-runs?query=" +
                       encodeURIComponent(`test_level:test ${ciVisQuery} @ci.job.url:"${window.location}"`),
                       "🧪 CI Visibility Tests");

            createLink(branchElement.href.replace("gitlab.ddbuild.io", "github.com").replace("-/commits", "tree"),
                       "🐙 GitHub Branch");
        }
    } else {
        setTimeout(createLinks, 100);
    }
})();
