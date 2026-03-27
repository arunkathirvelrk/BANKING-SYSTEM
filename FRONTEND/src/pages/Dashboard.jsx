import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import AccountCard from '../components/AccountCard';
import TransactionTable from '../components/TransactionTable';

export default function Dashboard() {
  const { username } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get(`/users/username/${username}`);
        const userId = userRes.data.id;
        
        const [accRes, txnRes] = await Promise.all([
          api.get(`/accounts/user/${userId}`),
          api.get(`/transactions/user/${userId}`)
        ]);
        
        setAccounts(accRes.data);
        const sortedTxns = txnRes.data.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
        setTransactions(sortedTxns.slice(0, 5));
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchData();
  }, [username]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      
      <div style={{ marginBottom: '16px', fontWeight: 600 }}>Your Accounts</div>
      {accounts.length === 0 ? (
        <div className="glass-panel text-secondary" style={{ padding: '24px' }}>No accounts found. Create one to get started.</div>
      ) : (
        <div className="grid-cards">
          {accounts.map(acc => <AccountCard key={acc.id} account={acc} />)}
        </div>
      )}

      <div style={{ marginBottom: '16px', fontWeight: 600, marginTop: '32px' }}>Recent Transactions</div>
      {transactions.length === 0 ? (
        <div className="glass-panel text-secondary" style={{ padding: '24px' }}>No transactions yet.</div>
      ) : (
        <TransactionTable transactions={transactions} />
      )}
    </div>
  );
}
