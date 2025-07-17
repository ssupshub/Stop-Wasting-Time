# Stop Wasting Time - Chrome Extension

A powerful Chrome extension designed to boost your productivity by blocking distracting websites, managing focus sessions with Pomodoro timers, and tracking your daily tasks.

## Features

### 🚫 Website Blocking
- Block distracting websites during focus sessions
- Customizable list of blocked sites
- Beautiful blocking pages with motivational quotes
- Automatic blocking during work sessions

### ⏱️ Focus Timer (Pomodoro)
- Customizable work and break durations (default: 25 min work, 5 min break)
- Session counter and progress tracking
- Desktop notifications for session start/end
- Automatic session switching

### ✅ Task Management
- Add and manage daily tasks
- Track task completion
- Daily goals and progress
- Task completion notifications

### 📊 Productivity Statistics
- Track total focus time
- Monitor productivity score
- Count blocked website attempts
- Session completion tracking

### 🎨 Customization
- Dark/Light theme toggle
- Customizable accent colors
- Notification preferences
- Personalized settings

## Installation

### Method 1: Load as Unpacked Extension (Developer Mode)

1. **Download the Extension**
   - Download all the files from the `chrome_extension` folder
   - Keep the folder structure intact

2. **Enable Developer Mode**
   - Open Chrome and go to `chrome://extensions/`
   - Toggle on "Developer mode" in the top right corner

3. **Load the Extension**
   - Click "Load unpacked" button
   - Select the `chrome_extension` folder
   - The extension will be installed and ready to use

4. **Pin the Extension**
   - Click the puzzle piece icon in the Chrome toolbar
   - Find "Stop Wasting Time" and click the pin icon
   - The extension icon will appear in your toolbar

### Method 2: Create Extension Package

1. **Prepare Icons**
   - Create icon files: `icon16.png`, `icon48.png`, `icon128.png`
   - Place them in the `icons` folder
   - Use a productivity-themed icon (like a clock or focus symbol)

2. **Test the Extension**
   - Load as unpacked extension first
   - Test all features to ensure they work properly
   - Fix any issues before packaging

3. **Package for Distribution**
   - Go to `chrome://extensions/`
   - Click "Pack extension"
   - Select the extension folder
   - This creates a `.crx` file for distribution

## Usage

### Getting Started
1. **First Setup**
   - Click the extension icon in your toolbar
   - Review the default settings
   - Add any additional websites you want to block

2. **Start a Focus Session**
   - Click "Start Focus" in the popup
   - The timer will begin and websites will be blocked
   - Focus on your work without distractions

3. **Manage Tasks**
   - Add daily tasks in the popup
   - Check them off as you complete them
   - Track your productivity progress

### Settings Configuration
- Click the settings (⚙️) button in the popup
- Or right-click the extension icon → Options
- Customize timers, blocked sites, notifications, and appearance

## File Structure

```
chrome_extension/
├── manifest.json          # Extension manifest (Manifest V3)
├── popup.html             # Main popup interface
├── popup.css              # Popup styling
├── popup.js               # Popup functionality
├── background.js          # Service worker (background script)
├── content.js             # Content script for blocking
├── options.html           # Settings page
├── options.css            # Settings page styling
├── options.js             # Settings page functionality
├── rules.json             # Blocking rules (empty by default)
├── icons/                 # Extension icons
│   ├── icon16.png         # 16x16 icon
│   ├── icon48.png         # 48x48 icon
│   └── icon128.png        # 128x128 icon
└── README.md              # This file
```

## Permissions Explained

The extension requires these permissions:
- **storage**: Save settings and data locally
- **alarms**: Create timers and notifications
- **notifications**: Show desktop notifications
- **activeTab**: Access current tab for blocking
- **declarativeNetRequest**: Block websites efficiently
- **tabs**: Monitor tab changes for blocking
- **host_permissions**: Access all websites for blocking

## Technical Details

### Architecture
- **Manifest V3**: Uses the latest Chrome extension format
- **Service Worker**: Background script for persistent functionality
- **Content Scripts**: Inject blocking interface into web pages
- **declarativeNetRequest**: Efficient website blocking API

### Storage
- Uses Chrome's `chrome.storage.local` API
- Stores settings, tasks, statistics, and timer state
- Data persists between browser sessions

### Blocking System
- Uses `declarativeNetRequest` API for performance
- Dynamic rule creation and removal
- Beautiful custom blocking pages
- Monitoring to prevent bypass attempts

## Development

### Prerequisites
- Google Chrome browser
- Basic knowledge of HTML, CSS, and JavaScript
- Understanding of Chrome Extension APIs

### Running in Development
1. Clone or download the extension files
2. Open Chrome and enable Developer Mode
3. Load the extension as unpacked
4. Make changes to the code
5. Click the refresh button in `chrome://extensions/`

### Building for Production
1. Test thoroughly in development mode
2. Create proper icon files
3. Update version in `manifest.json`
4. Package the extension
5. Submit to Chrome Web Store (optional)

## Troubleshooting

### Common Issues
1. **Extension not loading**: Check file permissions and folder structure
2. **Blocking not working**: Ensure declarativeNetRequest permission is granted
3. **Notifications not showing**: Check Chrome notification settings
4. **Timer not accurate**: Browser may throttle background scripts

### Debug Tips
- Check the console in DevTools for error messages
- Use `chrome://extensions/` to see error details
- Test with different websites and scenarios
- Clear extension data if settings get corrupted

## Privacy & Security

- All data is stored locally on your device
- No data is sent to external servers
- No tracking or analytics
- Open source code for transparency

## Support

For issues, suggestions, or contributions:
1. Check the troubleshooting section
2. Review the code for understanding
3. Test with different scenarios
4. Report specific issues with details

## License

This extension is provided as-is for educational and productivity purposes. Feel free to modify and distribute according to your needs.

## Version History

### v1.0
- Initial release
- Basic timer functionality
- Website blocking
- Task management
- Settings page
- Statistics tracking

---

**Stay focused and productive!** 🚀
