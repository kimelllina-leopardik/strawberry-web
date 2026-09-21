import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle, ShieldCheck, Truck, Clock, QrCode, CreditCard, 
  Banknote, ArrowLeft, ArrowRight, Gift, MapPin, Phone, User, 
  ExternalLink, Copy, Check, MessageCircle, Printer, AlertCircle, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, District, PaymentMethod, CustomerDetails, Order } from '../types';
import { DUSHANBE_DISTRICTS, STORE_INFO } from '../data/mockData';
import { formatPrice, formatTajikPhone, generateOrderId, saveOrderToStorage } from '../utils/helpers';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discount,
  promoCode,
  onOrderCompleted,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'delivery' | 'payment' | 'processing' | 'success'>('delivery');

  // Customer Details Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+992 ');
  const [districtId, setDistrictId] = useState<string>(DUSHANBE_DISTRICTS[0].id);
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState(''); // Essential in Dushanbe
  const [deliveryType, setDeliveryType] = useState<'urgent' | 'scheduled'>('urgent');
  const [scheduledDate, setScheduledDate] = useState('2026-09-22');
  const [scheduledTime, setScheduledTime] = useState('14:00 - 16:00');
  const [isAnonymousGift, setIsAnonymousGift] = useState(false);
  const [giftCardText, setGiftCardText] = useState('');
  const [notes, setNotes] = useState('');
  const [cashChangeFrom, setCashChangeFrom] = useState('Без сдачи');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('alif_mobi');

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // 3D Secure Modal simulation
  const [showSmsVerification, setShowSmsVerification] = useState(false);
  const [smsCode, setSmsCode] = useState('');

  // Errors & Loading
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copiedAlif, setCopiedAlif] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Selected district calculations
  const selectedDistrict = DUSHANBE_DISTRICTS.find((d) => d.id === districtId) || DUSHANBE_DISTRICTS[0];
  const isFreeDelivery = subtotal >= selectedDistrict.freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : selectedDistrict.deliveryFee;
  const finalTotal = Math.max(0, subtotal - discount + deliveryFee);

  // Format phone input
  const handlePhoneChange = (val: string) => {
    setPhone(formatTajikPhone(val));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
  };

  // Card formatting
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  // Validation
  const validateDeliveryStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Укажите ваше имя';
    
    // Check Tajik phone length
    const rawPhoneDigits = phone.replace(/\D/g, '');
    if (rawPhoneDigits.length < 11) {
      newErrors.phone = 'Укажите полный номер (+992 XX XXX XX XX)';
    }

    if (!address.trim()) {
      newErrors.address = 'Укажите улицу, номер дома или квартиры';
    }

    if (!landmark.trim()) {
      newErrors.landmark = 'Укажите ориентир в Душанбе (например: возле Серены, ЦУМ, 82 мкрн)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDeliveryStep()) {
      setStep('payment');
    }
  };

  // Process Online Payment
  const handleCompleteOrder = () => {
    if (paymentMethod === 'korti_milli' || paymentMethod === 'bank_card') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        setErrors({ card: 'Введите корректный 16-значный номер карты' });
        return;
      }
      if (cardExpiry.length < 5) {
        setErrors({ card: 'Введите срок действия (ММ/ГГ)' });
        return;
      }
      // Trigger 3D Secure SMS code popup
      setShowSmsVerification(true);
      return;
    }

    finalizeOrder('paid');
  };

  const finalizeOrder = (payStatus: 'paid' | 'pending' = 'paid') => {
    setStep('processing');

    setTimeout(() => {
      const orderId = generateOrderId();
      const customer: CustomerDetails = {
        name,
        phone,
        districtId,
        address,
        landmark,
        deliveryType,
        scheduledDate: deliveryType === 'scheduled' ? scheduledDate : undefined,
        scheduledTime: deliveryType === 'scheduled' ? scheduledTime : undefined,
        isAnonymousGift,
        giftCardText: giftCardText || undefined,
        notes: notes || undefined,
        cashChangeFrom: paymentMethod === 'cash_on_delivery' ? cashChangeFrom : undefined,
      };

      const newOrder: Order = {
        id: orderId,
        createdAt: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        customer,
        items,
        subtotal,
        deliveryFee,
        discount,
        promoCode,
        total: finalTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : payStatus,
        orderStatus: 'received',
        estimatedDeliveryTime: deliveryType === 'urgent' ? selectedDistrict.estimatedTime : `${scheduledDate}, ${scheduledTime}`,
        courierName: 'Бахром С.',
        courierPhone: '+992 900 77 66 55',
      };

      saveOrderToStorage(newOrder);
      setCreatedOrder(newOrder);
      onOrderCompleted(newOrder);
      setStep('success');

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff2a5f', '#ff6b8b', '#22c55e', '#f59e0b', '#ffffff'],
        });
      } catch (err) {
        // ignore
      }
    }, 1400);
  };

  const handleCopyAlif = () => {
    navigator.clipboard.writeText('+992900123456');
    setCopiedAlif(true);
    setTimeout(() => setCopiedAlif(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // WhatsApp pre-filled link
  const getWhatsAppLink = () => {
    if (!createdOrder) return '';
    const text = encodeURIComponent(
      `Здравствуйте! Я оформил заказ № ${createdOrder.id} на сайте «Клубника Душанбе».\n` +
      `Сумма: ${createdOrder.total} сомони.\n` +
      `Адрес доставки: г. Душанбе, ${selectedDistrict.name}, ${address}.\n` +
      `Ориентир: ${landmark}.\n` +
      `Оплата: ${paymentMethod === 'alif_mobi' ? 'Alif Mobi' : paymentMethod === 'dushanbe_city' ? 'Dushanbe City' : paymentMethod === 'korti_milli' ? 'Корти Милли' : 'При получении'}.`
    );
    return `https://wa.me/992900123456?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#ede0db] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#fffcfb] px-5 sm:px-6 py-4 border-b border-[#f0e4df] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ff2a5f] to-[#ff6b8b] text-white flex items-center justify-center font-bold text-sm">
              🍓
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg text-[#241715]">
                {step === 'delivery' && 'Оформление доставки в Душанбе'}
                {step === 'payment' && 'Онлайн-оплата заказа'}
                {step === 'processing' && 'Обработка платежа...'}
                {step === 'success' && 'Заказ успешно оформлен!'}
              </h2>
              <p className="text-[11px] text-[#8c746e]">
                {step === 'delivery' && 'Шаг 1 из 2: Адрес и контакты'}
                {step === 'payment' && 'Шаг 2 из 2: Способ оплаты'}
                {step === 'success' && `Номер заказа #${createdOrder?.id}`}
              </p>
            </div>
          </div>

          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full text-[#8c746e] hover:text-[#241715] hover:bg-[#f6ede8] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          
          {/* STEP 1: DELIVERY FORM */}
          {step === 'delivery' && (
            <form onSubmit={handleProceedToPayment} className="space-y-4">
              
              {/* Recipient name and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs font-bold text-[#241715] flex items-center gap-1 mb-1">
                    <User className="w-3.5 h-3.5 text-[#ff3366]" />
                    Ваше имя или имя получателя *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    placeholder="Например: Зарина / Фарход"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#ebd8d0] focus:border-[#ff3366] focus:outline-hidden bg-[#faf7f5]"
                  />
                  {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-[#241715] flex items-center gap-1 mb-1">
                    <Phone className="w-3.5 h-3.5 text-[#ff3366]" />
                    Номер телефона в Таджикистане *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+992 (90) 012-34-56"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#ebd8d0] focus:border-[#ff3366] focus:outline-hidden bg-[#faf7f5]"
                  />
                  {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* District of Dushanbe */}
              <div>
                <label className="text-xs font-bold text-[#241715] flex items-center gap-1 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#ff3366]" />
                  Район доставки по Душанбе *
                </label>
                <select
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#ebd8d0] focus:border-[#ff3366] focus:outline-hidden bg-[#faf7f5] cursor-pointer"
                >
                  {DUSHANBE_DISTRICTS.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name} — Доставка: {district.deliveryFee} с. (Бесплатно от {district.freeDeliveryThreshold} с.)
                    </option>
                  ))}
                </select>
                <div className="flex items-center justify-between text-[11px] text-[#7a625c] mt-1.5 px-1">
                  <span>Примерное время в пути: <strong>{selectedDistrict.estimatedTime}</strong></span>
                  <span className={isFreeDelivery ? 'text-[#15803d] font-bold' : ''}>
                    {isFreeDelivery ? '✓ Бесплатная доставка' : `Тариф доставки: ${selectedDistrict.deliveryFee} с.`}
                  </span>
                </div>
              </div>

              {/* Street & Landmark */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs font-bold text-[#241715] block mb-1">
                    Улица, дом / квартира *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors((prev) => ({ ...prev, address: '' }));
                    }}
                    placeholder="Например: ул. Айни, дом 45, кв. 12"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#ebd8d0] focus:border-[#ff3366] focus:outline-hidden bg-[#faf7f5]"
                  />
                  {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-[#241715] block mb-1">
                    Ориентир (в Душанбе обязателен) *
                  </label>
                  <input
                    type="text"
                    required
                    value={landmark}
                    onChange={(e) => {
                      setLandmark(e.target.value);
                      if (errors.landmark) setErrors((prev) => ({ ...prev, landmark: '' }));
                    }}
                    placeholder="Например: около Серены, Садбарг, ЦУМ"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#ebd8d0] focus:border-[#ff3366] focus:outline-hidden bg-[#faf7f5]"
                  />
                  {errors.landmark && <p className="text-[11px] text-red-500 mt-1">{errors.landmark}</p>}
                </div>
              </div>

              {/* Delivery Type */}
              <div className="pt-2">
                <label className="text-xs font-bold text-[#241715] block mb-1.5">
                  Желаемое время доставки:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('urgent')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      deliveryType === 'urgent'
                        ? 'border-[#ff3366] bg-[#fff5f7] text-[#c71f46] shadow-xs'
                        : 'border-[#ebd8d0] bg-white text-[#543b35]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Срочно ({selectedDistrict.estimatedTime})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('scheduled')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      deliveryType === 'scheduled'
                        ? 'border-[#ff3366] bg-[#fff5f7] text-[#c71f46] shadow-xs'
                        : 'border-[#ebd8d0] bg-white text-[#543b35]'
                    }`}
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>К празднику / ко времени</span>
                  </button>
                </div>

                {deliveryType === 'scheduled' && (
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-1">
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="text-xs p-2 rounded-xl border border-[#ebd8d0] bg-[#faf7f5]"
                    />
                    <select
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="text-xs p-2 rounded-xl border border-[#ebd8d0] bg-[#faf7f5]"
                    >
                      <option value="09:00 - 11:00">Утро (09:00 - 11:00)</option>
                      <option value="11:00 - 13:00">День (11:00 - 13:00)</option>
                      <option value="14:00 - 16:00">День (14:00 - 16:00)</option>
                      <option value="17:00 - 19:00">Вечер (17:00 - 19:00)</option>
                      <option value="19:00 - 21:00">Вечер (19:00 - 21:00)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Surprise gift checkbox */}
              <div className="p-3 bg-[#fff8fa] rounded-2xl border border-[#fedfe6] space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-[#241715]">
                  <input
                    type="checkbox"
                    checked={isAnonymousGift}
                    onChange={(e) => setIsAnonymousGift(e.target.checked)}
                    className="w-4 h-4 rounded text-[#e31b4c] focus:ring-[#e31b4c] accent-[#e31b4c]"
                  />
                  <span>🎁 Это подарок-сюрприз (Анонимное вручение)</span>
                </label>
                <p className="text-[11px] text-[#7d5660] pl-6.5">
                  Курьер не скажет, от кого заказ, только торжественно поздравит и передаст ягоды с вашей открыткой.
                </p>

                {isAnonymousGift && (
                  <textarea
                    value={giftCardText}
                    onChange={(e) => setGiftCardText(e.target.value)}
                    placeholder="Текст для поздравительной открытки..."
                    rows={2}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#ebd8d0] focus:border-[#ff3366] bg-white"
                  />
                )}
              </div>

              {/* Order summary bar & button */}
              <div className="pt-3 border-t border-[#f0e4df] flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-[#8c746e] block">К оплате с доставкой:</span>
                  <span className="text-xl font-black text-[#241715]">
                    {formatPrice(finalTotal)}
                  </span>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#e31b4c] to-[#ff3b6b] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#e31b4c]/25 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Перейти к оплате</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: ONLINE PAYMENT METHOD */}
          {step === 'payment' && (
            <div className="space-y-4">
              
              <div className="flex items-center justify-between pb-2 border-b border-[#f0e4df]">
                <button
                  onClick={() => setStep('delivery')}
                  className="text-xs text-[#8c746e] hover:text-[#241715] flex items-center gap-1 cursor-pointer font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Назад к адресу
                </button>
                <span className="text-xs font-semibold text-[#241715]">
                  Итого: <strong className="text-[#e31b4c] text-sm">{formatPrice(finalTotal)}</strong>
                </span>
              </div>

              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* Alif Mobi */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('alif_mobi')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'alif_mobi'
                      ? 'border-[#00aa5b] bg-[#eefaf3] shadow-md ring-2 ring-[#00aa5b]/20'
                      : 'border-[#ebd8d0] bg-white hover:border-[#d9c5bd]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-[#00aa5b] text-white font-black text-xs flex items-center justify-center mx-auto mb-1.5 shadow-xs">
                    alif
                  </div>
                  <p className="text-xs font-bold text-[#241715]">Alif Mobi</p>
                  <p className="text-[10px] text-[#00aa5b] font-medium">QR / Кошелек</p>
                </button>

                {/* Dushanbe City */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('dushanbe_city')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'dushanbe_city'
                      ? 'border-[#1b365d] bg-[#eff4fa] shadow-md ring-2 ring-[#1b365d]/20'
                      : 'border-[#ebd8d0] bg-white hover:border-[#d9c5bd]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-[#1b365d] text-white font-black text-[10px] flex items-center justify-center mx-auto mb-1.5 shadow-xs">
                    DC
                  </div>
                  <p className="text-xs font-bold text-[#241715]">Dushanbe City</p>
                  <p className="text-[10px] text-[#1b365d] font-medium">QR / Карта DC</p>
                </button>

                {/* Korti Milli */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('korti_milli')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'korti_milli'
                      ? 'border-[#ff3366] bg-[#fff5f7] shadow-md ring-2 ring-[#ff3366]/20'
                      : 'border-[#ebd8d0] bg-white hover:border-[#d9c5bd]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-[#e31b4c] text-white font-black text-[10px] flex items-center justify-center mx-auto mb-1.5 shadow-xs">
                    КМ
                  </div>
                  <p className="text-xs font-bold text-[#241715]">Корти Милли</p>
                  <p className="text-[10px] text-[#e31b4c] font-medium">Банки РТ</p>
                </button>

                {/* Cash on delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash_on_delivery')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-[#241715] bg-[#f7ede8] shadow-md ring-2 ring-[#241715]/20'
                      : 'border-[#ebd8d0] bg-white hover:border-[#d9c5bd]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-[#241715] text-white flex items-center justify-center mx-auto mb-1.5 shadow-xs">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-[#241715]">Курьеру</p>
                  <p className="text-[10px] text-[#69524b] font-medium">Наличными / QR</p>
                </button>
              </div>

              {/* METHOD 1: ALIF MOBI VIEW */}
              {paymentMethod === 'alif_mobi' && (
                <div className="bg-[#f0faf4] p-4 sm:p-5 rounded-2xl border border-[#b8ebd0] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-[#00aa5b] text-white text-[11px] font-extrabold">
                        ALIF PAY
                      </span>
                      <span className="text-xs font-bold text-[#006837]">
                        Мгновенная оплата без комиссии
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-[#006837]">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-white p-3.5 rounded-xl border border-[#d2f0e0]">
                    {/* QR code visual */}
                    <div className="sm:col-span-4 flex flex-col items-center justify-center p-2 bg-white rounded-lg border border-gray-200">
                      <div className="w-28 h-28 bg-white p-1 rounded-md flex items-center justify-center border border-gray-100 shadow-xs relative">
                        {/* Realistic SVG representation of QR */}
                        <svg className="w-full h-full text-[#14231b]" viewBox="0 0 100 100" fill="currentColor">
                          <rect x="5" y="5" width="28" height="28" rx="2" />
                          <rect x="10" y="10" width="18" height="18" fill="white" />
                          <rect x="14" y="14" width="10" height="10" fill="#00aa5b" />
                          
                          <rect x="67" y="5" width="28" height="28" rx="2" />
                          <rect x="72" y="10" width="18" height="18" fill="white" />
                          <rect x="76" y="14" width="10" height="10" fill="#00aa5b" />

                          <rect x="5" y="67" width="28" height="28" rx="2" />
                          <rect x="10" y="72" width="18" height="18" fill="white" />
                          <rect x="14" y="76" width="10" height="10" fill="#00aa5b" />

                          <rect x="40" y="8" width="6" height="12" />
                          <rect x="50" y="15" width="10" height="6" />
                          <rect x="42" y="30" width="18" height="8" />
                          <rect x="70" y="42" width="12" height="12" />
                          <rect x="40" y="50" width="10" height="16" />
                          <rect x="55" y="65" width="14" height="10" />
                          <rect x="75" y="70" width="18" height="8" />
                          <rect x="85" y="82" width="8" height="10" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-6 h-6 rounded-full bg-[#00aa5b] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                            a
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 font-medium">Отсканируйте в Alif</span>
                    </div>

                    {/* Alif Instructions */}
                    <div className="sm:col-span-8 text-xs text-[#241715] space-y-2">
                      <p className="font-semibold text-xs">Как оплатить через Алиф:</p>
                      <ol className="list-decimal list-inside space-y-1 text-[11px] text-[#3e5549]">
                        <li>Откройте приложение <strong>Alif Mobi</strong></li>
                        <li>Нажмите кнопку <strong>«QR»</strong> и наведите камеру</li>
                        <li>Либо сделайте перевод по номеру:</li>
                      </ol>
                      
                      {/* Copy number */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="font-mono font-bold text-xs bg-[#eefaf3] text-[#006837] px-2.5 py-1.5 rounded-lg border border-[#c4ebd4]">
                          +992 900 12 34 56
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyAlif}
                          className="flex items-center gap-1 text-[11px] font-semibold text-[#00aa5b] hover:text-[#006837] cursor-pointer"
                        >
                          {copiedAlif ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedAlif ? 'Скопировано!' : 'Скопировать'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => finalizeOrder('paid')}
                    className="w-full py-3 rounded-xl bg-[#00aa5b] hover:bg-[#008f4c] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Я оплатил через Alif Mobi ({formatPrice(finalTotal)})</span>
                  </button>
                </div>
              )}

              {/* METHOD 2: DUSHANBE CITY */}
              {paymentMethod === 'dushanbe_city' && (
                <div className="bg-[#f0f4fa] p-4 sm:p-5 rounded-2xl border border-[#c2d4ec] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-[#1b365d] text-white text-[11px] font-extrabold">
                      DUSHANBE CITY
                    </span>
                    <span className="text-xs font-bold text-[#1b365d]">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>

                  <p className="text-xs text-[#334e73] leading-relaxed">
                    Откройте приложение <strong>DC Кошелек</strong> или используйте терминалы Dushanbe City для быстрой оплаты по номеру кошелька:
                  </p>

                  <div className="p-3 bg-white rounded-xl border border-[#cbdcf2] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-500 block">Номер кошелька / карты DC:</span>
                      <span className="font-mono font-bold text-sm text-[#1b365d]">9771 2900 1234 5678</span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">Получатель: Клубника Душанбе</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => finalizeOrder('paid')}
                    className="w-full py-3 rounded-xl bg-[#1b365d] hover:bg-[#142845] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Подтвердить оплату через DC</span>
                  </button>
                </div>
              )}

              {/* METHOD 3: KORTI MILLI / BANK CARD */}
              {(paymentMethod === 'korti_milli' || paymentMethod === 'bank_card') && (
                <div className="bg-[#fff9fa] p-4 sm:p-5 rounded-2xl border border-[#fedbe3] space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#241715] flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-[#e31b4c]" />
                      Карты банков Таджикистана (Корти Милли / Visa)
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" /> 256-bit SSL
                    </div>
                  </div>

                  {errors.card && (
                    <p className="text-[11px] text-red-500 bg-red-50 p-2 rounded-lg">{errors.card}</p>
                  )}

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-[#4a342f] block mb-1">
                        Номер карты (16 цифр)
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        placeholder="9771 •••• •••• ••••"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#ebd8d0] focus:border-[#e31b4c] focus:outline-hidden bg-white font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-[#4a342f] block mb-1">
                          Срок действия (ММ/ГГ)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => handleCardExpiryChange(e.target.value)}
                          placeholder="12/28"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#ebd8d0] focus:border-[#e31b4c] focus:outline-hidden bg-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-[#4a342f] block mb-1">
                          CVC / CVV
                        </label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                          placeholder="•••"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#ebd8d0] focus:border-[#e31b4c] focus:outline-hidden bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCompleteOrder}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#e31b4c] to-[#ff3b6b] hover:from-[#d11442] hover:to-[#f02959] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Оплатить {formatPrice(finalTotal)}</span>
                  </button>
                </div>
              )}

              {/* METHOD 4: CASH ON DELIVERY */}
              {paymentMethod === 'cash_on_delivery' && (
                <div className="bg-[#faf6f4] p-4 sm:p-5 rounded-2xl border border-[#e8d7cf] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#241715]">
                    <Banknote className="w-4 h-4 text-[#e31b4c]" />
                    <span>Оплата наличными или картой при встрече с курьером</span>
                  </div>
                  <p className="text-xs text-[#6e5852] leading-relaxed">
                    Курьер доставит свежие ягоды в термобоксе. Вы сможете проверить целостность и красоту клубники перед оплатой.
                  </p>

                  <div>
                    <label className="text-xs font-bold text-[#241715] block mb-1">
                      С какой суммы приготовить сдачу?
                    </label>
                    <select
                      value={cashChangeFrom}
                      onChange={(e) => setCashChangeFrom(e.target.value)}
                      className="w-full text-xs px-3.5 py-2 rounded-xl border border-[#ebd8d0] bg-white cursor-pointer"
                    >
                      <option value="Без сдачи">Без сдачи (точная сумма)</option>
                      <option value="со 100 сомони">Сдача со 100 сомони</option>
                      <option value="с 200 сомони">Сдача с 200 сомони</option>
                      <option value="с 500 сомони">Сдача с 500 сомони</option>
                      <option value="Оплата картой через терминал курьера">Буду оплачивать картой через терминал курьера</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => finalizeOrder('pending')}
                    className="w-full py-3 rounded-xl bg-[#241715] hover:bg-black text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Подтвердить заказ ({formatPrice(finalTotal)})</span>
                  </button>
                </div>
              )}

            </div>
          )}

          {/* PROCESSING SPINNER */}
          {step === 'processing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-[#ffccd6] border-t-[#e31b4c] animate-spin" />
                <span className="absolute inset-0 flex items-center justify-center text-xl">🍓</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-[#241715]">Подтверждаем оплату в Душанбе...</h3>
                <p className="text-xs text-[#8c746e] mt-1">
                  Связываемся со службой логистики и бронируем утренний сбор ягод
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: ORDER SUCCESS RECEIPT & TRACKING */}
          {step === 'success' && createdOrder && (
            <div className="space-y-5">
              
              {/* Top celebration badge */}
              <div className="text-center space-y-2 py-2">
                <div className="w-14 h-14 rounded-full bg-[#e8f8ee] text-[#15803d] flex items-center justify-center mx-auto text-2xl shadow-inner">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-[#241715] font-['Playfair_Display',serif]">
                  Ташаккур! Заказ принят
                </h3>
                <p className="text-xs text-[#6e5852] max-w-md mx-auto">
                  Номер заказа: <strong className="text-[#e31b4c] font-mono text-sm">#{createdOrder.id}</strong>. Мы уже готовим отборные ягоды к отправке.
                </p>
              </div>

              {/* Live Delivery Tracker Card */}
              <div className="bg-[#faf5f3] p-4 sm:p-5 rounded-2xl border border-[#ebd8d0] space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-[#241715]">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#e31b4c]" />
                    Статус доставки по Душанбе:
                  </span>
                  <span className="text-[#e31b4c] px-2.5 py-0.5 rounded-full bg-[#ffe8ed] text-[11px]">
                    В обработке
                  </span>
                </div>

                {/* Progress steps */}
                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-[#15803d] text-white flex items-center justify-center font-bold mb-1 shadow-xs">
                      ✓
                    </div>
                    <span className="font-semibold text-[#15803d]">Принят</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-[#e31b4c] text-white flex items-center justify-center font-bold mb-1 shadow-xs animate-pulse">
                      2
                    </div>
                    <span className="font-semibold text-[#241715]">Сборка ягод</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold mb-1">
                      3
                    </div>
                    <span className="text-gray-400">Курьер в пути</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold mb-1">
                      4
                    </div>
                    <span className="text-gray-400">Вручение</span>
                  </div>
                </div>

                {/* Delivery details info */}
                <div className="p-3 bg-white rounded-xl text-xs space-y-1.5 border border-[#f0dfd8]">
                  <div className="flex justify-between text-[#70564f]">
                    <span>Адрес доставки:</span>
                    <strong className="text-[#241715] text-right">{createdOrder.customer.address}</strong>
                  </div>
                  <div className="flex justify-between text-[#70564f]">
                    <span>Ориентир:</span>
                    <strong className="text-[#241715]">{createdOrder.customer.landmark}</strong>
                  </div>
                  <div className="flex justify-between text-[#70564f]">
                    <span>Расчетное время:</span>
                    <strong className="text-[#15803d]">{createdOrder.estimatedDeliveryTime}</strong>
                  </div>
                  <div className="flex justify-between text-[#70564f]">
                    <span>Курьер:</span>
                    <strong className="text-[#241715]">{createdOrder.courierName} ({createdOrder.courierPhone})</strong>
                  </div>
                </div>
              </div>

              {/* WhatsApp and Print Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-[#25d366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Написать менеджеру в WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-3 px-4 rounded-xl bg-white border border-[#ebd8d0] hover:bg-[#faf6f4] text-[#241715] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#8c746e]" />
                  <span>Распечатать чек заказа</span>
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#241715] hover:bg-black text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Вернуться к каталогу
              </button>

            </div>
          )}

        </div>
      </div>

      {/* Simulated 3D Secure SMS Verification Modal */}
      {showSmsVerification && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center gap-2 text-[#e31b4c] font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              <span>3D Secure: Подтверждение банка</span>
            </div>
            <p className="text-xs text-[#543b35]">
              На ваш номер телефона отправлен SMS-код для подтверждения списания <strong>{formatPrice(finalTotal)}</strong>.
            </p>
            <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-[11px] text-amber-800">
              Код подтверждения для теста: <strong>7788</strong>
            </div>
            <input
              type="text"
              maxLength={6}
              value={smsCode}
              onChange={(e) => setSmsCode(e.target.value)}
              placeholder="Введите 4-значный код"
              className="w-full text-center tracking-widest text-lg font-bold py-2 border rounded-xl"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowSmsVerification(false)}
                className="flex-1 py-2 text-xs text-gray-600 rounded-xl hover:bg-gray-100"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSmsVerification(false);
                  finalizeOrder('paid');
                }}
                className="flex-1 py-2 text-xs font-bold bg-[#e31b4c] text-white rounded-xl hover:bg-[#cf1341]"
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
