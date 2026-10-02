import { useEffect, useState } from 'react';
import CouponsTable from '../components/coupons/CouponsTable.jsx';
import CouponFormModal from '../components/coupons/CouponFormModal.jsx';
import TiersDisplay from '../components/loyalty/TiersDisplay.jsx';
import LoyaltyRulesCard from '../components/loyalty/LoyaltyRulesCard.jsx';
import LoyaltyConfigModal from '../components/loyalty/LoyaltyConfigModal.jsx';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../services/couponService.js';
import { getLoyaltyConfig, updateLoyaltyConfig } from '../../services/loyaltyService.js';
import { getBranches } from '../../services/branchService.js';

const CouponsLoyalty = () => {
  const [coupons, setCoupons] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchFilter, setBranchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loyaltyConfig, setLoyaltyConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [loyaltyModalOpen, setLoyaltyModalOpen] = useState(false);

  const loadCoupons = () => { getCoupons({ branch: branchFilter || undefined, search: search || undefined }).then((res) => setCoupons(res.data || [])); };

  useEffect(() => {
    setLoading(true);
    Promise.all([getBranches(), getLoyaltyConfig()])
      .then(([branchesRes, loyaltyRes]) => { setBranches(branchesRes.data || []); setLoyaltyConfig(loyaltyRes.data); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { const t = setTimeout(loadCoupons, 300); return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchFilter, search]);

  const filteredCoupons = statusFilter ? coupons.filter((c) => c.status === statusFilter) : coupons;

  const handleSaveCoupon = async (form) => {
    if (editingCoupon) await updateCoupon(editingCoupon._id, form); else await createCoupon(form);
    setCouponModalOpen(false); setEditingCoupon(null); loadCoupons();
  };
  const handleTogglePause = async (coupon) => { await updateCoupon(coupon._id, { isActive: !coupon.isActive }); loadCoupons(); };
  const handleDeleteCoupon = async (id) => { if (!confirm('تأكيد حذف الكوبون؟')) return; await deleteCoupon(id); loadCoupons(); };
  const handleSaveLoyalty = async (form) => { const res = await updateLoyaltyConfig(form); setLoyaltyConfig(res.data); setLoyaltyModalOpen(false); };

  if (loading) return <div className="page-loading">جاري التحميل...</div>;

  return (
    <div className="admin-coupons-page">
      <div className="admin-page-header">
        <h1>الكوبونات وولاء العملاء</h1>
        <button className="add-btn" onClick={() => { setEditingCoupon(null); setCouponModalOpen(true); }}>+ إنشاء كوبون</button>
      </div>
      <div className="admin-filters">
        <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}><option value="">كل الفروع</option>{branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}</select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="">كل الحالات</option><option value="active">نشط</option><option value="scheduled">مجدول</option><option value="expired">منتهي</option><option value="paused">متوقف</option></select>
        <input placeholder="بحث بالكود..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <CouponsTable coupons={filteredCoupons} onEdit={(c) => { setEditingCoupon(c); setCouponModalOpen(true); }} onTogglePause={handleTogglePause} onDelete={handleDeleteCoupon} />
      <div className="loyalty-section">
        <LoyaltyRulesCard config={loyaltyConfig} onEdit={() => setLoyaltyModalOpen(true)} />
        <h3 className="tiers-title">مستويات العضوية</h3>
        <TiersDisplay tiers={loyaltyConfig?.tiers} />
      </div>
      <CouponFormModal open={couponModalOpen} onClose={() => { setCouponModalOpen(false); setEditingCoupon(null); }} onSave={handleSaveCoupon} branches={branches} initialData={editingCoupon} />
      <LoyaltyConfigModal open={loyaltyModalOpen} config={loyaltyConfig} onClose={() => setLoyaltyModalOpen(false)} onSave={handleSaveLoyalty} />
    </div>
  );
};
export default CouponsLoyalty;
