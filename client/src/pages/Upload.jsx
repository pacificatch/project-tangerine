import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import './Upload.css';

const WORKER_URL = 'https://tangerine-worker.pacificatch.workers.dev';

function Upload() {
  const [authState, setAuthState] = useState('locked'); // 'locked' | 'authenticated'
  const [authPassword, setAuthPassword] = useState('');
  const [authChecking, setAuthChecking] = useState(false);
  const [authError, setAuthError] = useState(false);

  const [preview, setPreview] = useState([]);
  const [level, setLevel] = useState(1);
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState(null); // null | 'uploading' | 'success' | 'error'
  const [result, setResult] = useState(null);
  const fileRef = useRef();

  async function handleAuthSubmit(e) {
    e.preventDefault();
    if (!authPassword.trim()) {
      setAuthError(true);
      return;
    }
    setAuthChecking(true);
    setAuthError(false);
    try {
      const res = await fetch(`${WORKER_URL}/api/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: authPassword }),
      });
      const data = await res.json();
      if (data.authenticated) {
        setAuthState('authenticated');
      } else {
        setAuthError(true);
      }
    } catch {
      setAuthError(true);
    } finally {
      setAuthChecking(false);
    }
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setStatus(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: 'binary' });
      const sheetName = wb.SheetNames.includes('learn') ? 'learn' : wb.SheetNames[0];
      const sheet = wb.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const normalized = rows.map(row => ({
        traditional: (row['Traditional'] || '').trim(),
        simplified: (row['Simplified'] || '').trim(),
        pinyin: (row['Pinyin'] || '').trim(),
        part_of_speech: (row['Part of Speech'] || '').trim(),
        definition: (row['Definition'] || '').trim(),
        lesson: parseInt(row['Lesson']) || 0,
      })).filter(r => r.traditional && r.pinyin && r.definition && r.lesson);

      setPreview(normalized);
    };
    reader.readAsBinaryString(file);
  }

  async function handleUpload() {
    if (preview.length === 0) return;
    setStatus('uploading');

    try {
      const response = await fetch(`${WORKER_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: preview, level }),
      });

      const data = await response.json();
      setResult(data);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setResult({ error: err.message });
    }
  }

  function handleReset() {
    setPreview([]);
    setFileName('');
    setStatus(null);
    setResult(null);
    fileRef.current.value = '';
  }

  return (
    <div className="upload-page">
      <h2>Upload Vocabulary</h2>
      <p className="upload-subtitle">Upload your Integrated Chinese Excel or CSV file to import vocabulary into the database.</p>

      {authState === 'locked' && (
        <div className="upload-auth-gate">
          <p className="upload-auth-label">Password required to upload vocabulary.</p>
          <form className="upload-auth-form" onSubmit={handleAuthSubmit}>
            <input
              type="password"
              placeholder="Enter password"
              value={authPassword}
              onChange={e => setAuthPassword(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn-primary" disabled={authChecking}>
              {authChecking ? 'Checking...' : 'Unlock'}
            </button>
          </form>
          {authError && (
            <p className="upload-auth-error">Incorrect password. Upload is disabled.</p>
          )}
        </div>
      )}

      {authState === 'authenticated' && (
        <div className="auth-banner">Authenticated — upload is enabled</div>
      )}

      <div className="upload-controls">
        <div className="upload-field">
          <label>Level</label>
          <select value={level} onChange={e => setLevel(parseInt(e.target.value))}>
            <option value={1}>Level 1</option>
            <option value={2}>Level 2</option>
            <option value={3}>Level 3</option>
            <option value={4}>Level 4</option>
          </select>
        </div>

        <div className="upload-field">
          <label>File (Excel or CSV)</label>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFile}
            ref={fileRef}
          />
        </div>
      </div>

      {preview.length > 0 && status !== 'success' && (
        <div className="preview">
          <div className="preview-header">
            <span>Preview — {preview.length} words from <strong>{fileName}</strong></span>
            <button className="btn-secondary" onClick={handleReset}>Clear</button>
          </div>

          <table className="vocab-table">
            <thead>
              <tr>
                <th>Lesson</th>
                <th>Traditional</th>
                <th>Simplified</th>
                <th>Pinyin</th>
                <th>Part of Speech</th>
                <th>Definition</th>
              </tr>
            </thead>
            <tbody>
              {preview.slice(0, 10).map((row, i) => (
                <tr key={i}>
                  <td>{row.lesson}</td>
                  <td className="chinese">{row.traditional}</td>
                  <td className="chinese">{row.simplified}</td>
                  <td>{row.pinyin}</td>
                  <td>{row.part_of_speech}</td>
                  <td>{row.definition}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {preview.length > 10 && (
            <p className="preview-more">...and {preview.length - 10} more rows</p>
          )}

          <button
            className="btn-primary"
            onClick={handleUpload}
            disabled={status === 'uploading' || authState === 'locked'}
            title={authState === 'locked' ? 'Enter password to enable upload' : undefined}
          >
            {status === 'uploading' ? 'Uploading...' : `Import ${preview.length} words into database`}
          </button>
          {authState === 'locked' && (
            <p className="upload-locked-note">Enter the password above to enable import.</p>
          )}
        </div>
      )}

      {status === 'success' && result && (
        <div className="upload-result success">
          <h3>Import Complete</h3>
          <p>Inserted: <strong>{result.inserted}</strong> new words</p>
          <p>Skipped: <strong>{result.skipped}</strong> (already exist or incomplete)</p>
          <button className="btn-secondary" onClick={handleReset}>Upload another file</button>
        </div>
      )}

      {status === 'error' && (
        <div className="upload-result error">
          <h3>Upload failed</h3>
          <p>{result?.error || 'Something went wrong. Please try again.'}</p>
          <button className="btn-secondary" onClick={handleReset}>Try again</button>
        </div>
      )}
    </div>
  );
}

export default Upload;
