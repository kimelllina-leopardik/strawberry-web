import React from 'react';
import { Truck, Clock, ShieldCheck, MapPin, Sparkles, ThermometerSnowflake, HeartHandshake } from 'lucide-react';
import { DUSHANBE_DISTRICTS, STORE_INFO } from '../data/mockData';

export const DeliveryInfoSection: React.FC = () => {
  return (
    <section id="delivery-info-section" className="py-12 bg-white border-y border-[#ede0db]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffe8ed] text-[#d61e4b] text-xs font-semibold">
            <Truck className="w-3.5 h-3.5" />
            <span>Доставка по всему городу</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#241715] font-['Playfair_Display',serif]">
            Как работает доставка клубники в Душанбе
          </h2>
          <p className="text-xs sm:text-sm text-[#70564f]">
            Мы бережно доставляем свежие ягоды в специальных термобоксах, чтобы клубника оставалась охлажденной, плотной и безупречно свежей даже в теплую погоду.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          <div className="p-5 rounded-2xl bg-[#faf5f3] border border-[#f0ded7] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#ffecef] text-[#e31b4c] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#241715]">Скорость 35–60 минут</h3>
            <p className="text-xs text-[#70564f] leading-relaxed">
              Собственная курьерская служба с автотранспортом и скутерами оперативно доставит заказ в любой район столицы.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#faf5f3] border border-[#f0ded7] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#eaf8ee] text-[#15803d] flex items-center justify-center">
              <ThermometerSnowflake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#241715]">Термобоксы с хладоэлементами</h3>
            <p className="text-xs text-[#70564f] leading-relaxed">
              Шоколад не тает, а свежая клубника не теряет упругости благодаря поддержанию оптимальной температуры +4...+8°C.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#faf5f3] border border-[#f0ded7] space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#fff0f3] text-[#c71f46] flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#241715]">Фото перед отправкой</h3>
            <p className="text-xs text-[#70564f] leading-relaxed">
              По вашему желанию присылаем фото собранного набора или букета в WhatsApp или Telegram перед вручением курьеру.
            </p>
          </div>

        </div>

        {/* Districts Grid */}
        <div className="bg-[#faf7f5] rounded-3xl p-6 sm:p-8 border border-[#ebd8d0]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-[#241715]">
                Тарифы доставки по районам Душанбе
              </h3>
              <p className="text-xs text-[#8c746e]">
                Бесплатная доставка при заказе от указанной суммы
              </p>
            </div>
            <span className="text-xs font-semibold text-[#e31b4c] bg-white px-3 py-1.5 rounded-xl border border-[#fedee5]">
              Самовывоз: г. Душанбе, пр. Рудаки, 45 (Бесплатно)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DUSHANBE_DISTRICTS.map((dist) => (
              <div
                key={dist.id}
                className="bg-white p-4 rounded-2xl border border-[#f0dfd8] flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#241715]">{dist.name.split('(')[0]}</span>
                    <span className="font-extrabold text-xs text-[#e31b4c]">{dist.deliveryFee} с.</span>
                  </div>
                  <p className="text-[11px] text-[#8c746e] mt-0.5">
                    {dist.tajikName}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#f5eae5] flex items-center justify-between text-[11px] text-[#634e48]">
                  <span>Время: <strong>{dist.estimatedTime}</strong></span>
                  <span className="text-emerald-700 font-semibold">Бесплатно от {dist.freeDeliveryThreshold} с.</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
