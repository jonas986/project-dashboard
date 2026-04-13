interface ProgressBarProps {
  percent: number;
}

export function ProgressBar({ percent }: ProgressBarProps) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-xs text-muted font-medium">Fortschritt</span>
        <span className="text-[13px] text-vodafone-red font-bold">
          {percent}%
        </span>
      </div>
      <div className="bg-red-bg rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-vodafone-red to-red-light h-full rounded-full relative shadow-[0_0_8px_rgba(230,0,0,0.25)]"
          style={{ width: `${percent}%` }}
        >
          <div className="progress-shine absolute inset-0 rounded-full" />
        </div>
      </div>
    </div>
  );
}
