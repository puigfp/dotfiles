// ==UserScript==
// @name         Github datadog-agent auto labels check tick
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       nplanel
// @match        https://github.com/DataDog/datadog-agent/compare/*nplanel/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// ==/UserScript==
////disabled @grant        interest-cohort

// When you open a new pull request
// This one is a little bit hacky as you need to select the drop down labels
// then reload the page (may one or 2 times) (you will not lost you PR summary)
//
// if any js expert reading this, if there a way to force the labels pull event from github
// let me know


//'Open a pull request'

(function() {
    'use strict';

    var title=document.querySelector("#repo-content-pjax-container > div > div.compare-pr-header.Subhead > h1").textContent
    if (title != 'Open a pull request') {
        return
    }
    console.log("github pull request auto check tick")


    var labelsButton = document.querySelector("#labels-select-menu > summary");
    labelsButton.onclick = function() {
        var checkboxes = document.querySelectorAll("#labels-select-menu > details-menu > div.hx_rsm-content > div > div > * > div > input[type=checkbox]");
        var labels = document.querySelectorAll("#labels-select-menu > details-menu > div.hx_rsm-content > div > div > *");

        const ticks = ['qa/skip-qa', 'changelog/no-changelog', 'team/usm', 'component/system-probe'];

        for (var i = 0 ; i<checkboxes.length; i++) {
            if (ticks.includes(checkboxes[i].getAttribute('data-label-name')) == true) {
                checkboxes[i].checked = true
               console.log("checked",checkboxes[i].getAttribute('data-label-name'))
            }
            if (ticks.includes(labels[i].getAttribute('data-prio-filter-value')) == true) {
                labels[i].setAttribute('aria-checked', true)
               console.log("checked",labels[i].getAttribute('data-prio-filter-value'))
            }
        }
    }
})();