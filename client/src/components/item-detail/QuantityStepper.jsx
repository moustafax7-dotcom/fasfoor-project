const QuantityStepper = ({ quantity, onChange }) => (
  <div className="quantity-stepper-lg">
    <button type="button" onClick={() => onChange(Math.max(1, quantity - 1))}>−</button>
    <span>{quantity}</span>
    <button type="button" onClick={() => onChange(quantity + 1)}>+</button>
  </div>
);
export default QuantityStepper;
