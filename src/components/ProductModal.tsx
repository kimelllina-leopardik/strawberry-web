import React, { useState } from 'react';
import { X, Star, Check, Plus, Minus, ShoppingBag, Truck, Gift, Sparkles } from 'lucide-react';
import { Product, ProductOption } from '../types';
import { formatPrice } from '../utils/helpers';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, option?: ProductOption, giftCardMessage?: string, ribbonColor?: string) => void;
}

const RIBBON_OPTIONS = [
  { id: 'red', label: 'Алая лента (Классика)', bgClass: 'bg-[#e31b4c]' },
  { id: 'gold', label: 'Золотая лента', bgClass: 'bg-amber-400' },
  { id: 'white', label: 'Нежно-белая лента', bgClass: 'bg-slate-100 border border-slate-300' },
  { id: 'pink', label: 'Розовая пудра', bgClass: 'bg-pink-300' },
];

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedOption, setSelectedOption] = useState<ProductOption | undefined>(
    product.options && product.options.length > 0 ? product.options[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [includeGiftCard, setIncludeGiftCard] = useState(false);
  const [giftCardText, setGiftCardText] = useState('');
  const [ribbonColor, setRibbonColor] = useState('red');

  const unitPrice = product.price + (selectedOption ? selectedOption.priceDelta : 0);
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    onAddToCart(
      product,
      selectedOption,
      includeGiftCard ? giftCardText : undefined,
      ribbonColor
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#ebdcd5] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-[#241715] flex items-center justify-center shadow-md transition-colors cursor-pointer"
          title="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image & Badges */}
          <div className="relative h-64 md:h-full min-h-[260px] bg-[#faefe9]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.badge && (
                <span className="text-xs font-bold px-3 py-1 rounded-full text-white bg-[#e31b4c] shadow-xs">
                  {product.badge}
                </span>
              )}
              {product.origin && (
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-md text-white bg-black/50 backdrop-blur-xs">
                  📍 {product.origin}
                </span>
              )}
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white text-xs bg-black/50 backdrop-blur-md p-3 rounded-xl border border-white/20">
              <div className="flex items-center justify-between">
                <span>Индекс сладости:</span>
                <span className="font-bold text-[#ff8ba7]">🍓 {product.sweetnessScore} из 10 (Медовая)</span>
              </div>
              {product.harvestTime && (
                <div className="flex items-center justify-between mt-1 text-[11px] text-white/80">
                  <span>Сбор:</span>
                  <span>{product.harvestTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details & Customization */}
          <div className="p-5 sm:p-6 flex flex-col justify-between max-h-[80vh] overflow-y-auto space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-[#8c746e]">({product.reviewsCount} отзывов из Душанбе)</span>
              </div>

              <h2 className="text-xl font-bold text-[#241715] leading-tight font-['Playfair_Display',serif]">
                {product.name}
              </h2>
              {product.tajikName && (
                <p className="text-xs text-[#9c827a] italic mt-0.5">
                  {product.tajikName}
                </p>
              )}

              <p className="text-xs text-[#5e4842] mt-3 leading-relaxed">
                {product.fullDescription || product.description}
              </p>

              {/* Options selection */}
              {product.options && product.options.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#f0e4df]">
                  <label className="text-xs font-bold text-[#241715] block mb-2">
                    Выберите размер / количество:
                  </label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {product.options.map((opt) => {
                      const isSelected = selectedOption?.id === opt.id;
                      const optPrice = product.price + opt.priceDelta;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedOption(opt)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#e31b4c] bg-[#fff5f7] text-[#241715]'
                              : 'border-[#ede0db] hover:border-[#d9c5bd] text-[#543b35]'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#e31b4c] bg-[#e31b4c]' : 'border-gray-400'}`}>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                            <span>{opt.label}</span>
                          </span>
                          <span className="font-bold text-[#241715]">
                            {formatPrice(optPrice)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Gift Options (Free card + Ribbon) */}
              <div className="mt-4 pt-3 border-t border-[#f0e4df] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#241715]">
                    <input
                      type="checkbox"
                      checked={includeGiftCard}
                      onChange={(e) => setIncludeGiftCard(e.target.checked)}
                      className="w-4 h-4 rounded text-[#e31b4c] focus:ring-[#e31b4c] accent-[#e31b4c]"
                    />
                    <Gift className="w-4 h-4 text-[#e31b4c]" />
                    <span>Подарочная открытка с текстом (Бесплатно)</span>
                  </label>
                </div>

                {includeGiftCard && (
                  <div className="space-y-2 pt-1">
                    <textarea
                      value={giftCardText}
                      onChange={(e) => setGiftCardText(e.target.value)}
                      placeholder="Напишите текст пожелания (курьер вручит открытку получателю)..."
                      rows={2}
                      maxLength={200}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#ebd5cc] focus:border-[#e31b4c] focus:outline-hidden bg-[#faf7f5]"
                    />
                    <div className="flex items-center justify-between text-[11px] text-[#8c746e]">
                      <span>Цвет атласной ленты:</span>
                      <div className="flex items-center gap-1.5">
                        {RIBBON_OPTIONS.map((ribbon) => (
                          <button
                            key={ribbon.id}
                            type="button"
                            onClick={() => setRibbonColor(ribbon.id)}
                            className={`w-5 h-5 rounded-full ${ribbon.bgClass} flex items-center justify-center transition-transform cursor-pointer ${
                              ribbonColor === ribbon.id ? 'scale-125 ring-2 ring-[#e31b4c]' : 'hover:scale-110'
                            }`}
                            title={ribbon.label}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price & Quantity & Submit */}
            <div className="pt-4 border-t border-[#f0e4df] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#8c746e] block">Итого за позицию:</span>
                  <span className="text-2xl font-black text-[#241715]">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center gap-2 bg-[#f4ebe6] p-1 rounded-xl border border-[#ebd5cc]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-white text-[#241715] disabled:opacity-40 flex items-center justify-center shadow-xs cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold text-[#241715] px-2 min-w-[24px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-[#e31b4c] text-white flex items-center justify-center shadow-xs cursor-pointer hover:bg-[#cf1341]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                id="modal-add-to-cart-btn"
                type="button"
                onClick={handleAdd}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#e31b4c] to-[#ff3b6b] text-white font-bold text-sm shadow-lg shadow-[#e31b4c]/25 hover:shadow-xl hover:shadow-[#e31b4c]/35 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Добавить в корзину • {formatPrice(totalPrice)}</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#78615b]">
                <Truck className="w-3.5 h-3.5 text-[#ff3366]" />
                <span>Быстрая доставка по Душанбе за 35-50 мин</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
