import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import CartItemRow from '../components/cart/CartItemRow.jsx';
import AddressBox from '../components/cart/AddressBox.jsx';
import CouponBox from '../components/cart/CouponBox.jsx';
import ZoneSelector from '../components/cart/ZoneSelector.jsx';
import PaymentMethodSelector from '../components/cart/PaymentMethodSelector.jsx';
import OrderSummary from '../components/cart/OrderSummary.jsx';
import { createOrder } from '../services/orderService.js';
import { getBranchById } from '../services/branchService.js';

const Cart = () => {
  const { items, branchId, subtotal, clearCart, meetsMinimumOrder, amountToReachMinimum, MINIMUM_ORDER_VALUE } = useCart();
  const navigate = useNavigate();
  const [branch, setBranch] = useState(null);
  const [notes, setNotes] = useState('');
  const [address, setAddress] = useState('');
  const [selectedZone, setSelectedZone] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { if (branchId) getBranchById(branchId).then((res) => setBranch(res.data)).catch(() => {}); }, [branchId]);

  const deliveryFee = selectedZone?.deliveryFee ?? 15;
  const discountAmount = appliedCoupon
    ? (appliedCoupon.discountType === 'percentage' ? Math.round((subtotal * appliedCoupon.value) / 100) : Math.min(appliedCoupon.value, subtotal))
    : 0;
  const total = Math.max(0, subtotal - discountAmount) + (items.length ? deliveryFee : 0);
  const branchClosed = branch && !branch.isOpen;
  const canConfirm = meetsMinimumOrder && !branchClosed;

  const handleConfirm = async () => {
    if (!items.length) return;
    if (branchClosed) { setError('الفرع مقفول دلوقتي، مينفعش تأكد الطلب'); return; }
    if (!meetsMinimumOrder) { setError(`أقل قيمة للطلب ${MINIMUM_ORDER_VALUE} جنيه`); return; }
    if (!address) { setError('برجاء إضافة عنوان التوصيل أولًا'); return; }

    setSubmitting(true); setError(null);
    try {
      const payload = {
        branch: branchId,
        items: items.map((i) => ({ item: i.itemId, unit: i.unit, quantity: i.quantity, addOns: i.addOns || [], notes: i.notes })),
        deliveryType: 'delivery', deliveryAddress: { fullAddress: address }, notes,
        deliveryZone: selectedZone?._id,
        couponCode: appliedCoupon?.code, paymentMethod: 'cash', total,
      };
      const res = await createOrder(payload);
      clearCart();
      navigate(`/track/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء إرسال الطلب، برجاء المحاولة مرة أخرى');
    } finally { setSubmitting(false); }
  };

  if (!items.length) {
    return (
      <main className="cart-page cart-page-empty">
        <h1>سلة الطلب</h1><p>سلتك فارغة حاليًا</p>
        <button className="hero-order-btn" onClick={() => navigate('/menu')}>تصفح المنيو</button>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <h1>سلة الطلب</h1>
      <p className="cart-subtitle">راجع طلبك قبل التأكيد</p>
      {branchClosed && <div className="branch-closed-banner">🔒 الفرع مقفول دلوقتي — مينفعش تأكد الطلب لحد ما يفتح</div>}
      {!meetsMinimumOrder && (
        <div className="minimum-order-warning-banner">أقل قيمة للطلب {MINIMUM_ORDER_VALUE} جنيه — محتاج تضيف {amountToReachMinimum} جنيه كمان عشان تكمل</div>
      )}
      <div className="cart-layout">
        <div className="cart-items-list">{items.map((i) => <CartItemRow key={`${i.itemId}-${i.unit}`} item={i} />)}</div>
        <div className="cart-side">
          <AddressBox address={address} onChange={setAddress} />
          <ZoneSelector branchId={branchId} selectedZoneId={selectedZone?._id} onSelect={setSelectedZone} />
          <PaymentMethodSelector />
          <CouponBox branchId={branchId} subtotal={subtotal} appliedCoupon={appliedCoupon} onApply={setAppliedCoupon} onRemove={() => setAppliedCoupon(null)} />
          <div className="notes-box">
            <label>ملاحظات الطلب (اختياري)</label>
            <textarea maxLength={250} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="اكتب ملاحظاتك هنا..." />
            <span className="char-count">{notes.length}/250</span>
          </div>
          {error && <div className="page-error">{error}</div>}
          <OrderSummary subtotal={subtotal} deliveryFee={deliveryFee} discountAmount={discountAmount} total={total} onConfirm={handleConfirm} disabled={submitting || !canConfirm} />
        </div>
      </div>
    </main>
  );
};
export default Cart;
