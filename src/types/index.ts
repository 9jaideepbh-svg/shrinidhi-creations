export type Media = {
  type: 'image' | 'video';
  url: string;
};

export type Product = {
  id: number;
  name: string;
  category: string;
  price: string;
  desc: string;
  media: Media[];
};
