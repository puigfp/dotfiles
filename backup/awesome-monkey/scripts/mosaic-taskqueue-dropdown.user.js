// ==UserScript==
// @name         Atlas task queue auto-complete
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add autocomplete to task queue input
// @author       Grégoire Seux
// @match        https://mosaic.us1.ddbuild.io/workflow-starter*
// @match        https://atlas.us1.ddbuild.io/workflow-starter*
// @updateURL    https://raw.githubusercontent.com/DataDog/awesome-monkey/main/scripts/mosaic-taskqueue-dropdown.user.js
// @downloadURL  https://raw.githubusercontent.com/DataDog/awesome-monkey/main/scripts/mosaic-taskqueue-dropdown.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Base datacenters (without edge)
    const datacenters = [
        'ap1.prod.dog',
        'ap2.prod.dog',
        'control1.analytics.prod.dog',
        'data1.analytics.prod.dog',
        'eu1.prod.dog',
        'eu1.staging.dog',
        'iss1.eu1.prod.dog',
        'prtest00.staging.dog',
        'prtest01.staging.dog',
        'prtest02.staging.dog',
        'prtest03.staging.dog',
        'prtest04.staging.dog',
        'prtest05.staging.dog',
        'prtest06.staging.dog',
        'us1-build.fed.dog',
        'us1-security.fed.dog',
        'us1.ci.prod.dog',
        'us1.datadog.blue',
        'us1.ddbuild.io',
        'us1.ddbuild.staging.dog',
        'us1.fed.dog',
        'us1.michelada.prod.dog',
        'us1.michelada.staging.dog',
        'us1.prod.dog',
        'us1.release.mgmt.dog',
        'us1.release.staging.dog',
        'us1.staging-fed.dog',
        'us1.staging.dog',
        'us3.prod.dog',
        'us3.staging.dog',
        'us4.prod.dog',
        'us5.prod.dog'
    ];
    
    // Generate task queues with both prefixes
    const taskQueues = [
        ...datacenters.map(dc => `eventplatform/${dc}`),
        ...datacenters.map(dc => `foundationdb/${dc}`)
    ];
    
    let autocompleteList = null;
    let selectedIndex = -1;
    
    // Function to set input value and trigger React updates
    function setInputValue(input, value) {
        // Set the value directly
        input.value = value;
        input.focus();
        
        // Create a proper input event
        const inputEvent = new InputEvent('input', {
            bubbles: true,
            cancelable: true,
            composed: true
        });
        
        // Create change event
        const changeEvent = new Event('change', {
            bubbles: true,
            cancelable: true
        });
        
        // Dispatch events
        input.dispatchEvent(inputEvent);
        input.dispatchEvent(changeEvent);
        
        // Try to find and trigger React event handlers
        const allKeys = Object.keys(input);
        const reactFiberKey = allKeys.find(key => key.startsWith('__reactFiber') || key.startsWith('__reactInternalFiber'));
        const reactPropsKey = allKeys.find(key => key.startsWith('__reactProps'));
        
        // Try React Fiber approach
        if (reactFiberKey) {
            const fiber = input[reactFiberKey];
            if (fiber && fiber.memoizedProps && fiber.memoizedProps.onChange) {
                const syntheticEvent = {
                    target: input,
                    currentTarget: input,
                    type: 'change',
                    nativeEvent: changeEvent
                };
                fiber.memoizedProps.onChange(syntheticEvent);
            }
        }
        
        // Try React Props approach
        if (reactPropsKey) {
            const props = input[reactPropsKey];
            if (props && props.onChange) {
                const syntheticEvent = {
                    target: input,
                    currentTarget: input,
                    type: 'change',
                    nativeEvent: changeEvent
                };
                props.onChange(syntheticEvent);
            }
        }
    }
    
    function createAutocompleteList(input) {
        const list = document.createElement('div');
        list.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ccc;
            border-top: none;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        list.id = 'taskqueue-autocomplete';
        
        // Make input container relative positioned
        const container = input.parentElement;
        if (container.style.position !== 'relative' && container.style.position !== 'absolute') {
            container.style.position = 'relative';
        }
        
        return list;
    }
    
    function updateAutocomplete(input, query) {
        if (!autocompleteList) return;
        
        autocompleteList.innerHTML = '';
        selectedIndex = -1;
        
        if (!query) {
            autocompleteList.style.display = 'none';
            return;
        }
        
        const matches = taskQueues.filter(queue => 
            queue.toLowerCase().includes(query.toLowerCase())
        );
        
        if (matches.length === 0) {
            autocompleteList.style.display = 'none';
            return;
        }
        
        matches.forEach((match, index) => {
            const item = document.createElement('div');
            item.style.cssText = `
                padding: 8px 12px;
                cursor: pointer;
                border-bottom: 1px solid #eee;
            `;
            item.textContent = match;
            
            item.addEventListener('mouseenter', () => {
                clearSelection();
                item.style.backgroundColor = '#f0f0f0';
                selectedIndex = index;
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = '';
            });
            
            item.addEventListener('mousedown', (e) => {
                e.preventDefault(); // Prevent blur from firing first
                setInputValue(input, match);
                autocompleteList.style.display = 'none';
                input.focus();
            });
            
            autocompleteList.appendChild(item);
        });
        
        autocompleteList.style.display = 'block';
    }
    
    function clearSelection() {
        const items = autocompleteList.querySelectorAll('div');
        items.forEach(item => item.style.backgroundColor = '');
    }
    
    function selectItem(direction) {
        const items = autocompleteList.querySelectorAll('div');
        if (items.length === 0) return;
        
        clearSelection();
        
        if (direction === 'down') {
            selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
        } else if (direction === 'up') {
            selectedIndex = Math.max(selectedIndex - 1, -1);
        }
        
        if (selectedIndex >= 0) {
            items[selectedIndex].style.backgroundColor = '#f0f0f0';
        }
    }
    
    function addAutocomplete() {
        const input = document.querySelector('input.druids_form_input-text__input[placeholder="Taskqueue"]');
        if (!input) {
            setTimeout(addAutocomplete, 500);
            return;
        }
        
        // Create autocomplete list
        autocompleteList = createAutocompleteList(input);
        input.parentElement.appendChild(autocompleteList);
        
        // Add event listeners
        input.addEventListener('input', (e) => {
            updateAutocomplete(input, e.target.value);
        });
        
        input.addEventListener('keydown', (e) => {
            if (!autocompleteList || autocompleteList.style.display === 'none') return;
            
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    selectItem('down');
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    selectItem('up');
                    break;
                case 'Enter':
                    if (selectedIndex >= 0) {
                        e.preventDefault();
                        const items = autocompleteList.querySelectorAll('div');
                        if (items[selectedIndex]) {
                            setInputValue(input, items[selectedIndex].textContent);
                            autocompleteList.style.display = 'none';
                        }
                    }
                    break;
                case 'Escape':
                    autocompleteList.style.display = 'none';
                    selectedIndex = -1;
                    break;
            }
        });
        
        input.addEventListener('blur', (e) => {
            // Hide autocomplete when clicking outside (with small delay to allow clicks on items)
            setTimeout(() => {
                if (autocompleteList && document.activeElement !== input) {
                    autocompleteList.style.display = 'none';
                }
            }, 200);
        });
        
        input.addEventListener('focus', () => {
            if (input.value) {
                updateAutocomplete(input, input.value);
            }
        });
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addAutocomplete);
    } else {
        addAutocomplete();
    }
})();
