import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: 'Red Bull Racing Polo',
    category: 'F1 PRINT',
    price: '₹900',
    desc: 'Official style Red Bull polo. Premium material with high-quality printing',
    media: [
      { type: 'image', url: '/red-bull-1.jpg' }, 
      { type: 'image', url: '/red-bull-2.jpg' },
      { type: 'image', url: '/red-bull-3.jpg' }
    ]
  },
  {
    id: 2,
    name: 'TOXIC - YASH',
    category: 'MOVIE PRINT',
    price: '₹700',
    desc: 'Exclusive MOVIE PRINT featuring "DADDY\'S HOME" graphic and premium TOXIC branding',
    media: [
      { type: 'image', url: '/toxic-1.jpg' },
      { type: 'image', url: '/toxic-2.jpg' }
    ]
  }
];


