const statusLabels = { active: 'نشط', scheduled: 'مجدول', expired: 'منتهي', paused: 'متوقف' };
const statusClass = { active: 'badge-green', scheduled: 'badge-blue', expired: 'badge-gray', paused: 'badge-orange' };
const CouponsTable = ({ coupons = [], onEdit, onTogglePause, onDelete }) => (
  <table className="admin-table">
    <thead><tr><th>الكود</th><th>نوع الخصم</th><th>القيمة</th><th>الفرع</th><th>الاستخدامات</th><th>البداية</th><th>النهاية</th><th>الحالة</th><th>إجراءات</th></tr></thead>
    <tbody>
      {coupons.map((c) => (
        <tr key={c._id}>
          <td><strong className="coupon-code">{c.code}</strong></td>
          <td>{c.discountType === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}</td>
          <td>{c.discountType === 'percentage' ? `${c.value}%` : `${c.value} جنيه`}</td>
          <td>{c.branches?.length ? c.branches.map((b) => b.name).join('، ') : 'كل الفروع'}</td>
          <td>{c.usageCount} / {c.usageLimit}</td>
          <td className="table-muted">{new Date(c.startDate).toLocaleDateString('ar-EG')}</td>
          <td className="table-muted">{new Date(c.endDate).toLocaleDateString('ar-EG')}</td>
          <td><span className={`badge ${statusClass[c.status]}`}>{statusLabels[c.status]}</span></td>
          <td className="table-actions">
            <button onClick={() => onTogglePause(c)}>{c.isActive ? '⏸ إيقاف' : '▶ تفعيل'}</button>
            <button onClick={() => onEdit(c)}>✎</button>
            <button onClick={() => onDelete(c._id)}>🗑</button>
          </td>
        </tr>
      ))}
      {!coupons.length && <tr><td colSpan="9" className="menu-empty">لا توجد كوبونات</td></tr>}
    </tbody>
  </table>
);
export default CouponsTable;
