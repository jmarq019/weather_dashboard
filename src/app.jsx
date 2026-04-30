// Main app — composes the layout, manages city/loading state, wires Tweaks.

const { useState, useEffect, useMemo } = React;

const ACCENTS = ["#7DD3FC", "#A78BFA", "#F472B6", "#FBBF24", "#34D399", "#F87171"];

function App() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  const [city, setCity] = useState(() => localStorage.getItem("wd:city") || "Seattle");
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [recents, setRecents] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wd:recents")) || []; } catch { return []; }
  });

  // Apply theme + condition + accent to the root.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = t.theme;
    root.style.setProperty("--accent", t.accent);
  }, [t.theme, t.accent]);

  useEffect(() => {
    const root = document.documentElement;
    const display = applyConditionOverride(data, t.conditionOverride);
    root.dataset.condition = display ? moodFor(display.icon) : "clear";
  }, [data, t.conditionOverride]);

  // Fetch weather when city changes.
  useEffect(() => {
    let cancelled = false;
    setError(null);
    setData(null);
    loadWeather(city).then(res => {
      if (cancelled) return;
      setData(res.data);
      if (!res.ok) setError(res.error);
      localStorage.setItem("wd:city", city);
      // Update recents (move to top, dedupe, max 6)
      setRecents(prev => {
        const next = [
          { name: res.data.name, country: res.data.country, tempC: res.data.tempC },
          ...prev.filter(r => r.name.toLowerCase() !== res.data.name.toLowerCase()),
        ].slice(0, 6);
        localStorage.setItem("wd:recents", JSON.stringify(next));
        return next;
      });
    });
    return () => { cancelled = true; };
  }, [city]);

  const display = useMemo(() => applyConditionOverride(data, t.conditionOverride), [data, t.conditionOverride]);

  const onSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) { setCity(q); setQuery(""); }
  };

  const removeRecent = (name) => {
    setRecents(prev => {
      const next = prev.filter(r => r.name !== name);
      localStorage.setItem("wd:recents", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="app">
      <div className="bg" aria-hidden="true"/>

      <header className="topbar">
        <div className="brand">
          <span className="brand__mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3.5"/>
              <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>
            </svg>
          </span>
          <div>
            <div className="brand__name">Skycast</div>
            <div className="brand__sub">Weather, refreshed</div>
          </div>
        </div>

        <form className="search" onSubmit={onSubmit}>
          <span className="search__icon"><Icon.Search size={16}/></span>
          <input
            type="text"
            placeholder="Search a city — e.g. Tokyo, London, São Paulo"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <div className="topbar__actions">
          <div className="unit-toggle" role="group" aria-label="Units">
            <button className={t.units === 'C' ? 'is-active' : ''} onClick={() => setTweak('units', 'C')}>°C</button>
            <button className={t.units === 'F' ? 'is-active' : ''} onClick={() => setTweak('units', 'F')}>°F</button>
          </div>
          <button className="iconbtn" aria-label="Toggle theme"
                  onClick={() => setTweak('theme', t.theme === 'dark' ? 'light' : 'dark')}>
            {t.theme === 'dark' ? <Icon.SunUI size={16}/> : <Icon.MoonUI size={16}/>}
          </button>
        </div>
      </header>

      <main className="grid">
        {/* Left column — Hero + Hourly + Forecast + Map */}
        <div style={{display:'flex', flexDirection:'column', gap:18}}>
          <Hero data={display} unit={t.units}/>
          <Hourly data={display} unit={t.units}/>
          <Forecast data={display} unit={t.units}/>
          <MiniMap data={display}/>
        </div>

        {/* Right column — stat row + sun + air + wind + recents */}
        <div style={{display:'flex', flexDirection:'column', gap:18}}>
          <div className="grid__row">
            <div className="span-6">
              <StatTile icon={Icon.Drop} label="Humidity"
                        value={display ? `${display.humidity}%` : '—'}
                        sub={display ? dewpointHint(display) : null}/>
            </div>
            <div className="span-6">
              <StatTile icon={Icon.Eye} label="Visibility"
                        value={display ? fmtVis(display.visibility, t.units) : '—'}
                        sub="At ground level"/>
            </div>
          </div>
          <SunArc data={display}/>
          <AirAndUV data={display}/>
          <WindCompass data={display} unit={t.units}/>
          <Recents items={recents} current={city}
                   onPick={(n) => setCity(n)}
                   onDelete={removeRecent}/>
        </div>
      </main>

      {error && (
        <div style={{ position:'fixed', bottom:16, left:16, zIndex: 1000, maxWidth: 320 }}>
          <div className="card">
            <div className="error">
              <b>Showing demo data</b>
              <span>The OpenWeather API returned an error ({error}). The dashboard is rendering with realistic mock data so you can review the design.</span>
            </div>
          </div>
        </div>
      )}

      <TweaksPanel>
        <TweakSection label="Display"/>
        <TweakRadio label="Theme" value={t.theme} options={["light","dark"]}
                    onChange={(v) => setTweak('theme', v)}/>
        <TweakRadio label="Units" value={t.units} options={["C","F"]}
                    onChange={(v) => setTweak('units', v)}/>

        <TweakSection label="Visual mood"/>
        <TweakSelect label="Condition preview" value={t.conditionOverride}
                     options={[
                       { value: 'auto',   label: 'Auto (live data)' },
                       { value: 'sunny',  label: 'Sunny / clear' },
                       { value: 'cloudy', label: 'Cloudy' },
                       { value: 'rain',   label: 'Rain' },
                       { value: 'snow',   label: 'Snow' },
                       { value: 'storm',  label: 'Thunderstorm' },
                     ]}
                     onChange={(v) => setTweak('conditionOverride', v)}/>

        <TweakSection label="Accent"/>
        <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
          {ACCENTS.map(c => (
            <button key={c} onClick={() => setTweak('accent', c)}
              style={{
                width: 26, height: 26, borderRadius: 8, cursor:'pointer',
                background: c, border: t.accent === c ? '2px solid #29261b' : '1px solid rgba(0,0,0,0.1)',
              }}
              aria-label={`Accent ${c}`}/>
          ))}
        </div>
        <TweakColor label="Custom accent" value={t.accent}
                    onChange={(v) => setTweak('accent', v)}/>
      </TweaksPanel>
    </div>
  );
}

function dewpointHint(d) {
  if (d.humidity > 80) return "Muggy";
  if (d.humidity > 60) return "Comfortable";
  if (d.humidity > 40) return "Pleasant";
  return "Dry";
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
