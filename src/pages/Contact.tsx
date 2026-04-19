import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Input } from '@/src/components/Input';
import GradientMenu from '@/src/components/ui/gradient-menu';
import { IoLogoWhatsapp, IoLogoInstagram, IoMailOutline, IoCheckmarkCircleOutline, IoWarningOutline } from 'react-icons/io5';
import { WebGLShader } from '@/src/components/ui/web-gl-shader';
import { LiquidButton } from '@/src/components/ui/liquid-glass-button';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'needs_key'>('idle');

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Store a reference to the form element synchronously before any 'await' 
    // because e.currentTarget becomes null after the async operation yields.
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    
    // Web3Forms uses a "Public Access Key" system. Since it sits behind Cloudflare's bot protection,
    // submissions MUST come directly from the web browser, making it completely safe and intended
    // that this key is defined here in the frontend facing code.
    const WEB3FORMS_ACCESS_KEY = "f4834dcb-dffa-44c7-b967-447076b36277";

    formData.append("access_key", WEB3FORMS_ACCESS_KEY);
    formData.append("subject", "New Inquiry from Shrinidhi Creations");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        formElement.reset(); // Safely use the captured reference here
        setTimeout(() => setStatus('idle'), 5000); // Reset after 5 seconds
      } else {
        console.error("Web3Forms error:", data.message);
        setStatus('needs_key');
      }
    } catch (error) {
      console.error("Form submission error", error);
      setStatus('needs_key');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen w-full pt-8 pb-24"
    >
      <WebGLShader />
      
      <div className="relative z-10 px-6 max-w-screen-xl mx-auto w-full">
        <header className="mb-16 text-center max-w-2xl mx-auto">
          <p className="font-label uppercase tracking-[0.2rem] mb-4 not-italic font-bold text-center text-[18px] text-[#ff6868] leading-[25px]">Inquiries & Quotes</p>
          <h2 className="font-headline text-4xl md:text-6xl uppercase tracking-tighter font-extrabold mb-[23px] mt-0 pt-[2px] pr-[1px] text-center italic leading-[41.4px] no-underline">Let's Create Something Unique.</h2>
          <p className="font-sans text-on-surface-variant">
            Whether you need a single custom piece or a bulk order for your brand, our studio is ready to bring your vision to life.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact Form */}
          <div className="bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant p-8 md:p-12 shadow-sm relative overflow-hidden">
            <h3 className="font-headline text-3xl uppercase tracking-tighter font-bold mb-8">Request a Quote</h3>
            
            <form className="space-y-8" onSubmit={handleFormSubmit}>
              <Input name="name" type="text" placeholder="Full Name" required className="italic font-bold" disabled={status === 'submitting'} />
              <Input name="email" type="email" placeholder="Email Address" required className="italic font-bold" disabled={status === 'submitting'} />
              <Input name="phone" type="tel" placeholder="Phone Number (Optional)" className="italic font-bold" disabled={status === 'submitting'} />
              
              <div className="flex flex-col space-y-2 w-full">
                <textarea
                  name="message"
                  className="bg-transparent border-b border-outline-variant py-2 focus:outline-none focus:border-primary transition-colors font-body text-sm min-h-[100px] resize-y italic font-bold disabled:opacity-50"
                  placeholder="Tell us about your project (quantity, design ideas, timeline)..."
                  required
                  disabled={status === 'submitting'}
                />
              </div>
              
              <LiquidButton 
                type="submit" 
                className="w-full text-white border border-outline-variant rounded-none uppercase tracking-widest font-bold font-label" 
                size="xl"
              >
                {status === 'submitting' ? 'SENDING INQUIRY...' : 'SEND INQUIRY'}
              </LiquidButton>
            </form>

            {/* Overlays for Success and Setup States */}
            {status === 'success' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#121212]/95 backdrop-blur-md p-8 text-center"
              >
                <IoCheckmarkCircleOutline className="w-20 h-20 text-green-500 mb-6" />
                <h3 className="font-headline text-3xl uppercase tracking-tighter font-bold mb-4">Request Sent!</h3>
                <p className="font-body text-gray-300">Your inquiry has been successfully delivered to the studio. We'll be in touch shortly.</p>
              </motion.div>
            )}

            {status === 'needs_key' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#121212]/95 backdrop-blur-md p-8 text-center border-t-4 border-red-500"
              >
                <IoWarningOutline className="w-20 h-20 text-red-500 mb-6" />
                <h3 className="font-headline text-3xl uppercase tracking-tighter font-bold mb-4">Delivery Failed</h3>
                <p className="font-body text-gray-300 mb-6 text-sm">
                  We couldn't connect securely to the form service. 
                  (Make sure WEB3FORMS_ACCESS_KEY is set in the secure environment variables of the server).
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-sm underline text-gray-400 hover:text-white"
                >
                  Go Back to Form
                </button>
              </motion.div>
            )}
          </div>

          {/* Direct Contact Info */}
          <div className="space-y-12 flex flex-col justify-center">
            <div>
              <h4 className="font-serif text-[13px] uppercase tracking-[0.2em] mb-8 text-[#a99c46] font-bold italic no-underline">Connect With Us</h4>
              <div className="flex justify-start">
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
                  },
                  {
                    title: 'Email',
                    icon: <IoMailOutline />,
                    gradientFrom: '#ffffff',
                    gradientTo: '#a3a3a3',
                    href: 'mailto:9jaideepbh@gmail.com'
                  }
                ]} />
              </div>
            </div>

            <div>
              <h4 className="font-label text-[14px] leading-[17px] uppercase tracking-[0.2em] text-white mb-4 font-bold not-italic no-underline">Studio Location</h4>
              <p className="font-[Verdana] text-[#e0d95d] font-bold italic leading-relaxed">
                124 Creative District<br />
                Mumbai, MH 400001<br />
                India
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
