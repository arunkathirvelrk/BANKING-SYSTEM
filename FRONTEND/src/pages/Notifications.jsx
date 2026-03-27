import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import NotificationList from '../components/NotificationList';

export default function Notifications() {
  const { username } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async (uid) => {
    try {
      const res = await api.get(`/notifications/user/${uid}`);
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (username) {
        try {
          const userRes = await api.get(`/users/username/${username}`);
          fetchNotifs(userRes.data.id);
        } catch(err) {}
      }
    };
    init();
  }, [username]);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="page-title">Notifications</h1>
      {loading ? <div>Loading...</div> : <NotificationList notifications={notifications} onRead={markAsRead} />}
    </div>
  );
}
