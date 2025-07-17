// Stop Wasting Time - Content Script

(function() {
    'use strict';

    class ContentBlocker {
        constructor() {
            this.blockedSites = [];
            this.isBlocked = false;
            this.checkInterval = null;
            this.init();
        }

        async init() {
            // Get current blocking state
            const response = await chrome.runtime.sendMessage({action: 'getState'});

            if (response && response.blockingState) {
                this.blockedSites = response.blockingState.blockedSites || [];
                this.isBlocked = response.blockingState.isActive;

                if (this.isBlocked) {
                    this.checkCurrentSite();
                }
            }

            // Listen for blocking state changes
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                if (request.action === 'blockingUpdate') {
                    this.blockedSites = request.blockingState.blockedSites || [];
                    this.isBlocked = request.blockingState.isActive;

                    if (this.isBlocked) {
                        this.checkCurrentSite();
                    } else {
                        this.unblockSite();
                    }
                }
            });
        }

        checkCurrentSite() {
            const currentDomain = window.location.hostname.replace('www.', '');

            // Check if current site is in blocked list
            const isCurrentSiteBlocked = this.blockedSites.some(site => 
                currentDomain.includes(site) || site.includes(currentDomain)
            );

            if (isCurrentSiteBlocked) {
                this.blockSite();
            } else {
                this.unblockSite();
            }
        }

        blockSite() {
            // Remove existing blocked content if any
            this.unblockSite();

            // Create blocking overlay
            const overlay = this.createBlockingOverlay();
            document.body.appendChild(overlay);

            // Hide original content
            document.body.style.overflow = 'hidden';

            // Add blocked class
            document.body.classList.add('swt-blocked');

            // Start monitoring for attempts to remove blocking
            this.startMonitoring();
        }

        unblockSite() {
            // Remove blocking overlay
            const overlay = document.getElementById('swt-blocking-overlay');
            if (overlay) {
                overlay.remove();
            }

            // Restore original content
            document.body.style.overflow = '';
            document.body.classList.remove('swt-blocked');

            // Stop monitoring
            this.stopMonitoring();
        }

        createBlockingOverlay() {
            const overlay = document.createElement('div');
            overlay.id = 'swt-blocking-overlay';
            overlay.innerHTML = `
                <div class="swt-blocking-container">
                    <div class="swt-blocking-content">
                        <div class="swt-blocking-icon">🚫</div>
                        <h1 class="swt-blocking-title">Site Blocked</h1>
                        <p class="swt-blocking-message">
                            This website is blocked during your focus session.
                        </p>
                        <div class="swt-blocking-stats">
                            <div class="swt-stat">
                                <div class="swt-stat-value" id="swt-focus-time">0:00</div>
                                <div class="swt-stat-label">Focus Time</div>
                            </div>
                            <div class="swt-stat">
                                <div class="swt-stat-value" id="swt-blocked-count">0</div>
                                <div class="swt-stat-label">Sites Blocked</div>
                            </div>
                        </div>
                        <div class="swt-blocking-quote">
                            <p>"${this.getRandomQuote()}"</p>
                        </div>
                        <div class="swt-blocking-actions">
                            <button class="swt-btn swt-btn-primary" onclick="window.close()">
                                Close Tab
                            </button>
                            <button class="swt-btn swt-btn-secondary" id="swt-back-btn">
                                Go Back
                            </button>
                        </div>
                        <div class="swt-blocking-footer">
                            <small>Blocked by Stop Wasting Time Extension</small>
                        </div>
                    </div>
                </div>
            `;

            // Add styles
            this.addBlockingStyles(overlay);

            // Add event listeners
            overlay.querySelector('#swt-back-btn').addEventListener('click', () => {
                window.history.back();
            });

            return overlay;
        }

        addBlockingStyles(overlay) {
            const styles = document.createElement('style');
            styles.textContent = `
                #swt-blocking-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    z-index: 2147483647;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    color: white;
                }

                .swt-blocking-container {
                    text-align: center;
                    max-width: 500px;
                    padding: 40px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                }

                .swt-blocking-icon {
                    font-size: 64px;
                    margin-bottom: 20px;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                .swt-blocking-title {
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 16px;
                    color: #ffffff;
                }

                .swt-blocking-message {
                    font-size: 18px;
                    margin-bottom: 32px;
                    color: rgba(255, 255, 255, 0.9);
                    line-height: 1.5;
                }

                .swt-blocking-stats {
                    display: flex;
                    justify-content: center;
                    gap: 32px;
                    margin-bottom: 32px;
                }

                .swt-stat {
                    text-align: center;
                }

                .swt-stat-value {
                    font-size: 24px;
                    font-weight: 700;
                    color: #ffffff;
                    margin-bottom: 4px;
                }

                .swt-stat-label {
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.7);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .swt-blocking-quote {
                    margin-bottom: 32px;
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    border-left: 4px solid #ffffff;
                }

                .swt-blocking-quote p {
                    font-style: italic;
                    font-size: 16px;
                    color: rgba(255, 255, 255, 0.9);
                    margin: 0;
                }

                .swt-blocking-actions {
                    display: flex;
                    gap: 16px;
                    justify-content: center;
                    margin-bottom: 24px;
                }

                .swt-btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .swt-btn-primary {
                    background: #ffffff;
                    color: #667eea;
                }

                .swt-btn-primary:hover {
                    background: #f8f9fa;
                    transform: translateY(-2px);
                }

                .swt-btn-secondary {
                    background: transparent;
                    color: #ffffff;
                    border: 2px solid #ffffff;
                }

                .swt-btn-secondary:hover {
                    background: #ffffff;
                    color: #667eea;
                    transform: translateY(-2px);
                }

                .swt-blocking-footer {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 12px;
                }

                /* Ensure blocking overlay is always on top */
                #swt-blocking-overlay * {
                    z-index: 2147483647;
                }

                /* Hide page content when blocked */
                body.swt-blocked > *:not(#swt-blocking-overlay) {
                    display: none !important;
                }
            `;

            overlay.appendChild(styles);
        }

        getRandomQuote() {
            const quotes = [
                "Focus is the key to productivity",
                "Every moment counts towards your goals",
                "Discipline is choosing between what you want now and what you want most",
                "Success is the sum of small efforts repeated day in and day out",
                "The future depends on what you do today",
                "Don't watch the clock; do what it does. Keep going",
                "Focus on being productive instead of being busy",
                "The successful warrior is the average person with laser-like focus",
                "Where focus goes, energy flows and results show",
                "Concentration is the secret of strength"
            ];

            return quotes[Math.floor(Math.random() * quotes.length)];
        }

        startMonitoring() {
            // Monitor for attempts to remove blocking
            this.checkInterval = setInterval(() => {
                const overlay = document.getElementById('swt-blocking-overlay');
                if (this.isBlocked && !overlay) {
                    this.blockSite();
                }
            }, 1000);

            // Monitor for navigation attempts
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;

            history.pushState = function() {
                originalPushState.apply(history, arguments);
                setTimeout(() => this.checkCurrentSite(), 100);
            }.bind(this);

            history.replaceState = function() {
                originalReplaceState.apply(history, arguments);
                setTimeout(() => this.checkCurrentSite(), 100);
            }.bind(this);

            // Monitor for popstate events
            window.addEventListener('popstate', () => {
                setTimeout(() => this.checkCurrentSite(), 100);
            });
        }

        stopMonitoring() {
            if (this.checkInterval) {
                clearInterval(this.checkInterval);
                this.checkInterval = null;
            }
        }
    }

    // Initialize content blocker
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new ContentBlocker();
        });
    } else {
        new ContentBlocker();
    }
})();