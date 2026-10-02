import { useEffect, useState } from 'react';
import OfferCard from '../components/offers/OfferCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import { getOffers } from '../services/offerService.js';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    getOffers({ activeOnly: true }).then((res) => setOffers(res.data || [])).catch(() => setError('تعذر تحميل العروض')).finally(() => setLoading(false));
  }, []);

  const handleOrder = (offer) => {
    addItem({ itemId: offer._id, name: offer.title, unit: 'box', unitPrice: offer.price, quantity: 1, image: offer.image, addOns: [], branchId: offer.branches?.[0]?._id || offer.branches?.[0] });
  };

  return (
    <main className="offers-page">
      <div className="offers-header"><h1>عروض فسفور</h1><p>وجبات بحرية تكفي اللمة</p></div>
      {loading && <div className="page-loading">جاري التحميل...</div>}
      {error && <div className="page-error">{error}</div>}
      {!loading && !error && !offers.length && <div className="menu-empty">لا توجد عروض نشطة حاليًا</div>}
      <div className="offers-grid">{offers.map((o) => <OfferCard key={o._id} offer={o} onOrder={handleOrder} />)}</div>
    </main>
  );
};
export default Offers;
