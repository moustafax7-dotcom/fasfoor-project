import { useEffect, useState } from 'react';
import ItemsTable from '../components/items/ItemsTable.jsx';
import ItemFormModal from '../components/items/ItemFormModal.jsx';
import { getItems, createItem, updateItem, toggleItemAvailability, approveItemPrice } from '../../services/itemService.js';
import { getCategories } from '../../services/categoryService.js';
import { getBranches } from '../../services/branchService.js';

const Items = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchFilter, setBranchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadItems = () => {
    setLoading(true);
    getItems({ branch: branchFilter || undefined, category: categoryFilter || undefined })
      .then((res) => setItems(res.data || [])).catch(() => setError('تعذر تحميل الأصناف')).finally(() => setLoading(false));
  };

  useEffect(() => { Promise.all([getCategories(), getBranches()]).then(([c, b]) => { setCategories(c.data || []); setBranches(b.data || []); }); }, []);
  useEffect(() => { loadItems(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchFilter, categoryFilter]);

  const handleToggle = async (id) => { await toggleItemAvailability(id); loadItems(); };
  const handleApprove = async (id) => { await approveItemPrice(id); loadItems(); };
  const handleSave = async (form) => {
    try {
      if (editingItem) await updateItem(editingItem._id, form); else await createItem(form);
      setModalOpen(false); setEditingItem(null); loadItems();
    } catch { setError('تعذر حفظ الصنف'); }
  };

  return (
    <div className="admin-items-page">
      <div className="admin-page-header">
        <h1>إدارة الأصناف والأسعار</h1>
        <button className="add-btn" onClick={() => { setEditingItem(null); setModalOpen(true); }}>+ إضافة صنف</button>
      </div>
      <div className="admin-filters">
        <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
          <option value="">كل الفروع</option>
          {branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">كل الأقسام</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>
      {loading && <div className="page-loading">جاري التحميل...</div>}
      {error && <div className="page-error">{error}</div>}
      {!loading && <ItemsTable items={items} onToggleAvailability={handleToggle} onApprove={handleApprove} onEdit={(item) => { setEditingItem(item); setModalOpen(true); }} />}
      <ItemFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditingItem(null); }} onSave={handleSave} categories={categories} branches={branches} initialData={editingItem} />
    </div>
  );
};
export default Items;
