// Stop Wasting Time - Options Page Script

class OptionsManager {
    constructor() {
        this.defaultSettings = {
            workDuration: 25,
            breakDuration: 5,
            longBreakDuration: 15,
            enableNotifications: true,
            enableWebsiteBlocking: true,
            enableTaskTracking: true,
            autoStartBreaks: false,
            autoStartWork: false,
            sessionStartNotifications: true,
            sessionEndNotifications: true,
            blockingNotifications: true,
            taskCompletionNotifications: true,
            resetTasksDaily: true,
            maxTasks: 10,
            collectStatistics: true,
            showProgressBadge: true,
            theme: 'light',
            accentColor: '#3498db',
            notificationSound: 'default',
            blockedSites: [
                'facebook.com', 'youtube.com', 'twitter.com', 'instagram.com',
                'reddit.com', 'tiktok.com', 'netflix.com', 'twitch.tv',
                'pinterest.com', 'snapchat.com'
            ]
        };

        this.settings = { ...this.defaultSettings };
        this.stats = {
            totalFocusTime: 0,
            totalSessions: 0,
            totalTasks: 0,
            totalBlocked: 0
        };

        this.init();
    }

    async init() {
        await this.loadSettings();
        this.setupEventListeners();
        this.populateForm();
        this.updateStats();
        this.applyTheme();
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.local.get(['settings', 'stats']);

            if (result.settings) {
                this.settings = { ...this.defaultSettings, ...result.settings };
            }

            if (result.stats) {
                this.stats = { ...this.stats, ...result.stats };
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    async saveSettings() {
        try {
            await chrome.storage.local.set({
                settings: this.settings
            });

            this.showSuccessMessage();
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    setupEventListeners() {
        // Save button
        document.getElementById('save-settings').addEventListener('click', () => {
            this.collectFormData();
            this.saveSettings();
        });

        // Reset button
        document.getElementById('reset-settings').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all settings to default?')) {
                this.resetToDefaults();
            }
        });

        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Theme select
        document.getElementById('theme-select').addEventListener('change', (e) => {
            this.settings.theme = e.target.value;
            this.applyTheme();
        });

        // Accent color
        document.getElementById('accent-color').addEventListener('change', (e) => {
            this.settings.accentColor = e.target.value;
            this.applyAccentColor();
        });

        document.getElementById('reset-color').addEventListener('click', () => {
            this.settings.accentColor = '#3498db';
            document.getElementById('accent-color').value = '#3498db';
            this.applyAccentColor();
        });

        // Blocked sites management
        document.getElementById('add-site').addEventListener('click', () => {
            this.addBlockedSite();
        });

        document.getElementById('site-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addBlockedSite();
            }
        });

        document.getElementById('restore-default-sites').addEventListener('click', () => {
            this.restoreDefaultSites();
        });

        // Data management
        document.getElementById('export-data').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('clear-data').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                this.clearAllData();
            }
        });

        // Form validation
        const numberInputs = document.querySelectorAll('input[type="number"]');
        numberInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const min = parseInt(e.target.min);
                const max = parseInt(e.target.max);
                let value = parseInt(e.target.value);

                if (value < min) {
                    e.target.value = min;
                } else if (value > max) {
                    e.target.value = max;
                }
            });
        });
    }

    populateForm() {
        // Timer settings
        document.getElementById('work-duration').value = this.settings.workDuration;
        document.getElementById('break-duration').value = this.settings.breakDuration;
        document.getElementById('long-break-duration').value = this.settings.longBreakDuration;
        document.getElementById('auto-start-breaks').checked = this.settings.autoStartBreaks;
        document.getElementById('auto-start-work').checked = this.settings.autoStartWork;

        // Blocking settings
        document.getElementById('enable-blocking').checked = this.settings.enableWebsiteBlocking;

        // Notification settings
        document.getElementById('enable-notifications').checked = this.settings.enableNotifications;
        document.getElementById('session-start-notifications').checked = this.settings.sessionStartNotifications;
        document.getElementById('session-end-notifications').checked = this.settings.sessionEndNotifications;
        document.getElementById('blocking-notifications').checked = this.settings.blockingNotifications;
        document.getElementById('notification-sound').value = this.settings.notificationSound;

        // Task settings
        document.getElementById('enable-task-tracking').checked = this.settings.enableTaskTracking;
        document.getElementById('reset-tasks-daily').checked = this.settings.resetTasksDaily;
        document.getElementById('max-tasks').value = this.settings.maxTasks;
        document.getElementById('task-completion-notifications').checked = this.settings.taskCompletionNotifications;

        // Statistics settings
        document.getElementById('collect-statistics').checked = this.settings.collectStatistics;

        // Appearance settings
        document.getElementById('theme-select').value = this.settings.theme;
        document.getElementById('accent-color').value = this.settings.accentColor;
        document.getElementById('show-progress-badge').checked = this.settings.showProgressBadge;

        // Populate blocked sites
        this.updateBlockedSitesList();
    }

    collectFormData() {
        // Timer settings
        this.settings.workDuration = parseInt(document.getElementById('work-duration').value);
        this.settings.breakDuration = parseInt(document.getElementById('break-duration').value);
        this.settings.longBreakDuration = parseInt(document.getElementById('long-break-duration').value);
        this.settings.autoStartBreaks = document.getElementById('auto-start-breaks').checked;
        this.settings.autoStartWork = document.getElementById('auto-start-work').checked;

        // Blocking settings
        this.settings.enableWebsiteBlocking = document.getElementById('enable-blocking').checked;

        // Notification settings
        this.settings.enableNotifications = document.getElementById('enable-notifications').checked;
        this.settings.sessionStartNotifications = document.getElementById('session-start-notifications').checked;
        this.settings.sessionEndNotifications = document.getElementById('session-end-notifications').checked;
        this.settings.blockingNotifications = document.getElementById('blocking-notifications').checked;
        this.settings.notificationSound = document.getElementById('notification-sound').value;

        // Task settings
        this.settings.enableTaskTracking = document.getElementById('enable-task-tracking').checked;
        this.settings.resetTasksDaily = document.getElementById('reset-tasks-daily').checked;
        this.settings.maxTasks = parseInt(document.getElementById('max-tasks').value);
        this.settings.taskCompletionNotifications = document.getElementById('task-completion-notifications').checked;

        // Statistics settings
        this.settings.collectStatistics = document.getElementById('collect-statistics').checked;

        // Appearance settings
        this.settings.theme = document.getElementById('theme-select').value;
        this.settings.accentColor = document.getElementById('accent-color').value;
        this.settings.showProgressBadge = document.getElementById('show-progress-badge').checked;
    }

    addBlockedSite() {
        const input = document.getElementById('site-input');
        const site = input.value.trim().toLowerCase();

        if (site && !this.settings.blockedSites.includes(site)) {
            // Validate domain format
            if (this.isValidDomain(site)) {
                this.settings.blockedSites.push(site);
                this.updateBlockedSitesList();
                input.value = '';
            } else {
                alert('Please enter a valid domain name (e.g., facebook.com)');
            }
        }
    }

    removeBlockedSite(site) {
        const index = this.settings.blockedSites.indexOf(site);
        if (index > -1) {
            this.settings.blockedSites.splice(index, 1);
            this.updateBlockedSitesList();
        }
    }

    updateBlockedSitesList() {
        const container = document.getElementById('blocked-sites-list');
        container.innerHTML = '';

        if (this.settings.blockedSites.length === 0) {
            container.innerHTML = '<div class="text-muted text-center">No blocked sites. Add some above.</div>';
            return;
        }

        this.settings.blockedSites.forEach(site => {
            const item = document.createElement('div');
            item.className = 'blocked-site-item';
            item.innerHTML = `
                <span class="blocked-site-name">${site}</span>
                <button class="blocked-site-remove" onclick="optionsManager.removeBlockedSite('${site}')">×</button>
            `;
            container.appendChild(item);
        });
    }

    restoreDefaultSites() {
        this.settings.blockedSites = [...this.defaultSettings.blockedSites];
        this.updateBlockedSitesList();
    }

    isValidDomain(domain) {
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
        return domainRegex.test(domain);
    }

    async updateStats() {
        try {
            const result = await chrome.storage.local.get(['stats']);
            if (result.stats) {
                this.stats = { ...this.stats, ...result.stats };
            }

            // Update UI
            const focusHours = Math.floor(this.stats.totalFocusTime / 60);
            const focusMinutes = this.stats.totalFocusTime % 60;
            document.getElementById('total-focus-time').textContent = `${focusHours}h ${focusMinutes}m`;
            document.getElementById('total-sessions').textContent = this.stats.totalSessions;
            document.getElementById('total-tasks').textContent = this.stats.totalTasks;
            document.getElementById('total-blocked').textContent = this.stats.totalBlocked;
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    async exportData() {
        try {
            const result = await chrome.storage.local.get();
            const data = {
                settings: this.settings,
                stats: this.stats,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `stop-wasting-time-data-${new Date().toISOString().split('T')[0]}.json`;
            a.click();

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting data:', error);
        }
    }

    async clearAllData() {
        try {
            await chrome.storage.local.clear();
            this.settings = { ...this.defaultSettings };
            this.stats = {
                totalFocusTime: 0,
                totalSessions: 0,
                totalTasks: 0,
                totalBlocked: 0
            };
            this.populateForm();
            this.updateStats();
            this.showSuccessMessage('All data cleared successfully!');
        } catch (error) {
            console.error('Error clearing data:', error);
        }
    }

    resetToDefaults() {
        this.settings = { ...this.defaultSettings };
        this.populateForm();
        this.applyTheme();
        this.applyAccentColor();
        this.showSuccessMessage('Settings reset to defaults!');
    }

    toggleTheme() {
        const currentTheme = this.settings.theme;
        this.settings.theme = currentTheme === 'dark' ? 'light' : 'dark';
        document.getElementById('theme-select').value = this.settings.theme;
        this.applyTheme();
    }

    applyTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');

        if (this.settings.theme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️ Light Mode';
        } else {
            body.setAttribute('data-theme', 'light');
            themeToggle.textContent = '🌙 Dark Mode';
        }
    }

    applyAccentColor() {
        document.documentElement.style.setProperty('--primary-color', this.settings.accentColor);

        // Calculate hover color (slightly darker)
        const hoverColor = this.darkenColor(this.settings.accentColor, 10);
        document.documentElement.style.setProperty('--primary-hover', hoverColor);
    }

    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;

        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    showSuccessMessage(message = 'Settings saved successfully!') {
        const successEl = document.getElementById('success-message');
        const textEl = successEl.querySelector('.success-text');

        textEl.textContent = message;
        successEl.classList.remove('hidden');

        setTimeout(() => {
            successEl.classList.add('hidden');
        }, 3000);
    }
}

// Initialize options manager when DOM is loaded
let optionsManager;
document.addEventListener('DOMContentLoaded', () => {
    optionsManager = new OptionsManager();
});