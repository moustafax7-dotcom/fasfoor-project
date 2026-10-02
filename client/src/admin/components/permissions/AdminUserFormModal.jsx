import { useState, useEffect } from 'react';
const emptyForm = { name: '', username: '', password: '', role: 'staff', branch: '' };
const roleOptions = [
  { value: 'super_admin', label: 'مدير النظام' }, { value: 'branch_manager', label: 'مدير فرع' },
  { value: 'cashier', label: 'كاشير' }, { value: 'kitchen', label: 'المطبخ' }, { value: 'customer_service', label: 'خدمة العملاء' },
];
const AdminUserFormModal = ({ open, onClose, onSave, branches, initialData }) => {
  const [form, setForm] = useState(emptyForm);
  useEffect(() => { setForm(initialData ? { name: initialData.name, username: initialData.username, password: '', role: initialData.role, branch: initialData.branch?._id || '' } : emptyForm); }, [initialData, open]);
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
        <h2>{initialData ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}</h2>
        <label>الاسم</label>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label>اسم المستخدم / البريد</label>
        <input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <label>{initialData ? 'كلمة مرور جديدة (اتركها فارغة إن لم ترغب بالتغيير)' : 'كلمة المرور'}</label>
        <input type="password" required={!initialData} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <label>الدور الوظيفي</label>
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{roleOptions.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}</select>
        <label>الفرع (اختياري - فارغ يعني كل الفروع)</label>
        <select value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })}><option value="">كل الفروع</option>{branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}</select>
        <div className="modal-actions"><button type="button" className="modal-cancel" onClick={onClose}>إلغاء</button><button type="submit" className="modal-save">حفظ</button></div>
      </form>
    </div>
  );
};
export default AdminUserFormModal;
