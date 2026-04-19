import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MessageCircle, Share2, Heart, ArrowLeft, Star, ChevronRight, Copy, Info, CheckCircle2 } from 'lucide-react';
import { products } from '../data/products';
import { Product } from '../types';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeMedia, setActiveMedia] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const found = products.find(p => p.id === Number(id));
    if (found) {
      setProduct(found);
      window.scrollTo(0, 0);
    } else {
      navigate('/shop');
    }
  }, [id, navigate]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setActiveMedia(index);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name,
          text: `Check out this ${product?.name} from NYC STREET AESTHETIC`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (!product) return null;

  const similarProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-white min-h-screen text-gray-900 pb-20 font-sans selection:bg-[#632dbc]/20">
      {/* Mobile Top Navigation Sticky */}
      <div className="fixed top-0 inset-x-0 h-16 flex items-center justify-between px-4 z-[100] transition-all bg-white/10 backdrop-blur-sm md:bg-white md:border-b md:border-gray-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-gray-800 active:scale-90 transition-transform shadow-sm"
          >
            <ArrowLeft size={24} />
          </button>
        </div>
        <div className="flex gap-3">
          <button onClick={handleShare} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-gray-800 active:scale-90 transition-transform shadow-sm"><Share2 size={20} /></button>
          <button onClick={() => setIsLiked(!isLiked)} className={`w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md active:scale-90 transition-all shadow-sm ${isLiked ? 'text-red-500' : 'text-gray-800'}`}>
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="pt-0 max-w-screen-xl mx-auto">
        {/* Large Hero Carousel */}
        <div className="relative w-full aspect-[3/4] md:aspect-[4/5] bg-gray-50">
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none h-full w-full"
          >
            {product.media.map((item, idx) => (
              <div key={idx} className="flex-shrink-0 w-full h-full snap-center relative">
                {item.type === 'image' ? (
                  <img 
                    src={item.url} 
                    alt={`${product.name} ${idx + 1}`} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <video 
                    src={item.url} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Top Gradient Overlay for header icons */}
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

          {/* Just Launched Badge */}
          <div className="absolute top-4 left-0 z-10">
            <div className="bg-[#632dbc] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-tighter">
              Just Launched
            </div>
          </div>

          {/* View Similar Button */}
          <div className="absolute bottom-6 left-4 z-10">
            <button className="bg-white/90 backdrop-blur-sm border border-gray-100 px-3 py-2 rounded-lg flex items-center gap-2 text-xs font-bold text-gray-800 shadow-sm active:scale-95 transition-transform">
              <Star size={14} className="text-[#632dbc]" />
              View Similar
            </button>
          </div>

          {/* Brand Rating Card */}
          <div className="absolute bottom-6 right-4 z-10">
            <div className="bg-white/90 backdrop-blur-sm border border-gray-100 p-2 rounded-xl flex flex-col items-center gap-0.5 shadow-sm">
               <span className="text-[10px] font-bold text-gray-500 uppercase">Brand Rating</span>
               <div className="flex items-center gap-1">
                  <span className="text-sm font-black">4.3</span>
                  <Star size={12} fill="#632dbc" className="text-[#632dbc]" />
               </div>
            </div>
          </div>

          {/* Indicator Dots */}
          <div className="absolute bottom-16 inset-x-0 flex justify-center gap-1.5 z-10">
            {product.media.map((_, idx) => (
              <div 
                key={idx} 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${activeMedia === idx ? 'bg-gray-800 w-3' : 'bg-gray-400 opacity-50'}`}
              />
            ))}
          </div>
        </div>

        {/* Product Information - Myntra Style */}
        <section className="px-5 py-6 space-y-5">
          <div className="space-y-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-black text-gray-900 leading-tight tracking-tight uppercase">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-500 font-medium">{product.category}</p>
              </div>
              <div className="flex gap-3 mt-1">
                <button onClick={handleShare} className="p-2 border border-gray-200 rounded-lg"><Share2 size={18} /></button>
                <button onClick={() => setIsLiked(!isLiked)} className={`p-2 border border-gray-200 rounded-lg ${isLiked ? 'text-red-500 bg-red-50 border-red-100' : ''}`}>
                  <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-black text-gray-900">₹2,331</span>
            <span className="text-sm text-gray-400 line-through">MRP {product.price}</span>
            <span className="text-sm font-bold text-[#632dbc]">(40% OFF)</span>
          </div>

          {/* Offer Banner */}
          <div className="bg-[#632dbc]/5 border border-[#632dbc]/10 rounded-xl p-4 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#632dbc] rounded-lg flex items-center justify-center text-white font-black text-xs italic">
                   %
                </div>
                <div>
                   <h4 className="text-sm font-bold">Extra ₹468 Off</h4>
                   <p className="text-[10px] text-gray-500 font-medium">With Coupon + Bank Offer</p>
                </div>
             </div>
             <button className="text-[#632dbc] text-xs font-bold flex items-center gap-1">
                Details <ChevronRight size={14} />
             </button>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Size Section */}
          <div id="size-section">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Select Size</h3>
              <button className="text-[10px] font-bold text-[#632dbc] uppercase hover:underline">Size Chart</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {['XS', 'S', 'M', 'L', 'XL', '2XL'].map(sz => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`min-w-[56px] h-14 flex items-center justify-center rounded-full border-2 font-black transition-all active:scale-90 ${
                    selectedSize === sz 
                      ? 'bg-gray-900 text-white border-gray-900' 
                      : 'border-gray-200 text-gray-800 hover:border-gray-400'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#632dbc] uppercase bg-[#632dbc]/5 px-3 py-1.5 rounded-full w-fit">
               <Info size={12} />
               Size {selectedSize || '40'} Recommended
            </div>
            <p className="text-xs text-gray-500 leading-relaxed italic">
               "{product.desc}"
            </p>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Quality Badges */}
          <div className="grid grid-cols-2 gap-4">
             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <CheckCircle2 size={24} className="text-[#632dbc]" />
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold uppercase text-gray-900">Genuine</span>
                   <span className="text-[10px] text-gray-500 uppercase">Product</span>
                </div>
             </div>
             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <CheckCircle2 size={24} className="text-[#632dbc]" />
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold uppercase text-gray-900">Quality</span>
                   <span className="text-[10px] text-gray-500 uppercase">Checked</span>
                </div>
             </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Product Specs Detail */}
          <div className="space-y-4">
             <h3 className="text-sm font-black text-gray-900 uppercase">Product Details</h3>
             <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <div>
                   <p className="text-[10px] text-gray-400 font-bold uppercase">Fabric</p>
                   <p className="text-xs font-semibold">100% Cotton</p>
                </div>
                <div>
                   <p className="text-[10px] text-gray-400 font-bold uppercase">Fit</p>
                   <p className="text-xs font-semibold">Boxy/Street</p>
                </div>
                <div>
                   <p className="text-[10px] text-gray-400 font-bold uppercase">Weight</p>
                   <p className="text-xs font-semibold">240 GSM (Heavy)</p>
                </div>
                <div>
                   <p className="text-[10px] text-gray-400 font-bold uppercase">Country</p>
                   <p className="text-xs font-semibold">India</p>
                </div>
             </div>
          </div>
        </section>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section className="mt-8 px-5 pb-12 overflow-hidden bg-gray-50/50 py-8 border-t border-gray-100">
            <h3 className="text-lg font-black text-gray-900 uppercase mb-6 tracking-tight">Similar Products</h3>
            <div className="flex gap-4 overflow-x-auto scrollbar-none snap-x">
              {similarProducts.map(p => (
                <Link 
                  key={p.id} 
                  to={`/product/${p.id}`} 
                  className="flex-shrink-0 w-[160px] snap-start bg-white rounded-2xl p-2 border border-gray-100 shadow-sm"
                >
                  <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3">
                    <img 
                      src={p.media[0].url} 
                      alt={p.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-tight text-gray-900 truncate mb-1">{p.name}</h4>
                  <p className="text-xs font-black text-[#632dbc]">{p.price}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky Bottom Bar - FIXED AND VISIBLE */}
      <div className="fixed bottom-0 inset-x-0 p-3 bg-white/95 backdrop-blur-lg border-t border-gray-100 z-[110] flex gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
         <button className="flex-1 h-12 flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 font-black uppercase text-xs rounded-xl active:scale-95 transition-transform">
            <Heart size={18} />
            Wishlist
         </button>
         <a
            href={selectedSize ? `https://wa.me/919606643005?text=${encodeURIComponent(`Hi! I am interested in ordering the ${product.name} (Size: ${selectedSize}) from the gallery.`)}` : '#'}
            target={selectedSize ? "_blank" : "_self"}
            rel="noopener noreferrer"
            onClick={(e) => {
              if (!selectedSize) {
                e.preventDefault();
                document.getElementById('size-section')?.scrollIntoView({ behavior: 'smooth' });
                alert("Please select a size first");
              }
            }}
            className="flex-[1.5]"
          >
            <button className={`w-full h-12 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
              selectedSize 
                ? 'bg-[#25D366] text-white shadow-[0_4px_12px_rgba(37,211,102,0.3)]' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}>
              <MessageCircle size={18} />
              {selectedSize ? "Order on WhatsApp" : "Select Size"}
            </button>
         </a>
      </div>
    </div>
  );
}
