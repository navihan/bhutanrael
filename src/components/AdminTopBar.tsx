import React from 'react';
import { useSite } from '../context/SiteContext';
import { ShieldCheck, Settings, LogOut, Edit3 } from 'lucide-react';

export const AdminTopBar: React.FC = () => {
  const { 
    isAdminAuthenticated, 
    adminLogout, 
    adminUsername, 
    setIsAdminOpen, 
    language, 
    theme 
  } = useSite();

  if (!isAdminAuthenticated) return null;

  return (
    <aside 
      id="admin-active-top-bar"
      aria-label="Admin Control Bar"
      className="bg-[#1E1915] text-[#E8DFD3] border-b border-[#3D332B] px-4 py-2 text-xs z-50 sticky top-0 shadow-md backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Admin Identifier Badge */}
        <div className="flex items-center gap-2">
          <span 
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: theme.accentColor }}
          />
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">
              {language === 'ko' ? '관리자 모드 접속 중' : 'Admin Mode Active'}
            </span>
            <span className="text-[#A69584] hidden sm:inline">
              ({adminUsername})
            </span>
          </div>
        </div>

        {/* Right: Quick Admin Actions */}
        <div className="flex items-center gap-2">
          <button
            id="admin-topbar-open-dashboard"
            onClick={() => setIsAdminOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-white font-semibold shadow-2xs hover:opacity-95 transition-opacity cursor-pointer text-xs"
            style={{ backgroundColor: theme.accentColor }}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{language === 'ko' ? '대시보드 열기' : 'Admin Dashboard'}</span>
          </button>

          <button
            id="admin-topbar-logout"
            onClick={adminLogout}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#3A3129] hover:bg-[#4D4238] text-[#E8DFD3] hover:text-white transition-colors cursor-pointer text-xs font-medium"
            title={language === 'ko' ? '관리자 로그아웃' : 'Log Out'}
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">{language === 'ko' ? '로그아웃' : 'Log Out'}</span>
          </button>
        </div>

      </div>
    </aside>
  );
};
