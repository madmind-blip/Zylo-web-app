import React, { useState } from 'react';
import { ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';
import { FAQS } from '../data/content';
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
    <section id="faq-section" className="py-16 sm:py-24 bg-white border-b border-neutral-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <div className="text-[11px] sm:text-xs uppercase font-medium tracking-widest text-neutral-500 mb-2">
            Clear & Transparent
          </div>

          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-[#1A1A1A] tracking-tight mb-3">
            FREQUENTLY ASKED
          </h2>

          <p className="font-body text-neutral-600 text-sm sm:text-base leading-relaxed">
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
                className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${
                  isOpen
                    ? 'border-neutral-400 shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded shrink-0">
                      {faq.category}
                    </span>
                    <span className="font-heading font-semibold text-sm sm:text-base text-[#1A1A1A]">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#1A1A1A]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm font-body text-neutral-600 leading-relaxed border-t border-neutral-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help Banner */}
        <div className="mt-10 p-5 sm:p-6 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="font-heading font-bold text-base text-[#1A1A1A]">
              Have a special custom question?
            </h4>
            <p className="text-xs text-neutral-500 font-body">
              Chat live with our Kota team on WhatsApp for size recommendations or instant photos of pieces.
            </p>
          </div>

          <button
            onClick={handleAskWhatsApp}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#4A5D45] text-white font-heading font-semibold text-xs sm:text-sm transition-colors shrink-0 cursor-pointer active:scale-98 shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </button>
        </div>
      </div>
    </section>
  );
};
