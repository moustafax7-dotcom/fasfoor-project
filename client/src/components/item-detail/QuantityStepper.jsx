const QuantityStepper = ({ quantity, onChange }) => (
  <div className="quantity-stepper-lg">
    <button type="button" aria-label="تقليل الكمية" disabled={quantity <= 1} onClick={() => onChange(Math.max(1, quantity - 1))}>−</button>
    <span>{quantity}</span>
    <button type="button" aria-label="زيادة الكمية" disabled={quantity >= 100} onClick={() => onChange(Math.min(100, quantity + 1))}>+</button>
  </div>
);
export default QuantityStepper;
