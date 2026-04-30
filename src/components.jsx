// UI components for the weather dashboard.

const { useState, useEffect, useRef, useMemo } = React;

// ── Hero (current conditions) ────────────────────────────────────────────
function Hero({ data, unit }) {
  if (!data) return <HeroSkeleton />;
  const isDay = data.localNow > data.sunrise && data.localNow < data.sunset;
  const Glyph = iconFor(data.icon, isDay);
  return (
    <div className="card">
      <div className="hero">
        <div className="hero__top">
          <div>
            <div className="hero__loc"><span className="dot"/>{data.name}{data.country ? `, ${data.country}` : ''}</div>
            <h1 className="hero__city">{data.desc.replace(/\b\w/g, c => c.toUpperCase())}</h1>
            <div className="hero__time">{fmtFullDay(data.localNow)} · {fmtTime(data.localNow)}</div>
          </div>
          <div className="hero__art"><Glyph size={96} strokeWidth={1.2} /></div>
        </div>

        <div className="hero__temp">
          <span className="num">{fmtTemp(data.tempC, unit)}</span>
          <span className="deg">{unit}</span>
        </div>

        <div>
          <div className="hero__cond">{data.cond}</div>
          <div className="hero__feels">Feels like {fmtTempUnit(data.feelsC, unit)}</div>
        </div>

        <div className="hero__hi-lo">
          <span>High <b>{fmtTemp(data.maxC, unit)}</b></span>
          <span>Low <b>{fmtTemp(data.minC, unit)}</b></span>
          <span>Humidity <b>{data.humidity}%</b></span>
        </div>
      </div>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="card">
      <div className="hero">
        <div className="skeleton" style={{height:14,width:120}}/>
        <div className="skeleton" style={{height:32,width:200,marginTop:8}}/>
        <div className="skeleton" style={{height:120,width:260,marginTop:18}}/>
        <div className="skeleton" style={{height:14,width:180,marginTop:18}}/>
      </div>
    </div>
  );
}

// ── Hourly strip ─────────────────────────────────────────────────────────
function Hourly({ data, unit }) {
  if (!data) return null;
  return (
    <div className="card">
      <div className="card__inner" style={{paddingBottom: 6}}>
        <div className="card__title"><Icon.Clock size={12}/>Next 24 hours</div>
      </div>
      <div className="hourly">
        {data.hourly.map((h, i) => {
          const isDay = h.t.getHours() >= 6 && h.t.getHours() < 20;
          const G = iconFor(h.icon, isDay);
          return (
            <div key={i} className={`hour ${i === 0 ? 'now' : ''}`}>
              <span className="hour__t">{i === 0 ? 'Now' : fmtTime(h.t)}</span>
              <span className="hour__icon"><G size={22}/></span>
              <span className="hour__deg">{fmtTemp(h.temp, unit)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 5-day forecast ───────────────────────────────────────────────────────
function Forecast({ data, unit }) {
  if (!data) return null;
  const allMin = Math.min(...data.daily.map(d => d.min));
  const allMax = Math.max(...data.daily.map(d => d.max));
  const span = Math.max(1, allMax - allMin);
  return (
    <div className="card">
      <div className="card__inner" style={{paddingBottom: 4}}>
        <div className="card__title"><Icon.Calendar size={12}/>5-day forecast</div>
      </div>
      <div className="forecast">
        {data.daily.map((d, i) => {
          const G = iconFor(d.icon, true);
          const left = ((d.min - allMin) / span) * 100;
          const right = ((allMax - d.max) / span) * 100;
          return (
            <div key={i} className="forecast__row">
              <div className="forecast__day">
                {i === 0 ? 'Today' : fmtDay(d.date)}
                <small>{d.date.toLocaleDateString([], {month:'short', day:'numeric'})}</small>
              </div>
              <div className="forecast__icon"><G size={26}/></div>
              <div className="forecast__bar">
                <div className="fill" style={{ left: `${left}%`, right: `${right}%` }}/>
              </div>
              <div className="forecast__temps">
                <b>{fmtTemp(d.max, unit)}</b> &nbsp; {fmtTemp(d.min, unit)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Sun arc ──────────────────────────────────────────────────────────────
function SunArc({ data }) {
  if (!data) return null;
  const total = data.sunset - data.sunrise;
  const through = Math.max(0, Math.min(total, data.localNow - data.sunrise));
  const t = total > 0 ? through / total : 0;
  // Quadratic bezier path
  const W = 280, H = 90;
  const ax = 10, ay = H - 10;
  const cx = W/2, cy = -20;
  const bx = W - 10, by = H - 10;
  // Point on quadratic bezier at t:
  const px = (1-t)*(1-t)*ax + 2*(1-t)*t*cx + t*t*bx;
  const py = (1-t)*(1-t)*ay + 2*(1-t)*t*cy + t*t*by;

  return (
    <div className="card">
      <div className="card__inner">
        <div className="card__title"><Icon.SunUI size={12}/>Sunrise &amp; sunset</div>
        <div className="sun-arc">
          <svg className="sun-arc__svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="sunArcG" x1="0" x2="1">
                <stop offset="0" stopColor="var(--accent)" stopOpacity="0.1"/>
                <stop offset="0.5" stopColor="var(--accent)" stopOpacity="0.7"/>
                <stop offset="1" stopColor="var(--accent)" stopOpacity="0.1"/>
              </linearGradient>
            </defs>
            <line x1={ax} y1={ay} x2={bx} y2={by} stroke="var(--ink-faint)" strokeWidth="1" strokeDasharray="2 4"/>
            <path d={`M ${ax} ${ay} Q ${cx} ${cy} ${bx} ${by}`} fill="none"
                  stroke="url(#sunArcG)" strokeWidth="2" strokeLinecap="round"/>
            <circle cx={px} cy={py} r="6" fill="var(--accent)"/>
            <circle cx={px} cy={py} r="11" fill="var(--accent)" opacity="0.25"/>
          </svg>
          <div className="sun-arc__times">
            <div><b>{fmtTime(data.sunrise)}</b>Sunrise</div>
            <div style={{textAlign:'right'}}><b>{fmtTime(data.sunset)}</b>Sunset</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Air quality + UV ─────────────────────────────────────────────────────
function AirAndUV({ data }) {
  if (!data) return null;
  const aqi = data.aqi || 1;
  const aqiCat = AQI_CATS[aqi];
  const aqiColor = AQI_COLORS[aqi];
  const uv = uvCat(data.uvIndex);
  return (
    <div className="card">
      <div className="card__inner">
        <div className="card__title"><Icon.Sparkle size={12}/>Air quality &amp; UV</div>
        <div className="gauges">
          <div className="gauge">
            <div className="gauge__top">
              <span className="gauge__num">{aqi}/5</span>
              <span className="gauge__cat" style={{color: aqiColor}}>{aqiCat}</span>
            </div>
            <div className="gauge__bar">
              <div className="fill" style={{ width: `${(aqi/5)*100}%`, background: aqiColor}}/>
            </div>
            <div className="stat__sub">AQI · PM2.5 {data.components?.pm2_5?.toFixed?.(1) ?? '—'} µg/m³</div>
          </div>
          <div className="gauge">
            <div className="gauge__top">
              <span className="gauge__num">{data.uvIndex.toFixed(1)}</span>
              <span className="gauge__cat" style={{color: uv.color}}>{uv.label}</span>
            </div>
            <div className="gauge__bar">
              <div className="fill" style={{ width: `${Math.min(100,(data.uvIndex/11)*100)}%`, background: uv.color}}/>
            </div>
            <div className="stat__sub">UV index</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Wind compass ─────────────────────────────────────────────────────────
function WindCompass({ data, unit }) {
  if (!data) return null;
  const r = 50;
  const cx = 65, cy = 65;
  const deg = data.windDeg;
  const rad = ((deg - 90) * Math.PI) / 180;
  const tx = cx + Math.cos(rad) * (r - 10);
  const ty = cy + Math.sin(rad) * (r - 10);
  const dirs = [
    { l: 'N', a: -90 }, { l: 'E', a: 0 }, { l: 'S', a: 90 }, { l: 'W', a: 180 },
  ];
  return (
    <div className="card">
      <div className="card__inner">
        <div className="card__title"><Icon.Wind size={12}/>Wind &amp; pressure</div>
        <div className="compass">
          <svg className="compass__svg" viewBox="0 0 130 130">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--glass-border)" strokeWidth="1"/>
            <circle cx={cx} cy={cy} r={r-8} fill="none" stroke="var(--glass-edge)" strokeWidth="1" strokeDasharray="2 4"/>
            {dirs.map(d => {
              const a = (d.a * Math.PI) / 180;
              const x = cx + Math.cos(a) * (r + 8);
              const y = cy + Math.sin(a) * (r + 8) + 4;
              return <text key={d.l} x={x} y={y} textAnchor="middle"
                           fontSize="10" fill="var(--ink-mute)">{d.l}</text>;
            })}
            <line x1={cx} y1={cy} x2={tx} y2={ty} stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx={tx} cy={ty} r="4" fill="var(--accent)"/>
            <circle cx={cx} cy={cy} r="3" fill="var(--ink)"/>
          </svg>
          <div className="compass__meta">
            <span className="lbl">Wind</span>
            <span className="big">{fmtWind(data.windMs, unit)}</span>
            <span className="stat__sub">{cardinal(deg)} · {Math.round(deg)}°</span>
            <span className="lbl" style={{marginTop:8}}>Pressure</span>
            <span className="big">{data.pressure} hPa</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function cardinal(deg) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

// ── Mini map ─────────────────────────────────────────────────────────────
function MiniMap({ data }) {
  if (!data) return null;
  return (
    <div className="card">
      <div className="card__inner" style={{paddingBottom: 8}}>
        <div className="card__title"><Icon.Map size={12}/>Location · {data.lat.toFixed(2)}, {data.lon.toFixed(2)}</div>
      </div>
      <div className="map">
        <svg className="map__svg" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="mapBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--glass-strong)"/>
              <stop offset="1" stopColor="var(--glass)"/>
            </linearGradient>
            <radialGradient id="mapHot" cx="50%" cy="50%" r="40%">
              <stop offset="0" stopColor="var(--accent)" stopOpacity="0.4"/>
              <stop offset="1" stopColor="var(--accent)" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <rect width="600" height="300" fill="url(#mapBg)"/>
          {[0,1,2,3,4,5,6].map(i => (
            <path key={i}
              d={`M0 ${60 + i*30} C 100 ${20 + i*30}, 250 ${100 + i*30}, 350 ${50 + i*30} S 600 ${30 + i*30}, 600 ${60 + i*30}`}
              fill="none" stroke="var(--glass-border)" strokeWidth="1" opacity={0.6 - i*0.06}/>
          ))}
          <path d="M0 220 C 120 200, 200 240, 300 230 S 480 210, 600 220" fill="none" stroke="var(--ink-faint)" strokeWidth="1.5"/>
          <path d="M120 0 C 140 80, 180 160, 200 300" fill="none" stroke="var(--ink-faint)" strokeWidth="1.2"/>
          <path d="M450 0 C 430 80, 480 160, 460 300" fill="none" stroke="var(--ink-faint)" strokeWidth="1.2"/>
          <circle cx="300" cy="150" r="120" fill="url(#mapHot)"/>
        </svg>
        <div className="map__pin">
          <span className="label">{data.name} · {fmtTemp(data.tempC, 'C')}C</span>
          <span className="dot"/>
        </div>
      </div>
    </div>
  );
}

// ── Stat tiles ───────────────────────────────────────────────────────────
function StatTile({ icon: G, label, value, sub }) {
  return (
    <div className="card">
      <div className="card__inner stat">
        <div className="stat__label"><G size={12}/>{label}</div>
        <div className="stat__value">{value}</div>
        {sub && <div className="stat__sub">{sub}</div>}
      </div>
    </div>
  );
}

// ── Recent searches ──────────────────────────────────────────────────────
function Recents({ items, current, onPick, onDelete }) {
  return (
    <div className="card">
      <div className="card__inner">
        <div className="card__title"><Icon.History size={12}/>Recent &amp; saved</div>
        <div className="recents">
          {items.length === 0 && <div className="empty">Search a city to save it here.</div>}
          {items.map(it => (
            <div key={it.name} className="recent" onClick={() => onPick(it.name)}>
              <span className="recent__name">
                <Icon.Pin className="pin" size={14}/>
                <span><b>{it.name}</b>{it.country ? <small> · {it.country}</small> : null}</span>
              </span>
              <span style={{display:'flex', alignItems:'center', gap:8}}>
                {it.tempC != null && <span className="recent__temp"><b>{Math.round(it.tempC)}°</b></span>}
                <button className="recent__del" onClick={(e) => { e.stopPropagation(); onDelete(it.name); }} aria-label="Remove">
                  <Icon.X size={12}/>
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Hero, Hourly, Forecast, SunArc, AirAndUV, WindCompass, MiniMap, StatTile, Recents,
});
