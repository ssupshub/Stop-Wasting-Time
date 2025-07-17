// Stop Wasting Time - Popup Script

class PopupManager {
    constructor() {
        this.defaultSettings = {
            workDuration: 25,
            breakDuration: 5,
            enableNotifications: true,
            enableWebsiteBlocking: true,
            enableTaskTracking: true,
            darkMode: false,
            blockedSites: [
                'facebook.com', 'youtube.com', 'twitter.com', 'instagram.com',
                'reddit.com', 'tiktok.com', 'netflix.com', 'twitch.tv',
                'pinterest.com', 'snapchat.com'
            ]
        };

        this.motivationalQuotes = [
            "Focus is the key to productivity",
            "Every moment counts towards your goals",
            "Discipline is choosing between what you want now and what you want most",
            "Success is the sum of small efforts repeated day in and day out",
            "The future depends on what you do today",
            "Don't watch the clock; do what it does. Keep going",
            "Focus on being productive instead of being busy"
        ];

        this.state = {
            timer: {
                isRunning: false,
                isPaused: false,
                currentTime: 0,
                mode: 'work',
                sessionCount: 0
            },
            blocking: {
                isActive: false
            },
            tasks: [],
            stats: {
                focusTime: 0,
                productivityScore: 0,
                blockedAttempts: 0,
                tasksCompleted: 0
            }
        };

        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.updateUI();
        this.displayRandomQuote();
        this.updateTimerDisplay();
    }

    async loadData() {
        try {
            const result = await chrome.storage.local.get(['timerState', 'tasks', 'settings', 'stats', 'blocking']);

            if (result.timerState) {
                this.state.timer = { ...this.state.timer, ...result.timerState };
            }

            if (result.tasks) {
                this.state.tasks = result.tasks;
            }

            if (result.stats) {
                this.state.stats = { ...this.state.stats, ...result.stats };
            }

            if (result.blocking) {
                this.state.blocking = { ...this.state.blocking, ...result.blocking };
            }

            if (result.settings) {
                this.defaultSettings = { ...this.defaultSettings, ...result.settings };
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    async saveData() {
        try {
            await chrome.storage.local.set({
                timerState: this.state.timer,
                tasks: this.state.tasks,
                stats: this.state.stats,
                blocking: this.state.blocking
            });
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    setupEventListeners() {
        // Timer controls
        document.getElementById('start-timer').addEventListener('click', () => this.startTimer());
        document.getElementById('pause-timer').addEventListener('click', () => this.pauseTimer());
        document.getElementById('stop-timer').addEventListener('click', () => this.stopTimer());

        // Blocking controls
        document.getElementById('toggle-blocking').addEventListener('click', () => this.toggleBlocking());

        // Task management
        document.getElementById('add-task').addEventListener('click', () => this.addTask());
        document.getElementById('task-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });

        // Settings and theme
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('settings-btn').addEventListener('click', () => this.openSettings());
        document.getElementById('options-link').addEventListener('click', () => this.openSettings());

        // Listen for background script updates
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'timerUpdate') {
                this.state.timer = request.timerState;
                this.updateTimerDisplay();
            } else if (request.action === 'blockingUpdate') {
                this.state.blocking = request.blockingState;
                this.updateBlockingStatus();
            }
        });
    }

    async startTimer() {
        if (!this.state.timer.isRunning) {
            this.state.timer.isRunning = true;
            this.state.timer.isPaused = false;
            this.state.timer.currentTime = this.state.timer.mode === 'work' 
                ? this.defaultSettings.workDuration * 60 
                : this.defaultSettings.breakDuration * 60;

            // Start blocking if enabled
            if (this.defaultSettings.enableWebsiteBlocking) {
                await this.enableBlocking();
            }

            // Notify background script
            chrome.runtime.sendMessage({
                action: 'startTimer',
                timerState: this.state.timer,
                settings: this.defaultSettings
            });

            this.updateTimerControls();
            this.saveData();
        }
    }

    async pauseTimer() {
        if (this.state.timer.isRunning) {
            this.state.timer.isPaused = !this.state.timer.isPaused;

            chrome.runtime.sendMessage({
                action: 'pauseTimer',
                timerState: this.state.timer
            });

            this.updateTimerControls();
            this.saveData();
        }
    }

    async stopTimer() {
        this.state.timer.isRunning = false;
        this.state.timer.isPaused = false;
        this.state.timer.currentTime = 0;

        // Stop blocking
        await this.disableBlocking();

        chrome.runtime.sendMessage({
            action: 'stopTimer',
            timerState: this.state.timer
        });

        this.updateTimerControls();
        this.updateTimerDisplay();
        this.saveData();
    }

    async toggleBlocking() {
        if (this.state.blocking.isActive) {
            await this.disableBlocking();
        } else {
            await this.enableBlocking();
        }
    }

    async enableBlocking() {
        this.state.blocking.isActive = true;

        chrome.runtime.sendMessage({
            action: 'enableBlocking',
            sites: this.defaultSettings.blockedSites
        });

        this.updateBlockingStatus();
        this.saveData();
    }

    async disableBlocking() {
        this.state.blocking.isActive = false;

        chrome.runtime.sendMessage({
            action: 'disableBlocking'
        });

        this.updateBlockingStatus();
        this.saveData();
    }

    addTask() {
        const input = document.getElementById('task-input');
        const taskText = input.value.trim();

        if (taskText) {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false,
                createdAt: new Date().toISOString()
            };

            this.state.tasks.push(task);
            input.value = '';
            this.updateTasksList();
            this.saveData();
        }
    }

    toggleTask(taskId) {
        const task = this.state.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            if (task.completed) {
                this.state.stats.tasksCompleted++;
            } else {
                this.state.stats.tasksCompleted--;
            }
            this.updateTasksList();
            this.updateStats();
            this.saveData();
        }
    }

    deleteTask(taskId) {
        const taskIndex = this.state.tasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            const task = this.state.tasks[taskIndex];
            if (task.completed) {
                this.state.stats.tasksCompleted--;
            }
            this.state.tasks.splice(taskIndex, 1);
            this.updateTasksList();
            this.updateStats();
            this.saveData();
        }
    }

    updateUI() {
        this.updateTimerDisplay();
        this.updateTimerControls();
        this.updateBlockingStatus();
        this.updateTasksList();
        this.updateStats();
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.state.timer.currentTime / 60);
        const seconds = this.state.timer.currentTime % 60;

        document.getElementById('timer-minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('timer-seconds').textContent = seconds.toString().padStart(2, '0');
        document.getElementById('current-mode').textContent = this.state.timer.mode === 'work' ? 'Work Session' : 'Break Time';
        document.getElementById('session-count').textContent = this.state.timer.sessionCount;

        // Update circle animation
        const circle = document.querySelector('.timer-circle');
        if (this.state.timer.isRunning && !this.state.timer.isPaused) {
            circle.classList.add('active');
        } else {
            circle.classList.remove('active');
        }
    }

    updateTimerControls() {
        const startBtn = document.getElementById('start-timer');
        const pauseBtn = document.getElementById('pause-timer');
        const stopBtn = document.getElementById('stop-timer');

        if (this.state.timer.isRunning) {
            startBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
            stopBtn.classList.remove('hidden');

            if (this.state.timer.isPaused) {
                pauseBtn.textContent = 'Resume';
            } else {
                pauseBtn.textContent = 'Pause';
            }
        } else {
            startBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
            stopBtn.classList.add('hidden');
        }
    }

    updateBlockingStatus() {
        const statusElement = document.getElementById('blocking-status');
        const toggleBtn = document.getElementById('toggle-blocking');
        const sitesCount = document.getElementById('blocked-sites-count');
        const sitesPreview = document.getElementById('blocked-sites-preview');

        if (this.state.blocking.isActive) {
            statusElement.textContent = 'Active';
            statusElement.className = 'active';
            toggleBtn.textContent = 'Disable Blocking';
        } else {
            statusElement.textContent = 'Inactive';
            statusElement.className = 'inactive';
            toggleBtn.textContent = 'Enable Blocking';
        }

        // Update sites count and preview
        const blockedSites = this.defaultSettings.blockedSites || [];
        sitesCount.textContent = `${blockedSites.length} sites blocked`;

        sitesPreview.innerHTML = '';
        blockedSites.slice(0, 5).forEach(site => {
            const tag = document.createElement('span');
            tag.className = 'blocked-site-tag';
            tag.textContent = site.replace('.com', '');
            sitesPreview.appendChild(tag);
        });

        if (blockedSites.length > 5) {
            const more = document.createElement('span');
            more.className = 'blocked-site-tag';
            more.textContent = `+${blockedSites.length - 5} more`;
            sitesPreview.appendChild(more);
        }
    }

    updateTasksList() {
        const tasksList = document.getElementById('tasks-list');
        const tasksCompleted = document.getElementById('tasks-completed');
        const tasksTotal = document.getElementById('tasks-total');

        tasksList.innerHTML = '';

        if (this.state.tasks.length === 0) {
            tasksList.innerHTML = '<div class="text-muted text-center">No tasks yet. Add one above!</div>';
        } else {
            this.state.tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = 'task-item';
                taskItem.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                           onchange="popup.toggleTask(${task.id})">
                    <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                    <button class="task-delete" onclick="popup.deleteTask(${task.id})">✕</button>
                `;
                tasksList.appendChild(taskItem);
            });
        }

        const completedCount = this.state.tasks.filter(t => t.completed).length;
        tasksCompleted.textContent = completedCount;
        tasksTotal.textContent = this.state.tasks.length;
    }

    updateStats() {
        const focusTimeEl = document.getElementById('focus-time');
        const productivityScoreEl = document.getElementById('productivity-score');
        const blockedAttemptsEl = document.getElementById('blocked-attempts');

        // Convert focus time to hours and minutes
        const hours = Math.floor(this.state.stats.focusTime / 60);
        const minutes = this.state.stats.focusTime % 60;
        focusTimeEl.textContent = `${hours}h ${minutes}m`;

        // Calculate productivity score
        const score = Math.min(100, Math.round((this.state.stats.focusTime / 60) * 10 + this.state.stats.tasksCompleted * 5));
        productivityScoreEl.textContent = `${score}%`;

        blockedAttemptsEl.textContent = this.state.stats.blockedAttempts;
    }

    displayRandomQuote() {
        const quote = this.motivationalQuotes[Math.floor(Math.random() * this.motivationalQuotes.length)];
        document.getElementById('daily-quote').textContent = quote;
    }

    toggleTheme() {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        body.setAttribute('data-theme', newTheme);

        // Save theme preference
        chrome.storage.local.set({ theme: newTheme });

        // Update button icon
        const themeBtn = document.getElementById('theme-toggle');
        themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }

    openSettings() {
        chrome.runtime.openOptionsPage();
    }
}

// Initialize popup when DOM is loaded
let popup;
document.addEventListener('DOMContentLoaded', () => {
    popup = new PopupManager();
});

// Load saved theme
chrome.storage.local.get(['theme'], (result) => {
    if (result.theme) {
        document.body.setAttribute('data-theme', result.theme);
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.textContent = result.theme === 'dark' ? '☀️' : '🌙';
        }
    }
});