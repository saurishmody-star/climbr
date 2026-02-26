import { useState } from 'react';
import './App.css';
import UploadZone from './components/UploadZone';
import RouteCard from './components/RouteCard';
import { analyseWall, DEMO_ROUTES } from './lib/analyseWall';

function Steps({ step }) {
  // step: 0 = upload, 1 = analyse, 2 = grade
  const items = ['Upload', 'Analyse', 'Grade'];
  return (
    <div className="steps">
      {items.map((label, i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < items.length - 1 ? 1 : 'none' }}>
          <div className={`step ${i === step ? 'active' : i < step ? 'done' : ''}`}>
            <span className="step-dot" />
            {label}
          </div>
          {i < items.length - 1 && <div className="step-line" />}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState(null); // null | 'loading' | 'done'
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState(null);

  const step = !image ? 0 : routes.length === 0 ? 1 : 2;

  function handleFile(img) {
    setImage(img);
    setRoutes([]);
    setError(null);
    setStatus(null);
  }

  function reset() {
    setImage(null);
    setRoutes([]);
    setError(null);
    setStatus(null);
  }

  function updateRoute(index, patch) {
    setRoutes(prev => prev.map((r, i) => i === index ? { ...r, ...patch } : r));
  }

  async function handleAnalyse() {
    if (!apiKey.trim()) { setError('Please enter your Anthropic API key.'); return; }
    setError(null);
    setStatus('loading');
    try {
      const result = await analyseWall({ apiKey, base64: image.base64, mediaType: image.mediaType });
      setRoutes(result);
      setStatus('done');
    } catch (err) {
      setError(err.message);
      setStatus(null);
    }
  }

  function handleDemo() {
    setError(null);
    setStatus('loading');
    setTimeout(() => {
      setRoutes(DEMO_ROUTES);
      setStatus('done');
    }, 900);
  }

  function exportJSON() {
    const data = { wall_set: routes, created: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `wall-set-${Date.now()}.json`;
    a.click();
  }

  async function copyJSON() {
    await navigator.clipboard.writeText(JSON.stringify(routes, null, 2));
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.headerTitle}>climbr</span>
          <span style={styles.headerBadge}>Wall Setter</span>
        </div>
      </header>

      <div style={styles.stepBar}>
        <Steps step={step} />
      </div>

      <main className="main-container">
        <input
          type="password"
          placeholder="Anthropic API key (sk-ant-...)"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          style={styles.apiInput}
        />

        {error && <div style={styles.error}>{error}</div>}

        {!image ? (
          <UploadZone onFile={handleFile} />
        ) : (
          <>
            <div className="preview-row">
              <div style={styles.previewImgWrap}>
                <img src={image.dataUrl} alt="Wall" style={styles.previewImg} />
              </div>
              <div className="preview-actions">
                <button
                  className="btn-primary"
                  onClick={handleAnalyse}
                  disabled={status === 'loading'}
                >
                  Analyse wall
                </button>
                <button className="btn-ghost" onClick={handleDemo} disabled={status === 'loading'}>
                  Demo mode
                </button>
                <button className="btn-ghost" onClick={reset}>
                  Change photo
                </button>
              </div>
            </div>

            {status === 'loading' && (
              <div style={styles.statusBar}>
                <div style={styles.pulseTrack}>
                  <div style={styles.pulseBar} />
                </div>
                <span style={{ fontSize: 13, color: '#888' }}>Analysing wall for hold colours...</span>
              </div>
            )}
          </>
        )}

        {routes.length > 0 && (
          <>
            <div style={styles.routesHeader}>
              <span style={styles.routesTitle}>Detected routes</span>
              <span style={styles.routesCount}>{routes.length} colour{routes.length !== 1 ? 's' : ''}</span>
            </div>

            <div style={styles.grid}>
              {routes.map((route, i) => (
                <RouteCard key={i} route={route} onChange={patch => updateRoute(i, patch)} />
              ))}
            </div>

            <div className="export-row">
              <button className="btn-primary" onClick={exportJSON}>Save set</button>
              <button className="btn-ghost" onClick={copyJSON}>Copy JSON</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  header: {
    padding: '16px 24px',
    borderBottom: '1px solid #1a1a1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  headerTitle: {
    fontSize: 17,
    fontWeight: 700,
    letterSpacing: '-0.5px',
    background: 'linear-gradient(135deg, #fff 0%, #aaa 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  headerBadge: {
    fontSize: 11,
    color: '#555',
    background: '#161616',
    border: '1px solid #222',
    padding: '3px 8px',
    borderRadius: 4,
    letterSpacing: '0.2px',
  },
  stepBar: {
    borderBottom: '1px solid #1a1a1a',
  },
  apiInput: {
    width: '100%',
    background: '#161616',
    border: '1px solid #252525',
    color: '#f0f0f0',
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 24,
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  error: {
    background: '#1a0a0a',
    border: '1px solid #3a1515',
    color: '#f87171',
    padding: '12px 16px',
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 20,
  },
  previewImgWrap: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    background: '#111',
    minWidth: 0,
  },
  previewImg: { width: '100%', display: 'block' },
  statusBar: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: '14px 0',
    marginBottom: 20,
  },
  pulseTrack: {
    height: 3,
    background: '#1e1e1e',
    borderRadius: 99,
    overflow: 'hidden',
  },
  pulseBar: {
    height: '100%',
    width: '40%',
    background: 'linear-gradient(90deg, transparent, #f0f0f0, transparent)',
    borderRadius: 99,
    animation: 'pulse-bar 1.4s ease-in-out infinite',
  },
  routesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  routesTitle: { fontSize: 14, fontWeight: 600, color: '#e0e0e0' },
  routesCount: {
    fontSize: 11,
    color: '#555',
    background: '#161616',
    border: '1px solid #222',
    padding: '3px 8px',
    borderRadius: 4,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 12,
  },
};
