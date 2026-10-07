const steps = [
  { title: 'اختار فرعك', detail: 'شوف الأصناف المتاحة في الفرع المناسب ليك.' },
  { title: 'ظبّط طلبك', detail: 'اختار الحجم والإضافات وراجع سعر كل صنف.' },
  { title: 'راجع قبل التأكيد', detail: 'التوصيل أو الاستلام، والخصم، والإجمالي في مكان واحد.' },
];
const FeaturesBar = () => (
  <section className="order-guide" aria-labelledby="order-guide-title">
    <div className="order-guide-heading"><p>من المنيو لطلبك</p><h2 id="order-guide-title">كل التفاصيل قدامك.</h2></div>
    <ol>{steps.map((step, index) => <li key={step.title}><span className="order-guide-number" aria-hidden="true">0{index + 1}</span><div><h3>{step.title}</h3><p>{step.detail}</p></div></li>)}</ol>
  </section>
);
export default FeaturesBar;
