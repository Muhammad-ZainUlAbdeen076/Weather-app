export default function WeatherSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left Main Column Skeleton */}
      <div className="space-y-6 lg:col-span-2">
        <div className="h-72 rounded-3xl bg-slate-200" />
        <div className="h-52 rounded-3xl bg-slate-200" />
      </div>

      {/* Right Saved Cities Skeleton */}
      <div className="h-96 rounded-3xl bg-slate-200" />
    </div>
  );
}