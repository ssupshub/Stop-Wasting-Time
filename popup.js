// DOM Elements
const timerDisplay = document.getElementById('timerDisplay');
const timerStatus = document.getElementById('timerStatus');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const taskProgress = document.getElementById('taskProgress');
const todayFocusTime = document.getElementById('todayFocusTime');
const productivityScore = document.getElementById('productivityScore');
const settingsBtn = document.getElementById('settingsBtn');
const statsBtn = document.getElementById('statsBtn');

// State variables
let isRunning = false;
let currentTime = 25 * 60; // 25 minutes in seconds
let workTime = 25 * 60;
let breakTime = 5 * 60;
let isWorkSession = true;
let tasks = [];
let settings = {
    workDuration: 25,
    breakDuration: 5,
    enableNotifications: true,
    blockWebsites: true,
    theme: 'default'
};

// Initialize popup
document.addEventListener('DOMContentLoaded', async function() {
    await loadSettings();
    await loadTasks();
    await updateStats();
    setupEventListeners();
    updateTimerDisplay();
    updateTaskList();

    // Check if timer is running
    const result = await chrome.storage.local.get(['timerState']);
    if (result.timerState) {
        isRunning = result.timerState.isRunning;
        currentTime = result.timerState.currentTime;
        isWorkSession = result.timerState.isWorkSession;
        updateUIState();
    }
});

// Load settings from storage
async function loadSettings() {
    const result = await chrome.storage.local.get(['settings']);
    if (result.settings) {
        settings = { ...settings, ...result.settings };
        workTime = settings.workDuration * 60;
        breakTime = settings.breakDuration * 60;
        if (isWorkSession) {
            currentTime = workTime;
        } else {
            currentTime = breakTime;
        }
    }
}

// Load tasks from storage
async function loadTasks() {
    const result = await chrome.storage.local.get(['tasks']);
    if (result.tasks) {
        tasks = result.tasks;
    }
}

// Save tasks to storage
async function saveTasks() {
    await chrome.storage.local.set({ tasks: tasks });
}

// Setup event listeners
function setupEventListeners() {
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    settingsBtn.addEventListener('click', openSettings);
    statsBtn.addEventListener('click', showStats);
}

// Timer functions
async function startTimer() {
    isRunning = true;
    updateUIState();

    // Send message to background script to start timer
    await chrome.runtime.sendMessage({
        action: 'startTimer',
        duration: currentTime,
        isWorkSession: isWorkSession
    });

    // Start website blocking if enabled
    if (settings.blockWebsites && isWorkSession) {
        await chrome.runtime.sendMessage({ action: 'enableBlocking' });
    }
}

async function pauseTimer() {
    isRunning = false;
    updateUIState();

    await chrome.runtime.sendMessage({ action: 'pauseTimer' });

    // Disable website blocking
    await chrome.runtime.sendMessage({ action: 'disableBlocking' });
}

async function resetTimer() {
    isRunning = false;
    currentTime = isWorkSession ? workTime : breakTime;
    updateUIState();
    updateTimerDisplay();

    await chrome.runtime.sendMessage({ action: 'resetTimer' });
    await chrome.runtime.sendMessage({ action: 'disableBlocking' });
}

// Update UI state based on timer status
function updateUIState() {
    if (isRunning) {
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
        timerStatus.textContent = isWorkSession ? 'Focus Mode Active' : 'Break Time';
        document.querySelector('.timer-circle').classList.add('active');
    } else {
        startBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
        timerStatus.textContent = isWorkSession ? 'Ready to Focus' : 'Break Time';
        document.querySelector('.timer-circle').classList.remove('active');
    }
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Task management functions
async function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString()
        };
        tasks.push(task);
        await saveTasks();
        updateTaskList();
        taskInput.value = '';
        updateStats();
    }
}

async function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        await saveTasks();
        updateTaskList();
        updateStats();
    }
}

async function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    await saveTasks();
    updateTaskList();
    updateStats();
}

function updateTaskList() {
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <button class="task-delete" onclick="deleteTask(${task.id})">×</button>
        `;
        taskList.appendChild(taskItem);
    });

    // Update task progress
    const completedTasks = tasks.filter(t => t.completed).length;
    taskProgress.textContent = `${completedTasks} of ${tasks.length} tasks completed`;
}

// Statistics functions
async function updateStats() {
    const result = await chrome.storage.local.get(['dailyStats']);
    const stats = result.dailyStats || { focusTime: 0, completedTasks: 0, totalTasks: 0 };

    // Update focus time display
    const focusHours = Math.floor(stats.focusTime / 3600);
    const focusMinutes = Math.floor((stats.focusTime % 3600) / 60);
    if (focusHours > 0) {
        todayFocusTime.textContent = `${focusHours}h ${focusMinutes}m`;
    } else {
        todayFocusTime.textContent = `${focusMinutes}m`;
    }

    // Calculate productivity score
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    let score = 0;

    if (totalTasks > 0) {
        score = Math.round((completedTasks / totalTasks) * 100);
    }

    if (stats.focusTime > 0) {
        // Bonus for focus time (up to 25 points)
        const focusBonus = Math.min(25, Math.floor(stats.focusTime / 60 / 5));
        score = Math.min(100, score + focusBonus);
    }

    productivityScore.textContent = `${score}%`;
}

// Open settings page
function openSettings() {
    chrome.runtime.openOptionsPage();
}

// Show statistics
function showStats() {
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html#stats') });
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === 'timerTick') {
        currentTime = message.timeLeft;
        updateTimerDisplay();
    } else if (message.action === 'timerComplete') {
        isRunning = false;
        isWorkSession = !isWorkSession;
        currentTime = isWorkSession ? workTime : breakTime;
        updateUIState();
        updateTimerDisplay();
        updateStats();
    } else if (message.action === 'updateStats') {
        await updateStats();
    }
});

// Make functions globally accessible
window.toggleTask = toggleTask;
window.deleteTask = deleteTask;

// Refresh timer state every second when popup is open
setInterval(async () => {
    if (isRunning) {
        const result = await chrome.storage.local.get(['timerState']);
        if (result.timerState) {
            currentTime = result.timerState.currentTime;
            isRunning = result.timerState.isRunning;
            isWorkSession = result.timerState.isWorkSession;
            updateTimerDisplay();
            updateUIState();
        }
    }
}, 1000);