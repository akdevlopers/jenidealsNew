'use client'

import { useState, useEffect } from 'react'
import { getHomepageData } from '../src/services/homeService'
import { useCountry } from '../src/context/CountryContext'
import HomePageClient from './HomePageClient'

export default function HomeClient() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { country, isLoading: isCountryLoading } = useCountry();

  useEffect(() => {
    // Wait for country context to load and country to be set
    if (isCountryLoading || !country) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getHomepageData(country.id);

        // Process banners
        const mobileBanners = (data?.banners || []).filter(b => 
          b.banner_type === 'app' || b.banner_type === 'mobile'
        );
        const webBanners = data?.banners_web?.length > 0
          ? data.banners_web
          : (data?.banners || []).filter(b => 
              b.banner_type === 'web' || b.banner_type === 'desktop'
            );

        const processedData = {
          ...data,
          mobileBanners: mobileBanners.length > 0 ? mobileBanners : data.banners,
          webBanners: webBanners.length > 0 ? webBanners : data.banners,
        };

        setHomeData(processedData);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [country?.id, isCountryLoading]); // Re-fetch when country changes

  return <HomePageClient homeData={homeData} loading={loading || isCountryLoading} />
}
