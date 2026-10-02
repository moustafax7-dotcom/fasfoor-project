/**
 * إشعار العميل عند تغيير حالة طلبه. حاليًا Mock، جاهز للربط بـ Twilio أو WhatsApp Cloud API.
 */
const statusMessages = {
  new: (order) => `تم استلام طلبك رقم #${order.orderNumber} وجاري مراجعته`,
  preparing: (order) => `طلبك #${order.orderNumber} دلوقتي بيتحضّر في المطبخ`,
  ready: (order) => `طلبك #${order.orderNumber} جاهز واستنى المندوب يستلمه`,
  out_for_delivery: (order) => `المندوب في الطريق لطلبك #${order.orderNumber}`,
  delivered: (order) => `وصل طلبك #${order.orderNumber}، بالهنا والشفا`,
  cancelled: (order) => `اتلغى طلبك #${order.orderNumber}. تواصل معنا لو محتاج مساعدة`,
};

const sendNotification = async (phone, message) => {
  // TODO: استبدال باستدعاء حقيقي لمزوّد SMS/WhatsApp
  console.log(`[notify] ${phone}: ${message}`);
  return true;
};

const notifyOrderStatus = async (order, customerPhone) => {
  const buildMessage = statusMessages[order.status];
  if (!buildMessage || !customerPhone) return;
  await sendNotification(customerPhone, buildMessage(order));
};

module.exports = { notifyOrderStatus };
