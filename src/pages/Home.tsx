import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/src/components/Button';
import { Link } from 'react-router-dom';
import GradientMenu from '@/src/components/ui/gradient-menu';
import { IoLogoWhatsapp, IoLogoInstagram } from 'react-icons/io5';
import { StaggerTestimonials } from '@/src/components/ui/stagger-testimonials';
import { Volume2, VolumeX, MapPin, Mail, Phone, Clock } from 'lucide-react';

const collections = [
  { name: 'F1 PRINT', img: '/f1logo.jpg' },
  { name: 'MOVIE PRINT', img: '/movie.jpg' },
  { name: 'KANNADA', img: '/kannada.jpg' },
  { name: '3D PRINT', img: '/3dlogo.png' },
];

export default function Home() {
  const [isMuted, setIsMuted] = useState(true);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);

  const handleImageLoad = useCallback((id: string) => {
    setImagesLoaded(prev => ({ ...prev, [id]: true }));
  }, []);
  
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

  // Auto-stop audio when video is scrolled out of view (3/4 cropped)
  useEffect(() => {
    const section = document.getElementById('hero-section');
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio < 0.25 || !entry.isIntersecting) {
            setIsMuted(true);
            if (desktopVideoRef.current) desktopVideoRef.current.muted = true;
            if (mobileVideoRef.current) mobileVideoRef.current.muted = true;
          }
        });
      },
      { threshold: [0.25] }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col"
    >
      {/* Hero Section */}
      <section id="hero-section" className="relative h-[85vh] w-full overflow-hidden bg-black">
        {isDesktop ? (
          <video
            key="desktop-video"
            ref={desktopVideoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            fetchPriority="high"
            poster="/fallback%20hero.png"
            className="w-full h-full object-cover opacity-80"
            src="/hero%20section%20computer.webm"
          />
        ) : (
          <video
            key="mobile-video"
            ref={mobileVideoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            fetchPriority="high"
            poster="/fallback%20hero.png"
            className="w-full h-full object-cover opacity-80"
            src="/hero%20section%20mobile.webm"
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
                  href: 'https://wa.me/918553868587'
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
                    decoding="async"
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

      {/* Comprehensive SEO Footer */}
      <footer className="bg-[#050505] border-t border-white/10 pt-20 pb-24 px-6 mt-32 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
        
        <div className="max-w-screen-xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
          
          {/* Column 1: About & Core Keywords */}
          <div className="flex flex-col gap-6">
            <h4 className="font-headline text-2xl font-black italic uppercase tracking-tighter text-white">
              Shrinidhi Creations
            </h4>
            <div className="space-y-4">
              <p className="font-body text-base text-gray-300 leading-relaxed">
                At Shrinidhi Creations, we offer premium <strong className="text-white font-semibold">custom t shirt printing in Bangalore</strong>. 
                Express yourself with our unique styles, heavyweight fabrics, and uncompromising quality.
              </p>
              <div className="flex gap-4">
                <a href="https://wa.me/918553868587" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-[#25D366] hover:bg-white/10 transition-colors">
                  <IoLogoWhatsapp size={20} />
                </a>
                <a href="https://www.instagram.com/_shrinidhi_creations_?igsh=MXIwdnIwbTluNjJocA==" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-[#E1306C] hover:bg-white/10 transition-colors">
                  <IoLogoInstagram size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Our Services (Keywords) */}
          <div className="flex flex-col gap-6">
            <h4 className="font-headline text-lg font-bold uppercase tracking-widest text-primary border-l-2 border-primary pl-3">
              Our Services
            </h4>
            <ul className="space-y-3 font-body text-base text-gray-300">
              <li><Link to="/gallery" className="hover:text-white transition-colors">Custom T-Shirt Printing</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">3D T-Shirt Printing Near Me</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Bulk Custom Tees Bangalore</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">F1 & Movie Prints</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">DTF & Screen Printing</Link></li>
            </ul>
          </div>

          {/* Column 3: Serving Locations */}
          <div className="flex flex-col gap-6">
            <h4 className="font-headline text-lg font-bold uppercase tracking-widest text-[#e0d95d] border-l-2 border-[#e0d95d] pl-3">
              Serving Bangalore
            </h4>
            <p className="font-body text-base text-gray-300 leading-relaxed">
              Proudly serving all major areas in Bangalore. Whether you are looking for a <strong className="text-white font-normal hover:text-white transition-all cursor-crosshair">custom t shirt shop in Whitefield</strong>, Indiranagar, Koramangala or beyond, we deliver fast and high quality custom apparel right to your doorstep.
            </p>
            <ul className="space-y-2 font-body text-sm text-gray-300 font-medium uppercase tracking-widest">
              <li>• Nagasandra</li>
              <li>• Whitefield</li>
              <li>• Koramangala</li>
              <li>• Indiranagar</li>
            </ul>
          </div>

          {/* Column 4: Contact & Maps */}
          <div className="flex flex-col gap-6">
            <h4 className="font-headline text-lg font-bold uppercase tracking-widest text-white border-l-2 border-white pl-3">
              Contact Info
            </h4>
            <div className="space-y-4 font-body text-base text-gray-300">
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-primary shrink-0 mt-0.5" />
                <a href="tel:+918553868587" className="hover:text-white transition-colors">
                  +91 8553868587
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-primary shrink-0 mt-0.5" />
                <a href="mailto:shrinidhi.creations.07@gmail.com" className="hover:text-white transition-colors">
                  shrinidhi.creations.07@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  No 57 Samruddhi nelaya muneshwara layout, behind Parle biscuit factory near Arvindh Electrical’s Nagasandra post, Bangalore 560073
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-primary shrink-0 mt-0.5" />
                <p>Mon - Sun (10:00 AM - 9:00 PM)</p>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="w-full h-40 rounded-xl overflow-hidden border border-white/20 mt-4 shadow-lg">
              <iframe 
                src="https://maps.google.com/maps?q=Nagasandra,+Bengaluru,+560073&t=&z=13&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Shrinidhi Creations Location Map"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Admin Portal — subtle footer link & Copyright */}
        <div className="max-w-screen-xl mx-auto w-full flex flex-col md:flex-row items-center justify-between border-t border-white/5 mt-16 pt-8 pb-12">
          <p className="text-xs text-white/30 font-body uppercase tracking-widest mb-4 md:mb-0">
            © 2026 Shrinidhi Creations. All Rights Reserved.
          </p>
          <Link
            to="/admin"
            className="text-[10px] text-white/20 hover:text-white/60 transition-all duration-500 font-mono tracking-[0.3em] uppercase select-none bg-white/5 px-4 py-2 rounded-full"
          >
            ⚙ Staff Login
          </Link>
        </div>

        {/* Developer Credit Box */}
        <div className="flex justify-center mt-4 pb-8 z-20 relative px-4">
          <a
            href="https://wa.me/919606643005"
            target="_blank"
            rel="noreferrer"
            className="group relative overflow-hidden rounded-2xl p-[3px] cursor-pointer max-w-full"
          >
             {/* Aggressive fast conic gradient spin */}
             <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#ff3366_30%,#393BB2_70%,#000000_100%)]"></span>
             
             {/* Inner UI container */}
             <div className="relative flex h-full w-full items-center justify-center bg-[#050505] rounded-[0.9rem] px-5 sm:px-8 py-3 backdrop-blur-3xl transition-all duration-300 group-hover:bg-[#0a0a0a] gap-3 sm:gap-4 shadow-[0_0_30px_rgba(255,51,102,0.4)]">
                <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300 shrink-0">⚡</span>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-white/60 uppercase tracking-[0.25em] sm:tracking-[0.4em] font-black pb-1 truncate">Developed By</span>
                  <span className="text-white font-headline font-black italic tracking-widest text-lg sm:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-[#ff3366] to-[#393BB2] group-hover:from-[#ff6699] group-hover:to-[#4a4ec4] transition-all duration-300 whitespace-nowrap">
                    JD WebDev
                  </span>
                </div>
             </div>
          </a>
        </div>
      </footer>
    </motion.div>

  );
}
