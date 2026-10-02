const statusLabels = { new: 'جديد', preparing: 'قيد التحضير', ready: 'جاهز', out_for_delivery: 'جاري التوصيل', delivered: 'تم الاستلام', cancelled: 'ملغي' };
const RecentOrdersTable = ({ orders = [] }) => (
  <div className="recent-orders">
    <h3>أحدث الطلبات الحالية</h3>
    <table>
      <thead><tr><th>رقم الطلب</th><th>الفرع</th><th>العميل</th><th>الوقت</th><th>الحالة</th><th>الإجمالي</th></tr></thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o._id}>
            <td className="order-id">#{o.orderNumber}</td><td>{o.branch?.name}</td><td>{o.customer?.name}</td>
            <td>{new Date(o.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</td>
            <td><span className={`order-status status-${o.status}`}>{statusLabels[o.status]}</span></td>
            <td>{o.total} ج</td>
          </tr>
        ))}
      </tbody>
    </table>
    {!orders.length && <p className="menu-empty">لا يوجد طلبات حاليًا</p>}
  </div>
);
export default RecentOrdersTable;
