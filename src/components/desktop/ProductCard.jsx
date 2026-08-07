"use client";

import { Star, Heart, Plus, Check, BadgeCheck, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCountry } from "../../context/CountryContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { formatDiscountLabel } from "../../utils/formatters";

export function ProductCard({ product }) {
  const router = useRouter()
  const Icon = product.icon
  const { price } = useCountry();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Map API properties or static mockup properties
  const name = product.product_name || product.name || "";
  const mrpVal = parseFloat(product.orginal_rate || product.mrp || 0);
  const priceVal = parseFloat(product.offer_price || product.price || 0);
  const ratingVal = parseFloat(product.rating || product.average_rating || 0);
  const reviewsCount = product.reviews || product.review_count || 0;
  const sellerName = product.brand || product.seller || "Jeni Deals";
  const imgUrl = product.product_img_url || product.product_img;

  const off = mrpVal > priceVal ? Math.round(((mrpVal - priceVal) / mrpVal) * 100) : 0;
  const isLiked = isInWishlist(product.id);

  // Custom discount text
  let discountBadgeText = "";
  if (product.discount_type === "percentage" && product.discount_value) {
    discountBadgeText = formatDiscountLabel(`${Math.round(parseFloat(product.discount_value))}%`);
  } else if (product.discount_type === "flat" && product.discount_value) {
    discountBadgeText = formatDiscountLabel(price(product.discount_value));
  } else if (product.discount_percentage) {
    discountBadgeText = formatDiscountLabel(`${product.discount_percentage}%`);
  } else if (product.discount_text) {
    discountBadgeText = formatDiscountLabel(product.discount_text);
  } else if (off > 0) {
    discountBadgeText = formatDiscountLabel(`${off}%`);
  }

  return (
    <div
      onClick={() => router.push(`/product/${product.id}`)}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-white transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
    >
      {/* Image area */}
      <div className="relative aspect-square overflow-hidden bg-[#FAFAFA]">
        <div className="absolute inset-0 grid place-items-center p-2">
          {imgUrl ? (
            <Image 
              src={imgUrl} 
              alt={name} 
              fill
              className="object-contain transition-transform group-hover:scale-110 p-2" 
            />
          ) : Icon ? (
            <Icon className="h-16 w-16 transition-transform group-hover:scale-110" strokeWidth={1.25} style={{ color: product.accent }} />
          ) : (
            <Package className="h-12 w-12 text-fg-subtle" strokeWidth={1.25} />
          )}
        </div>
        {discountBadgeText && (
          <span className="absolute left-2 top-2 rounded bg-sale px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
            {discountBadgeText}
          </span>
        )}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute bottom-2 right-2 grid h-7 w-7 place-items-center rounded-full bg-white shadow-md transition-all hover:scale-110"
        >
          <Heart
            className={`h-3.5 w-3.5 ${isLiked ? 'fill-sale text-sale' : 'text-fg-muted'}`}
            strokeWidth={1.75}
          />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-2.5">
        {/* Seller Badge */}
        <div className="flex items-center gap-1 mb-0.5">
          <BadgeCheck className="h-2.5 w-2.5 text-success" strokeWidth={2} />
          <span className="text-[10px] font-medium text-success truncate">{sellerName}</span>
        </div>

        {/* Product Name */}
        <h3 className="line-clamp-2 min-h-[30px] text-xs font-semibold leading-tight text-navy mb-1">
          {name}
        </h3>

        {/* Rating */}
        {ratingVal > 0 && (
          <div className="flex items-center gap-1 mb-1.5">
            <div className="inline-flex items-center gap-0.5 rounded bg-success-tint px-1 py-0.5">
              <Star className="h-2 w-2 fill-success text-success" strokeWidth={0} />
              <span className="text-[10px] font-bold text-success">{ratingVal.toFixed(1)}</span>
            </div>
            <span className="text-[10px] text-fg-subtle">({reviewsCount})</span>
          </div>
        )}

        {/* Price & Add Button */}
        <div className="mt-auto flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-sm font-bold text-navy">{price(priceVal)}</span>
              {mrpVal > priceVal && (
                <span className="text-[10px] text-fg-subtle line-through">{price(mrpVal)}</span>
              )}
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (product?.id && isInCart(product.id)) {
                router.push('/cart');
              } else {
                addToCart(product, 1);
              }
            }}
            title={product?.id && isInCart(product.id) ? "Added to Cart" : "Add to Cart"}
            className={`grid h-7 w-7 place-items-center rounded-full transition-all shadow-sm ${
              product?.id && isInCart(product.id)
                ? 'bg-emerald-600 text-white'
                : 'bg-navy text-white hover:bg-orange hover:scale-110'
            }`}
          >
            {product?.id && isInCart(product.id) ? (
              <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            ) : (
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
