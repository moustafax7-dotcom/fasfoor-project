import { useState, useEffect } from 'react';
const emptyForm = { title: '', description: '', price: '', branches: [], servesFrom: '', servesTo: '', startDate: '', endDate: '' };
const OfferFormModal = ({ open, onClose, onSave, branches, initialData }) => {
  const [form, setForm] = useState(emptyForm);
  useEffect(() => {
    if (initialData) setForm({
      title: initialData.title, description: initialData.description || '', price: initialData.price,
      branches: initialData.branches?.map((b) => b._id) || [], servesFrom: initialData.servesFrom || '', servesTo: initialData.servesTo || '',
      startDate: initialData.startDate?.slice(0, 10) || '', endDate: initialData.endDate?.slice(0, 10) || '',
    }); else setForm(emptyForm);
  }, [initialData, open]);
  if (!open) return null;
  const toggleBranch = (id) => setForm((f) => ({ ...f, branches: f.branches.includes(id) ? f.branches.filter((b) => b !== id) : [...f.branches, id] }));
  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
        <h2>{initialData ? 'تعديل العرض' : 'إضافة عرض جديد'}</h2>
        <label>اسم العرض</label>
        <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <label>الوصف</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <label>السعر (جنيه)</label>
        <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <div className="form-row">
          <div><label>يكفي من</label><input type="number" value={form.servesFrom} onChange={(e) => setForm({ ...form, servesFrom: e.target.value })} /></div>
          <div><label>إلى</label><input type="number" value={form.servesTo} onChange={(e) => setForm({ ...form, servesTo: e.target.value })} /></div>
        </div>
        <div className="form-row">
          <div><label>تاريخ البداية</label><input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
          <div><label>تاريخ النهاية</label><input type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
        </div>
        <label>الفروع</label>
        <div className="branch-checkboxes">{branches.map((b) => <label key={b._id}><input type="checkbox" checked={form.branches.includes(b._id)} onChange={() => toggleBranch(b._id)} />{b.name}</label>)}</div>
        <div className="modal-actions">
          <button type="button" className="modal-cancel" onClick={onClose}>إلغاء</button>
          <button type="submit" className="modal-save">حفظ</button>
        </div>
      </form>
    </div>
  );
};
export default OfferFormModal;
