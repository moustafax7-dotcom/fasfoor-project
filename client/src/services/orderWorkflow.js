const actions = {
  new: { next: 'preparing', label: 'بدء التحضير' },
  preparing: { next: 'ready', label: 'جاهز للتسليم' },
  ready: { next: 'out_for_delivery', label: 'تسليم للمندوب' },
  out_for_delivery: { next: 'delivered', label: 'تم التوصيل' },
};
export function getNextOrderAction(order) {
  if (order.status === 'ready' && order.deliveryType === 'pickup') return { next: 'delivered', label: 'تم الاستلام من الفرع' };
  return actions[order.status];
}
export const unitLabels = { quarter: 'ربع كيلو', half: 'نصف كيلو', kilo: 'كيلو', piece: 'قطعة', plate: 'طبق', box: 'علبة' };
