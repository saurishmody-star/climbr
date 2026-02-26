import { useState, useRef } from 'react';
import './App.css';
import UploadZone from './components/UploadZone';
import RouteCard from './components/RouteCard';
import { DEMO_ROUTES } from './lib/analyseWall';

export default function App() {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState(null); // null | 'loading' | 'done'
  const [routes, setRoutes] = useState([]);
  const fileInputRef = useRef();

  async function handleFile(img) {
    setImage(img);
    setRoutes([]);
    setStatus('loading');
    // Simulate AI analysis — in production this calls a backend
    setTimeout(() => { setRoutes(DEMO_ROUTES); setStatus('done'); }, 1400);
  }

  function retake() {
    setImage(null);
    setRoutes([]);
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
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>climbr</span>
          <span style={styles.modeBadge}>Manager Mode</span>
        </div>
      </header>

      <main className="main-container">
        {/* Upload or image preview */}
        {!image ? (
          <UploadZone onFile={handleFile} />
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

  imageWrap: {
    position: 'relative',
    borderRadius: 14,
    overflow: 'hidden',
    lineHeight: 0,
    marginBottom: 28,
  },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
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
};
