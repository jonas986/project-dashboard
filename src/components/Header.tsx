interface HeaderProps {
  projectCount: number;
  onAddClick: () => void;
}

export function Header({ projectCount, onAddClick }: HeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-vodafone-red via-red-dark to-red-darker p-10 pb-9 mb-8 grain-overlay">
      <div className="absolute -top-10 -right-5 w-48 h-48 rounded-full bg-white/[0.06]" />
      <div className="absolute -bottom-16 right-20 w-36 h-36 rounded-full bg-white/[0.04]" />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-white/50 uppercase tracking-[0.15em] mb-1">Vodafone</p>
          <h1 className="text-[28px] font-extrabold text-white tracking-tight">
            Projektübersicht
          </h1>
          <p className="text-sm text-white/75 mt-1">
            {projectCount} aktive{" "}
            {projectCount === 1 ? "Projekt" : "Projekte"}
          </p>
        </div>
        <button
          onClick={onAddClick}
          className="bg-white text-vodafone-red px-7 py-3 rounded-full text-sm font-bold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
        >
          + Neues Projekt
        </button>
      </div>
    </div>
  );
}
