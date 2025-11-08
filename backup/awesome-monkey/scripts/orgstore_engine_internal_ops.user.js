// ==UserScript==
// @name         Orgstore Engine Internal Ops
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extracts ops related information from pagerduty incidents
// @author       Kevin Qin
// @match        https://datadog.pagerduty.com/incidents/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const delay = 3000;

    setTimeout(function() {
        const actionsRow = document.getElementById('actionsButtonsRow');
        if (actionsRow) {
            const newButton = document.createElement('button');
            newButton.textContent = 'Extract Incident Information';
            newButton.className = 'btn btn-primary btn-sm';
            newButton.type = 'button';

            actionsRow.insertBefore(newButton, actionsRow.firstChild);

            newButton.addEventListener('click', function() {
                const incidentTitle = document.querySelector('h1[class^="IncidentTitle_incidentTitle__"]');

                if (incidentTitle) {
                    const incidentInfo = extractAttributes(incidentTitle.textContent);

                    showPopup(incidentInfo);
                } else {
                    console.log('Incident Title element not found');
                }
            });
        } else {
            console.log('Actions row not found');
        }
    }, delay);

    function extractAttributes(title) {
        let result = {};
        const patterns = [
            /postgres_cluster:([a-zA-Z0-9\-]+)/,
            /kube_cluster_name:([a-zA-Z0-9\-]+)/,
            /pod_name:([a-zA-Z0-9\-]+)/,
            /datacenter:([a-zA-Z0-9\.\-]+)/,
            /env:([a-zA-Z\-]+)/,
            /kube_namespace:([a-zA-Z0-9\-]+)/,
            /kube_stateful_set:([a-zA-Z0-9\-]+)/,
            /wpa_name:([a-zA0-9\-]+)/,
            /app:([a-zA-Z0-9\-]+)/,
            /slot_name:([a-zA-Z0-9\-]+)/,
            /port:([0-9]+)/,
            /cluster:([a-zA-Z0-9\-]+)/,
            /account:([a-zA-Z0-9\-]+)/,
        ];

        patterns.forEach(pattern => {
            const match = title.match(pattern);
            if (match) {
                const key = pattern.toString().match(/([a-zA-Z0-9\_\-]+):/)[1];
                result[key] = match[1];
            }
        });

        return result;
    }

    function generateUsefulText(data) {
        let usefulText = {};

        if (data['kube_cluster_name'] && data['datacenter'] && data['kube_namespace']) {
            usefulText['GetPods'] = `k get pods --context="${data['kube_cluster_name']}.${data['datacenter']}" -n "${data['kube_namespace']}"`;
        }else if (data['cluster'] && data['datacenter'] && data['kube_namespace']) {
            usefulText['GetPods'] = `k get pods --context="${data['cluster']}.${data['datacenter']}" -n "${data['kube_namespace']}"`;
        }

        if (data['kube_cluster_name'] && data['datacenter'] && data['kube_namespace']) {
            usefulText['Browse to cluster'] = `ddtool clusters context "${data['kube_cluster_name']}.${data['datacenter']}" && kns "${data['kube_namespace']}"`;
        }else if (data['cluster'] && data['datacenter'] && data['kube_namespace']) {
            usefulText['Browse to cluster'] = `ddtool clusters context "${data['cluster']}.${data['datacenter']}" && kns "${data['kube_namespace']}"`;
        }

        if (data['postgres_cluster'] && data['kube_cluster_name']) {
            usefulText['Cluster Info'] = `${data['postgres_cluster']} - ${data['kube_cluster_name']}`;
        }

        if (data['env'] && data['datacenter']) {
            usefulText['Environment Info'] = `${data['env']} in Datacenter: ${data['datacenter']}`;
        }

        if (data['app'] && data['pod_name']) {
            usefulText['App Info'] = `App "${data['app']}" running in Pod: ${data['pod_name']}`;
        }

        if (data['port'] && data['cluster']) {
            usefulText['Cluster Port Info'] = `Port ${data['port']} on Cluster: ${data['cluster']}`;
        }

        return usefulText;
    }

    function showPopup(data) {
        const usefulText = generateUsefulText(data);

        const popupOverlay = document.createElement('div');
        popupOverlay.style.position = 'fixed';
        popupOverlay.style.top = '0';
        popupOverlay.style.left = '0';
        popupOverlay.style.width = '100%';
        popupOverlay.style.height = '100%';
        popupOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        popupOverlay.style.zIndex = '9999';
        popupOverlay.style.display = 'flex';
        popupOverlay.style.justifyContent = 'center';
        popupOverlay.style.alignItems = 'center';

        const popupDialog = document.createElement('div');
        popupDialog.style.backgroundColor = 'white';
        popupDialog.style.padding = '20px';
        popupDialog.style.borderRadius = '8px';
        popupDialog.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
        popupDialog.style.maxWidth = '80%';
        popupDialog.style.maxHeight = '70%';
        popupDialog.style.overflowY = 'auto';
        popupDialog.style.textAlign = 'left';

        for (const [key, value] of Object.entries(data)) {
            const pairContainer = document.createElement('p');
            pairContainer.style.fontSize = '14px';
            pairContainer.style.margin = '5px 0';
            pairContainer.style.textAlign = 'left';

            const keyElement = document.createElement('span');
            keyElement.style.fontWeight = 'bold';
            keyElement.textContent = `${key}: `;

            const valueElement = document.createElement('span');
            valueElement.style.fontWeight = 'normal';
            valueElement.textContent = value;

            const copyIcon = document.createElement('span');
            copyIcon.innerHTML = '📋';
            copyIcon.style.cursor = 'pointer';
            copyIcon.style.marginLeft = '10px';
            copyIcon.style.fontSize = '16px';
            copyIcon.addEventListener('click', function() {
                navigator.clipboard.writeText(value).then(() => {
                    showToast(`Copied: ${value}`);
                });
            });

            pairContainer.appendChild(keyElement);
            pairContainer.appendChild(valueElement);
            pairContainer.appendChild(copyIcon);
            popupDialog.appendChild(pairContainer);
        }

        const usefulTextSection = document.createElement('div');
        usefulTextSection.style.marginTop = '20px';
        usefulTextSection.style.fontSize = '16px';
        usefulTextSection.style.fontWeight = 'bold';
        usefulTextSection.textContent = 'Useful Information:';

        for (const [key, value] of Object.entries(usefulText)) {
            const textLine = document.createElement('p');
            textLine.style.fontSize = '14px';
            textLine.style.margin = '5px 0';
            textLine.style.textAlign = 'left';

            const keyElement = document.createElement('span');
            keyElement.style.fontWeight = 'bold';
            keyElement.textContent = `${key}: `;

            const valueElement = document.createElement('span');
            valueElement.style.fontWeight = 'normal';
            valueElement.textContent = value;

            const copyIcon = document.createElement('span');
            copyIcon.innerHTML = '📋';
            copyIcon.style.cursor = 'pointer';
            copyIcon.style.marginLeft = '10px';
            copyIcon.style.fontSize = '16px';
            copyIcon.addEventListener('click', function() {
                navigator.clipboard.writeText(value).then(() => {
                    showToast(`Copied: ${value}`);
                });
            });

            textLine.appendChild(keyElement);
            textLine.appendChild(valueElement);
            textLine.appendChild(copyIcon);
            usefulTextSection.appendChild(textLine);
        }

        popupDialog.appendChild(usefulTextSection);

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.marginTop = '20px';
        closeButton.style.padding = '10px 20px';
        closeButton.style.backgroundColor = '#007bff';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';

        closeButton.addEventListener('click', function() {
            popupOverlay.remove();
        });

        popupDialog.appendChild(closeButton);

        popupOverlay.appendChild(popupDialog);

        document.body.appendChild(popupOverlay);
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'rgba(0, 123, 255, 0.9)';
        toast.style.color = 'white';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '5px';
        toast.style.fontSize = '14px';
        toast.style.zIndex = '10000';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    }
})();
