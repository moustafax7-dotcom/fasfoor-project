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
        setCategories(categoriesRes.data || []);
        if (!branchId && loadedBranches.length) switchBranch(loadedBranches[0]._id);
      })
      .catch(() => setError('تعذر تحميل بيانات المنيو'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { setCurrentBranch(branches.find((b) => b._id === branchId) || null); }, [branchId, branches]);

  useEffect(() => {
    if (!branchId) return;
    setLoading(true);
    getItems({ branch: branchId, category: activeCategory || undefined, availableOnly: true })
      .then((res) => setItems(res.data || []))
      .catch(() => setError('تعذر تحميل الأصناف'))
      .finally(() => setLoading(false));
  }, [branchId, activeCategory]);

  return (
    <main className="menu-page">
      <div className="menu-page-header">
        <h1>منيو الطعام</h1>
        <BranchSelector branches={branches} selected={branchId} onChange={switchBranch} />
      </div>
      {currentBranch && !currentBranch.isOpen && (
        <div className="branch-closed-banner">
          🔒 الفرع ده مقفول دلوقتي (ساعات العمل: {currentBranch.workingHours?.from} - {currentBranch.workingHours?.to}).
          تقدر تتصفح المنيو بس مش هتقدر تأكد طلب لحد ما يفتح.
        </div>
      )}
      <CategoryTabs categories={categories} active={activeCategory} onSelect={setActiveCategory} />
      <div className="menu-layout">
        <section className="menu-content">
          {loading && <div className="page-loading">جاري التحميل...</div>}
          {error && <div className="page-error">{error}</div>}
          {!loading && !error && <MenuGrid items={items} branchOpen={currentBranch?.isOpen !== false} />}
        </section>
        <CartSidebar branchOpen={currentBranch?.isOpen !== false} />
      </div>
    </main>
  );
};
export default Menu;
