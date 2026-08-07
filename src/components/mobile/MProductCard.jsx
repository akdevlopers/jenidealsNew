'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, Heart, Package } from "lucide-react";
import { useCountry } from "../../context/CountryContext";
import { useWishlist } from "../../context/WishlistContext";

export function MProductCard({ product, width }) {
  const [imgOk, setImgOk] = useState(true)
  const { price: formatPrice } = useCountry()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const router = useRouter();

  // Calculate discount percentage
  const originalPrice = parseFloat(product.orginal_rate || product.mrp || 0);
  const offerPrice = parseFloat(product.offer_price || product.price || 0);
  const off = originalPrice > offerPrice ? Math.round(((originalPrice - offerPrice) / originalPrice) * 100) : 0;

  // Rating & Reviews
  const rating = parseFloat(product.rating || product.average_rating || 0);
  const reviews = product.reviews || 0;
  const isLiked = isInWishlist(product.id);

  // Category Badge (Bestseller, Deal, Featured, etc.)
  let badgeText = "";
  let badgeBgClass = "bg-[#0F172A]"; // Default Bestseller slate

  if (product.badge_text) {
    badgeText = product.badge_text;
    badgeBgClass = product.badge_bg || "bg-[#0F172A]";
  } else if (product.is_bestseller || product.isBestseller || product.best_seller || (product.id % 2 === 0)) {
    badgeText = "Bestseller";
    badgeBgClass = "bg-[#0F172A]"; // Dark navy/slate pill
  } else if (product.is_deal || product.deal || off > 0) {
    badgeText = "Deal";
    badgeBgClass = "bg-[#EF4444]"; // Red deal pill
  } else if (product.is_featured || product.featured) {
    badgeText = "Featured";
    badgeBgClass = "bg-navy";
  }

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`flex flex-col overflow-hidden rounded-2xl border border-line/60 bg-white p-3 shadow-xs active:scale-[0.98] transition-transform cursor-pointer relative ${width ?? ""}`}
    >
      {/* Top Image Box */}
      <div className="relative aspect-square w-full flex items-center justify-center mb-1">
        {/* Top-Left Category Badge */}
        {badgeText && (
          <span className={`absolute left-2 top-2 z-10 rounded-full ${badgeBgClass} px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-xs`}>
            {badgeText}
          </span>
        )}

        {/* Top-Right Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-white shadow-md active:scale-110 transition-transform"
        >
          <Heart
            className={`h-4 w-4 ${isLiked ? 'fill-sale text-sale' : 'text-gray-400'}`}
            strokeWidth={1.75}
          />
        </button>

        {/* Product Image or Fallback Icon */}
        {imgOk && product.product_img_url ? (
          <Image
            src={product.product_img_url}
            alt={product.product_name || ''}
            fill
            loading="lazy"
            onError={() => setImgOk(false)}
            className="object-contain p-2 relative z-0"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center p-3">
            <Package className="h-12 w-12 text-gray-300" strokeWidth={1.25} />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="line-clamp-2 min-h-[34px] text-xs sm:text-[13px] font-bold leading-snug text-[#0F172A] mb-1">
            {product.product_name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 text-[11px] font-semibold text-gray-500">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" strokeWidth={0} />
            <span className="text-[#0F172A] font-bold">{rating.toFixed(2)}</span>
            <span className="text-gray-400 font-normal">({reviews})</span>
          </div>
        </div>

        {/* Price & Discount */}
        <div className="mt-2.5">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-extrabold text-[#0F172A]">
              {formatPrice(offerPrice)}
            </span>
            {originalPrice > offerPrice && (
              <span className="text-[11px] text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Discount Tag */}
          {off > 0 && (
            <div className="mt-1">
              <span className="inline-block bg-red-50 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded">
                -{off}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
