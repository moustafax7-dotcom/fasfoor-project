import { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory } from '../../services/categoryService.js';
import { useAuth } from '../../context/AuthContext.jsx';

const emptyForm = { name: '', order: 0, icon: '' };
const Categories = () => {
  const { admin } = useAuth();
  const canEdit = admin?.role === 'super_admin';
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [notice, setNotice] = useState(null);
  const load = async () => {
    setLoading(true); setError(null);
    try { const res = await getCategories(); setCategories(res.data || []); }
    catch { setError('تعذر تحميل أقسام المنيو'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  const startEdit = (category) => {
    setEditing(category._id); setForm({ name: category.name, order: category.order, icon: category.icon || '' }); setFormError(null); setNotice(null);
  };
  const reset = () => { setEditing(null); setForm(emptyForm); setFormError(null); };
  const save = async (event) => {
    event.preventDefault(); if (saving) return;
    setSaving(true); setFormError(null); setNotice(null);
    try {
      const data = { ...form, name: form.name.trim(), order: Number(form.order) };
      if (editing) await updateCategory(editing, data); else await createCategory(data);
      reset(); setNotice('تم حفظ القسم. الترتيب الأصغر بيظهر أولًا في المنيو.'); await load();
    } catch (err) { setFormError(err.response?.data?.message || 'تعذر حفظ القسم'); }
    finally { setSaving(false); }
  };
  return (
    <div className="admin-categories-page">
      <div className="admin-page-header"><div><h1>أقسام المنيو</h1><p>نظّم الأقسام ورتّب ظهورها للعميل، وبعدها اربط الأصناف بالقسم المناسب.</p></div></div>
      {notice && <p className="admin-notice" role="status">{notice}</p>}
      <div className="category-editor-layout">
        <section className="settings-card">
          <h2>الأقسام الحالية</h2>
          {loading && <p role="status">جاري التحميل…</p>}
          {error && <div className="form-error" role="alert">{error} <button type="button" onClick={load}>إعادة المحاولة</button></div>}
          {!loading && !error && !categories.length && <p>لسه مفيش أقسام. أضف أول قسم علشان تقدر تضيف أصناف المنيو.</p>}
          {!!categories.length && <div className="category-list">{categories.map((category) => (
            <div className="category-row" key={category._id}><div><strong>{category.icon} {category.name}</strong><p>ترتيب الظهور: {category.order}</p></div>{canEdit && <button type="button" className="edit-btn" disabled={saving} onClick={() => startEdit(category)}>تعديل</button>}</div>
          ))}</div>}
        </section>
        {canEdit ? <form className="settings-card category-form" onSubmit={save}>
          <h2>{editing ? 'تعديل القسم' : 'إضافة قسم'}</h2>
          <label htmlFor="category-name">اسم القسم</label><input id="category-name" required maxLength={80} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <label htmlFor="category-order">ترتيب الظهور</label><input id="category-order" type="number" required min={0} max={9999} step={1} value={form.order} onChange={(event) => setForm({ ...form, order: event.target.value })} />
          <label htmlFor="category-icon">رمز قصير (اختياري)</label><input id="category-icon" maxLength={40} value={form.icon} onChange={(event) => setForm({ ...form, icon: event.target.value })} />
          {formError && <p className="form-error" role="alert">{formError}</p>}
          <div className="modal-actions"><button type="submit" className="modal-save" disabled={saving}>{saving ? 'جاري الحفظ…' : 'حفظ القسم'}</button>{editing && <button type="button" disabled={saving} className="modal-cancel" onClick={reset}>إلغاء التعديل</button>}</div>
        </form> : <section className="settings-card"><p>إضافة وتعديل الأقسام متاحان لمدير النظام.</p></section>}
      </div>
    </div>
  );
};
export default Categories;
