import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Dna, Building2, Smile, Infinity, CheckCircle, ArrowUpRight, Sparkles } from 'lucide-react';

export const PhilosophySection: React.FC = () => {
  const { content, theme, language } = useSite();
  const [activeTab, setActiveTab] = useState<number>(0);

  const pillars = [
    {
      id: 'design',
      icon: Dna,
      title: {
        ko: '과학적 지적설계 (Intelligent Design)',
        en: 'Scientific Intelligent Design'
      },
      tagline: {
        ko: '생명은 우연이 아닌 고도화된 DNA 유전공학의 결정체',
        en: 'Life is the deliberate synthesis of sophisticated DNA genetics'
      },
      points: {
        ko: [
          '지구상의 모든 생물체는 수만 년 앞선 엘로힘 과학자들에 의해 창조되었습니다.',
          '고대 종교 경전 속 "신(Elohim)"은 신비주의적 존재가 아니라 하늘에서 온 실제 과학자들입니다.',
          '오늘날 인류의 합성 생물학 및 유전자 가위 기술이 이 진실을 과학적으로 입증하고 있습니다.',
          '진화론의 잃어버린 고리와 생화학적 복잡성을 합리적으로 설명합니다.'
        ],
        en: [
          'All terrestrial organisms were scientifically synthesized by Elohim scientists in laboratories.',
          'Ancient scripture references to "Gods" (Elohim) describe actual space travelers with advanced tech.',
          'Current advances in synthetic biology and CRISPR validate the feasibility of artificial life creation.',
          'Provides logical answers to irreducibly complex biological mechanisms.'
        ]
      },
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'embassy',
      icon: Building2,
      title: {
        ko: '외계인 대사관 (Extraterrestrial Embassy)',
        en: 'The Extraterrestrial Embassy'
      },
      tagline: {
        ko: '창조자들의 공식 귀환을 영접하기 위한 지구 최초의 공식 외교 공관',
        en: 'The first diplomatic embassy to welcome our creators back in peace'
      },
      points: {
        ko: [
          '엘로힘은 인류의 자유의지를 침해하지 않으며, 공식 초청과 준비가 완료되었을 때 귀환합니다.',
          '대사관 부지에는 중립성과 치외법권, 상공 안전 비행권이 보장되어야 합니다.',
          '대사관 완공 시 인류는 질병 퇴치와 무한 청정에너지 등 비약적 과학기술을 선물받게 됩니다.',
          '부탄의 평화애호 국가철학은 대사관 유치 비전과 완벽하게 부합합니다.'
        ],
        en: [
          'The Elohim will not impose their presence; they return only upon peaceful official diplomatic invitation.',
          'Requires extraterritorial neutral sovereignty and guaranteed peaceful airspace.',
          'Formal contact will inaugurate a new era of clean ecological energy and advanced curative medicine.',
          'Bhutan’s non-aligned serenity makes it a sublime prospective host country.'
        ]
      },
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'meditation',
      icon: Smile,
      title: {
        ko: '감각명상과 행복 (Sensual Meditation)',
        en: 'Sensual Meditation & Pure Happiness'
      },
      tagline: {
        ko: '오감의 정화와 뇌신경 세포 활성화를 통한 무조건적 행복 실천',
        en: 'Awakening five senses to experience unconditional present happiness'
      },
      points: {
        ko: [
          '죄의식과 금욕 대신, 내 몸의 수십조 개 세포와 우주가 연결된 감각을 깨웁니다.',
          '시각, 청각, 촉각, 미각, 후각의 섬세한 개발을 통해 뇌의 엔도르핀과 세로토닌을 증폭합니다.',
          '매일 웃음과 자기 긍정으로 세포를 치유하고 타인에게 무조건적인 사랑을 전파합니다.',
          '부탄의 국민총행복(GNH) 철학과 깊은 내적 공명을 이룹니다.'
        ],
        en: [
          'Transcend guilt and dogmatic asceticism; awaken the trillions of cells communicating with the cosmos.',
          'Refine sight, sound, touch, taste, and smell to maximize natural dopamine and serotonin.',
          'Daily smile exercises, self-compassion, and radiating unconditional peace to society.',
          'Harmonizes effortlessly with Bhutan’s Gross National Happiness ethos.'
        ]
      },
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80'
    },
    {
      id: 'infinity',
      icon: Infinity,
      title: {
        ko: '무한의 철학 (Philosophy of Infinity)',
        en: 'Cosmic Infinity in Time & Space'
      },
      tagline: {
        ko: '시작도 끝도 없는 우주, 거대무한과 극미무한의 프랙탈 연속성',
        en: 'An eternal universe without beginning or end across infinite scales'
      },
      points: {
        ko: [
          '우주는 무(Nothing)에서 창조된 것이 아니며, 시간적으로도 공간적으로도 무한합니다.',
          '원자 속의 입자 안에는 또 다른 소우주가 존재하며, 우리 은하는 더 거대한 존재의 세포일 수 있습니다.',
          '모든 것은 끊임없이 변형되고 순환하며, 생명은 우주의 의식이 깨어나는 방식입니다.',
          '초자연적 미신을 배제한 완벽히 과학적이고 이성적인 우주관을 제공합니다.'
        ],
        en: [
          'The universe did not emerge from nothingness; it is strictly infinite in both time and space.',
          'Subatomic particles mirror miniature solar systems; our galactic cluster may be a cellular element of a vaster cosmos.',
          'Energy and matter eternally transmute; life is the universe perceiving and contemplating itself.',
          'A rigorously scientific cosmology free from supernatural superstition.'
        ]
      },
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80'
    }
  ];

  const currentPillar = pillars[activeTab];

  return (
    <section id="philosophy" className="py-20 lg:py-28 bg-[#F5EFEB] border-b border-[#E6DCD0] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE0D2] text-[#6B5A4A] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>{language === 'ko' ? '라엘리안 핵심 철학' : 'Core Raelian Philosophy'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1E1915] font-display">
            {language === 'ko' ? '과학, 사랑, 그리고 무한의 진실' : 'Science, Love & Cosmic Infinity'}
          </h2>
          <p className="text-[#665749] text-base leading-relaxed">
            {language === 'ko' 
              ? '인류를 미신과 전쟁의 굴레에서 해방시키고, 고도의 과학적 이해와 평화로운 공존으로 안내하는 네 가지 핵심 기둥입니다.'
              : 'Four foundational pillars guiding humanity away from superstition and warfare toward scientific wisdom and universal fraternity.'}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isSelected = activeTab === idx;
            return (
              <button
                key={pillar.id}
                onClick={() => setActiveTab(idx)}
                className={`flex flex-col items-center sm:items-start p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white shadow-md border-[#D5C2AF] translate-y-[-2px]'
                    : 'bg-[#F9F5EE] border-[#E3D7C9] text-[#6B5A4B] hover:bg-white/80'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2.5 transition-colors ${
                    isSelected ? 'text-white' : 'text-[#7D6B5A] bg-[#ECE2D5]'
                  }`}
                  style={{ backgroundColor: isSelected ? theme.accentColor : undefined }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#1E1915]">
                  {pillar.title[language].split('(')[0]}
                </div>
                <div className="text-[11px] text-[#857463] hidden sm:block truncate w-full mt-0.5">
                  {pillar.tagline[language]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Tab Showcase Card */}
        <div className="bg-white rounded-2xl border border-[#E0D4C5] p-6 sm:p-10 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Points */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div>
                <span 
                  className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-white inline-block mb-3"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  Pillar 0{activeTab + 1}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#1E1915] font-display">
                  {currentPillar.title[language]}
                </h3>
                <p className="text-sm sm:text-base text-[#EA580C] font-semibold mt-1">
                  {currentPillar.tagline[language]}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {currentPillar.points[language].map((pt, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#EA580C] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#453B31] leading-relaxed">
                      {pt}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <a
                  href="#books"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1E1915] hover:text-[#EA580C] transition-colors"
                >
                  <span>{language === 'ko' ? '관련 무료 도서 읽기' : 'Read Free Related Book'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden shadow-md border-2 border-[#E8DFD3] relative h-64 sm:h-80 bg-stone-100">
                <img
                  src={currentPillar.image}
                  alt={currentPillar.title[language]}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-medium bg-black/40 backdrop-blur-xs p-2.5 rounded-lg border border-white/20">
                  {currentPillar.tagline[language]}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Raël's Quote Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-[#EFE8DC] border border-[#DDD0C0] text-center max-w-4xl mx-auto shadow-xs">
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
