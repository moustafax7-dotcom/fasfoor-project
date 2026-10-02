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
      <div className="branches-header"><h1>فروع فسفور</h1><p>أقرب فرع ليك.. وخدمة بنفس الجودة والطعم المميز</p></div>
      {loading && <div className="page-loading">جاري التحميل...</div>}
      {error && <div className="page-error">{error}</div>}
      <div className="branches-grid">{branches.map((b) => <BranchCard key={b._id} branch={b} onSelect={handleSelect} />)}</div>
    </main>
  );
};
export default Branches;
