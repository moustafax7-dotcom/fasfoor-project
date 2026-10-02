import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';

const DELIVERY_FEE = 15;

const CartSidebar = ({ branchOpen = true }) => {
  const { items, updateQuantity, removeItem, subtotal, meetsMinimumOrder, amountToReachMinimum, MINIMUM_ORDER_VALUE } = useCart();
  const navigate = useNavigate();
  const total = subtotal + (items.length ? DELIVERY_FEE : 0);
  const canCheckout = branchOpen && meetsMinimumOrder;

  return (
    <aside className="cart-sidebar">
      <h3>سلة الطلب</h3>
      {!items.length && <p className="cart-empty">السلة فارغة، ابدأ بإضافة أصناف</p>}
      <div className="cart-sidebar-items">
        {items.map((i) => (
          <div className="cart-sidebar-item" key={`${i.itemId}-${i.unit}`}>
            <img src={i.image || '/images/menu/placeholder.jpg'} alt={i.name} />
            <div className="cart-sidebar-item-info">
              <span>{i.name}</span>
              <div className="qty-stepper">
                <button onClick={() => updateQuantity(i.itemId, i.unit, i.quantity - 1)}>−</button>
                <span>{i.quantity}</span>
                <button onClick={() => updateQuantity(i.itemId, i.unit, i.quantity + 1)}>+</button>
              </div>
            </div>
            <span className="cart-sidebar-item-price">{i.unitPrice * i.quantity} جنيه</span>
            <button className="remove-btn" onClick={() => removeItem(i.itemId, i.unit)}>🗑</button>
          </div>
        ))}
      </div>
      {!!items.length && !meetsMinimumOrder && (
        <p className="minimum-order-warning">أقل قيمة للطلب {MINIMUM_ORDER_VALUE} جنيه — محتاج تضيف {amountToReachMinimum} جنيه كمان</p>
      )}
      {!!items.length && !branchOpen && <p className="minimum-order-warning">الفرع مقفول دلوقتي، مينفعش تأكد الطلب</p>}
      {!!items.length && (
        <div className="cart-sidebar-summary">
          <div className="summary-row"><span>المجموع الفرعي</span><span>{subtotal} جنيه</span></div>
          <div className="summary-row"><span>رسوم التوصيل</span><span>{DELIVERY_FEE} جنيه</span></div>
          <div className="summary-row summary-total"><span>الإجمالي</span><span>{total} جنيه</span></div>
          <button className="checkout-btn" onClick={() => navigate('/cart')} disabled={!canCheckout}>إتمام الطلب</button>
        </div>
      )}
    </aside>
  );
};
export default CartSidebar;
