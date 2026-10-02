const BranchStatusCard = ({ branch, stats }) => (
  <div className="branch-status-card">
    <div className="branch-status-header"><h4>{branch.name}</h4><span className={branch.isOpen ? 'open-dot' : 'closed-dot'}>{branch.isOpen ? 'مفتوح الآن' : 'مغلق'}</span></div>
    <div className="branch-status-grid">
      <div><span>الطلبات اليوم</span><strong>{stats?.ordersToday ?? '—'}</strong></div>
      <div><span>الإيرادات اليوم</span><strong>{stats?.revenueToday ?? '—'} ج</strong></div>
      <div><span>متوسط وقت التحضير</span><strong>{branch.estimatedDeliveryMinutes} دقيقة</strong></div>
    </div>
  </div>
);
export default BranchStatusCard;
