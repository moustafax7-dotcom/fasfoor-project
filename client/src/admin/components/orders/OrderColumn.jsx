import OrderAdminCard from './OrderAdminCard.jsx';
const OrderColumn = ({ title, status, count, orders, onUpdateStatus }) => (
  <div className="order-column">
    <div className={`order-column-header col-${status}`}><span className="col-count">{count}</span><span>{title}</span></div>
    <div className="order-column-body">
      {orders.map((o) => <OrderAdminCard key={o._id} order={o} onUpdateStatus={onUpdateStatus} />)}
      {!orders.length && <p className="col-empty">لا يوجد طلبات</p>}
    </div>
  </div>
);
export default OrderColumn;
