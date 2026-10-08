import React from 'react';
import { useSite } from '../context/SiteContext';
import { defaultPhilosophyPillars } from '../data/defaultData';
import { Dna, Building2, Smile, Infinity, CheckCircle, ArrowUpRight, Sparkles, BookOpen } from 'lucide-react';

export const PhilosophySection: React.FC = () => {
  const { content, theme, language } = useSite();

  const iconMap: Record<string, React.ElementType> = {
    dna: Dna,
    'building-2': Building2,
    heart: Smile,
    infinity: Infinity,
  };

  const pillars = defaultPhilosophyPillars.map(p => ({
    ...p,
    icon: iconMap[p.icon] || BookOpen
  }));

  return (
    <section id="philosophy" className="py-20 lg:py-28 bg-[#F5EFEB] border-b border-[#E6DCD0] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAE0D2] border border-[#DDD1C2] text-[#6B5A4A] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>{language === 'ko' ? '라엘리안 무브먼트 핵심 원리' : 'Core Raelian Philosophy'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1E1915] font-display">
            {language === 'ko' ? '라엘리안 무브먼트 4대 핵심 철학' : 'Intelligent Design & 4 Core Pillars'}
          </h2>
          <p className="text-[#665749] text-base leading-relaxed">
            {language === 'ko' 
              ? '신비주의와 맹신을 거부하고, 과학적 이성과 오감의 깨어남을 바탕으로 한 새로운 인본주의 철학'
              : 'A scientific humanist philosophy based on reason, sensory awakening, and universal love.'}
          </p>
        </div>

        {/* All 4 Core Pillars Grid - Completely Visible with No Truncation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="bg-white rounded-2xl border border-[#E0D4C5] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
              >
                {/* Image Banner */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-stone-100">
                  <img
                    src={pillar.image}
                    alt={pillar.title[language]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Pillar Index & Icon Pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span 
                      className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-white shadow-xs"
                      style={{ backgroundColor: theme.accentColor }}
                    >
                      Pillar 0{idx + 1}
                    </span>
                  </div>

                  {/* Icon floating badge */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#EA580C] shadow-xs">
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Tagline on image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs font-semibold leading-snug drop-shadow-sm">
                      {pillar.tagline[language].trim()}
                    </p>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-2">
                    {/* Full Title without any truncation or splitting */}
                    <h3 className="text-lg sm:text-xl font-bold text-[#1E1915] font-display leading-snug">
                      {pillar.title[language]}
                    </h3>
                    
                    {/* Full Tagline Subtitle */}
                    <p className="text-xs sm:text-sm font-semibold text-[#EA580C] leading-snug">
                      {pillar.tagline[language].trim()}
                    </p>

                    {/* Full Explanation Points / Paragraphs */}
                    <div className="pt-2 border-t border-[#F0E8DC] space-y-2">
                      {pillar.points[language].map((pt, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-[#EA580C] shrink-0 mt-1" />
                          <p className="text-xs sm:text-sm text-[#4E4135] leading-relaxed font-normal">
                            {pt}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-3 border-t border-[#F0E8DC] flex items-center justify-between">
                    <a
                      href="#books"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E1915] hover:text-[#EA580C] transition-colors"
                    >
                      <span>{language === 'ko' ? '관련 무료 도서 읽기' : 'Read Free eBook'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Raël's Quote Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-[#EFE8DC] border border-[#DDD0C0] text-center max-w-4xl mx-auto shadow-xs">
          <p className="text-base sm:text-lg italic font-display text-[#2B231C] leading-relaxed">
            "{content.about.quote[language]}"
          </p>
          <p className="text-xs font-bold text-[#7A6A5A] mt-2 uppercase tracking-wider">
            — {content.about.quoteAuthor[language]}
          </p>
        </div>

      </div>
    </section>
  );
};

