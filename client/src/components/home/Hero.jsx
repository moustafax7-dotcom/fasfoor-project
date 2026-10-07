import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';

const Hero = ({ branches = [], loading = false }) => {
  const { switchBranch } = useCart();
  const navigate = useNavigate();
  const chooseBranch = (id) => { if (switchBranch(id)) navigate('/menu'); };
  return (
    <section className="hero" aria-labelledby="home-title">
      <div className="hero-content">
        <p className="hero-eyebrow">فسفور · مأكولات بحرية</p>
        <h1 id="home-title">ليه تاكل أي حاجة<br /><span>لما ممكن تاكل أفيد حاجة</span></h1>
        <p className="hero-sub">اختار فرعك، شوف المنيو، وظبّط طلبك على ذوقك.</p>
        <div className="hero-actions">
          <Link to="/menu" className="hero-order-btn">تصفح المنيو <span aria-hidden="true">←</span></Link>
          <Link to="/branches" className="hero-secondary">اعرف أقرب فرع</Link>
        </div>
        <div className="hero-branch-picker">
          <div className="hero-branch-heading"><span>ابدأ من فرعك</span><span className="hero-branch-hint">المنيو حسب الفرع</span></div>
          {loading && <p className="hero-availability" role="status">بنحمّل الفروع المتاحة…</p>}
          {!loading && !branches.length && <p className="hero-availability">المنيو الإلكتروني غير متاح حاليًا. تقدر تتواصل مع المطعم للاستفسار.</p>}
          <div className="hero-branches">
            {branches.map((branch) => (
              <button className="hero-branch-card" key={branch._id} onClick={() => chooseBranch(branch._id)}>
                <span className="hero-branch-name">{branch.name}</span>
                <span className={branch.isOpen ? 'hero-branch-status is-open' : 'hero-branch-status'}>{branch.isOpen ? 'يستقبل الطلبات' : 'مغلق حاليًا'}</span>
                <span className="hero-branch-detail">{branch.isOpen && branch.estimatedDeliveryMinutes ? `وقت التوصيل المتوقع ${branch.estimatedDeliveryMinutes} دقيقة` : 'شوف المنيو وتفاصيل الفرع'}</span>
                <span className="hero-branch-arrow" aria-hidden="true">←</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <figure className="hero-food-panel">
        <img src="/images/brand/seafood-hero.webp" alt="تشكيلة مأكولات بحرية — صورة تعبيرية" width="1536" height="1024" fetchPriority="high" />
        <figcaption>صورة تعبيرية · صور الأصناف داخل المنيو</figcaption>
      </figure>
    </section>
  );
};
export default Hero;
