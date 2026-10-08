import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import OrderTimeline from '../components/tracking/OrderTimeline.jsx';
import RatingPrompt from '../components/tracking/RatingPrompt.jsx';
import { getOrderById } from '../services/orderService.js';
import { unitLabels } from '../services/orderWorkflow.js';
import { useCustomerAuth } from '../context/CustomerAuthContext.jsx';
import PageIntro from '../components/common/PageIntro.jsx';
import StatePanel from '../components/common/StatePanel.jsx';

const OrderTracking = () => {
  const { orderId } = useParams();
  const { isAuthenticated } = useCustomerAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [revision, setRevision] = useState(0);
  useEffect(() => { setOrder(null); setLastUpdated(null); setError(null); setLoading(isAuthenticated); }, [orderId, isAuthenticated]);
  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    let pending = false;
    let terminal = false;
    const load = async () => {
      if (pending || document.hidden) return;
      pending = true; setRefreshing(true);
      try {
        const response = await getOrderById(orderId);
        if (active) {
          setOrder(response.data); setError(null); setLastUpdated(new Date());
          terminal = ['delivered', 'cancelled'].includes(response.data.status);
        }
      } catch (err) {
        if (active) {
          const status = err.response?.status;
          if ([401, 403, 404].includes(status)) { setOrder(null); terminal = true; }
          setError(err.response?.data?.message || 'تعذر تحديث الطلب. جرّب تاني لمشاهدة آخر حالة.');
        }
      } finally { pending = false; if (active) { setLoading(false); setRefreshing(false); } }
    };
    load();
    const timer = setInterval(() => { if (!terminal) load(); }, 15000);
    const onVisible = () => { if (!document.hidden && !terminal) load(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { active = false; clearInterval(timer); document.removeEventListener('visibilitychange', onVisible); };
  }, [orderId, isAuthenticated, revision]);
  const retry = () => setRevision((value) => value + 1);
  if (!isAuthenticated) return <main className="tracking-page"><PageIntro title="تتبع طلبك" /><StatePanel title="سجّل دخولك لمتابعة الطلب" description="تفاصيل الطلب متاحة لصاحب الحساب اللي عمله." to="/login" actionLabel="تسجيل الدخول" /></main>;
  if (loading) return <div className="page-loading" role="status">جاري تحميل الطلب…</div>;
  if (!order) return <main className="tracking-page"><StatePanel error title={error || 'الطلب غير موجود'} to="/account/orders" actionLabel="عرض طلباتي" onRetry={retry} /></main>;
  const finished = ['delivered', 'cancelled'].includes(order.status);
  return (
    <main className="tracking-page">
      <PageIntro title="تتبع طلبك" description={finished ? 'تفاصيل الطلب وحالته النهائية.' : 'بنراجع حالة طلبك كل 15 ثانية وأنت فاتح الصفحة.'}>
        <button className="secondary-action" type="button" disabled={refreshing} onClick={retry}>{refreshing ? 'جاري التحديث…' : 'تحديث الحالة'}</button>
      </PageIntro>
      <p className="tracking-update" role="status">آخر تحديث ناجح: {lastUpdated?.toLocaleTimeString('ar-EG')}</p>
      {error && <p className="form-error" role="alert">{error} البيانات المعروضة من آخر تحديث ناجح.</p>}
      <div className="tracking-header-card"><div><span>رقم الطلب</span><strong>#{order.orderNumber}</strong></div><div><span>الفرع</span><strong>{order.branch?.name}</strong></div><div><span>طريقة الاستلام</span><strong>{order.deliveryType === 'pickup' ? 'استلام من الفرع' : 'توصيل'}</strong></div></div>
      <OrderTimeline order={order} />
      <section className="tracking-order-details" aria-labelledby="tracking-details-title">
        <h2 id="tracking-details-title">تفاصيل طلبك</h2>
        <ul>{order.items?.map((item, index) => <li key={index}><div><strong>{item.quantity} × {item.name}</strong><p>{unitLabels[item.unit] || item.unit}{!!item.addOns?.length && ` · ${item.addOns.map((addon) => addon.name).join('، ')}`}</p>{item.notes && <p>ملاحظات الصنف: {item.notes}</p>}</div><span>{item.subtotal} جنيه</span></li>)}</ul>
        {order.deliveryType === 'delivery' && <p className="tracking-address"><strong>عنوان التوصيل: </strong>{order.deliveryAddress?.fullAddress}</p>}
        {order.notes && <p><strong>ملاحظات الطلب: </strong>{order.notes}</p>}
        <dl className="tracking-totals"><div><dt>الأصناف</dt><dd>{order.subtotal} جنيه</dd></div>{order.discountAmount > 0 && <div><dt>الخصم {order.couponCode && `(${order.couponCode})`}</dt><dd>− {order.discountAmount} جنيه</dd></div>}<div><dt>رسوم التوصيل</dt><dd>{order.deliveryFee} جنيه</dd></div><div><dt>الإجمالي</dt><dd>{order.total} جنيه</dd></div></dl>
      </section>
      {order.status === 'delivered' && <RatingPrompt key={order._id} orderId={order._id} />}
      <div className="tracking-footer-card"><span>{order.paymentMethod === 'cash' ? 'الدفع عند الاستلام' : 'طريقة الدفع: بطاقة'}</span><a href={`tel:${order.branch?.phone || '17397'}`} className="contact-branch-btn">تواصل مع الفرع</a></div>
    </main>
  );
};
export default OrderTracking;
