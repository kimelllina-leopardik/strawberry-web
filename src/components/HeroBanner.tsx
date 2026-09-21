import React from 'react';
import { Sparkles, ShieldCheck, Clock, Heart, CreditCard, ChevronRight } from 'lucide-react';

interface HeroBannerProps {
  onSelectCategory: (category: any) => void;
  onScrollToCatalog: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectCategory,
  onScrollToCatalog,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fef5f4] via-[#faf0ec] to-[#faf7f5] pt-6 pb-10 sm:py-12 border-b border-[#f2e1db]">
      {/* Decorative ambient blur */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#ff4a74]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#fbb040]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#f5d7ce] shadow-xs text-xs font-semibold text-[#c71f46]">
              <Sparkles className="w-3.5 h-3.5 text-[#ff2a5f]" />
              <span>Утренний сбор в Гиссарской долине • Душанбе 🇹🇯</span>
            </div>

            <h1 className="font-['Playfair_Display',serif] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#241715] tracking-tight leading-[1.15]">
              Свежая отборная <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e31b4c] via-[#ff3b6b] to-[#ea4b2c]">
                клубника в Душанбе
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#614b45] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Ароматная спелая ягода высшего сорта, наборы в настоящем бельгийском шоколаде и роскошные съедобные букеты. Доставка по всем районам столицы за 35–60 минут.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                id="hero-order-fresh-btn"
                onClick={() => {
                  onSelectCategory('fresh');
                  onScrollToCatalog();
                }}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#e31b4c] to-[#ff3869] text-white font-semibold text-sm sm:text-base shadow-lg shadow-[#e31b4c]/25 hover:shadow-xl hover:shadow-[#e31b4c]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Выбрать свежую клубнику</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                id="hero-chocolate-btn"
                onClick={() => {
                  onSelectCategory('chocolate');
                  onScrollToCatalog();
                }}
                className="px-6 py-3.5 rounded-xl bg-white border border-[#ebd2c7] text-[#3d2a25] font-semibold text-sm sm:text-base hover:bg-[#fff9f7] hover:border-[#ff9eb2] shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Наборы в шоколаде</span>
              </button>
            </div>

            {/* Payment & Trust badges */}
            <div className="pt-4 border-t border-[#ebd8d0] flex flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-6 text-xs text-[#735a54]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#eaf8ee] text-[#1e824c] flex items-center justify-center font-bold text-[10px]">
                  ✓
                </div>
                <span>Оплата Alif Mobi, DC, Корти Милли</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#ff3366]" />
                <span>Быстрая доставка за 45 мин</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1e824c]" />
                <span>Гарантия сладости и свежести</span>
              </div>
            </div>
          </div>

          {/* Right Image Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              
              {/* Main Visual Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1543528176-61b239494933?auto=format&fit=crop&w=900&q=85"
                  alt="Отборная сочная клубника"
                  className="w-full h-80 sm:h-96 object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 text-white p-3 rounded-2xl backdrop-blur-md bg-black/40 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        Сорт «Альбион» & «Клери»
                      </p>
                      <p className="text-sm font-bold mt-0.5">Гиссарские экологические теплицы</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-white/80 block">Цена от</span>
                      <span className="text-lg font-extrabold text-[#ff9eb2]">48 с.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: Delivery in Dushanbe */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white py-2.5 px-3.5 rounded-2xl shadow-xl border border-[#f0ded7] flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ffecef] flex items-center justify-center text-xl">
                  🚀
                </div>
                <div>
                  <p className="text-xs font-bold text-[#241715]">По всем районам</p>
                  <p className="text-[11px] text-[#8c746e]">Душанбе: Сино, Сомони, Фирдавси...</p>
                </div>
              </div>

              {/* Floating Badge 2: Callebaut chocolate */}
              <div className="absolute -bottom-3 -right-3 sm:-right-5 bg-white py-2 px-3.5 rounded-2xl shadow-xl border border-[#f0ded7] flex items-center gap-2.5">
                <span className="text-xl">🍫</span>
                <div>
                  <p className="text-xs font-bold text-[#241715]">Бельгийский Callebaut</p>
                  <p className="text-[11px] text-[#8c746e]">Клубника в шоколаде</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
