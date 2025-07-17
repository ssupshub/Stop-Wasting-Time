// Stop Wasting Time - Background Service Worker

class BackgroundManager {
    constructor() {
        this.timerState = {
            isRunning: false,
            isPaused: false,
            currentTime: 0,
            mode: 'work',
            sessionCount: 0
        };

        this.blockingState = {
            isActive: false,
            blockedSites: []
        };

        this.settings = {
            workDuration: 25,
            breakDuration: 5,
            enableNotifications: true,
            enableWebsiteBlocking: true,
            blockedSites: [
                'facebook.com', 'youtube.com', 'twitter.com', 'instagram.com',
                'reddit.com', 'tiktok.com', 'netflix.com', 'twitch.tv',
                'pinterest.com', 'snapchat.com'
            ]
        };

        this.stats = {
            focusTime: 0,
            productivityScore: 0,
            blockedAttempts: 0,
            tasksCompleted: 0
        };

        this.timerAlarmName = 'focusTimer';
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.setupAlarms();
    }

    async loadData() {
        try {
            const result = await chrome.storage.local.get(['timerState', 'blockingState', 'settings', 'stats']);

            if (result.timerState) {
                this.timerState = { ...this.timerState, ...result.timerState };
            }

            if (result.blockingState) {
                this.blockingState = { ...this.blockingState, ...result.blockingState };
            }

            if (result.settings) {
                this.settings = { ...this.settings, ...result.settings };
            }

            if (result.stats) {
                this.stats = { ...this.stats, ...result.stats };
            }
        } catch (error) {
            console.error('Error loading background data:', error);
        }
    }

    async saveData() {
        try {
            await chrome.storage.local.set({
                timerState: this.timerState,
                blockingState: this.blockingState,
                stats: this.stats
            });
        } catch (error) {
            console.error('Error saving background data:', error);
        }
    }

    setupEventListeners() {
        // Handle messages from popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch (request.action) {
                case 'startTimer':
                    this.startTimer(request.timerState, request.settings);
                    break;
                case 'pauseTimer':
                    this.pauseTimer(request.timerState);
                    break;
                case 'stopTimer':
                    this.stopTimer(request.timerState);
                    break;
                case 'enableBlocking':
                    this.enableBlocking(request.sites);
                    break;
                case 'disableBlocking':
                    this.disableBlocking();
                    break;
                case 'getState':
                    sendResponse({
                        timerState: this.timerState,
                        blockingState: this.blockingState,
                        stats: this.stats
                    });
                    break;
            }
        });

        // Handle tab updates for blocking
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && this.blockingState.isActive) {
                this.checkBlockedSite(tab);
            }
        });

        // Handle extension installation
        chrome.runtime.onInstalled.addListener((details) => {
            if (details.reason === 'install') {
                this.onInstall();
            }
        });
    }

    setupAlarms() {
        // Listen for alarm events
        chrome.alarms.onAlarm.addListener((alarm) => {
            if (alarm.name === this.timerAlarmName) {
                this.onTimerTick();
            }
        });
    }

    async onInstall() {
        // Set up default data
        await this.saveData();

        // Show welcome notification
        if (this.settings.enableNotifications) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: 'Stop Wasting Time',
                message: 'Extension installed! Click the icon to start being productive.'
            });
        }
    }

    async startTimer(timerState, settings) {
        this.timerState = timerState;
        this.settings = { ...this.settings, ...settings };

        // Start the alarm for timer ticks
        chrome.alarms.create(this.timerAlarmName, {
            delayInMinutes: 1/60, // 1 second
            periodInMinutes: 1/60
        });

        // Enable blocking if needed
        if (this.settings.enableWebsiteBlocking) {
            await this.enableBlocking(this.settings.blockedSites);
        }

        await this.saveData();

        // Show start notification
        if (this.settings.enableNotifications) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: 'Focus Session Started',
                message: `${this.timerState.mode === 'work' ? 'Work' : 'Break'} session started! Stay focused.`
            });
        }

        // Update badge
        this.updateBadge();
    }

    async pauseTimer(timerState) {
        this.timerState = timerState;

        if (this.timerState.isPaused) {
            chrome.alarms.clear(this.timerAlarmName);
        } else {
            chrome.alarms.create(this.timerAlarmName, {
                delayInMinutes: 1/60,
                periodInMinutes: 1/60
            });
        }

        await this.saveData();
        this.updateBadge();
    }

    async stopTimer(timerState) {
        this.timerState = timerState;

        // Clear the alarm
        chrome.alarms.clear(this.timerAlarmName);

        // Disable blocking
        await this.disableBlocking();

        await this.saveData();

        // Clear badge
        chrome.action.setBadgeText({text: ''});

        // Show stop notification
        if (this.settings.enableNotifications) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: 'Focus Session Stopped',
                message: 'Session stopped. Take a break!'
            });
        }
    }

    async onTimerTick() {
        if (this.timerState.isRunning && !this.timerState.isPaused) {
            this.timerState.currentTime--;

            // Update stats
            if (this.timerState.mode === 'work') {
                this.stats.focusTime += 1/60; // Add 1 minute
            }

            this.updateBadge();

            // Check if time is up
            if (this.timerState.currentTime <= 0) {
                await this.onTimerComplete();
            }

            await this.saveData();

            // Notify popup of update
            try {
                chrome.runtime.sendMessage({
                    action: 'timerUpdate',
                    timerState: this.timerState
                });
            } catch (error) {
                // Popup might be closed, ignore error
            }
        }
    }

    async onTimerComplete() {
        // Switch modes
        const wasWork = this.timerState.mode === 'work';
        this.timerState.mode = wasWork ? 'break' : 'work';

        if (wasWork) {
            this.timerState.sessionCount++;
        }

        // Set new time
        this.timerState.currentTime = this.timerState.mode === 'work' 
            ? this.settings.workDuration * 60 
            : this.settings.breakDuration * 60;

        // Show completion notification
        if (this.settings.enableNotifications) {
            const title = wasWork ? 'Work Session Complete!' : 'Break Time Over!';
            const message = wasWork 
                ? `Great job! Take a ${this.settings.breakDuration} minute break.`
                : `Break time over! Ready for another ${this.settings.workDuration} minute work session?`;

            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: title,
                message: message
            });
        }

        // Auto-start next session or stop
        if (wasWork || this.timerState.sessionCount < 4) {
            // Continue to next session
            this.timerState.isRunning = true;
            this.timerState.isPaused = false;
        } else {
            // Stop after 4 sessions
            this.timerState.isRunning = false;
            this.timerState.isPaused = false;
            chrome.alarms.clear(this.timerAlarmName);
            await this.disableBlocking();
        }

        await this.saveData();
    }

    async enableBlocking(sites) {
        this.blockingState.isActive = true;
        this.blockingState.blockedSites = sites || this.settings.blockedSites;

        // Create dynamic rules for blocking
        const rules = this.blockingState.blockedSites.map((site, index) => ({
            id: index + 1,
            priority: 1,
            action: { type: 'block' },
            condition: {
                urlFilter: `*://*.${site}/*`,
                resourceTypes: ['main_frame']
            }
        }));

        try {
            await chrome.declarativeNetRequest.updateDynamicRules({
                addRules: rules,
                removeRuleIds: rules.map(r => r.id)
            });
        } catch (error) {
            console.error('Error updating blocking rules:', error);
        }

        await this.saveData();

        // Notify popup
        try {
            chrome.runtime.sendMessage({
                action: 'blockingUpdate',
                blockingState: this.blockingState
            });
        } catch (error) {
            // Popup might be closed, ignore error
        }
    }

    async disableBlocking() {
        this.blockingState.isActive = false;

        // Remove all dynamic rules
        try {
            const rules = await chrome.declarativeNetRequest.getDynamicRules();
            const ruleIds = rules.map(rule => rule.id);

            if (ruleIds.length > 0) {
                await chrome.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: ruleIds
                });
            }
        } catch (error) {
            console.error('Error removing blocking rules:', error);
        }

        await this.saveData();

        // Notify popup
        try {
            chrome.runtime.sendMessage({
                action: 'blockingUpdate',
                blockingState: this.blockingState
            });
        } catch (error) {
            // Popup might be closed, ignore error
        }
    }

    async checkBlockedSite(tab) {
        if (!tab.url || !this.blockingState.isActive) return;

        const url = new URL(tab.url);
        const domain = url.hostname.replace('www.', '');

        if (this.blockingState.blockedSites.some(site => domain.includes(site))) {
            this.stats.blockedAttempts++;
            await this.saveData();

            // Show blocked notification
            if (this.settings.enableNotifications) {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/icon48.png',
                    title: 'Site Blocked',
                    message: `${domain} is blocked during focus time. Stay focused!`
                });
            }
        }
    }

    updateBadge() {
        if (this.timerState.isRunning) {
            const minutes = Math.floor(this.timerState.currentTime / 60);
            const badgeText = minutes > 99 ? '99+' : minutes.toString();

            chrome.action.setBadgeText({text: badgeText});
            chrome.action.setBadgeBackgroundColor({
                color: this.timerState.mode === 'work' ? '#3498db' : '#27ae60'
            });
        } else {
            chrome.action.setBadgeText({text: ''});
        }
    }
}

// Initialize background manager
const backgroundManager = new BackgroundManager();

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
    backgroundManager.init();
});

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
    backgroundManager.init();
});