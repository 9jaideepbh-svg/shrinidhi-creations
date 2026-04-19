import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Home, Grid, Palette, MessageSquare } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Grid, label: 'Gallery', path: '/gallery' },
    { icon: Palette, label: 'Customize', path: '/customize' },
    { icon: MessageSquare, label: 'Contact', path: '/contact' },
  ];

  const isProductPage = location.pathname.startsWith('/product/');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      {!isProductPage && (
        <header className="fixed top-0 left-0 right-0 z-50 glass-nav h-20 flex items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex flex-shrink-0 items-center justify-start w-12 md:w-16">
            <img 
              src="/logo.jpg" 
              alt="Shrinidhi Creations Logo" 
              className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-full shadow-sm"
            />
          </Link>
          
          <div className="flex-1 flex items-center justify-center overflow-hidden px-2">
            <Link to="/" className="font-headline text-[14px] sm:text-lg md:text-2xl lg:text-3xl leading-tight text-center italic no-underline tracking-[0.05em] sm:tracking-[0.1em] md:tracking-[0.2em] font-bold truncate">
              SHRINIDHI CREATIONS
            </Link>
          </div>

          <div className="w-12 md:w-16 flex-shrink-0" /> {/* Spacer to balance perfectly */}
        </header>
      )}

      {/* Main Content */}
      <main className={cn("flex-grow", !isProductPage ? "pt-20 pb-24" : "")}>
        {children}
      </main>

      {/* Bottom Nav */}
      {!isProductPage && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav h-20 border-t border-outline-variant/10 px-6">
          <div className="grid grid-cols-4 h-full max-w-md mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center justify-center transition-all duration-300",
                    isActive ? "text-primary" : "text-outline opacity-50 hover:opacity-100"
                  )}
                >
                  <Icon className={cn("w-5 h-5 mb-1", isActive && "fill-current")} />
                  <span className="font-label text-[10px] tracking-wider uppercase font-bold not-italic no-underline">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
