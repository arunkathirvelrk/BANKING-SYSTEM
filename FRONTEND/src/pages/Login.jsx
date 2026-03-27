import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/token', { username, password });
      login(res.data.token, username);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to continue to NovaBank.</p>
        
        {error && <div className="text-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Username</label>
            <input className="input-field" type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input className="input-field" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="btn-primary" style={{ width: '100%' }} type="submit">Sign In</button>
        </form>
        
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.875rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>Register</Link>
        </div>
      </div>
    </div>
  );
}
