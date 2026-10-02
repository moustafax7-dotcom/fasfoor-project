import { useEffect, useState } from 'react';
import PermissionsMatrix from '../components/permissions/PermissionsMatrix.jsx';
import AdminUserFormModal from '../components/permissions/AdminUserFormModal.jsx';
import { getRoles, updatePermissions } from '../../services/roleService.js';
import { getAdminUsers, createAdminUser } from '../../services/adminUserService.js';
import { getBranches } from '../../services/branchService.js';

const StaffPermissions = () => {
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getRoles(), getBranches(), getAdminUsers()])
      .then(([rolesRes, branchesRes]) => { setRoles(rolesRes.data || []); setBranches(branchesRes.data || []); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleToggle = (role, moduleKey) => {
    setRoles((prev) => prev.map((r) => r.role === role ? { ...r, permissions: { ...r.permissions, [moduleKey]: !r.permissions[moduleKey] } } : r));
    setDirty(true);
  };
  const handleSave = async () => { setSaving(true); await updatePermissions(roles.map((r) => ({ role: r.role, permissions: r.permissions }))); setSaving(false); setDirty(false); };
  const handleSaveUser = async (form) => { await createAdminUser(form); setUserModalOpen(false); load(); };

  if (loading) return <div className="page-loading">جاري التحميل...</div>;

  return (
    <div className="admin-permissions-page">
      <div className="admin-page-header">
        <button className="add-btn" onClick={() => setUserModalOpen(true)}>+ إضافة مستخدم</button>
        <div><h1>صلاحيات الموظفين</h1><p className="page-subtitle">إدارة أدوار المستخدمين والصلاحيات الممنوحة لكل دور في النظام</p></div>
      </div>
      <div className="permissions-card">
        <div className="permissions-toolbar">
          <button className="save-permissions-btn" onClick={handleSave} disabled={!dirty || saving}>🔒 {saving ? 'جاري الحفظ...' : 'حفظ الصلاحيات'}</button>
          <h3>الأدوار والصلاحيات</h3>
        </div>
        <PermissionsMatrix roles={roles} onToggle={handleToggle} />
        <div className="permissions-legend"><span><span className="legend-dot allowed">✓</span> مسموح</span><span><span className="legend-dot">—</span> غير مسموح</span></div>
      </div>
      <AdminUserFormModal open={userModalOpen} onClose={() => setUserModalOpen(false)} onSave={handleSaveUser} branches={branches} />
    </div>
  );
};
export default StaffPermissions;
