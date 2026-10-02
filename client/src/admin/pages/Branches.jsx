import { useEffect, useState } from 'react';
import BranchAdminCard from '../components/branches/BranchAdminCard.jsx';
import { getBranches, updateBranch } from '../../services/branchService.js';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const load = () => { setLoading(true); getBranches().then((res) => setBranches(res.data || [])).catch(() => setError('تعذر تحميل الفروع')).finally(() => setLoading(false)); };
  useEffect(load, []);
  const handleToggleOpen = async (branch) => { await updateBranch(branch._id, { isOpen: !branch.isOpen }); load(); };
  return (
    <div className="admin-branches-page">
      <div className="admin-page-header"><h1>الفروع</h1></div>
      {loading && <div className="page-loading">جاري التحميل...</div>}
      {error && <div className="page-error">{error}</div>}
      <div className="branch-admin-grid">{branches.map((b) => <BranchAdminCard key={b._id} branch={b} onToggleOpen={handleToggleOpen} onEdit={() => {}} />)}</div>
    </div>
  );
};
export default Branches;
