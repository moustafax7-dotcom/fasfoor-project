import PageIntro from '../components/common/PageIntro.jsx';
import StatePanel from '../components/common/StatePanel.jsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import CartItemRow from '../components/cart/CartItemRow.jsx';
import AddressBox from '../components/cart/AddressBox.jsx';
import CouponBox from '../components/cart/CouponBox.jsx';
import ZoneSelector from '../components/cart/ZoneSelector.jsx';
import PaymentMethodSelector from '../components/cart/PaymentMethodSelector.jsx';
import OrderSummary from '../components/cart/OrderSummary.jsx';
import { useCustomerAuth } from '../context/CustomerAuthContext.jsx';
import { createOrder } from '../services/orderService.js';
import { getBranchById } from '../services/branchService.js';
import { getItems } from '../services/itemService.js';
import { refreshCartPricing } from '../services/cartState.js';

const Cart = () => {
  const { items, branchId, subtotal, clearCart, replaceCart, cartKey, cartError } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated } = useCustomerAuth();
  const [branchRevision, setBranchRevision] = useState(0);
  const [zoneStatus, setZoneStatus] = useState({ ready: false, required: false });
  const [branch, setBranch] = useState(null);
  const [deliveryType, setDeliveryType] = useState('delivery');
  const [notes, setNotes] = useState('');
  const [address, setAddress] = useState('');
  const [selectedZone, setSelectedZone] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setBranch(null); setError(null);
    setSelectedZone(null);
    setAppliedCoupon(null);
    if (branchId) getBranchById(branchId)
      .then((res) => { if (active) setBranch(res.data); })
      .catch(() => { if (active) setError('تعذر تحميل الفرع، برجاء إعادة المحاولة'); });
    return () => { active = false; };
  }, [branchId, branchRevision]);

  const minimumOrderValue = branch?.minimumOrderValue ?? 150;
  const meetsMinimumOrder = subtotal >= minimumOrderValue;
  const amountToReachMinimum = Math.max(0, minimumOrderValue - subtotal);
  const deliveryFee = deliveryType === 'pickup' ? 0 : (selectedZone?.deliveryFee ?? 15);
  const discountAmount = appliedCoupon
    ? (appliedCoupon.discountType === 'percentage' ? Math.min(subtotal, Math.round((subtotal * appliedCoupon.value) / 100)) : Math.min(appliedCoupon.value, subtotal))
    : 0;
  const total = Math.max(0, subtotal - discountAmount) + (items.length ? deliveryFee : 0);
  const branchClosed = branch && !branch.isOpen;
  const deliveryReady = deliveryType === "pickup" || (zoneStatus.ready && (!zoneStatus.required || selectedZone));
  const canConfirm = Boolean(branch) && meetsMinimumOrder && !branchClosed && deliveryReady;

  const handleConfirm = async () => {
    if (submitting || !items.length) return;
    if (!isAuthenticated) { navigate("/login", { state: { from: "/cart" } }); return; }
    if (!branch || !deliveryReady) { setError("راجع الفرع ومنطقة التوصيل قبل التأكيد"); return; }
    if (branchClosed) { setError('الفرع مقفول دلوقتي، مينفعش تأكد الطلب'); return; }
    if (!meetsMinimumOrder) { setError(`أقل قيمة للطلب ${minimumOrderValue} جنيه`); return; }
    if (deliveryType === 'delivery' && !address.trim()) { setError('برجاء إضافة عنوان التوصيل أولًا'); return; }

    setSubmitting(true); setError(null);
    try {
      const catalog = await getItems({ branch: branchId });
      const refreshed = refreshCartPricing({ items, branchId }, catalog.data);
      if (refreshed.pricesChanged || refreshed.unavailable.length) {
        replaceCart(refreshed.cart);
        setError(`السلة اتحدثت حسب المنيو الحالي.${refreshed.unavailable.length ? ` أصناف غير متاحة: ${refreshed.unavailable.join('، ')}.` : ''} راجع الأصناف والإجمالي واضغط تأكيد مرة تانية.`);
        return;
      }
      const payload = {
        branch: branchId,
        items: refreshed.cart.items.map((i) => ({ item: i.itemId, unit: i.unit, quantity: i.quantity, addOns: i.addOns || [], notes: i.notes })),
        deliveryType, deliveryAddress: deliveryType === 'delivery' ? { fullAddress: address.trim() } : undefined, notes,
        deliveryZone: deliveryType === 'delivery' ? selectedZone?._id : undefined,
        couponCode: appliedCoupon?.code, paymentMethod: 'cash',
      };
      const res = await createOrder(payload);
      clearCart();
      navigate(`/track/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || (!err.isAxiosError && err.message) || 'حدث خطأ أثناء إرسال الطلب، برجاء المحاولة مرة أخرى');
    } finally { setSubmitting(false); }
  };

  if (!items.length) {
    return (
      <main className="cart-page cart-page-empty">
        <PageIntro title="سلة الطلب" description="كل اختياراتك في مكان واحد." /><StatePanel title="سلتك لسه فاضية" description="اختار فرعك وضيف الأصناف اللي تحبها. هتراجع تفاصيل الطلب هنا قبل التأكيد." to="/menu" />
      </main>
    );
  }

  return (
    <main className="cart-page">
      <PageIntro title="سلة الطلب" description="راجع الأصناف، وطريقة الاستلام، والإجمالي قبل تأكيد طلبك." />
      {branchClosed && <div className="branch-closed-banner">🔒 الفرع مقفول دلوقتي — مينفعش تأكد الطلب لحد ما يفتح</div>}
      {!meetsMinimumOrder && (
        <div className="minimum-order-warning-banner">أقل قيمة للطلب {minimumOrderValue} جنيه — محتاج تضيف {amountToReachMinimum} جنيه كمان عشان تكمل</div>
      )}
      <div className="cart-layout">
        <div className="cart-items-list">{items.map((i) => <CartItemRow key={cartKey(i)} item={i} />)}</div>
        <div className="cart-side">
          <label htmlFor="delivery-type">طريقة الاستلام</label>
          <select id="delivery-type" value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)}>
            <option value="delivery">توصيل</option>
            <option value="pickup">استلام من الفرع</option>
          </select>
          {deliveryType === 'delivery' && <>
            <AddressBox address={address} onChange={setAddress} />
            <ZoneSelector branchId={branchId} selectedZoneId={selectedZone?._id} onSelect={setSelectedZone} onStatus={setZoneStatus} />
          </>}
          <PaymentMethodSelector />
          <CouponBox branchId={branchId} subtotal={subtotal} appliedCoupon={appliedCoupon} onApply={setAppliedCoupon} onRemove={() => setAppliedCoupon(null)} />
          <div className="notes-box">
            <label htmlFor="order-notes">ملاحظات الطلب (اختياري)</label>
            <textarea id="order-notes" maxLength={250} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="اكتب ملاحظاتك هنا..." />
            <span className="char-count">{notes.length}/250</span>
          </div>
          {(error || cartError) && <p className="form-error" role="alert">{error || cartError}</p>}
          {!branch && <button className="link-btn" type="button" onClick={() => setBranchRevision((value) => value + 1)}>إعادة تحميل بيانات الفرع</button>}
          {!isAuthenticated && <p className="checkout-hint">سجّل دخولك علشان نربط الطلب بحسابك. سلتك محفوظة على الجهاز.</p>}
          {isAuthenticated && !deliveryReady && deliveryType === 'delivery' && <p className="checkout-hint">اختار منطقة التوصيل بعد تحميلها علشان تكمل.</p>}
          <OrderSummary subtotal={subtotal} deliveryFee={deliveryFee} discountAmount={discountAmount} total={total} onConfirm={handleConfirm} disabled={submitting || (isAuthenticated && !canConfirm)} confirmLabel={submitting ? "جاري إرسال الطلب…" : isAuthenticated ? "تأكيد الطلب" : "تسجيل الدخول لإكمال الطلب"} />
        </div>
      </div>
    </main>
  );
};
export default Cart;
