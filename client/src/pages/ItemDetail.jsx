import StatePanel from '../components/common/StatePanel.jsx';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SizeSelector from '../components/item-detail/SizeSelector.jsx';
import AddOnsList from '../components/item-detail/AddOnsList.jsx';
import QuantityStepper from '../components/item-detail/QuantityStepper.jsx';
import { useCart } from '../context/CartContext.jsx';
import { getItemById } from '../services/itemService.js';

const unitLabels = { quarter: 'ربع كيلو', half: 'نص كيلو', kilo: 'كيلو', piece: 'قطعة', plate: 'طبق', box: 'بوكس' };

const ItemDetail = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { addItem, branchId } = useCart();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true); setError(null); setItem(null); setSelectedAddOns([]); setNotes(''); setQuantity(1); setAdded(false);
    getItemById(itemId)
      .then((res) => {
        if (!active) return;
        setItem(res.data);
        setSelectedUnit(res.data.weightPrices?.length ? res.data.weightPrices[0].unit : 'piece');
      })
      .catch(() => { if (active) setError('تعذر تحميل بيانات الصنف'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [itemId]);

  if (loading) return <div className="page-loading">جاري التحميل...</div>;
  if (error || !item) return <main className="item-detail-page"><StatePanel error title={error || 'الصنف غير موجود'} to="/menu" actionLabel="العودة للمنيو" /></main>;

  const selectedBranch = item.branches?.find((branch) => (branch._id || branch) === branchId) || item.branches?.[0];

  const basePrice = item.weightPrices?.length ? item.weightPrices.find((w) => w.unit === selectedUnit)?.price || 0 : item.price;
  const addOnsTotal = (item.addOns || []).filter((a) => selectedAddOns.includes(a.name)).reduce((sum, a) => sum + a.price, 0);
  const totalPrice = (basePrice + addOnsTotal) * quantity;

  const toggleAddOn = (name) => setSelectedAddOns((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));

  const handleAddToCart = () => {
    const added = addItem({
      itemId: item._id, name: item.name, unit: selectedUnit, unitPrice: basePrice + addOnsTotal,
      quantity, image: item.image, addOns: selectedAddOns, notes,
      branchId: selectedBranch?._id || selectedBranch,
    });
    if (added === false) return;
    setAdded(true);
    setTimeout(() => navigate('/menu'), 900);
  };

  return (
    <main className="item-detail-page">
      <div className="breadcrumb">
        <Link to="/">الرئيسية</Link> ‹ <Link to="/menu">منيو الطعام</Link> ‹ {item.category?.name} ‹ <span>{item.name}</span>
      </div>
      <div className="item-detail-layout">
        <div className="item-detail-image"><img src={item.image || '/images/menu/placeholder.jpg'} alt={item.name} /></div>
        <div className="item-detail-panel">
          <h1>{item.name}</h1>
          {selectedBranch?.name && <span className="detail-branch">فرع {selectedBranch.name}</span>}
          {item.description && <p className="item-detail-desc">{item.description}</p>}
          {item.weightPrices?.length > 0 && (
            <SizeSelector options={item.weightPrices.map((w) => ({ ...w, label: unitLabels[w.unit] }))} selected={selectedUnit} onSelect={setSelectedUnit} />
          )}
          <AddOnsList addOns={item.addOns} selected={selectedAddOns} onToggle={toggleAddOn} />
          <div className="item-detail-notes">
            <h3><label htmlFor="item-notes">ملاحظات الطلب (اختياري)</label></h3>
            <textarea id="item-notes" maxLength={250} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="اكتب ملاحظاتك هنا..." />
          </div>
          <div className="item-detail-footer">
            <div><span className="detail-price-label">السعر</span><strong className="detail-price">{totalPrice} جنيه</strong></div>
            <QuantityStepper quantity={quantity} onChange={setQuantity} />
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={!item.isAvailable}>
            {added ? '✓ تمت الإضافة للسلة' : item.isAvailable ? 'أضف للسلة' : 'غير متاح حاليًا'}
          </button>
        </div>
      </div>
    </main>
  );
};
export default ItemDetail;
