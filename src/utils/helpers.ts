// Format price in Tajik Somoni (TJS)
export function formatPrice(amount: number): string {
  return `${amount} с.`;
}

// Generate unique order ID with Dushanbe / TJ prefix
export function generateOrderId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `TJ-${randomNum}`;
}

// Format phone number with Tajik format +992 (XX) XXX-XX-XX
export function formatTajikPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '+992 ';
  
  // If starts with 992
  let localDigits = digits;
  if (localDigits.startsWith('992')) {
    localDigits = localDigits.substring(3);
  }
  
  localDigits = localDigits.slice(0, 9); // Tajik numbers are 9 digits after 992
  
  let formatted = '+992';
  if (localDigits.length > 0) {
    formatted += ` (${localDigits.substring(0, 2)}`;
  }
  if (localDigits.length >= 2) {
    formatted += ')';
  }
  if (localDigits.length > 2) {
    formatted += ` ${localDigits.substring(2, 5)}`;
  }
  if (localDigits.length >= 5) {
    formatted += `-${localDigits.substring(5, 7)}`;
  }
  if (localDigits.length >= 7) {
    formatted += `-${localDigits.substring(7, 9)}`;
  }
  
  return formatted;
}

// Local storage key for orders
export const STORAGE_ORDERS_KEY = 'dushanbe_strawberry_orders';
export const STORAGE_CART_KEY = 'dushanbe_strawberry_cart';

export function getSavedOrders() {
  try {
    const data = localStorage.getItem(STORAGE_ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveOrderToStorage(order: any) {
  try {
    const existing = getSavedOrders();
    const updated = [order, ...existing.filter((o: any) => o.id !== order.id)];
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save order to localStorage', e);
  }
}
