import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';

const CartSidebar = ({ branchOpen = true, minimumOrderValue = 150 }) => {
  const { items, updateQuantity, removeItem, subtotal, cartKey } = useCart();
  const navigate = useNavigate();
  const meetsMinimumOrder = subtotal >= minimumOrderValue;
  const amountToReachMinimum = Math.max(0, minimumOrderValue - subtotal);
  const canCheckout = branchOpen && meetsMinimumOrder;

  return (
    <aside className="cart-sidebar">
      <h3>سلة الطلب</h3>
      {!items.length && <p className="cart-empty">السلة فارغة، ابدأ بإضافة أصناف</p>}
      <div className="cart-sidebar-items">
        {items.map((i) => (
          <div className="cart-sidebar-item" key={cartKey(i)}>
            <img src={i.image || '/images/menu/placeholder.jpg'} alt={i.name} />
            <div className="cart-sidebar-item-info">
              <span>{i.name}</span>
              <div className="qty-stepper">
                <button onClick={() => updateQuantity(i.itemId, i.unit, i.quantity - 1, i.addOns)}>−</button>
                <span>{i.quantity}</span>
                <button onClick={() => updateQuantity(i.itemId, i.unit, i.quantity + 1, i.addOns)}>+</button>
              </div>
            </div>
            <span className="cart-sidebar-item-price">{i.unitPrice * i.quantity} جنيه</span>
            <button className="remove-btn" onClick={() => removeItem(i.itemId, i.unit, i.addOns)}>🗑</button>
          </div>
        ))}
      </div>
      {!!items.length && !meetsMinimumOrder && (
        <p className="minimum-order-warning">أقل قيمة للطلب {minimumOrderValue} جنيه — محتاج تضيف {amountToReachMinimum} جنيه كمان</p>
      )}
      {!!items.length && !branchOpen && <p className="minimum-order-warning">الفرع مقفول دلوقتي، مينفعش تأكد الطلب</p>}
      {!!items.length && (
        <div className="cart-sidebar-summary">
          <div className="summary-row"><span>المجموع الفرعي</span><span>{subtotal} جنيه</span></div>
          <p className="cart-delivery-note">رسوم التوصيل والخصم بتظهر بعد اختيار طريقة الاستلام في السلة.</p>
          <button className="checkout-btn" onClick={() => navigate('/cart')} disabled={!canCheckout}>راجع طلبك</button>
        </div>
      )}
    </aside>
  );
};
export default CartSidebar;
