import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, Send, History, Bell } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="nav-brand" style={{ padding: '0 24px', marginBottom: '32px', fontSize: '1.5rem' }}>
        <Wallet size={28} />
        NovaBank
      </div>
      
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
        <LayoutDashboard size={20} /> Dashboard
      </NavLink>
      <NavLink to="/accounts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Wallet size={20} /> Accounts
      </NavLink>
      <NavLink to="/transfer" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Send size={20} /> Transfer
      </NavLink>
      <NavLink to="/transactions" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <History size={20} /> Transactions
      </NavLink>
      <NavLink to="/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Bell size={20} /> Notifications
      </NavLink>
    </div>
  );
}
