import React from 'react';

interface StatBarProps {
  name: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatBar: React.FC<StatBarProps> = ({ name, value, icon, color }) => {
  const width = `${Math.max(0, Math.min(100, value))}%`;
  const isCritical = value <= 10 || value >= 90;
  
  const barColor = isCritical ? 'bg-red-500' : `bg-current`;

  return (
    <div className={`flex flex-col items-center w-20 ${color}`}>
      <div className={`mb-2 ${isCritical ? 'animate-pulse-fast' : ''}`}>
        {icon}
      </div>
      <div className="text-sm font-bold tracking-wider uppercase">{name}</div>
      <div className="w-full bg-white/10 rounded-full h-2.5 mt-2 overflow-hidden border border-white/20">
        <div
          className={`${barColor} h-2.5 rounded-full transition-all duration-300 ease-out`}
          style={{ width }}
        ></div>
      </div>
    </div>
  );
};

export default StatBar;