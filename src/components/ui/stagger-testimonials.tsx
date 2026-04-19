"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
  {
    tempId: 0,
    testimonial: "The 3D customization blew my mind, but the actual T-shirt material is even better. Super thick and premium. Highly trustworthy team!",
    by: "Chirag, Jaynagar",
    imgSrc: "/faces/face1.jpg",
    color: "#d24e01",
    textColor: "white"
  },
  {
    tempId: 1,
    testimonial: "I was skeptical about ordering custom prints online, but Shrinidhi Creations delivered exactly what I designed. The fabric feels luxurious.",
    by: "Akshay, Malleshwaram",
    imgSrc: "/faces/face2.jpg",
    color: "#dc6601",
    textColor: "white"
  },
  {
    tempId: 2,
    testimonial: "Best streetwear blanks in the game. The print hasn't faded even after 20 washes. 10/10 would recommend.",
    by: "Praneeth, Nagasandra",
    imgSrc: "/faces/face3.jpg",
    color: "#e27602",
    textColor: "white"
  },
  {
    tempId: 3,
    testimonial: "The drop shoulder fit is perfect. It's so hard to find good quality oversized tees, but these guys nailed it.",
    by: "Surya, Rajajinagar",
    imgSrc: "/faces/face4.jpg",
    color: "#e88504",
    textColor: "white"
  },
  {
    tempId: 4,
    testimonial: "Ordered 50 custom tees for my startup. The entire process on WhatsApp was smooth, and the quality exceeded our expectations.",
    by: "Rohan, Chandra Layout",
    imgSrc: "/faces/face5.jpg",
    color: "#ec9006",
    textColor: "white"
  },
  {
    tempId: 5,
    testimonial: "Finally, a brand that understands heavy-weight cotton! The texture is amazing and the custom logo placement was flawless.",
    by: "Priya, Vijaynagar",
    imgSrc: "/faces/face6.jpg",
    color: "#ee9f27",
    textColor: "black"
  },
  {
    tempId: 6,
    testimonial: "Unbelievable quality and fit. The oversized tees are genuinely heavy-duty and drop perfectly on the shoulders.",
    by: "Divya, MG Road",
    imgSrc: "/faces/face7.jpg",
    color: "#f1b04c",
    textColor: "black"
  },
  {
    tempId: 7,
    testimonial: "The gradient prints are flawless. It is hard to find dtg prints this sharp anywhere else locally.",
    by: "Aisha, Jaynagar",
    imgSrc: "/faces/face8.jpg",
    color: "#f5c77e",
    textColor: "black"
  },
  {
    tempId: 8,
    testimonial: "Love the custom tag inclusion, makes our merch line look so premium. Shrinidhi feels like a true partner.",
    by: "Vikram, Malleshwaram",
    imgSrc: "/faces/face9.jpg",
    color: "#f9ddb1",
    textColor: "black"
  }
];

interface TestimonialCardProps {
  position: number;
  testimonial: typeof testimonials[0];
  handleMove: (steps: number) => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  position, 
  testimonial, 
  handleMove, 
  cardSize 
}) => {
  const isCenter = position === 0;

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-6 sm:p-8 transition-all duration-500 ease-in-out",
        isCenter ? "z-10 shadow-2xl" : "z-0 hover:scale-[1.02]"
      )}
      style={{
        width: cardSize,
        height: cardSize,
        backgroundColor: testimonial.color,
        color: testimonial.textColor,
        borderColor: isCenter 
          ? (testimonial.textColor === 'white' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)') 
          : 'transparent',
        clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 mix-blend-overlay opacity-30 bg-white"
        style={{
          right: -2,
          top: 48,
          width: SQRT_5000,
          height: 2
        }}
      />
      <img
        src={testimonial.imgSrc}
        alt={`${testimonial.by.split(',')[0]}`}
        className="mb-4 h-14 w-12 bg-surface-container object-cover object-top border"
        style={{
          borderColor: testimonial.textColor === 'white' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
          boxShadow: `3px 3px 0px ${testimonial.textColor === 'white' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`
        }}
      />
      <h3 className={cn(
        "text-base sm:text-xl font-bold font-headline leading-tight uppercase tracking-tight"
      )}>
        "{testimonial.testimonial}"
      </h3>
      <p className={cn(
        "absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 mt-2 text-xs sm:text-sm italic font-body opacity-80"
      )}>
        - {testimonial.by}
      </p>
    </div>
  );
};

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(365);
  const [testimonialsList, setTestimonialsList] = useState(testimonials);

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList];
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift();
        if (!item) return;
        newList.push({ ...item, tempId: Math.random() });
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop();
        if (!item) return;
        newList.unshift({ ...item, tempId: Math.random() });
      }
    }
    setTestimonialsList(newList);
  };

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 365 : 280); // Slightly smaller on mobile to fit screen
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden bg-surface-container-low/30 rounded-3xl"
      style={{ height: 600 }}
    >
      {testimonialsList.map((testimonial, index) => {
        const position = testimonialsList.length % 2
          ? index - (testimonialsList.length + 1) / 2
          : index - testimonialsList.length / 2;
        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
          />
        );
      })}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-20">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center text-2xl transition-colors",
            "bg-surface border-2 border-outline-variant text-primary hover:bg-primary hover:text-on-primary hover:border-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center text-2xl transition-colors",
            "bg-surface border-2 border-outline-variant text-primary hover:bg-primary hover:text-on-primary hover:border-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};
