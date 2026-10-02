import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext.jsx';
import { getMyProfile } from '../../services/customerAuthService.js';

const AddressBox = ({ address, onChange }) => {
  const { isAuthenticated } = useCustomerAuth();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    getMyProfile().then((res) => {
      const list = res.data.customer.addresses || [];
      setSavedAddresses(list);
      const def = list.find((a) => a.isDefault) || list[0];
      if (def && !address) { setSelectedId(def._id); onChange(def.fullAddress); }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleSelect = (id) => {
    setSelectedId(id);
    const addr = savedAddresses.find((a) => a._id === id);
    if (addr) onChange(addr.fullAddress);
  };

  const handleManualEntry = () => {
    const value = prompt('اكتب عنوان التوصيل:', address);
    if (value) { setSelectedId(''); onChange(value); }
  };

  return (
    <div className="address-box">
      <div className="address-box-title">عنوان التوصيل</div>
      {isAuthenticated && savedAddresses.length > 0 && (
        <select className="address-select" value={selectedId} onChange={(e) => handleSelect(e.target.value)}>
          <option value="" disabled>اختر عنوانًا محفوظًا</option>
          {savedAddresses.map((a) => <option key={a._id} value={a._id}>{a.label || 'عنوان'} — {a.fullAddress}</option>)}
        </select>
      )}
      {!isAuthenticated || !savedAddresses.length ? <p>{address || 'لم يتم إضافة عنوان بعد'}</p> : null}
      <div className="address-box-actions">
        <button className="change-address-btn" onClick={handleManualEntry}>✎ إدخال عنوان آخر</button>
        {isAuthenticated && <Link to="/account/addresses" className="manage-addresses-link">إدارة عناويني</Link>}
      </div>
    </div>
  );
};
export default AddressBox;
