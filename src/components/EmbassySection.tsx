import React from 'react';
import { useSite } from '../context/SiteContext';
import { Building2, Globe2, ShieldCheck, Zap, Landmark, Check, ArrowRight } from 'lucide-react';

export const EmbassySection: React.FC = () => {
  const { content, theme, language, setIsAdminOpen } = useSite();
  const { embassy } = content;

  return (
    <section id="embassy" className="py-20 lg:py-28 bg-[#FAF7F2] border-b border-[#E8DFD3] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE8DC] text-[#6B5B4B] text-xs font-semibold uppercase tracking-wider">
            <Landmark className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>{language === 'ko' ? '인류사 최대의 프로젝트' : 'Greatest Project in Human History'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1E1915] font-display">
            {embassy.title[language]}
          </h2>
          <p className="text-base text-[#6E5D4C] max-w-2xl mx-auto">
            {embassy.subtitle[language]}
          </p>
        </div>

        {/* Big Feature Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Embassy Image & Visual Spec */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-stone-100">
              <img
                src={embassy.embassyImage}
                alt="Architectural Blueprint of Extraterrestrial Embassy"
                className="w-full h-80 sm:h-96 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
                {language === 'ko' ? '공식 대사관 기본 설계안' : 'Architectural Design Standard'}
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white text-left">
                <div className="text-base font-bold font-display">
                  {language === 'ko' ? '히말라야 평화의 성지, 부탄' : 'Himalayan Sanctuary, Kingdom of Bhutan'}
                </div>
                <div className="text-xs text-stone-200 mt-1">
                  {language === 'ko' 
                    ? '평화, 친환경, 국민총행복의 가치와 완벽한 조화를 이루는 영적 대사관 후보지' 
                    : 'A serene location aligned with peace, ecological purity, and spiritual openness.'}
                </div>
              </div>
            </div>

            {/* 3 Quick Facts */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-[#E3D8CB] text-center">
                <Globe2 className="w-5 h-5 mx-auto text-[#EA580C] mb-1" />
                <div className="text-xs font-bold text-[#1E1915]">
                  {language === 'ko' ? '치외법권 지위' : 'Extraterritorial'}
                </div>
                <div className="text-[10px] text-[#7C6D5F]">
                  {language === 'ko' ? '국제법상 중립 보장' : 'Neutral Territory'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E3D8CB] text-center">
                <ShieldCheck className="w-5 h-5 mx-auto text-[#EA580C] mb-1" />
                <div className="text-xs font-bold text-[#1E1915]">
                  {language === 'ko' ? '안전 비행 공역' : 'Safe Airspace'}
                </div>
                <div className="text-[10px] text-[#7C6D5F]">
                  {language === 'ko' ? '비행 제한 구역' : 'Protected Corridor'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E3D8CB] text-center">
                <Zap className="w-5 h-5 mx-auto text-[#EA580C] mb-1" />
                <div className="text-xs font-bold text-[#1E1915]">
                  {language === 'ko' ? '신기술 전수' : 'Tech Transfer'}
                </div>
                <div className="text-[10px] text-[#7C6D5F]">
                  {language === 'ko' ? '청정에너지 및 의학' : 'Clean Energy & Health'}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Narrative & Requirements */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="prose prose-stone">
              <h3 className="text-2xl font-bold text-[#1E1915] font-display">
                {language === 'ko' ? '왜 부탄에 대사관인가?' : 'Why an Embassy in Bhutan?'}
              </h3>
              <p className="text-[#55473A] text-sm sm:text-base leading-relaxed mt-2">
                {embassy.description[language]}
              </p>
            </div>

            {/* Checklist of Highlight Points */}
            <div className="space-y-3.5 pt-2">
              {embassy.highlightPoints[language].map((point, index) => (
                <div key={index} className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#E4D7C8] shadow-2xs">
                  <div 
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm font-medium text-[#382F26] leading-snug">
                    {point}
                  </span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all"
                style={{ backgroundColor: theme.accentColor }}
              >
                <span>{language === 'ko' ? '대사관 프로젝트 문의' : 'Inquire About Embassy'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#books"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F0E6D8] text-[#3D332A] font-semibold text-sm hover:bg-[#E8DDD0] transition-colors"
              >
                <span>{language === 'ko' ? '상세 계획서 도서 확인' : 'Read Official Blueprint'}</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
