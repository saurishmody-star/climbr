import { useRef, useState } from 'react';

export default function UploadZone({ onFile }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target.result;
      onFile({ base64: dataUrl.split(',')[1], mediaType: file.type, dataUrl });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div
      className={`upload-zone${dragging ? ' drag-over' : ''}`}
      onClick={() => inputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
    >
      <div style={styles.icon}>📸</div>
      <p style={styles.primary}>Photo a wall section</p>
      <p style={styles.secondary}>Tap to browse or drag & drop</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={e => handleFile(e.target.files[0])}
      />
    </div>
  );
}

const styles = {
  icon: { fontSize: 36, marginBottom: 14 },
  primary: { fontSize: 15, fontWeight: 600, color: '#e8e9f0', marginBottom: 6 },
  secondary: { fontSize: 13, color: '#4a4d6a', marginBottom: 0 },
};
