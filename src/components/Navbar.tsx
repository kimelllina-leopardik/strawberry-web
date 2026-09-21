import React from 'react';
import { ShoppingBag, Clock, MapPin, Phone, Truck, Search, History } from 'lucide-react';
import { STORE_INFO } from '../data/mockData';
import { formatPrice } from '../utils/helpers';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenDeliveryInfo: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenOrders,
  onOpenDeliveryInfo,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#f0e4df] shadow-xs">
      {/* Top Notification Bar */}
      <div className="bg-[#241715] text-[#f7e6e2] text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Сбор ягод сегодня утром • г. Душанбе</span>
            </span>
            <span className="hidden md:flex items-center gap-1 text-[#d8c3bc]">
              <Clock className="w-3.5 h-3.5 text-[#ff4b72]" />
              <span>Доставка от 35 минут по городу</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              id="top-nav-delivery-info-btn"
              onClick={onOpenDeliveryInfo}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[#e8d2cb]"
            >
              <Truck className="w-3.5 h-3.5 text-[#ff4b72]" />
              <span className="underline underline-offset-2">Зоны доставки</span>
            </button>
            <a
              id="top-nav-phone-link"
              href={`tel:${STORE_INFO.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1 font-medium text-white hover:text-[#ff809b] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#ff4b72]" />
              <span>{STORE_INFO.phoneFormatted}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo & City */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ff2a5f] to-[#ff6b8b] flex items-center justify-center text-white shadow-md shadow-[#ff2a5f]/25 group-hover:scale-105 transition-transform">
                <span className="text-2xl leading-none" role="img" aria-label="клубника">🍓</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-['Playfair_Display',serif] font-bold text-xl sm:text-2xl text-[#241715] tracking-tight">
                    Клубника
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#ffe8ed] text-[#d61e4b] font-semibold tracking-wide">
                    Душанбе
                  </span>
                </div>
                <p className="text-[11px] text-[#8c746e] hidden sm:block font-medium">
                  Свежая ягода и букеты с доставкой
                </p>
              </div>
            </a>
          </div>

          {/* Search bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a38a84]" />
              <input
                id="search-products-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Поиск клубники, букетов, десертов..."
                className="w-full pl-10 pr-4 py-2 bg-[#f6ede8] text-sm text-[#241715] rounded-xl border border-transparent focus:border-[#ff4b72] focus:bg-white focus:outline-hidden transition-all placeholder:text-[#a38a84]"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="my-orders-btn"
              onClick={onOpenOrders}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#543b35] hover:text-[#241715] hover:bg-[#f6ede8] transition-colors cursor-pointer border border-[#ebd8d0]"
              title="Мои заказы и проверка статуса доставки"
            >
              <History className="w-4 h-4 text-[#ff3366]" />
              <span>Заказы</span>
            </button>

            {/* Cart Button */}
            <button
              id="cart-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#e31b4c] to-[#ff3b6b] text-white font-medium text-sm shadow-md shadow-[#e31b4c]/20 hover:shadow-lg hover:shadow-[#e31b4c]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-[#e31b4c] text-[11px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-semibold">
                {cartCount > 0 ? formatPrice(cartTotal) : 'Корзина'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden mt-2.5">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a38a84]" />
            <input
              id="mobile-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Поиск: свежая клубника, в шоколаде, букеты..."
              className="w-full pl-10 pr-4 py-2 bg-[#f6ede8] text-sm text-[#241715] rounded-xl border border-transparent focus:border-[#ff4b72] focus:bg-white focus:outline-hidden transition-all placeholder:text-[#a38a84]"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
