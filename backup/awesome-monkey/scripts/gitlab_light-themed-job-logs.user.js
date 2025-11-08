// ==UserScript==
// @name        Gitlab Light Logs
// @namespace   Violentmonkey Scripts
// @match       https://gitlab.ddbuild.io/*
// @run-at      document-body
// @grant       none
// @version     1.0
// @author      Guy Bolton King
// @description 26/09/2023, 18:10:33
// ==/UserScript==

let lightStyle = document.createElement('style');
lightStyle.textContent = `
@media (prefers-color-scheme: light) {
  .job-log, .job-log-viewer { color: #111; background-color: #fafafa; }
  .job-log-line.gl-bg-gray-700 { color: inherit; background-color: #f3ffa2 }
  /* The experimental job-log-viewer unaccountably uses horrible bright
     xterm colours instead of the colour paletter used by the normal log viewer */
  .job-log-viewer .xterm-fg-9 { color: #ea1010 } /* .term-fg-red */
  .job-log-viewer .xterm-fg-10 { color: #090 } /* .term-fg-green */
  .job-log-viewer .xterm-fg-11 { color: #990 } /* .term-fg-yellow */
  .job-log-viewer .xterm-fg-12 { color: #0073e6 } /* .term-fg-blue */
  .job-log-viewer .xterm-fg-13 { color: #d411d4 } /* .term-fg-magenta */
  .job-log-viewer .xterm-fg-14 { color: #099 } /* .term-fg-cyan */
}
`;
document.head.append(lightStyle);
