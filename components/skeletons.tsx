export function MatchCardSkeleton() {
  return (
    <div className="card p-5">
      <div className="skeleton h-3 w-24" />
      <div className="mt-4 space-y-3">
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-4 w-1/2" />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="skeleton h-8" /><div className="skeleton h-8" /><div className="skeleton h-8" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="card p-4">
      {Array.from({ length: rows }).map((_, i) => <div key={i} className="skeleton mb-3 h-10" />)}
    </div>
  );
}

export function PlayerSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="card p-6"><div className="skeleton mx-auto h-32 w-32 rounded-full" /><div className="skeleton mt-6 h-5 w-2/3" /><div className="skeleton mt-3 h-4 w-1/2" /></div>
      <div className="space-y-4"><div className="skeleton h-40" /><div className="skeleton h-64" /></div>
    </div>
  );
}
