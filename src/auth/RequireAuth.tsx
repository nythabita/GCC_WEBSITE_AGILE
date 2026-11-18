import { Fragment, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { safeReturnTo } from '../../shared/auth';
import { useAuth } from './AuthContext';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading, error } = useAuth();
  const location = useLocation();
  if (loading) return <main className="page-container py-16" role="status">Memeriksa sesi login…</main>;
  if (error) return <main className="page-container py-16"><p role="alert">{error}</p><button type="button" className="mt-4 underline" onClick={() => window.location.reload()}>Coba lagi</button></main>;
  if (!session) return <Navigate to={`/login?next=${encodeURIComponent(safeReturnTo(location.pathname))}`} replace />;
  // Never retain one account's form answers when a different account signs in in another tab.
  return <Fragment key={session.user.id}>{children}</Fragment>;
}
