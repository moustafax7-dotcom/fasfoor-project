import KitchenOrderCard from './KitchenOrderCard.jsx';
const columnIcons = { new: '🛒', preparing: '🍲', ready: '✅' };
const KitchenColumn = ({ title, status, orders, onAdvance }) => (
  <div className={`kitchen-column col-${status}`}>
    <div className="kitchen-column-header"><span className="kitchen-count">{orders.length}</span><span>{title}</span><span className="kitchen-col-icon">{columnIcons[status]}</span></div>
    <div className="kitchen-column-body">
      {orders.map((o) => <KitchenOrderCard key={o._id} order={o} onAdvance={onAdvance} />)}
      {!orders.length && <p className="kitchen-col-empty">لا يوجد طلبات</p>}
    </div>
  </div>
);
export default KitchenColumn;
