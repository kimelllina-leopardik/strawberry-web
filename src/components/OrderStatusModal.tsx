import React, { useState, useEffect } from 'react';
import { X, Search, Clock, Truck, CheckCircle, Package, Phone, Calendar, ArrowRight, RefreshCw } from 'lucide-react';
import { Order } from '../types';
import { getSavedOrders, formatPrice } from '../utils/helpers';
import { STORE_INFO } from '../data/mockData';

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReorder: (order: Order) => void;
}

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  isOpen,
  onClose,
  onReorder,
}) => {
  if (!isOpen) return null;

  const [orders, setOrders] = useState<Order[]>([]);
  const [searchId, setSearchId] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    const saved = getSavedOrders();
    setOrders(saved);
    if (saved.length > 0) {
      setActiveOrder(saved[0]);
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const query = searchId.trim().toUpperCase();
    if (!query) return;

    const found = orders.find(
      (o) => o.id.toUpperCase() === query || o.id.toUpperCase() === `TJ-${query}`
    );

    if (found) {
      setActiveOrder(found);
    } else {
      setSearchError('Заказ с таким номером не найден в вашей истории.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#ede0db] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#fffcfb] px-5 sm:px-6 py-4 border-b border-[#f0e4df] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#ffecef] text-[#e31b4c] flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-[#241715]">
                Отслеживание доставки по Душанбе
              </h2>
              <p className="text-[11px] text-[#8c746e]">
                Статус сборки ягод, трекинг курьера и история покупок
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-[#8c746e] hover:text-[#241715] hover:bg-[#f6ede8] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto space-y-4">
          
          {/* Search by Order ID */}
          <form onSubmit={handleSearch} className="space-y-1">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8908a]" />
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Введите номер заказа (например: TJ-8492)"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#ebd8d0] focus:border-[#e31b4c] focus:outline-hidden bg-[#faf7f5]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#241715] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
              >
                Найти
              </button>
            </div>
            {searchError && (
              <p className="text-[11px] text-red-500">{searchError}</p>
            )}
          </form>

          {/* Active Order Details */}
          {activeOrder ? (
            <div className="space-y-4 bg-[#faf5f3] p-4 sm:p-5 rounded-2xl border border-[#ebd8d0]">
              
              {/* Order summary header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ebd8d0] pb-3">
                <div>
                  <span className="text-xs font-bold text-[#e31b4c]">Заказ #{activeOrder.id}</span>
                  <span className="text-xs text-[#8c746e] block">
                    Оформлен: {activeOrder.createdAt}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-[#241715]">
                    {formatPrice(activeOrder.total)}
                  </span>
                  <span className="block text-[11px] font-semibold text-emerald-700">
                    {activeOrder.paymentStatus === 'paid' ? '✓ Оплачен онлайн' : 'Оплата курьеру'}
                  </span>
                </div>
              </div>

              {/* Status Stepper */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#241715]">Статус выполнения:</span>
                <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                  <div className="bg-white p-2 rounded-xl border border-[#ebd8d0]">
                    <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-1 text-[10px] font-bold">
                      ✓
                    </div>
                    <span className="font-semibold text-emerald-800">Принят</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-[#ff9eb2] bg-[#fff0f3]">
                    <div className="w-5 h-5 rounded-full bg-[#e31b4c] text-white flex items-center justify-center mx-auto mb-1 text-[10px] font-bold animate-pulse">
                      🍓
                    </div>
                    <span className="font-bold text-[#e31b4c]">Сборка</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-[#ebd8d0] opacity-60">
                    <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mx-auto mb-1 text-[10px]">
                      🚗
                    </div>
                    <span>Курьер</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-[#ebd8d0] opacity-60">
                    <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mx-auto mb-1 text-[10px]">
                      🎉
                    </div>
                    <span>Вручен</span>
                  </div>
                </div>
              </div>

              {/* Delivery and Courier info */}
              <div className="bg-white p-3 rounded-xl border border-[#f0dfd8] text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#8c746e]">Получатель:</span>
                  <span className="font-semibold text-[#241715]">{activeOrder.customer.name} ({activeOrder.customer.phone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8c746e]">Адрес в Душанбе:</span>
                  <span className="font-semibold text-[#241715] text-right">{activeOrder.customer.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8c746e]">Ориентир:</span>
                  <span className="font-semibold text-[#241715]">{activeOrder.customer.landmark}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8c746e]">Курьер:</span>
                  <span className="font-semibold text-[#15803d]">
                    {activeOrder.courierName} ({activeOrder.courierPhone})
                  </span>
                </div>
              </div>

              {/* Items in order */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#241715]">Состав заказа:</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {activeOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-[#f2e2db]">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={item.product.image} alt={item.product.name} className="w-8 h-8 rounded-md object-cover" />
                        <div className="truncate">
                          <p className="font-semibold text-[#241715] truncate">{item.product.name}</p>
                          <p className="text-[10px] text-[#8c746e]">
                            {item.quantity} шт • {item.selectedOption?.weightOrCount || item.product.weightOrQuantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-[#241715] shrink-0">
                        {formatPrice((item.product.price + (item.selectedOption?.priceDelta || 0)) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Re-order button */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onReorder(activeOrder);
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#e31b4c] hover:bg-[#cf1341] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Повторить этот заказ</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="text-center py-8 space-y-2">
              <Package className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-xs text-gray-500">У вас пока нет оформленных заказов на этом устройстве.</p>
            </div>
          )}

          {/* Quick list of past orders */}
          {orders.length > 1 && (
            <div className="space-y-2 pt-2 border-t border-[#f0e4df]">
              <span className="text-xs font-bold text-[#241715]">Предыдущие заказы:</span>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {orders.map((ord) => (
                  <button
                    key={ord.id}
                    onClick={() => setActiveOrder(ord)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      activeOrder?.id === ord.id
                        ? 'border-[#e31b4c] bg-[#fff5f7]'
                        : 'border-[#ebd8d0] hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-[#241715]">#{ord.id}</span>
                      <span className="text-[11px] text-[#8c746e] ml-2">{ord.createdAt}</span>
                    </div>
                    <span className="font-bold text-[#e31b4c]">{formatPrice(ord.total)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
