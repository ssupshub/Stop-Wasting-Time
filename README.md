# Stop Wasting Time - Chrome Extension

A comprehensive productivity extension that helps you stay focused by blocking distracting websites, managing tasks, and tracking your productivity with an integrated Pomodoro timer system.

## 🎯 Features

### ⏱️ Pomodoro Timer
- **Customizable work sessions** (default: 25 minutes)
- **Configurable break periods** (default: 5 minutes)
- **Background timer** using Chrome's alarms API
- **Desktop notifications** for session changes
- **Badge display** showing remaining time on extension icon

### 🚫 Smart Website Blocking
- **Automatic blocking** of distracting websites during focus sessions
- **Beautiful blocking pages** with motivational quotes
- **Customizable blocked sites** list through settings
- **Allowlist support** for always-accessible sites
- **Statistics tracking** of blocked website attempts

### ✅ Task Management
- **Daily task lists** with completion tracking
- **Add, complete, and delete** tasks easily
- **Task completion statistics** and productivity scoring
- **Persistent storage** across browser sessions

### 📊 Analytics & Statistics
- **Daily focus time** tracking
- **Session completion rates** monitoring
- **Productivity score** calculation
- **Comprehensive reporting** system
- **Weekly productivity insights**

### ⚙️ Full Customization
- **Multiple theme options** (Default, Dark, Light, Blue, Green, Purple)
- **Customizable timer durations**
- **Notification preferences** management
- **Appearance settings** customization
- **Data export/import** functionality

## 🚀 Installation

### Quick Install Steps

1. **Download the Extension Files**
   - Download or clone this repository
   - Extract all files maintaining the folder structure

2. **Enable Developer Mode**
   - Open Chrome and navigate to `chrome://extensions/`
   - Toggle "Developer mode" in the top right corner

3. **Add Icon Files** (Required)
   - Create three icon files in the `icons/` folder:
     - `icon16.png` (16x16 pixels)
     - `icon48.png` (48x48 pixels)
     - `icon128.png` (128x128 pixels)
   - You can create simple square icons with any image editor

4. **Load the Extension**
   - Click "Load unpacked" in Chrome extensions page
   - Select the `stop-wasting-time-extension` folder
   - The extension will appear in your Chrome toolbar

### Required File Structure

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
├── README.md             # This file
└── icons/                # Icons folder
    ├── icon16.png        # 16x16 toolbar icon
    ├── icon48.png        # 48x48 extension icon
    └── icon128.png       # 128x128 store icon
```

## 📱 Usage Guide

### Starting a Focus Session
1. Click the extension icon in your Chrome toolbar
2. Review your daily tasks and add any new ones
3. Click "Start Focus" to begin a Pomodoro session
4. Distracting websites will be automatically blocked
5. Focus on your work until the timer notification appears

### Managing Tasks
- **Add tasks** using the input field in the popup
- **Check off completed tasks** to track progress
- **View completion statistics** in real-time
- **Tasks reset daily** (configurable in settings)

### Customizing Settings
- Access settings through the popup or by right-clicking the extension icon
- Configure timer durations, blocked websites, notifications, and themes
- Export/import your data for backup and synchronization

### Viewing Statistics
- Access detailed statistics through the settings page
- View daily focus time, session completion rates, and productivity scores
- Get insights and recommendations for improving your productivity

## 🔧 Technical Details

### Chrome Extension Standards
- **Manifest V3** - Uses the latest Chrome extension format
- **Service Worker** - Efficient background processing
- **declarativeNetRequest** - Secure website blocking
- **Chrome Storage API** - Persistent data storage
- **Chrome Notifications API** - Desktop notifications
- **Chrome Alarms API** - Accurate timer functionality

### Website Blocking
The extension uses Chrome's `declarativeNetRequest` API for efficient, tamper-proof website blocking. Default blocked sites include:

- Social Media: Facebook, Instagram, Twitter, LinkedIn, TikTok, Snapchat
- Entertainment: YouTube, Netflix, Twitch, Reddit, 9GAG, Imgur
- Communication: Discord, WhatsApp, Telegram
- Other: Pinterest, Tumblr, BuzzFeed

### Data Privacy
- **Local storage only** - No external servers involved
- **No data collection** - All information stays on your device
- **Transparent code** - Open source and inspectable
- **Secure blocking** - Uses Chrome's native APIs

## 🎨 Customization Options

### Themes
- **Default** - Purple gradient theme
- **Dark** - Dark mode for low-light environments
- **Light** - Clean light theme
- **Blue** - Professional blue theme
- **Green** - Nature-inspired green theme
- **Purple** - Rich purple theme

### Timer Settings
- **Work duration**: 1-60 minutes (default: 25)
- **Break duration**: 1-30 minutes (default: 5)
- **Auto-start breaks**: Automatic break session initiation
- **Badge display**: Show timer on extension icon
- **Sound notifications**: Audio alerts for session changes

### Blocking Options
- **Standard mode**: Blocks social media and entertainment sites
- **Strict mode**: Blocks all non-work related sites
- **Custom mode**: User-defined blocking list
- **Allowlist**: Sites that are never blocked
- **Motivational quotes**: Inspirational messages on blocked pages

## 🔍 Troubleshooting

### Common Issues

**Extension doesn't load**
- Ensure all files are present in the correct folder structure
- Check that manifest.json is valid JSON
- Verify icon files exist in the `icons/` folder

**Timer doesn't start**
- Enable notifications permission in Chrome
- Check that the background script is running
- Verify Chrome's alarm permissions are granted

**Websites aren't blocked**
- Ensure website blocking is enabled in settings
- Check that the timer is running in work mode
- Verify the site isn't in your allowlist

**Settings don't save**
- Check Chrome's storage permissions
- Ensure the extension has proper storage access
- Try resetting settings to default

### Performance Tips
- Keep the extension updated for best performance
- Regularly clear old statistics data
- Use compact mode on slower devices
- Disable unnecessary notifications

## 📈 Productivity Tips

### Getting Started
1. **Start with default settings** to understand the workflow
2. **Set realistic goals** for your first few sessions
3. **Add 2-3 important tasks** before starting
4. **Use the full 25-minute work session** without interruption

### Maximizing Effectiveness
- **Plan your tasks** before starting each session
- **Take breaks seriously** - they're crucial for productivity
- **Review your statistics** regularly to track improvement
- **Gradually increase** work session duration as you adapt

### Advanced Usage
- **Customize blocked sites** based on your specific distractions
- **Use different themes** for different types of work
- **Export data regularly** for backup and analysis
- **Set up motivational quotes** that inspire you personally

## 🤝 Contributing

This extension is open source and welcomes contributions:

1. **Bug reports** - Report issues through GitHub
2. **Feature requests** - Suggest new functionality
3. **Code contributions** - Submit pull requests
4. **Documentation** - Help improve guides and tutorials

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, feature requests, or bug reports:
- Check the troubleshooting section above
- Review the Chrome extension documentation
- Ensure you're using the latest version of Chrome

## 🙏 Acknowledgments

- Built using Chrome Extension Manifest V3
- Inspired by the Pomodoro Technique
- Designed for productivity enthusiasts
- Open source and community-driven

---

**Version**: 1.0.0  
**Compatibility**: Chrome 88+  
**Last Updated**: 2024

*Transform your browsing experience into a focused, productive workspace with Stop Wasting Time!* 🎯