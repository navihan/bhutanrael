import React from 'react';
import { SiteProvider, useSite } from './context/SiteContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { PhilosophySection } from './components/PhilosophySection';
import { EmbassySection } from './components/EmbassySection';
import { ArticlesSection } from './components/ArticlesSection';
import { BooksSection } from './components/BooksSection';
import { EventsSection } from './components/EventsSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { AdminModal } from './components/AdminModal';
import { AdminLoginPage } from './components/AdminLoginPage';
import { AdminTopBar } from './components/AdminTopBar';
import { Settings } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    currentPath, 
    isAdminAuthenticated, 
    setIsAdminOpen, 
    theme, 
    language 
  } = useSite();

  // If path is admin0/login, render dedicated admin portal login page
  if (currentPath === 'admin0/login') {
    return (
      <>
        <AdminLoginPage />
        {isAdminAuthenticated && <AdminModal />}
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-orange-200 selection:text-orange-950">
      {/* Top Admin Active Banner (Only visible to authenticated administrator) */}
      <AdminTopBar />

      {/* Navigation Header */}
      <Header />

      {/* Main Page Sections */}
      <main className="flex-1">
        <Hero />
        <AboutSection />
        <PhilosophySection />
        <EmbassySection />
        <ArticlesSection />
        <BooksSection />
        <EventsSection />
        <FaqSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Reader Modal */}
      <ArticleDetailModal />

      {/* Admin Dashboard Modal (Protected: only renders if authenticated) */}
      {isAdminAuthenticated && <AdminModal />}

      {/* Floating Quick Admin Toggle (Strictly visible ONLY to logged-in administrator) */}
      {isAdminAuthenticated && (
        <div className="fixed bottom-6 right-6 z-30">
          <button
            id="floating-admin-btn"
            onClick={() => setIsAdminOpen(true)}
            className="group flex items-center gap-2 px-4 py-3 rounded-full text-white font-semibold text-xs sm:text-sm shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer border border-white/30 backdrop-blur-md"
            style={{ backgroundColor: theme.accentColor }}
            title={language === 'ko' ? '관리자 대시보드 열기' : 'Open Admin Panel'}
          >
            <Settings className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
            <span className="hidden sm:inline">
              {language === 'ko' ? '관리자 대시보드' : 'Admin Panel'}
            </span>
            <span className="inline-flex sm:hidden">
              {language === 'ko' ? '관리' : 'Admin'}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <SiteProvider>
      <MainLayout />
    </SiteProvider>
  );
}
