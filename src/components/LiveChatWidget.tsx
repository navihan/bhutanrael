import React, { useState, useRef, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { 
  MessageCircle, 
  X, 
  Send, 
  Headphones, 
  Sparkles, 
  BookOpen, 
  Building2, 
  Phone, 
  Mail, 
  Clock, 
  CheckCheck, 
  RotateCcw, 
  User, 
  SendHorizonal, 
  HelpCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { ChatMessage } from '../types';

export const LiveChatWidget: React.FC = () => {
  const { 
    chatConfig, 
    addChatInquiry, 
    theme, 
    language,
    isChatOpen,
    setIsChatOpen
  } = useSite();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('bhutan_rm_chat_history_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'agent',
        text: language === 'ko'
          ? (chatConfig?.welcomeMessage?.ko || '안녕하세요! 부탄 라엘리안 무브먼트 24시간 실시간 상담센터입니다. 엘로힘의 메시지, 지적설계 철학, 대사관 프로젝트, 무료 전자책 7종, 감각명상 세미나 등 궁금하신 점을 무엇이든 편하게 물어보세요.')
          : (chatConfig?.welcomeMessage?.en || 'Welcome to the Bhutan Raëlian Movement 24/7 Live Consultation. Feel free to ask about the Elohim messages, embassy project, 7 free ebooks, or meditation workshops.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formCategory, setFormCategory] = useState(chatConfig?.categories?.[0] || '엘로힘 메시지 안내');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Save chat history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bhutan_rm_chat_history_v1', JSON.stringify(messages));
    } catch (e) {
      console.warn('Failed to save chat history', e);
    }
  }, [messages]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isChatOpen, messages, isTyping]);

  if (!chatConfig?.enabled) {
    return null;
  }

  // Knowledge base for instant 24/7 auto-answers
  const getAutoAnswer = (userQuery: string): { reply: string; linkSection?: string; linkLabel?: string } => {
    const q = userQuery.toLowerCase().trim();

    if (q.includes('대사관') || q.includes('embassy') || q.includes('제3의 성전') || q.includes('성전') || q.includes('치외법권')) {
      return {
        reply: language === 'ko'
          ? `🏛️ [공식 우주인 방문을 위한 대사관 건설 프로젝트]\n\n엘로힘은 인류가 평화롭게 그들을 맞이할 준비가 되었을 때 공개 방문하여 지구보다 2만 5천년 앞선 과학문명을 전수해 줄 것입니다.\n\n라엘에게 부탁한 이 '대사관'은 히브리 성서에서 예언된 인류 최후의 성전, 즉 '제3의 성전'입니다. 필수적인 치외법권 지위를 승인하고 영토를 제공하는 국가는 보장된 번영과 엘로힘의 보호 아래 세계의 정신적·과학적 중심지가 될 것입니다.`
          : `🏛️ [Extraterrestrial Embassy Project]\n\nThe Elohim will publicly visit and share technology 25,000 years ahead of ours when humanity welcomes them peacefully. The embassy requires diplomatic extraterritorial status.`,
        linkSection: '#embassy',
        linkLabel: language === 'ko' ? '대사관 프로젝트 상세 보기' : 'View Embassy Project'
      };
    }

    if (q.includes('책') || q.includes('도서') || q.includes('ebook') || q.includes('book') || q.includes('다운') || q.includes('인간복제') || q.includes('각성') || q.includes('만화')) {
      return {
        reply: language === 'ko'
          ? `📚 [무료 전자책 7종 다운로드 안내]\n\n현재 웹사이트에서 다음 7권의 라엘리안 공식 도서를 누구나 즉시 무료 PDF로 다운로드 받으실 수 있습니다:\n\n1. 지적설계 (우주인 엘로힘의 메시지)\n2. 감각명상 (행복과 각성의 기술)\n3. 천재정치 (지성과 평화의 사회 시스템)\n4. 인간복제 (영원한 생명으로의 과학적 길)\n5. 각성으로의 여행 1 (내면의 무한성)\n6. 각성으로의 여행 2 (우주적 지성과 사랑)\n7. 하늘에서 온 사람들 (만화 그래픽노블)`
          : `📚 [7 Free eBooks Download]\n\nYou can download all 7 official Raëlian books free of charge, including Intelligent Design, Sensual Meditation, Geniocracy, Cloning, Journey to Awakening 1 & 2, and People from the Sky (Comic).`,
        linkSection: '#books',
        linkLabel: language === 'ko' ? '무료 전자책 바로 다운로드' : 'Download Free eBooks'
      };
    }

    if (q.includes('엘로힘') || q.includes('elohim') || q.includes('우주인') || q.includes('외계인') || q.includes('dna') || q.includes('창조')) {
      return {
        reply: language === 'ko'
          ? `🧬 [엘로힘(Elohim)과 생명창조 안내]\n\n'엘로힘'은 고대 히브리어로 "하늘에서 온 사람들"을 뜻하는 복수형 단어입니다.\n초자연적인 신이 아니라, 과거 지구에 도착하여 고도의 DNA 합성 생명공학 기술로 인류와 지구상의 모든 생명체를 창조한 다른 행성의 과학자들입니다. 현대 분자생물학과 합성생물학의 눈부신 발전이 이를 과학적으로 입증하고 있습니다.`
          : `🧬 [Who are the Elohim?]\n\nElohim means "Those who came from the sky" in ancient Hebrew. They are extraterrestrial human scientists who scientifically designed and created terrestrial life in DNA laboratories.`,
        linkSection: '#philosophy',
        linkLabel: language === 'ko' ? '5대 핵심 철학 살펴보기' : 'Explore 5 Core Pillars'
      };
    }

    if (q.includes('명상') || q.includes('감각명상') || q.includes('세미나') || q.includes('행사') || q.includes('모임') || q.includes('워크숍') || q.includes('팀푸')) {
      return {
        reply: language === 'ko'
          ? `🧘 [부탄 팀푸 감각명상 & 세미나 안내]\n\n감각명상(Sensual Meditation)은 뇌신경을 깨워 지금 이 순간 오감으로 느껴지는 생명의 환희와 무한한 우주와의 일체감을 자각하는 명상법입니다.\n\n✨ 2026 부탄 팀푸 엘로힘 평화 명상 워크숍 및 온라인 대사관 포럼 참가 신청이 현재 웹사이트에서 무료로 접수 중입니다.`
          : `🧘 [Sensual Meditation & Events]\n\nSensual meditation harmonizes neural awareness with the infinite universe. Check our upcoming Thimphu workshop and online forums in the events section.`,
        linkSection: '#events',
        linkLabel: language === 'ko' ? '세미나 일정 및 참가 신청' : 'View Events & RSVP'
      };
    }

    if (q.includes('라엘') || q.includes('rael') || q.includes('메신저') || q.includes('예언자')) {
      return {
        reply: language === 'ko'
          ? `🕊️ [메신저 라엘(Raël) 안내]\n\n1973년 12월 13일 프랑스 클레르몽페랑 인근 휴화산에서 엘로힘의 대표자와 조우하여 인류의 기원과 미래에 대한 메시지를 전달받은 마지막 메신저입니다.\n모세, 붓다, 예수, 마호메트 등 과거의 예언자들에 이어 과학의 시대(아포칼립스)에 맞춰 진실을 전하고 있습니다.`
          : `🕊️ [Raël - The Final Messenger]\n\nRaël met the representative of the Elohim in 1973 to convey the message of scientific human origins and non-violence for the modern scientific era.`,
        linkSection: '#about',
        linkLabel: language === 'ko' ? '무브먼트 소개 보기' : 'About Raëlian Movement'
      };
    }

    if (q.includes('연락') || q.includes('전화') || q.includes('이메일') || q.includes('상담원') || q.includes('문의') || q.includes('신청')) {
      return {
        reply: language === 'ko'
          ? `📞 [24시간 실시간 전문 상담 접수 안내]\n\n• 긴급 직통 전화: ${chatConfig?.emergencyPhone || '+975 2 321 000'}\n• 대표 공식 이메일: ${chatConfig?.emergencyEmail || 'bhutan.contact@rael.org'}\n• 운영 시간: ${chatConfig?.operatingHours?.ko || '365일 24시간 실시간'}\n\n아래 [1:1 상담 문의 접수] 버튼을 누르시면 전문 상담원에게 고객님의 연락처와 질문을 바로 전달해 드릴 수 있습니다.`
          : `📞 [24/7 Dedicated Support]\n\nPhone: ${chatConfig?.emergencyPhone}\nEmail: ${chatConfig?.emergencyEmail}\nHours: ${chatConfig?.operatingHours?.en}`,
        linkSection: '#contact',
        linkLabel: language === 'ko' ? '문의 양식으로 이동' : 'Go to Contact'
      };
    }

    // Default intelligent friendly answer
    return {
      reply: language === 'ko'
        ? `질문해 주셔서 감사합니다! 🛸\n\n부탄 라엘리안 무브먼트는 엘로힘의 메시지 보급, 우주인 대사관 건설 추진, 감각명상을 통한 내적 평화와 행복 실천, 그리고 7종의 무료 전자책을 전 세계에 전하고 있습니다.\n\n구체적인 질문이나 상담원과의 1:1 상담을 원하시면 아래 '1:1 상담 문의 접수'를 통해 연락처와 내용을 남겨주시면 신속히 맞춤 답변을 드립니다.`
        : `Thank you for reaching out! We are here 24/7 to support your journey with the Elohim messages, Embassy project, and Sensual Meditation. Feel free to ask any specific question or leave a consultation request below.`
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Realistic counselor auto-response delay
    setTimeout(() => {
      const answer = getAutoAnswer(text);
      const agentMessage: ChatMessage = {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent',
        text: answer.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      };
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
      if (!isChatOpen) {
        setHasUnread(true);
      }
    }, 700);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formContact.trim() || !formMessage.trim()) {
      alert(language === 'ko' ? '이름, 연락처, 상담 내용을 모두 입력해 주세요.' : 'Please fill in all fields.');
      return;
    }

    // Add inquiry to SiteContext state (visible in AdminModal!)
    const created = addChatInquiry({
      name: formName.trim(),
      contact: formContact.trim(),
      category: formCategory,
      message: formMessage.trim()
    });

    // Post to chat stream
    const userMsg: ChatMessage = {
      id: `msg-inquiry-${Date.now()}`,
      sender: 'user',
      text: `[1:1 상담 접수 완료]\n• 성함: ${formName}\n• 연락처: ${formContact}\n• 분야: ${formCategory}\n• 문의내용: ${formMessage}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      inquiryDetails: {
        name: formName,
        contact: formContact,
        category: formCategory
      }
    };

    const confirmMsg: ChatMessage = {
      id: `msg-agent-confirm-${Date.now()}`,
      sender: 'agent',
      text: language === 'ko'
        ? `✅ ${formName}님의 1:1 상담 문의가 정상적으로 접수되었습니다. (접수번호: ${created.id})\n\n24시간 전문 상담팀이 기재해주신 연락처(${formContact})로 신속히 정성껏 안내해 드리겠습니다. 추가 질문이 있으시면 언제든 말씀해 주세요.`
        : `✅ Your consultation request has been successfully submitted (ID: ${created.id}). Our team will contact you shortly.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg, confirmMsg]);
    setFormSubmitted(true);
    setShowInquiryForm(false);
    setFormMessage('');
  };

  const handleClearHistory = () => {
    if (window.confirm(language === 'ko' ? '대화 내역을 모두 지우시겠습니까?' : 'Clear chat history?')) {
      const initial: ChatMessage[] = [
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'agent',
          text: language === 'ko'
            ? (chatConfig?.welcomeMessage?.ko || '안녕하세요! 부탄 라엘리안 무브먼트 24시간 실시간 상담센터입니다.')
            : (chatConfig?.welcomeMessage?.en || 'Welcome to 24/7 Live Consultation.'),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        }
      ];
      setMessages(initial);
      localStorage.removeItem('bhutan_rm_chat_history_v1');
    }
  };

  const quickQuestions = language === 'ko' ? [
    { label: '🏛️ 대사관 프로젝트란?', query: '대사관 프로젝트에 대해 알려주세요' },
    { label: '📚 무료 전자책 7종 다운로드', query: '무료 전자책 7권 다운로드 방법 알려주세요' },
    { label: '🧬 엘로힘(Elohim)은 누구인가요?', query: '엘로힘에 대해 설명해 주세요' },
    { label: '🧘 감각명상 세미나 신청', query: '감각명상 세미나 참가 신청 방법 알려주세요' },
    { label: '📝 1:1 전문 상담원 접수', action: () => setShowInquiryForm(true) }
  ] : [
    { label: '🏛️ Embassy Project', query: 'Tell me about the Embassy Project' },
    { label: '📚 7 Free eBooks', query: 'How can I download 7 free ebooks?' },
    { label: '🧬 Who are the Elohim?', query: 'Who are the Elohim?' },
    { label: '🧘 Meditation Workshop', query: 'How to join the Sensual Meditation workshop?' },
    { label: '📝 1:1 Consultation', action: () => setShowInquiryForm(true) }
  ];

  return (
    <>
      {/* ======================================================== */}
      {/* 1. FLOATING CHAT TRIGGER BUTTON (FOLLOWS AT BOTTOM OF PAGE) */}
      {/* ======================================================== */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {/* Subtle proactive speech teaser when closed */}
        {!isChatOpen && (
          <div 
            onClick={() => setIsChatOpen(true)}
            className="mb-2 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 text-[#2C241D] text-xs font-medium shadow-lg border border-[#E8DFD3] cursor-pointer hover:bg-orange-50 transition-all transform hover:-translate-y-0.5 animate-bounce backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>{language === 'ko' ? '💬 24시간 실시간 상담원 대기중' : '💬 24/7 Live Counselor Online'}</span>
          </div>
        )}

        <button
          id="floating-live-chat-btn"
          onClick={() => setIsChatOpen(!isChatOpen)}
          aria-label={language === 'ko' ? '24시간 채팅상담 열기' : 'Open 24/7 Live Chat'}
          className="group relative flex items-center gap-2.5 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full text-white font-bold text-sm shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer border border-white/25 overflow-hidden"
          style={{ 
            backgroundColor: theme.accentColor || '#EA580C',
            boxShadow: '0 12px 30px -4px rgba(234, 88, 12, 0.45)'
          }}
        >
          {/* Subtle sheen highlight effect */}
          <div className="absolute inset-0 w-1/2 h-full bg-white/15 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000"></div>

          {/* Icon with status badge */}
          <div className="relative flex items-center justify-center">
            {isChatOpen ? (
              <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
            ) : (
              <MessageCircle className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            )}
            {!isChatOpen && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-white"></span>
              </span>
            )}
          </div>

          {/* Button Text */}
          <div className="flex flex-col text-left">
            <span className="text-xs font-black tracking-wide uppercase leading-tight">
              {language === 'ko' ? '24시간 채팅상담' : '24/7 Live Chat'}
            </span>
            <span className="text-[10px] text-white/85 font-medium leading-tight hidden sm:inline">
              {language === 'ko' ? '상담원 실시간 연결' : 'Instant Counselor'}
            </span>
          </div>

          {/* Unread indicator badge if any */}
          {hasUnread && !isChatOpen && (
            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-black bg-red-500 text-white rounded-full animate-pulse">
              NEW
            </span>
          )}
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. CHAT MODAL WINDOW                                     */}
      {/* ======================================================== */}
      {isChatOpen && (
        <div 
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-w-[440px] h-[580px] max-h-[calc(100vh-7rem)] bg-white rounded-3xl shadow-2xl border border-[#E8DFD3] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300"
          style={{ boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.25)' }}
        >
          {/* Header */}
          <div 
            className="p-4 text-white flex items-center justify-between relative overflow-hidden"
            style={{ backgroundColor: theme.accentColor || '#EA580C' }}
          >
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-inner">
                  <Headphones className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm leading-tight font-display">
                    {language === 'ko' ? (chatConfig?.counselorName?.ko || '라엘리안 전문 상담팀') : (chatConfig?.counselorName?.en || 'Raëlian Live Counselor')}
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/25 text-white uppercase tracking-wider">
                    24H LIVE
                  </span>
                </div>
                <p className="text-[11px] text-white/90 leading-tight flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                  {language === 'ko' ? '상담원 실시간 온라인 | 365일 24시간 대기' : 'Online 24/7 | Always Available'}
                </p>
              </div>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-1 relative z-10 text-white/90">
              <button
                onClick={handleClearHistory}
                title={language === 'ko' ? '대화 내역 비우기' : 'Clear Chat'}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsChatOpen(false)}
                title={language === 'ko' ? '닫기' : 'Close'}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Subtle decorative circles */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none"></div>
          </div>

          {/* Subheader / Quick contact info strip */}
          <div className="bg-[#FAF7F2] px-4 py-2 border-b border-[#E8DFD3] flex items-center justify-between text-[11px] text-[#6E5D4C]">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#EA580C]" />
              {language === 'ko' ? (chatConfig?.operatingHours?.ko || '365일 24시간 연중무휴') : (chatConfig?.operatingHours?.en || '24/7 Non-stop')}
            </span>
            <div className="flex items-center gap-2">
              <a 
                href={`tel:${chatConfig?.emergencyPhone || '+9752321000'}`} 
                className="flex items-center gap-1 hover:text-[#EA580C] font-semibold transition-colors"
                title={language === 'ko' ? '전화 상담' : 'Call'}
              >
                <Phone className="w-3 h-3 text-[#EA580C]" />
                <span>{language === 'ko' ? '전화연결' : 'Call'}</span>
              </a>
              <span className="text-stone-300">|</span>
              <button
                onClick={() => setShowInquiryForm(!showInquiryForm)}
                className="flex items-center gap-1 font-semibold text-[#EA580C] hover:underline cursor-pointer"
              >
                <User className="w-3 h-3" />
                <span>{showInquiryForm ? (language === 'ko' ? '채팅창 보기' : 'Chat Stream') : (language === 'ko' ? '1:1 접수' : 'Direct Inquiry')}</span>
              </button>
            </div>
          </div>

          {/* Main Area: Either Inquiry Form OR Chat Messages */}
          {showInquiryForm ? (
            /* ======================================================== */
            /* 1:1 FORM VIEW                                            */
            /* ======================================================== */
            <div className="flex-1 p-5 overflow-y-auto bg-stone-50/70 space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#EA580C] flex items-center justify-center font-bold">
                    1:1
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1F1B18]">
                      {language === 'ko' ? '전문 상담원 1:1 상담 문의 접수' : 'Submit 1:1 Consultation Request'}
                    </h4>
                    <p className="text-[10px] text-stone-500">
                      {language === 'ko' ? '접수 시 담당 상담원이 24시간 이내에 직접 연락드립니다.' : 'A dedicated counselor will contact you.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInquiryForm(false)}
                  className="text-stone-400 hover:text-stone-600 text-xs cursor-pointer p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    {language === 'ko' ? '성함 *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder={language === 'ko' ? '홍길동' : 'Full Name'}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    {language === 'ko' ? '연락처 또는 이메일 *' : 'Phone or Email *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formContact}
                    onChange={e => setFormContact(e.target.value)}
                    placeholder={language === 'ko' ? '010-0000-0000 또는 email@example.com' : '+975... or name@email.com'}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    {language === 'ko' ? '상담 분야' : 'Category'}
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    {(chatConfig?.categories || ['엘로힘 메시지 안내', '무료 전자책 신청', '감각명상 및 세미나', '외계인 대사관 프로젝트']).map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    {language === 'ko' ? '문의 내용 *' : 'Consultation Message *'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formMessage}
                    onChange={e => setFormMessage(e.target.value)}
                    placeholder={language === 'ko' ? '궁금하신 점이나 상담 희망 내용을 자유롭게 작성해 주세요.' : 'How can we help you?'}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInquiryForm(false)}
                    className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    {language === 'ko' ? '취소' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                    style={{ backgroundColor: theme.accentColor || '#EA580C' }}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{language === 'ko' ? '상담 접수 완료' : 'Submit Request'}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* ======================================================== */
            /* CHAT MESSAGES VIEW                                       */
            /* ======================================================== */
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-stone-50/50">
              {/* Quick topics horizontal chips bar */}
              <div className="pb-2">
                <p className="text-[10px] font-bold text-stone-400 mb-1.5 uppercase tracking-wider">
                  {language === 'ko' ? '빠른 질문 선택' : 'Quick Inquiries'}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (q.action) {
                          q.action();
                        } else if (q.query) {
                          handleSendMessage(q.query);
                        }
                      }}
                      className="px-2.5 py-1 rounded-full bg-white hover:bg-orange-50 text-[#6E5D4C] hover:text-[#EA580C] border border-[#E8DFD3] text-[11px] font-medium transition-all shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message bubbles */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-end gap-1.5 max-w-[85%]">
                    {msg.sender === 'agent' && (
                      <div className="w-7 h-7 rounded-full bg-orange-100 text-[#EA580C] flex items-center justify-center font-bold text-[10px] shrink-0 border border-orange-200">
                        Raël
                      </div>
                    )}
                    
                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs whitespace-pre-wrap ${
                        msg.sender === 'user'
                          ? 'bg-[#EA580C] text-white rounded-br-none'
                          : 'bg-white text-[#2C241D] border border-[#E8DFD3] rounded-bl-none'
                      }`}
                      style={msg.sender === 'user' ? { backgroundColor: theme.accentColor || '#EA580C' } : {}}
                    >
                      {msg.text}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 px-1 text-[9px] text-stone-400">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-end gap-1.5">
                  <div className="w-7 h-7 rounded-full bg-orange-100 text-[#EA580C] flex items-center justify-center font-bold text-[10px] shrink-0 border border-orange-200">
                    Raël
                  </div>
                  <div className="px-3.5 py-2 rounded-2xl bg-white border border-[#E8DFD3] text-xs text-stone-500 rounded-bl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce [animation-delay:0.4s]"></span>
                    <span className="ml-1 text-[11px] text-stone-400 font-medium">
                      {language === 'ko' ? '상담원이 답변을 작성 중입니다...' : 'Typing response...'}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Bottom Chat Input Bar */}
          {!showInquiryForm && (
            <div className="p-3 bg-white border-t border-[#E8DFD3]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={language === 'ko' ? '궁금하신 내용을 입력하세요...' : 'Type your question...'}
                  className="flex-1 px-3.5 py-2.5 text-xs rounded-full border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-[#1F1B18]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-9 h-9 rounded-full text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 shadow-md cursor-pointer shrink-0"
                  style={{ backgroundColor: theme.accentColor || '#EA580C' }}
                  title={language === 'ko' ? '전송' : 'Send'}
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
              <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-stone-400">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {language === 'ko' ? '24시간 무중단 실시간 상담센터' : '24/7 Realtime Live Support'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowInquiryForm(true)}
                  className="text-[#EA580C] hover:underline font-semibold cursor-pointer"
                >
                  {language === 'ko' ? '1:1 상담 접수 양식' : 'Inquiry Form'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
