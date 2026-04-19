import React from 'react';
import { motion } from 'motion/react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/src/components/Button';

const wishlistItems = [
  {
    id: 1,
    name: 'Sculpted Silk Gown',
    collection: "AUTUMN / WINTER '24",
    price: '$2,450.00',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXjm9gytZ_vcWUwuQtTUMW7UVTAGFj0tPbYXZa_Pb5veWnmekt9H4g_dD1BYk-gKY6P4W-55ImCXo7tVwRNaKQpvRHRVUljk5-ka7xFJ2ESLobdWw0V5tjiat3TloS6UFTRnSSKcqHWnxPfOMt2Vsw3RuLE_afbkAKafGbRUYzU-FlcmWLyW2lf8DFRMjJNXRNqlsZbOj5xklFzvlvKzByQVpQQ_rqhafTiVGiXXLMgdSLRih2uS28gVQmd5l1tiXULhOb5B8fd7Y',
    colSpan: 'md:col-span-7',
    aspect: 'aspect-square',
    layout: 'large-offset'
  },
  {
    id: 2,
    name: 'Archive Clutch',
    collection: '',
    price: '$890.00',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfCXnEoxSjm1vprDCZIO6xHGH4yyRMrAWoA0tdrYH1frMCHvrGY4V-ZZhXqiSM9kCn3qSQUvmnHioppH0PYXbG3rbYfkPaHKcsn3ZR8ql8d0e1YRexykhOPPIDOFMizI-KMK1spqGVVokHHgaEDlkdYqWOqoLb96JprRCRYp01BQC4GcvojMubvOv8ciX0N9Vo7njV3GrCND80HH79hmAixUYDGere_37Ohx0hXD0yf5GGXhDnx5AZSPTVgVvJfIiFRoudsiRMvAA',
    colSpan: 'md:col-start-9 md:col-span-4 md:mt-12',
    aspect: 'aspect-square',
    layout: 'small-offset'
  },
  {
    id: 3,
    name: 'Structured Blazer',
    collection: '',
    price: '$1,200.00',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDa0AOJS1_hnUDp5sTjQBKwvZnErVdmSuRWibtbC2OxMO3YBdF2vh_CiiLc9g_tCKxgdGq3f10v4ukY2SsANfrB5kW-0aMpcnjq9nK-RtqAa7SX3BP5m-wuXR_TYoE1NXh5PDBD029VzWutYrCp9U6_6jKmmgoey9jm9pV_FkDAw5oL8lu3Ab2Msrhy1Cg_bidj5l8QCmmqjnpTydARkfmVWXqsW2mpfBjTQ5FpodtSNI1PCE9YUPZcu-7Bc6WJUCCx5wJcEsP4MhE',
    colSpan: 'md:col-span-5 md:mt-[-8rem]',
    aspect: 'aspect-[4/5]',
    layout: 'wide-thin'
  },
  {
    id: 4,
    name: 'Lumière Trench',
    collection: 'LIMITED EDITION',
    price: '$3,100.00',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY3wii-Z4qR0xFlKFPvv4vnkF_KTx2WERbN3fhmhdFxcIPOg2Xqx3nhnMLnNOaeuiT1JTmbY3IfHPS17KWSGxk5SPK6oVgMACf8_1yJHFqSqfGig6p218DlZ_NqVliWOvJcvyLTTmrKMcAjchrkZ5zShL-fujANRW9C-4arGKku9eklL5rhtuGkMtYkALlqKAKdF1Ye3Vn7mzV3VNl25R28XBPMPsvJgKpSwlxQKMbjUUttFxJIxX7Ue-cvdjJH-j72QnK0s8QSnA',
    colSpan: 'md:col-start-7 md:col-span-6',
    aspect: 'aspect-square',
    layout: 'high-contrast'
  }
];

export default function Wishlist() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="px-6 max-w-screen-xl mx-auto w-full"
    >
      {/* Header Section */}
      <header className="mb-16 mt-8">
        <p className="font-label text-[0.6875rem] uppercase tracking-[0.2em] text-outline mb-4">Curated Selection</p>
        <h2 className="font-headline text-5xl md:text-6xl italic leading-tight">Wishlist</h2>
      </header>

      {/* Wishlist Grid: Asymmetric Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-y-24 md:gap-x-12">
        {wishlistItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${item.colSpan} group`}
          >
            <div className={`relative overflow-hidden bg-surface-dim ${item.aspect} mb-8`}>
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={item.img}
                referrerPolicy="no-referrer"
              />
              <button className="absolute top-6 right-6 p-3 bg-surface-container-lowest/80 backdrop-blur-sm">
                <X className="w-5 h-5 text-primary" />
              </button>
            </div>

            {item.layout === 'large-offset' && (
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-headline text-2xl">{item.name}</h3>
                  <p className="font-label text-sm uppercase tracking-widest text-on-surface-variant">{item.collection}</p>
                  <p className="text-lg mt-4 font-light">{item.price}</p>
                </div>
                <div className="flex flex-col items-end gap-6">
                  <Button className="px-8 py-4">Move to Bag</Button>
                  <button className="editorial-underline font-label text-[0.6875rem] uppercase tracking-widest">
                    Remove
                  </button>
                </div>
              </div>
            )}

            {item.layout === 'small-offset' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-headline text-xl">{item.name}</h3>
                  <p className="text-md font-light">{item.price}</p>
                </div>
                <button className="w-full border-b border-outline-variant py-4 text-left flex justify-between items-center group/btn">
                  <span className="font-label text-sm uppercase tracking-widest">Move to Bag</span>
                  <span className="material-symbols-outlined transform group-hover/btn:translate-x-2 transition-transform">arrow_forward</span>
                </button>
              </div>
            )}

            {item.layout === 'wide-thin' && (
              <div className="space-y-2">
                <h3 className="font-headline text-2xl">{item.name}</h3>
                <p className="text-lg font-light">{item.price}</p>
                <div className="pt-6 flex gap-8">
                  <button className="editorial-underline font-label text-sm uppercase tracking-widest">Add to Bag</button>
                  <button className="text-outline hover:text-primary transition-colors font-label text-sm uppercase tracking-widest">Remove</button>
                </div>
              </div>
            )}

            {item.layout === 'high-contrast' && (
              <div className="flex justify-between items-end border-t border-outline-variant/20 pt-8">
                <div>
                  <h3 className="font-headline text-3xl">{item.name}</h3>
                  <p className="font-label text-[0.6875rem] uppercase tracking-[0.2rem] text-outline mt-2">{item.collection}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-light mb-4">{item.price}</p>
                  <Button className="px-10 py-5">Move to Bag</Button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Pagination/Footer Context */}
      <div className="mt-32 border-t border-outline-variant/15 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <p className="font-label text-xs uppercase tracking-[0.3em] text-outline">Viewing 4 of 12 items</p>
        <button className="editorial-underline font-label text-sm uppercase tracking-widest py-2">Load More Saved Items</button>
      </div>

      {/* FAB */}
      <div className="fixed bottom-24 right-6 z-40">
        <button className="w-14 h-14 bg-primary text-on-primary flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
          <Filter className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
