import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/src/components/Button';
import { Upload, RefreshCcw } from 'lucide-react';
import TShirtViewer from '@/src/components/ui/tshirt-viewer';

const COLORS = [
  { name: 'Phantom Black', hex: '#111111' },
  { name: 'Graphite', hex: '#333333' },
  { name: 'Ash Grey', hex: '#777777' },
  { name: 'Silver', hex: '#cccccc' },
  { name: 'Ghost White', hex: '#f5f5f5' },
];

export default function Customize() {
  const [selectedColor, setSelectedColor] = useState(COLORS[1]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoName, setLogoName] = useState<string | null>(null);
  const [customNotes, setCustomNotes] = useState('');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
      setLogoName(file.name);
    }
  };

  const resetDesign = () => {
    setLogoUrl(null);
    setLogoName(null);
  };

  const whatsappMessage = `Hi! I'm interested in a custom T-shirt design.
Base color: ${selectedColor.name}
${logoName ? `Graphic attached: ${logoName} (I will send the image in this chat)` : 'No custom graphic'}
${customNotes ? `Notes: ${customNotes}` : ''}`;

  const whatsappUrl = `https://wa.me/919606643005?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-6 max-w-screen-xl mx-auto w-full pt-8"
    >
      <header className="mb-12">
        <p className="font-label text-[0.6875rem] uppercase tracking-[0.2rem] text-outline mb-4">Interactive Studio</p>
        <h2 className="font-headline text-4xl md:text-6xl leading-tight">3D Customization.</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* 3D Preview Area */}
        <div className="lg:col-span-7 bg-surface-container-low aspect-[3/4] relative overflow-hidden flex items-center justify-center group rounded-2xl">
          <TShirtViewer color={selectedColor.hex} logoUrl={logoUrl} />

          <div className="absolute bottom-6 right-6 z-30 flex gap-2">
            <button 
              onClick={resetDesign}
              className="w-10 h-10 bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center hover:bg-surface-container-lowest transition-colors rounded-full shadow-sm"
              title="Reset Design"
            >
              <RefreshCcw className="w-4 h-4 text-primary" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-5 space-y-12 lg:sticky lg:top-24 self-start pb-24">
          {/* Color Selection */}
          <div className="space-y-6">
            <h3 className="font-headline text-2xl">Select Base Color</h3>
            <div className="flex flex-wrap gap-4">
              {COLORS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`w-12 h-12 rounded-full border-2 transition-all ${
                    selectedColor.name === color.name ? 'border-primary scale-110' : 'border-transparent hover:scale-105'
                  } shadow-sm`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">
              Current: {selectedColor.name}
            </p>
          </div>

          {/* Graphic Upload */}
          <div className="space-y-6 pt-8 border-t border-outline-variant/20">
            <h3 className="font-headline text-2xl">Upload Graphic</h3>
            <p className="font-body text-sm text-on-surface-variant">
              Upload your custom design, logo, or artwork to visualize it on the garment. High-resolution PNGs with transparent backgrounds work best.
            </p>
            
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-outline-variant hover:border-primary transition-colors cursor-pointer bg-surface-container-lowest rounded-xl">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-6 h-6 mb-3 text-outline" />
                <p className="font-label text-xs uppercase tracking-widest text-outline">
                  {logoName ? logoName : 'Click to upload'}
                </p>
              </div>
              <input type="file" className="hidden" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoUpload} />
            </label>
          </div>

          {/* Custom Notes */}
          <div className="space-y-6 pt-8 border-t border-outline-variant/20">
            <h3 className="font-headline text-2xl">Custom Notes</h3>
            <textarea
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Any specific instructions for placement, sizing, or design?"
              className="w-full h-32 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none font-body text-sm"
            />
          </div>

          {/* Inquiry Action */}
          <div className="pt-8 space-y-4">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full py-6 text-lg rounded-xl">Inquire via WhatsApp</Button>
            </a>
            <p className="text-center font-label text-[10px] text-outline tracking-wider pt-2">
              Send us your design for a custom quote.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
