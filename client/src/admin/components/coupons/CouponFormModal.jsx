import { useState, useEffect } from 'react';
const emptyForm = { code: '', discountType: 'percentage', value: '', branches: [], usageLimit: 100, startDate: '', endDate: '' };
const CouponFormModal = ({ open, onClose, onSave, branches, initialData }) => {
  const [form, setForm] = useState(emptyForm);
  useEffect(() => {
    setForm(initialData ? {
      code: initialData.code, discountType: initialData.discountType, value: initialData.value,
      branches: initialData.branches?.map((b) => b._id) || [], usageLimit: initialData.usageLimit,
      startDate: initialData.startDate?.slice(0, 10) || '', endDate: initialData.endDate?.slice(0, 10) || '',
    } : emptyForm);
  }, [initialData, open]);
  if (!open) return null;
  const toggleBranch = (id) => setForm((f) => ({ ...f, branches: f.branches.includes(id) ? f.branches.filter((b) => b !== id) : [...f.branches, id] }));
  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
        <h2>{initialData ? 'تعديل الكوبون' : 'إنشاء كوبون جديد'}</h2>
        <label>الكود</label>
        <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="FOS20" />
        <div className="form-row">
          <div><label>نوع الخصم</label><select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}><option value="percentage">نسبة مئوية %</option><option value="fixed">مبلغ ثابت (جنيه)</option></select></div>
          <div><label>القيمة</label><input type="number" required value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></div>
        </div>
        <label>الحد الأقصى للاستخدام</label>
        <input type="number" required value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
        <div className="form-row">
          <div><label>تاريخ البداية</label><input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
          <div><label>تاريخ النهاية</label><input type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
        </div>
        <label>الفروع (اتركها فارغة = كل الفروع)</label>
        <div className="branch-checkboxes">{branches.map((b) => <label key={b._id}><input type="checkbox" checked={form.branches.includes(b._id)} onChange={() => toggleBranch(b._id)} />{b.name}</label>)}</div>
        <div className="modal-actions"><button type="button" className="modal-cancel" onClick={onClose}>إلغاء</button><button type="submit" className="modal-save">حفظ</button></div>
      </form>
    </div>
  );
};
export default CouponFormModal;
