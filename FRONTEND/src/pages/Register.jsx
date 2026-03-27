import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '', email: '', firstName: '', lastName: '', phoneNumber: '', password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      await api.post('/users', {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber
      });

      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel" style={{ maxWidth: '500px' }}>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join NovaBank for secure banking.</p>
        
        {error && <div className="text-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="flex-between" style={{ gap: '16px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="label">First Name</label>
              <input className="input-field" type="text" name="firstName" onChange={handleChange} required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="label">Last Name</label>
              <input className="input-field" type="text" name="lastName" onChange={handleChange} required />
            </div>
          </div>
          
          <div className="flex-between" style={{ gap: '16px' }}>
             <div className="form-group" style={{ flex: 1 }}>
                <label className="label">Username</label>
                <input className="input-field" type="text" name="username" onChange={handleChange} required />
             </div>
             <div className="form-group" style={{ flex: 1 }}>
                <label className="label">Phone</label>
                <input className="input-field" type="text" name="phoneNumber" onChange={handleChange} required />
             </div>
          </div>
          
          <div className="form-group">
            <label className="label">Email Address</label>
            <input className="input-field" type="email" name="email" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input className="input-field" type="password" name="password" onChange={handleChange} required />
          </div>
          
          <button className="btn-primary" style={{ width: '100%', marginTop: '16px' }} type="submit">Complete Registration</button>
        </form>
        
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
