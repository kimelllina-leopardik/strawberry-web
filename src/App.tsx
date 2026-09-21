/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, Filter, SlidersHorizontal, ArrowUpDown, 
  ShoppingBag, Check, Phone, MessageCircle, AlertCircle, Heart 
} from 'lucide-react';
import { Product, ProductCategory, ProductOption, CartItem, Order } from './types';
import { PRODUCTS, PROMO_CODES, STORE_INFO } from './data/mockData';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderStatusModal } from './components/OrderStatusModal';
import { DeliveryInfoSection } from './components/DeliveryInfoSection';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { STORAGE_CART_KEY, formatPrice } from './utils/helpers';

export default function App() {
  // Navigation & Modal States
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');

  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);

  // Cart State with localStorage persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<string | null>('DUSHANBE10'); // Default welcome bonus
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Cart calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => {
    const unitPrice = item.product.price + (item.selectedOption ? item.selectedOption.priceDelta : 0);
    return acc + unitPrice * item.quantity;
  }, 0);

  // Promo discount calculation
  let promoDiscount = 0;
  if (appliedPromo && PROMO_CODES[appliedPromo]) {
    const p = PROMO_CODES[appliedPromo];
    if (p.discountPercent) {
      promoDiscount = Math.round((cartSubtotal * p.discountPercent) / 100);
    } else if (p.discountFixed) {
      promoDiscount = Math.min(cartSubtotal, p.discountFixed);
    }
  }

  const cartTotal = Math.max(0, cartSubtotal - promoDiscount);

  // Add to cart handler
  const handleAddToCart = (
    product: Product,
    option?: ProductOption,
    giftCardMessage?: string,
    ribbonColor?: string
  ) => {
    const itemId = `${product.id}-${option?.id || 'default'}-${giftCardMessage ? 'gift' : 'std'}`;

    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing) {
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          selectedOption: option,
          quantity: 1,
          giftCardMessage,
          ribbonColor,
        },
      ];
    });

    showToast(`«${product.name}» добавлено в корзину!`);
  };

  // Update item quantity
  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.id === cartItemId ? { ...i, quantity: newQty } : i))
    );
  };

  // Quick delta for product card
  const handleQuickQuantityDelta = (product: Product, delta: number) => {
    const item = cartItems.find((i) => i.product.id === product.id);
    if (!item) {
      if (delta > 0) handleAddToCart(product);
      return;
    }
    handleUpdateCartQuantity(item.id, item.quantity + delta);
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  const handleApplyPromo = (code: string): boolean => {
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      showToast(`Промокод «${code}» успешно активирован!`);
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    showToast('Промокод удален');
  };

  // Proceed from cart to checkout
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // When order completes
  const handleOrderCompleted = (order: Order) => {
    setCartItems([]);
    showToast(`Заказ #${order.id} оформлен!`);
  };

  // Re-order from history
  const handleReorder = (order: Order) => {
    setCartItems(order.items);
    setIsCartOpen(true);
    showToast(`Товары из заказа #${order.id} добавлены в корзину`);
  };

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchOrigin = item.origin.toLowerCase().includes(q);
        const matchTajik = item.tajikName?.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchOrigin && !matchTajik) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: popular / rating * count
      return b.reviewsCount - a.reviewsCount;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToDelivery = () => {
    const el = document.getElementById('delivery-info-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f5] text-[#241715]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 bg-[#241715] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold border border-white/20 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="text-base">🍓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersModalOpen(true)}
        onOpenDeliveryInfo={scrollToDelivery}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Showcase */}
      <HeroBanner
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onScrollToCatalog={scrollToCatalog}
      />

      {/* Main Catalog Section */}
      <main id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-6">
        
        {/* Category & Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#f0e4df] pb-4">
          
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'Вся клубника' },
              { id: 'fresh', label: 'Свежая отборная 🍓' },
              { id: 'chocolate', label: 'В бельгийском шоколаде 🍫' },
              { id: 'bouquets', label: 'Подарочные букеты 💐' },
              { id: 'desserts', label: 'Десерты и бенто-торты 🍰' },
            ].map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id as ProductCategory)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#e31b4c] text-white shadow-md shadow-[#e31b4c]/20'
                      : 'bg-white text-[#543b35] hover:bg-[#f5e9e4] border border-[#ebdcd5]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 self-end md:self-center">
            <span className="text-xs text-[#8c746e] flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Сортировка:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-[#ebd8d0] text-[#241715] focus:outline-hidden cursor-pointer"
            >
              <option value="popular">По популярности</option>
              <option value="price_asc">Сначала дешевле</option>
              <option value="price_desc">Сначала дороже</option>
              <option value="rating">По рейтингу</option>
            </select>
          </div>
        </div>

        {/* Info banner about morning harvest & payment */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#ffeef2] via-[#fff4f6] to-[#fef8f5] border border-[#fbd4de] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-[#e31b4c] text-white flex items-center justify-center font-bold text-sm shrink-0">
              ⚡
            </span>
            <div>
              <p className="font-bold text-[#241715]">
                Сбор ягод сегодня утром в экологических садах Гиссарской долины
              </p>
              <p className="text-[#805e55]">
                Оплата Alif Mobi, Dushanbe City, Корти Милли или курьеру при получении.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-lg bg-white border border-[#fedbe3] text-[#e31b4c] font-semibold text-[11px]">
              Промокод DUSHANBE10 (-10%)
            </span>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-[#ede0db]">
            <div className="text-4xl">🔍</div>
            <h3 className="font-bold text-base text-[#241715]">По вашему запросу ничего не найдено</h3>
            <p className="text-xs text-[#8c746e]">
              Попробуйте сбросить фильтры поиска или выбрать другую категорию.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-[#241715] text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
            >
              Сбросить поиск
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((prod) => {
              // Calculate current quantity in cart for this product
              const itemInCart = cartItems.find((i) => i.product.id === prod.id);
              const qty = itemInCart ? itemInCart.quantity : 0;

              return (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onOpenDetails={(p) => setActiveProduct(p)}
                  onAddToCart={(p, opt) => handleAddToCart(p, opt)}
                  cartQuantity={qty}
                  onUpdateCartQuantity={(delta) => handleQuickQuantityDelta(prod, delta)}
                />
              );
            })}
          </div>
        )}

      </main>

      {/* Delivery Zones Section */}
      <DeliveryInfoSection />

      {/* Real Reviews from Dushanbe */}
      <ReviewsSection />

      {/* Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        subtotal={cartSubtotal}
        discount={promoDiscount}
        promoCode={appliedPromo || undefined}
        onOrderCompleted={handleOrderCompleted}
      />

      <OrderStatusModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        onReorder={handleReorder}
      />

      {/* Mobile Floating Sticky Cart Bar */}
      {cartCount > 0 && !isCartOpen && !isCheckoutOpen && (
        <div className="sm:hidden fixed bottom-3 left-3 right-3 z-40">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#e31b4c] to-[#ff3b6b] text-white font-bold text-sm shadow-xl shadow-[#e31b4c]/35 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span>В корзине ({cartCount} шт)</span>
            </div>
            <span className="font-extrabold text-base bg-white/20 px-3 py-1 rounded-xl">
              {formatPrice(cartTotal)}
            </span>
          </button>
        </div>
      )}

    </div>
  );
}
