let isWorking = false;
let blockedSites = ["youtube.com", "instagram.com", "tiktok.com"]; // Default list

// Load custom blocklist from storage when the extension starts
chrome.storage.local.get(['blocklist'], (result) => {
    if (result.blocklist) {
        blockedSites = result.blocklist;
    }
});

// Update the list instantly if the user changes it in Settings
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.blocklist) {
        blockedSites = changes.blocklist.newValue;
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.command === "start") {
        isWorking = true;
        sendResponse({status: "started"});
    } else if (request.command === "stop") {
        isWorking = false;
        sendResponse({status: "stopped"});
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (isWorking && tab.url) {
        const isBlocked = blockedSites.some(site => tab.url.includes(site));
        if (isBlocked) {
            chrome.tabs.remove(tabId);
        }
    }
});