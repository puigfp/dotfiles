// ==UserScript==
// @name         Improve Jira plans
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replace text colors for OKR status with real visual colors
// @author       Théo Carrive
// @match        https://datadoghq.atlassian.net/jira/plans/*
// @grant        none
// ==/UserScript==

const confidenceYellowColor = '#EFC705';
const confidenceRedColor = '#DC294C';
const confidenceGreenColor = '#38CF90';
const doneGreenColor = '#B8EAC6';
const dangerRedColor = '#FFE1E1';

function improveJiraColors() {

    document.querySelectorAll('tr._xzxir194').forEach(tr => {

        // APPLY COLORS ON CONFIDENCE CELLS
        // --------------------------------
        // Note: We don't remove colors on cells that get emptied. 
        // Not a big issue, but might need to take in account. 
        let rowChildren = tr.querySelectorAll('div')
        if (rowChildren) {
            rowChildren.forEach(div => {
                if (div.textContent.trim() === 'Yellow') {
                    div.style.backgroundColor = confidenceYellowColor;
                    div.style.color = 'white';
                } else if (div.textContent.trim() === 'Red') {
                    div.style.backgroundColor = confidenceRedColor;
                    div.style.color = 'white';

                    tr.style.setProperty('--plan-grid-row-background-base', dangerRedColor);
                    tr.style.setProperty('--plan-grid-row-background-hover', dangerRedColor);
                } else if (div.textContent.trim() === 'Green') {
                    div.style.backgroundColor = confidenceGreenColor;
                    div.style.color = 'white';
                }
            })
        }

        // ADD GREEN HIGHLIGHTING TO DONE ROWS
        // -----------------------------------
        // Note: We don't remove colors on cells that change status after being colored. 
        // Not a big issue, but might need to take in account. 
        let status = tr.querySelector('td[data-attribute="issueStatus"]');
        if (status) {
            status.querySelectorAll('div').forEach(div => {
                if (div.textContent.trim() === 'Done') {
                    tr.style.setProperty('--plan-grid-row-background-base', doneGreenColor);
                    tr.style.setProperty('--plan-grid-row-background-hover', doneGreenColor);
                }
            });
        }
    })
}

setInterval(improveJiraColors, 1000);
