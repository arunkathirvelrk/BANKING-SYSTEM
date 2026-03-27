import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Transfer from './pages/Transfer';
import Transactions from './pages/Transactions';
import Notifications from './pages/Notifications';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <PrivateRoute>
              <AppLayout><Dashboard /></AppLayout>
            </PrivateRoute>
          } />
          <Route path="/accounts" element={
            <PrivateRoute>
              <AppLayout><Accounts /></AppLayout>
            </PrivateRoute>
          } />
          <Route path="/transfer" element={
            <PrivateRoute>
              <AppLayout><Transfer /></AppLayout>
            </PrivateRoute>
          } />
          <Route path="/transactions" element={
            <PrivateRoute>
              <AppLayout><Transactions /></AppLayout>
            </PrivateRoute>
          } />
          <Route path="/notifications" element={
            <PrivateRoute>
              <AppLayout><Notifications /></AppLayout>
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
