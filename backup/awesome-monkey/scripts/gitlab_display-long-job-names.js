// ==UserScript==
// @name         [Gitlab] Display long job names
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a checkbox to display job names in full
// @author       You
// @match        https://gitlab.ddbuild.io/DataDog/*/-/jobs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitlab.com
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// ==/UserScript==

(function viewJobNames(){
    // Define the function to be called when the checkbox is clicked
    function handleCheckboxClick() {
        let noTruncate = document.createElement("style");
        noTruncate.textContent = `.gl-text-truncate {overflow: visible; text-overflow: unset; white-space: nowrap;}`;
        let truncate = document.createElement("style");
        truncate.textContent = `.gl-text-truncate {overflow: hidden; text-overflow: ellipsis; white-space: nowrap;}`;
        if (checkbox.checked) {
            document.head.appendChild(noTruncate);
        } else {
            document.head.appendChild(truncate);
        }
    }
    let jobList = document.querySelector("#content-body > div:nth-child(2) > div > aside > div > div > div.block.builds-container > b");
    if (jobList) {
        // Create the checkbox
        let checkbox = document.createElement("input");
        checkbox.setAttribute("class", "gl-ml-3");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", "no-truncate");

        // Create a label for the checkbox (optional)
        let label = document.createElement("label");
        label.setAttribute("for", "no-truncate");
        label.setAttribute("class", "gl-ml-2");
        label.style.marginBottom = "unset";
        label.textContent = "Display names";

        // Append the checkbox and label to the <div>
        jobList.appendChild(checkbox);
        jobList.appendChild(label);

        // Attach the click event listener to the checkbox
        checkbox.addEventListener("click", handleCheckboxClick);
    } else {
        setTimeout(viewJobNames, 500);
    }
})();