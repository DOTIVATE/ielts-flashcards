import { ReactNode } from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  subtext?: string;
  highlight?: boolean;
}

export default function StatsCard({ label, value, icon, subtext, highlight = false }: StatsCardProps) {
  return (
    <div className={`p-5 rounded-2xl border transition-all duration-350 ${
      highlight 
        ? 'bg-gradient-to-br from-[#1e345e] to-[#16274a] border-[#4f8ef7]/40 shadow-[0_4px_20px_rgba(79,142,247,0.15)]' 
        : 'bg-[#1e1e38] border-[#2d2d54] hover:border-[#3c3c66]'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            {label}
          </p>
          <h3 className="text-2xl font-extrabold text-white tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-2.5 rounded-xl ${
          highlight ? 'bg-[#4f8ef7]/20 text-[#4f8ef7]' : 'bg-[#2a2a4a] text-slate-300'
        }`}>
          {icon}
        </div>
      </div>
      {subtext && (
        <p className="text-xs text-slate-400 mt-2.5 font-medium flex items-center gap-1">
          {subtext}
        </p>
      )}
    </div>
  );
}
