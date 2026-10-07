import { useState, useEffect } from 'react';
const emptyForm = { name: '', description: '', category: '', price: '', branches: [], isAvailable: true, image: '', imageFile: null, weightPrices: [] };
const ItemFormModal = ({ open, onClose, onSave, categories, branches, initialData }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    setError(null);
    setForm(initialData ? {
      name: initialData.name || '', description: initialData.description || '', category: initialData.category?._id || '',
      price: initialData.price ?? '', branches: initialData.branches?.map((b) => b._id) || [], isAvailable: initialData.isAvailable, image: initialData.image || '', imageFile: null, weightPrices: initialData.weightPrices || [],
    } : emptyForm);
  }, [initialData, open]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.branches.length) { setError('اختر فرعًا واحدًا على الأقل'); return; }
    setSaving(true); setError(null);
    try {
      const payload = { ...form };
      if (payload.price === '' && payload.weightPrices.length) delete payload.price;
      await onSave(payload);
    } catch (err) {
      setError(err.response?.data?.message || 'تعذر حفظ الصنف');
    } finally { setSaving(false); }
  };
  if (!open) return null;
  const toggleBranch = (id) => setForm((f) => ({ ...f, branches: f.branches.includes(id) ? f.branches.filter((b) => b !== id) : [...f.branches, id] }));
  return (
    <div className="modal-overlay" onClick={() => !saving && onClose()}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
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
        <input type="number" min="0" step="0.01" required={!form.weightPrices.length} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        {form.weightPrices.length > 0 && <p>أسعار الأوزان الحالية محفوظة عند تعديل بيانات الصنف.</p>}
        <label htmlFor="item-image-url">رابط الصورة (HTTPS)</label>
        <input id="item-image-url" type="text" inputMode="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <label htmlFor="item-image-file">أو رفع صورة (JPEG، PNG، WebP — حتى 4 ميجابايت)</label>
        <input id="item-image-file" key={`${initialData?._id || 'new'}-${open}`} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => {
          const file = e.target.files?.[0] || null;
          if (file && file.size > 4 * 1024 * 1024) { setError('الصورة أكبر من 4 ميجابايت'); e.target.value = ''; return; }
          setError(null); setForm({ ...form, imageFile: file });
        }} />
        <label>الفروع المتاح بها</label>
        <div className="branch-checkboxes">
          {branches.map((b) => <label key={b._id}><input type="checkbox" checked={form.branches.includes(b._id)} onChange={() => toggleBranch(b._id)} />{b.name}</label>)}
        </div>
        {error && <div className="page-error" role="alert">{error}</div>}
        <div className="modal-actions">
          <button type="button" className="modal-cancel" disabled={saving} onClick={onClose}>إلغاء</button>
          <button type="submit" className="modal-save" disabled={saving}>{saving ? 'جاري الحفظ...' : 'حفظ'}</button>
        </div>
      </form>
    </div>
  );
};
export default ItemFormModal;
