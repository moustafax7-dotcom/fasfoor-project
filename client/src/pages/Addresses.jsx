import PageIntro from '../components/common/PageIntro.jsx';
import StatePanel from '../components/common/StatePanel.jsx';
import { useEffect, useState } from 'react';
import AddressCard from '../components/addresses/AddressCard.jsx';
import AddressFormModal from '../components/addresses/AddressFormModal.jsx';
import { useCustomerAuth } from '../context/CustomerAuthContext.jsx';
import { getMyProfile } from '../services/customerAuthService.js';
import { addAddress, updateAddress, deleteAddress } from '../services/addressService.js';

const Addresses = () => {
  const { isAuthenticated } = useCustomerAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const load = () => { setLoading(true); setError(null); return getMyProfile().then((res) => setAddresses(res.data.customer.addresses || [])).catch(() => setError("تعذر تحميل العناوين، جرّب تاني")).finally(() => setLoading(false)); };
  useEffect(() => { if (isAuthenticated) load(); else setLoading(false); }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className="addresses-page account-guest">
        <PageIntro title="عناويني" /><StatePanel title="وصّل طلبك للعنوان المناسب" description="سجّل دخولك علشان تحفظ عناوينك وتختار منها وقت الطلب." to="/login" actionLabel="تسجيل الدخول" />
      </main>
    );
  }

  const handleSave = async (form) => {
    if (editingAddress) await updateAddress(editingAddress._id, form); else await addAddress(form);
    setModalOpen(false); setEditingAddress(null); load();
  };
  const handleDelete = async (address) => { if (!confirm('تأكيد حذف العنوان؟')) return; try { await deleteAddress(address._id); load(); } catch { setError('تعذر حذف العنوان، جرّب تاني'); } };
  const handleSetDefault = async (address) => { try { await updateAddress(address._id, { isDefault: true }); load(); } catch { setError('تعذر تحديث العنوان الافتراضي، جرّب تاني'); } };

  if (loading) return <div className="page-loading">جاري التحميل...</div>;

  return (
    <main className="addresses-page">
      <PageIntro title="عناويني" description="احفظ عنوانك واختاره بسهولة وقت الطلب.">
        <button className="add-btn" onClick={() => { setEditingAddress(null); setModalOpen(true); }}>+ إضافة عنوان</button>
      </PageIntro>
      {error && <StatePanel error title={error} onRetry={load} />}
      {!error && !addresses.length ? (
        <StatePanel title="لسه مفيش عناوين محفوظة" description="أضف عنوانك الأول من الزر فوق، وحدد عنوانك الافتراضي لتسهيل الطلب." />
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
