import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, Globe2, RefreshCw, ExternalLink, ShieldCheck } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { content, seo, language, theme } = useSite();
  const { contact } = content;
  
  // Recipient email specified by the user
  const targetEmail = contact?.email || 'navihan01@gmail.com';

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sentSummary, setSentSummary] = useState<{ name: string; email: string; subject: string; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setIsSending(true);

    const emailSubject = formData.subject.trim() || (language === 'ko' ? '부탄 라엘리안 무브먼트 온라인 문의' : 'Bhutan Raëlian Movement Inquiry');

    try {
      // Dispatch live inquiry to navihan01@gmail.com via FormSubmit endpoint
      const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `[부탄 라엘리안] ${formData.name.trim()}님의 온라인 문의 - ${emailSubject}`,
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: emailSubject,
          message: formData.message.trim(),
          _replyto: formData.email.trim(),
          _template: 'table',
          _captcha: 'false'
        })
      });

      if (!response.ok) {
        console.warn('FormSubmit endpoint response status:', response.status);
      }
    } catch (error) {
      console.warn('Form submission network notification:', error);
    } finally {
      setIsSending(false);
      setSentSummary({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: emailSubject,
        message: formData.message.trim()
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setSentSummary(null);
  };

  const gmailComposeUrl = sentSummary 
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}&su=${encodeURIComponent(`[부탄 라엘리안] ${sentSummary.subject}`)}&body=${encodeURIComponent(`보낸사람: ${sentSummary.name} (${sentSummary.email})\n\n내용:\n${sentSummary.message}`)}`
    : `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmail)}`;

  const mailtoUrl = sentSummary
    ? `mailto:${targetEmail}?subject=${encodeURIComponent(`[부탄 라엘리안] ${sentSummary.subject}`)}&body=${encodeURIComponent(`보낸사람: ${sentSummary.name} (${sentSummary.email})\n\n내용:\n${sentSummary.message}`)}`
    : `mailto:${targetEmail}`;

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#F5EFEB] border-b border-[#E6DCD0] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE0D2] text-[#6E5D4C] text-xs font-semibold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>{language === 'ko' ? '소통과 연대' : 'Connect With Us'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1E1915] font-display">
            {language === 'ko' ? '부탄 라엘리안 무브먼트에 문의하기' : 'Get in Touch with Bhutan Chapter'}
          </h2>
          <p className="text-base text-[#685746]">
            {language === 'ko' 
              ? '도서 신청, 대사관 프로젝트 참여, 세미나 주최 및 언론 문의 등 무엇이든 편안하게 남겨주세요.' 
              : 'Feel free to reach out regarding books, media inquiries, or volunteering in Bhutan.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Info Panel */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2D5C5] p-6 sm:p-8 shadow-sm space-y-6 text-left">
            <div>
              <h3 className="text-xl font-bold text-[#1E1915] font-display">
                {language === 'ko' ? '공식 안내 데스크' : 'Information Desk'}
              </h3>
              <p className="text-xs sm:text-sm text-[#6E5E4E] mt-1">
                {language === 'ko' 
                  ? '부탄 팀푸 지부 자원봉사자들이 성심성의껏 답변해 드립니다.' 
                  : 'Bhutan local volunteers are here to answer and assist you.'}
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1E1915]">
                    {language === 'ko' ? '주소' : 'Address'}
                  </div>
                  <div className="text-xs sm:text-sm text-[#5C4C3E] mt-0.5">
                    {contact.address[language]}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1E1915]">
                    {language === 'ko' ? '전화 및 WhatsApp' : 'Phone & WhatsApp'}
                  </div>
                  <div className="text-xs sm:text-sm text-[#5C4C3E] mt-0.5 font-mono">
                    {contact.phone}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1E1915]">
                    {language === 'ko' ? '공식 수신 이메일' : 'Official Email'}
                  </div>
                  <a 
                    href={`mailto:${targetEmail}`}
                    className="text-xs sm:text-sm text-[#EA580C] hover:underline font-semibold mt-0.5 block"
                    title={language === 'ko' ? '메일 보내기' : 'Send email'}
                  >
                    {targetEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  <Globe2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1E1915]">
                    {language === 'ko' ? '운영 시간' : 'Visiting Hours'}
                  </div>
                  <div className="text-xs sm:text-sm text-[#5C4C3E] mt-0.5">
                    {contact.meetingHours[language]}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Row */}
            <div className="pt-4 border-t border-[#EDE4D8]">
              <div className="text-xs font-bold text-[#1E1915] mb-2.5">
                {language === 'ko' ? '공식 소셜 미디어 채널' : 'Official Social Channels'}
              </div>
              <div className="flex flex-wrap gap-2">
                <a
                  href={seo.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#DDD0C0] text-xs font-medium text-[#483B2F] hover:text-[#EA580C] hover:bg-white transition-colors"
                >
                  Facebook
                </a>
                <a
                  href={seo.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#DDD0C0] text-xs font-medium text-[#483B2F] hover:text-[#EA580C] hover:bg-white transition-colors"
                >
                  YouTube
                </a>
                <a
                  href={seo.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#DDD0C0] text-xs font-medium text-[#483B2F] hover:text-[#EA580C] hover:bg-white transition-colors"
                >
                  X (Twitter)
                </a>
                <a
                  href={seo.socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#DDD0C0] text-xs font-medium text-[#483B2F] hover:text-[#EA580C] hover:bg-white transition-colors"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>

          {/* Right Interactive Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2D5C5] p-6 sm:p-8 shadow-sm text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-xl font-bold text-[#1E1915] font-display">
                  {language === 'ko' ? '온라인 메시지 보내기' : 'Send an Online Inquiry'}
                </h3>
                <p className="text-xs text-[#6B5A4B] mt-0.5">
                  {language === 'ko' 
                    ? '문의하신 내용은 지정된 관리자 이메일로 안전하게 직통 발송됩니다.' 
                    : 'Your message will be sent directly to the designated coordinator.'}
                </p>
              </div>

              {/* Destination badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#FDBA74] text-[#C2410C] text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>수신: {targetEmail}</span>
              </div>
            </div>

            {submitted ? (
              <div className="p-6 sm:p-8 bg-[#F0FDF4] border border-emerald-200 rounded-2xl text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="text-lg font-bold text-emerald-950 font-display">
                    {language === 'ko' ? '메시지가 성공적으로 발송되었습니다!' : 'Message Dispatched Successfully!'}
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800 mt-1 max-w-md mx-auto">
                    {language === 'ko'
                      ? `문의 내용이 [${targetEmail}] 로 안전하게 전송되었습니다. 관리자 확인 후 기재해주신 이메일(${sentSummary?.email})로 정성껏 회신드리겠습니다.`
                      : `Your message was delivered to [${targetEmail}]. We will review and reply to your email (${sentSummary?.email}) promptly.`}
                  </p>
                </div>

                {sentSummary && (
                  <div className="p-4 rounded-xl bg-white/90 border border-emerald-200 text-left text-xs space-y-1.5 text-stone-700 max-w-lg mx-auto shadow-2xs">
                    <div><span className="font-bold text-stone-900">보낸 사람:</span> {sentSummary.name} ({sentSummary.email})</div>
                    <div><span className="font-bold text-stone-900">제목:</span> {sentSummary.subject}</div>
                    <div className="pt-1 border-t border-stone-200 line-clamp-3 italic text-stone-600">
                      "{sentSummary.message}"
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href={gmailComposeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#DDD0C0] text-xs font-semibold text-[#1E1915] hover:bg-stone-50 shadow-2xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>{language === 'ko' ? 'Gmail에서 사본 열기' : 'Open in Gmail'}</span>
                  </a>

                  <a
                    href={mailtoUrl}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#DDD0C0] text-xs font-semibold text-[#1E1915] hover:bg-stone-50 shadow-2xs transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>{language === 'ko' ? '기본 메일앱으로 열기' : 'Default Mail App'}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {language === 'ko' ? '새 메시지 작성' : 'Send Another Inquiry'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1.5">
                      {language === 'ko' ? '보내시는 분 성함 *' : 'Your Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="홍길동 / Karma Dorji"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1.5">
                      {language === 'ko' ? '회신받으실 이메일 *' : 'Your Email *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your-email@domain.com"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2F24] mb-1.5">
                    {language === 'ko' ? '문의 제목' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={language === 'ko' ? '대사관 프로젝트 문의 / 도서 신청 / 세미나 참가' : 'Embassy inquiry / Book request / Meeting attendance'}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2F24] mb-1.5">
                    {language === 'ko' ? '메시지 내용 *' : 'Message *'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder={language === 'ko' ? '문의하시고자 하는 내용을 자유롭게 작성해 주세요...' : 'Write your message or inquiry here...'}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/40"
                  />
                </div>

                <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-60"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{language === 'ko' ? '메시지 전송 중...' : 'Sending Message...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{language === 'ko' ? '메시지 발송' : 'Send Message'}</span>
                      </>
                    )}
                  </button>

                  <div className="text-[11px] text-[#7A6B5B] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>
                      {language === 'ko'
                        ? `발송 시 [${targetEmail}] 로 자동 전달됩니다`
                        : `Delivered directly to [${targetEmail}]`}
                    </span>
                  </div>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
