import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';

const categories = ['All', 'F1 PRINT', '3D Prints', 'MOVIE PRINT'];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#050505] min-h-screen text-white pt-24 pb-20"
    >
      <div className="px-4 md:px-8 max-w-screen-xl mx-auto w-full">
        {/* Aggressive NYC Typography Header */}
        <header className="mb-12 md:mb-20 pt-4 flex flex-col">
          <div className="flex flex-col uppercase tracking-tighter w-full overflow-visible leading-[0.85] relative">
            <motion.h1 
              initial={{ y: 80, opacity: 0, scale: 0.9, rotateX: 20 }}
              animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-[18vw] md:text-[13vw] font-black z-10 italic mb-2 md:mb-4 -ml-2"
              style={{ 
                fontFamily: 'Impact, "Arial Black", sans-serif',
                color: '#fff',
                textShadow: `
                  3px 3px 0 #632dbc,
                  6px 6px 0 #632dbc,
                  9px 9px 0 #632dbc,
                  12px 12px 0 #632dbc,
                  15px 15px 0 #632dbc,
                  25px 25px 30px rgba(0,0,0,0.9)
                `,
                transform: 'perspective(500px) translateZ(30px) skewX(-5deg)',
              }}
            >
              GALLERY
            </motion.h1>
            
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="origin-left h-2 md:h-4 w-full bg-[#632dbc] my-3 md:my-0 z-0"
            />

            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col pt-4 md:pt-1"
            >
              <h2 
                className="text-[14vw] md:text-[9vw] font-black text-transparent"
                style={{ 
                  WebkitTextStroke: '2px rgba(255,255,255,0.9)', 
                  fontFamily: '"Helvetica Neue", Impact, sans-serif',
                  marginLeft: '2px'
                }}
              >
                NYC STREET
              </h2>
            </motion.div>
            
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-end pr-4 md:pr-8 mt-2 md:-mt-8"
            >
              <h2 
                className="text-[12vw] md:text-[8vw] font-black italic text-transparent relative tracking-wider"
                style={{ 
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  WebkitTextStroke: '2px rgba(255, 255, 255, 0.9)',
                  textShadow: '4px 4px 0px rgba(99, 45, 188, 1)'
                }}
              >
                AESTHETIC
              </h2>
            </motion.div>
            
            {/* Background floating text for aggressive layering */}
            <h1 
              className="absolute top-1/2 left-0 -translate-y-1/2 text-[25vw] md:text-[20vw] font-black text-white opacity-[0.03] pointer-events-none whitespace-nowrap z-[-1]"
              style={{ fontFamily: 'Impact, sans-serif' }}
            >
              RAW UNCUT
            </h1>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="mt-12 md:mt-20 flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <p className="text-gray-300 max-w-xl text-sm md:text-base font-medium leading-relaxed font-mono uppercase tracking-widest border-l-[3px] border-[#632dbc] pl-5">
              // About the Gallery <br/><br/>
              A curated collection of heavyweight blanks, raw streetwear prints, and uncompromising custom tailoring built for the concrete streets. No rules, just raw expression.
            </p>
            
            <div className="flex text-[10px] items-center gap-4 text-gray-500 font-mono tracking-widest uppercase">
              <span>Vol. 01</span>
              <span>/</span>
              <span>2026 Collection</span>
            </div>
          </motion.div>
        </header>

        {/* Categories Tab */}
        <div className="flex flex-wrap gap-3 pb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all active:scale-95 ${
                activeCategory === cat 
                  ? 'bg-white text-black shadow-[0_4px_12px_rgba(255,255,255,0.15)]' 
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Clean Premium Grid */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02, y: -6 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                key={product.id}
                className="group flex flex-col"
              >
                <Link to={`/product/${product.id}`} className="cursor-pointer">
                  {/* Image Container with Soft Shadow & Rounded Corners */}
                  <div className="relative aspect-[4/5] bg-[#111] rounded-2xl md:rounded-3xl overflow-hidden mb-4 shadow-sm group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-all duration-500">
                    <img
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={product.media[0].url}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                  </div>

                  {/* Product Info (Minimalist) */}
                  <div className="px-1 flex flex-col gap-1 transition-transform duration-500 group-hover:translate-x-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-sm md:text-base text-gray-100 leading-tight line-clamp-1">{product.name}</h3>
                      <span className="font-semibold text-sm md:text-base text-gray-100">{product.price}</span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-400 line-clamp-2 md:line-clamp-1">{product.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
