import { useState, useEffect } from 'react';
const emptyForm = { name: '', description: '', category: '', price: '', branches: [], isAvailable: true };
const ItemFormModal = ({ open, onClose, onSave, categories, branches, initialData }) => {
  const [form, setForm] = useState(emptyForm);
  useEffect(() => {
    setForm(initialData ? {
      name: initialData.name || '', description: initialData.description || '', category: initialData.category?._id || '',
      price: initialData.price || '', branches: initialData.branches?.map((b) => b._id) || [], isAvailable: initialData.isAvailable,
    } : emptyForm);
  }, [initialData, open]);
  if (!open) return null;
  const toggleBranch = (id) => setForm((f) => ({ ...f, branches: f.branches.includes(id) ? f.branches.filter((b) => b !== id) : [...f.branches, id] }));
  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
        <h2>{initialData ? 'تعديل الصنف' : 'إضافة صنف جديد'}</h2>
        <label>اسم الصنف</label>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label>الوصف</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <label>القسم</label>
        <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="" disabled>اختر القسم</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <label>السعر (جنيه)</label>
        <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <label>الفروع المتاح بها</label>
        <div className="branch-checkboxes">
          {branches.map((b) => <label key={b._id}><input type="checkbox" checked={form.branches.includes(b._id)} onChange={() => toggleBranch(b._id)} />{b.name}</label>)}
        </div>
        <div className="modal-actions">
          <button type="button" className="modal-cancel" onClick={onClose}>إلغاء</button>
          <button type="submit" className="modal-save">حفظ</button>
        </div>
      </form>
    </div>
  );
};
export default ItemFormModal;
