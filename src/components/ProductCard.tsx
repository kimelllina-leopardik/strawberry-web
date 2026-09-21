import React, { useState } from 'react';
import { Plus, Minus, Star, Heart, Eye } from 'lucide-react';
import { Product, ProductOption } from '../types';
import { formatPrice } from '../utils/helpers';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onAddToCart: (product: Product, option?: ProductOption) => void;
  cartQuantity: number;
  onUpdateCartQuantity?: (delta: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onAddToCart,
  cartQuantity,
  onUpdateCartQuantity,
}) => {
  const [selectedOption, setSelectedOption] = useState<ProductOption | undefined>(
    product.options && product.options.length > 0 ? product.options[0] : undefined
  );

  const currentPrice = product.price + (selectedOption ? selectedOption.priceDelta : 0);
  const currentWeight = selectedOption ? selectedOption.weightOrCount : product.weightOrQuantity;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-[#ede0db] hover:border-[#ff9eb2] shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Image container */}
      <div className="relative w-full aspect-4/3 overflow-hidden bg-[#faefeb] cursor-pointer" onClick={() => onOpenDetails(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <span className="text-white text-xs font-semibold flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-lg backdrop-blur-xs">
            <Eye className="w-3.5 h-3.5" /> Подробнее
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {product.badge && (
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs backdrop-blur-xs text-white ${
                product.badge === 'Хит'
                  ? 'bg-[#e31b4c]'
                  : product.badge === 'Свежий сбор'
                  ? 'bg-[#15803d]'
                  : product.badge === 'Премиум'
                  ? 'bg-[#7c3aed]'
                  : 'bg-[#ea580c]'
              }`}
            >
              {product.badge}
            </span>
          )}
          {product.harvestTime && (
            <span className="bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-md backdrop-blur-xs">
              {product.harvestTime}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2 py-1 rounded-lg shadow-xs flex items-center gap-1 text-xs font-bold text-[#241715]">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{product.rating.toFixed(1)}</span>
          <span className="text-[10px] font-normal text-[#8c746e]">({product.reviewsCount})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Origin and Sweetness */}
          <div className="flex items-center justify-between text-[11px] text-[#856b64] mb-1.5">
            <span className="truncate max-w-[170px]">{product.origin}</span>
            <span className="flex items-center gap-1 font-semibold text-[#c71f46]" title={`Сладость: ${product.sweetnessScore} из 10`}>
              <span>🍓</span> {product.sweetnessScore}/10
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onOpenDetails(product)}
            className="font-bold text-[#241715] text-base leading-snug hover:text-[#e31b4c] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>
          {product.tajikName && (
            <p className="text-[11px] text-[#9c827a] italic mt-0.5 line-clamp-1">
              {product.tajikName}
            </p>
          )}

          {/* Description */}
          <p className="text-xs text-[#6e5852] mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Weight / options pills if available */}
        {product.options && product.options.length > 0 ? (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] text-[#8c746e] font-medium block">Выберите фасовку:</span>
            <div className="flex flex-wrap gap-1.5">
              {product.options.map((opt) => {
                const isSelected = selectedOption?.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedOption(opt)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#241715] text-white shadow-xs'
                        : 'bg-[#f4eae5] text-[#543b35] hover:bg-[#ebdcd5]'
                    }`}
                  >
                    {opt.weightOrCount}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-[#8c746e] font-medium">
            Фасовка: <span className="text-[#241715] font-semibold">{product.weightOrQuantity}</span>
          </div>
        )}

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-[#f0e4df] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-[#241715]">
                {formatPrice(currentPrice)}
              </span>
              {product.oldPrice && (
                <span className="text-xs text-[#a8908a] line-through">
                  {formatPrice(product.oldPrice + (selectedOption ? selectedOption.priceDelta : 0))}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#9c827a] block -mt-0.5">
              {currentWeight}
            </span>
          </div>

          {/* Cart Buttons */}
          {cartQuantity > 0 && onUpdateCartQuantity ? (
            <div className="flex items-center gap-1.5 bg-[#f6ede8] p-1 rounded-xl border border-[#ebd8d0]">
              <button
                type="button"
                onClick={() => onUpdateCartQuantity(-1)}
                className="w-7 h-7 rounded-lg bg-white text-[#241715] hover:bg-[#ffeef2] hover:text-[#e31b4c] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                title="Уменьшить"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-[#241715] px-1 min-w-[18px] text-center">
                {cartQuantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdateCartQuantity(1)}
                className="w-7 h-7 rounded-lg bg-[#e31b4c] text-white hover:bg-[#cf1341] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                title="Увеличить"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id={`add-to-cart-btn-${product.id}`}
              type="button"
              onClick={() => onAddToCart(product, selectedOption)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#e31b4c] to-[#ff3b6b] text-white font-semibold text-xs shadow-md shadow-[#e31b4c]/20 hover:shadow-lg hover:shadow-[#e31b4c]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>В корзину</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
