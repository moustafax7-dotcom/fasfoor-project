const steps = [
  { key: 'new', icon: '📋', label: 'تم استلام الطلب' },
  { key: 'preparing', icon: '🍳', label: 'جاري التحضير' },
  { key: 'ready', icon: '✅', label: 'جاهز للتسليم' },
  { key: 'out_for_delivery', icon: '🛵', label: 'خرج للتوصيل' },
  { key: 'delivered', icon: '🏠', label: 'وصل لك بالهنا' },
];
const OrderTimeline = ({ order }) => {
  const currentIndex = steps.findIndex((s) => s.key === order.status);
  return (
    <div className="order-timeline">
      {steps.map((step, i) => {
        const historyEntry = order.statusHistory?.find((h) => h.status === step.key);
        const isDone = i <= currentIndex;
        return (
          <div className={`timeline-step ${isDone ? 'done' : ''}`} key={step.key}>
            <div className="timeline-icon">{step.icon}</div>
            <div>
              <strong>{step.label}</strong>
              {historyEntry && <div className="timeline-time">{new Date(historyEntry.at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default OrderTimeline;
