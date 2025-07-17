// Options page JavaScript for Stop Wasting Time Extension
// Handles all settings management and statistics display

// Default blocked websites
const defaultBlockedSites = [
    'facebook.com', 'instagram.com', 'twitter.com', 'youtube.com',
    'reddit.com', 'tiktok.com', 'snapchat.com', 'pinterest.com',
    'linkedin.com', 'twitch.tv', 'netflix.com', 'discord.com',
    'whatsapp.com', 'telegram.org', 'tumblr.com', '9gag.com',
    'buzzfeed.com', 'imgur.com'
];

// Default settings
const defaultSettings = {
    workDuration: 25,
    breakDuration: 5,
    enableNotifications: true,
    blockWebsites: true,
    showBadge: true,
    playSound: false,
    autoStartBreaks: false,
    blockingMode: 'standard',
    customBlockedSites: [],
    allowedSites: [],
    theme: 'default',
    compactMode: false,
    showSeconds: false,
    showMotivation: true,
    motivationFrequency: 10,
    notifyStart: true,
    notifyComplete: true,
    notifyBreak: true,
    notifyBlocked: false
};

let currentSettings = { ...defaultSettings };

// Initialize options page
document.addEventListener('DOMContentLoaded', async function() {
    await loadSettings();
    await loadStatistics();
    setupEventListeners();
    setupTabs();
    updateUI();

    // Check for hash navigation
    if (window.location.hash === '#stats') {
        switchTab('stats');
    }
});

// Load settings from storage
async function loadSettings() {
    const result = await chrome.storage.local.get(['settings']);
    if (result.settings) {
        currentSettings = { ...defaultSettings, ...result.settings };
    }
}

// Save settings to storage
async function saveSettings() {
    await chrome.storage.local.set({ settings: currentSettings });

    // Notify background script about settings change
    chrome.runtime.sendMessage({
        action: 'updateSettings',
        settings: currentSettings
    });

    showSaveStatus('Settings saved successfully!', 'success');
}

// Load statistics
async function loadStatistics() {
    const result = await chrome.storage.local.get(['dailyStats']);
    if (result.dailyStats) {
        updateStatisticsDisplay(result.dailyStats);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });

    // Save button
    document.getElementById('saveSettings').addEventListener('click', saveSettings);

    // General settings
    document.getElementById('workDuration').addEventListener('change', (e) => {
        currentSettings.workDuration = parseInt(e.target.value);
    });

    document.getElementById('breakDuration').addEventListener('change', (e) => {
        currentSettings.breakDuration = parseInt(e.target.value);
    });

    document.getElementById('autoStartBreaks').addEventListener('change', (e) => {
        currentSettings.autoStartBreaks = e.target.checked;
    });

    document.getElementById('showBadge').addEventListener('change', (e) => {
        currentSettings.showBadge = e.target.checked;
    });

    document.getElementById('playSound').addEventListener('change', (e) => {
        currentSettings.playSound = e.target.checked;
    });

    // Blocking settings
    document.getElementById('blockWebsites').addEventListener('change', (e) => {
        currentSettings.blockWebsites = e.target.checked;
    });

    document.getElementById('blockingMode').addEventListener('change', (e) => {
        currentSettings.blockingMode = e.target.value;
    });

    // Website management
    document.getElementById('addSite').addEventListener('click', addCustomSite);
    document.getElementById('newSite').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addCustomSite();
    });

    document.getElementById('addAllowSite').addEventListener('click', addAllowedSite);
    document.getElementById('newAllowSite').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addAllowedSite();
    });

    // Notification settings
    document.getElementById('enableNotifications').addEventListener('change', (e) => {
        currentSettings.enableNotifications = e.target.checked;
    });

    document.getElementById('notifyStart').addEventListener('change', (e) => {
        currentSettings.notifyStart = e.target.checked;
    });

    document.getElementById('notifyComplete').addEventListener('change', (e) => {
        currentSettings.notifyComplete = e.target.checked;
    });

    document.getElementById('notifyBreak').addEventListener('change', (e) => {
        currentSettings.notifyBreak = e.target.checked;
    });

    document.getElementById('notifyBlocked').addEventListener('change', (e) => {
        currentSettings.notifyBlocked = e.target.checked;
    });

    document.getElementById('showMotivation').addEventListener('change', (e) => {
        currentSettings.showMotivation = e.target.checked;
    });

    document.getElementById('motivationFrequency').addEventListener('change', (e) => {
        currentSettings.motivationFrequency = parseInt(e.target.value);
    });

    // Appearance settings
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.dataset.theme;
            selectTheme(theme);
        });
    });

    document.getElementById('compactMode').addEventListener('change', (e) => {
        currentSettings.compactMode = e.target.checked;
    });

    document.getElementById('showSeconds').addEventListener('change', (e) => {
        currentSettings.showSeconds = e.target.checked;
    });

    // Data management
    document.getElementById('exportData').addEventListener('click', exportData);
    document.getElementById('importData').addEventListener('change', importData);
    document.getElementById('resetStats').addEventListener('click', resetStatistics);
    document.getElementById('resetSettings').addEventListener('click', resetSettings);
    document.getElementById('resetAll').addEventListener('click', resetAll);
}

// Setup tab navigation
function setupTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            switchTab(targetTab);
        });
    });
}

// Switch active tab
function switchTab(tabName) {
    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');

    // Load specific tab content
    if (tabName === 'stats') {
        loadStatistics();
    }
}

// Update UI with current settings
function updateUI() {
    // General settings
    document.getElementById('workDuration').value = currentSettings.workDuration;
    document.getElementById('breakDuration').value = currentSettings.breakDuration;
    document.getElementById('autoStartBreaks').checked = currentSettings.autoStartBreaks;
    document.getElementById('showBadge').checked = currentSettings.showBadge;
    document.getElementById('playSound').checked = currentSettings.playSound;

    // Blocking settings
    document.getElementById('blockWebsites').checked = currentSettings.blockWebsites;
    document.getElementById('blockingMode').value = currentSettings.blockingMode;

    // Notification settings
    document.getElementById('enableNotifications').checked = currentSettings.enableNotifications;
    document.getElementById('notifyStart').checked = currentSettings.notifyStart;
    document.getElementById('notifyComplete').checked = currentSettings.notifyComplete;
    document.getElementById('notifyBreak').checked = currentSettings.notifyBreak;
    document.getElementById('notifyBlocked').checked = currentSettings.notifyBlocked;
    document.getElementById('showMotivation').checked = currentSettings.showMotivation;
    document.getElementById('motivationFrequency').value = currentSettings.motivationFrequency;

    // Appearance settings
    document.getElementById('compactMode').checked = currentSettings.compactMode;
    document.getElementById('showSeconds').checked = currentSettings.showSeconds;
    selectTheme(currentSettings.theme);

    // Update website lists
    updateWebsiteLists();
}

// Website management functions
function addCustomSite() {
    const input = document.getElementById('newSite');
    const site = input.value.trim().toLowerCase();

    if (site && !currentSettings.customBlockedSites.includes(site)) {
        currentSettings.customBlockedSites.push(site);
        updateWebsiteLists();
        input.value = '';
    }
}

function addAllowedSite() {
    const input = document.getElementById('newAllowSite');
    const site = input.value.trim().toLowerCase();

    if (site && !currentSettings.allowedSites.includes(site)) {
        currentSettings.allowedSites.push(site);
        updateWebsiteLists();
        input.value = '';
    }
}

function removeCustomSite(site) {
    currentSettings.customBlockedSites = currentSettings.customBlockedSites.filter(s => s !== site);
    updateWebsiteLists();
}

function removeAllowedSite(site) {
    currentSettings.allowedSites = currentSettings.allowedSites.filter(s => s !== site);
    updateWebsiteLists();
}

function updateWebsiteLists() {
    // Default sites
    const defaultSitesContainer = document.getElementById('defaultSites');
    defaultSitesContainer.innerHTML = '';
    defaultBlockedSites.forEach(site => {
        const tag = document.createElement('div');
        tag.className = 'site-tag default';
        tag.textContent = site;
        defaultSitesContainer.appendChild(tag);
    });

    // Custom blocked sites
    const customSitesContainer = document.getElementById('customSites');
    customSitesContainer.innerHTML = '';
    currentSettings.customBlockedSites.forEach(site => {
        const tag = document.createElement('div');
        tag.className = 'site-tag custom';
        tag.innerHTML = `
            ${site}
            <span class="remove" onclick="removeCustomSite('${site}')">×</span>
        `;
        customSitesContainer.appendChild(tag);
    });

    // Allowed sites
    const allowedSitesContainer = document.getElementById('allowedSites');
    allowedSitesContainer.innerHTML = '';
    currentSettings.allowedSites.forEach(site => {
        const tag = document.createElement('div');
        tag.className = 'site-tag allowed';
        tag.innerHTML = `
            ${site}
            <span class="remove" onclick="removeAllowedSite('${site}')">×</span>
        `;
        allowedSitesContainer.appendChild(tag);
    });
}

// Theme selection
function selectTheme(themeName) {
    currentSettings.theme = themeName;

    // Update UI
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`[data-theme="${themeName}"]`).classList.add('selected');
}

// Statistics display
function updateStatisticsDisplay(stats) {
    // Today's stats
    const focusHours = Math.floor(stats.focusTime / 3600);
    const focusMinutes = Math.floor((stats.focusTime % 3600) / 60);
    document.getElementById('todayFocusTime').textContent = `${focusHours}h ${focusMinutes}m`;
    document.getElementById('todaySessions').textContent = stats.sessionsCompleted || 0;
    document.getElementById('todayBlocked').textContent = stats.websitesBlocked || 0;

    // Generate insights
    generateInsights(stats);
}

// Generate productivity insights
function generateInsights(stats) {
    const insights = document.getElementById('insights');
    insights.innerHTML = '';

    const insightData = [
        {
            title: 'Focus Performance',
            text: stats.focusTime > 3600 ? 
                'Excellent! You've focused for over an hour today.' : 
                'Try to increase your focus time for better productivity.'
        },
        {
            title: 'Session Completion',
            text: stats.sessionsCompleted > 3 ? 
                'Great job completing multiple focus sessions!' : 
                'Consider completing more Pomodoro sessions.'
        },
        {
            title: 'Distraction Control',
            text: stats.websitesBlocked > 10 ? 
                'You're successfully avoiding many distractions.' : 
                'Good job staying focused with minimal blocks needed.'
        }
    ];

    insightData.forEach(insight => {
        const item = document.createElement('div');
        item.className = 'insight-item';
        item.innerHTML = `
            <h4>${insight.title}</h4>
            <p>${insight.text}</p>
        `;
        insights.appendChild(item);
    });
}

// Data management functions
async function exportData() {
    const data = {
        settings: currentSettings,
        dailyStats: await chrome.storage.local.get(['dailyStats']),
        tasks: await chrome.storage.local.get(['tasks']),
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stop-wasting-time-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showSaveStatus('Data exported successfully!', 'success');
}

async function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (data.settings) {
            currentSettings = { ...defaultSettings, ...data.settings };
            await saveSettings();
            updateUI();
        }

        if (data.dailyStats) {
            await chrome.storage.local.set({ dailyStats: data.dailyStats });
        }

        if (data.tasks) {
            await chrome.storage.local.set({ tasks: data.tasks });
        }

        showSaveStatus('Data imported successfully!', 'success');
    } catch (error) {
        showSaveStatus('Error importing data: ' + error.message, 'error');
    }
}

async function resetStatistics() {
    if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
        await chrome.storage.local.remove(['dailyStats']);
        await loadStatistics();
        showSaveStatus('Statistics reset successfully!', 'success');
    }
}

async function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        currentSettings = { ...defaultSettings };
        await saveSettings();
        updateUI();
        showSaveStatus('Settings reset to default!', 'success');
    }
}

async function resetAll() {
    if (confirm('Are you sure you want to reset EVERYTHING? This will clear all data and settings.')) {
        await chrome.storage.local.clear();
        currentSettings = { ...defaultSettings };
        updateUI();
        showSaveStatus('All data cleared!', 'success');
    }
}

// Show save status
function showSaveStatus(message, type) {
    const status = document.getElementById('saveStatus');
    status.textContent = message;
    status.className = `save-status ${type}`;

    setTimeout(() => {
        status.textContent = '';
        status.className = 'save-status';
    }, 3000);
}

// Make functions globally accessible
window.removeCustomSite = removeCustomSite;
window.removeAllowedSite = removeAllowedSite;