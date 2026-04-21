import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/src/components/Button';
import { Link } from 'react-router-dom';
import GradientMenu from '@/src/components/ui/gradient-menu';
import { IoLogoWhatsapp, IoLogoInstagram } from 'react-icons/io5';
import { StaggerTestimonials } from '@/src/components/ui/stagger-testimonials';
import { Volume2, VolumeX } from 'lucide-react';

const collections = [
  { name: 'F1 PRINT', img: '/red-bull-1.jpg' },
  { name: 'MOVIE PRINT', img: '/toxic-1.jpg' },
  { name: 'KANNADA', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop' },
  { name: '3D PRINT', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop' },
];

export default function Home() {
  const [isMuted, setIsMuted] = useState(true);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const [isFactoryExpanded, setIsFactoryExpanded] = useState(false);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  const handleImageLoad = (id: string) => {
    setImagesLoaded(prev => ({ ...prev, [id]: true }));
  };
  
  // Track window resize to toggle active video
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // iOS Safari Autoplay Fix
  useEffect(() => {
    const applyIosFix = (videoElem: HTMLVideoElement | null) => {
      if (videoElem) {
        // Force native attributes critical for iOS specific autoplay policies
        videoElem.defaultMuted = true;
        videoElem.muted = true; // Always start explicitly muted for iOS native autoplay to succeed
        videoElem.play().catch((error) => {
          console.warn('Autoplay prevented by browser:', error);
        });
      }
    };
    
    applyIosFix(desktopVideoRef.current);
    applyIosFix(mobileVideoRef.current);
  }, []);

  // Sync native mute property depending strictly on which video is physically visible
  useEffect(() => {
    if (desktopVideoRef.current) desktopVideoRef.current.muted = isDesktop ? isMuted : true;
    if (mobileVideoRef.current) mobileVideoRef.current.muted = !isDesktop ? isMuted : true;
  }, [isMuted, isDesktop]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col"
    >
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-black">
        {isDesktop ? (
          <video
            key="desktop-video"
            ref={desktopVideoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            poster="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-80"
            src="/hero-video-desktop.mp4"
          />
        ) : (
          <video
            key="mobile-video"
            ref={mobileVideoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            poster="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-80"
            src="/hero-video.mp4"
          />
        )}
        
        {/* Audio Toggle Button */}
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-6 right-6 z-20 p-3 bg-black/40 hover:bg-black/60 transition-colors rounded-full text-white backdrop-blur-md border border-white/10"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-24 text-center px-6 pointer-events-none">
          <div className="flex flex-col sm:flex-row gap-6 items-center pointer-events-auto">
            <div className="flex mt-4 sm:mt-0">
              <GradientMenu items={[
                {
                  title: 'WhatsApp',
                  icon: <IoLogoWhatsapp />,
                  gradientFrom: '#25D366',
                  gradientTo: '#128C7E',
                  href: 'https://wa.me/919606643005'
                },
                {
                  title: 'Instagram',
                  icon: <IoLogoInstagram />,
                  gradientFrom: '#f09433',
                  gradientTo: '#bc1888',
                  href: 'https://www.instagram.com/_shrinidhi_creations_?igsh=MXIwdnIwbTluNjJocA=='
                }
              ]} />
            </div>
          </div>
        </div>
      </section>

      {/* Category Carousel */}
      <section className="mt-20 px-6 max-w-screen-xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-headline text-3xl md:text-4xl uppercase tracking-tighter font-bold">Collections</h3>
          <Link to="/gallery" className="font-label text-xs tracking-widest border-b border-primary pb-1">
            VIEW GALLERY
          </Link>
        </div>
        <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 hide-scrollbar gap-8 md:gap-12 pb-4 lg:pb-0 lg:max-w-5xl lg:mx-auto">
          {collections.map((item, idx) => (
            <Link
              key={item.name}
              to={`/gallery?category=${encodeURIComponent(item.name)}`}
              className="group"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className="flex flex-col items-center flex-shrink-0 lg:flex-shrink cursor-pointer"
              >
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-primary/20 p-1 mb-5 transition-all duration-500 group-hover:border-primary group-hover:scale-110 relative bg-white/5 shadow-xl group-hover:shadow-primary/20">
                  {!imagesLoaded[item.name] && (
                    <div className="absolute inset-0 animate-pulse bg-white/10 rounded-full" />
                  )}
                  <img
                    alt={item.name}
                    className={`w-full h-full object-cover rounded-full transition-all duration-700 ease-out group-hover:rotate-6 ${imagesLoaded[item.name] ? 'opacity-100' : 'opacity-0'}`}
                    src={item.img}
                    loading="lazy"
                    onLoad={() => handleImageLoad(item.name)}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="font-headline text-sm tracking-[0.2em] font-black uppercase italic group-hover:text-primary transition-colors text-center">{item.name}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Factory / About Us Section - Removed on mobile for testing stability */}
      {isDesktop && (
        <section className="mt-32 px-6 max-w-screen-xl mx-auto w-full">
          <div className="flex flex-col items-center">
            <div className="inline-block px-3 py-1 bg-[#632dbc]/10 border border-[#632dbc]/20 rounded-full mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#632dbc]">The Source</span>
            </div>
            <h3 className="font-headline text-4xl md:text-6xl text-center uppercase tracking-tighter font-black italic mb-12">
              Inside the <br/> Factory
            </h3>
            
            <div className="relative w-full max-w-md group cursor-pointer" onClick={() => setIsFactoryExpanded(true)}>
              <div className="aspect-[9/16] md:aspect-[3/4] bg-[#080808] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 group-hover:border-[#632dbc]/50 group-hover:scale-[1.02] flex items-center justify-center">
                <img 
                  src="/factory-cover.jpg" 
                  alt="Inside the Factory"
                  loading="lazy"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/40 group-hover:bg-black/20 transition-colors">
                   <div className="w-16 h-16 bg-[#632dbc] rounded-full flex items-center justify-center text-white shadow-[0_0_30px_rgba(99,45,188,0.3)] transition-transform group-hover:scale-110">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-1">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                   </div>
                   <p className="mt-4 font-headline text-sm font-black uppercase tracking-widest italic group-hover:translate-y-1 transition-transform">Tap to see how we build</p>
                </div>
              </div>
              {/* Ambient Glow */}
              <div className="absolute -inset-10 bg-[#632dbc]/10 blur-3xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity -z-10" />
            </div>
          </div>

          {/* Video Expansion Modal */}
          <AnimatePresence>
            {isFactoryExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4"
                onClick={() => setIsFactoryExpanded(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="relative h-[80vh] aspect-[9/16] rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10"
                  onClick={(e) => e.stopPropagation()}
                >
                   <video 
                      autoPlay 
                      controls 
                      className="w-full h-full object-contain"
                      src="/factory-video.mp4" 
                   />
                   <button 
                    onClick={() => setIsFactoryExpanded(false)}
                    className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all z-50"
                   >
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                     </svg>
                   </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="mt-40 px-6 max-w-screen-xl mx-auto w-full">
        <div className="text-center mb-16">
          <p className="font-label text-[0.6875rem] uppercase tracking-[0.2rem] text-outline mb-4">Client Stories</p>
          <h3 className="font-headline text-4xl md:text-5xl uppercase tracking-tighter font-extrabold">Voices of Authenticity</h3>
        </div>
        <StaggerTestimonials />
      </section>

      {/* Quick Contact Banner */}
      <section className="my-32 px-6 max-w-screen-xl mx-auto w-full">
        <div className="bg-primary text-on-primary p-12 md:p-24 text-center flex flex-col items-center">
          <h3 className="font-headline text-4xl md:text-6xl uppercase tracking-tighter font-extrabold mb-6">Ready for your custom drop?</h3>
          <p className="font-body text-on-primary/80 max-w-lg mb-10">
            Skip the cart. Talk directly to our design team to get a quote, discuss fabrics, and finalize your designs.
          </p>
          <Link to="/contact">
            <Button variant="secondary" className="border-on-primary text-on-primary hover:bg-on-primary hover:text-primary">
              REQUEST A QUOTE
            </Button>
          </Link>
        </div>
      </section>
    </motion.div>
  );
}
