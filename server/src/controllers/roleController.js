const RolePermission = require('../models/RolePermission');
const Admin = require('../models/Admin');
const defaultRoles = [
  { role: 'super_admin', label: 'مدير النظام', permissions: { orders: true, items: true, reports: true, branches: true, customers: true } },
  { role: 'branch_manager', label: 'مدير فرع', permissions: { orders: true, items: true, reports: true, branches: true, customers: true } },
  { role: 'cashier', label: 'كاشير', permissions: { orders: true, items: true, reports: false, branches: false, customers: false } },
  { role: 'kitchen', label: 'المطبخ', permissions: { orders: true, items: false, reports: false, branches: false, customers: false } },
  { role: 'customer_service', label: 'خدمة العملاء', permissions: { orders: true, items: false, reports: false, branches: false, customers: true } },
];
exports.getRoles = async (req, res, next) => {
  try {
    let roles = await RolePermission.find();
    if (!roles.length) roles = await RolePermission.insertMany(defaultRoles);
    const withCounts = await Promise.all(
      roles.map(async (r) => ({ ...r.toObject(), userCount: await Admin.countDocuments({ role: r.role }) }))
    );
    res.json({ success: true, data: withCounts });
  } catch (err) { next(err); }
};
exports.updatePermissions = async (req, res, next) => {
  try {
    const { roles } = req.body;
    const updates = await Promise.all(
      roles.map((r) => RolePermission.findOneAndUpdate({ role: r.role }, { permissions: r.permissions }, { new: true, upsert: true }))
    );
    res.json({ success: true, data: updates });
  } catch (err) { next(err); }
};
