import { Link, useLocation } from 'react-router-dom';

const StatePanel = ({ title, description, to, actionLabel, onRetry, error = false }) => {
  const location = useLocation();
  return (
  <section className={`state-panel${error ? ' state-panel-error' : ''}`} role={error ? 'alert' : undefined}>
    <svg className="state-panel-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
      {error ? <path d="M24 13v14m0 7v1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /> : <path d="M14 21h20l-2 13H16l-2-13Zm5 0 5-9 5 9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />}
    </svg>
    <h2>{title}</h2>
    {description && <p>{description}</p>}
    <div className="state-panel-actions">
      {to && <Link className="hero-order-btn" to={to} state={to === "/login" ? { from: location.pathname + location.search } : undefined}>{actionLabel || 'تصفح المنيو'}</Link>}
      {onRetry && <button className="secondary-action" type="button" onClick={onRetry}>إعادة المحاولة</button>}
    </div>
  </section>
  );
};
export default StatePanel;
