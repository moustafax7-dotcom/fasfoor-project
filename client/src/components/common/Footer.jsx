import { Link } from 'react-router-dom';
const Footer = () => (
  <footer className="site-footer">
    <div className="footer-brand"><strong>فسفور</strong><span>مأكولات بحرية</span></div>
    <nav aria-label="روابط أسفل الصفحة"><Link to="/menu">المنيو</Link><Link to="/branches">الفروع</Link><Link to="/account/orders">متابعة طلباتك</Link></nav>
    <a className="footer-contact" href="tel:17397"><span>للطلب والاستفسار</span><strong dir="ltr">17397</strong></a>
  </footer>
);
export default Footer;
