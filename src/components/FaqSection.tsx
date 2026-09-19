import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { defaultFaqs } from '../data/defaultData';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const { language, theme } = useSite();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 lg:py-28 bg-[#FAF7F2] border-b border-[#E8DFD3]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE8DC] text-[#6E5D4C] text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>{language === 'ko' ? '자주 묻는 질문' : 'Frequently Asked Questions'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1E1915] font-display">
            {language === 'ko' ? '라엘리안 철학과 활동 FAQ' : 'Everything You Need to Know'}
          </h2>
          <p className="text-base text-[#685746]">
            {language === 'ko' 
              ? '처음 접하시는 분들이 가장 궁금해하시는 질문과 답변을 모았습니다.' 
              : 'Clear answers to frequent inquiries regarding the Elohim and the Bhutan chapter.'}
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-4 text-left">
          {defaultFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E3D6C7] overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FCFAF7] transition-colors"
                >
                  <span className="text-base sm:text-lg font-bold text-[#1E1915] font-display">
                    {faq.q[language]}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'text-white' : 'text-[#8E7D6D] bg-[#F2EAE0]'
                    }`}
                    style={{ backgroundColor: isOpen ? theme.accentColor : undefined }}
                  >
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-0 text-sm sm:text-base text-[#524436] leading-relaxed border-t border-[#F2EAE0]">
                    <p className="pt-4">
                      {faq.a[language]}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
