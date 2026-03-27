import { Bell, ShieldAlert, CheckCircle } from 'lucide-react';

export default function NotificationList({ notifications, onRead }) {
  return (
    <div className="glass-panel" style={{ overflow: 'hidden' }}>
      {notifications.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No notifications to show.
        </div>
      ) : (
        notifications.map(n => (
          <div key={n.id} className={`notification-item ${n.read ? '' : 'unread'}`} onClick={() => !n.read && onRead(n.id)}>
            <div className={`notif-icon ${n.type === 'FRAUD_ALERT' ? 'fraud' : 'txn'}`}>
              {n.type === 'FRAUD_ALERT' ? <ShieldAlert size={20} /> : <CheckCircle size={20} />}
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>{n.type.replace('_', ' ')}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{n.message}</div>
              <div style={{ fontSize: '0.75rem', marginTop: '8px', color: 'var(--text-secondary)' }}>
                {new Date(n.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
