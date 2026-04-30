// Weather data layer.
// Wires to OpenWeather API. Falls back to mock data if the API key is
// missing/invalid or the network call fails — so the dashboard always renders.

const OPENWEATHER_KEY = window.OPENWEATHER_KEY;

// ── API ──────────────────────────────────────────────────────────────────
async function fetchCurrent(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_KEY}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`OpenWeather ${r.status}`);
  return r.json();
}

async function fetchForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_KEY}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`OpenWeather ${r.status}`);
  return r.json();
}

async function fetchAir(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`OpenWeather AQI ${r.status}`);
  return r.json();
}

// ── Reshape ──────────────────────────────────────────────────────────────
function shapeWeather(current, forecast, air) {
  const tz = current.timezone || 0; // seconds offset from UTC at the city
  const viewerOff = new Date().getTimezoneOffset() * 60; // sec; positive for west of UTC
  const toCityWall = (utcSec) => new Date((utcSec + tz + viewerOff) * 1000);

  const localNow = toCityWall(Math.floor(Date.now() / 1000));
  const sunrise  = toCityWall(current.sys.sunrise);
  const sunset   = toCityWall(current.sys.sunset);

  // Hourly: take next 8 forecast slots (24h, 3-hour spacing)
  const hourly = (forecast?.list || []).slice(0, 8).map(slot => ({
    t: toCityWall(slot.dt),
    temp: slot.main.temp,
    icon: slot.weather[0].icon,
    pop: slot.pop || 0,
  }));

  // Daily: bucket by yyyy-mm-dd, derive min/max/icon
  const days = {};
  (forecast?.list || []).forEach(slot => {
    const d = toCityWall(slot.dt);
    const key = d.toISOString().slice(0,10);
    if (!days[key]) days[key] = { date: d, min: slot.main.temp_min, max: slot.main.temp_max, icons: {}, pop: 0 };
    days[key].min = Math.min(days[key].min, slot.main.temp_min);
    days[key].max = Math.max(days[key].max, slot.main.temp_max);
    days[key].icons[slot.weather[0].icon] = (days[key].icons[slot.weather[0].icon] || 0) + 1;
    days[key].pop = Math.max(days[key].pop, slot.pop || 0);
  });
  const daily = Object.values(days).slice(0, 5).map(d => ({
    date: d.date,
    min: d.min, max: d.max,
    icon: Object.entries(d.icons).sort((a,b)=>b[1]-a[1])[0][0],
    pop: d.pop,
  }));

  const aqi = air?.list?.[0]?.main?.aqi || null;
  const components = air?.list?.[0]?.components || null;

  return {
    name: current.name,
    country: current.sys.country,
    lat: current.coord.lat, lon: current.coord.lon,
    tempC: current.main.temp,
    feelsC: current.main.feels_like,
    minC: current.main.temp_min, maxC: current.main.temp_max,
    humidity: current.main.humidity,
    pressure: current.main.pressure,
    visibility: current.visibility,
    windMs: current.wind?.speed || 0,
    windDeg: current.wind?.deg || 0,
    icon: current.weather[0].icon,
    cond: current.weather[0].main,
    desc: current.weather[0].description,
    sunrise, sunset, localNow,
    hourly, daily,
    aqi, components,
    uvIndex: estimateUV(current, sunrise, sunset, localNow),
  };
}

// OpenWeather basic endpoints don't include UV; estimate from sun position + cloudiness.
function estimateUV(current, sunrise, sunset, now) {
  const day = now > sunrise && now < sunset;
  if (!day) return 0;
  const total = sunset - sunrise;
  const through = now - sunrise;
  const arc = Math.sin(Math.PI * (through / total)); // 0..1..0
  const cloud = (current.clouds?.all || 0) / 100;
  const lat = Math.abs(current.coord.lat);
  const latFactor = 1 - Math.min(1, lat / 90) * 0.4;
  const peak = 9 * latFactor;
  return Math.max(0, Math.round(peak * arc * (1 - cloud * 0.55) * 10) / 10);
}

// ── Mock fallback (so the design always has data to render) ──────────────
function mockWeather(city = "Seattle") {
  const now = new Date();
  const sunrise = new Date(now); sunrise.setHours(6, 12, 0, 0);
  const sunset  = new Date(now); sunset.setHours(20, 38, 0, 0);
  const hourly = Array.from({ length: 8 }, (_, i) => {
    const t = new Date(now.getTime() + i * 3 * 3600 * 1000);
    const temps = [14, 15, 17, 19, 18, 16, 13, 12];
    const icons = ["02d","02d","03d","03d","04d","04n","04n","02n"];
    return { t, temp: temps[i], icon: icons[i], pop: [0,0,0.1,0.2,0.3,0.4,0.2,0.1][i] };
  });
  const daily = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(now.getTime() + i * 86400000);
    const data = [
      { min: 11, max: 19, icon: "02d", pop: 0.1 },
      { min: 12, max: 18, icon: "03d", pop: 0.2 },
      { min: 10, max: 16, icon: "10d", pop: 0.7 },
      { min:  9, max: 15, icon: "10d", pop: 0.8 },
      { min: 11, max: 17, icon: "04d", pop: 0.3 },
    ][i];
    return { date: d, ...data };
  });
  return {
    name: city, country: "US",
    lat: 47.6062, lon: -122.3321,
    tempC: 17, feelsC: 16, minC: 12, maxC: 20,
    humidity: 62, pressure: 1014, visibility: 16000,
    windMs: 3.1, windDeg: 215,
    icon: "02d", cond: "Clouds", desc: "few clouds",
    sunrise, sunset, localNow: now,
    hourly, daily,
    aqi: 2, components: { pm2_5: 8.4 },
    uvIndex: 4.5,
  };
}

async function loadWeather(city) {
  try {
    const current = await fetchCurrent(city);
    const [forecast, air] = await Promise.all([
      fetchForecast(city).catch(() => null),
      fetchAir(current.coord.lat, current.coord.lon).catch(() => null),
    ]);
    return { ok: true, data: shapeWeather(current, forecast || { list: [] }, air) };
  } catch (e) {
    return { ok: false, error: e.message, data: mockWeather(city) };
  }
}

// ── Unit helpers ─────────────────────────────────────────────────────────
const c2f = c => c * 9/5 + 32;
const fmtTemp = (c, unit) => `${Math.round(unit === 'F' ? c2f(c) : c)}°`;
const fmtTempUnit = (c, unit) => `${Math.round(unit === 'F' ? c2f(c) : c)}°${unit}`;
const fmtWind = (ms, unit) => unit === 'F'
  ? `${(ms * 2.237).toFixed(1)} mph`
  : `${(ms * 3.6).toFixed(1)} km/h`;
const fmtVis = (m, unit) => unit === 'F'
  ? `${(m / 1609).toFixed(1)} mi`
  : `${(m / 1000).toFixed(1)} km`;
const fmtTime = d => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
const fmtDay  = d => d.toLocaleDateString([], { weekday: 'short' });
const fmtFullDay = d => d.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

const AQI_CATS = ["—", "Good", "Fair", "Moderate", "Poor", "Very Poor"];
const AQI_COLORS = ["#94a3b8", "#34d399", "#a3e635", "#fbbf24", "#fb923c", "#f87171"];

function uvCat(uv) {
  if (uv < 3) return { label: "Low", color: "#34d399" };
  if (uv < 6) return { label: "Moderate", color: "#fbbf24" };
  if (uv < 8) return { label: "High", color: "#fb923c" };
  if (uv < 11) return { label: "Very High", color: "#f87171" };
  return { label: "Extreme", color: "#a78bfa" };
}

// Apply a synthetic "condition override" so users can preview each visual mood.
function applyConditionOverride(data, override) {
  if (!override || override === "auto") return data;
  const map = {
    sunny:  { icon: "01d", cond: "Clear",  desc: "clear sky", tempC: 26, feelsC: 27 },
    cloudy: { icon: "04d", cond: "Clouds", desc: "overcast clouds", tempC: 16, feelsC: 15 },
    rain:   { icon: "10d", cond: "Rain",   desc: "light rain", tempC: 12, feelsC: 11 },
    snow:   { icon: "13d", cond: "Snow",   desc: "light snow", tempC: -2, feelsC: -5 },
    storm:  { icon: "11d", cond: "Storm",  desc: "thunderstorm", tempC: 14, feelsC: 13 },
  };
  const o = map[override];
  if (!o) return data;
  return { ...data, ...o };
}

Object.assign(window, {
  loadWeather, mockWeather, applyConditionOverride,
  c2f, fmtTemp, fmtTempUnit, fmtWind, fmtVis, fmtTime, fmtDay, fmtFullDay,
  AQI_CATS, AQI_COLORS, uvCat,
});
