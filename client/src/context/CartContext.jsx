import { createContext, useContext, useState, useMemo, useRef, useEffect } from 'react';
import { appendCartLine, cartKey, emptyCart, readCart, validateCart, writeCart } from '../services/cartState.js';

const CartContext = createContext();
const MINIMUM_ORDER_VALUE = 150;
const getStorage = () => { try { return globalThis.localStorage; } catch { return null; } };

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => readCart(getStorage()));
  const [cartError, setCartError] = useState(null);
  const currentCart = useRef(cart);
  useEffect(() => { writeCart(getStorage(), cart); }, [cart]);
  const commit = (next) => { currentCart.current = next; setCart(next); setCartError(null); };

  const switchBranch = (branchId) => {
    const current = currentCart.current;
    if (current.items.length && branchId !== current.branchId && !window.confirm('سلتك فيها أصناف من فرع تاني. تغيير الفرع هيفضي السلة الحالية. تكمل؟')) return false;
    try { commit(validateCart({ branchId, items: branchId === current.branchId ? current.items : [] })); return true; }
    catch (error) { setCartError(error.message); return false; }
  };
  const addItem = (item) => {
    const current = currentCart.current;
    const switching = current.branchId !== item.branchId;
    if (switching && current.items.length && !window.confirm('الصنف من فرع تاني. تفضي السلة الحالية وتضيفه؟')) return false;
    try { commit({ branchId: item.branchId, items: appendCartLine(switching ? [] : current.items, item) }); return true; }
    catch (error) { setCartError(error.message); return false; }
  };
  const replaceCart = (next) => {
    try { commit(validateCart(next)); return true; }
    catch (error) { setCartError(error.message); return false; }
  };
  const updateQuantity = (itemId, unit, quantity, addOns = [], notes = '') => {
    const current = currentCart.current;
    if (!Number.isSafeInteger(quantity) || quantity > 100) { setCartError('أقصى كمية لنفس اختيار الصنف هي 100'); return; }
    const key = cartKey({ itemId, unit, addOns, notes });
    commit({ ...current, items: quantity <= 0 ? current.items.filter((item) => cartKey(item) !== key) : current.items.map((item) => cartKey(item) === key ? { ...item, quantity } : item) });
  };
  const removeItem = (itemId, unit, addOns = [], notes = '') => {
    const current = currentCart.current;
    const key = cartKey({ itemId, unit, addOns, notes });
    commit({ ...current, items: current.items.filter((item) => cartKey(item) !== key) });
  };
  const clearCart = () => commit(emptyCart());
  const subtotal = useMemo(() => cart.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), [cart.items]);
  return (
    <CartContext.Provider value={{
      ...cart, switchBranch, addItem, replaceCart, updateQuantity, removeItem, clearCart, cartError,
      subtotal, cartKey, MINIMUM_ORDER_VALUE, meetsMinimumOrder: subtotal >= MINIMUM_ORDER_VALUE || !cart.items.length,
      amountToReachMinimum: Math.max(0, MINIMUM_ORDER_VALUE - subtotal),
    }}>{children}</CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext);
