# Stop Wasting Time - Chrome Extension

A comprehensive productivity Chrome extension that helps you stay focused by blocking distracting websites, managing tasks, and tracking your productivity with a built-in Pomodoro timer.

## Features

### 🎯 Pomodoro Timer
- Customizable work sessions (default: 25 minutes)
- Configurable break periods (default: 5 minutes)
- Visual timer display with progress tracking
- Desktop notifications for session changes
- Badge display on extension icon showing remaining time

### 🚫 Website Blocking
- Blocks distracting websites during focus sessions
- Beautiful blocking pages with motivational quotes
- Customizable blocked sites list
- Automatic blocking activation during work sessions
- Statistics tracking of blocked attempts

### ✅ Task Management
- Daily task list with completion tracking
- Add, complete, and delete tasks
- Task completion statistics
- Productivity score calculation

### 📊 Analytics & Statistics
- Daily focus time tracking
- Session completion rates
- Productivity score calculation
- Blocked website attempt tracking
- Weekly and monthly progress views

### ⚙️ Customization
- Multiple theme options (Default, Dark, Light, Blue, Green)
- Customizable timer durations
- Notification preferences
- Appearance settings
- Data export/import functionality

## Installation

### Method 1: Load as Unpacked Extension (Recommended)

1. **Download the Extension Files**
   - Download all files from this repository
   - Extract them to a folder on your computer

2. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or click the three dots menu → More tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right corner

4. **Load the Extension**
   - Click "Load unpacked" button
   - Select the folder containing all the extension files
   - The extension should now appear in your extensions list

5. **Verify Installation**
   - Look for the extension icon in your Chrome toolbar
   - Click the icon to open the popup and verify it works

### Method 2: Install Icons (Important!)

The extension requires three icon files in the `icons/` folder:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

If you don't have these icons, you can:
1. Create them manually using any image editor
2. Use online icon generators
3. Use simple colored squares as temporary icons

## File Structure

Your extension folder should contain these files:

```
stop-wasting-time-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── background.js         # Background service worker
├── content.js            # Content script for blocking
├── options.html          # Settings page
├── options.css           # Settings page styling
├── options.js            # Settings functionality
├── rules.json            # Website blocking rules
├── icons/
│   ├── icon16.png        # 16x16 toolbar icon
│   ├── icon48.png        # 48x48 extension icon
│   └── icon128.png       # 128x128 Chrome Web Store icon
└── README.md             # This file
```

## Usage

### Starting a Focus Session

1. Click the extension icon in your Chrome toolbar
2. Review your daily tasks and add any new ones
3. Click "Start Focus" to begin a 25-minute work session
4. Distracting websites will be automatically blocked
5. Focus on your work until you receive a notification

### Managing Tasks

- **Add tasks**: Type in the task input field and click "Add" or press Enter
- **Complete tasks**: Check the checkbox next to completed tasks
- **Delete tasks**: Click the "×" button next to any task
- **View progress**: See completion statistics in the popup

### Customizing Settings

1. Click the "Settings" button in the popup
2. Or right-click the extension icon and select "Options"
3. Configure timer durations, blocked sites, notifications, and appearance
4. Changes are saved automatically

### Viewing Statistics

- **Daily stats**: Visible in the popup interface
- **Detailed report**: Click "Daily Report" for comprehensive analytics
- **All-time stats**: Available in the Settings → Data tab

## Troubleshooting

### Extension Won't Load

**Error**: "Could not load extension"
- **Solution**: Check that all files are present and `manifest.json` is valid JSON

**Error**: "Invalid icon"
- **Solution**: Ensure all three icon files exist in the `icons/` folder with correct dimensions

### Extension Loads but Doesn't Work

**Problem**: Timer doesn't start
- **Solution**: Check that notifications permission is granted in Chrome

**Problem**: Website blocking not working
- **Solution**: Verify that the extension has permissions for all websites

**Problem**: Settings don't save
- **Solution**: Check Chrome storage permissions and try reloading the extension

### Performance Issues

**Problem**: Extension slows down browser
- **Solution**: Reduce the number of blocked websites or disable unused features

**Problem**: Timer inaccurate
- **Solution**: This is normal due to Chrome's alarm API limitations - timers may be off by a few seconds

## Permissions Explained

The extension requires these permissions:

- **storage**: Save settings and statistics
- **alarms**: Run the Pomodoro timer
- **notifications**: Show desktop notifications
- **declarativeNetRequest**: Block websites
- **activeTab**: Access current tab for blocking
- **scripting**: Inject blocking content
- **host_permissions**: Access all websites for blocking

## Development

### Making Changes

1. Edit the source files
2. Go to `chrome://extensions/`
3. Click the refresh button on the extension card
4. Test your changes

### Adding New Blocked Sites

1. Open the Settings page
2. Go to the "Blocking" tab
3. Add sites in the format: `example.com` (without `www.` or `https://`)
4. Or edit the `rules.json` file directly

### Customizing Themes

1. Edit `popup.css` and `options.css`
2. Add new theme classes following the existing pattern
3. Update the theme selector in `options.html`

## Support

If you encounter issues:

1. Check that all files are present in the correct structure
2. Verify that Chrome Developer Mode is enabled
3. Try reloading the extension
4. Check the browser console for error messages
5. Ensure you have the latest version of Chrome

## License

This extension is provided as-is for educational and productivity purposes. Feel free to modify and distribute according to your needs.

## Version History

### v1.0
- Initial release
- Basic Pomodoro timer functionality
- Website blocking system
- Task management
- Statistics tracking
- Customizable settings

---

**Happy focusing! 🎯**
