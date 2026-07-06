// Plain country names, matched against the ne_110m_admin_0_countries GeoJSON
// "ADMIN" property in GlobalMap.jsx for the heat map. Kept as a flat list
// (no ISO codes needed) since the only place this is used is a simple
// optional dropdown on the submit form.
export const COUNTRIES = [
  'United States of America', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Spain', 'Italy', 'Netherlands', 'Belgium', 'Switzerland', 'Austria',
  'Portugal', 'Ireland', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Poland',
  'Czechia', 'Greece', 'Turkey', 'Ukraine', 'Romania', 'Russia',
  'India', 'Pakistan', 'Bangladesh', 'China', 'Japan', 'South Korea', 'Vietnam',
  'Philippines', 'Indonesia', 'Malaysia', 'Singapore', 'Thailand', 'Taiwan',
  'United Arab Emirates', 'Saudi Arabia', 'Israel', 'Egypt', 'Nigeria', 'Kenya',
  'South Africa', 'Ghana', 'Morocco',
  'Brazil', 'Mexico', 'Argentina', 'Colombia', 'Chile', 'Peru', 'Venezuela',
  'Ecuador', 'Bolivia', 'Uruguay', 'Paraguay',
  'New Zealand',
].sort()
