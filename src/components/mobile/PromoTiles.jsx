'use client'

import Image from "next/image";

export function PromoTiles({ collections = {} }) {
  // Convert collections object to array
  const collectionArray = Object.values(collections || {});

  return (
    <section className="px-4 pt-4">
      {/* Section Title */}
      <h2 className="text-lg font-bold text-fg mb-3">Special Collections</h2>
      
      {/* First Collection Card */}
      <div className="relative h-44 mb-3 overflow-hidden rounded-xl bg-navy">
        <Image 
          src={collectionArray[0]?.image_url || collectionArray[0]?.image || collectionArray[0]?.collection_image || "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=400&fit=crop"} 
          alt="Special Collection" 
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/60 to-transparent" />
       
      </div>

      {/* Second Collection Card */}
      <div className="relative h-44 overflow-hidden rounded-xl bg-navy">
        <Image 
          src={collectionArray[1]?.image_url || collectionArray[1]?.image || collectionArray[1]?.collection_image || "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800&h=400&fit=crop"} 
          alt="Jeni's Fragrance" 
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/50 to-transparent" />
      </div>
    </section>
  );
}
