export type ProductCategory = 'all' | 'fresh' | 'chocolate' | 'bouquets' | 'desserts';

export interface ProductOption {
  id: string;
  label: string;
  priceDelta: number;
  weightOrCount: string;
}

export interface Product {
  id: string;
  name: string;
  tajikName?: string;
  category: 'fresh' | 'chocolate' | 'bouquets' | 'desserts';
  description: string;
  fullDescription: string;
  price: number; // in Somoni (TJS)
  oldPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: 'Хит' | 'Свежий сбор' | 'Премиум' | 'Скидка';
  weightOrQuantity: string;
  image: string;
  harvestTime?: string;
  origin: string; // e.g. "Гиссарская долина"
  options?: ProductOption[];
  inStock: boolean;
  sweetnessScore: number; // 1-10
}

export interface CartItem {
  id: string; // unique cart item id (product.id + option.id)
  product: Product;
  selectedOption?: ProductOption;
  quantity: number;
  giftCardMessage?: string;
  ribbonColor?: string;
}

export interface District {
  id: string;
  name: string;
  tajikName: string;
  deliveryFee: number; // Somoni
  freeDeliveryThreshold: number; // Free if order total >= threshold
  estimatedTime: string;
}

export type PaymentMethod = 
  | 'alif_mobi' 
  | 'dushanbe_city' 
  | 'korti_milli' 
  | 'bank_card' 
  | 'cash_on_delivery';

export type OrderStatus = 'received' | 'assembling' | 'in_delivery' | 'delivered';

export interface CustomerDetails {
  name: string;
  phone: string;
  email?: string;
  districtId: string;
  address: string;
  landmark: string; // Ориентир
  deliveryType: 'urgent' | 'scheduled';
  scheduledDate?: string;
  scheduledTime?: string;
  isAnonymousGift: boolean;
  giftCardText?: string;
  notes?: string;
  cashChangeFrom?: string;
}

export interface Order {
  id: string; // e.g. "TJ-8492"
  createdAt: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  promoCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending';
  orderStatus: OrderStatus;
  estimatedDeliveryTime: string;
  courierName?: string;
  courierPhone?: string;
}
