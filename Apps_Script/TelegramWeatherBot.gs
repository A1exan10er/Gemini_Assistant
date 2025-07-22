/**
 * Daily Weather Bot for Telegram
 * This script sends daily weather information to a Telegram chat
 * 
 * Required setup:
 * 1. Get a Telegram Bot Token from @BotFather
 * 2. Get your Telegram Chat ID
 * 3. Get your location coordinates (latitude and longitude)
 * 4. Set up the configuration variables below
 * 5. Create a daily trigger for the sendDailyWeather function
 */

// Configuration - Replace with your actual values
const CONFIG = {
  TELEGRAM_BOT_TOKEN: '7xxxxxxxxxx7:AxxxxxxL2-lxxxxxxxxxxxxxxxx2nE', // Get from @BotFather
  TELEGRAM_CHAT_ID: '-46xxxxxxxxx8', // Your Telegram user ID or group chat ID
  // MET API doesn't require an API key - it's free!
  LATITUDE: 'xx.xxxx', // Your location latitude (use Google Maps to find)
  LONGITUDE: 'xx.xxxx', // Your location longitude (use Google Maps to find)
  CITY_NAME: 'Berlin', // For display purposes only
  COUNTRY: 'Germany', // For display purposes only
  UNITS: 'metric' // 'metric' for Celsius, 'imperial' for Fahrenheit
};

/**
 * Main function to send daily weather report
 * This should be triggered daily via Apps Script triggers
 */
function sendDailyWeather() {
  try {
    console.log('Starting daily weather report...');
    
    // Get weather data
    const weatherData = getWeatherData();
    
    if (!weatherData) {
      throw new Error('Failed to fetch weather data');
    }
    
    // Format the weather message
    const message = formatWeatherMessage(weatherData);
    
    // Send to Telegram
    const success = sendTelegramMessage(message);
    
    if (success) {
      console.log('Daily weather report sent successfully!');
    } else {
      throw new Error('Failed to send Telegram message');
    }
    
  } catch (error) {
    console.error('Error in sendDailyWeather:', error);
    
    // Send error notification to Telegram
    const errorMessage = `⚠️ Weather Bot Error:\n${error.message}`;
    sendTelegramMessage(errorMessage);
  }
}

/**
 * Fetch weather data from MET Weather API
 */
function getWeatherData() {
  try {
    // MET API endpoint for current weather
    const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${CONFIG.LATITUDE}&lon=${CONFIG.LONGITUDE}`;
    
    const options = {
      headers: {
        'User-Agent': 'TelegramWeatherBot/1.0 (your-email@example.com)' // MET API requires User-Agent
      }
    };
    
    const response = UrlFetchApp.fetch(url, options);
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`MET API error: ${response.getResponseCode()}`);
    }
    
    const data = JSON.parse(response.getContentText());
    
    // Get current weather data (first time point)
    const currentData = data.properties.timeseries[0];
    const currentInstant = currentData.data.instant.details;
    const next1Hour = currentData.data.next_1_hours;
    const next6Hours = currentData.data.next_6_hours;
    
    // Get today's forecast data for min/max temps
    const today = new Date().toISOString().split('T')[0];
    const todayData = data.properties.timeseries.filter(item => 
      item.time.startsWith(today)
    );
    
    // Calculate min/max temperatures for today
    const temperatures = todayData.map(item => item.data.instant.details.air_temperature);
    const tempMax = Math.max(...temperatures);
    const tempMin = Math.min(...temperatures);
    
    // Format data to match our existing structure
    const formattedData = {
      name: CONFIG.CITY_NAME,
      country: CONFIG.COUNTRY,
      coord: {
        lat: parseFloat(CONFIG.LATITUDE),
        lon: parseFloat(CONFIG.LONGITUDE)
      },
      weather: {
        main: getWeatherCondition(next1Hour || next6Hours),
        description: getWeatherDescription(next1Hour || next6Hours),
        symbol: (next1Hour || next6Hours)?.summary?.symbol_code || 'unknown'
      },
      main: {
        temp: currentInstant.air_temperature,
        feels_like: calculateFeelsLike(currentInstant.air_temperature, currentInstant.relative_humidity, currentInstant.wind_speed),
        temp_min: tempMin,
        temp_max: tempMax,
        pressure: currentInstant.air_pressure_at_sea_level,
        humidity: currentInstant.relative_humidity
      },
      wind: {
        speed: currentInstant.wind_speed,
        deg: currentInstant.wind_from_direction
      },
      clouds: {
        all: currentInstant.cloud_area_fraction
      }
    };
    
    return formattedData;
    
  } catch (error) {
    console.error('Error fetching weather data from MET API:', error);
    return null;
  }
}

/**
 * Convert MET symbol code to weather condition
 */
function getWeatherCondition(weatherData) {
  if (!weatherData || !weatherData.summary) return 'Unknown';
  
  const symbol = weatherData.summary.symbol_code;
  
  if (symbol.includes('clearsky')) return 'Clear';
  if (symbol.includes('fair')) return 'Fair';
  if (symbol.includes('partlycloudy')) return 'Partly Cloudy';
  if (symbol.includes('cloudy')) return 'Cloudy';
  if (symbol.includes('rain')) return 'Rain';
  if (symbol.includes('snow')) return 'Snow';
  if (symbol.includes('sleet')) return 'Sleet';
  if (symbol.includes('fog')) return 'Fog';
  if (symbol.includes('thunder')) return 'Thunderstorm';
  
  return 'Unknown';
}

/**
 * Convert MET symbol code to weather description
 */
function getWeatherDescription(weatherData) {
  if (!weatherData || !weatherData.summary) return 'unknown';
  
  const symbol = weatherData.summary.symbol_code;
  
  const descriptions = {
    'clearsky_day': 'clear sky',
    'clearsky_night': 'clear sky',
    'fair_day': 'fair',
    'fair_night': 'fair',
    'partlycloudy_day': 'partly cloudy',
    'partlycloudy_night': 'partly cloudy',
    'cloudy': 'cloudy',
    'rainshowers_day': 'rain showers',
    'rainshowers_night': 'rain showers',
    'rain': 'rain',
    'heavyrain': 'heavy rain',
    'lightrain': 'light rain',
    'snow': 'snow',
    'heavysnow': 'heavy snow',
    'lightsnow': 'light snow',
    'sleet': 'sleet',
    'fog': 'fog',
    'thunderstorm': 'thunderstorm'
  };
  
  // Remove time suffix for matching
  const baseSymbol = symbol.replace(/_day|_night/, '');
  return descriptions[symbol] || descriptions[baseSymbol] || symbol.replace(/_/g, ' ');
}

/**
 * Calculate "feels like" temperature using heat index/wind chill
 */
function calculateFeelsLike(temp, humidity, windSpeed) {
  // Simple approximation for "feels like" temperature
  // This is a basic calculation - MET API doesn't provide feels_like directly
  
  if (temp >= 27) {
    // Heat index calculation for warm weather
    const rh = humidity;
    const t = temp;
    const hi = -8.78469475556 + 1.61139411 * t + 2.33854883889 * rh - 0.14611605 * t * rh;
    return hi;
  } else if (temp <= 10 && windSpeed > 1.34) {
    // Wind chill calculation for cold weather
    const wc = 13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed * 3.6, 0.16) + 0.3965 * temp * Math.pow(windSpeed * 3.6, 0.16);
    return wc;
  }
  
  return temp; // No adjustment needed
}

/**
 * Format weather data into a readable message
 */
function formatWeatherMessage(weatherData) {
  const date = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const weather = weatherData.weather;
  const main = weatherData.main;
  const wind = weatherData.wind;
  
  // Temperature unit symbol
  const tempUnit = CONFIG.UNITS === 'metric' ? '°C' : 
                   CONFIG.UNITS === 'imperial' ? '°F' : 'K';
  
  // Convert temperature if needed
  const convertTemp = (temp) => {
    if (CONFIG.UNITS === 'imperial') {
      return (temp * 9/5) + 32;
    }
    return temp;
  };
  
  // Wind speed unit
  const windUnit = 'm/s';
  
  // Weather emoji mapping based on MET symbol codes
  const weatherEmojis = {
    'Clear': '☀️',
    'Fair': '🌤️',
    'Partly Cloudy': '⛅',
    'Cloudy': '☁️',
    'Rain': '🌧️',
    'Snow': '❄️',
    'Sleet': '🌨️',
    'Fog': '🌫️',
    'Thunderstorm': '⛈️'
  };
  
  const emoji = weatherEmojis[weather.main] || '🌡️';
  
  const message = `🌤️ **Daily Weather Report**
📅 ${date}
📍 ${weatherData.name}, ${weatherData.country}

${emoji} **Current Weather:**
• Condition: ${weather.main} - ${weather.description}
• Temperature: ${Math.round(convertTemp(main.temp))}${tempUnit}
• Feels like: ${Math.round(convertTemp(main.feels_like))}${tempUnit}
• Humidity: ${Math.round(main.humidity)}%
• Pressure: ${Math.round(main.pressure)} hPa
• Cloud cover: ${Math.round(weatherData.clouds.all)}%

🌬️ **Wind:**
• Speed: ${wind.speed} ${windUnit}
${wind.deg ? `• Direction: ${getWindDirection(wind.deg)}` : ''}

🌡️ **Temperature Range:**
• High: ${Math.round(convertTemp(main.temp_max))}${tempUnit}
• Low: ${Math.round(convertTemp(main.temp_min))}${tempUnit}

📍 **Location:**
• Coordinates: ${weatherData.coord.lat.toFixed(4)}°, ${weatherData.coord.lon.toFixed(4)}°

*Powered by MET Weather API* 🇳🇴

Have a great day! 😊`;

  return message;
}

/**
 * Convert wind direction degrees to compass direction
 */
function getWindDirection(degrees) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                     'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/**
 * Send message to Telegram
 */
function sendTelegramMessage(message) {
  try {
    const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const payload = {
      chat_id: CONFIG.TELEGRAM_CHAT_ID, // Fixed: was CONFIG.CHAT_ID
      text: message,
      parse_mode: 'Markdown'
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const responseData = JSON.parse(response.getContentText());
    
    if (!responseData.ok) {
      throw new Error(`Telegram API error: ${responseData.description}`);
    }
    
    return true;
    
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
}

/**
 * Test function to check if everything is working
 */
function testWeatherBot() {
  console.log('Testing weather bot configuration...');
  
  // Check configuration
  if (!CONFIG.LATITUDE || !CONFIG.LONGITUDE || CONFIG.LATITUDE === 'YOUR_LATITUDE') {
    console.log('❌ Please configure your latitude and longitude');
    return;
  }
  
  // Test weather API
  console.log('Testing MET Weather API...');
  const weatherData = getWeatherData();
  
  if (weatherData) {
    console.log('✅ MET Weather API working');
    console.log('Current weather:', weatherData.weather.description);
    console.log('Temperature:', Math.round(weatherData.main.temp) + '°C');
  } else {
    console.log('❌ MET Weather API failed');
    return;
  }
  
  // Test message formatting
  console.log('Testing message formatting...');
  const message = formatWeatherMessage(weatherData);
  console.log('✅ Message formatted successfully');
  
  // Test Telegram API
  console.log('Testing Telegram API...');
  const testMessage = '🧪 Weather Bot Test\nThis is a test message from your weather bot using MET API! 🇳🇴';
  const success = sendTelegramMessage(testMessage);
  
  if (success) {
    console.log('✅ Telegram API working - check your Telegram for the test message');
  } else {
    console.log('❌ Telegram API failed');
  }
}

/**
 * Setup function to create daily trigger
 * Run this once to set up the daily weather reports
 */
function setupDailyTrigger() {
  // Delete existing triggers for this function
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'sendDailyWeather') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Create new daily trigger at 8:00 AM
  ScriptApp.newTrigger('sendDailyWeather')
    .timeBased()
    .everyDays(1)
    .atHour(8) // 8:00 AM
    .create();
    
  console.log('✅ Daily trigger created for 8:00 AM');
}

/**
 * Get your Telegram Chat ID
 * Run this function after messaging your bot to get your chat ID
 */
function getTelegramChatId() {
  try {
    const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/getUpdates`;
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    
    if (data.ok && data.result.length > 0) {
      const chatIds = data.result.map(update => ({
        chat_id: update.message.chat.id,
        chat_type: update.message.chat.type,
        first_name: update.message.chat.first_name || 'N/A',
        username: update.message.chat.username || 'N/A'
      }));
      
      console.log('Available chat IDs:');
      chatIds.forEach(chat => {
        console.log(`Chat ID: ${chat.chat_id}, Type: ${chat.chat_type}, Name: ${chat.first_name}, Username: ${chat.username}`);
      });
      
      return chatIds;
    } else {
      console.log('No messages found. Send a message to your bot first.');
      return [];
    }
  } catch (error) {
    console.error('Error getting chat ID:', error);
    return [];
  }
}