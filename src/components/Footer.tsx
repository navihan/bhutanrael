import React from 'react';
import { useSite } from '../context/SiteContext';
import { Settings, Heart, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, theme, setIsAdminOpen, isAdminAuthenticated } = useSite();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#26201B] text-[#D8CCC0] border-t border-[#3D332B] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#3D332B] text-left">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: theme.accentColor }}
              >
                <svg viewBox="0 0 100 100" className="w-6 h-6 fill-none stroke-white stroke-[7]">
                  <circle cx="50" cy="50" r="42" className="opacity-40" />
                  <path d="M50,16 A34,34 0 0,1 84,50 A34,34 0 0,1 50,84 A18,18 0 0,1 32,66 A18,18 0 0,1 50,48 A8,8 0 0,1 58,56" />
                  <circle cx="50" cy="50" r="4" fill="white" />
                </svg>
              </div>
              <div>
                <div className="text-base font-bold text-white font-display flex items-center gap-2">
                  <span>{language === 'ko' ? '부탄 라엘리안 무브먼트' : 'Bhutan Raëlian Movement'}</span>
                  <span className="text-xs font-normal text-[#A69584] font-dzongkha">འབྲུག་ཡུལ།</span>
                </div>
                <div className="text-[10px] text-[#A69584] uppercase tracking-wider">
                  INTERNATIONAL RAËLIAN MOVEMENT
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#B0A294] leading-relaxed max-w-sm">
              {language === 'ko'
                ? '라엘리안 무브먼트는 초자연적인 신을 믿지 않는 비영리 무신론적 평화 운동 단체로, 인류의 기원을 과학적으로 규명하고 엘로힘을 맞이할 대사관 건립을 지향합니다.'
                : 'A non-profit philosophical and atheistic peace movement dedicated to spreading the truth of intelligent design and building the Extraterrestrial Embassy.'}
            </p>

            {isAdminAuthenticated && (
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3A3129] hover:bg-[#4D4238] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>{language === 'ko' ? '관리자 대시보드 열기' : 'Admin Control Panel'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
              {language === 'ko' ? '사이트 메뉴' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs text-[#B0A294]">
              <li><a href="#about" className="hover:text-white transition-colors">{language === 'ko' ? '라엘리안 소개' : 'About Movement'}</a></li>
              <li><a href="#philosophy" className="hover:text-white transition-colors">{language === 'ko' ? '지적설계와 철학' : 'Intelligent Design'}</a></li>
              <li><a href="#embassy" className="hover:text-white transition-colors">{language === 'ko' ? '외계인 대사관' : 'Elohim Embassy'}</a></li>
              <li><a href="#articles" className="hover:text-white transition-colors">{language === 'ko' ? '소식 및 아카이브' : 'News & Archive'}</a></li>
              <li><a href="#books" className="hover:text-white transition-colors">{language === 'ko' ? '전자책 무료 다운로드' : 'Free eBooks'}</a></li>
              <li><a href="#events" className="hover:text-white transition-colors">{language === 'ko' ? '세미나 일정' : 'Event Schedule'}</a></li>
            </ul>
          </div>

          {/* Col 4: Key Pillars */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
              {language === 'ko' ? '주요 주제' : 'Key Pillars'}
            </h4>
            <ul className="space-y-2 text-xs text-[#B0A294]">
              <li><span className="hover:text-white">{language === 'ko' ? 'DNA 생명공학 창조' : 'DNA Genetic Creation'}</span></li>
              <li><span className="hover:text-white">{language === 'ko' ? '감각명상과 행복' : 'Sensual Meditation'}</span></li>
              <li><span className="hover:text-white">{language === 'ko' ? '시간과 공간의 무한성' : 'Infinity in Time & Space'}</span></li>
              <li><span className="hover:text-white">{language === 'ko' ? '천재정치와 평화' : 'Geniocracy & Peace'}</span></li>
              <li><span className="hover:text-white">{language === 'ko' ? '부탄 GNH와 조화' : 'Bhutan GNH Synergy'}</span></li>
            </ul>
          </div>

          {/* Col 5: External Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
              {language === 'ko' ? '공식 글로벌 사이트' : 'Global Sites'}
            </h4>
            <ul className="space-y-2 text-xs text-[#B0A294]">
              <li><a href="https://www.rael.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Rael.org (Official IRM)</a></li>
              <li><a href="https://www.elohimembassy.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Elohim Embassy Project</a></li>
              <li><a href="https://www.raelianews.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Raëlian News</a></li>
              <li><a href="https://bhutanrm-5eqtrxdb.manus.space" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Bhutan RM Archive</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E7E6E]">
          <div>
            © {new Date().getFullYear()} Bhutan Raëlian Movement. All rights reserved. 
            <span className="mx-2">•</span>
            <span>Non-profit Philosophical Organization</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <span>{language === 'ko' ? '맨 위로 이동' : 'Back to top'}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
