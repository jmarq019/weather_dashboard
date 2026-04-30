// Custom hand-drawn weather icons (clean line / filled SVG)
// Mapped from OpenWeather icon codes: 01..50 + d/n suffix.

const Icon = {
  Sun: ({ size = 24, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
    </svg>
  ),
  Moon: ({ size = 24, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5z" />
    </svg>
  ),
  Cloud: ({ size = 24, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 18a4 4 0 0 1 .5-7.97A6 6 0 0 1 19.4 12 3.5 3.5 0 0 1 18.5 18z" />
    </svg>
  ),
  PartlyDay: ({ size = 24, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="8" cy="9" r="3" />
      <path d="M8 3v1.5M8 13.5V15M3 9h1.5M11.5 9H13M4.5 5.5 5.5 6.5M11 6.5 12 5.5" />
      <path d="M11 19a3.5 3.5 0 0 1 .5-6.97A5 5 0 0 1 21 13.5 3 3 0 0 1 20 19z" />
    </svg>
  ),
  PartlyNight: ({ size = 24, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M13 3a5 5 0 0 0 4 7.5 4.5 4.5 0 0 1-7-3.6A5 5 0 0 1 13 3z" />
      <path d="M9 19a3.5 3.5 0 0 1 .5-6.97A5 5 0 0 1 19 13.5 3 3 0 0 1 18 19z" />
    </svg>
  ),
  Rain: ({ size = 24, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 15a4 4 0 0 1 .5-7.97A6 6 0 0 1 19.4 9 3.5 3.5 0 0 1 18.5 15z" />
      <path d="M9 18l-1 3M13 18l-1 3M17 18l-1 3" />
    </svg>
  ),
  Drizzle: ({ size = 24, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 14a4 4 0 0 1 .5-7.97A6 6 0 0 1 19.4 8 3.5 3.5 0 0 1 18.5 14z" />
      <path d="M9 17v2M13 17v2M17 17v2" />
    </svg>
  ),
  Storm: ({ size = 24, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 14a4 4 0 0 1 .5-7.97A6 6 0 0 1 19.4 8 3.5 3.5 0 0 1 18.5 14z" />
      <path d="M12 14l-2 4h3l-2 4" />
    </svg>
  ),
  Snow: ({ size = 24, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 14a4 4 0 0 1 .5-7.97A6 6 0 0 1 19.4 8 3.5 3.5 0 0 1 18.5 14z" />
      <path d="M9 18v3M13 18v3M17 18v3M8 19.5h2M12 19.5h2M16 19.5h2" />
    </svg>
  ),
  Mist: ({ size = 24, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 9h12M6 13h14M4 17h12M8 21h10" />
    </svg>
  ),

  // UI icons
  Search: ({ size = 16, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
    </svg>
  ),
  SunUI: ({ size = 14 }) => <Icon.Sun size={size} />,
  MoonUI: ({ size = 14 }) => <Icon.Moon size={size} />,
  Pin: ({ size = 14, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 22s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  X: ({ size = 14, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.8" strokeLinecap="round" {...p}><path d="M5 5l14 14M19 5 5 19"/></svg>
  ),
  Drop: ({ size = 14, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11z"/>
    </svg>
  ),
  Wind: ({ size = 14, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h9"/>
    </svg>
  ),
  Eye: ({ size = 14, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Gauge: ({ size = 14, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 16a8 8 0 1 1 16 0"/><path d="M12 16l4-4"/>
    </svg>
  ),
  Thermo: ({ size = 14, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3a2.5 2.5 0 0 1 2.5 2.5v9.1a4 4 0 1 1-5 0V5.5A2.5 2.5 0 0 1 12 3z"/>
    </svg>
  ),
  Sparkle: ({ size = 14, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3"/>
    </svg>
  ),
  Map: ({ size = 14, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v16M15 6v16"/>
    </svg>
  ),
  Calendar: ({ size = 14, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>
    </svg>
  ),
  Clock: ({ size = 14, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
    </svg>
  ),
  History: ({ size = 14, ...p }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 8v5l3 2"/>
    </svg>
  ),
};

// Map an OpenWeather icon code to one of our SVGs.
function iconFor(code, isDay = true) {
  if (!code) return isDay ? Icon.Sun : Icon.Moon;
  const c = String(code).slice(0, 2);
  const n = !isDay || /n$/.test(String(code));
  switch (c) {
    case '01': return n ? Icon.Moon : Icon.Sun;
    case '02': return n ? Icon.PartlyNight : Icon.PartlyDay;
    case '03':
    case '04': return Icon.Cloud;
    case '09': return Icon.Drizzle;
    case '10': return Icon.Rain;
    case '11': return Icon.Storm;
    case '13': return Icon.Snow;
    case '50': return Icon.Mist;
    default:   return Icon.Cloud;
  }
}

// Bucket OpenWeather code → mood for background gradients.
function moodFor(code) {
  if (!code) return 'clear';
  const c = String(code).slice(0, 2);
  if (c === '01' || c === '02') return 'clear';
  if (c === '03' || c === '04') return 'clouds';
  if (c === '09' || c === '10') return 'rain';
  if (c === '11') return 'storm';
  if (c === '13') return 'snow';
  if (c === '50') return 'mist';
  return 'clear';
}

Object.assign(window, { Icon, iconFor, moodFor });
