import axiosInstance from '../lib/axios';

/**
 * Fetch homepage data based on country
 * @param {string} countryId - Country ID ('1' for UAE, '2' for India)
 * @returns {Promise} Homepage data
 */
// Check if on server
const isServer = typeof window === 'undefined';

// In-memory cache for API responses (10 minutes duration)
const apiCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000;

export const clearApiCache = () => {
  apiCache.clear();
};

/**
 * Helper function to get cached data or fetch new with deduplication
 */
const getCachedOrFetch = async (cacheKey, fetchFn) => {
  const now = Date.now();
  const cached = apiCache.get(cacheKey);

  if (cached && cached.data !== undefined && (now - cached.timestamp < CACHE_DURATION)) {
    return cached.data;
  }

  if (cached && cached.promise) {
    return cached.promise;
  }

  const promise = (async () => {
    try {
      const data = await fetchFn();
      apiCache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (err) {
      apiCache.delete(cacheKey);
      throw err;
    }
  })();

  apiCache.set(cacheKey, { promise, timestamp: now });
  return promise;
};

export const sortCategoriesByOrderBy = (list) => {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => {
    const rawA = a.order_by ?? a.sort_order ?? a.position ?? a.orderBy;
    const rawB = b.order_by ?? b.sort_order ?? b.position ?? b.orderBy;

    const numA = (rawA !== undefined && rawA !== null && rawA !== '' && !isNaN(Number(rawA))) ? Number(rawA) : null;
    const numB = (rawB !== undefined && rawB !== null && rawB !== '' && !isNaN(Number(rawB))) ? Number(rawB) : null;

    if (numA !== null && numB !== null) {
      return numA - numB;
    }
    if (numA !== null) return -1;
    if (numB !== null) return 1;
    return 0;
  });
};

export const getHomepageData = async (countryId = '1') => {
  try {
    // Single endpoint for all countries (pass country as query param + body)
    const endpoint = `/homepage-uae?country=${countryId}`;

    const response = await axiosInstance.post(endpoint, {
      country: countryId
    });

    if (response.status || response.statusText) {
      // Get data from response
      let data = response.Data || response.data?.Data || response.data?.data || response.data;

      if (data.collections && typeof data.collections === 'object') {
        // Convert collections object {collection1: {...}, collection2: {...} to array
        data.collections = Object.values(data.collections);
      }

      // Helper to extract nested arrays - MORE ROBUST
      const extractList = (input) => {
        if (!input) return [];
        if (Array.isArray(input)) return input;
        if (input.data && Array.isArray(input.data)) return input.data;
        if (input.products && Array.isArray(input.products)) return extractList(input.products);
        // Try to extract from .Data as well
        if (input.Data && Array.isArray(input.Data)) return input.Data;
        if (input.Data?.products && Array.isArray(input.Data.products)) return extractList(input.Data.products);
        return [];
      };

      // Helper to add attribute_id to each product in a list
      const addAttributeIdToProducts = (productList) => {
        if (!Array.isArray(productList)) return productList;
        return productList.map(product => {
          const attributes = product.productAttributeDetails || (product.raw && product.raw.productAttributeDetails) || [];
          const firstAttr = attributes[0] || {};
          return {
            ...product,
            attribute_id: firstAttr.id || product.attribute_id || product.attributeId || product.id,
            raw: product.raw || product
          };
        });
      };

      // Parse flashsale_products object (strictly flashsale_products only, no fallback)
      let flashSaleObj = data.flashsale_products || null;
      let flashSaleProducts = [];
      let remainingSeconds = null;
      let flashSaleTitle = "";

      if (flashSaleObj && typeof flashSaleObj === 'object') {
        if (Array.isArray(flashSaleObj)) {
          flashSaleProducts = flashSaleObj;
        } else {
          flashSaleProducts = flashSaleObj.products || [];
          remainingSeconds = flashSaleObj.remaining_seconds || null;
          flashSaleTitle = flashSaleObj.title || "";
        }
      }

      // Map API fields to expected UI fields
      const mappedData = {
        categories: sortCategoriesByOrderBy(extractList(data.categories || data.category)),
        banners: extractList(data.banners || data.banner),
        banners_web: extractList(data.banners_web || data.banner_web || data.bannersWeb),
        collections: extractList(data.collections || data.collection),
        featured_collections: extractList(data.featuredCollections || data.featured_collections || []),
        flash_deals: addAttributeIdToProducts(extractList(flashSaleProducts)),
        flashsale_info: {
          remaining_seconds: remainingSeconds,
          title: flashSaleTitle,
        },
        new_arrivals: addAttributeIdToProducts(extractList(data.new_arrivals || data.newArrivals || data.products)),
        best_sellers: addAttributeIdToProducts(extractList(data.best_sellers || data.bestSellers)),
        most_popular: addAttributeIdToProducts(extractList(data.most_popular || data.mostPopular)),
        top_rated: addAttributeIdToProducts(extractList(data.top_rated || data.topRated)),
        featured: addAttributeIdToProducts(extractList(data.featured)),
        brand: extractList(data.brand || data.brands),
      };

      return mappedData;
    } else {
      throw new Error(response.message || 'Failed to fetch homepage data');
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch category products
 * @param {number} categoryId - Category ID
 * @param {string} country - Country code
 * @returns {Promise} Category products
 */
export const getCategoryProducts = async (categoryId, country = 'uae') => {
  try {
    const response = await axiosInstance.get(`/category/${categoryId}`, {
      params: { country },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch category list based on country
 * @param {string} countryId - Country ID ('1' for UAE, '2' for India)
 * @returns {Promise} Category list
 */
export const getCategoryList = async (countryId = '1') => {
  return getCachedOrFetch(`category-list-${countryId}`, async () => {
    try {
      const endpoint = `/category-list?country=${countryId}`;

      const response = await axiosInstance.post(endpoint, {
        country: countryId
      });

      if (response.status || response.statusText) {
        let raw = response.Data || response.data?.Data || response.data?.data || response.data || [];
        
        let list = [];
        if (Array.isArray(raw)) {
          list = raw;
        } else if (raw && typeof raw === 'object') {
          if (Array.isArray(raw.categories)) list = raw.categories;
          else if (Array.isArray(raw.category)) list = raw.category;
          else if (Array.isArray(raw.data)) list = raw.data;
          else list = Object.values(raw);
        }

        list = list.filter(item => item && typeof item === 'object');

        // Sort by order_by
        list = sortCategoriesByOrderBy(list);

        // If category-list is empty, fallback to homepage categories
        if (list.length === 0) {
          const hpData = await getHomepageData(countryId);
          if (hpData && hpData.categories && hpData.categories.length > 0) {
            list = hpData.categories;
          }
        }

        return list;
      } else {
        throw new Error(response.message || 'Failed to fetch categories');
      }
    } catch (error) {
      // Fallback to homepage categories if category-list endpoint fails
      try {
        const hpData = await getHomepageData(countryId);
        return hpData?.categories || [];
      } catch (e) {
        return [];
      }
    }
  });
};

/**
 * Fetch subcategory list based on category and country
 * @param {string} categoryId - Category ID
 * @param {string} countryId - Country ID ('1' for UAE, '2' for India)
 * @returns {Promise} Subcategory list
 */
export const getSubcategoryList = async (categoryId, countryId = '1') => {
  const stringCategoryId = String(categoryId);
  const stringCountryId = String(countryId);
  return getCachedOrFetch(`subcategory-list-${stringCategoryId}-${stringCountryId}`, async () => {
    try {
      const endpoint = `/subcategory-list?categoryId=${stringCategoryId}&categoryid=${stringCategoryId}&country=${stringCountryId}`;

      const response = await axiosInstance.post(endpoint, {
        categoryId: stringCategoryId,
        categoryid: stringCategoryId,
        country: stringCountryId
      });

      if (response.status) {
        // Get subcategories from response
        return response.Data || response.data?.data || response.data || [];
      } else {
        throw new Error(response.message || 'Failed to fetch subcategories');
      }
    } catch (error) {
      throw error;
    }
  });
};

/**
 * Fetch brand list based on category and country
 * @param {string} categoryId - Category ID (optional - pass empty string for all brands)
 * @param {string} countryId - Country ID ('1' for India, '2' for UAE)
 * @param {string} subcategoryId - Subcategory ID (optional)
 * @param {string} childCategoryId - Child category ID (optional)
 * @returns {Promise} Brand list
 */
export const getBrandList = async (categoryId = '', countryId = '1', subcategoryId = '', childCategoryId = '') => {
  const stringCategoryId = String(categoryId || '');
  const stringCountryId = String(countryId);
  const stringSubcategoryId = String(subcategoryId || '');
  const stringChildCategoryId = String(childCategoryId || '');

  const cacheKey = `brand-list-${stringCountryId}-${stringCategoryId}-${stringSubcategoryId}-${stringChildCategoryId}`;

  return getCachedOrFetch(cacheKey, async () => {
    try {
      const queryParams = [
        `country=${stringCountryId}`
      ];

      // Only add category filters if provided
      if (stringCategoryId) {
        queryParams.push(`categoryId=${stringCategoryId}`);
        queryParams.push(`categoryid=${stringCategoryId}`);
      }
      if (stringSubcategoryId) {
        queryParams.push(`subcategoryid=${stringSubcategoryId}`);
        queryParams.push(`subcategoryId=${stringSubcategoryId}`);
        queryParams.push(`subcategory=${stringSubcategoryId}`);
      }
      if (stringChildCategoryId) {
        queryParams.push(`childcategoryid=${stringChildCategoryId}`);
        queryParams.push(`childCategoryId=${stringChildCategoryId}`);
      }

      const endpoint = `/brand-list?${queryParams.join('&')}`;

      const bodyParams = {
        country: stringCountryId
      };

      if (stringCategoryId) {
        bodyParams.categoryId = stringCategoryId;
        bodyParams.categoryid = stringCategoryId;
      }
      if (stringSubcategoryId) {
        bodyParams.subcategoryid = stringSubcategoryId;
        bodyParams.subcategoryId = stringSubcategoryId;
        bodyParams.subcategory = stringSubcategoryId;
      }
      if (stringChildCategoryId) {
        bodyParams.childcategoryid = stringChildCategoryId;
        bodyParams.childCategoryId = stringChildCategoryId;
      }

      const response = await axiosInstance.post(endpoint, bodyParams);

      if (response.status) {
        const brands = response.Data || response.data?.data || response.data || [];
        return brands;
      } else {
        throw new Error(response.message || 'Failed to fetch brands');
      }
    } catch (error) {
      throw error;
    }
  });
};

/**
 * Fetch all products with filters
 * @param {Object} params - Filter parameters
 * @returns {Promise} Products list
 */
export const getAllProducts = async (params) => {
  const cacheKey = `all-products-${JSON.stringify(params || {})}`;
  return getCachedOrFetch(cacheKey, async () => {
    try {
      // Always guarantee that subcategory and childcategoryid are present in every request
      const baseParams = {
        subcategory: '',
        childcategoryid: '',
        ...params
      };

      // If 'brand' is present, make sure we also add brandId, brandid, brand_id, vendor_id, seller_id versions to be absolutely safe
      if (baseParams.brand) {
        baseParams.brandId = baseParams.brand;
        baseParams.brandid = baseParams.brand;
        baseParams.brand_id = baseParams.brand;
        baseParams.vendor_id = baseParams.brand;
        baseParams.vendorId = baseParams.brand;
        baseParams.vendor = baseParams.brand;
        baseParams.seller_id = baseParams.brand;
        baseParams.sellerId = baseParams.brand;
        baseParams.seller = baseParams.brand;
      }

      // Sanitize parameters to ensure all keys are strings and numeric values formatted properly
      const sanitizedParams = {};
      for (const [key, value] of Object.entries(baseParams)) {
        if (value !== undefined && value !== null) {
          if (key.includes('price')) {
            sanitizedParams[key] = Number(value).toFixed(1); // e.g. "500.0"
          } else {
            sanitizedParams[key] = String(value);
          }
        }
      }

      // Build robust query string containing all param options
      const queryParts = [];
      for (const [key, value] of Object.entries(sanitizedParams)) {
        queryParts.push(`${key}=${encodeURIComponent(value)}`);
        if (key === 'category') {
          queryParts.push(`categoryId=${encodeURIComponent(value)}`);
          queryParts.push(`categoryid=${encodeURIComponent(value)}`);
        }
        if (key === 'subcategory') {
          queryParts.push(`subcategoryid=${encodeURIComponent(value)}`);
          queryParts.push(`subcategoryId=${encodeURIComponent(value)}`);
        }
        if (key === 'brand') {
          queryParts.push(`brandId=${encodeURIComponent(value)}`);
          queryParts.push(`brandid=${encodeURIComponent(value)}`);
          queryParts.push(`brand_id=${encodeURIComponent(value)}`);
          queryParts.push(`vendor_id=${encodeURIComponent(value)}`);
          queryParts.push(`vendorId=${encodeURIComponent(value)}`);
          queryParts.push(`vendor=${encodeURIComponent(value)}`);
          queryParts.push(`seller_id=${encodeURIComponent(value)}`);
          queryParts.push(`sellerId=${encodeURIComponent(value)}`);
        }
        if (key === 'childcategoryid') {
          queryParts.push(`childcategoryId=${encodeURIComponent(value)}`);
          queryParts.push(`childCategoryid=${encodeURIComponent(value)}`);
        }
      }
      const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
      const endpoint = `/all-products${queryString}`;

      const response = await axiosInstance.post(endpoint, sanitizedParams);

      if (response.status || response.statusText) {
        const products =
          response.Data?.products?.data ||
          response.data?.products?.data ||
          response.Data?.products ||
          response.data?.products ||
          response.Data?.data ||
          response.data?.data ||
          response.Data ||
          response.data ||
          [];

        // Extract pagination metadata from API response
        const paginationMeta = response.Data?.products || response.data?.products || {};
        const pagination = {
          current_page: paginationMeta.current_page || 1,
          last_page: paginationMeta.last_page || 1,
          per_page: paginationMeta.per_page || 12,
          total: paginationMeta.total || 0,
          from: paginationMeta.from || 0,
          to: paginationMeta.to || 0,
          first_page_url: paginationMeta.first_page_url,
          last_page_url: paginationMeta.last_page_url,
          next_page_url: paginationMeta.next_page_url,
          prev_page_url: paginationMeta.prev_page_url,
          links: paginationMeta.links || []
        };

        // Add attribute_id to products
        let finalProducts = Array.isArray(products)
          ? products
          : Array.isArray(products.data)
            ? products.data
            : [];

        finalProducts = finalProducts.map(product => {
          const attributes = product.productAttributeDetails || (product.raw && product.raw.productAttributeDetails) || [];
          const firstAttr = attributes[0] || {};
          return {
            ...product,
            attribute_id: firstAttr.id || product.attribute_id || product.attributeId || product.id,
            raw: product.raw || product
          };
        });

        return { products: finalProducts, pagination };
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (error) {
      throw error;
    }
  });
};

/**
 * Fetch product details
 * @param {string} productId - Product ID
 * @param {string} countryId - Country ID ('1' for UAE, '2' for India)
 * @returns {Promise} Product details
 */
export const getProductDetails = async (productId, countryId = '1') => {
  try {
    const stringProductId = String(productId);
    const stringCountryId = String(countryId);
    const endpoint = `/productDetails?productId=${stringProductId}&productid=${stringProductId}&productID=${stringProductId}&country=${stringCountryId}`;

    const response = await axiosInstance.post(endpoint, {
      productId: stringProductId,
      productid: stringProductId,
      productID: stringProductId,
      country: stringCountryId
    });

    if (response.status) {
      // API returns response.Data containing the nested product structures
      const apiData = response.Data || response.data?.Data || response.data;
      if (apiData && apiData.productDetails) {
        const details = apiData.productDetails;
        const attributes = apiData.productAttributeDetails || [];
        const firstAttr = attributes[0] || {};
        const images = apiData.productImages || [];
        const imageUrls = images.map(img => img.name).filter(Boolean);

        const reviewsList = apiData.reviews ||
          apiData.reviewDetails ||
          apiData.review_details ||
          apiData.productReviews ||
          apiData.product_reviews ||
          apiData.ratings ||
          apiData.ratingDetails ||
          details.reviews ||
          details.productReviews ||
          details.reviewDetails ||
          [];

        const reviewCount = parseInt(
          apiData.reviewCount ||
          apiData.review_count ||
          apiData.totalReviews ||
          apiData.total_reviews ||
          apiData.rating_count ||
          details.reviewCount ||
          details.review_count ||
          details.totalReviews ||
          details.total_reviews ||
          (Array.isArray(reviewsList) ? reviewsList.length : 0) ||
          0
        );

        let ratingVal = parseFloat(
          apiData.rating ||
          apiData.starCount ||
          apiData.star_count ||
          apiData.average_rating ||
          apiData.avg_rating ||
          apiData.productRating ||
          details.rating ||
          details.starCount ||
          details.star_count ||
          details.average_rating ||
          details.avg_rating ||
          0
        );

        if (ratingVal === 0 && Array.isArray(reviewsList) && reviewsList.length > 0) {
          const totalStars = reviewsList.reduce((sum, r) => {
            const s = parseFloat(r.star_count || r.starCount || r.rating || r.star || r.stars || 0);
            return sum + s;
          }, 0);
          ratingVal = totalStars / reviewsList.length;
        }

        // Map to unified structure expected by UI components
        return {
          id: details.id,
          attribute_id: firstAttr.id || details.id,
          product_name: details.name || details.product_name,
          category_id: details.category_id,
          subcategory: details.subcategory,
          product_img_url: details.product_img || details.product_img_url,
          description: details.description,
          offer_price: firstAttr.price || details.price || 0,
          orginal_rate: firstAttr.actual_price || details.orginal_rate || details.mrp || 0,
          rating: ratingVal,
          reviews: reviewCount,
          reviews_list: Array.isArray(reviewsList) ? reviewsList : [],
          brand: details.categoryName || 'Jeni Deals',
          sku: details.sku || `JD-C${details.id}`,
          multi_image: JSON.stringify(imageUrls),
          raw: apiData
        };
      }
      return response.data?.data || response.data;
    } else {
      throw new Error(response.message || 'Failed to fetch product details');
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Search products using dedicated search API
 * @param {string} query - Search query
 * @param {string} countryId - Country ID ('1' for UAE, '2' for India)
 * @returns {Promise} Search results
 */
export const searchProducts = async (query, countryId = '1') => {
  try {
    // Use dedicated search endpoint
    const endpoint = `/search`;

    const response = await axiosInstance.post(endpoint, {
      search: query,
      country: countryId
    });

    if (response.status) {
      // Extract products from response - handle multiple possible structures
      const products =
        response.Data?.products?.data ||
        response.data?.products?.data ||
        response.Data?.products ||
        response.data?.products ||
        response.Data?.data ||
        response.data?.data ||
        response.Data ||
        response.data ||
        [];

      // If products is a single object, extract the array inside it
      let finalProducts = Array.isArray(products)
        ? products
        : Array.isArray(products.data)
          ? products.data
          : [];

      // Add attribute_id for each search product too!
      finalProducts = finalProducts.map(product => {
        const attributes = product.productAttributeDetails || (product.raw && product.raw.productAttributeDetails) || [];
        const firstAttr = attributes[0] || {};
        return {
          ...product,
          attribute_id: firstAttr.id || product.attribute_id || product.attributeId || product.id,
          raw: product.raw || product
        };
      });

      return finalProducts;
    } else {
      throw new Error(response.message || 'Search failed');
    }
  } catch (error) {
    throw error;
  }
};

export const getCategoriesWithSubAndChild = async (countryId = '1') => {
  return getCachedOrFetch(`categories-with-sub-and-child-${countryId}`, async () => {
    try {
      const endpoint = `/categories-with-sub-and-child?country=${countryId}`;

      const response = await axiosInstance.post(endpoint, {
        country: countryId
      });

      if (response.status || response.statusText) {
        let raw = response.Data || response.data?.Data || response.data?.data || response.data || [];
        
        let list = [];
        if (Array.isArray(raw)) {
          list = raw;
        } else if (raw && typeof raw === 'object') {
          if (Array.isArray(raw.categories)) list = raw.categories;
          else if (Array.isArray(raw.data)) list = raw.data;
          else list = Object.values(raw);
        }

        list = list.filter(item => item && typeof item === 'object');

        return sortCategoriesByOrderBy(list);
      } else {
        throw new Error(response.message || 'Failed to fetch categories with sub and child');
      }
    } catch (error) {
      throw error;
    }
  });
};

export const getFlashSaleProducts = async (countryId = '1') => {
  try {
    const endpoint = `/allflashsaleproductlist?country=${countryId}`;
    const response = await axiosInstance.post(endpoint, {
      country: countryId
    });

    // Check both response structures
    const rawData = response.Data || response.data?.Data || response.data?.data || response.data;

    // Extract products list (it has products.data according to JSON)
    let productList = rawData?.products?.data || rawData?.products || [];

    // Add attribute_id for each flash product
    productList = productList.map(product => {
      const attributes = product.productAttributeDetails || (product.raw && product.raw.productAttributeDetails) || [];
      const firstAttr = attributes[0] || {};
      return {
        ...product,
        attribute_id: firstAttr.id || product.attribute_id || product.attributeId || product.id,
        raw: product.raw || product
      };
    });

    // Return formatted flash sale object
    return {
      title: rawData?.title || 'Flash Sale',
      remaining_seconds: rawData?.remaining_seconds || 0,
      products: productList
    };
  } catch (error) {
    throw error;
  }
};
