import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { EventItem } from '../types';
import { Calendar, MapPin, Clock, Video, Users, CheckCircle2, ArrowRight } from 'lucide-react';

export const EventsSection: React.FC = () => {
  const { events, language, theme, selectedEventForRsvp, setSelectedEventForRsvp } = useSite();
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName || !rsvpEmail) return;
    setRsvpSuccess(true);
    setTimeout(() => {
      setRsvpSuccess(false);
      setSelectedEventForRsvp(null);
      setRsvpName('');
      setRsvpEmail('');
    }, 2000);
  };

  return (
    <section id="events" className="py-20 lg:py-28 bg-[#F5EFEB] border-b border-[#E6DCD0] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE0D2] text-[#6E5D4C] text-xs font-semibold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>{language === 'ko' ? '정기 모임 & 세미나' : 'Gatherings & Seminars'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1E1915] font-display">
            {language === 'ko' ? '부탄 평화 명상 및 공개 세미나 일정' : 'Upcoming Peace Gatherings in Bhutan'}
          </h2>
          <p className="text-base text-[#685746]">
            {language === 'ko' 
              ? '누구나 자유롭게 참여할 수 있는 열린 평화 모임과 온라인 포럼에 여러분을 초대합니다.' 
              : 'Join open peace meditations and global forums. Free participation for all seekers.'}
          </p>
        </div>

        {/* Events Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map(event => (
            <div
              key={event.id}
              className="bg-white rounded-2xl border border-[#E3D6C7] p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left space-y-5"
            >
              <div className="space-y-4">
                {/* Header Tag */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#F4EDE2] text-[#685848]">
                    {event.isOnline ? (
                      <span className="flex items-center gap-1 text-sky-700">
                        <Video className="w-3 h-3" /> ONLINE
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[#EA580C]">
                        <MapPin className="w-3 h-3" /> IN-PERSON
                      </span>
                    )}
                  </span>
                  <span className="text-xs font-bold text-[#EA580C]">
                    {event.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-[#1E1915] font-display leading-snug">
                  {event.title[language]}
                </h3>

                {/* Details */}
                <div className="space-y-2 text-xs text-[#6B5A4B]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#8E7D6D] shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#8E7D6D] shrink-0 mt-0.5" />
                    <span>{event.location[language]}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#524436] leading-relaxed pt-1">
                  {event.description[language]}
                </p>
              </div>

              {/* RSVP button */}
              <div className="pt-4 border-t border-[#EFE5D9]">
                <button
                  onClick={() => setSelectedEventForRsvp(event)}
                  className="w-full py-2.5 rounded-xl text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-2xs hover:opacity-95 transition-opacity cursor-pointer"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{language === 'ko' ? '참가 신청 (무료)' : 'Free RSVP'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* RSVP Modal */}
      {selectedEventForRsvp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-2xl max-w-md w-full p-6 text-left shadow-2xl border border-[#E0D3C3] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
              <h3 className="text-base font-bold text-[#1E1915] font-display">
                {language === 'ko' ? '세미나 무료 참가 신청' : 'Seminar Registration'}
              </h3>
              <button
                onClick={() => setSelectedEventForRsvp(null)}
                className="text-xs text-[#7A6B5B] hover:text-[#1E1915] cursor-pointer"
              >
                닫기
              </button>
            </div>

            <div>
              <div className="text-sm font-bold text-[#EA580C]">
                {selectedEventForRsvp.title[language]}
              </div>
              <div className="text-xs text-[#635343] mt-1">
                📅 {selectedEventForRsvp.date} • 🕒 {selectedEventForRsvp.time}
              </div>
              <div className="text-xs text-[#635343]">
                📍 {selectedEventForRsvp.location[language]}
              </div>
            </div>

            {rsvpSuccess ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="text-sm font-bold text-emerald-900">
                  {language === 'ko' ? '참가 신청이 완료되었습니다!' : 'Registration Confirmed!'}
                </div>
                <div className="text-xs text-emerald-700">
                  {language === 'ko' ? '입력하신 이메일로 안내장이 전송됩니다.' : 'An invitation has been sent to your email.'}
                </div>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#483C30] mb-1">
                    {language === 'ko' ? '참가자 성함' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpName}
                    onChange={e => setRsvpName(e.target.value)}
                    placeholder="홍길동 / Dorji Wangchuk"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-[#DDD0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA580C]/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#483C30] mb-1">
                    {language === 'ko' ? '이메일 주소' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={rsvpEmail}
                    onChange={e => setRsvpEmail(e.target.value)}
                    placeholder="example@bhutan.org"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-[#DDD0C0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EA580C]/40"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-white font-semibold text-xs sm:text-sm shadow-xs cursor-pointer"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    {language === 'ko' ? '신청 완료하기' : 'Confirm Free Attendance'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedEventForRsvp(null)}
                    className="px-4 py-2.5 rounded-xl bg-[#EFE8DC] text-[#483C30] text-xs sm:text-sm font-semibold cursor-pointer"
                  >
                    {language === 'ko' ? '취소' : 'Cancel'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </section>
  );
};
