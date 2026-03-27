export default function AccountCard({ account }) {
  return (
    <div className="account-card glass-panel">
      <div className="acc-type">{account.accountType}</div>
      <div className="acc-number">{account.accountNumber}</div>
      <div className="acc-balance">${account.balance.toFixed(2)}</div>
    </div>
  );
}
