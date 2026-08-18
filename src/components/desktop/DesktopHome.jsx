"use client";

import {
  Header,
  CategoryBrowse,
  Hero,
  FlashDeals,
  TrendingProducts,
  BrandStrip,
  TrustStrip,
  SellerCTA,
  Footer,
} from './index';
import { JeniTravelDeals } from '../JeniTravelDeals';
import { FeaturedCategoryBanners } from '../FeaturedCategoryBanners';

export function DesktopHome({ data, loading }) {
  // If we have data and it's loading in background, show a small indicator
  if (data && loading) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        {/* Small loading indicator bar */}
        <div className="sticky top-[120px] z-40 bg-orange-tint border-b border-orange/20 px-6 py-2">
          <div className="mx-auto flex max-w-shell items-center justify-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange border-t-transparent" />
            <span className="text-xs font-medium text-orange-deep">Refreshing content...</span>
          </div>
        </div>
        <main>
        <CategoryBrowse categories={data?.categories} />
        <Hero banners={data?.webBanners} />
        <FeaturedCategoryBanners categories={data?.categories} />
        <FlashDeals 
          products={data?.flash_deals} 
          remainingSeconds={data?.flashsale_info?.remaining_seconds} 
        />
        <TrendingProducts allData={data} />
        <JeniTravelDeals />
        <BrandStrip brands={data?.brand} />
        <TrustStrip />
        <SellerCTA />
      </main>
        <Footer />
      </div>
    );
  }

  // Show full loading only on first load
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="text-center">
          <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-orange border-t-transparent mx-auto" />
          <p className="text-sm text-fg-muted font-medium">Loading Jeni Deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header />
      <main>
        <CategoryBrowse categories={data?.categories} />
        <Hero banners={data?.webBanners} />
        <FlashDeals 
          products={data?.flash_deals} 
          remainingSeconds={data?.flashsale_info?.remaining_seconds} 
        />
        <FeaturedCategoryBanners categories={data?.categories} />
        <TrendingProducts allData={data} />
        <JeniTravelDeals />
        <BrandStrip brands={data?.brand} />
        <TrustStrip />
        <SellerCTA />
      </main>
      <Footer />
    </div>
  );
}
