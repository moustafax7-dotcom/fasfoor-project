import { useCart } from '../../context/CartContext.jsx';
import { unitLabels } from '../../services/orderWorkflow.js';
const CartItemRow = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  return (
    <div className="cart-item-row">
      <button aria-label="حذف الصنف من السلة" className="remove-btn" onClick={() => removeItem(item.itemId, item.unit, item.addOns, item.notes)}>🗑</button>
      <div className="qty-stepper">
        <button disabled={item.quantity >= 100} aria-label="زيادة الكمية" onClick={() => updateQuantity(item.itemId, item.unit, item.quantity + 1, item.addOns, item.notes)}>+</button>
        <span>{item.quantity}</span>
        <button aria-label="تقليل الكمية" onClick={() => updateQuantity(item.itemId, item.unit, item.quantity - 1, item.addOns, item.notes)}>−</button>
      </div>
      <div className="cart-item-info">
        <h4>{item.name}</h4>
        <p>{unitLabels[item.unit] || item.unit}</p>
        {!!item.addOns?.length && <p className="cart-item-addons">+ {item.addOns.join('، ')}</p>}
        {item.notes && <p className="cart-item-notes">📝 {item.notes}</p>}
        <span className="cart-item-price">{item.unitPrice * item.quantity} جنيه</span>
      </div>
      <img src={item.image || '/images/menu/placeholder.jpg'} alt={item.name} />
    </div>
  );
};
export default CartItemRow;
