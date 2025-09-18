'use client';
import { useState } from 'react';

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://127.0.0.1:5000';

type Match = {
  id?: string | number;
  title?: string;
  price?: number | string;
  category?: string;
  url?: string;
  [k: string]: any;
};

export default function Home() {
  const [email, setEmail] = useState('');
  const [cats, setCats] = useState('eggs,snacks');
  const [keys, setKeys] = useState('kirkland');
  const [saving, setSaving] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function saveAndPreview() {
    setError(null);
    if (!email.trim()) {
      setError('Please enter an email first.');
      return;
    }
    setSaving(true);
    try {
      const body = {
        email: email.trim(),
        categories: cats.split(',').map(s => s.trim()).filter(Boolean),
        keywords: keys.split(',').map(s => s.trim()).filter(Boolean),
      };
      const r1 = await fetch(`${BASE}/api/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!r1.ok) throw new Error(`Save failed (${r1.status})`);

      setLoadingMatches(true);
      const r2 = await fetch(`${BASE}/api/alerts/preview?email=${encodeURIComponent(email)}`, { cache: 'no-store' });
      if (!r2.ok) throw new Error(`Preview failed (${r2.status})`);
      const data = await r2.json();
      setMatches(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || 'Something went wrong.');
    } finally {
      setSaving(false);
      setLoadingMatches(false);
    }
  }

  return (
    <main style={{ padding: 24, maxWidth: 960, margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1>Prismo</h1>
      <p>One trip. Less waste. More savings.</p>

      {/* Preferences */}
      <section style={{ marginTop: 24, padding: 16, border: '1px solid #eee', borderRadius: 12 }}>
        <h2 style={{ marginTop: 0 }}>Your Preferences</h2>

        <div style={{ display: 'grid', gap: 12 }}>
          <label>
            <div style={{ fontSize: 14, color: '#444' }}>Email</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 8 }}
            />
          </label>

          <label>
            <div style={{ fontSize: 14, color: '#444' }}>Categories (comma-separated)</div>
            <input
              value={cats}
              onChange={(e) => setCats(e.target.value)}
              placeholder="eggs,snacks,beverages"
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 8 }}
            />
          </label>

          <label>
            <div style={{ fontSize: 14, color: '#444' }}>Keywords (comma-separated)</div>
            <input
              value={keys}
              onChange={(e) => setKeys(e.target.value)}
              placeholder="kirkland,protein"
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 8 }}
            />
          </label>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={saveAndPreview}
              disabled={saving}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid #ddd',
                background: saving ? '#f2f2f2' : '#fff',
                cursor: saving ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? 'Saving…' : 'Save & Preview'}
            </button>
            <span style={{ fontSize: 12, color: '#777' }}>
              API: <code>{BASE}</code>
            </span>
          </div>

          {error && (
            <div style={{ color: '#b00020', fontSize: 14 }}>
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Matches */}
      <section style={{ marginTop: 32 }}>
        <h2>Sale Matches</h2>

        {loadingMatches && <div style={{ fontSize: 14, color: '#555' }}>Fetching matches…</div>}

        {!loadingMatches && matches.length === 0 && (
          <div style={{ fontSize: 14, color: '#777' }}>
            No matches yet. Save your preferences to see items that match.
          </div>
        )}

        {/* Grid scaffold */}
        <div
          style={{
            marginTop: 16,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 12,
          }}
        >
          {matches.map((m, i) => (
            <article key={m.id ?? i} style={{ border: '1px solid #eee', borderRadius: 12, padding: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>{m.title ?? 'Untitled item'}</div>
              <div style={{ fontSize: 13, color: '#555' }}>
                {m.category ? <span>{m.category}</span> : <span>—</span>}
                {m.price ? <span style={{ marginLeft: 8 }}>${m.price}</span> : null}
              </div>
              {m.url && (
                <a href={m.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, marginTop: 8, display: 'inline-block' }}>
                  View
                </a>
              )}
              {/* Debugging, remove later*/}
              <pre style={{ marginTop: 8, background: '#fafafa', padding: 8, borderRadius: 8, fontSize: 12, overflowX: 'auto' }}>
                {JSON.stringify(m, null, 2)}
              </pre>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
