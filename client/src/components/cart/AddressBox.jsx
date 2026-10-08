import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext.jsx';
import { getMyProfile } from '../../services/customerAuthService.js';

const AddressBox = ({ address, onChange }) => {
  const { isAuthenticated } = useCustomerAuth();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState(null);
  const currentAddress = useRef(address);
  currentAddress.current = address;
  useEffect(() => {
    let active = true;
    setSavedAddresses([]); setSelectedId(''); setError(null);
    if (isAuthenticated) getMyProfile().then((response) => {
      if (!active) return;
      const list = response.data.customer.addresses || [];
      setSavedAddresses(list);
      const defaultAddress = list.find((entry) => entry.isDefault) || list[0];
      if (defaultAddress && !currentAddress.current) { setSelectedId(defaultAddress._id); onChange(defaultAddress.fullAddress); }
    }).catch(() => { if (active) setError('تعذر تحميل العناوين المحفوظة. تقدر تكتب العنوان بنفسك.'); });
    return () => { active = false; };
  }, [isAuthenticated, onChange]);
  const selectAddress = (id) => {
    setSelectedId(id);
    const selected = savedAddresses.find((entry) => entry._id === id);
    if (selected) onChange(selected.fullAddress);
  };
  return (
    <div className="address-box">
      <label className="address-box-title" htmlFor="checkout-address">عنوان التوصيل</label>
      {!!savedAddresses.length && <select className="address-select" aria-label="اختيار عنوان محفوظ" value={selectedId} onChange={(event) => selectAddress(event.target.value)}>
        <option value="">إدخال عنوان يدويًا</option>{savedAddresses.map((entry) => <option key={entry._id} value={entry._id}>{entry.label || 'عنوان'} — {entry.fullAddress}</option>)}
      </select>}
      <textarea id="checkout-address" autoComplete="street-address" maxLength={500} value={address} onChange={(event) => { setSelectedId(''); onChange(event.target.value); }} placeholder="المنطقة، الشارع، رقم العمارة والدور، وأقرب علامة مميزة" />
      {error && <p className="form-error" role="alert">{error}</p>}
      {isAuthenticated && <Link to="/account/addresses" className="manage-addresses-link">إدارة العناوين المحفوظة</Link>}
    </div>
  );
};
export default AddressBox;
