// Service Worker for Stop Wasting Time Extension
// Handles timers, website blocking, and notifications

// State variables
let timerState = {
    isRunning: false,
    currentTime: 25 * 60,
    isWorkSession: true,
    startTime: null
};

let settings = {
    workDuration: 25,
    breakDuration: 5,
    enableNotifications: true,
    blockWebsites: true,
    theme: 'default'
};

let dailyStats = {
    focusTime: 0,
    sessionsCompleted: 0,
    websitesBlocked: 0,
    date: new Date().toDateString()
};

// Initialize extension
chrome.runtime.onInstalled.addListener(async () => {
    console.log('Stop Wasting Time extension installed');

    // Set default settings
    await chrome.storage.local.set({ 
        settings: settings,
        dailyStats: dailyStats,
        timerState: timerState
    });

    // Set up daily stats reset
    await setupDailyStatsReset();
});

// Handle extension startup
chrome.runtime.onStartup.addListener(async () => {
    await loadStoredData();
    await checkDailyStatsReset();
});

// Load stored data
async function loadStoredData() {
    const result = await chrome.storage.local.get(['settings', 'dailyStats', 'timerState']);

    if (result.settings) {
        settings = { ...settings, ...result.settings };
    }

    if (result.dailyStats) {
        dailyStats = { ...dailyStats, ...result.dailyStats };
    }

    if (result.timerState) {
        timerState = { ...timerState, ...result.timerState };
    }
}

// Check if daily stats need to be reset
async function checkDailyStatsReset() {
    const today = new Date().toDateString();
    if (dailyStats.date !== today) {
        dailyStats = {
            focusTime: 0,
            sessionsCompleted: 0,
            websitesBlocked: 0,
            date: today
        };
        await chrome.storage.local.set({ dailyStats: dailyStats });
    }
}

// Setup daily stats reset alarm
async function setupDailyStatsReset() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const delayInMinutes = (tomorrow.getTime() - now.getTime()) / (1000 * 60);

    chrome.alarms.create('dailyReset', {
        delayInMinutes: delayInMinutes,
        periodInMinutes: 24 * 60 // Repeat every 24 hours
    });
}

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    switch (message.action) {
        case 'startTimer':
            await startTimer(message.duration, message.isWorkSession);
            break;
        case 'pauseTimer':
            await pauseTimer();
            break;
        case 'resetTimer':
            await resetTimer();
            break;
        case 'enableBlocking':
            await enableWebsiteBlocking();
            break;
        case 'disableBlocking':
            await disableWebsiteBlocking();
            break;
        case 'getTimerState':
            sendResponse(timerState);
            break;
        case 'updateSettings':
            await updateSettings(message.settings);
            break;
        case 'websiteBlocked':
            await recordBlockedWebsite();
            break;
    }
});

// Timer functions
async function startTimer(duration, isWorkSession) {
    timerState.isRunning = true;
    timerState.currentTime = duration;
    timerState.isWorkSession = isWorkSession;
    timerState.startTime = Date.now();

    await chrome.storage.local.set({ timerState: timerState });

    // Create alarm for timer
    chrome.alarms.create('pomodoro', {
        delayInMinutes: duration / 60
    });

    // Update badge
    updateBadge();

    // Send notification
    if (settings.enableNotifications) {
        const sessionType = isWorkSession ? 'Focus' : 'Break';
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'Timer Started',
            message: `${sessionType} session started! Duration: ${Math.floor(duration / 60)} minutes`
        });
    }
}

async function pauseTimer() {
    timerState.isRunning = false;
    await chrome.storage.local.set({ timerState: timerState });

    // Clear alarm
    chrome.alarms.clear('pomodoro');

    // Update badge
    updateBadge();

    // Send notification
    if (settings.enableNotifications) {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'Timer Paused',
            message: 'Focus session paused'
        });
    }
}

async function resetTimer() {
    timerState.isRunning = false;
    timerState.currentTime = timerState.isWorkSession ? settings.workDuration * 60 : settings.breakDuration * 60;
    await chrome.storage.local.set({ timerState: timerState });

    // Clear alarm
    chrome.alarms.clear('pomodoro');

    // Update badge
    updateBadge();
}

// Handle timer completion
async function completeTimer() {
    const wasWorkSession = timerState.isWorkSession;

    // Update stats
    if (wasWorkSession) {
        dailyStats.focusTime += settings.workDuration * 60;
        dailyStats.sessionsCompleted++;
    }

    await chrome.storage.local.set({ dailyStats: dailyStats });

    // Switch session type
    timerState.isWorkSession = !timerState.isWorkSession;
    timerState.isRunning = false;
    timerState.currentTime = timerState.isWorkSession ? settings.workDuration * 60 : settings.breakDuration * 60;

    await chrome.storage.local.set({ timerState: timerState });

    // Send notification
    if (settings.enableNotifications) {
        const completedType = wasWorkSession ? 'Focus' : 'Break';
        const nextType = timerState.isWorkSession ? 'Focus' : 'Break';

        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: `${completedType} Session Complete!`,
            message: `Great job! Ready for ${nextType.toLowerCase()} session?`
        });
    }

    // Disable website blocking after work session
    if (wasWorkSession) {
        await disableWebsiteBlocking();
    }

    // Update badge
    updateBadge();

    // Notify popup
    try {
        chrome.runtime.sendMessage({ action: 'timerComplete' });
    } catch (error) {
        console.log('Popup not open');
    }
}

// Update extension badge
function updateBadge() {
    if (timerState.isRunning) {
        const minutes = Math.floor(timerState.currentTime / 60);
        chrome.action.setBadgeText({ text: minutes.toString() });
        chrome.action.setBadgeBackgroundColor({ color: timerState.isWorkSession ? '#4CAF50' : '#FF9800' });
    } else {
        chrome.action.setBadgeText({ text: '' });
    }
}

// Website blocking functions
async function enableWebsiteBlocking() {
    if (!settings.blockWebsites) return;

    // Enable declarative rules
    await chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: ['ruleset_1']
    });

    console.log('Website blocking enabled');
}

async function disableWebsiteBlocking() {
    // Disable declarative rules
    await chrome.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: ['ruleset_1']
    });

    console.log('Website blocking disabled');
}

// Record blocked website attempt
async function recordBlockedWebsite() {
    dailyStats.websitesBlocked++;
    await chrome.storage.local.set({ dailyStats: dailyStats });

    // Notify popup if open
    try {
        chrome.runtime.sendMessage({ action: 'updateStats' });
    } catch (error) {
        console.log('Popup not open');
    }
}

// Update settings
async function updateSettings(newSettings) {
    settings = { ...settings, ...newSettings };
    await chrome.storage.local.set({ settings: settings });

    // Update timer durations if changed
    if (!timerState.isRunning) {
        timerState.currentTime = timerState.isWorkSession ? 
            settings.workDuration * 60 : settings.breakDuration * 60;
        await chrome.storage.local.set({ timerState: timerState });
    }
}

// Handle alarms
chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'pomodoro') {
        await completeTimer();
    } else if (alarm.name === 'dailyReset') {
        await checkDailyStatsReset();
    }
});

// Timer tick simulation for accurate display
setInterval(async () => {
    if (timerState.isRunning) {
        const elapsed = Math.floor((Date.now() - timerState.startTime) / 1000);
        const originalTime = timerState.isWorkSession ? settings.workDuration * 60 : settings.breakDuration * 60;
        timerState.currentTime = Math.max(0, originalTime - elapsed);

        await chrome.storage.local.set({ timerState: timerState });

        // Update badge
        updateBadge();

        // Notify popup
        try {
            chrome.runtime.sendMessage({ 
                action: 'timerTick', 
                timeLeft: timerState.currentTime 
            });
        } catch (error) {
            // Popup not open
        }

        // Check if timer should complete
        if (timerState.currentTime <= 0) {
            await completeTimer();
        }
    }
}, 1000);

// Initialize on script load
loadStoredData().then(() => {
    updateBadge();
    checkDailyStatsReset();
});