const RepsTable = ({ reps = [], onEdit, onToggleStatus }) => (
  <table className="admin-table">
    <thead><tr><th>#</th><th>المندوب</th><th>رقم الهاتف</th><th>الفرع</th><th>الحالة الحالية</th><th>الطلبات النشطة</th><th>متوسط وقت التوصيل</th><th>إجراءات</th></tr></thead>
    <tbody>
      {reps.map((rep, i) => (
        <tr key={rep._id}>
          <td>{i + 1}</td><td>{rep.name}</td><td>{rep.phone}</td><td>{rep.branch?.name}</td>
          <td>
            <select value={rep.status} onChange={(e) => onToggleStatus(rep, e.target.value)}>
              <option value="available">متاح</option><option value="delivering">في توصيل</option><option value="offline">غير متصل</option>
            </select>
          </td>
          <td>{rep.activeOrders ?? 0}</td><td>{rep.avgDeliveryMinutes} دقيقة</td>
          <td><button className="edit-btn" onClick={() => onEdit(rep)}>✎</button></td>
        </tr>
      ))}
      {!reps.length && <tr><td colSpan="8" className="menu-empty">لا يوجد مندوبين مسجلين</td></tr>}
    </tbody>
  </table>
);
export default RepsTable;
