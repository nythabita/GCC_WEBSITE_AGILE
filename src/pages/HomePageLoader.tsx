import { useEffect, useState } from 'react';
import type { HomepageContent } from '../../shared/homepage';
import { validateHomepage } from '../../shared/homepage-validation';
import { useAuth } from '../auth/AuthContext';
import HomePage from './HomePage';

export default function HomePageLoader() {
  const { services, error: configError, loading: authLoading } = useAuth();
  const [content, setContent] = useState<HomepageContent | null>(null);
  const [error, setError] = useState(''); const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!services) return;
    let alive = true;
    void services.api.request('homepage_content?id=eq.home&select=id,content,updated_at').then(rows => {
      if (!Array.isArray(rows) || rows.length !== 1 || rows[0].id !== 'home') throw new Error('Konten homepage belum tersedia.');
      const validated = validateHomepage(rows[0].content); if (alive) setContent(validated);
    }).catch(() => { if (alive) setError('Konten homepage belum dapat dimuat. Silakan coba kembali.'); });
    return () => { alive = false; };
  }, [services, attempt]);
  if (content) return <HomePage content={content} />;
  if (error || configError) return <main className="page-container py-16"><h1 className="font-display text-3xl">Growth Consulting Club</h1><p className="mt-4" role="alert">{error || configError}</p><button type="button" onClick={() => { if (services) {setError('');setContent(null);setAttempt(x => x + 1);} else window.location.reload(); }} className="mt-5 min-h-11 underline">Coba lagi</button></main>;
  return <main className="page-container py-16"><h1 className="font-display text-3xl">Growth Consulting Club</h1><p role="status" className="mt-4">{authLoading ? 'Menyiapkan layanan…' : 'Memuat homepage…'}</p></main>;
}
