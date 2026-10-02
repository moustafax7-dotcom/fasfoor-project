import { useState } from 'react';
import { validateCoupon } from '../../services/couponService.js';

const CouponBox = ({ branchId, subtotal, appliedCoupon, onApply, onRemove }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true); setError(null);
    try {
      const res = await validateCoupon(code.trim(), branchId);
      onApply(res.data);
      setCode('');
    } catch (err) {
      setError(err.response?.data?.message || 'كود الخصم غير صالح');
    } finally { setLoading(false); }
  };

  if (appliedCoupon) {
    const discount = appliedCoupon.discountType === 'percentage'
      ? Math.round((subtotal * appliedCoupon.value) / 100)
      : Math.min(appliedCoupon.value, subtotal);
    return (
      <div className="coupon-box coupon-applied">
        <div>
          <span className="coupon-applied-code">🎟 {appliedCoupon.code}</span>
          <span className="coupon-applied-discount">خصم {discount} جنيه</span>
        </div>
        <button onClick={onRemove}>إزالة</button>
      </div>
    );
  }

  return (
    <div className="coupon-box">
      <div className="coupon-input-row">
        <input placeholder="عندك كود خصم؟" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
        <button onClick={handleApply} disabled={loading}>{loading ? '...' : 'تطبيق'}</button>
      </div>
      {error && <span className="coupon-error">{error}</span>}
    </div>
  );
};
export default CouponBox;
