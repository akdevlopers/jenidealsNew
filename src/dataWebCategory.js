import {
  Smartphone, Shirt, Home, Sparkles, Dumbbell, Baby, Gamepad2, BookOpen,
  Watch, Headphones, Laptop, Camera, Sofa, Utensils, Flower2, PawPrint,
} from "lucide-react";

export const categories = [
  {
    id: "electronics",
    label: "Electronics",
    icon: Smartphone,
    featured: { name: "Aurora Audio", deal: "Up to 40% off headphones" },
    columns: [
      { title: "Mobiles & Tablets", links: ["Smartphones", "Tablets", "Cases & Covers", "Power Banks", "Chargers"] },
      { title: "Computing", links: ["Laptops", "Monitors", "Keyboards", "Storage", "Accessories"] },
      { title: "Audio", links: ["Headphones", "Earbuds", "Speakers", "Soundbars", "Microphones"] },
      { title: "Cameras", links: ["Mirrorless", "Action Cams", "Lenses", "Drones", "Tripods"] },
    ],
  },
  {
    id: "fashion",
    label: "Fashion",
    icon: Shirt,
    featured: { name: "Loom & Thread", deal: "New season drops live" },
    columns: [
      { title: "Women", links: ["Dresses", "Tops", "Footwear", "Handbags", "Jewellery"] },
      { title: "Men", links: ["Shirts", "T-Shirts", "Sneakers", "Watches", "Grooming"] },
      { title: "Kids", links: ["Boys", "Girls", "Infants", "School", "Toys"] },
      { title: "Accessories", links: ["Sunglasses", "Belts", "Wallets", "Caps", "Scarves"] },
    ],
  },
  {
    id: "home",
    label: "Home & Living",
    icon: Home,
    featured: { name: "Casa Nordic", deal: "Furniture from 30% off" },
    columns: [
      { title: "Furniture", links: ["Sofas", "Beds", "Tables", "Chairs", "Storage"] },
      { title: "Kitchen", links: ["Cookware", "Dinnerware", "Appliances", "Storage", "Bakeware"] },
      { title: "Decor", links: ["Wall Art", "Lighting", "Rugs", "Cushions", "Plants"] },
      { title: "Bath", links: ["Towels", "Organizers", "Accessories", "Mats", "Mirrors"] },
    ],
  },
  {
    id: "beauty",
    label: "Beauty",
    icon: Sparkles,
    featured: { name: "Glow Theory", deal: "Buy 2 get 1 on skincare" },
    columns: [
      { title: "Skincare", links: ["Cleansers", "Serums", "Moisturizers", "Sunscreen", "Masks"] },
      { title: "Makeup", links: ["Foundation", "Lipstick", "Eyes", "Brushes", "Palettes"] },
      { title: "Fragrance", links: ["Women", "Men", "Unisex", "Gift Sets", "Body Mists"] },
      { title: "Hair", links: ["Shampoo", "Styling", "Color", "Tools", "Treatments"] },
    ],
  },
  {
    id: "sports",
    label: "Sports",
    icon: Dumbbell,
    featured: { name: "Peak Motion", deal: "Fitness gear up to 50% off" },
    columns: [
      { title: "Fitness", links: ["Dumbbells", "Yoga", "Resistance Bands", "Benches", "Mats"] },
      { title: "Outdoor", links: ["Cycling", "Camping", "Running", "Hiking", "Water Sports"] },
      { title: "Team Sports", links: ["Football", "Cricket", "Basketball", "Tennis", "Badminton"] },
      { title: "Apparel", links: ["Activewear", "Shoes", "Jackets", "Socks", "Gloves"] },
    ],
  },
  { id: "kids", label: "Toys & Baby", icon: Baby, featured: { name: "Tiny Steps", deal: "Baby care essentials" },
    columns: [
      { title: "Toys", links: ["Building Sets", "Dolls", "Educational", "Outdoor", "Board Games"] },
      { title: "Baby Care", links: ["Diapers", "Feeding", "Bath", "Skincare", "Health"] },
      { title: "Gear", links: ["Strollers", "Car Seats", "Carriers", "Cribs", "Monitors"] },
      { title: "Clothing", links: ["Newborn", "Infant", "Toddler", "Shoes", "Accessories"] },
    ],
  },
  { id: "gaming", label: "Gaming", icon: Gamepad2, featured: { name: "Nexus Play", deal: "Consoles + bundles" },
    columns: [
      { title: "Consoles", links: ["PlayStation", "Xbox", "Nintendo", "Handhelds", "Bundles"] },
      { title: "PC Gaming", links: ["Graphics Cards", "Chairs", "Keyboards", "Mice", "Headsets"] },
      { title: "Games", links: ["Action", "RPG", "Sports", "Racing", "Pre-orders"] },
      { title: "Accessories", links: ["Controllers", "Storage", "Streaming", "Cables", "Stands"] },
    ],
  },
  { id: "books", label: "Books", icon: BookOpen, featured: { name: "Margin Notes", deal: "Bestsellers 2-for-1" },
    columns: [
      { title: "Fiction", links: ["Literary", "Mystery", "Sci-Fi", "Romance", "Fantasy"] },
      { title: "Non-Fiction", links: ["Business", "Self-Help", "History", "Science", "Biography"] },
      { title: "Kids", links: ["Picture Books", "Early Readers", "Young Adult", "Activity", "Comics"] },
      { title: "More", links: ["Audiobooks", "E-Books", "Regional", "Academic", "Stationery"] },
    ],
  },
];

export const trending = [
  { id: "p1", name: "Halo Pro Wireless Headphones", seller: "Aurora Audio", price: 129, mrp: 199, rating: 4.8, reviews: 2143, icon: Headphones, tint: "#EEF2FF", accent: "#6366F1", badge: "Bestseller" },
  { id: "p2", name: "Meridian Automatic Watch", seller: "Chrono Co.", price: 249, mrp: 340, rating: 4.7, reviews: 892, icon: Watch, tint: "#FEF3F2", accent: "#F97316" },
  { id: "p3", name: "Featherlight 14\" Laptop", seller: "Nova Systems", price: 899, mrp: 1099, rating: 4.9, reviews: 1567, icon: Laptop, tint: "#ECFEFF", accent: "#0891B2", badge: "New" },
  { id: "p4", name: "Prism Mirrorless Camera", seller: "LensCraft", price: 649, mrp: 799, rating: 4.6, reviews: 634, icon: Camera, tint: "#F0FDF4", accent: "#16A34A" },
  { id: "p5", name: "Cloud Linen Sofa 3-Seater", seller: "Casa Nordic", price: 799, mrp: 1150, rating: 4.5, reviews: 421, icon: Sofa, tint: "#FDF4FF", accent: "#A855F7" },
  { id: "p6", name: "Terra Ceramic Dinner Set", seller: "Casa Nordic", price: 89, mrp: 129, rating: 4.7, reviews: 1102, icon: Utensils, tint: "#FFF7ED", accent: "#EA580C", badge: "Deal" },
  { id: "p7", name: "Botanica Diffuser + Oils", seller: "Glow Theory", price: 54, mrp: 79, rating: 4.8, reviews: 3210, icon: Flower2, tint: "#F0FDFA", accent: "#0D9488" },
  { id: "p8", name: "Companion Pet Bed Large", seller: "PawPals", price: 69, mrp: 99, rating: 4.9, reviews: 987, icon: PawPrint, tint: "#FEFCE8", accent: "#CA8A04" },
];

export const flashDeals = [
  { id: "f1", name: "Vortex Gaming Earbuds", seller: "Nexus Play", price: 39, mrp: 89, rating: 4.6, reviews: 1820, icon: Headphones, tint: "#EEF2FF", accent: "#6366F1" },
  { id: "f2", name: "Solo Action Camera 5K", seller: "LensCraft", price: 149, mrp: 279, rating: 4.5, reviews: 540, icon: Camera, tint: "#F0FDF4", accent: "#16A34A" },
  { id: "f3", name: "Pulse Fitness Smartwatch", seller: "Peak Motion", price: 79, mrp: 159, rating: 4.7, reviews: 2670, icon: Watch, tint: "#FEF3F2", accent: "#F97316" },
  { id: "f4", name: "Studio Tablet 11\"", seller: "Nova Systems", price: 219, mrp: 399, rating: 4.8, reviews: 1340, icon: Smartphone, tint: "#ECFEFF", accent: "#0891B2" },
  { id: "f5", name: "Aero Bluetooth Speaker", seller: "Aurora Audio", price: 45, mrp: 99, rating: 4.6, reviews: 3105, icon: Headphones, tint: "#FDF4FF", accent: "#A855F7" },
];

export const categoryTiles = [
  { label: "Electronics", icon: Smartphone, tint: "#EEF2FF", accent: "#6366F1", count: "12.4k" },
  { label: "Fashion", icon: Shirt, tint: "#FEF3F2", accent: "#F97316", count: "28.1k" },
  { label: "Home & Living", icon: Sofa, tint: "#F0FDF4", accent: "#16A34A", count: "9.7k" },
  { label: "Beauty", icon: Sparkles, tint: "#FDF4FF", accent: "#A855F7", count: "6.2k" },
  { label: "Sports", icon: Dumbbell, tint: "#ECFEFF", accent: "#0891B2", count: "4.8k" },
  { label: "Gaming", icon: Gamepad2, tint: "#FEF2F2", accent: "#DC2626", count: "3.1k" },
  { label: "Books", icon: BookOpen, tint: "#FFF7ED", accent: "#EA580C", count: "15.6k" },
  { label: "Toys & Baby", icon: Baby, tint: "#FEFCE8", accent: "#CA8A04", count: "5.4k" },
];

export const brands = [
  "Aurora Audio", "Nova Systems", "Casa Nordic", "Glow Theory",
  "Peak Motion", "LensCraft", "Chrono Co.", "Loom & Thread",
  "Nexus Play", "PawPals", "Tiny Steps", "Margin Notes",
];
