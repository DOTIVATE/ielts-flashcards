interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2 text-xs font-semibold text-slate-400">
        <span>Session Progress</span>
        <span className="font-mono text-[#4f8ef7]">
          {current} / {total} ({Math.round(percentage)}%)
        </span>
      </div>
      <div className="w-full h-2.5 bg-[#252542] rounded-full overflow-hidden border border-[#2d2d54]">
        <div 
          className="h-full bg-gradient-to-r from-[#4f8ef7] to-[#80b0ff] rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_rgba(79,142,247,0.4)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
