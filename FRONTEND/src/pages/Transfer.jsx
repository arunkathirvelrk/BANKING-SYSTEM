import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Transfer() {
  const { username } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    sourceAccount: '',
    targetAccount: '',
    amount: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchAccs = async () => {
      try {
        const userRes = await api.get(`/users/username/${username}`);
        const uid = userRes.data.id;
        setUserId(uid);
        const accRes = await api.get(`/accounts/user/${uid}`);
        setAccounts(accRes.data);
        if(accRes.data.length > 0) {
          setFormData(prev => ({...prev, sourceAccount: accRes.data[0].accountNumber}));
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (username) fetchAccs();
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      const res = await api.post('/transactions/transfer', {
        userId: userId,
        sourceAccountNumber: formData.sourceAccount,
        targetAccountNumber: formData.targetAccount,
        amount: parseFloat(formData.amount)
      });
      
      if (res.data.status === 'COMPLETED') {
        setStatus({ type: 'success', message: 'Transfer completed successfully!' });
        setFormData(prev => ({...prev, targetAccount: '', amount: ''}));
      } else if (res.data.status === 'FLAGGED') {
        setStatus({ type: 'danger', message: 'Transaction flagged for fraud: ' + res.data.reason });
      } else {
        setStatus({ type: 'danger', message: 'Transaction failed: ' + res.data.reason });
      }
    } catch (err) {
      setStatus({ type: 'danger', message: err.response?.data?.message || 'Transfer failed' });
    }
  };

  return (
    <div>
      <h1 className="page-title">Transfer Funds</h1>
      <div className="glass-panel" style={{ maxWidth: '600px', padding: '32px' }}>
        {status.message && (
          <div className={status.type === 'success' ? 'text-success' : 'text-danger'}>
            {status.message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">From Account</label>
            <select className="input-field" value={formData.sourceAccount} onChange={e => setFormData({...formData, sourceAccount: e.target.value})} required>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.accountNumber}>
                  {acc.accountType} - {acc.accountNumber} (${acc.balance.toFixed(2)})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="label">To Account Number</label>
            <input className="input-field" type="text" placeholder="Target Account Number" value={formData.targetAccount} onChange={e => setFormData({...formData, targetAccount: e.target.value})} required />
          </div>
          <div className="form-group">
            <label className="label">Amount ($)</label>
            <input className="input-field" type="number" step="0.01" min="0.01" placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
          </div>
          <button className="btn-primary" type="submit" style={{ width: '100%', marginTop: '16px' }}>Send Money</button>
        </form>
      </div>
    </div>
  );
}
