import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage({ onBack, onLoginSuccess }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password!');
      return;
    }

    setLoading(true);
    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      if (onLoginSuccess) onLoginSuccess();
    } else {
      setError(result.message || 'Invalid credentials! Please try again.');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    background: 'rgba(15, 23, 42, 0.6)',
    color: '#fff',
    fontSize: '14.5px',
    outline: 'none',
    transition: 'all 0.25s ease',
    boxSizing: 'border-box'
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'radial-gradient(ellipse at top, #0f172a 0%, #070b14 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glow accents */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(255, 107, 53, 0.15) 0%, rgba(97, 218, 255, 0.08) 40%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }}></div>

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '440px',
        zIndex: 1
      }}>
        {/* Back link */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={onBack}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-sub)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 0',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-sub)'}
          >
            ← Back to Portfolio
          </button>
        </div>

        {/* Card */}
        <div className="glass-card" style={{
          padding: '40px 32px',
          borderRadius: '20px',
          background: 'rgba(11, 16, 30, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(255, 107, 53, 0.15)',
          backdropFilter: 'blur(20px)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 16px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff6b35 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(255, 107, 53, 0.35)',
              overflow: 'hidden'
            }}>
              <img
                src="/mar.jpg"
                alt="Admin"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = '/mar.png'; }}
              />
            </div>
            <h1 style={{
              fontSize: '26px',
              fontWeight: '800',
              color: '#ffffff',
              margin: '0 0 6px 0',
              letterSpacing: '0.2px'
            }}>
              Admin <span style={{ color: '#ff6b35' }}>Portal</span>
            </h1>
            <p style={{
              color: 'var(--text-sub)',
              fontSize: '13.5px',
              margin: 0,
              lineHeight: '1.5'
            }}>
              Sign in to manage projects, certificates, and portfolio content.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#fca5a5',
              fontSize: '13.5px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '13px',
                fontWeight: '700',
                color: '#e2e8f0',
                letterSpacing: '0.3px'
              }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                autoComplete="username"
                required
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '13px',
                fontWeight: '700',
                color: '#e2e8f0',
                letterSpacing: '0.3px'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  required
                  style={{ ...inputStyle, paddingRight: '70px' }}
                  onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    padding: '4px 6px'
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                marginTop: '10px',
                width: '100%',
                justifyContent: 'center',
                padding: '14px',
                fontSize: '15px',
                fontWeight: '700',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%)',
                boxShadow: '0 4px 20px rgba(255, 107, 53, 0.4)',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Footer note */}
          <div style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-sub)',
              margin: 0
            }}>
              🔒 Protected Admin Area • Authorized Access Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
