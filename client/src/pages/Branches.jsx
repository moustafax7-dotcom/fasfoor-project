import PageIntro from '../components/common/PageIntro.jsx';
import StatePanel from '../components/common/StatePanel.jsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BranchCard from '../components/branches/BranchCard.jsx';
import { useCart } from '../context/CartContext.jsx';
import { getBranches } from '../services/branchService.js';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { switchBranch } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    getBranches().then((res) => setBranches(res.data || [])).catch(() => setError('تعذر تحميل الفروع')).finally(() => setLoading(false));
  }, []);

  const handleSelect = (branch) => { if (switchBranch(branch._id)) navigate('/menu'); };

  return (
    <main className="branches-page">
      <PageIntro title="فروع فسفور" description="اختار الفرع المناسب ليك وشوف المنيو ومواعيد العمل." />
      {loading && <div className="page-loading">جاري التحميل...</div>}
      {error && <StatePanel error title={error} onRetry={() => window.location.reload()} />}
      {!loading && !error && !branches.length && <StatePanel title="بيانات الفروع غير متاحة حاليًا" description="تقدر تتواصل مع المطعم على 17397 للاستفسار عن أقرب فرع." to="/" actionLabel="العودة للرئيسية" />}
      <div className="branches-grid">{branches.map((b) => <BranchCard key={b._id} branch={b} onSelect={handleSelect} />)}</div>
    </main>
  );
};
export default Branches;
