import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Monaco GP 1992',
    category: 'F1 PRINT',
    price: '₹1499',
    desc: 'Vintage wash heavyweight jersey with retro Monaco GP graphic.',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=1000&auto=format&fit=crop' }
    ]
  },
  {
    id: 2,
    name: 'Cyberpunk 3D Matrix',
    category: '3D Prints',
    price: '₹2499',
    desc: 'High-density 3D puff print on 240gsm organic cotton blank. Tactical feel.',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop' },
      { type: 'video', url: '/hero-video.mp4' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop' }
    ]
  },
  {
    id: 3,
    name: 'Pulp Fiction Retro',
    category: 'MOVIE PRINT',
    price: '₹1299',
    desc: 'Soft vintage wash tee featuring classic cinema artwork layout.',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=1000&auto=format&fit=crop' }
    ]
  },
  {
    id: 4,
    name: 'Silverstone Track Layout',
    category: 'F1 PRINT',
    price: '₹1599',
    desc: 'Minimalist Silverstone track print on back, subtle team logo on chest.',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=1000&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop' }
    ]
  },
  {
    id: 5,
    name: 'Interstellar Horizons',
    category: 'MOVIE PRINT',
    price: '₹1499',
    desc: 'Deep space aesthetic printed on pitch black heavyweight cotton.',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop' },
      { type: 'video', url: '/hero-video.mp4' }
    ]
  },
  {
    id: 6,
    name: 'Geometric 3D Illusion',
    category: '3D Prints',
    price: '₹1999',
    desc: 'Complex geometric patterns featuring tactile 3D rubberized printing.',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=1000&auto=format&fit=crop' }
    ]
  },
  {
    id: 7,
    name: 'Red Bull Racing Polo',
    category: 'F1 PRINT',
    price: '₹1999',
    desc: 'Official style Red Bull polo. Premium material with high-quality printing.',
    media: [
      { type: 'image', url: '/red-bull-1.jpg' }, 
      { type: 'image', url: '/red-bull-2.jpg' },
      { type: 'image', url: '/red-bull-3.jpg' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=1000&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1000&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?q=80&w=1000&auto=format&fit=crop' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?q=80&w=1000&auto=format&fit=crop' }
    ]
  }
];
