import PageIntro from '../components/common/PageIntro.jsx';
import StatePanel from '../components/common/StatePanel.jsx';
import { useEffect, useState } from 'react';
import CategoryTabs from '../components/home/CategoryTabs.jsx';
import MenuGrid from '../components/menu/MenuGrid.jsx';
import CartSidebar from '../components/menu/CartSidebar.jsx';
import BranchSelector from '../components/common/BranchSelector.jsx';
import { useCart } from '../context/CartContext.jsx';
import { getBranches } from '../services/branchService.js';
import { getCategories } from '../services/categoryService.js';
import { getItems } from '../services/itemService.js';

const Menu = () => {
  const { branchId, switchBranch } = useCart();
  const [branches, setBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getBranches(), getCategories()])
      .then(([branchesRes, categoriesRes]) => {
        const loadedBranches = branchesRes.data || [];
        setBranches(loadedBranches);
        if (!loadedBranches.length) setLoading(false);
        setCategories(categoriesRes.data || []);
        if (!branchId && loadedBranches.length) switchBranch(loadedBranches[0]._id);
      })
      .catch(() => { setError('تعذر تحميل بيانات المنيو'); setLoading(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { setCurrentBranch(branches.find((b) => b._id === branchId) || null); }, [branchId, branches]);

  useEffect(() => {
    if (!branchId) return;
    let active = true;
    setLoading(true); setError(null); setItems([]);
    getItems({ branch: branchId, category: activeCategory || undefined, availableOnly: true })
      .then((res) => { if (active) setItems(res.data || []); })
      .catch(() => { if (active) setError('تعذر تحميل الأصناف'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [branchId, activeCategory]);

  return (
    <main className="menu-page">
      <PageIntro title="منيو الطعام" description="اختار فرعك، وبعدها اختار الأصناف والإضافات اللي تناسبك.">
        <BranchSelector branches={branches} selected={branchId} onChange={(id) => { if (switchBranch(id)) setActiveCategory(null); }} />
      </PageIntro>
      {currentBranch && !currentBranch.isOpen && (
        <div className="branch-closed-banner">
          🔒 الفرع ده مقفول دلوقتي (ساعات العمل: {currentBranch.workingHours?.from} - {currentBranch.workingHours?.to}).
          تقدر تتصفح المنيو بس مش هتقدر تأكد طلب لحد ما يفتح.
        </div>
      )}
      <CategoryTabs categories={categories} active={activeCategory} onSelect={setActiveCategory} />
      <div className="menu-layout">
        <section className="menu-content">
          {!loading && !error && !branches.length && <StatePanel title="المنيو غير متاح حاليًا" description="الأصناف هتظهر هنا بعد إتاحتها من المطعم. للاستفسار اتصل على 17397." to="/branches" actionLabel="شوف الفروع" />}
          {loading && <div className="page-loading">جاري التحميل...</div>}
          {error && <StatePanel error title={error} onRetry={() => window.location.reload()} />}
          {!!branches.length && !loading && !error && <MenuGrid items={items} branchOpen={currentBranch?.isOpen !== false} />}
        </section>
        <CartSidebar branchOpen={currentBranch?.isOpen !== false} minimumOrderValue={currentBranch?.minimumOrderValue ?? 150} />
      </div>
    </main>
  );
};
export default Menu;
