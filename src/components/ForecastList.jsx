import { getWeatherIconUrl } from "../services/weatherService";
import { formatTemp } from "../utils/tempHelper";

export default function ForecastList({ forecast, unit }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
      <h3 className="mb-4 text-base font-bold text-slate-800">
        3-Day Forecast
      </h3>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {forecast.map((day, index) => (
          <div
            key={day.date}
            className="flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-center transition-colors hover:border-sky-200 hover:bg-sky-50/40"
          >
            <span className="text-sm font-bold text-slate-800">
              {index === 0 ? "Tomorrow" : day.dayName}
            </span>
            <span className="text-xs text-slate-400">{day.date}</span>

            <img
              src={getWeatherIconUrl(day.icon)}
              alt={day.description}
              className="my-2 h-14 w-14"
            />

            <div className="flex items-center gap-2 text-sm font-bold">
              <span className="text-slate-900">
                {formatTemp(day.maxTemp, unit)}
              </span>
              <span className="text-slate-400">/</span>
              <span className="font-medium text-slate-500">
                {formatTemp(day.minTemp, unit)}
              </span>
            </div>

            <p className="mt-1 text-xs capitalize text-slate-500">
              {day.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}