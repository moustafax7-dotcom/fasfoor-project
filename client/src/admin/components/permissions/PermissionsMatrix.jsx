const modules = [
  { key: 'orders', label: 'الطلبات' }, { key: 'items', label: 'الأصناف والأسعار' }, { key: 'reports', label: 'التقارير' },
  { key: 'branches', label: 'الفروع' }, { key: 'customers', label: 'العملاء' },
];
const PermissionsMatrix = ({ roles = [], onToggle }) => (
  <table className="permissions-table">
    <thead><tr><th>الدور</th>{modules.map((m) => <th key={m.key}>{m.label}</th>)}</tr></thead>
    <tbody>
      {roles.map((r) => (
        <tr key={r.role}>
          <td><strong>{r.label}</strong><span className="role-user-count">{r.userCount} مستخدم</span></td>
          {modules.map((m) => (
            <td key={m.key}><button className={`permission-toggle ${r.permissions[m.key] ? 'allowed' : ''}`} onClick={() => onToggle(r.role, m.key)} type="button">{r.permissions[m.key] ? '✓' : '—'}</button></td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
export default PermissionsMatrix;
