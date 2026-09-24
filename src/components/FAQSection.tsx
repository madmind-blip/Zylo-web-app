import React, { useState } from 'react';
import { ChevronDown, MessageCircle, HelpCircle, Sparkles } from 'lucide-react';
import { FAQS, BRAND } from '../data/content';
import { getWhatsAppNumberClean } from '../utils/whatsapp';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // first item open by default

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleAskWhatsApp = () => {
    const phone = getWhatsAppNumberClean();
    const text = encodeURIComponent('Hi Zyle Team! 👋 I have a quick question about ordering from Kota.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <section id="faq-section" className="py-16 sm:py-24 bg-[#0A0A0A] border-b border-[#242424]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141414] border border-[#242424] text-xs font-semibold text-[#D4AF37] mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Clear & Honest Policies</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight mb-3">
            FREQUENTLY ASKED
          </h2>

          <p className="font-body text-zinc-400 text-sm sm:text-base">
            Everything you need to know about deliveries, cash on delivery, sizes, and instant WhatsApp ordering.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`bg-[#141414] border rounded-2xl overflow-hidden transition-all duration-200 ${
                  isOpen ? 'border-[#D4AF37]/50 shadow-md shadow-black/40' : 'border-[#242424] hover:border-zinc-700'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-md border border-[#D4AF37]/20 shrink-0">
                      {faq.category}
                    </span>
                    <span className="font-heading font-bold text-sm sm:text-base text-white">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#D4AF37]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm font-body text-zinc-300 leading-relaxed border-t border-[#242424]/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help Banner */}
        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-[#141414] via-[#1a1710] to-[#141414] border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-heading font-bold text-base text-white">
              Have a special custom question?
            </h4>
            <p className="text-xs text-zinc-400 font-body">
              Chat live with our Kota team on WhatsApp for size recommendation or instant video view of pieces.
            </p>
          </div>

          <button
            onClick={handleAskWhatsApp}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black font-heading font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#25D366]/20 shrink-0 cursor-pointer active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-black stroke-black" />
            <span>Chat on WhatsApp</span>
          </button>
        </div>
      </div>
    </section>
  );
};
