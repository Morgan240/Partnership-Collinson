import React from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import collinsonLogo from '../../assets/CIL-Logo-white-transparent.svg';
import '../simulator.css';

export const SimulatorLayout: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/LMS/login" replace />;
  }

  const is3D = location.pathname === '/LMS/waitlist';
  const is4D = location.pathname === '/LMS/waitlist4d';
  const isAbout = location.pathname === '/LMS/about';
  const isBenchmark = location.pathname === '/LMS/benchmark';

  return (
    <div className="sim-shell">
      {/* Top Nav */}
      <header className="sim-topnav">
        <div className="sim-topnav__logo">
          <img src={collinsonLogo} alt="Collinson" className="sim-topnav__logo-img" />
          <span className="sim-topnav__title">PriModel Simulator</span>
        </div>
        <div className="sim-topnav__right">
          <button className="sim-logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="sim-sidebar">
        <div
          className={`sim-sidebar__item ${is3D ? 'sim-sidebar__item--active' : ''}`}
          title="Simulação 3D"
          onClick={() => navigate('/LMS/waitlist')}
          style={{ cursor: 'pointer' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span className="sim-sidebar__label">3D</span>
        </div>
        <div
          className={`sim-sidebar__item ${is4D ? 'sim-sidebar__item--active' : ''}`}
          title="Simulação 4D"
          onClick={() => navigate('/LMS/waitlist4d')}
          style={{ cursor: 'pointer' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          <span className="sim-sidebar__label">4D</span>
        </div>
        <div
          className={`sim-sidebar__item ${isAbout ? 'sim-sidebar__item--active' : ''}`}
          title="PriModel Overview"
          onClick={() => navigate('/LMS/about')}
          style={{ cursor: 'pointer' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span className="sim-sidebar__label">About</span>
        </div>
        <div
          className={`sim-sidebar__item ${isBenchmark ? 'sim-sidebar__item--active' : ''}`}
          title="Cross-Industry Benchmark"
          onClick={() => navigate('/LMS/benchmark')}
          style={{ cursor: 'pointer' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span className="sim-sidebar__label">Bench</span>
        </div>
        <div className="sim-sidebar__item" title="Settings">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </div>
      </aside>

      {/* Content */}
      <main className="sim-content">
        <Outlet />
      </main>
    </div>
  );
};
