import { Droplets, Wind, Eye, MapPin, BookmarkPlus, Check } from "lucide-react";
import { getWeatherIconUrl } from "../services/weatherService";
import { formatTemp } from "../utils/tempHelper";

// Dynamic background gradients based on weather condition
const conditionGradients = {
  Clear: "from-sky-500 via-blue-600 to-indigo-700",
  Clouds: "from-slate-600 via-slate-700 to-slate-800",
  Rain: "from-indigo-700 via-slate-800 to-slate-900",
  Drizzle: "from-cyan-700 via-slate-700 to-slate-800",
  Thunderstorm: "from-slate-800 via-purple-950 to-slate-950",
  Snow: "from-sky-400 via-cyan-600 to-blue-700",
};

export default function HeroWeather({
  weather,
  unit,
  isSaved,
  onSaveCity,
}) {
  const condition = weather.weather[0]?.main || "Clear";
  const gradient =
    conditionGradients[condition] || "from-sky-600 via-blue-700 to-indigo-800";

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-6 text-white shadow-md sm:p-8`}
    >
      {/* Top Row: City Name & Save Button */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="h-4 w-4" />
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              {weather.name}, {weather.sys?.country}
            </h2>
          </div>
          <p className="mt-1 text-xs font-medium text-white/75">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        <button
          onClick={() => onSaveCity(weather.name)}
          disabled={isSaved}
          className="flex cursor-pointer items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md transition hover:bg-white/25 disabled:cursor-default disabled:opacity-80"
        >
          {isSaved ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Saved
            </>
          ) : (
            <>
              <BookmarkPlus className="h-3.5 w-3.5" />
              Pin City
            </>
          )}
        </button>
      </div>

      {/* Center Row: Icon + Giant Temperature */}
      <div className="my-6 flex items-center gap-4 sm:my-8">
        <img
          src={getWeatherIconUrl(weather.weather[0]?.icon)}
          alt={weather.weather[0]?.description}
          className="h-20 w-20 drop-shadow-md sm:h-24 sm:w-24"
        />
        <div>
          <div className="text-5xl font-extrabold tracking-tighter sm:text-6xl">
            {formatTemp(weather.main?.temp, unit)}
            <span className="text-2xl font-semibold text-white/80">{unit}</span>
          </div>
          <p className="mt-1 text-sm font-medium capitalize text-white/90">
            {weather.weather[0]?.description} &bull; Feels like{" "}
            {formatTemp(weather.main?.feels_like, unit)}
            {unit}
          </p>
        </div>
      </div>

      {/* Bottom Row: 3 Frosted Telemetry Pills */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white/12 p-3 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-xs text-white/75">
            <Droplets className="h-3.5 w-3.5" />
            <span>Humidity</span>
          </div>
          <p className="mt-1 text-base font-bold">{weather.main?.humidity}%</p>
        </div>

        <div className="rounded-2xl bg-white/12 p-3 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-xs text-white/75">
            <Wind className="h-3.5 w-3.5" />
            <span>Wind</span>
          </div>
          <p className="mt-1 text-base font-bold">
            {Math.round((weather.wind?.speed || 0) * 3.6)} km/h
          </p>
        </div>

        <div className="rounded-2xl bg-white/12 p-3 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-xs text-white/75">
            <Eye className="h-3.5 w-3.5" />
            <span>Visibility</span>
          </div>
          <p className="mt-1 text-base font-bold">
            {((weather.visibility || 10000) / 1000).toFixed(1)} km
          </p>
        </div>
      </div>
    </div>
  );
}