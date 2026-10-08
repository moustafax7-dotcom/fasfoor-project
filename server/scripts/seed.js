/**
 * Development demo data. Review the menu, prices and contact details before using them.
 * التشغيل: npm run seed   (بعد ضبط MONGO_URI في .env)
 * Only runs on empty development collections; never deletes existing data.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const Admin = require('../src/models/Admin');
const Branch = require('../src/models/Branch');
const Category = require('../src/models/Category');
const Item = require('../src/models/Item');
const Offer = require('../src/models/Offer');
const Customer = require('../src/models/Customer');
const Coupon = require('../src/models/Coupon');
const LoyaltyConfig = require('../src/models/LoyaltyConfig');
const DeliveryZone = require('../src/models/DeliveryZone');
const DeliveryRep = require('../src/models/DeliveryRep');
const RolePermission = require('../src/models/RolePermission');

const CATEGORY_NAMES = [
  'العروض', 'الصواني', 'الشوربة', 'الوجبات', 'الطواجن',
  'الباستا', 'البوكسات', 'الساندويتش', 'الرنجة', 'المقبلات',
];

const MENU_ITEMS = [
  { name: 'بوكس تبأ للأكس (طلبان)', category: 'العروض', description: 'رنجة وبطارخ وصوص وعيش؛ يكفي فردين', price: 385 },
  { name: 'صينية المزاج', category: 'العروض', description: 'جمبري بترفلاي ومشوي + بلطي + أرز وسلطات', price: 1200 },
  { name: 'سبيط بلدي مقلي', category: 'الصواني', description: 'مع أرز صيادية وسلطات هدية عند طلب الكيلو', weightPrices: [{ unit: 'kilo', price: 1690 }] },
  { name: 'جمبري وسط قزاز مقشر', category: 'الصواني', description: 'الوزن بعد القلي', weightPrices: [{ unit: 'kilo', price: 1690 }] },
  { name: 'سمك فيليه مقلي', category: 'الصواني', description: 'مع أرز صيادية وسلطات هدية عند طلب الكيلو', weightPrices: [{ unit: 'kilo', price: 780 }] },
  { name: 'شوربة فسفور عالي كريمة', category: 'الشوربة', description: 'جمبري وسبيط وفيليه وكابوريا', price: 310 },
  { name: 'شوربة جمبري بيزك بالبطارخ', category: 'الشوربة', description: '', price: 150 },
  { name: 'شوربة استكانة بالمكونات', category: 'الشوربة', description: '', price: 150 },
  { name: 'ربع فيليه مشوي', category: 'الوجبات', description: 'أرز وسلطة وطحينة وعيش', price: 260 },
  { name: 'ربع مشكل مقلي', category: 'الوجبات', description: 'فيليه وجمبري وسبيط مع الإضافات', price: 495 },
  { name: 'سمك بلطي مقلي', category: 'الوجبات', description: 'أرز صيادية وسلطة وطحينة', price: 240 },
  { name: 'سمك بوري مقلي', category: 'الوجبات', description: 'أرز صيادية وسلطة وطحينة', price: 350 },
  { name: 'جمبري جامبو مشوي', category: 'الوجبات', description: 'أرز صيادية وسلطة وطحينة', price: 550 },
  { name: 'جمبري وسط بدون قشر وايت صوص', category: 'الطواجن', description: '', price: 490 },
  { name: 'الديناميت', category: 'الطواجن', description: 'بطارخ بوري وكاليماري وفيليه وجمبري وكابوريا', price: 620 },
  { name: 'باستا صوص أبيض بالجمبري', category: 'الباستا', description: 'جمبري وسط مخلي', price: 260 },
  { name: 'طاجن فخار باستا صوص أحمر بالجمبري', category: 'الباستا', description: '', price: 345 },
  { name: 'بوكس حلاوة البدايات', category: 'البوكسات', description: 'جمبري وسبيط فرنساوي وطحينة', price: 230 },
  { name: 'بوكس النشاط', category: 'البوكسات', description: '3 ساندوتش جمبري + 3 ساندوتش فيليه', price: 600 },
  { name: 'ساندوتش سمك فيليه', category: 'الساندويتش', description: '', price: 90 },
  { name: 'ساندوتش جمبري وسط', category: 'الساندويتش', description: '', price: 110 },
  { name: 'ساندوتش فياجرا', category: 'الساندويتش', description: 'جمبري وفيليه وسبيط', price: 125 },
  { name: 'ربع رنجة مدخنة هولندي', category: 'الرنجة', description: '', price: 330 },
  { name: 'سلطة خضراء', category: 'المقبلات', description: '', price: 35 },
  { name: 'سلطة طحينة', category: 'المقبلات', description: '', price: 40 },
  { name: 'أرز صيادية', category: 'المقبلات', description: '', price: 65 },
];

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error('لازم تحدد MONGO_URI في ملف .env الأول');
    process.exit(1);
  }

  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    throw new Error('Demo seeding is disabled in production. Use the admin tools to add approved restaurant data.');
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('اتصل بقاعدة البيانات');

  const models = [Admin, Branch, Category, Item, Offer, Customer, Coupon, LoyaltyConfig, DeliveryZone, DeliveryRep, RolePermission];
  const counts = await Promise.all(models.map((model) => model.countDocuments()));
  if (counts.some((count) => count > 0)) {
    throw new Error('Demo seeding requires empty collections. No existing data was changed.');
  }

  const nasrCity = await Branch.create({
    name: 'فرع مدينة نصر', city: 'القاهرة',
    address: 'أول عباس العقاد، مدينة نصر، ناصية KFC', phone: '01558088058',
    workingHours: { from: '12:00 م', to: '1:00 ص' },
    estimatedDeliveryMinutes: 25, minimumOrderValue: 0, isOpen: true,
  });

  const yellowMountain = await Branch.create({
    name: 'فرع الجبل الأصفر', city: 'القاهرة',
    address: 'الجبل الأصفر، القاهرة', phone: '01098765432',
    workingHours: { from: '12:00 م', to: '1:00 ص' },
    estimatedDeliveryMinutes: 15, minimumOrderValue: 0, isOpen: true,
  });
  console.log('اتعمل فرعين: مدينة نصر + الجبل الأصفر');

  const categoryDocs = {};
  for (let i = 0; i < CATEGORY_NAMES.length; i++) {
    categoryDocs[CATEGORY_NAMES[i]] = await Category.create({ name: CATEGORY_NAMES[i], order: i });
  }
  console.log(`اتعمل ${CATEGORY_NAMES.length} قسم`);

  await Branch.findByIdAndUpdate(nasrCity._id, { enabledCategories: Object.values(categoryDocs).map((c) => c._id) });

  const itemDocs = MENU_ITEMS.map((it) => ({
    name: it.name, description: it.description, category: categoryDocs[it.category]._id,
    branches: [nasrCity._id], price: it.price, weightPrices: it.weightPrices || [],
    isAvailable: true, isPriceApproved: false,
  }));
  const insertedItems = await Item.insertMany(itemDocs);
  console.log(`اتعمل ${insertedItems.length} صنف من منيو فرع مدينة نصر`);

  const adminPassword = process.env.SEED_ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url');
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await Admin.create({ name: 'مدير النظام', username: 'admin@fosfor.com', password: hashedPassword, role: 'super_admin', isActive: true });
  console.log('اتعمل حساب أدمن: admin@fosfor.com');
  console.log(`الباسورد: ${adminPassword} (اتولد عشوائي، احفظه دلوقتي - مش هيتعرض تاني)`);

  // العميل التجريبي بدون باسورد - النظام بقى OTP فقط، فأول دخول بالرقم ده هيبعت كود تحقق (Mock في الـ console)
  await Customer.create({
    name: 'أحمد محمد', phone: '01012345678', email: 'ahmed.mohamed@email.com',
    referralCode: 'AHMED01', isPhoneVerified: true,
    addresses: [{ label: 'المنزل', fullAddress: 'شارع النزهة، متفرع من ميدان تريومف، مصر الجديدة، القاهرة', city: 'القاهرة', isDefault: true }],
  });
  console.log('اتعمل عميل تجريبي: 01012345678 (الدخول عبر OTP - هيظهر الكود في console السيرفر)');

  await Offer.create({
    title: 'عرض العيلة', description: 'سمكة مشوية + جمبري + كاليماري + بلح البحر', price: 999,
    branches: [nasrCity._id, yellowMountain._id], servesFrom: 3, servesTo: 4,
    startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), isActive: true,
  });
  console.log('اتعمل عرض تجريبي: عرض العيلة');

  await Coupon.create({
    code: 'FOS20', discountType: 'percentage', value: 20, branches: [], usageLimit: 100,
    startDate: new Date(), endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), isActive: true,
  });
  console.log('اتعمل كوبون تجريبي: FOS20 (خصم 20%)');

  await LoyaltyConfig.create({
    pointsPerEGP: 1, pointsValidityMonths: 12,
    rules: [
      'كل 1 جنيه يتم إنفاقه = 1 نقطة', 'نقاط إضافية في المناسبات الخاصة',
      'تستخدم النقاط في الطلب التالي فقط', 'صلاحية النقاط 12 شهر من تاريخ كسبها',
    ],
    tiers: [
      { name: 'المستوى البرونزي', minPoints: 0, discountPercent: 5 },
      { name: 'المستوى الفضي', minPoints: 300, discountPercent: 10 },
      { name: 'المستوى الذهبي', minPoints: 1000, discountPercent: 15 },
    ],
  });
  console.log('اتعملت إعدادات برنامج الولاء');

  const zonesData = [
    { name: 'المنطقة الأولى', deliveryFee: 25, color: '#d1a437' },
    { name: 'المنطقة الثانية', deliveryFee: 35, color: '#2fa04a' },
    { name: 'المنطقة الثالثة', deliveryFee: 45, color: '#d1691f' },
    { name: 'المنطقة الرابعة', deliveryFee: 60, color: '#8a5a2a' },
  ];
  for (const z of zonesData) await DeliveryZone.create({ ...z, branch: nasrCity._id });
  console.log('اتعمل 4 مناطق توصيل لفرع مدينة نصر');

  await DeliveryRep.create({ name: 'مندوب 01', phone: '01000000001', branch: nasrCity._id, status: 'available', avgDeliveryMinutes: 28 });
  await DeliveryRep.create({ name: 'مندوب 02', phone: '01000000002', branch: yellowMountain._id, status: 'available', avgDeliveryMinutes: 30 });
  console.log('اتعمل مندوبين تجريبيين');

  await RolePermission.insertMany([
    { role: 'super_admin', label: 'مدير النظام', permissions: { orders: true, items: true, reports: true, branches: true, customers: true } },
    { role: 'branch_manager', label: 'مدير فرع', permissions: { orders: true, items: true, reports: true, branches: true, customers: true } },
    { role: 'cashier', label: 'كاشير', permissions: { orders: true, items: true, reports: false, branches: false, customers: false } },
    { role: 'kitchen', label: 'المطبخ', permissions: { orders: true, items: false, reports: false, branches: false, customers: false } },
    { role: 'customer_service', label: 'خدمة العملاء', permissions: { orders: true, items: false, reports: false, branches: false, customers: true } },
  ]);
  console.log('اتعملت مصفوفة الصلاحيات الافتراضية');

  console.log('\nخلصت التعبئة بنجاح. المشروع جاهز للتجربة.');
  console.log('   تسجيل دخول الأدمن → admin@fosfor.com (الباسورد ظاهر فوق في الأول)');
  console.log('   عميل تجريبي → 01012345678 (دخول عبر OTP، الكود هيظهر في الـ console)');
  console.log('   كود خصم تجريبي → FOS20');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('فشلت عملية التعبئة:', err);
  mongoose.disconnect().finally(() => { process.exitCode = 1; });
});
