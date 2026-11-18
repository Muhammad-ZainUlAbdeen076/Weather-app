import { useState } from "react";
import { CloudSun, Search, MapPin } from "lucide-react";

export default function Header({
  onSearch,
  onDetectLocation,
  unit,
  onToggleUnit,
  locating,
}) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
    setQuery("");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500 text-white shadow-xs">
            <CloudSun className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Atmos
          </span>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="order-3 flex w-full items-center sm:order-2 sm:max-w-sm"
        >
          <div className="relative w-full">
            <Search className="pointer-events-none absolute top-2.5 left-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search city (e.g., Lahore, Tokyo)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:outline-none"
            />
          </div>
        </form>

        {/* Right Controls: Geolocation + Unit Toggle */}
        <div className="order-2 flex items-center gap-2 sm:order-3">
          <button
            onClick={onDetectLocation}
            disabled={locating}
            title="Use current location"
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            <MapPin className="h-4 w-4 text-sky-500" />
            <span className="hidden md:inline">
              {locating ? "Locating..." : "My Location"}
            </span>
          </button>

          <button
            onClick={onToggleUnit}
            className="cursor-pointer rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-800"
          >
            °{unit}
          </button>
        </div>
      </div>
    </header>
  );
}