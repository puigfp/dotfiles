// ==UserScript==
// @name        Google Docs extra shortcuts
// @namespace   Benoit's hackywacky User Scripts
// @match       https://docs.google.com/document/d/*/edit
// @match       https://docs.google.com/document/d/*/edit?*
// @grant       none
// @version     1.0
// @author      Benoit Zugmeyer
// @description Adds Google Docs keyboard shortcuts.
// ==/UserScript==

const shortcuts = {
  "meta-e"() {
    emulateClick("//span[starts-with(@aria-label, 'Add space after ')]");
    emulateClick("//span[starts-with(@aria-label, 'Add space before ')]");
  },
  "shift-meta-e"() {
    emulateClick("//span[starts-with(@aria-label, 'Remove space after ')]");
    emulateClick("//span[starts-with(@aria-label, 'Remove space before ')]");
  },
};

const interval = setInterval(() => {
  // TODO: sometimes this iframe is not yet in the DOM and the whole script fails
  let iframe = document.querySelector(".docs-texteventtarget-iframe");
  if (iframe) {
    bind(iframe.contentWindow);
    clearInterval(interval);
  }
}, 500);

function bind(iframeWindow) {
  iframeWindow.addEventListener(
    "paste",
    async (event) => {
      const selection = iframeWindow.document.getSelection();
      if (selection.isCollapsed) {
        return;
      }
      const text = event.clipboardData.getData("text");
      try {
        new URL(text);
      } catch {
        return; // not an URL
      }

      event.cancelBubble = true;
      await emulateClick("//div[starts-with(@aria-label, 'Insert link ')]");
      let searchInput = top.document.querySelector(
        ".appsElementsLinkInsertionTextField input",
      );
      searchInput.value = text;
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
      await emulateClick(".appsElementsLinkInsertionApplyButton");
    },
    true,
  );

  iframeWindow.addEventListener(
    "keydown",
    async (event) => {
      const fullKey = [
        event.shiftKey && "shift",
        event.metaKey && "meta",
        event.altKey && "alt",
        event.ctrlKey && "ctrl",
        event.key,
      ]
        .filter(Boolean)
        .join("-");

      console.log("full key", fullKey);
      const shortcut = shortcuts[fullKey];
      if (shortcut) {
        event.preventDefault();
        event.stopPropagation();
        shortcut(event);
      }
    },
    true,
  );
}

async function emulateClick(selector) {
  let element = selector.startsWith("//")
    ? top.document.evaluate(selector, top.document).iterateNext()
    : top.document.querySelector(selector);

  if (!element) {
    console.log(`Element not found for selecton ${selector}`);
    return;
  }

  await addPendingAction(() => {
    element.dispatchEvent(
      new MouseEvent("mousedown", { view: window, bubbles: true }),
    );
  });
  await addPendingAction(() => {
    element.dispatchEvent(
      new MouseEvent("mouseup", { view: window, bubbles: true }),
    );
    element.dispatchEvent(
      new MouseEvent("click", { view: window, bubbles: true }),
    );
  });
}

const pendingActions = [];
let pendingActionsAreRunning = false;

function addPendingAction(action) {
  return new Promise((resolve, reject) => {
    pendingActions.push({ action, resolve, reject });
    runPendingActions();
  });
}

function runPendingActions() {
  if (pendingActionsAreRunning) {
    return;
  }
  pendingActionsAreRunning = true;
  const action = pendingActions.shift();
  Promise.resolve()
    .then(action.action)
    .then(action.resolve, action.reject)
    .finally(() => {
      setTimeout(() => {
        pendingActionsAreRunning = false;
        if (pendingActions.length) runPendingActions();
      }, 10);
    });
}
