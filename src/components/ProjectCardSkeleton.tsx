export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-card border border-black/[0.04]">
      <div className="h-[170px] bg-black/[0.06] animate-skeleton-pulse" />
      <div className="p-6">
        <div className="h-5 w-3/4 bg-black/[0.06] rounded animate-skeleton-pulse mb-3" />
        <div className="flex items-center gap-2 mb-5">
          <div className="w-[30px] h-[30px] rounded-full bg-black/[0.06] animate-skeleton-pulse" />
          <div className="h-4 w-24 bg-black/[0.06] rounded animate-skeleton-pulse" />
        </div>
        <div className="h-3 w-full bg-black/[0.06] rounded-full animate-skeleton-pulse" />
        <div className="h-3 w-16 bg-black/[0.06] rounded animate-skeleton-pulse mt-2" />
        <div className="h-2.5 w-24 bg-black/[0.06] rounded animate-skeleton-pulse mt-2" />
      </div>
    </div>
  );
}
