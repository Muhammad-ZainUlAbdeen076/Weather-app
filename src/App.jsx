import { useState, useEffect, useCallback } from "react";
import { AlertCircle, X } from "lucide-react";
import {
  fetchWeatherByCity,
  fetchWeatherByCoords,
} from "./services/weatherService";
import Header from "./components/Header";
import HeroWeather from "./components/HeroWeather";
import ForecastList from "./components/ForecastList";
import SavedCities from "./components/SavedCities";
import WeatherSkeleton from "./components/WeatherSkeleton";

const DEFAULT_CITIES = ["Islamabad", "London", "Dubai", "Tokyo"];

export default function App() {
  const [savedCityNames, setSavedCityNames] = useState(DEFAULT_CITIES);
  const [savedCitiesData, setSavedCitiesData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [unit, setUnit] = useState("C");
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  // 1. Load live weather for all pinned cities in parallel
  const loadSavedCities = useCallback(async (cityList) => {
    try {
      const results = await Promise.allSettled(
        cityList.map((city) => fetchWeatherByCity(city))
      );
      const validCities = results
        .filter((res) => res.status === "fulfilled")
        .map((res) => res.value.current);

      setSavedCitiesData(validCities);
    } catch {
      // Silently ignore background list errors
    }
  }, []);

  // 2. Fetch active city's weather + 3-day forecast
  const handleSelectCity = useCallback(async (cityName) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchWeatherByCity(cityName);
      setCurrentWeather(data.current);
      setForecast(data.forecast);
    } catch (err) {
      const msg =
        err.response?.status === 404
          ? `City "${cityName}" not found. Please check the spelling.`
          : err.message || "Failed to fetch weather data.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Bonus: Detect user's current location via Browser Geolocation API
  const handleDetectLocation = useCallback(
    (isInitialLoad = false) => {
      if (!navigator.geolocation) {
        if (isInitialLoad) handleSelectCity(DEFAULT_CITIES[0]);
        else setError("Geolocation is not supported by your browser.");
        return;
      }

      setLocating(true);
      if (isInitialLoad) setLoading(true);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            setError("");
            const { latitude, longitude } = position.coords;
            const data = await fetchWeatherByCoords(latitude, longitude);
            setCurrentWeather(data.current);
            setForecast(data.forecast);
          } catch (err) {
            setError(err.message || "Could not fetch local weather.");
            if (isInitialLoad) await handleSelectCity(DEFAULT_CITIES[0]);
          } finally {
            setLocating(false);
            setLoading(false);
          }
        },
        async () => {
          // User denied permission or location unavailable -> fallback to default city
          setLocating(false);
          if (isInitialLoad) {
            await handleSelectCity(DEFAULT_CITIES[0]);
          } else {
            setError("Location permission denied. Please allow location access.");
          }
        },
        { timeout: 8000 }
      );
    },
    [handleSelectCity]
  );

  // Initial App Load: Fetch saved cities + auto-detect user location
  useEffect(() => {
    loadSavedCities(DEFAULT_CITIES);
    handleDetectLocation(true);
  }, [loadSavedCities, handleDetectLocation]);

  // Pin current city to Saved Cities sidebar
  const handleSaveCity = (cityName) => {
    const alreadyExists = savedCityNames.some(
      (c) => c.toLowerCase() === cityName.toLowerCase()
    );
    if (alreadyExists) return;

    const updated = [cityName, ...savedCityNames];
    setSavedCityNames(updated);
    if (currentWeather) {
      setSavedCitiesData((prev) => [currentWeather, ...prev]);
    }
  };

  // Remove a city from Saved Cities sidebar
  const handleRemoveCity = (cityName) => {
    setSavedCityNames((prev) =>
      prev.filter((c) => c.toLowerCase() !== cityName.toLowerCase())
    );
    setSavedCitiesData((prev) =>
      prev.filter((c) => c.name.toLowerCase() !== cityName.toLowerCase())
    );
  };

  const isCurrentCitySaved = currentWeather
    ? savedCityNames.some(
        (c) => c.toLowerCase() === currentWeather.name.toLowerCase()
      )
    : false;

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900">
      {/* Top Sticky Header */}
      <Header
        onSearch={handleSelectCity}
        onDetectLocation={() => handleDetectLocation(false)}
        unit={unit}
        onToggleUnit={() => setUnit((prev) => (prev === "C" ? "F" : "C"))}
        locating={locating}
      />

      {/* Main Content Container */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Error Alert Banner */}
        {error && (
          <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError("")}
              className="rounded-lg p-1 hover:bg-rose-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Loading Skeleton vs Live Bento Dashboard */}
        {loading && !currentWeather ? (
          <WeatherSkeleton />
        ) : (
          currentWeather && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left 2 Columns: Hero Current Weather + 3-Day Forecast */}
              <div className="space-y-6 lg:col-span-2">
                <HeroWeather
                  weather={currentWeather}
                  unit={unit}
                  isSaved={isCurrentCitySaved}
                  onSaveCity={handleSaveCity}
                />
                <ForecastList forecast={forecast} unit={unit} />
              </div>

              {/* Right Column: Multi-City Switcher */}
              <div>
                <SavedCities
                  citiesWeather={savedCitiesData}
                  activeCity={currentWeather.name}
                  onSelectCity={handleSelectCity}
                  onRemoveCity={handleRemoveCity}
                  unit={unit}
                />
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}