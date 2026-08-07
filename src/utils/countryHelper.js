// Country mapping for API (Only India and UAE)
export const countryMap = {
  '+91': { id: 1, name: 'India', code: 'IN', flag: '🇮🇳' },
  '+971': { id: 2, name: 'UAE', code: 'AE', flag: '🇦🇪' }
}

export const getCountryId = (countryCode) => {
  return countryMap[countryCode]?.id || 1
}

export const getCountryByCode = (countryCode) => {
  return countryMap[countryCode] || countryMap['+91']
}

export const getCountryById = (id) => {
  return Object.values(countryMap).find(c => c.id === id) || countryMap['+91']
}
