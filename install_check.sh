#!/bin/bash
# Stop Wasting Time - Chrome Extension Installation Helper

echo "🚀 Stop Wasting Time - Chrome Extension Setup"
echo "============================================="
echo

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: manifest.json not found!"
    echo "Please run this script from the chrome_extension directory."
    exit 1
fi

echo "✅ Found manifest.json"

# Check for required files
required_files=("popup.html" "popup.css" "popup.js" "background.js" "content.js" "options.html" "options.css" "options.js" "rules.json")

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ Found $file"
    else
        echo "❌ Missing $file"
        exit 1
    fi
done

# Check for icons directory
if [ -d "icons" ]; then
    echo "✅ Found icons directory"

    # Check for icon files
    icon_files=("icon16.png" "icon48.png" "icon128.png")
    missing_icons=()

    for icon in "${icon_files[@]}"; do
        if [ -f "icons/$icon" ]; then
            echo "✅ Found icons/$icon"
        else
            echo "⚠️  Missing icons/$icon"
            missing_icons+=("$icon")
        fi
    done

    if [ ${#missing_icons[@]} -ne 0 ]; then
        echo
        echo "⚠️  Warning: Some icon files are missing!"
        echo "Please create the following icon files:"
        for icon in "${missing_icons[@]}"; do
            echo "   - icons/$icon"
        done
        echo
        echo "📖 See icons/ICON_REQUIREMENTS.md for instructions"
        echo
    fi
else
    echo "❌ Missing icons directory"
    exit 1
fi

echo
echo "🎉 All required files found!"
echo
echo "📋 Next steps:"
echo "1. Create missing icon files (if any)"
echo "2. Open Chrome and go to chrome://extensions/"
echo "3. Enable 'Developer mode' (top right toggle)"
echo "4. Click 'Load unpacked' and select this directory"
echo "5. Pin the extension to your toolbar"
echo "6. Start being productive!"
echo
echo "📖 For detailed instructions, see README.md"
echo "⚙️  For customization options, see the extension settings"
echo

exit 0
