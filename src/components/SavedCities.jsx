import { Trash2, Globe } from "lucide-react";
import { getWeatherIconUrl } from "../services/weatherService";
import { formatTemp } from "../utils/tempHelper";

export default function SavedCities({
  citiesWeather,
  activeCity,
  onSelectCity,
  onRemoveCity,
  unit,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="mb-4 flex items-center gap-2">
        <Globe className="h-4 w-4 text-sky-500" />
        <h3 className="text-base font-bold text-slate-800">Saved Cities</h3>
      </div>

      <div className="space-y-2.5">
        {citiesWeather.map((city) => {
          const isSelected =
            city.name.toLowerCase() === activeCity.toLowerCase();

          return (
            <div
              key={city.id}
              onClick={() => onSelectCity(city.name)}
              className={`group flex cursor-pointer items-center justify-between rounded-2xl border p-3 transition-all ${
                isSelected
                  ? "border-sky-500 bg-sky-50/60 shadow-2xs"
                  : "border-slate-100 bg-slate-50/60 hover:border-slate-200 hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={getWeatherIconUrl(city.weather[0]?.icon)}
                  alt={city.weather[0]?.main}
                  className="h-10 w-10"
                />
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {city.name}
                  </p>
                  <p className="text-xs capitalize text-slate-500">
                    {city.weather[0]?.main}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-900">
                  {formatTemp(city.main?.temp, unit)}
                </span>

                {citiesWeather.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveCity(city.name);
                    }}
                    title="Remove city"
                    className="rounded-lg p-1.5 text-slate-400 opacity-0 transition hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}