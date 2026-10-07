import { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();
const MINIMUM_ORDER_VALUE = 150; // حد أدنى لقيمة الطلب - يحمي المطعم من طلبات غير مربحة

const cartKey = (i) => `${i.itemId}-${i.unit}-${[...(i.addOns || [])].sort().join(',')}`;

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [branchId, setBranchId] = useState(null);

  // تغيير الفرع يدويًا - لو السلة فيها أصناف من فرع تاني، لازم نصفّرها
  const switchBranch = (newBranchId) => {
    if (items.length && newBranchId !== branchId) {
      const confirmSwitch = window.confirm('سلتك فيها أصناف من فرع تاني. تغيير الفرع هيفضي السلة الحالية. تكمل؟');
      if (!confirmSwitch) return false;
      setItems([]);
    }
    setBranchId(newBranchId);
    return true;
  };

  // إضافة صنف: منع خلط أصناف من فرعين مختلفين في نفس الطلب
  const addItem = (item) => {
    if (branchId && item.branchId && item.branchId !== branchId && items.length) {
      const confirmSwitch = window.confirm('مينفعش تخلط أصناف من فرعين مختلفين في نفس الطلب. تفضي السلة الحالية وتضيف الصنف الجديد؟');
      if (!confirmSwitch) return false;
      setItems([{ ...item }]);
      setBranchId(item.branchId);
      return true;
    }
    if (item.branchId && !branchId) setBranchId(item.branchId);

    setItems((prev) => {
      const key = cartKey(item);
      const existing = prev.find((i) => cartKey(i) === key);
      if (existing) return prev.map((i) => (cartKey(i) === key ? { ...i, quantity: i.quantity + item.quantity } : i));
      return [...prev, item];
    });
    return true;
  };

  const updateQuantity = (itemId, unit, quantity, addOns = []) => {
    const key = cartKey({ itemId, unit, addOns });
    setItems((prev) =>
      quantity <= 0 ? prev.filter((i) => cartKey(i) !== key) : prev.map((i) => (cartKey(i) === key ? { ...i, quantity } : i))
    );
  };

  const removeItem = (itemId, unit, addOns = []) => {
    const key = cartKey({ itemId, unit, addOns });
    setItems((prev) => prev.filter((i) => cartKey(i) !== key));
  };

  const clearCart = () => { setItems([]); setBranchId(null); };

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0), [items]);
  const meetsMinimumOrder = subtotal >= MINIMUM_ORDER_VALUE || items.length === 0;
  const amountToReachMinimum = Math.max(0, MINIMUM_ORDER_VALUE - subtotal);

  return (
    <CartContext.Provider value={{
      items, branchId, setBranchId, switchBranch, addItem, updateQuantity, removeItem, clearCart,
      subtotal, cartKey, MINIMUM_ORDER_VALUE, meetsMinimumOrder, amountToReachMinimum,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
