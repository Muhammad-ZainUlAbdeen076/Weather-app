import axios from "axios";

const API_KEY = import.meta.env.VITE_OWM_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Axios instance with shared baseURL and default params
const weatherApi = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: "metric", // Always fetch Celsius; convert to °F in UI smoothly
  },
});

// Helper: Convert 3-hour forecast list into a clean 3-Day summary
function parseThreeDayForecast(forecastList) {
  const todayStr = new Date().toISOString().split("T")[0];
  const dailyMap = {};

  forecastList.forEach((item) => {
    const dateStr = item.dt_txt.split(" ")[0];
    if (dateStr === todayStr) return; // Skip today's remaining hours

    if (!dailyMap[dateStr]) {
      dailyMap[dateStr] = {
        date: dateStr,
        dayName: new Date(item.dt * 1000).toLocaleDateString("en-US", {
          weekday: "long",
        }),
        minTemp: item.main.temp_min,
        maxTemp: item.main.temp_max,
        condition: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      };
    } else {
      // Track true daily low & high across 3-hour blocks
      dailyMap[dateStr].minTemp = Math.min(
        dailyMap[dateStr].minTemp,
        item.main.temp_min
      );
      dailyMap[dateStr].maxTemp = Math.max(
        dailyMap[dateStr].maxTemp,
        item.main.temp_max
      );

      // Prefer midday (12:00 PM) icon & condition for accuracy
      if (item.dt_txt.includes("12:00:00")) {
        dailyMap[dateStr].condition = item.weather[0].main;
        dailyMap[dateStr].description = item.weather[0].description;
        dailyMap[dateStr].icon = item.weather[0].icon;
      }
    }
  });

  // Return only the next 3 days
  return Object.values(dailyMap).slice(0, 3);
}

// 1. Fetch Current Weather + 3-Day Forecast by City Name
export async function fetchWeatherByCity(city) {
  if (!API_KEY) {
    throw new Error("Missing VITE_OWM_API_KEY in your .env file.");
  }

  // Run both requests in parallel with Promise.all for faster loading
  const [currentRes, forecastRes] = await Promise.all([
    weatherApi.get("/weather", { params: { q: city } }),
    weatherApi.get("/forecast", { params: { q: city } }),
  ]);

  return {
    current: currentRes.data,
    forecast: parseThreeDayForecast(forecastRes.data.list),
  };
}

// 2. Bonus: Fetch Current Weather + 3-Day Forecast by Coordinates (Geolocation)
export async function fetchWeatherByCoords(lat, lon) {
  if (!API_KEY) {
    throw new Error("Missing VITE_OWM_API_KEY in your .env file.");
  }

  const [currentRes, forecastRes] = await Promise.all([
    weatherApi.get("/weather", { params: { lat, lon } }),
    weatherApi.get("/forecast", { params: { lat, lon } }),
  ]);

  return {
    current: currentRes.data,
    forecast: parseThreeDayForecast(forecastRes.data.list),
  };
}

// Helper: OpenWeatherMap official HD icon URL
export function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}