import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, Settings, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { 
    isAdminAuthenticated, 
    adminLogin, 
    adminLogout, 
    adminUsername, 
    setIsAdminOpen, 
    navigate, 
    language, 
    setLanguage, 
    theme 
  } = useSite();

  const [identifier, setIdentifier] = useState('navihan01@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [invitedEmailBanner, setInvitedEmailBanner] = useState<string | null>(null);

  // Check URL query parameters for invite link
  React.useEffect(() => {
    try {
      const url = new URL(window.location.href);
      let emailParam = url.searchParams.get('email');
      let tokenParam = url.searchParams.get('token');
      let nameParam = url.searchParams.get('name');
      
      // Also check hash query params if using hash router: #/admin0/login?email=...
      if (window.location.hash.includes('?')) {
        const hashQuery = window.location.hash.split('?')[1];
        const hashParams = new URLSearchParams(hashQuery);
        if (!emailParam) emailParam = hashParams.get('email');
        if (!tokenParam) tokenParam = hashParams.get('token');
        if (!nameParam) nameParam = hashParams.get('name');
      }

      if (tokenParam) {
        try {
          const decoded = JSON.parse(decodeURIComponent(escape(atob(tokenParam))));
          if (decoded && decoded.email) {
            emailParam = decoded.email;
            if (decoded.name) nameParam = decoded.name;
          }
        } catch (e) {
          console.warn('Token decode error in LoginPage:', e);
        }
      }

      if (emailParam) {
        const cleanEmail = decodeURIComponent(emailParam).trim();
        setIdentifier(cleanEmail);
        setInvitedEmailBanner(nameParam ? `${decodeURIComponent(nameParam)} (${cleanEmail})` : cleanEmail);
      }
    } catch (e) {
      console.warn('URL parse error:', e);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const result = adminLogin(identifier, password);
      setIsLoading(false);
      if (result.success) {
        setIsAdminOpen(true);
        navigate('/');
      } else {
        setErrorMessage(result.message || (language === 'ko' ? '비밀번호 또는 계정 정보가 올바르지 않습니다.' : 'Invalid account or password.'));
      }
    }, 400);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F5EFEB] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 selection:bg-orange-200 selection:text-orange-950">
      
      {/* Top Bar Navigation */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pb-6">
        <button
          onClick={handleGoHome}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#6A5A4A] hover:text-[#EA580C] transition-colors cursor-pointer bg-white px-3.5 py-2 rounded-xl border border-[#DDD0C0] shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'ko' ? '일반 홈페이지로 돌아가기' : 'Return to Homepage'}</span>
        </button>

        <button
          onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
          className="text-xs font-semibold text-[#6A5A4A] hover:text-[#1E1915] bg-white px-3 py-1.5 rounded-xl border border-[#DDD0C0] shadow-2xs"
        >
          {language === 'ko' ? 'English' : '한국어'}
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl border border-[#E2D5C5] shadow-xl p-8 sm:p-10 space-y-6">
        
        {/* Emblem & Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white shadow-md mx-auto" style={{ backgroundColor: theme.accentColor }}>
            <svg viewBox="0 0 100 100" className="w-10 h-10 fill-none stroke-white stroke-[7]">
              <circle cx="50" cy="50" r="42" className="opacity-40" />
              <path d="M50,16 A34,34 0 0,1 84,50 A34,34 0 0,1 50,84 A18,18 0 0,1 32,66 A18,18 0 0,1 50,48 A8,8 0 0,1 58,56" />
              <circle cx="50" cy="50" r="4" fill="white" />
            </svg>
          </div>

          <div>
            <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFF7ED] text-[#C2410C] text-[11px] font-bold uppercase tracking-wider mb-1.5 font-mono">
              admin0/login
            </div>
            <h1 className="text-2xl font-bold text-[#1E1915] font-display">
              {language === 'ko' ? '관리자 보안 로그인' : 'Admin Portal Login'}
            </h1>
            <p className="text-xs text-[#7A6B5B] mt-1">
              {language === 'ko'
                ? '부탄 라엘리안 무브먼트 웹사이트 관리자 전용 접속 포털입니다.'
                : 'Restricted administrative access for Bhutan Raëlian Movement portal.'}
            </p>
          </div>
        </div>

        {/* Status: Already Logged In */}
        {isAdminAuthenticated ? (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <div className="text-sm font-bold text-emerald-950">
                {language === 'ko' ? '관리자 인증 완료됨' : 'Administrator Authenticated'}
              </div>
              <div className="text-xs text-emerald-800">
                <span className="font-semibold">{adminUsername}</span> 계정으로 접속 중입니다.
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdminOpen(true);
                  navigate('/');
                }}
                className="w-full py-3 px-4 rounded-xl text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
                style={{ backgroundColor: theme.accentColor }}
              >
                <Settings className="w-4 h-4" />
                <span>{language === 'ko' ? '관리자 대시보드 바로 열기' : 'Open Admin Dashboard'}</span>
              </button>

              <button
                type="button"
                onClick={handleGoHome}
                className="w-full py-2.5 px-4 rounded-xl bg-[#FAF7F2] border border-[#DDD0C0] text-[#3D332A] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[#F2ECE2] transition-colors cursor-pointer"
              >
                <span>{language === 'ko' ? '홈페이지 보기 (관리자 모드)' : 'Go to Homepage (Admin Active)'}</span>
              </button>

              <button
                type="button"
                onClick={adminLogout}
                className="w-full py-2 px-4 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{language === 'ko' ? '관리자 세션 로그아웃' : 'Log Out Admin Session'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Login Form */
          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            {invitedEmailBanner && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1 animate-in fade-in">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>{language === 'ko' ? '초대된 관리자 접속' : 'Invited Admin Login'}</span>
                </div>
                <div>
                  <strong>{invitedEmailBanner}</strong> {language === 'ko' ? '관리자로 초대되었습니다. 발급받으신 임시 비밀번호를 입력해주세요.' : 'You have been invited as an administrator. Enter your temporary password.'}
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#3B2F24] mb-1.5">
                {language === 'ko' ? '관리자 계정 (아이디 또는 이메일)' : 'Admin Account (Email or Username)'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C7A68]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="navihan01@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/40 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2F24] mb-1.5">
                {language === 'ko' ? '관리자 비밀번호' : 'Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C7A68]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/40 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8C7A68] hover:text-[#1E1915] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Helper Credentials Callout */}
            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE0D2] text-[11px] text-[#6B5A4B] space-y-1">
              <div className="font-bold text-[#3B2F24] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>{language === 'ko' ? '관리자 로그인 안내' : 'Admin Credentials Guide'}</span>
              </div>
              <div>• {language === 'ko' ? '최고 관리자' : 'Super Admin'}: <strong className="text-[#1E1915]">navihan01@gmail.com</strong></div>
              <div>• {language === 'ko' ? '초대된 관리자' : 'Invited Admins'}: 초대받은 이메일 및 발급된 임시 비밀번호로 로그인</div>
              <div className="text-[10px] text-[#8C7A68] pt-0.5">※ 로그인 후 대시보드 [관리자 팀 & 초대] 탭에서 동료를 초대하거나 본인 글을 관리할 수 있습니다.</div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-60"
              style={{ backgroundColor: theme.accentColor }}
            >
              {isLoading ? (
                <span>{language === 'ko' ? '인증 확인 중...' : 'Authenticating...'}</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{language === 'ko' ? '관리자 로그인' : 'Log In as Administrator'}</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>

      {/* Security Footer Note */}
      <div className="max-w-md w-full mx-auto text-center pt-6 text-[11px] text-[#8C7A68]">
        {language === 'ko'
          ? '일반 방문자는 관리자 콘트롤 및 대시보드에 접근할 수 없으며, 인증된 관리자만 도구 사용이 가능합니다.'
          : 'Unauthorized access is prohibited. All administrative activities are monitored.'}
      </div>

    </div>
  );
};
