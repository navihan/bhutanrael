import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Globe, Settings, Menu, X, ArrowRight, Sparkles, BookOpen, Compass, Building2, Calendar, Newspaper, Mail } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    theme, 
    language, 
    setLanguage, 
    setIsAdminOpen, 
    isAdminOpen, 
    isAdminAuthenticated, 
    navigate, 
    currentPath 
  } = useSite();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#about', label: language === 'ko' ? '라엘리안 소개' : 'About', icon: Compass },
    { href: '#philosophy', label: language === 'ko' ? '지적설계 & 철학' : 'Philosophy', icon: Sparkles },
    { href: '#embassy', label: language === 'ko' ? '외계인 대사관' : 'Embassy', icon: Building2 },
    { href: '#articles', label: language === 'ko' ? '소식 & 아티클' : 'News & Insights', icon: Newspaper },
    { href: '#books', label: language === 'ko' ? '도서 다운로드' : 'eBooks', icon: BookOpen },
    { href: '#events', label: language === 'ko' ? '세미나 & 일정' : 'Events', icon: Calendar },
    { href: '#contact', label: language === 'ko' ? '연락처' : 'Contact', icon: Mail },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (isAdminOpen) {
      setIsAdminOpen(false);
    }
    if (currentPath !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
    } else {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ko' ? 'en' : 'ko');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FAF7F2]/90 border-b border-[#E8DFD3] transition-all">
      {/* Optional Announcement Banner */}
      {theme.showAnnouncement && (
        <div 
          className="w-full text-white text-xs sm:text-sm font-medium py-2 px-4 flex items-center justify-center text-center shadow-xs transition-colors"
          style={{ backgroundColor: theme.accentColor }}
        >
          <a 
            href={theme.announcementLink} 
            className="flex items-center gap-1.5 hover:underline cursor-pointer group"
          >
            <span>{theme.announcementText[language]}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (isAdminOpen) setIsAdminOpen(false);
              if (currentPath !== '/') navigate('/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 group"
          >
            {/* Elegant Emblem representing Infinity in Time & Space (Symbol of Elohim) */}
            <div 
              className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold shadow-md transition-transform group-hover:scale-105"
              style={{ backgroundColor: theme.accentColor }}
            >
              <svg 
                viewBox="0 0 100 100" 
                className="w-7 h-7 fill-none stroke-white stroke-[7]"
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                {/* Stylized Infinite Spiral / Emblem of Space and Time */}
                <circle cx="50" cy="50" r="42" className="opacity-30" />
                <path d="M50,16 A34,34 0 0,1 84,50 A34,34 0 0,1 50,84 A18,18 0 0,1 32,66 A18,18 0 0,1 50,48 A8,8 0 0,1 58,56" />
                <circle cx="50" cy="50" r="4" fill="white" />
              </svg>
            </div>
            
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-[#1F1B18] font-display flex items-center gap-1.5">
                {language === 'ko' ? '부탄 라엘리안 무브먼트' : 'Bhutan Raëlian Movement'}
              </span>
              <span className="text-[11px] text-[#786C60] tracking-wider uppercase font-medium flex items-center gap-1.5">
                <span>KINGDOM OF BHUTAN</span>
                <span className="text-[11px] font-normal text-[#968676] font-dzongkha">འབྲུག་ཡུལ།</span>
                <span>• ELOHIM EMBASSY</span>
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-[#4A4036] hover:text-[#EA580C] transition-colors relative py-1 hover:font-semibold cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              id="header-lang-toggle"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D5C7B5] text-xs font-semibold text-[#4A4036] hover:bg-[#F0E8DC] transition-colors cursor-pointer"
              title={language === 'ko' ? '영문으로 전환' : 'Switch to Korean'}
            >
              <Globe className="w-3.5 h-3.5 text-[#8C7A68]" />
              <span>{language === 'ko' ? 'EN' : '한글'}</span>
            </button>

            {/* Admin Dashboard Trigger - Only visible when logged in */}
            {isAdminAuthenticated && (
              <button
                id="header-admin-btn"
                onClick={() => setIsAdminOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white shadow-xs hover:opacity-95 transition-all cursor-pointer"
                style={{ backgroundColor: theme.accentColor }}
              >
                <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                <span className="hidden sm:inline">
                  {language === 'ko' ? '관리자 콘트롤' : 'Admin Panel'}
                </span>
                <span className="sm:hidden">
                  {language === 'ko' ? '관리' : 'Admin'}
                </span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#4A4036] hover:bg-[#EFE8DC] transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8DFD3] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-[#4A4036] hover:bg-[#F2EAE0] hover:text-[#EA580C] transition-colors cursor-pointer"
              >
                <Icon className="w-4 h-4 text-[#9C8C7C]" />
                <span>{link.label}</span>
              </a>
            );
          })}
          <div className="pt-3 border-t border-[#E8DFD3] flex items-center justify-between">
            <button
              onClick={() => {
                toggleLanguage();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-[#4A4036] bg-[#EFE8DC]"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'ko' ? 'English Version' : '한국어 버전'}</span>
            </button>
            {isAdminAuthenticated && (
              <button
                onClick={() => {
                  setIsAdminOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ backgroundColor: theme.accentColor }}
              >
                <Settings className="w-4 h-4" />
                <span>{language === 'ko' ? '관리자 대시보드' : 'Admin Dashboard'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
