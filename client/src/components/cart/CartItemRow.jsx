import { useCart } from '../../context/CartContext.jsx';
const CartItemRow = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  return (
    <div className="cart-item-row">
      <button className="remove-btn" onClick={() => removeItem(item.itemId, item.unit, item.addOns)}>🗑</button>
      <div className="qty-stepper">
        <button onClick={() => updateQuantity(item.itemId, item.unit, item.quantity + 1, item.addOns)}>+</button>
        <span>{item.quantity}</span>
        <button onClick={() => updateQuantity(item.itemId, item.unit, item.quantity - 1, item.addOns)}>−</button>
      </div>
      <div className="cart-item-info">
        <h4>{item.name}</h4>
        {!!item.addOns?.length && <p className="cart-item-addons">+ {item.addOns.join('، ')}</p>}
        {item.notes && <p className="cart-item-notes">📝 {item.notes}</p>}
        <span className="cart-item-price">{item.unitPrice * item.quantity} جنيه</span>
      </div>
      <img src={item.image || '/images/menu/placeholder.jpg'} alt={item.name} />
    </div>
  );
};
export default CartItemRow;
