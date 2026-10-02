// حاليًا الدفع كاش بس. زرار الدفع الإلكتروني هيترجع لما يترتبط ببوابة حقيقية (Paymob/Fawry).
const PaymentMethodSelector = () => (
  <div className="payment-method-box">
    <label>طريقة الدفع</label>
    <div className="payment-options">
      <div className="payment-option payment-option-active">💵 كاش عند الاستلام</div>
    </div>
  </div>
);

export default PaymentMethodSelector;
