export default function TransactionTable({ transactions }) {
  return (
    <div className="glass-panel" style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Source</th>
            <th>Target</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id}>
              <td>{new Date(t.timestamp).toLocaleString()}</td>
              <td>{t.sourceAccountNumber}</td>
              <td>{t.targetAccountNumber}</td>
              <td style={{ fontWeight: 600 }}>${t.amount.toFixed(2)}</td>
              <td>
                <span className={`status-badge status-${t.status.toLowerCase()}`}>
                  {t.status}
                </span>
                {t.reason && t.status !== 'COMPLETED' && <div style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--text-secondary)' }}>{t.reason}</div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
