import React from 'react';

export interface GradientMenuItem {
  title: string;
  icon: React.ReactNode;
  gradientFrom: string;
  gradientTo: string;
  onClick?: () => void;
  href?: string;
}

export default function GradientMenu({ items }: { items: GradientMenuItem[] }) {
  return (
    <div className="flex justify-center items-center">
      <ul className="flex gap-4 sm:gap-6 flex-wrap justify-center">
        {items.map(({ title, icon, gradientFrom, gradientTo, onClick, href }, idx) => {
          const content = (
            <>
              {/* Gradient background on hover */}
              <span className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] opacity-0 transition-all duration-500 group-hover:opacity-100"></span>
              {/* Blur glow */}
              <span className="absolute top-[10px] inset-x-0 h-full rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] blur-[15px] opacity-0 -z-10 transition-all duration-500 group-hover:opacity-50"></span>

              {/* Icon */}
              <span className="relative z-10 transition-all duration-500 group-hover:scale-0 delay-0 flex items-center justify-center">
                <span className="text-2xl text-gray-500 flex items-center justify-center">{icon}</span>
              </span>

              {/* Title */}
              <span className="absolute text-white uppercase tracking-wide text-sm transition-all duration-500 scale-0 group-hover:scale-100 delay-150">
                {title}
              </span>
            </>
          );

          const className = "relative w-[60px] h-[60px] bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-500 hover:w-[160px] sm:hover:w-[180px] hover:shadow-none group cursor-pointer";
          const style = { '--gradient-from': gradientFrom, '--gradient-to': gradientTo } as React.CSSProperties;

          return (
            <li key={idx} style={style} className={className} onClick={onClick}>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="w-full h-full flex items-center justify-center rounded-full">
                  {content}
                </a>
              ) : (
                <div className="w-full h-full flex items-center justify-center rounded-full">
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
