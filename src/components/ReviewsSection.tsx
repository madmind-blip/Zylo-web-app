import React from 'react';
import { Star, ShieldCheck, MapPin, ThumbsUp, Quote } from 'lucide-react';
import { REVIEWS } from '../data/content';

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews-section" className="py-16 sm:py-24 bg-[#0A0A0A] border-b border-[#242424]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141414] border border-[#242424] text-xs font-semibold text-[#D4AF37] mb-3">
            <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
            <span>4.9 / 5.0 Rating (2,800+ Happy Customers)</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight mb-3">
            VERIFIED BUYER DROPS
          </h2>

          <p className="font-body text-zinc-400 text-sm sm:text-base">
            Real feedback from customers rocking Zyle street combos & watches across Kota, Rajasthan, and all of India.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#141414] hover:bg-[#181818] border border-[#242424] hover:border-[#D4AF37]/40 rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50"
            >
              <div>
                {/* Header: Stars & Tag */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating
                            ? 'fill-[#D4AF37] text-[#D4AF37]'
                            : 'text-zinc-600'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-[10px] sm:text-xs font-bold font-heading text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full border border-[#D4AF37]/20">
                    {rev.tag}
                  </span>
                </div>

                {/* Comment */}
                <p className="font-body text-zinc-300 text-xs sm:text-sm leading-relaxed mb-4 italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#242424] flex items-center justify-between text-xs">
                <div>
                  <div className="font-heading font-bold text-white flex items-center gap-1">
                    <span>{rev.name}</span>
                    {rev.verified && (
                      <span title="Verified Customer" className="inline-flex">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                    <MapPin className="w-3 h-3 text-[#D4AF37]" />
                    <span>{rev.city}</span>
                    <span>•</span>
                    <span>{rev.date}</span>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-400 bg-[#0A0A0A] px-2 py-1 rounded-lg border border-[#242424] max-w-[130px] truncate text-right">
                  {rev.productBought}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
