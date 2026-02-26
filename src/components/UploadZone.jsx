import { useRef, useState } from 'react';

export default function UploadZone({ onFile }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target.result;
      const base64 = dataUrl.split(',')[1];
      onFile({ base64, mediaType: file.type, dataUrl });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div
      style={{ ...styles.zone, ...(dragging ? styles.zoneDrag : {}) }}
      onClick={() => inputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
    >
      <div style={styles.icon}>📸</div>
      <p style={styles.primary}><strong>Upload a wall photo</strong></p>
      <p style={styles.secondary}>Drag & drop or click to browse</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files[0])}
      />
    </div>
  );
}

const styles = {
  zone: {
    border: '2px dashed #2a2a2a',
    borderRadius: 12,
    padding: 48,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.2s, background 0.2s',
    marginBottom: 28,
  },
  zoneDrag: {
    borderColor: '#555',
    background: '#161616',
  },
  icon: { fontSize: 32, marginBottom: 12 },
  primary: { color: '#ccc', fontSize: 14, marginBottom: 4 },
  secondary: { color: '#888', fontSize: 14 },
};
