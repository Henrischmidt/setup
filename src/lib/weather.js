const KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const CITY = 'Cape Town';

export const fetchWeather = async () => {
  if (!KEY) throw new Error('VITE_OPENWEATHER_API_KEY missing');
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    CITY
  )}&units=metric&appid=${KEY}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Weather ${r.status}`);
  const j = await r.json();
  return {
    temp: Math.round(j.main.temp),
    high: Math.round(j.main.temp_max),
    low: Math.round(j.main.temp_min),
    desc: (j.weather?.[0]?.main ?? 'Clear'),
    city: 'CT',
  };
};

export const FALLBACK_WEATHER = { temp: 22, high: 28, low: 16, desc: 'Clear', city: 'CT' };
