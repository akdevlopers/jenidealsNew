/**
 * Helper to generate Holidays portal URL with bearer token if user is logged in
 * Format: https://holidays.jenideals.com/holidays?holidayUser=<token>
 */
export const getHolidaysUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_HOLIDAYS_URL || "https://holidays.jenideals.com/holidays";

  if (typeof window === 'undefined') {
    return baseUrl;
  }

  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return baseUrl;
    }

    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}holidayUser=${encodeURIComponent(token)}`;
  } catch (e) {
    return baseUrl;
  }
};
