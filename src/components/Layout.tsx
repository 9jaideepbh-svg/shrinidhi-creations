import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Home, Grid, MessageSquare } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { getAnnouncement, type Announcement } from '../lib/announcement';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    let ignore = false;
    getAnnouncement().then(data => {
      if (ignore) return;
      if (data?.isActive) {
        setAnnouncement(data);
        if (!sessionStorage.getItem('popupDismissed')) {
          setTimeout(() => { if (!ignore) setShowPopup(true); }, 1000);
        }
      }
    });
    return () => { ignore = true; };
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    sessionStorage.setItem('popupDismissed', 'true');
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Grid, label: 'Gallery', path: '/gallery' },
    { icon: MessageSquare, label: 'Contact', path: '/contact' },
  ];

  const isProductPage = location.pathname.startsWith('/product/');
  const isAdminPage = location.pathname === '/admin';

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Top Nav */}
      {!isProductPage && !isAdminPage && (
        <header className="fixed top-0 left-0 right-0 z-50 glass-nav h-20 flex items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex flex-shrink-0 items-center justify-start w-12 md:w-16">
            <img 
              src="/brand-logo.jpg" 
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
      <main className={cn("flex-grow", !isProductPage && !isAdminPage ? "pt-20 pb-24" : "")}>
        {children}
      </main>

      {/* Bottom Nav */}
      {!isProductPage && !isAdminPage && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav h-20 border-t border-outline-variant/10 px-6">
          <div className="grid grid-cols-3 h-full max-w-md mx-auto">
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
      {/* Aggressive Pop-up */}
      <AnimatePresence>
        {showPopup && announcement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/60 backdrop-blur-xl"
          >
            <div className="relative w-full max-w-sm bg-gradient-to-br from-[#1a0033] to-[#3a0022] border-2 border-red-500 rounded-3xl p-8 shadow-[0_0_80px_rgba(255,0,0,0.4)] text-center flex flex-col items-center">
              <button
                onClick={handleClosePopup}
                className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
                aria-label="Close Announcement"
              >
                <X size={20} />
              </button>
              
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,0,0,0.6)] animate-pulse">
                 <span className="text-3xl" role="img" aria-label="Rocket">🚀</span>
              </div>
              
              <h2 className="text-3xl font-black italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 tracking-tighter mb-4" style={{ WebkitTextStroke: '1px rgba(255,100,100,0.5)' }}>
                Special Drop
              </h2>
              
              <p className="text-lg font-bold text-white mb-8 whitespace-pre-wrap leading-tight">
                {announcement.text}
              </p>
              
              <button 
                onClick={handleClosePopup}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_10px_20px_rgba(255,0,0,0.3)] transition-all hover:scale-105 active:scale-95"
              >
                Unlock Offer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
