import { useEffect, useState } from 'react';
import OfferFormModal from '../components/offers/OfferFormModal.jsx';
import { getOffers } from '../../services/offerService.js';
import { getBranches } from '../../services/branchService.js';
import { adminApi as api } from '../../services/api.js';

const createOfferAdmin = (data) => api.post('/offers', data).then((r) => r.data);
const updateOfferAdmin = (id, data) => api.put(`/offers/${id}`, data).then((r) => r.data);
const deleteOfferAdmin = (id) => api.delete(`/offers/${id}`).then((r) => r.data);

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => { setLoading(true); getOffers().then((res) => setOffers(res.data || [])).finally(() => setLoading(false)); };
  useEffect(() => { load(); getBranches().then((res) => setBranches(res.data || [])); }, []);

  const handleSave = async (form) => {
    if (editingOffer) await updateOfferAdmin(editingOffer._id, form); else await createOfferAdmin(form);
    setModalOpen(false); setEditingOffer(null); load();
  };
  const handleTogglePause = async (offer) => { await updateOfferAdmin(offer._id, { isActive: !offer.isActive }); load(); };
  const handleDelete = async (id) => { if (!confirm('تأكيد حذف العرض؟')) return; await deleteOfferAdmin(id); load(); };

  return (
    <div className="admin-offers-page">
      <div className="admin-page-header">
        <h1>إدارة العروض</h1>
        <button className="add-btn" onClick={() => { setEditingOffer(null); setModalOpen(true); }}>+ إضافة عرض</button>
      </div>
      {loading && <div className="page-loading">جاري التحميل...</div>}
      {!loading && (
        <table className="admin-table">
          <thead><tr><th>اسم العرض</th><th>الفرع</th><th>السعر</th><th>الفترة</th><th>الحالة</th><th>إجراءات</th></tr></thead>
          <tbody>
            {offers.map((o) => (
              <tr key={o._id}>
                <td><strong>{o.title}</strong>{o.description && <p className="table-desc">{o.description}</p>}</td>
                <td>{o.branches?.map((b) => b.name).join('، ')}</td>
                <td>{o.price} جنيه</td>
                <td className="table-muted">{new Date(o.startDate).toLocaleDateString('ar-EG')} - {new Date(o.endDate).toLocaleDateString('ar-EG')}</td>
                <td><span className={`badge ${o.isActive ? 'badge-green' : 'badge-gray'}`}>{o.isActive ? 'نشط' : 'متوقف'}</span></td>
                <td className="table-actions">
                  <button onClick={() => handleTogglePause(o)}>{o.isActive ? '⏸ إيقاف' : '▶ تفعيل'}</button>
                  <button onClick={() => { setEditingOffer(o); setModalOpen(true); }}>✎ تعديل</button>
                  <button onClick={() => handleDelete(o._id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <OfferFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditingOffer(null); }} onSave={handleSave} branches={branches} initialData={editingOffer} />
    </div>
  );
};
export default Offers;
