import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import TransactionTable from '../components/TransactionTable';

export default function Transactions() {
  const { username } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userRes = await api.get(`/users/username/${username}`);
        const uid = userRes.data.id;
        const res = await api.get(`/transactions/user/${uid}`);
        const sorted = res.data.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
        setTransactions(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if(username) fetchTransactions();
  }, [username]);

  return (
    <div>
      <h1 className="page-title">Transaction History</h1>
      {loading ? <div>Loading...</div> : <TransactionTable transactions={transactions} />}
    </div>
  );
}
