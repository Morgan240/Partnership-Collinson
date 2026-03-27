import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../simulator.css';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Already authenticated — redirect
  if (isAuthenticated) {
    navigate('/LMS/waitlist', { replace: true });
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/LMS/waitlist', { replace: true });
    }
  };

  return (
    <div className="sim-login">
      <div className="sim-login__card">
        <div className="sim-login__logo">
          <span style={{ fontSize: 28, marginRight: 8 }}>◇</span>
          Collinson
        </div>
        <div className="sim-login__subtitle">PriModel Simulator</div>

        <form onSubmit={handleSubmit}>
          <div className="sim-login__field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="sim-login__field">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--lms-text-light)',
                  fontSize: 14,
                }}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <button type="submit" className="sim-login__btn" disabled={!username || !password}>
            Sign In
          </button>

          {error && <div className="sim-login__error">{error}</div>}
        </form>
      </div>
    </div>
  );
};
