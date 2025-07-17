// Content script for Stop Wasting Time Extension
// Handles website blocking and displays motivational blocking page

// Check if this is a blocked website
(function() {
    'use strict';

    // List of blocked domains (will be filtered by declarativeNetRequest)
    const blockedDomains = [
        'facebook.com',
        'instagram.com',
        'twitter.com',
        'youtube.com',
        'reddit.com',
        'tiktok.com',
        'snapchat.com',
        'pinterest.com',
        'linkedin.com',
        'twitch.tv',
        'netflix.com',
        'discord.com',
        'whatsapp.com',
        'telegram.org',
        'tumblr.com',
        '9gag.com',
        'buzzfeed.com',
        'imgur.com'
    ];

    // Motivational quotes
    const motivationalQuotes = [
        "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
        "The way to get started is to quit talking and begin doing. - Walt Disney",
        "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
        "The future depends on what you do today. - Mahatma Gandhi",
        "Focus on being productive instead of busy. - Tim Ferriss",
        "Time is what we want most, but what we use worst. - William Penn",
        "You don't have to be great to get started, but you have to get started to be great. - Les Brown",
        "The successful warrior is the average man with laser-like focus. - Bruce Lee",
        "Concentration is the secret of strength. - Ralph Waldo Emerson",
        "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. - Steve Jobs"
    ];

    // Check if current domain is blocked
    function isBlockedDomain() {
        const currentDomain = window.location.hostname.toLowerCase();
        return blockedDomains.some(domain => 
            currentDomain.includes(domain) || currentDomain.endsWith(domain)
        );
    }

    // Get random motivational quote
    function getRandomQuote() {
        return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    }

    // Create blocking page
    function createBlockingPage() {
        // Clear the page
        document.documentElement.innerHTML = '';

        // Create new page structure
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Focus Mode Active - Stop Wasting Time</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    text-align: center;
                    padding: 20px;
                }

                .container {
                    max-width: 600px;
                    width: 100%;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 40px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                }

                .icon {
                    font-size: 80px;
                    margin-bottom: 20px;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }

                h1 {
                    font-size: 2.5em;
                    margin-bottom: 20px;
                    font-weight: 300;
                }

                .message {
                    font-size: 1.2em;
                    margin-bottom: 30px;
                    line-height: 1.6;
                    opacity: 0.9;
                }

                .quote {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 20px;
                    border-radius: 10px;
                    margin: 30px 0;
                    font-style: italic;
                    font-size: 1.1em;
                    line-height: 1.6;
                    border-left: 4px solid #ffeb3b;
                }

                .stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 20px;
                    margin: 30px 0;
                }

                .stat-item {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 20px;
                    border-radius: 10px;
                    text-align: center;
                }

                .stat-number {
                    font-size: 2em;
                    font-weight: bold;
                    color: #ffeb3b;
                    display: block;
                }

                .stat-label {
                    font-size: 0.9em;
                    opacity: 0.8;
                    margin-top: 5px;
                }

                .tips {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 20px;
                    border-radius: 10px;
                    margin: 30px 0;
                    text-align: left;
                }

                .tips h3 {
                    margin-bottom: 15px;
                    color: #ffeb3b;
                }

                .tips ul {
                    list-style: none;
                    padding: 0;
                }

                .tips li {
                    padding: 5px 0;
                    padding-left: 20px;
                    position: relative;
                }

                .tips li:before {
                    content: "✓";
                    position: absolute;
                    left: 0;
                    color: #4CAF50;
                    font-weight: bold;
                }

                .back-button {
                    background: linear-gradient(45deg, #4CAF50, #8BC34A);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 25px;
                    font-size: 1.1em;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 20px;
                }

                .back-button:hover {
                    background: linear-gradient(45deg, #45a049, #7cb342);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }

                .blocked-site {
                    color: #ffeb3b;
                    font-weight: bold;
                }

                @media (max-width: 768px) {
                    .container {
                        padding: 30px 20px;
                    }

                    h1 {
                        font-size: 2em;
                    }

                    .icon {
                        font-size: 60px;
                    }

                    .stats {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="icon">🎯</div>
                <h1>Focus Mode Active</h1>
                <div class="message">
                    You're trying to access <span class="blocked-site">${window.location.hostname}</span> during your focus session. Stay strong and keep working towards your goals!
                </div>

                <div class="quote" id="motivationalQuote">
                    ${getRandomQuote()}
                </div>

                <div class="stats" id="statsContainer">
                    <div class="stat-item">
                        <span class="stat-number" id="blockedCount">0</span>
                        <span class="stat-label">Sites Blocked Today</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="focusTime">0m</span>
                        <span class="stat-label">Focus Time Today</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="sessions">0</span>
                        <span class="stat-label">Sessions Completed</span>
                    </div>
                </div>

                <div class="tips">
                    <h3>💡 Productivity Tips</h3>
                    <ul>
                        <li>Take deep breaths and refocus on your current task</li>
                        <li>Write down what you want to accomplish this session</li>
                        <li>Use the Pomodoro technique: 25 minutes work, 5 minutes break</li>
                        <li>Eliminate distractions from your workspace</li>
                        <li>Reward yourself after completing tasks</li>
                    </ul>
                </div>

                <button class="back-button" onclick="history.back()">
                    ← Return to Previous Page
                </button>
            </div>

            <script>
                // Load and display statistics
                if (typeof chrome !== 'undefined' && chrome.storage) {
                    chrome.storage.local.get(['dailyStats'], function(result) {
                        if (result.dailyStats) {
                            const stats = result.dailyStats;
                            document.getElementById('blockedCount').textContent = stats.websitesBlocked || 0;
                            document.getElementById('sessions').textContent = stats.sessionsCompleted || 0;

                            // Format focus time
                            const focusMinutes = Math.floor((stats.focusTime || 0) / 60);
                            const focusHours = Math.floor(focusMinutes / 60);
                            const remainingMinutes = focusMinutes % 60;

                            if (focusHours > 0) {
                                document.getElementById('focusTime').textContent = focusHours + 'h ' + remainingMinutes + 'm';
                            } else {
                                document.getElementById('focusTime').textContent = focusMinutes + 'm';
                            }
                        }
                    });
                }

                // Notify background script about blocked attempt
                if (typeof chrome !== 'undefined' && chrome.runtime) {
                    chrome.runtime.sendMessage({ action: 'websiteBlocked' });
                }

                // Change quote every 10 seconds
                setInterval(function() {
                    const quotes = [
                        "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
                        "The way to get started is to quit talking and begin doing. - Walt Disney",
                        "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
                        "The future depends on what you do today. - Mahatma Gandhi",
                        "Focus on being productive instead of busy. - Tim Ferriss",
                        "Time is what we want most, but what we use worst. - William Penn",
                        "You don't have to be great to get started, but you have to get started to be great. - Les Brown",
                        "The successful warrior is the average man with laser-like focus. - Bruce Lee",
                        "Concentration is the secret of strength. - Ralph Waldo Emerson",
                        "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. - Steve Jobs"
                    ];

                    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                    document.getElementById('motivationalQuote').textContent = randomQuote;
                }, 10000);

                // Prevent bypassing
                window.addEventListener('beforeunload', function(e) {
                    e.preventDefault();
                    return '';
                });

                // Block common bypass attempts
                document.addEventListener('keydown', function(e) {
                    // Block F12, Ctrl+Shift+I, Ctrl+U, etc.
                    if (e.keyCode === 123 || 
                        (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
                        (e.ctrlKey && e.keyCode === 85)) {
                        e.preventDefault();
                        return false;
                    }
                });

                // Block right-click context menu
                document.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    return false;
                });
            </script>
        </body>
        </html>
        `;

        document.documentElement.innerHTML = html;

        // Record blocked attempt
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.sendMessage({ action: 'websiteBlocked' });
        }
    }

    // Check if we should show blocking page
    function checkBlocking() {
        if (isBlockedDomain()) {
            // Check if timer is running and blocking is enabled
            if (typeof chrome !== 'undefined' && chrome.storage) {
                chrome.storage.local.get(['timerState', 'settings'], function(result) {
                    const timerState = result.timerState || {};
                    const settings = result.settings || {};

                    if (timerState.isRunning && timerState.isWorkSession && settings.blockWebsites !== false) {
                        createBlockingPage();
                    }
                });
            }
        }
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkBlocking);
    } else {
        checkBlocking();
    }

    // Also check on page changes (for SPAs)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            checkBlocking();
        }
    }).observe(document, { subtree: true, childList: true });

})();