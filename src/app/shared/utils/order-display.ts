import { Order } from '../../core/models/order.model';
import { Product } from '../../core/models/product.model';

export function orderDisplayNumber(order: Order, orders: Order[] = []): string {
  const backendNumber = order.order_number ?? order.consecutive ?? order.sequence;

  if (backendNumber !== undefined && backendNumber !== null && String(backendNumber).trim()) {
    return `#${String(backendNumber).padStart(4, '0')}`;
  }

  const sorted = [...orders].sort((a, b) => {
    const createdAtDiff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    return createdAtDiff || a.id.localeCompare(b.id);
  });
  const index = sorted.findIndex((candidate) => candidate.id === order.id);

  return `#${String(index >= 0 ? index + 1 : 1).padStart(4, '0')}`;
}

export function productNamesFromItems(
  items: Array<{ product_id?: string; product_name?: string }> | undefined,
  products: Product[]
): string {
  if (!items?.length) {
    return 'Sin productos';
  }

  const names = items.map((item) => {
    if (item.product_name?.trim()) {
      return item.product_name;
    }

    return products.find((product) => product.id === item.product_id)?.name ?? 'Producto sin nombre';
  });

  return [...new Set(names)].join(', ');
}
