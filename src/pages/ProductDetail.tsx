import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MessageCircle, Share2, ArrowLeft,
  ChevronRight, ChevronLeft, CheckCircle2,
  Volume2, VolumeX, X, ZoomIn,
} from 'lucide-react';
import { getProduct, getProducts, type FirestoreProduct } from '../lib/products';

// Normalised media item (same shape as old static data)
type MediaItem = { type: 'image' | 'video'; url: string };

// Helper: first image of a Firestore product for the similar-products strip
function firstImage(p: FirestoreProduct): string {
  return p.images?.[0] ?? '';
}

// Helper: format price
function formatPrice(price?: number | null): string {
  if (price == null) return '';
  return `₹${price}`;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<FirestoreProduct | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [similarProducts, setSimilarProducts] = useState<FirestoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeMedia, setActiveMedia] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({});
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [expandedMedia, setExpandedMedia] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch product + similar products from Firestore
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setActiveMedia(0);
    setSelectedSize(null);
    setImagesLoaded({});

    Promise.all([getProduct(id), getProducts()])
      .then(([prod, allProds]) => {
        if (!prod) {
          navigate('/gallery');
          return;
        }
        setProduct(prod);

        // Normalise Firestore images[] + optional video into MediaItem[]
        const normalised: MediaItem[] = [
          ...(prod.images ?? []).map((url) => ({ type: 'image' as const, url })),
          ...(prod.video ? [{ type: 'video' as const, url: prod.video }] : []),
        ];
        setMedia(normalised);

        setSimilarProducts(
          allProds.filter((p) => p.category === prod.category && p.id !== prod.id)
        );


        window.scrollTo(0, 0);
      })
      .catch(() => navigate('/gallery'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleImageLoad = (idx: number) => {
    setImagesLoaded((prev) => ({ ...prev, [idx]: true }));
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      setActiveMedia(Math.round(scrollLeft / clientWidth));
    }
  };

  const scrollToMedia = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: index * scrollRef.current.clientWidth, behavior: 'smooth' });
      setActiveMedia(index);
    }
  };

  const nextMedia = () => { if (activeMedia < media.length - 1) scrollToMedia(activeMedia + 1); };
  const prevMedia = () => { if (activeMedia > 0) scrollToMedia(activeMedia - 1); };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name,
          text: `Check out this ${product?.name} from SHRINIDHI CREATIONS`,
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

  // ── Loading state ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#632dbc]/30 border-t-[#632dbc] rounded-full animate-spin" />
          <span className="text-white/30 text-xs font-mono uppercase tracking-widest">Loading product…</span>
        </div>
      </div>
    );
  }

  if (!product || media.length === 0) return null;

  // Sizes: use sizes from product if available, else sensible defaults
  const sizeOptions = product.sizes && product.sizes.length > 0
    ? product.sizes
    : ['XS', 'S', 'M', 'L', 'XL', '2XL'];

  const priceDisplay = formatPrice(product.price);

  return (
    <div
      className="bg-[#0a0a0a] min-h-screen text-white pb-32 font-body selection:bg-[#632dbc]/30"
      onClick={() => setSelectedSize(null)}
    >
      {/* ── Fixed Header ──────────────────────────────────────────── */}
      <div className="fixed top-0 inset-x-0 h-20 flex items-center justify-between px-4 z-[100] bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-95 transition-all text-white shadow-lg shadow-black/50"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col">
            <span className="font-headline text-lg font-black tracking-tighter italic text-[#632dbc] leading-none uppercase">
              Shrinidhi
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Creations</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 active:scale-95 transition-all text-white shadow-lg"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="pt-24 max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">

          {/* ── Hero Carousel ───────────────────────────────────────── */}
          <div className="relative w-full aspect-[3/4] md:aspect-[4/5] lg:aspect-[4/5] bg-[#050505] overflow-hidden rounded-[2rem] border border-white/5 lg:sticky lg:top-28 group/carousel">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none h-full w-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {media.map((item, idx) => (
                <div key={idx} className="flex-shrink-0 w-full h-full snap-center relative bg-[#050505] flex items-center justify-center p-4 md:p-8 lg:p-12">
                  {!imagesLoaded[idx] && (
                    <div className="absolute inset-0 animate-pulse bg-white/5 flex items-center justify-center">
                      <div className="w-10 h-10 border-2 border-[#632dbc]/20 border-t-[#632dbc] rounded-full animate-spin" />
                    </div>
                  )}

                  {item.type === 'image' ? (
                    <div
                      className="relative w-full h-full flex items-center justify-center cursor-zoom-in"
                      onClick={() => setExpandedMedia(idx)}
                    >
                      <img
                        src={item.url}
                        alt={`${product.name} ${idx + 1}`}
                        className={`max-w-full max-h-full object-contain transition-all duration-700 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] active:scale-95 ${imagesLoaded[idx] ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => handleImageLoad(idx)}
                        loading={idx === 0 ? 'eager' : 'lazy'}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 opacity-0 group-hover/carousel:opacity-100 transition-opacity bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10">
                        <ZoomIn size={18} className="text-white/60" />
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <video
                        src={item.url}
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                        onLoadedData={() => handleImageLoad(idx)}
                        className={`max-w-full max-h-full object-contain transition-opacity duration-700 ${imagesLoaded[idx] ? 'opacity-100' : 'opacity-0'}`}
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                        className="absolute bottom-12 right-6 z-30 p-4 bg-black/60 hover:bg-[#632dbc] transition-all rounded-full text-white backdrop-blur-xl border border-white/20 active:scale-90 shadow-2xl flex items-center gap-3"
                      >
                        {isMuted && (
                          <span className="text-[10px] font-black uppercase tracking-widest pl-2 animate-pulse">Tap for sound</span>
                        )}
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {media.length > 1 && (
              <>
                <button
                  onClick={prevMedia}
                  disabled={activeMedia === 0}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white z-20 transition-all ${activeMedia === 0 ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-0 group-hover/carousel:opacity-100'}`}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextMedia}
                  disabled={activeMedia === media.length - 1}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white z-20 transition-all ${activeMedia === media.length - 1 ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-0 group-hover/carousel:opacity-100'}`}
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Dot Indicators */}
            <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2 z-10">
              {media.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToMedia(idx)}
                  className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${activeMedia === idx ? 'w-10 bg-[#632dbc]' : 'w-2 bg-white/10'}`}
                />
              ))}
            </div>
          </div>

          {/* ── Product Info ─────────────────────────────────────────── */}
          <div className="lg:space-y-4">
            <section className="px-2 py-10 lg:py-0 space-y-12">
              <div className="flex flex-col gap-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#632dbc] bg-[#632dbc]/10 px-3 py-1 rounded-full border border-[#632dbc]/20">
                    {product.category}
                  </span>
                  <h1 className="font-headline text-4xl md:text-5xl lg:text-7xl font-black text-white italic leading-[0.9] tracking-tighter uppercase max-w-2xl mt-4">
                    {product.name}
                  </h1>
                </div>
                {priceDisplay && (
                  <div className="flex flex-col items-start">
                    <span className="text-3xl md:text-4xl lg:text-6xl font-headline font-black text-white tracking-tighter">
                      {priceDisplay}
                    </span>
                    <span className="text-[10px] font-bold text-white/30 tracking-[0.2em] uppercase">Taxes Included</span>
                  </div>
                )}
              </div>

              <div className="h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent w-full" />

              {/* Size Selection */}
              <div id="size-section" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-headline text-sm font-black text-white uppercase tracking-widest italic">Size Selection</h3>
                </div>
                <div className="flex flex-wrap gap-3" onClick={(e) => e.stopPropagation()}>
                  {sizeOptions.map((sz) => (
                    <button
                      key={sz}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSize(selectedSize === sz ? null : sz);
                      }}
                      className={`min-w-[56px] lg:min-w-[70px] h-12 lg:h-14 flex items-center justify-center rounded-xl border-2 font-headline italic font-black text-sm transition-all active:scale-95 relative overflow-hidden ${
                        selectedSize === sz
                          ? 'bg-[#632dbc] text-white border-[#632dbc] shadow-[0_5px_15px_rgba(99,45,188,0.3)]'
                          : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
                      }`}
                    >
                      <span className="relative z-10">{sz}</span>
                      {selectedSize === sz && (
                        <motion.div
                          layoutId="size-glow"
                          className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-6">
                <div className="p-6 lg:p-8 bg-white/[0.02] border border-white/5 rounded-3xl">
                  <p className="text-sm md:text-lg lg:text-xl text-white/60 leading-relaxed font-medium">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Quality Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:bg-white/[0.04] transition-all">
                  <div className="w-12 h-12 bg-[#632dbc]/20 rounded-2xl flex items-center justify-center text-[#632dbc]">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <span className="block text-sm font-black uppercase tracking-tight text-white mb-1">Authentic</span>
                    <span className="block text-[10px] text-white/40 uppercase tracking-widest font-bold">Studio Piece</span>
                  </div>
                </div>
                <div className="flex flex-col gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:bg-white/[0.04] transition-all">
                  <div className="w-12 h-12 bg-[#632dbc]/20 rounded-2xl flex items-center justify-center text-[#632dbc]">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <span className="block text-sm font-black uppercase tracking-tight text-white mb-1">Heavy Duty</span>
                    <span className="block text-[10px] text-white/40 uppercase tracking-widest font-bold">240 GSM (TEE) / 320 GSM (HOODIE)</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* ── Similar Products ─────────────────────────────────────── */}
        {similarProducts.length > 0 && (
          <section className="mt-20 pb-24">
            <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-6">
              <div>
                <h3 className="font-headline text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Similar Drop</h3>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-bold mt-2">
                  {similarProducts.length} more in {product.category}
                </p>
              </div>
              <Link to="/gallery" className="text-[10px] font-black text-[#632dbc] uppercase tracking-widest">See All</Link>
            </div>

            {/* Responsive grid — 2 cols on mobile, 3 on md, 4 on lg */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {similarProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group block"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-3 bg-white/[0.02] border border-white/5 group-hover:border-[#632dbc]/40 transition-all duration-300 flex items-center justify-center p-2">
                    <img
                      src={firstImage(p)}
                      alt={p.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-xl"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                  <h4 className="font-headline text-sm font-black uppercase tracking-tight text-white truncate mb-0.5 italic">{p.name}</h4>
                  <p className="text-xs font-bold text-[#632dbc]">{formatPrice(p.price)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Sticky WhatsApp Order Bar ─────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/95 to-transparent z-[110]">
        <a
          href={
            selectedSize
              ? `https://wa.me/918553868587?text=${encodeURIComponent(
                  `Hi! I am interested in ordering the *${product.name}* (Size: ${selectedSize}) from the gallery.`
                )}`
              : '#'
          }
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.stopPropagation();
            if (!selectedSize) {
              e.preventDefault();
              document.getElementById('size-section')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="block w-full max-w-screen-md mx-auto"
        >
          <button
            className={`w-full h-16 rounded-2xl font-headline font-black italic uppercase tracking-[0.1em] text-base flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
              selectedSize
                ? 'bg-[#632dbc] text-white shadow-[0_15px_30px_rgba(99,45,188,0.3)] hover:shadow-[#632dbc]/50'
                : 'bg-white/10 text-white/30 border border-white/5 cursor-not-allowed'
            }`}
          >
            <MessageCircle size={22} />
            {selectedSize ? 'Order via WhatsApp' : 'Select Size to Order'}
          </button>
        </a>
      </div>

      {/* ── Image Lightbox / Zoom Modal ───────────────────────────── */}
      <AnimatePresence>
        {expandedMedia !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-8"
            onClick={() => { setExpandedMedia(null); setZoomLevel(1); }}
          >
            <button
              className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white z-50 hover:bg-white/20 transition-all"
              onClick={() => { setExpandedMedia(null); setZoomLevel(1); }}
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {media[expandedMedia].type === 'image' ? (
                <div className="relative w-full h-full flex items-center justify-center overflow-auto scrollbar-none cursor-zoom-in">
                  <motion.img
                    src={media[expandedMedia].url}
                    className="max-w-full max-h-full object-contain drop-shadow-2xl transition-transform duration-300"
                    style={{ scale: zoomLevel, cursor: zoomLevel > 1 ? 'zoom-out' : 'zoom-in' }}
                    onClick={() => setZoomLevel(zoomLevel === 1 ? 2 : 1)}
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <video
                  src={media[expandedMedia].url}
                  autoPlay
                  controls
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </motion.div>

            {/* Modal nav arrows */}
            {media.length > 1 && (
              <div className="absolute inset-x-4 md:inset-x-8 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedMedia((expandedMedia - 1 + media.length) % media.length);
                    setZoomLevel(1);
                  }}
                  className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white pointer-events-auto hover:bg-white/10 transition-all active:scale-95"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedMedia((expandedMedia + 1) % media.length);
                    setZoomLevel(1);
                  }}
                  className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white pointer-events-auto hover:bg-white/10 transition-all active:scale-95"
                >
                  <ChevronRight size={32} />
                </button>
              </div>
            )}

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
              <p className="text-white font-headline italic font-black uppercase tracking-widest text-sm">
                {product.name} — {expandedMedia + 1} / {media.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
