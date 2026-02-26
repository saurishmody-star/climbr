import { useState, useRef } from 'react';
import './App.css';
import UploadZone from './components/UploadZone';
import RouteCard from './components/RouteCard';
import { analyseWall, DEMO_ROUTES } from './lib/analyseWall';

const KEY_STORAGE = 'climbr_api_key';

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(KEY_STORAGE) || '');
  const [showSettings, setShowSettings] = useState(false);
  const [keyDraft, setKeyDraft] = useState('');
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState(null); // null | 'loading' | 'done' | 'error'
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();

  function saveKey(k) {
    localStorage.setItem(KEY_STORAGE, k);
    setApiKey(k);
    setShowSettings(false);
  }

  function openSettings() {
    setKeyDraft(apiKey);
    setShowSettings(true);
  }

  async function handleFile(img) {
    setImage(img);
    setRoutes([]);
    setError(null);
    setStatus('loading');

    if (!apiKey) {
      // No key — fall back to demo
      setTimeout(() => { setRoutes(DEMO_ROUTES); setStatus('done'); }, 1200);
      return;
    }

    try {
      const result = await analyseWall({ apiKey, base64: img.base64, mediaType: img.mediaType });
      setRoutes(result);
      setStatus('done');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  function retake() {
    setImage(null);
    setRoutes([]);
    setError(null);
    setStatus(null);
    setTimeout(() => fileInputRef.current?.click(), 50);
  }

  function handleRetakeFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => handleFile({
      base64: ev.target.result.split(',')[1],
      mediaType: file.type,
      dataUrl: ev.target.result,
    });
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function updateRoute(index, patch) {
    setRoutes(prev => prev.map((r, i) => i === index ? { ...r, ...patch } : r));
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

  const hasRoutes = routes.length > 0;

  return (
    <div style={styles.page}>
      {/* Settings modal */}
      {showSettings && (
        <div style={styles.modalOverlay} onClick={() => setShowSettings(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalTitle}>API Key</div>
            <p style={styles.modalHint}>Your Anthropic key — stored locally, never sent anywhere except the API.</p>
            <input
              type="password"
              autoFocus
              placeholder="sk-ant-..."
              value={keyDraft}
              onChange={e => setKeyDraft(e.target.value)}
              style={styles.modalInput}
              onKeyDown={e => e.key === 'Enter' && saveKey(keyDraft)}
            />
            <div style={styles.modalActions}>
              <button className="btn-primary" onClick={() => saveKey(keyDraft)}>Save</button>
              <button className="btn-ghost" onClick={() => setShowSettings(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>climbr</span>
          <span style={styles.modeBadge}>Manager Mode</span>
        </div>
        <button style={styles.settingsBtn} onClick={openSettings} title="API key settings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </header>

      <main className="main-container">
        {/* Error */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Upload or image preview */}
        {!image ? (
          <UploadZone onFile={handleFile} hasKey={!!apiKey} />
        ) : (
          <div style={styles.imageWrap}>
            <img src={image.dataUrl} alt="Wall" style={styles.image} />

            {/* Loading overlay */}
            {status === 'loading' && (
              <div style={styles.loadingOverlay}>
                <div style={styles.loadingPill}>
                  <span style={styles.loadingDot} />
                  Detecting hold colours...
                </div>
              </div>
            )}

            {/* Retake button */}
            {status !== 'loading' && (
              <button style={styles.retakeBtn} onClick={retake}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1 4 1 10 7 10"/>
                  <path d="M3.51 15a9 9 0 1 0 .49-4"/>
                </svg>
                Retake
              </button>
            )}
          </div>
        )}

        {/* Hidden file input for retake */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={handleRetakeFile}
        />

        {/* Routes */}
        {hasRoutes && (
          <>
            <div style={styles.routesHeader}>
              <span style={styles.routesTitle}>Routes detected</span>
              <span style={styles.routesPill}>{routes.length}</span>
            </div>
            <div className="routes-grid">
              {routes.map((route, i) => (
                <RouteCard key={i} route={route} onChange={patch => updateRoute(i, patch)} />
              ))}
            </div>
            <div className="export-row">
              <button className="btn-primary" onClick={exportJSON}>Publish set</button>
              <button className="btn-ghost" onClick={copyJSON}>Copy JSON</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#0c0d1a', color: '#e8e9f0' },

  header: {
    padding: '14px 20px',
    borderBottom: '1px solid #13152b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: '#0c0d1a',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  logo: {
    fontSize: 18,
    fontWeight: 800,
    letterSpacing: '-0.5px',
    background: 'linear-gradient(135deg, #fff 0%, #888 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  modeBadge: {
    fontSize: 11,
    fontWeight: 600,
    color: '#4f6ef7',
    background: 'rgba(79,110,247,0.12)',
    border: '1px solid rgba(79,110,247,0.25)',
    padding: '3px 8px',
    borderRadius: 4,
    letterSpacing: '0.2px',
  },
  settingsBtn: {
    background: 'transparent',
    border: 'none',
    color: '#4a4d6a',
    cursor: 'pointer',
    padding: 6,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.15s',
  },

  error: {
    background: 'rgba(220,38,38,0.1)',
    border: '1px solid rgba(220,38,38,0.3)',
    color: '#f87171',
    padding: '12px 16px',
    borderRadius: 10,
    fontSize: 13,
    marginBottom: 20,
  },

  imageWrap: {
    position: 'relative',
    borderRadius: 14,
    overflow: 'hidden',
    background: '#13152b',
    marginBottom: 28,
  },
  image: { width: '100%', display: 'block' },
  loadingOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(12,13,26,0.65)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(2px)',
  },
  loadingPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#13152b',
    border: '1px solid #252845',
    padding: '10px 16px',
    borderRadius: 99,
    fontSize: 13,
    color: '#e8e9f0',
    fontWeight: 500,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#4f6ef7',
    display: 'inline-block',
    animation: 'pulse-dot 1.2s ease-in-out infinite',
    flexShrink: 0,
  },
  retakeBtn: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'rgba(12,13,26,0.8)',
    border: '1px solid #252845',
    color: '#e8e9f0',
    padding: '7px 12px',
    borderRadius: 99,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    backdropFilter: 'blur(8px)',
  },

  routesHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  routesTitle: { fontSize: 14, fontWeight: 600, color: '#e8e9f0' },
  routesPill: {
    fontSize: 11,
    fontWeight: 700,
    color: '#4f6ef7',
    background: 'rgba(79,110,247,0.12)',
    border: '1px solid rgba(79,110,247,0.2)',
    padding: '2px 8px',
    borderRadius: 99,
  },

  // Settings modal
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: 24,
    backdropFilter: 'blur(4px)',
  },
  modal: {
    background: '#13152b',
    border: '1px solid #252845',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: { fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#e8e9f0' },
  modalHint: { fontSize: 13, color: '#4a4d6a', marginBottom: 16, lineHeight: 1.5 },
  modalInput: {
    width: '100%',
    background: '#0c0d1a',
    border: '1px solid #252845',
    color: '#e8e9f0',
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 16,
    outline: 'none',
    fontFamily: 'monospace',
  },
  modalActions: { display: 'flex', gap: 10 },
};
