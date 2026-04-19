import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/src/components/Button';
import { Link } from 'react-router-dom';
import GradientMenu from '@/src/components/ui/gradient-menu';
import { IoLogoWhatsapp, IoLogoInstagram } from 'react-icons/io5';
import { StaggerTestimonials } from '@/src/components/ui/stagger-testimonials';
import { Volume2, VolumeX } from 'lucide-react';

const collections = [
  { name: 'Oversized Tees', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Graphic Prints', img: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Heavyweight Blanks', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop' },
  { name: 'Custom Logos', img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop' },
];

export default function Home() {
  const [isMuted, setIsMuted] = useState(true);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  
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
        {/* Desktop Header Video */}
        <video
          ref={desktopVideoRef}
          autoPlay
          loop
          muted={isDesktop ? isMuted : true}
          playsInline
          className="hidden md:block w-full h-full object-cover opacity-80"
          src="/hero-video-desktop.mp4"
        />
        
        {/* Mobile Header Video */}
        <video
          ref={mobileVideoRef}
          autoPlay
          loop
          muted={!isDesktop ? isMuted : true}
          playsInline
          className="block md:hidden w-full h-full object-cover opacity-80"
          src="/hero-video.mp4"
        />
        
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
        <div className="flex overflow-x-auto hide-scrollbar gap-12 pb-4">
          {collections.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className="flex flex-col items-center flex-shrink-0 group cursor-pointer"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border border-outline-variant/30 p-1 mb-4 transition-transform duration-500 group-hover:scale-105">
                <img
                  alt={item.name}
                  className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500"
                  src={item.img}
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-label text-xs tracking-widest uppercase">{item.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mt-32 px-6 max-w-screen-xl mx-auto w-full">
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
            Skip the cart. Talk directly to our design team to get a quote, discuss fabrics, and finalize your 3D mockups.
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
