interface AddProjectCardProps {
  onClick: () => void;
}

export function AddProjectCard({ onClick }: AddProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-[#F5F5F7] rounded-[20px] overflow-hidden border-2 border-dashed border-black/[0.08] flex items-center justify-center min-h-[320px] cursor-pointer transition-all duration-300 hover:border-vodafone-red/40 hover:bg-white hover:shadow-card hover:-translate-y-0.5 group"
    >
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-vodafone-red to-red-light flex items-center justify-center mx-auto mb-3.5 text-[28px] text-white shadow-lg shadow-vodafone-red/30 transition-transform duration-200 group-hover:scale-110">
          +
        </div>
        <span className="text-sm text-vodafone-red font-semibold">
          Neues Projekt
        </span>
      </div>
    </div>
  );
}
