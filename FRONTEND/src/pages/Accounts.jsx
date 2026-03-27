import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AccountCard from '../components/AccountCard';

export default function Accounts() {
  const { username } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [accountType, setAccountType] = useState('SAVINGS');

  const fetchAccounts = async () => {
    try {
      const userRes = await api.get(`/users/username/${username}`);
      const uid = userRes.data.id;
      setUserId(uid);
      const accRes = await api.get(`/accounts/user/${uid}`);
      setAccounts(accRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) fetchAccounts();
  }, [username]);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      await api.post('/accounts', { userId, accountType });
      setIsCreating(false);
      fetchAccounts();
    } catch (err) {
      alert("Failed to create account");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex-between">
        <h1 className="page-title">Accounts</h1>
        <button className="btn-primary" onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? 'Cancel' : 'Open New Account'}
        </button>
      </div>

      {isCreating && (
        <div className="glass-panel mb-4" style={{ padding: '24px', maxWidth: '400px' }}>
          <h3>Open New Account</h3>
          <form onSubmit={handleCreateAccount} className="mt-4">
            <div className="form-group">
              <label className="label">Account Type</label>
              <select className="input-field" value={accountType} onChange={e => setAccountType(e.target.value)}>
                <option value="SAVINGS">Savings</option>
                <option value="CURRENT">Current</option>
                <option value="SALARY">Salary</option>
              </select>
            </div>
            <button className="btn-primary" type="submit">Create</button>
          </form>
        </div>
      )}

      <div className="grid-cards">
        {accounts.map(acc => <AccountCard key={acc.id} account={acc} />)}
      </div>
    </div>
  );
}
