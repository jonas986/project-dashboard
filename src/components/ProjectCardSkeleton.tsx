export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-card border border-black/[0.04]">
      <div className="h-[170px] bg-gray-200 animate-skeleton-pulse" />
      <div className="p-6">
        <div className="h-5 w-3/4 bg-gray-200 rounded animate-skeleton-pulse mb-3" />
        <div className="flex items-center gap-2 mb-5">
          <div className="w-7 h-7 rounded-full bg-gray-200 animate-skeleton-pulse" />
          <div className="h-4 w-24 bg-gray-200 rounded animate-skeleton-pulse" />
        </div>
        <div className="h-3 w-full bg-gray-200 rounded-full animate-skeleton-pulse" />
      </div>
    </div>
  );
}
