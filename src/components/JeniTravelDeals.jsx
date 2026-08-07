"use client";

import { useState, useEffect } from "react";
import { PlaneTakeoff, ArrowRight } from "lucide-react";

const dubaiPlaces = [
  {
    name: "Burj Khalifa",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Palm Jumeirah",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2073&auto=format&fit=crop"
  },
  {
    name: "Dubai Marina",
    image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Burj Al Arab",
    image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Desert Safari",
    image: "https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?q=80&w=2070&auto=format&fit=crop"
  }
];

export function JeniTravelDeals() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % dubaiPlaces.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mx-auto max-w-shell px-4 md:px-6 pt-6">
      <a 
        href={process.env.NEXT_PUBLIC_HOLIDAYS_URL || "https://jenideals.com/jeniNewVersion/holidays"} 
        target="_blank" 
        rel="noopener noreferrer"
        className="group block relative overflow-hidden rounded-2xl cursor-pointer"
      >
        {/* Background Slideshow */}
        <div className="absolute inset-0">
          {dubaiPlaces.map((place, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img 
                src={place.image} 
                alt={place.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative flex flex-col justify-between h-full px-6 md:px-10 py-6 md:py-6" style={{ minHeight: '220px', maxHeight: '280px' }}>
          {/* Top: Label + Title */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-bold mb-2">
              <PlaneTakeoff className="h-3.5 w-3.5" />
              Travel Deals
            </div>
            <h2 className="text-xl md:text-3xl font-bold mb-1">
              Dubai Holiday Packages
            </h2>
            <p className="text-lg font-semibold text-orange-400">
              {dubaiPlaces[currentSlide].name}
            </p>
          </div>
          
          {/* Bottom: CTA */}
          <div className="flex items-center justify-between pb-1">
             {/* CTA Button */}
            <div className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-lg group-hover:bg-orange-600 transition-colors whitespace-nowrap">
              Explore Now
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </a>
    </section>
  );
}
