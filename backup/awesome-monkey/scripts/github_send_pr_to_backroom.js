// ==UserScript==
// @name        Post PR
// @namespace   Violentmonkey Scripts
// @match       https://github.com/DataDog/*/pull/*
// @version     1.0
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @author      Arthur Belleville <arthur.belleville@datadoghq.com>
// @author      Ines Rekik <ines.rekik@datadoghq.com>
// @description 18/06/2025, 10:33:07
// ==/UserScript==

// ORG 2 API / APP Keys
const DD_API_KEY = "YOUR-DD-API-KEY"
const DD_APP_KEY = "YOUR-DD-APP-KEY"; // User owned APP keys are deleted every week. Use a service account APP key that doesn't get deleted at https://datadoghq.atlassian.net/wiki/spaces/~56836979/pages/5221286433/Use+the+PR+submitter+script#How-to-use

const DD_WORKFLOW_URL = 'https://api.datadoghq.com/api/v2/workflows/d998f350-3dcc-40e0-a4da-e86f2fa2da8f/instances';

// ----- TO CHANGE FOR YOUR TEAM -----

const TEAM_EMAILS = [
  // "arthur.belleville@datadoghq.com",
  "frank.bryden@datadoghq.com",
  "alexandre.fouchs@datadoghq.com",
  "thomas.rosenblatt@datadoghq.com",
  "nathan.fox@datadoghq.com",
  "othmane.bentaleb@datadoghq.com",
  "vincent.roy@datadoghq.com",
  "isabella.garza@datadoghq.com",
  "zach.chentouf@datadoghq.com",
  "chelsea.liu@datadoghq.com",
  "maksym.shykula@datadoghq.com"
]

const BACKROOM_SLACK_NAME = "#your-backroom"

const YOUR_GITHUB_USERNAME = "your-username"

// --------------------------------

const buildBody = (payload) => ({
  meta: {
    payload
  }
});


const emailToName = (email) => {
  // Get the part before the @ symbol and split by dots
  const nameParts = email.split('@')[0].split('.');

  // Capitalize first letter of each part and join with space
  const formattedName = nameParts
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

  return formattedName;
}

(function () {
  $(document).ready(function () {
    const NAME = "Post PR";

    const author = $("a.author").html();
    if (author !== YOUR_GITHUB_USERNAME) {
      return
    }

    let $sel = $("<select>", {"class": "violentmonkey__datadog", "id": "pr_submit", "click": function(e) { e.stopPropagation();}})
    $.map(TEAM_EMAILS, function(val, i) {
     $sel.append($("<option>", {"class": "ActionListWrap--inset ActionListWrap"}).attr('value', val).text(emailToName(val)));
    });

    let $checkMark = $("<span>");
    $checkMark.toggle();

    let $span = $("<span>", {"class": "Button-content"}).prepend($("<span>", {"class": "Button-label"}).html('Send PR to'))
    let $button = $("<button>", {
      "class": "pr_submitter js-details-target js-title-edit-button flex-md-order-2 Button--secondary Button--small Button m-0 mr-md-0",
      "click": function(e) {
        e.stopPropagation();

        const author = $("a.author").html();
        const reviewerEmail = $('select.violentmonkey__datadog').find(":selected").val();
        const reviewerName = $('select.violentmonkey__datadog').find(":selected").text();

        const prTitle = $('bdi.js-issue-title').html();
        const prLink = document.URL;
        const prInfo = prLink.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/);

        const repo = prInfo[2];
        const pullNumber = parseInt(prInfo[3], 10);

        const body = buildBody({author, reviewer: reviewerEmail, slackChannelName: BACKROOM_SLACK_NAME, details: {
          prTitle,
          prLink,
          repo,
          pullNumber,
        }});

        // Run workflow
        GM_xmlhttpRequest({
          url: DD_WORKFLOW_URL,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'DD-API-KEY': DD_API_KEY,
            'DD-APPLICATION-KEY': DD_APP_KEY
          },
          data: JSON.stringify(body),
          onload: (res) => console.log(res),
        })

        $("button.pr_submitter").toggle();
        $checkMark.html(`✅ PR successfully sent to ${reviewerName}`);
        $checkMark.toggle();

      }}).prepend($span).append($sel);

    let $div = $("<div>", {"class": "d-flex"}).append($button).append($checkMark);

    $("body").find("div.gh-header-meta").append($div);
  })
})();