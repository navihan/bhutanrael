import React from 'react';
import { useSite } from '../context/SiteContext';
import { Sparkles, ArrowRight, BookOpen, Compass, ShieldCheck, Heart, Edit3 } from 'lucide-react';

export const Hero: React.FC = () => {
  const { content, theme, language, setIsAdminOpen, isAdminAuthenticated } = useSite();
  const { hero } = content;

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#E9DFD3]">
      {/* Background Subtle Gradient & Glow */}
      <div 
        className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ backgroundColor: theme.accentColor }}
      />
      <div 
        className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none bg-amber-400"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE7DC] border border-[#DDD3C5] text-xs font-semibold text-[#5A4D3E]">
              <span 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: theme.accentColor }}
              />
              <span>{hero.badge[language]}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-bold tracking-tight text-[#1E1915] leading-[1.2] font-display">
              {hero.title[language]}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#5E5144] leading-relaxed max-w-2xl">
              {hero.subtitle[language]}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={hero.primaryCtaLink}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
                style={{ backgroundColor: theme.accentColor }}
              >
                <span>{hero.primaryCtaText[language]}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={hero.secondaryCtaLink}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-[#D5C8B8] text-[#3D332A] font-semibold text-sm hover:bg-[#F7F2EA] transition-all transform hover:-translate-y-0.5 shadow-xs cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#8C7A68]" />
                <span>{hero.secondaryCtaText[language]}</span>
              </a>

              {/* Quick Admin customize button - strictly visible to logged in admin */}
              {isAdminAuthenticated && (
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#7C6C5C] hover:text-[#EA580C] hover:bg-[#EFE8DC] rounded-lg transition-colors cursor-pointer"
                  title="헤더 및 텍스트 관리자에서 수정"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{language === 'ko' ? '콘텐츠 편집' : 'Edit Text'}</span>
                </button>
              )}
            </div>

            {/* 3 Core Trust / Value Metrics */}
            <div className="pt-8 border-t border-[#E8DFD3] grid grid-cols-3 gap-4 sm:gap-6">
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-display text-[#1E1915]">
                  100+
                </div>
                <div className="text-xs text-[#736454] mt-0.5">
                  {language === 'ko' ? '전 세계 활동 국가' : 'Active Countries'}
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-display text-[#1E1915]">
                  1973
                </div>
                <div className="text-xs text-[#736454] mt-0.5">
                  {language === 'ko' ? '엘로힘 메시지 시작' : 'First Encounter'}
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold font-display text-[#1E1915]">
                  100%
                </div>
                <div className="text-xs text-[#736454] mt-0.5">
                  {language === 'ko' ? '평화주의 & 비폭력' : 'Peace & Non-Violence'}
                </div>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100">
              <img
                src={hero.heroImage}
                alt="Bhutan Mountain Sanctuary and Elohim Light"
                className="w-full h-80 sm:h-96 lg:h-[430px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Floating Overlay Badge on Image */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/40 shadow-lg text-left">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'ko' ? '외계인 대사관 후보지 • 부탄' : 'CANDIDATE SANCTUARY • BHUTAN'}</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-[#2E2822] mt-1 leading-snug">
                  {language === 'ko'
                    ? '히말라야의 청정 자연과 국민총행복(GNH) 가치가 깃든 평화의 상징지'
                    : 'A serene Himalayan sanctuary aligned with Gross National Happiness and eternal peace.'}
                </p>
              </div>
            </div>

            {/* Decorative Floating Pill */}
            <div className="absolute -top-4 -right-3 sm:-right-4 px-4 py-2.5 rounded-xl bg-white shadow-xl border border-[#E5DAD0] flex items-center gap-2.5">
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: theme.accentColor }}
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-[#1E1915]">
                  {language === 'ko' ? '무한한 우주적 사랑' : 'Infinite Cosmic Love'}
                </div>
                <div className="text-[10px] text-[#7C6C5C]">
                  {language === 'ko' ? '과학적 평화 철학' : 'Scientific Philosophy'}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
