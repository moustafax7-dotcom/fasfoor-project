const OrderSummary = ({ subtotal, deliveryFee, discountAmount = 0, total, onConfirm, disabled }) => (
  <div className="order-summary">
    <h3>ملخص الطلب</h3>
    <div className="summary-row"><span>المجموع الفرعي</span><span>{subtotal} جنيه</span></div>
    {discountAmount > 0 && <div className="summary-row summary-discount"><span>خصم الكوبون</span><span>− {discountAmount} جنيه</span></div>}
    <div className="summary-row"><span>رسوم التوصيل</span><span>{deliveryFee} جنيه</span></div>
    <div className="summary-row summary-total"><span>الإجمالي الكلي</span><span>{total} جنيه</span></div>
    <button className="confirm-order-btn" onClick={onConfirm} disabled={disabled}>🦐 تأكيد الطلب</button>
    <p className="terms-note">بالضغط على تأكيد الطلب، أنت توافق على الشروط والأحكام</p>
  </div>
);
export default OrderSummary;
