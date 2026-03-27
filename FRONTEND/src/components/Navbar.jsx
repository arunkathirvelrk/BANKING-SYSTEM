import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        Welcome Back
      </div>
      <div className="user-profile">
        <div className="avatar">
          {username ? username.charAt(0).toUpperCase() : <User size={20} />}
        </div>
        <span style={{ fontWeight: 500 }}>{username}</span>
        <button className="btn-secondary" onClick={handleLogout} style={{ padding: '6px 10px', marginLeft: '12px' }}>
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
}
