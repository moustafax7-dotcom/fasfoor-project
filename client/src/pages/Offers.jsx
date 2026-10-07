import PageIntro from '../components/common/PageIntro.jsx';
import StatePanel from '../components/common/StatePanel.jsx';
import { useEffect, useState } from 'react';
import OfferCard from '../components/offers/OfferCard.jsx';
import { getOffers } from '../services/offerService.js';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOffers({ activeOnly: true }).then((res) => setOffers(res.data || [])).catch(() => setError('تعذر تحميل العروض')).finally(() => setLoading(false));
  }, []);


  return (
    <main className="offers-page">
      <PageIntro title="عروض فسفور" description="شوف العروض المتاحة وتفاصيل كل عرض قبل ما تختار." />
      {loading && <div className="page-loading">جاري التحميل...</div>}
      {error && <StatePanel error title={error} onRetry={() => window.location.reload()} />}
      {!loading && !error && !offers.length && <StatePanel title="لا توجد عروض متاحة حاليًا" description="لسه تقدر تختار طلبك من المنيو حسب الفرع." to="/menu" />}
      <div className="offers-grid">{offers.map((o) => <OfferCard key={o._id} offer={o} />)}</div>
    <section className="contact-section" aria-labelledby="contact-title"><div><p className="page-eyebrow">تواصل معانا</p><h2 id="contact-title">محتاج تسأل عن صنف أو عرض؟</h2><p>اتصل بالمطعم للاستفسار عن التوفر وتفاصيل طلبك.</p></div><a href="tel:17397" className="contact-number" dir="ltr">17397</a></section>
    </main>
  );
};
export default Offers;
