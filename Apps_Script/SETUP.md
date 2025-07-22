# Telegram Weather Bot Setup Guide

A Google Apps Script bot that sends daily weather reports to your Telegram account using the free MET Weather API (Norwegian Meteorological Institute).

## 🌟 Features

- ✅ **Daily weather reports** sent automatically to Telegram
- ✅ **Free MET Weather API** - no API key required
- ✅ **Beautiful formatting** with emojis and detailed weather info
- ✅ **Global coverage** - works anywhere in the world
- ✅ **Error handling** with notifications
- ✅ **Easy setup** with test functions

## 📋 Prerequisites

- Google account (for Apps Script)
- Telegram account
- Your location coordinates (latitude/longitude)

## 🚀 Quick Setup

### Step 1: Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start a chat and send `/newbot`
3. Follow the instructions to create your bot:
   - Choose a name for your bot (e.g., "My Weather Bot")
   - Choose a username ending in "bot" (e.g., "myweatherreport_bot")
4. **Save the bot token** - you'll need it later
   - Example: `7xxxxxxxxxx7:AxxxxxxL2-lxxxxxxxxxxxxxxxx2nE`

### Step 2: Get Your Chat ID

1. Send any message to your newly created bot
2. Keep this chat open - you'll verify the connection later

### Step 3: Find Your Location Coordinates

1. Open [Google Maps](https://maps.google.com)
2. Find your location
3. Right-click on the exact spot
4. Copy the coordinates (latitude, longitude)
   - Example: Berlin = `52.5200, 13.4050`

### Step 4: Set Up Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project
3. Delete the default code
4. Copy and paste the `TelegramWeatherBot.gs` code
5. Save the project with a meaningful name

### Step 5: Configure the Bot

Update the `CONFIG` object in the script with your values:

```javascript
const CONFIG = {
  TELEGRAM_BOT_TOKEN: 'YOUR_BOT_TOKEN_HERE',     // From Step 1
  TELEGRAM_CHAT_ID: 'YOUR_CHAT_ID_HERE',        // We'll get this in Step 6
  LATITUDE: 'YOUR_LATITUDE',                     // From Step 3
  LONGITUDE: 'YOUR_LONGITUDE',                   // From Step 3
  CITY_NAME: 'Your City Name',                   // For display only
  COUNTRY: 'Your Country',                       // For display only
  UNITS: 'metric'                                // 'metric', 'imperial', or 'kelvin'
};
```

### Step 6: Get Your Chat ID

1. In Apps Script, run the `getTelegramChatId()` function
2. Check the execution log for your chat ID
3. Copy the chat ID and update the `CONFIG` object

### Step 7: Test the Bot

1. Run the `testWeatherBot()` function
2. Check the execution log for test results
3. You should receive a test message in Telegram
4. All tests should show ✅ green checkmarks

### Step 8: Set Up Daily Reports

1. Run the `setupDailyTrigger()` function
2. This creates a daily trigger at 8:00 AM
3. You'll start receiving daily weather reports!

## 📱 Example Output

Your daily weather report will look like this:

```
🌤️ Daily Weather Report
📅 Monday, July 22, 2025
📍 Stuttgart-Vaihingen, Germany

🌤️ Current Weather:
• Condition: Fair - fair
• Temperature: 21°C
• Feels like: 21°C
• Humidity: 65%
• Pressure: 1015 hPa
• Cloud cover: 25%

🌬️ Wind:
• Speed: 2.1 m/s
• Direction: SW

🌡️ Temperature Range:
• High: 25°C
• Low: 16°C

📍 Location:
• Coordinates: 48.7455°, 9.0992°

Powered by MET Weather API 🇳🇴

Have a great day! 😊
```

## 🔧 Available Functions

| Function | Description |
|----------|-------------|
| `sendDailyWeather()` | Main function - sends the daily weather report |
| `testWeatherBot()` | Tests all components to ensure everything works |
| `setupDailyTrigger()` | Creates the daily trigger for automatic reports |
| `getTelegramChatId()` | Helps you find your Telegram chat ID |

## ⚙️ Configuration Options

### Units
- `metric` - Celsius, m/s, hPa (default)
- `imperial` - Fahrenheit, mph, inHg
- `kelvin` - Kelvin, m/s, hPa

### Trigger Time
You can change the daily report time by modifying the `setupDailyTrigger()` function:

```javascript
.atHour(8) // Change 8 to your preferred hour (0-23)
```

## 🌍 About MET Weather API

This bot uses the [MET Weather API](https://api.met.no/) from the Norwegian Meteorological Institute:

- ✅ **Completely free** - no registration required
- ✅ **No API key needed**
- ✅ **High quality data** from professional meteorologists
- ✅ **Global coverage**
- ✅ **Reliable service** backed by the Norwegian government

## 🐛 Troubleshooting

### Common Issues

**❌ "Telegram API failed"**
- Check your bot token is correct
- Verify your chat ID is correct
- Make sure you've sent at least one message to your bot

**❌ "MET Weather API failed"**
- Check your latitude/longitude coordinates
- Ensure you have internet connectivity
- Verify coordinates are in decimal format (not degrees/minutes/seconds)

**❌ "chat_id is empty"**
- Make sure you're using `CONFIG.TELEGRAM_CHAT_ID` in the code
- Run `getTelegramChatId()` to get the correct chat ID

### Getting Help

1. Run `testWeatherBot()` to identify the issue
2. Check the Apps Script execution log for error details
3. Verify your configuration values are correct

## 📄 File Structure

```
Apps_Script/
├── TelegramWeatherBot.gs    # Main bot script
└── SETUP.md                 # This setup guide
```

## 🔒 Security Notes

- Keep your Telegram bot token private
- Don't share your configured script publicly
- Consider using Apps Script's Properties Service for sensitive data in production

## 📝 License

This project is open source. Feel free to modify and share!

## 🤝 Contributing

Feel free to submit issues, suggestions, or improvements to the GitHub repository.

---

**Enjoy your daily weather reports! 🌤️**