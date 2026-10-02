import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AddressCard from '../components/addresses/AddressCard.jsx';
import AddressFormModal from '../components/addresses/AddressFormModal.jsx';
import { useCustomerAuth } from '../context/CustomerAuthContext.jsx';
import { getMyProfile } from '../services/customerAuthService.js';
import { addAddress, updateAddress, deleteAddress } from '../services/addressService.js';

const Addresses = () => {
  const { isAuthenticated } = useCustomerAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const load = () => { getMyProfile().then((res) => setAddresses(res.data.customer.addresses || [])).finally(() => setLoading(false)); };
  useEffect(() => { if (isAuthenticated) load(); else setLoading(false); }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className="addresses-page account-guest">
        <h1>عناويني</h1><p>سجّل دخولك لإدارة عناوين التوصيل</p>
        <Link to="/login" className="hero-order-btn">تسجيل الدخول</Link>
      </main>
    );
  }

  const handleSave = async (form) => {
    if (editingAddress) await updateAddress(editingAddress._id, form); else await addAddress(form);
    setModalOpen(false); setEditingAddress(null); load();
  };
  const handleDelete = async (address) => { if (!confirm('تأكيد حذف العنوان؟')) return; await deleteAddress(address._id); load(); };
  const handleSetDefault = async (address) => { await updateAddress(address._id, { isDefault: true }); load(); };

  if (loading) return <div className="page-loading">جاري التحميل...</div>;

  return (
    <main className="addresses-page">
      <div className="admin-page-header">
        <h1>عناويني</h1>
        <button className="add-btn" onClick={() => { setEditingAddress(null); setModalOpen(true); }}>+ إضافة عنوان</button>
      </div>
      {!addresses.length ? (
        <div className="menu-empty">لسه معندكش عناوين محفوظة. أضف عنوانك الأول عشان الطلب يبقى أسرع.</div>
      ) : (
        <div className="addresses-grid">
          {addresses.map((a) => <AddressCard key={a._id} address={a} onEdit={(addr) => { setEditingAddress(addr); setModalOpen(true); }} onDelete={handleDelete} onSetDefault={handleSetDefault} />)}
        </div>
      )}
      <AddressFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditingAddress(null); }} onSave={handleSave} initialData={editingAddress} />
    </main>
  );
};
export default Addresses;
