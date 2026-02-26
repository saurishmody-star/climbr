import { useState } from 'react';
import './App.css';
import UploadZone from './components/UploadZone';
import RouteCard from './components/RouteCard';
import { analyseWall, DEMO_ROUTES } from './lib/analyseWall';

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [image, setImage] = useState(null); // { base64, mediaType, dataUrl }
  const [status, setStatus] = useState(null); // null | 'loading' | 'done'
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState(null);

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
    <div style={styles.page}>
      <header style={styles.header}>
        <span style={styles.headerTitle}>climbr</span>
        <span style={styles.headerBadge}>Wall Setter</span>
      </header>

      <main style={styles.main}>
        {/* API Key */}
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
            <div style={styles.previewRow}>
              <div style={styles.previewImgWrap}>
                <img src={image.dataUrl} alt="Wall" style={styles.previewImg} />
              </div>
              <div style={styles.previewActions}>
                <button
                  style={{ ...styles.btnPrimary, opacity: status === 'loading' ? 0.4 : 1 }}
                  onClick={handleAnalyse}
                  disabled={status === 'loading'}
                >
                  Analyse wall
                </button>
                <button style={styles.btnGhost} onClick={handleDemo} disabled={status === 'loading'}>
                  Demo mode
                </button>
                <button style={styles.btnGhost} onClick={reset}>
                  Change photo
                </button>
              </div>
            </div>

            {status === 'loading' && (
              <div style={styles.statusBar}>
                <span style={styles.spinner} />
                <span>Analysing wall for hold colours...</span>
              </div>
            )}
          </>
        )}

        {routes.length > 0 && (
          <>
            <div style={styles.routesHeader}>
              <span style={styles.routesTitle}>Detected routes</span>
              <span style={styles.routesCount}>{routes.length} colour{routes.length !== 1 ? 's' : ''} detected</span>
            </div>

            <div style={styles.grid}>
              {routes.map((route, i) => (
                <RouteCard key={i} route={route} onChange={patch => updateRoute(i, patch)} />
              ))}
            </div>

            <div style={styles.exportRow}>
              <button style={styles.btnPrimary} onClick={exportJSON}>Save set</button>
              <button style={styles.btnGhost} onClick={copyJSON}>Copy JSON</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh' },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid #222',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: 600, letterSpacing: '-0.3px' },
  headerBadge: {
    fontSize: 12,
    color: '#666',
    background: '#1a1a1a',
    padding: '3px 8px',
    borderRadius: 4,
  },
  main: { maxWidth: 960, margin: '0 auto', padding: '32px 24px' },
  apiInput: {
    width: '100%',
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    color: '#f0f0f0',
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 24,
    outline: 'none',
  },
  error: {
    background: '#1a0a0a',
    border: '1px solid #3a1515',
    color: '#ff8080',
    padding: '12px 16px',
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 20,
  },
  previewRow: {
    display: 'flex',
    gap: 24,
    marginBottom: 28,
  },
  previewImgWrap: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    background: '#111',
  },
  previewImg: { width: '100%', display: 'block' },
  previewActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    alignItems: 'flex-start',
  },
  statusBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 16px',
    background: '#1a1a1a',
    borderRadius: 8,
    marginBottom: 28,
    fontSize: 13,
    color: '#aaa',
  },
  spinner: {
    display: 'inline-block',
    width: 16,
    height: 16,
    border: '2px solid #333',
    borderTopColor: '#f0f0f0',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    flexShrink: 0,
  },
  routesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  routesTitle: { fontSize: 15, fontWeight: 600 },
  routesCount: { fontSize: 12, color: '#555' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 12,
  },
  exportRow: {
    display: 'flex',
    gap: 10,
    marginTop: 28,
    paddingTop: 24,
    borderTop: '1px solid #1a1a1a',
  },
  btnPrimary: {
    background: '#f0f0f0',
    color: '#0f0f0f',
    border: 'none',
    padding: '11px 22px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
  },
  btnGhost: {
    background: 'transparent',
    color: '#888',
    border: '1px solid #2a2a2a',
    padding: '10px 18px',
    borderRadius: 8,
    fontSize: 13,
  },
};
