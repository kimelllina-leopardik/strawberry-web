import React from 'react';
import { Phone, MapPin, Clock, MessageCircle, Send, ShieldCheck, Heart } from 'lucide-react';
import { STORE_INFO } from '../data/mockData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1c1210] text-[#f2e2de] pt-12 pb-8 border-t border-[#3b2723]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ff2a5f] to-[#ff6b8b] flex items-center justify-center text-white text-2xl shadow-md">
                🍓
              </div>
              <span className="font-['Playfair_Display',serif] font-bold text-xl text-white">
                Клубника Душанбе
              </span>
            </div>
            <p className="text-xs text-[#a8908a] leading-relaxed">
              Сервис премиальной доставки клубники и ягодных десертов ручной работы по городу Душанбе. Свежий сбор каждое утро из теплиц Гиссара.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>100% гарантия свежести и сладости</span>
            </div>
          </div>

          {/* Col 2: Contacts */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Контакты в Душанбе
            </h4>
            <ul className="space-y-2.5 text-xs text-[#d1bbb5]">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#ff4b72]" />
                <a href={`tel:${STORE_INFO.phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {STORE_INFO.phoneFormatted}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#ff4b72] shrink-0 mt-0.5" />
                <span>{STORE_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#ff4b72]" />
                <span>{STORE_INFO.workingHours}</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Messengers */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Быстрая связь
            </h4>
            <p className="text-xs text-[#a8908a]">
              Есть вопросы по заказу или индивидуальному букету? Напишите нам прямо сейчас:
            </p>
            <div className="flex flex-col gap-2">
              <a
                href={STORE_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#25d366]/20 border border-[#25d366]/40 hover:bg-[#25d366]/30 text-white text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25d366]" />
                <span>Написать в WhatsApp</span>
              </a>
              <a
                href={`https://t.me/${STORE_INFO.telegramUser.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/40 hover:bg-[#0088cc]/30 text-white text-xs font-semibold transition-colors"
              >
                <Send className="w-4 h-4 text-[#38bdf8]" />
                <span>Написать в Telegram</span>
              </a>
            </div>
          </div>

          {/* Col 4: Payment Methods accepted */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Способы оплаты
            </h4>
            <p className="text-xs text-[#a8908a]">
              Принимаем любые удобные способы оплаты в Таджикистане:
            </p>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-[11px] font-semibold border border-white/10">
                Alif Mobi (QR)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-[11px] font-semibold border border-white/10">
                Dushanbe City
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-[11px] font-semibold border border-white/10">
                Корти Милли
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-[11px] font-semibold border border-white/10">
                Visa / Mastercard
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-[11px] font-semibold border border-white/10">
                Наличными курьеру
              </span>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-[#2e1d1a] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8c746e]">
          <p>© 2026 «Клубника Душанбе». Все права защищены.</p>
          <p className="flex items-center gap-1">
            Сделано с любовью для жителей столицы Таджикистана <span className="text-red-500">❤️</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
