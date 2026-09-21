import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { CartItem } from '../types';
import { formatPrice } from '../utils/helpers';
import { PROMO_CODES } from '../data/mockData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  appliedPromo: string | null;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  // Calculate subtotal
  const subtotal = items.reduce((acc, item) => {
    const unitPrice = item.product.price + (item.selectedOption ? item.selectedOption.priceDelta : 0);
    return acc + unitPrice * item.quantity;
  }, 0);

  // Free delivery threshold in Dushanbe (typically 180-200 TJS)
  const FREE_DELIVERY_GOAL = 180;
  const remainingForFreeDelivery = Math.max(0, FREE_DELIVERY_GOAL - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / FREE_DELIVERY_GOAL) * 100);

  // Calculate promo discount
  let discount = 0;
  if (appliedPromo && PROMO_CODES[appliedPromo]) {
    const promoData = PROMO_CODES[appliedPromo];
    if (promoData.discountPercent) {
      discount = Math.round((subtotal * promoData.discountPercent) / 100);
    } else if (promoData.discountFixed) {
      discount = Math.min(subtotal, promoData.discountFixed);
    }
  }

  const finalTotal = Math.max(0, subtotal - discount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;

    const success = onApplyPromo(promoInput.trim().toUpperCase());
    if (!success) {
      setPromoError('Неверный промокод. Попробуйте DUSHANBE10 или SALOM');
    } else {
      setPromoInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#f0ded7]">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#f0e4df] flex items-center justify-between bg-[#fffcfb]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#ffecef] text-[#e31b4c] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-[#241715]">
                Корзина заказов ({items.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full text-[#8c746e] hover:text-[#241715] hover:bg-[#f6ede8] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free delivery progress bar */}
          {items.length > 0 && (
            <div className="bg-[#fff6f8] px-5 py-3 border-b border-[#fedfe5] text-xs">
              <div className="flex items-center justify-between font-semibold text-[#a81439] mb-1.5">
                <span>
                  {remainingForFreeDelivery === 0 ? (
                    <span className="flex items-center gap-1 text-[#15803d]">
                      <Check className="w-3.5 h-3.5" /> Поздравляем! Доставка по Душанбе бесплатная
                    </span>
                  ) : (
                    <span>До бесплатной доставки: еще {formatPrice(remainingForFreeDelivery)}</span>
                  )}
                </span>
                <span>{Math.round(freeDeliveryProgress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#fce3e8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#e31b4c] to-[#15803d] rounded-full transition-all duration-300"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-[#f7ece7]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-[#fff0f3] flex items-center justify-center text-4xl shadow-inner">
                  🍓
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#241715]">Корзина пока пуста</h3>
                  <p className="text-xs text-[#8c746e] mt-1 max-w-xs">
                    Выберите свежую клубнику или аппетитные наборы в шоколаде с доставкой по Душанбе.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#241715] text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
                >
                  Перейти к покупкам
                </button>
              </div>
            ) : (
              items.map((item) => {
                const unitPrice = item.product.price + (item.selectedOption ? item.selectedOption.priceDelta : 0);
                const itemTotal = unitPrice * item.quantity;
                const optionLabel = item.selectedOption ? item.selectedOption.weightOrCount : item.product.weightOrQuantity;

                return (
                  <div key={item.id} className="pt-3 first:pt-0 flex gap-3 sm:gap-4 items-start">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-[#faefe9] shrink-0 border border-[#f0dfd8]"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs sm:text-sm text-[#241715] leading-snug truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#a38a84] hover:text-[#e31b4c] p-1 transition-colors cursor-pointer"
                          title="Удалить позицию"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#8c746e] mt-0.5">
                        Фасовка: <span className="font-medium text-[#402a24]">{optionLabel}</span>
                      </p>

                      {item.giftCardMessage && (
                        <p className="text-[10px] text-[#e31b4c] bg-[#fff2f5] px-2 py-0.5 rounded-md mt-1 inline-block truncate max-w-full">
                          💌 С открыткой: &quot;{item.giftCardMessage}&quot;
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2 pt-1">
                        {/* Quantity */}
                        <div className="flex items-center gap-1.5 bg-[#f6ede8] p-0.5 rounded-lg border border-[#ebd8d0]">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-md bg-white text-[#241715] flex items-center justify-center hover:bg-[#ffeef2] hover:text-[#e31b4c] shadow-2xs cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-[#241715] px-1.5 min-w-[16px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-md bg-[#e31b4c] text-white flex items-center justify-center hover:bg-[#cf1341] shadow-2xs cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-xs sm:text-sm font-black text-[#241715]">
                            {formatPrice(itemTotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with totals & checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-[#fffcfb] border-t border-[#f0e4df] space-y-3">
              {/* Promo Code Input */}
              <div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-[#eaf8ee] text-[#1e824c] px-3 py-2 rounded-xl text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      Промокод: {appliedPromo} (-{formatPrice(discount)})
                    </span>
                    <button
                      onClick={onRemovePromo}
                      className="text-xs text-red-600 hover:underline cursor-pointer"
                    >
                      Отменить
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Промокод (напр. DUSHANBE10)"
                        className="flex-1 text-xs px-3 py-2 rounded-xl border border-[#ebd8d0] focus:border-[#e31b4c] focus:outline-hidden bg-white uppercase"
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 bg-[#241715] text-white text-xs font-semibold rounded-xl hover:bg-black transition-colors cursor-pointer"
                      >
                        Применить
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-[11px] text-red-500">{promoError}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#6e5852] pt-1">
                <div className="flex justify-between">
                  <span>Стоимость товаров:</span>
                  <span className="font-semibold text-[#241715]">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#15803d] font-semibold">
                    <span>Скидка по промокоду:</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#8c746e]">
                  <span>Доставка по Душанбе:</span>
                  <span>{remainingForFreeDelivery === 0 ? 'Бесплатно' : 'от 15 с. (расчет)'}</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#241715] pt-2 border-t border-[#ebd8d0]">
                  <span>Итого к оплате:</span>
                  <span className="text-[#e31b4c]">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="cart-checkout-proceed-btn"
                onClick={onProceedToCheckout}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#e31b4c] to-[#ff3b6b] text-white font-bold text-sm shadow-lg shadow-[#e31b4c]/25 hover:shadow-xl hover:shadow-[#e31b4c]/35 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Оформить доставку</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-[#998078]">
                Оплата онлайн: Alif Mobi, Корти Милли, DC или курьеру
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
