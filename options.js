const siteInput = document.getElementById('siteInput');
const addBtn = document.getElementById('addBtn');
const siteList = document.getElementById('siteList');

let blockedSites = ["youtube.com", "instagram.com", "tiktok.com"];

// Render the list on the screen
function renderList() {
    siteList.innerHTML = '';
    blockedSites.forEach((site, index) => {
        const li = document.createElement('li');
        li.textContent = site;
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-btn';
        removeBtn.onclick = () => removeSite(index);
        
        li.appendChild(removeBtn);
        siteList.appendChild(li);
    });
}

// Save to storage
function saveToStorage() {
    chrome.storage.local.set({ blocklist: blockedSites });
}

// Add a new site
addBtn.addEventListener('click', () => {
    const newSite = siteInput.value.trim().toLowerCase();
    if (newSite && !blockedSites.includes(newSite)) {
        blockedSites.push(newSite);
        siteInput.value = '';
        saveToStorage();
        renderList();
    }
});

// Remove a site
function removeSite(index) {
    blockedSites.splice(index, 1);
    saveToStorage();
    renderList();
}

// Load from storage when the page opens
chrome.storage.local.get(['blocklist'], (result) => {
    if (result.blocklist) {
        blockedSites = result.blocklist;
    }
    renderList();
});