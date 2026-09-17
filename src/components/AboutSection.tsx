import React from 'react';
import { useSite } from '../context/SiteContext';
import { Compass, Sparkles, Heart, Globe2, Shield, Eye } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { content, language, theme } = useSite();
  const { about } = content;

  return (
    <section id="about" className="py-20 lg:py-28 bg-[#FAF7F2] border-b border-[#E8DFD3] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE8DC] text-[#6E5D4C] text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>{language === 'ko' ? '무브먼트 소개' : 'About The Movement'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1E1915] font-display">
            {about.title[language]}
          </h2>
          <p className="text-base sm:text-lg text-[#665646]">
            {about.subtitle[language]}
          </p>
        </div>

        {/* Narrative & Visual 2-Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Image Collage */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-stone-100 relative h-96 sm:h-[440px]">
              <img
                src={about.aboutImage || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&auto=format&fit=crop&q=80"}
                alt="Bhutan Peace Culture"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-5 left-5 right-5 text-white text-left">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  {language === 'ko' ? '국민총행복과 과학적 영성의 조화' : 'Gross National Happiness & Science'}
                </div>
                <div className="text-sm font-medium mt-1">
                  {language === 'ko' 
                    ? '평화와 자연 보존을 국가 최우선 가치로 삼는 부탄의 지혜' 
                    : 'The wisdom of Bhutan prioritizing peace and environmental preservation.'}
                </div>
              </div>
            </div>

            {/* Float badge */}
            <div className="absolute -bottom-5 -right-3 sm:-right-5 bg-white p-4 rounded-xl shadow-lg border border-[#E5DAD0] text-left max-w-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-[#EA580C]">
                <Sparkles className="w-4 h-4" />
                <span>{language === 'ko' ? '초자연적 신비주의 탈피' : 'Non-mystical & Scientific'}</span>
              </div>
              <p className="text-[11px] text-[#635445] mt-1">
                {language === 'ko' 
                  ? '신화와 맹신 대신 이성과 과학, 생명공학적 관점으로 세계를 이해합니다.' 
                  : 'Understanding the origins of life through rational biotechnology and reason.'}
              </p>
            </div>
          </div>

          {/* Right Narrative Story */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="prose prose-stone">
              <h3 className="text-2xl font-bold text-[#1E1915] font-display">
                {language === 'ko' ? '부탄과 라엘리안 무브먼트의 만남' : 'Bhutan & The Raëlian Movement'}
              </h3>
              <p className="text-[#55473A] text-sm sm:text-base leading-relaxed mt-2">
                {about.description[language]}
              </p>
            </div>

            {/* 3 Value Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-[#E2D6C6] shadow-2xs">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white mb-2"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#1E1915]">
                  {language === 'ko' ? '완전한 탈군사화' : 'Demilitarization'}
                </div>
                <div className="text-[11px] text-[#786756] mt-1 leading-snug">
                  {language === 'ko' ? '모든 핵무기와 침략 전쟁의 종식 촉구' : 'Universal non-violence and ban on all weapons'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E2D6C6] shadow-2xs">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white mb-2"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  <Eye className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#1E1915]">
                  {language === 'ko' ? '지적설계 인식' : 'Intelligent Design'}
                </div>
                <div className="text-[11px] text-[#786756] mt-1 leading-snug">
                  {language === 'ko' ? 'DNA 합성 및 생명공학적 기원의 과학적 이해' : 'Understanding life via advanced DNA synthesis'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E2D6C6] shadow-2xs">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white mb-2"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  <Heart className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-[#1E1915]">
                  {language === 'ko' ? '인간애와 행복' : 'Love & Joy'}
                </div>
                <div className="text-[11px] text-[#786756] mt-1 leading-snug">
                  {language === 'ko' ? '부탄 GNH와 조화되는 감각의 각성과 자아실현' : 'Inner awakening and sensory self-actualization'}
                </div>
              </div>
            </div>

            {/* Quote Block */}
            <div className="p-4 rounded-xl bg-[#F0E6D8] border border-[#DDD0C0]">
              <p className="text-xs sm:text-sm italic text-[#382E24] font-medium">
                "{about.quote[language]}"
              </p>
              <div className="text-right text-[11px] font-bold text-[#EA580C] mt-1">
                — {about.quoteAuthor[language]}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
