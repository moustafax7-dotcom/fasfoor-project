const OrdersChart = ({ data = [] }) => {
  if (!data.length) return null;
  const width = 600, height = 220, padding = 30;
  const max = Math.max(...data.map((d) => d.value), 10);
  const points = data.map((d, i) => {
    const x = padding + (i * (width - padding * 2)) / (data.length - 1 || 1);
    const y = height - padding - (d.value / max) * (height - padding * 2);
    return `${x},${y}`;
  });
  return (
    <div className="orders-chart">
      <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg">
        <polyline fill="none" stroke="var(--color-accent)" strokeWidth="3" points={points.join(' ')} />
        {data.map((d, i) => { const [x, y] = points[i].split(','); return <circle key={d.label} cx={x} cy={y} r="4" fill="var(--color-accent)" />; })}
      </svg>
      <div className="chart-labels">{data.map((d) => <span key={d.label}>{d.label}</span>)}</div>
    </div>
  );
};
export default OrdersChart;
