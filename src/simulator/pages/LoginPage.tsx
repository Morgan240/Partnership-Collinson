import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import collinsonLogoColor from '../../assets/CIL Logo 2.svg';
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
      <div className="sim-login__form-area">
        <div className="sim-login__logo">
          <img src={collinsonLogoColor} alt="Collinson" style={{ height: 60, width: 'auto' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="sim-login__field">
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              placeholder="Username"
            />
          </div>

          <div className="sim-login__field">
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Password"
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
                  fontSize: 13,
                  fontFamily: 'Roboto, sans-serif',
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" className="sim-login__btn" disabled={!username || !password}>
            Login
          </button>

          {error && <div className="sim-login__error">{error}</div>}
        </form>
      </div>
    </div>
  );
};
