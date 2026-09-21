import React from 'react';
import { Star, MessageSquare, Quote, Heart } from 'lucide-react';
import { REVIEWS } from '../data/mockData';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-12 bg-[#faf7f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffe8ed] text-[#d61e4b] text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-[#d61e4b]" />
            <span>Любимые отзывы</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#241715] font-['Playfair_Display',serif]">
            Что говорят жители Душанбе
          </h2>
          <p className="text-xs sm:text-sm text-[#70564f]">
            Более 1,500 счастливых клиентов и доставленных ягодных наборов
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white p-5 rounded-2xl border border-[#ede0db] shadow-xs flex flex-col justify-between space-y-3 relative hover:shadow-md transition-shadow"
            >
              <Quote className="w-6 h-6 text-[#ffd5df] absolute top-3 right-3" />

              <div className="space-y-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-[#543b35] leading-relaxed italic">
                  &quot;{review.text}&quot;
                </p>
              </div>

              <div className="pt-2 border-t border-[#f5eae5]">
                <p className="text-xs font-bold text-[#241715]">{review.author}</p>
                <p className="text-[11px] text-[#8c746e]">{review.district}</p>
                <span className="inline-block mt-1 text-[10px] text-[#e31b4c] font-medium bg-[#fff0f3] px-2 py-0.5 rounded-md">
                  {review.product}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
