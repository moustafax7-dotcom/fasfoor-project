import { Link } from 'react-router-dom';
const Hero = ({ branches = [] }) => (
  <section className="hero">
    <div className="hero-image">
      <img src="/images/menu/seafood-platter.jpg" alt="أطباق مأكولات بحرية فسفور" />
      <span className="hero-badge">جودة البحر مضمونة</span>
    </div>
    <div className="hero-content">
      <h1>ليه تاكل أي حاجة<br />لما ممكن تاكل أفيد حاجة</h1>
      <p className="hero-sub">أجود المأكولات البحرية، طازجة يوميًا</p>
      <div className="hero-branch-label">اختر فرعك</div>
      <div className="hero-branches">
        {branches.map((b) => (
          <div className="branch-card" key={b._id}>
            <span className="branch-tag">فرع</span>
            <h3>{b.name}</h3>
            <span className="branch-time">{b.estimatedDeliveryMinutes} دقيقة</span>
            <button className="branch-cta">توصيل الآن</button>
          </div>
        ))}
      </div>
      <Link to="/menu" className="hero-order-btn">اطلب الآن</Link>
    </div>
  </section>
);
export default Hero;
