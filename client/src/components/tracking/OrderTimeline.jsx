const deliverySteps = [
  { key: 'new', label: 'تم استلام الطلب' },
  { key: 'preparing', label: 'جاري التحضير' },
  { key: 'ready', label: 'جاهز للتسليم' },
  { key: 'out_for_delivery', label: 'خرج للتوصيل' },
  { key: 'delivered', label: 'تم التوصيل' },
];
const OrderTimeline = ({ order }) => {
  if (order.status === 'cancelled') return <div className="tracking-cancelled" role="status"><strong>تم إلغاء الطلب</strong><p>{order.cancelReason || 'تواصل مع الفرع لو محتاج تستفسر عن تفاصيل الإلغاء.'}</p></div>;
  const pickup = order.deliveryType === 'pickup';
  const steps = deliverySteps.filter((step) => !pickup || step.key !== 'out_for_delivery');
  const currentIndex = steps.findIndex((step) => step.key === order.status);
  return (
    <ol className="order-timeline" aria-label="مراحل الطلب">
      {steps.map((step, index) => {
        const historyEntry = order.statusHistory?.find((entry) => entry.status === step.key);
        const timestamp = historyEntry?.at ? new Date(historyEntry.at) : null;
        const label = pickup && step.key === 'delivered' ? 'تم الاستلام من الفرع' : step.label;
        return (
          <li className={`timeline-step ${index <= currentIndex ? 'done' : ''} ${index === currentIndex ? 'current' : ''}`} key={step.key} aria-current={index === currentIndex ? 'step' : undefined}>
            <span className="timeline-icon" aria-hidden="true">{index < currentIndex ? '✓' : index + 1}</span>
            <div><strong>{label}</strong>{timestamp && !Number.isNaN(timestamp.getTime()) && <time className="timeline-time" dateTime={timestamp.toISOString()}>{timestamp.toLocaleString('ar-EG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</time>}</div>
          </li>
        );
      })}
    </ol>
  );
};
export default OrderTimeline;
