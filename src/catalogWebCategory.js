import {
  Smartphone, Shirt, Home, Sparkles, Dumbbell, Gamepad2, BookOpen,
  Watch, Headphones, Laptop, Camera, Sofa, Utensils, Flower2, PawPrint,
  Baby, Tv, Keyboard, Mouse, Speaker, Backpack, Footprints, Glasses,
} from "lucide-react";

export const colorSwatches = [
  { name: "Black", hex: "#1E293B" },
  { name: "White", hex: "#F1F5F9" },
  { name: "Blue", hex: "#3B82F6" },
  { name: "Red", hex: "#EF4444" },
  { name: "Green", hex: "#22C55E" },
  { name: "Orange", hex: "#F97316" },
  { name: "Purple", hex: "#A855F7" },
  { name: "Beige", hex: "#D6C3A5" },
  { name: "Gray", hex: "#94A3B8" },
  { name: "Pink", hex: "#EC4899" },
];

function disc(mrp, price) {
  return Math.round(((mrp - price) / mrp) * 100);
}

export const catalog = [
  { id: "c1", name: "Halo Pro Wireless Headphones", seller: "Aurora Audio", category: "electronics", price: 129, mrp: 199, rating: 4.8, reviews: 2143, icon: Headphones, tint: "#EEF2FF", accent: "#6366F1", color: "Black", badge: "Bestseller", inStock: true, freeShipping: true, express: true, isNew: false, soldRecently: 320 },
  { id: "c2", name: "Meridian Automatic Watch", seller: "Chrono Co.", category: "fashion", price: 249, mrp: 340, rating: 4.7, reviews: 892, icon: Watch, tint: "#FEF3F2", accent: "#F97316", color: "Beige", inStock: true, freeShipping: true, express: false, isNew: false, soldRecently: 88 },
  { id: "c3", name: "Featherlight 14\" Laptop", seller: "Nova Systems", category: "electronics", price: 899, mrp: 1099, rating: 4.9, reviews: 1567, icon: Laptop, tint: "#ECFEFF", accent: "#0891B2", color: "Gray", badge: "New", inStock: true, freeShipping: true, express: true, isNew: true, soldRecently: 145 },
  { id: "c4", name: "Prism Mirrorless Camera", seller: "LensCraft", category: "electronics", price: 649, mrp: 799, rating: 4.6, reviews: 634, icon: Camera, tint: "#F0FDF4", accent: "#16A34A", color: "Black", inStock: true, freeShipping: false, express: false, isNew: false, soldRecently: 52 },
  { id: "c5", name: "Cloud Linen Sofa 3-Seater", seller: "Casa Nordic", category: "home", price: 799, mrp: 1150, rating: 4.5, reviews: 421, icon: Sofa, tint: "#FDF4FF", accent: "#A855F7", color: "Beige", inStock: true, freeShipping: true, express: false, isNew: false, soldRecently: 34 },
  { id: "c6", name: "Terra Ceramic Dinner Set", seller: "Casa Nordic", category: "home", price: 89, mrp: 129, rating: 4.7, reviews: 1102, icon: Utensils, tint: "#FFF7ED", accent: "#EA580C", color: "White", badge: "Deal", inStock: true, freeShipping: true, express: true, isNew: false, soldRecently: 210 },
  { id: "c7", name: "Botanica Diffuser + Oils", seller: "Glow Theory", category: "beauty", price: 54, mrp: 79, rating: 4.8, reviews: 3210, icon: Flower2, tint: "#F0FDFA", accent: "#0D9488", color: "White", inStock: true, freeShipping: false, express: false, isNew: false, soldRecently: 405 },
  { id: "c8", name: "Companion Pet Bed Large", seller: "PawPals", category: "home", price: 69, mrp: 99, rating: 4.9, reviews: 987, icon: PawPrint, tint: "#FEFCE8", accent: "#CA8A04", color: "Gray", inStock: false, freeShipping: true, express: false, isNew: false, soldRecently: 66 },
  { id: "c9", name: "Vortex Gaming Earbuds", seller: "Nexus Play", category: "gaming", price: 39, mrp: 89, rating: 4.6, reviews: 1820, icon: Headphones, tint: "#EEF2FF", accent: "#6366F1", color: "Black", badge: "Deal", inStock: true, freeShipping: true, express: true, isNew: false, soldRecently: 512 },
  { id: "c10", name: "Solo Action Camera 5K", seller: "LensCraft", category: "electronics", price: 149, mrp: 279, rating: 4.5, reviews: 540, icon: Camera, tint: "#F0FDF4", accent: "#16A34A", color: "Black", inStock: true, freeShipping: false, express: true, isNew: true, soldRecently: 91 },
  { id: "c11", name: "Pulse Fitness Smartwatch", seller: "Peak Motion", category: "sports", price: 79, mrp: 159, rating: 4.7, reviews: 2670, icon: Watch, tint: "#FEF3F2", accent: "#F97316", color: "Blue", badge: "Deal", inStock: true, freeShipping: true, express: true, isNew: false, soldRecently: 380 },
  { id: "c12", name: "Studio Tablet 11\"", seller: "Nova Systems", category: "electronics", price: 219, mrp: 399, rating: 4.8, reviews: 1340, icon: Smartphone, tint: "#ECFEFF", accent: "#0891B2", color: "Gray", inStock: true, freeShipping: true, express: false, isNew: false, soldRecently: 174 },
  { id: "c13", name: "Aero Bluetooth Speaker", seller: "Aurora Audio", category: "electronics", price: 45, mrp: 99, rating: 4.6, reviews: 3105, icon: Speaker, tint: "#FDF4FF", accent: "#A855F7", color: "Purple", inStock: true, freeShipping: true, express: true, isNew: false, soldRecently: 298 },
  { id: "c14", name: "Everyday Canvas Backpack", seller: "Loom & Thread", category: "fashion", price: 59, mrp: 89, rating: 4.5, reviews: 760, icon: Backpack, tint: "#F0FDF4", accent: "#16A34A", color: "Green", inStock: true, freeShipping: false, express: false, isNew: true, soldRecently: 120 },
  { id: "c15", name: "Trailblaze Running Shoes", seller: "Peak Motion", category: "sports", price: 89, mrp: 140, rating: 4.7, reviews: 1990, icon: Footprints, tint: "#EEF2FF", accent: "#6366F1", color: "Red", badge: "Bestseller", inStock: true, freeShipping: true, express: true, isNew: false, soldRecently: 264 },
  { id: "c16", name: "Nova Mechanical Keyboard", seller: "Nova Systems", category: "gaming", price: 119, mrp: 169, rating: 4.8, reviews: 1450, icon: Keyboard, tint: "#ECFEFF", accent: "#0891B2", color: "Black", inStock: true, freeShipping: true, express: false, isNew: false, soldRecently: 156 },
  { id: "c17", name: "Glide Precision Mouse", seller: "Nova Systems", category: "gaming", price: 49, mrp: 79, rating: 4.6, reviews: 2210, icon: Mouse, tint: "#FDF4FF", accent: "#A855F7", color: "White", inStock: true, freeShipping: false, express: true, isNew: false, soldRecently: 188 },
  { id: "c18", name: "Cinema 55\" 4K Smart TV", seller: "Nova Systems", category: "electronics", price: 549, mrp: 899, rating: 4.7, reviews: 980, icon: Tv, tint: "#EEF2FF", accent: "#6366F1", color: "Black", badge: "Deal", inStock: true, freeShipping: true, express: false, isNew: false, soldRecently: 77 },
  { id: "c19", name: "Aurora Silk Midi Dress", seller: "Loom & Thread", category: "fashion", price: 79, mrp: 119, rating: 4.6, reviews: 640, icon: Shirt, tint: "#FDF4FF", accent: "#EC4899", color: "Pink", inStock: true, freeShipping: true, express: true, isNew: true, soldRecently: 143 },
  { id: "c20", name: "Radiance Vitamin C Serum", seller: "Glow Theory", category: "beauty", price: 34, mrp: 59, rating: 4.9, reviews: 4120, icon: Sparkles, tint: "#FDF4FF", accent: "#A855F7", color: "Orange", badge: "Bestseller", inStock: true, freeShipping: false, express: false, isNew: false, soldRecently: 620 },
  { id: "c21", name: "Nordic Oak Coffee Table", seller: "Casa Nordic", category: "home", price: 199, mrp: 299, rating: 4.5, reviews: 312, icon: Sofa, tint: "#FFF7ED", accent: "#EA580C", color: "Beige", inStock: false, freeShipping: true, express: false, isNew: false, soldRecently: 28 },
  { id: "c22", name: "FlexCore Yoga Mat Pro", seller: "Peak Motion", category: "sports", price: 29, mrp: 49, rating: 4.7, reviews: 1780, icon: Dumbbell, tint: "#F0FDFA", accent: "#0D9488", color: "Purple", inStock: true, freeShipping: false, express: true, isNew: false, soldRecently: 234 },
  { id: "c23", name: "Little Explorer Play Set", seller: "Tiny Steps", category: "kids", price: 44, mrp: 69, rating: 4.8, reviews: 890, icon: Baby, tint: "#FEFCE8", accent: "#CA8A04", color: "Blue", inStock: true, freeShipping: true, express: true, isNew: true, soldRecently: 112 },
  { id: "c24", name: "Margin Notes Bestseller Box", seller: "Margin Notes", category: "books", price: 39, mrp: 69, rating: 4.9, reviews: 1560, icon: BookOpen, tint: "#FFF7ED", accent: "#EA580C", color: "Red", badge: "Deal", inStock: true, freeShipping: true, express: false, isNew: false, soldRecently: 301 },
  { id: "c25", name: "Aviator Polarized Sunglasses", seller: "Loom & Thread", category: "fashion", price: 49, mrp: 99, rating: 4.5, reviews: 1120, icon: Glasses, tint: "#EEF2FF", accent: "#6366F1", color: "Black", badge: "Deal", inStock: true, freeShipping: false, express: true, isNew: false, soldRecently: 205 },
  { id: "c26", name: "Hydra Glow Face Mask x10", seller: "Glow Theory", category: "beauty", price: 24, mrp: 45, rating: 4.6, reviews: 2340, icon: Flower2, tint: "#F0FDFA", accent: "#0D9488", color: "Green", inStock: true, freeShipping: true, express: true, isNew: false, soldRecently: 456 },
  { id: "c27", name: "Summit Trail Hiking Pack", seller: "Peak Motion", category: "sports", price: 109, mrp: 159, rating: 4.7, reviews: 540, icon: Backpack, tint: "#ECFEFF", accent: "#0891B2", color: "Green", inStock: true, freeShipping: true, express: false, isNew: true, soldRecently: 64 },
  { id: "c28", name: "Nexus Pro Controller", seller: "Nexus Play", category: "gaming", price: 59, mrp: 79, rating: 4.8, reviews: 3020, icon: Gamepad2, tint: "#FEF2F2", accent: "#DC2626", color: "White", badge: "Bestseller", inStock: true, freeShipping: true, express: true, isNew: false, soldRecently: 388 },
];

export const catalogBrands = Array.from(new Set(catalog.map((p) => p.seller))).sort();

export const discountThresholds = [10, 25, 50, 70];

export function discountOf(p) {
  return disc(p.mrp, p.price);
}

export const priceBounds = { min: 0, max: 30000 };

export const priceBrackets = [
  { id: "0-500", min: 0, max: 500 },
  { id: "500-1000", min: 500, max: 1000 },
  { id: "1000-5000", min: 1000, max: 5000 },
  { id: "5000-10000", min: 5000, max: 10000 },
  { id: "10000-30000", min: 10000, max: 30000 },
  { id: "30000+", min: 30000, max: Infinity },
];
