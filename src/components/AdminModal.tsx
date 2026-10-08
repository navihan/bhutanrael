import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Post, PostCategory, ThemeConfig, SeoConfig, SiteContent, BookItem } from '../types';
import { defaultPhilosophyPillars, defaultBooks } from '../data/defaultData';
import {
  X,
  Plus,
  Edit,
  Trash2,
  Check,
  Palette,
  Layout,
  FileText,
  Search,
  Share2,
  Database,
  Eye,
  RefreshCw,
  Download,
  Upload,
  Globe,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  LogOut,
  KeyRound,
  ShieldCheck,
  Users,
  UserPlus,
  Lock,
  Shield,
  BookOpen,
  MessageCircle,
  Headphones,
  PhoneCall,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
  Filter,
  Save,
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  Activity,
  CheckCircle2,
  Send,
  Inbox,
  Zap,
  ArrowUpRight,
  MessageSquareQuote,
  Settings
} from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { AdminManagementTab } from './AdminManagementTab';

type AdminTab = 'dashboard' | 'chat' | 'posts' | 'books' | 'admins' | 'content' | 'philosophy' | 'theme' | 'seo' | 'backup';

export const AdminModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    adminLogout,
    adminUsername,
    changeAdminPassword,
    currentAdmin,
    adminUsers,
    canEditPost,
    canDeletePost,
    editingPostTarget,
    setEditingPostTarget,
    theme,
    updateTheme,
    seo,
    updateSeo,
    content,
    updateContent,
    philosophyPillars,
    updatePhilosophyPillars,
    updatePillar,
    books,
    updateBooks,
    addBook,
    updateBook,
    deleteBook,
    resetBooksToDefault,
    chatConfig,
    updateChatConfig,
    chatInquiries,
    updateChatInquiryStatus,
    deleteChatInquiry,
    clearChatInquiries,
    addChatInquiry,
    posts,
    addPost,
    updatePost,
    deletePost,
    resetToDefault,
    exportData,
    importData,
    language,
    navigate
  } = useSite();

  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [pwdFeedback, setPwdFeedback] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [dashboardInquiryFilter, setDashboardInquiryFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');
  const [dashboardReplyOpenId, setDashboardReplyOpenId] = useState<string | null>(null);

  // Author filter for posts tab
  const [postAuthorFilter, setPostAuthorFilter] = useState<'all' | 'mine'>('all');

  // Post editor state
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isCreatingNewPost, setIsCreatingNewPost] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Post form fields
  const [postForm, setPostForm] = useState({
    titleKo: '',
    titleEn: '',
    summaryKo: '',
    summaryEn: '',
    contentKo: '',
    contentEn: '',
    category: 'announcement' as PostCategory,
    author: '부탄 지부 운영위원회',
    date: new Date().toISOString().split('T')[0],
    readTime: '4 min',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&auto=format&fit=crop&q=80',
    tags: '부탄, 라엘리안, 평화',
    status: 'published' as 'published' | 'draft',
    isFeatured: false
  });

  // Auto-switch to post editor when editingPostTarget is set
  React.useEffect(() => {
    if (editingPostTarget) {
      setActiveTab('posts');
      handleStartEditPost(editingPostTarget);
      setEditingPostTarget(null);
    }
  }, [editingPostTarget]);

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 2500);
  };

  const handleStartCreatePost = () => {
    setEditingPost(null);
    setPostForm({
      titleKo: '',
      titleEn: '',
      summaryKo: '',
      summaryEn: '',
      contentKo: '',
      contentEn: '',
      category: 'announcement',
      author: currentAdmin?.name || (language === 'ko' ? '부탄 지부 운영위원회' : 'Bhutan RM Committee'),
      date: new Date().toISOString().split('T')[0],
      readTime: '3 min',
      coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&auto=format&fit=crop&q=80',
      tags: '부탄, 공지, 평화',
      status: 'published',
      isFeatured: false
    });
    setIsCreatingNewPost(true);
  };

  const handleStartEditPost = (post: Post) => {
    setIsCreatingNewPost(false);
    setEditingPost(post);
    setPostForm({
      titleKo: post.title.ko,
      titleEn: post.title.en,
      summaryKo: post.summary.ko,
      summaryEn: post.summary.en,
      contentKo: post.content.ko,
      contentEn: post.content.en,
      category: post.category,
      author: post.author,
      date: post.date,
      readTime: post.readTime,
      coverImage: post.coverImage,
      tags: post.tags.join(', '),
      status: post.status,
      isFeatured: !!post.isFeatured
    });
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = postForm.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (editingPost) {
      updatePost({
        ...editingPost,
        title: { ko: postForm.titleKo, en: postForm.titleEn },
        summary: { ko: postForm.summaryKo, en: postForm.summaryEn },
        content: { ko: postForm.contentKo, en: postForm.contentEn },
        category: postForm.category,
        author: postForm.author,
        date: postForm.date,
        readTime: postForm.readTime,
        coverImage: postForm.coverImage,
        tags: tagArray,
        status: postForm.status,
        isFeatured: postForm.isFeatured
      });
      showNotification(language === 'ko' ? '게시글이 수정되었습니다.' : 'Article updated successfully.');
    } else {
      addPost({
        title: { ko: postForm.titleKo, en: postForm.titleEn },
        summary: { ko: postForm.summaryKo, en: postForm.summaryEn },
        content: { ko: postForm.contentKo, en: postForm.contentEn },
        category: postForm.category,
        author: postForm.author,
        date: postForm.date,
        readTime: postForm.readTime,
        coverImage: postForm.coverImage,
        tags: tagArray,
        status: postForm.status,
        isFeatured: postForm.isFeatured
      });
      showNotification(language === 'ko' ? '새 게시글이 등록되었습니다.' : 'New article published successfully.');
    }

    setIsCreatingNewPost(false);
    setEditingPost(null);
  };

  const handleDeletePost = (id: string, title: string) => {
    if (window.confirm(language === 'ko' ? `"${title}" 게시글을 정말 삭제하시겠습니까?` : `Delete article "${title}"?`)) {
      deletePost(id);
      showNotification(language === 'ko' ? '게시글이 삭제되었습니다.' : 'Article deleted.');
    }
  };

  // Book Editor State & Handlers
  const [editingBook, setEditingBook] = useState<BookItem | null>(null);
  const [isCreatingNewBook, setIsCreatingNewBook] = useState(false);
  const [bookForm, setBookForm] = useState({
    titleKo: '',
    titleEn: '',
    author: '라엘 (Raël)',
    pageCount: 200,
    downloadUrl: 'https://www.rael.org/books/',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    descKo: '',
    descEn: '',
    languages: '한국어, English, Français'
  });

  const handleStartCreateBook = () => {
    setEditingBook(null);
    setBookForm({
      titleKo: '',
      titleEn: '',
      author: '라엘 (Raël)',
      pageCount: 200,
      downloadUrl: 'https://www.rael.org/books/',
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      descKo: '',
      descEn: '',
      languages: '한국어, English, Français'
    });
    setIsCreatingNewBook(true);
  };

  const handleStartEditBook = (book: BookItem) => {
    setIsCreatingNewBook(false);
    setEditingBook(book);
    setBookForm({
      titleKo: book.title.ko,
      titleEn: book.title.en,
      author: book.author,
      pageCount: book.pageCount,
      downloadUrl: book.downloadUrl,
      coverImage: book.coverImage,
      descKo: book.description.ko,
      descEn: book.description.en,
      languages: book.languages.join(', ')
    });
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    const langArray = bookForm.languages
      .split(',')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (editingBook) {
      updateBook({
        ...editingBook,
        title: { ko: bookForm.titleKo, en: bookForm.titleEn },
        author: bookForm.author,
        pageCount: Number(bookForm.pageCount) || 100,
        downloadUrl: bookForm.downloadUrl,
        coverImage: bookForm.coverImage,
        description: { ko: bookForm.descKo, en: bookForm.descEn },
        languages: langArray.length > 0 ? langArray : ['한국어', 'English']
      });
      showNotification(language === 'ko' ? `"${bookForm.titleKo}" 도서 정보가 수정되었습니다.` : 'Book updated successfully.');
    } else {
      addBook({
        title: { ko: bookForm.titleKo, en: bookForm.titleEn },
        author: bookForm.author,
        pageCount: Number(bookForm.pageCount) || 100,
        downloadUrl: bookForm.downloadUrl,
        coverImage: bookForm.coverImage,
        description: { ko: bookForm.descKo, en: bookForm.descEn },
        languages: langArray.length > 0 ? langArray : ['한국어', 'English']
      });
      showNotification(language === 'ko' ? `새 도서 "${bookForm.titleKo}"가 등록되었습니다.` : 'New book added successfully.');
    }
    setEditingBook(null);
    setIsCreatingNewBook(false);
  };

  const handleDeleteBook = (id: string, title: string) => {
    if (window.confirm(language === 'ko' ? `"${title}" 도서를 정말로 삭제하시겠습니까?` : `Are you sure you want to delete "${title}"?`)) {
      deleteBook(id);
      showNotification(language === 'ko' ? '도서가 삭제되었습니다.' : 'Book deleted.');
    }
  };

  // Chat management state & handlers
  const [chatInquiryFilter, setChatInquiryFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [selectedInquiryForReply, setSelectedInquiryForReply] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  // Manual inquiry creation modal/drawer inside chat tab
  const [isAddingManualInquiry, setIsAddingManualInquiry] = useState(false);
  const [manualInquiryForm, setManualInquiryForm] = useState({
    name: '',
    contact: '',
    category: chatConfig?.categories?.[0] || '엘로힘 메시지 안내',
    message: '',
    adminNotes: ''
  });

  // Chat settings form
  const [chatConfigForm, setChatConfigForm] = useState({
    enabled: chatConfig?.enabled ?? true,
    counselorNameKo: chatConfig?.counselorName?.ko || '',
    counselorNameEn: chatConfig?.counselorName?.en || '',
    counselorTitleKo: chatConfig?.counselorTitle?.ko || '',
    counselorTitleEn: chatConfig?.counselorTitle?.en || '',
    welcomeKo: chatConfig?.welcomeMessage?.ko || '',
    welcomeEn: chatConfig?.welcomeMessage?.en || '',
    autoReplyEnabled: chatConfig?.autoReplyEnabled ?? true,
    operatingHoursKo: chatConfig?.operatingHours?.ko || '',
    operatingHoursEn: chatConfig?.operatingHours?.en || '',
    emergencyPhone: chatConfig?.emergencyPhone || '',
    emergencyEmail: chatConfig?.emergencyEmail || '',
    categoriesStr: (chatConfig?.categories || []).join(', ')
  });

  const handleSaveChatConfig = () => {
    const cats = chatConfigForm.categoriesStr
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0);
    updateChatConfig({
      enabled: chatConfigForm.enabled,
      counselorName: {
        ko: chatConfigForm.counselorNameKo,
        en: chatConfigForm.counselorNameEn
      },
      counselorTitle: {
        ko: chatConfigForm.counselorTitleKo,
        en: chatConfigForm.counselorTitleEn
      },
      welcomeMessage: {
        ko: chatConfigForm.welcomeKo,
        en: chatConfigForm.welcomeEn
      },
      autoReplyEnabled: chatConfigForm.autoReplyEnabled,
      operatingHours: {
        ko: chatConfigForm.operatingHoursKo,
        en: chatConfigForm.operatingHoursEn
      },
      emergencyPhone: chatConfigForm.emergencyPhone,
      emergencyEmail: chatConfigForm.emergencyEmail,
      categories: cats.length > 0 ? cats : chatConfig?.categories
    });
    showNotification(language === 'ko' ? '24시간 채팅상담 환경 설정이 저장되었습니다.' : 'Chat settings saved successfully.');
  };

  const handleSaveInquiryReplyAndNote = (id: string, currentStatus: 'pending' | 'in_progress' | 'resolved') => {
    const reply = replyDrafts[id];
    const notes = noteDrafts[id];
    const nextStatus = reply?.trim() ? 'resolved' : currentStatus;
    updateChatInquiryStatus(id, nextStatus, notes, reply);
    showNotification(language === 'ko' ? '상담 답변 및 관리자 메모가 저장되었습니다.' : 'Reply and notes saved.');
    setSelectedInquiryForReply(null);
  };

  const handleCreateManualInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInquiryForm.name.trim() || !manualInquiryForm.contact.trim() || !manualInquiryForm.message.trim()) {
      alert(language === 'ko' ? '이름, 연락처, 상담 내용을 모두 입력해 주세요.' : 'Please fill all required fields.');
      return;
    }
    const created = addChatInquiry({
      name: manualInquiryForm.name.trim(),
      contact: manualInquiryForm.contact.trim(),
      category: manualInquiryForm.category,
      message: manualInquiryForm.message.trim(),
      adminNotes: manualInquiryForm.adminNotes.trim() || undefined
    });
    showNotification(language === 'ko' ? `상담 건(${created.id})이 직접 등록되었습니다.` : 'Inquiry added successfully.');
    setIsAddingManualInquiry(false);
    setManualInquiryForm({
      name: '',
      contact: '',
      category: chatConfig?.categories?.[0] || '엘로힘 메시지 안내',
      message: '',
      adminNotes: ''
    });
  };

  const handleDeleteInquiry = (id: string, name: string) => {
    if (window.confirm(language === 'ko' ? `"${name}" 님의 상담 내역을 삭제하시겠습니까?` : `Delete inquiry from ${name}?`)) {
      deleteChatInquiry(id);
      showNotification(language === 'ko' ? '상담 내역이 삭제되었습니다.' : 'Inquiry deleted.');
    }
  };

  const handleClearAllInquiries = () => {
    if (window.confirm(language === 'ko' ? '모든 실시간 상담 문의 내역을 초기화하시겠습니까?' : 'Clear all chat inquiries?')) {
      clearChatInquiries();
      showNotification(language === 'ko' ? '모든 상담 내역이 초기화되었습니다.' : 'All inquiries cleared.');
    }
  };

  const handleExportInquiries = () => {
    const dataStr = JSON.stringify(chatInquiries, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `raelian_chat_inquiries_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification(language === 'ko' ? '상담 내역 백업 파일이 다운로드되었습니다.' : 'Inquiries exported.');
  };

  const handleCreateSampleInquiry = () => {
    const sample = addChatInquiry({
      name: '김태형',
      contact: '010-9876-5432',
      category: '전자책 다운로드',
      message: '새로 추가된 인간복제 및 각성으로의 여행 도서 PDF 다운로드 관련 문의드립니다. 태블릿에서도 바로 열람 가능한가요?',
      adminNotes: '모바일 및 태블릿 다운로드 안내 완료'
    });
    showNotification(language === 'ko' ? `샘플 실시간 상담 문의(${sample.id})가 등록되었습니다.` : 'Sample inquiry created.');
  };

  const handleQuickStatusChange = (id: string, newStatus: 'pending' | 'in_progress' | 'resolved') => {
    updateChatInquiryStatus(id, newStatus);
    showNotification(language === 'ko' ? '상담 처리 상태가 업데이트되었습니다.' : 'Status updated.');
  };

  const handleToggleChatWidget = () => {
    const nextState = !(chatConfig?.enabled ?? true);
    updateChatConfig({ enabled: nextState });
    setChatConfigForm(prev => ({ ...prev, enabled: nextState }));
    showNotification(language === 'ko' 
      ? (nextState ? '24시간 채팅상담 위젯이 활성화되었습니다 (온라인).' : '24시간 채팅상담 위젯이 일시 정지되었습니다 (오프라인).')
      : (nextState ? 'Chat widget enabled.' : 'Chat widget paused.'));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const contentStr = event.target?.result as string;
      const success = importData(contentStr);
      if (success) {
        showNotification(language === 'ko' ? '백업 데이터를 성공적으로 불러왔습니다!' : 'Backup restored successfully!');
      } else {
        alert(language === 'ko' ? '올바르지 않은 JSON 백업 파일입니다.' : 'Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  if (!isAdminOpen || !isAdminAuthenticated) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-[#FAF7F2] rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-[#D5C7B5] flex flex-col relative text-left"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-[#2D251F] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: theme.accentColor }}
            >
              <Layout className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-display leading-tight">
                  {language === 'ko' ? '부탄 라엘리안 관리자 대시보드' : 'Bhutan RM Admin Control Center'}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{adminUsername}</span>
                </span>
              </div>
              <p className="text-[11px] text-[#B0A192]">
                {language === 'ko' ? '콘텐츠, 디자인 테마, 게시글, SEO 전반 실시간 제어' : 'Live real-time control for content, posts, themes & SEO'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Navigation to Site Sections */}
            <div className="hidden lg:flex items-center gap-1 border-r border-white/10 pr-2 mr-1">
              <span className="text-[11px] text-[#A69584] font-medium mr-1 flex items-center gap-1">
                <ExternalLink className="w-3 h-3 text-[#A69584]" />
                <span>{language === 'ko' ? '사이트 바로가기:' : 'Jump to:'}</span>
              </span>
              {[
                { id: '#about', label: language === 'ko' ? '소개' : 'About' },
                { id: '#philosophy', label: language === 'ko' ? '5대 철학' : 'Philosophy' },
                { id: '#embassy', label: language === 'ko' ? '대사관' : 'Embassy' },
                { id: '#articles', label: language === 'ko' ? '소식' : 'News' },
                { id: '#books', label: language === 'ko' ? '도서' : 'Books' },
                { id: '#events', label: language === 'ko' ? '일정' : 'Events' },
                { id: '#contact', label: language === 'ko' ? '연락처' : 'Contact' },
              ].map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    setIsAdminOpen(false);
                    navigate('/');
                    setTimeout(() => {
                      const el = document.querySelector(sec.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 120);
                  }}
                  className="px-2 py-1 rounded-md text-[11px] font-medium text-[#C8B8A6] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {sec.label}
                </button>
              ))}
            </div>

            {saveSuccessMsg && (
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/40 animate-pulse">
                {saveSuccessMsg}
              </span>
            )}
            
            {/* Logout button */}
            <button
              onClick={() => {
                adminLogout();
                showNotification(language === 'ko' ? '관리자 로그아웃 완료' : 'Logged out');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-white transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1 border border-rose-500/30"
              title={language === 'ko' ? '관리자 로그아웃' : 'Log Out'}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'ko' ? '로그아웃' : 'Log Out'}</span>
            </button>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 rounded-lg text-[#C8B8A6] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="bg-[#EFE8DC] border-b border-[#D8CCBD] px-6 flex items-center gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => { setActiveTab('dashboard'); setIsCreatingNewPost(false); setEditingPost(null); }}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-[#EA580C] text-[#EA580C] bg-[#FAF7F2]'
                : 'border-transparent text-[#615142] hover:text-[#1E1915]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>{language === 'ko' ? '종합 대시보드' : 'Dashboard'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('chat'); setIsCreatingNewPost(false); setEditingPost(null); }}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'chat'
                ? 'border-[#EA580C] text-[#EA580C] bg-[#FAF7F2]'
                : 'border-transparent text-[#615142] hover:text-[#1E1915]'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{language === 'ko' ? '24시간 채팅상담' : '24/7 Chat'}</span>
            {chatInquiries.filter(i => i.status === 'pending').length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white animate-pulse">
                {chatInquiries.filter(i => i.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('posts'); setIsCreatingNewPost(false); setEditingPost(null); }}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'posts'
                ? 'border-[#EA580C] text-[#EA580C] bg-[#FAF7F2]'
                : 'border-transparent text-[#615142] hover:text-[#1E1915]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{language === 'ko' ? '게시글 관리' : 'Articles'} ({posts.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('books'); setIsCreatingNewPost(false); setEditingPost(null); }}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'books'
                ? 'border-[#EA580C] text-[#EA580C] bg-[#FAF7F2]'
                : 'border-transparent text-[#615142] hover:text-[#1E1915]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{language === 'ko' ? '무료 전자책 관리' : 'eBooks'} ({books?.length || 7})</span>
          </button>

          <button
            onClick={() => { setActiveTab('admins'); setIsCreatingNewPost(false); setEditingPost(null); }}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'admins'
                ? 'border-[#EA580C] text-[#EA580C] bg-[#FAF7F2]'
                : 'border-transparent text-[#615142] hover:text-[#1E1915]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{language === 'ko' ? '관리자 팀 & 초대' : 'Admins & Invites'} ({adminUsers.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('content'); setIsCreatingNewPost(false); setEditingPost(null); }}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'content'
                ? 'border-[#EA580C] text-[#EA580C] bg-[#FAF7F2]'
                : 'border-transparent text-[#615142] hover:text-[#1E1915]'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>{language === 'ko' ? '메인페이지 콘텐츠' : 'Main Content'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('philosophy'); setIsCreatingNewPost(false); setEditingPost(null); }}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'philosophy'
                ? 'border-[#EA580C] text-[#EA580C] bg-[#FAF7F2]'
                : 'border-transparent text-[#615142] hover:text-[#1E1915]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'ko' ? '5대 핵심 철학' : '5 Pillars'} ({philosophyPillars?.length || 5})</span>
          </button>

          <button
            onClick={() => { setActiveTab('theme'); setIsCreatingNewPost(false); setEditingPost(null); }}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'theme'
                ? 'border-[#EA580C] text-[#EA580C] bg-[#FAF7F2]'
                : 'border-transparent text-[#615142] hover:text-[#1E1915]'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>{language === 'ko' ? '디자인 & 테마' : 'Theme & Styling'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('seo'); setIsCreatingNewPost(false); setEditingPost(null); }}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'seo'
                ? 'border-[#EA580C] text-[#EA580C] bg-[#FAF7F2]'
                : 'border-transparent text-[#615142] hover:text-[#1E1915]'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>{language === 'ko' ? 'SEO & 소셜 미디어' : 'SEO & Social'}</span>
          </button>

          <button
            onClick={() => { setActiveTab('backup'); setIsCreatingNewPost(false); setEditingPost(null); }}
            className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'backup'
                ? 'border-[#EA580C] text-[#EA580C] bg-[#FAF7F2]'
                : 'border-transparent text-[#615142] hover:text-[#1E1915]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{language === 'ko' ? '백업 & 초기화' : 'Backup & Reset'}</span>
          </button>
        </div>

        {/* Tab Body Contents */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">

          {/* TAB 0: COMPREHENSIVE DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              
              {/* 1. Welcome & Status Banner */}
              <div className="bg-gradient-to-r from-[#2A221B] via-[#3D332B] to-[#2A221B] rounded-2xl p-6 text-white shadow-md border border-[#524439] relative overflow-hidden">
                <div className="absolute right-0 top-0 w-96 h-full opacity-10 pointer-events-none bg-[radial-gradient(#EA580C_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EA580C] text-white flex items-center gap-1.5 shadow-2xs">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {currentAdmin?.role === 'super_admin' ? (language === 'ko' ? '최고 관리자 (Super Admin)' : 'Super Admin') : (language === 'ko' ? '운영 관리자 (Admin)' : 'Admin')}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/10 text-[#E8DFD3] border border-white/10">
                        {currentAdmin?.email || adminUsername}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        {language === 'ko' ? '시스템 정상 작동 중' : 'System Operational'}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white flex items-center gap-2">
                      <span>{language === 'ko' ? `환영합니다, ${currentAdmin?.name || '최고 관리자'}님!` : `Welcome, ${currentAdmin?.name || 'Administrator'}!`}</span>
                      <Sparkles className="w-5 h-5 text-[#EA580C]" />
                    </h2>
                    <p className="text-xs sm:text-sm text-[#D1C3B2] mt-1 max-w-2xl leading-relaxed">
                      {language === 'ko'
                        ? '부탄 라엘리안 무브먼트 공식 포털의 24시간 실시간 상담 현황, 무료 전자책 라이브러리(7권), 게시글 및 시스템 설정을 한눈에 모니터링하고 제어합니다.'
                        : 'Unified control center for Bhutan Raelian Movement official portal: 24/7 live chat consultation, 7 free eBooks, articles, and system operations.'}
                    </p>
                  </div>

                  {/* 24/7 Consultation Live Status Widget Toggle & Quick Nav */}
                  <div className="bg-black/30 backdrop-blur-xs p-4 rounded-xl border border-white/10 flex flex-col gap-3 min-w-[280px]">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${chatConfig?.enabled !== false ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                        <span className="text-xs font-bold text-white">
                          {language === 'ko' ? '24시간 실시간 상담' : '24/7 Live Chat'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleToggleChatWidget}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          chatConfig?.enabled !== false
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-400/40 hover:bg-rose-500/30'
                        }`}
                      >
                        {chatConfig?.enabled !== false
                          ? (language === 'ko' ? '온라인 가동 중' : 'Online')
                          : (language === 'ko' ? '일시 정지됨' : 'Paused')}
                      </button>
                    </div>

                    <div className="text-[11px] text-[#C4B5A5] flex items-center justify-between border-t border-white/10 pt-2">
                      <span>{language === 'ko' ? '미답변 대기 문의' : 'Pending Inquiries'}</span>
                      <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                        chatInquiries.filter(i => i.status === 'pending').length > 0
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-white/10 text-emerald-300'
                      }`}>
                        {chatInquiries.filter(i => i.status === 'pending').length} {language === 'ko' ? '건' : 'items'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('chat')}
                      className="w-full py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-[#EA580C] hover:bg-[#D44D06] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{language === 'ko' ? '실시간 상담 관리 열기' : 'Manage Live Chat'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Top Key Performance Indicators (KPIs) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* KPI 1: Live Chat Consultation */}
                <div 
                  onClick={() => setActiveTab('chat')}
                  className="bg-white rounded-2xl border border-[#E4D8CB] p-5 shadow-xs hover:border-[#EA580C] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7A6B5B] uppercase tracking-wide">
                      {language === 'ko' ? '24시간 채팅상담' : '24/7 Live Chat'}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-[#1E1915] font-display">
                      {chatInquiries.length}
                    </span>
                    <span className="text-xs text-[#8C7A6B]">{language === 'ko' ? '건 접수' : 'inquiries'}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-[#F0E8DC]">
                    <span className="text-amber-700 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {language === 'ko' ? '대기' : 'Pending'}: {chatInquiries.filter(i => i.status === 'pending').length}
                    </span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {language === 'ko' ? '완료' : 'Done'}: {chatInquiries.filter(i => i.status === 'resolved').length}
                    </span>
                  </div>
                </div>

                {/* KPI 2: Free eBooks Library */}
                <div 
                  onClick={() => setActiveTab('books')}
                  className="bg-white rounded-2xl border border-[#E4D8CB] p-5 shadow-xs hover:border-[#EA580C] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7A6B5B] uppercase tracking-wide">
                      {language === 'ko' ? '무료 전자책 라이브러리' : 'Free eBooks'}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-[#1E1915] font-display">
                      {books?.length || 7}
                    </span>
                    <span className="text-xs text-[#8C7A6B]">{language === 'ko' ? '권 등록 배포 중' : 'books active'}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-[#F0E8DC]">
                    <span className="text-indigo-700 font-semibold">
                      {language === 'ko' ? '신규 도서 4권 포함' : '+4 New Releases'}
                    </span>
                    <span className="text-[#8C7A6B]">
                      {language === 'ko' ? '무료 PDF/Epub' : 'Free Download'}
                    </span>
                  </div>
                </div>

                {/* KPI 3: Published Articles */}
                <div 
                  onClick={() => setActiveTab('posts')}
                  className="bg-white rounded-2xl border border-[#E4D8CB] p-5 shadow-xs hover:border-[#EA580C] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7A6B5B] uppercase tracking-wide">
                      {language === 'ko' ? '게시글 & 아티클' : 'Published Articles'}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-[#1E1915] font-display">
                      {posts.length}
                    </span>
                    <span className="text-xs text-[#8C7A6B]">{language === 'ko' ? '편 발행' : 'articles'}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-[#F0E8DC]">
                    <span className="text-blue-700 font-semibold">
                      {language === 'ko' ? `추천글 ${posts.filter(p => p.isFeatured).length}편` : `${posts.filter(p => p.isFeatured).length} Featured`}
                    </span>
                    <span className="text-[#8C7A6B]">
                      {language === 'ko' ? '정상 게시 중' : 'Live'}
                    </span>
                  </div>
                </div>

                {/* KPI 4: Admins Team */}
                <div 
                  onClick={() => setActiveTab('admins')}
                  className="bg-white rounded-2xl border border-[#E4D8CB] p-5 shadow-xs hover:border-[#EA580C] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7A6B5B] uppercase tracking-wide">
                      {language === 'ko' ? '관리자 팀' : 'Admin Team'}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-[#1E1915] font-display">
                      {adminUsers.length}
                    </span>
                    <span className="text-xs text-[#8C7A6B]">{language === 'ko' ? '명 활성화' : 'admins'}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-[#F0E8DC]">
                    <span className="text-purple-700 font-semibold">
                      {currentAdmin?.role === 'super_admin' ? (language === 'ko' ? '최고 관리 권한' : 'Super Admin') : (language === 'ko' ? '일반 관리 권한' : 'Admin')}
                    </span>
                    <span className="text-[#8C7A6B]">
                      {language === 'ko' ? '초대 & 권한' : 'Invites'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Real-Time 24/7 Chat Consultation Control Desk */}
              <div className="bg-white rounded-2xl border border-[#E5DACD] shadow-xs overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-[#F0E8DC] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C] animate-pulse" />
                      <h3 className="text-base sm:text-lg font-bold text-[#1E1915] font-display">
                        {language === 'ko' ? '24시간 실시간 채팅상담 현황 & 신속 응대 데스크' : '24/7 Live Chat Consultation Desk'}
                      </h3>
                      {chatInquiries.filter(i => i.status === 'pending').length > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white animate-bounce">
                          {chatInquiries.filter(i => i.status === 'pending').length}건 대기
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#7A6B5B] mt-1">
                      {language === 'ko'
                        ? '홈페이지 우측 하단 24시간 실시간 상담 위젯에서 접수된 방문자의 문의 내역을 즉시 확인하고 상태 변경 및 신속 답변을 발송합니다.'
                        : 'Review inquiries received from the persistent 24/7 floating chat widget and respond immediately.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Filter Buttons */}
                    <div className="flex bg-[#F5EFEB] p-1 rounded-xl border border-[#E2D5C7]">
                      {(['all', 'pending', 'in_progress', 'resolved'] as const).map(filter => (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setDashboardInquiryFilter(filter)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                            dashboardInquiryFilter === filter
                              ? 'bg-white text-[#EA580C] shadow-2xs font-bold'
                              : 'text-[#6B5A4A] hover:text-[#1E1915]'
                          }`}
                        >
                          {filter === 'all' && (language === 'ko' ? `전체 (${chatInquiries.length})` : `All (${chatInquiries.length})`)}
                          {filter === 'pending' && (language === 'ko' ? `대기 (${chatInquiries.filter(i => i.status === 'pending').length})` : `Pending (${chatInquiries.filter(i => i.status === 'pending').length})`)}
                          {filter === 'in_progress' && (language === 'ko' ? `진행 (${chatInquiries.filter(i => i.status === 'in_progress').length})` : `In Progress (${chatInquiries.filter(i => i.status === 'in_progress').length})`)}
                          {filter === 'resolved' && (language === 'ko' ? `완료 (${chatInquiries.filter(i => i.status === 'resolved').length})` : `Resolved (${chatInquiries.filter(i => i.status === 'resolved').length})`)}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('chat')}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#EA580C] hover:bg-[#D44D06] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>{language === 'ko' ? '전체 상담 탭으로 이동' : 'Open Full Chat Tab'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Inquiry Cards in Dashboard */}
                <div className="p-5 sm:p-6 space-y-4">
                  {chatInquiries.length === 0 ? (
                    <div className="text-center py-12 px-4 bg-[#FCFAF7] rounded-xl border border-dashed border-[#DDD0C0]">
                      <Inbox className="w-10 h-10 text-[#C4B5A5] mx-auto mb-3" />
                      <h4 className="text-sm font-bold text-[#1E1915]">
                        {language === 'ko' ? '접수된 실시간 상담 내역이 없습니다' : 'No chat inquiries yet'}
                      </h4>
                      <p className="text-xs text-[#8C7A6B] mt-1 max-w-md mx-auto">
                        {language === 'ko'
                          ? '웹사이트 메인 하단에 24시간 실시간 상담 위젯이 활성화되어 있으며, 방문자가 문의를 등록하면 즉시 이곳에 표시됩니다.'
                          : 'The 24/7 chat widget is active at the bottom right. Inquiries submitted by visitors will appear here.'}
                      </p>
                      <button
                        type="button"
                        onClick={handleCreateSampleInquiry}
                        className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#EA580C] hover:bg-[#D44D06] transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{language === 'ko' ? '테스트 실시간 문의 생성하기' : 'Create Sample Inquiry'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {chatInquiries
                        .filter(inq => {
                          if (dashboardInquiryFilter === 'all') return true;
                          return inq.status === dashboardInquiryFilter;
                        })
                        .slice(0, 5)
                        .map(inq => (
                          <div 
                            key={inq.id}
                            className={`p-4 rounded-xl border transition-all ${
                              inq.status === 'pending'
                                ? 'bg-amber-50/40 border-amber-200'
                                : inq.status === 'in_progress'
                                ? 'bg-blue-50/40 border-blue-200'
                                : 'bg-white border-[#E8DFD3]'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#F2ECE2]">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-sm text-[#1E1915] flex items-center gap-1.5">
                                  {inq.name}
                                </span>
                                <span className="text-xs text-[#8C7A6B] px-2 py-0.5 rounded-full bg-[#EFE8DC]">
                                  {inq.contact}
                                </span>
                                <span className="text-[11px] font-semibold text-[#EA580C] px-2 py-0.5 rounded-full bg-[#EA580C]/10">
                                  {inq.category}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-[#A69584]">
                                  {new Date(inq.createdAt).toLocaleString(language === 'ko' ? 'ko-KR' : 'en-US', {
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>

                                {/* Status Badge */}
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                                  inq.status === 'pending'
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : inq.status === 'in_progress'
                                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                }`}>
                                  {inq.status === 'pending' && <Clock className="w-3 h-3" />}
                                  {inq.status === 'in_progress' && <AlertCircle className="w-3 h-3" />}
                                  {inq.status === 'resolved' && <CheckCircle className="w-3 h-3" />}
                                  {inq.status === 'pending' && (language === 'ko' ? '접수 대기' : 'Pending')}
                                  {inq.status === 'in_progress' && (language === 'ko' ? '상담 진행중' : 'In Progress')}
                                  {inq.status === 'resolved' && (language === 'ko' ? '답변 완료' : 'Resolved')}
                                </span>
                              </div>
                            </div>

                            {/* Visitor Inquiry Message */}
                            <div className="mt-3 text-xs text-[#3D3126] leading-relaxed bg-[#FAF6F0] p-3 rounded-lg border border-[#EDE3D6]">
                              <span className="font-bold text-[#8C7A6B] block mb-1">
                                {language === 'ko' ? '문의 내용:' : 'Inquiry:'}
                              </span>
                              {inq.message}
                            </div>

                            {/* Official Admin Reply if exists */}
                            {inq.adminReply && (
                              <div className="mt-2 text-xs text-[#1E3A2F] leading-relaxed bg-emerald-50/70 p-3 rounded-lg border border-emerald-200">
                                <span className="font-bold text-emerald-800 flex items-center gap-1 mb-1">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  {language === 'ko' ? '라엘리안 상담원 공식 답변:' : 'Counselor Reply:'}
                                </span>
                                {inq.adminReply}
                              </div>
                            )}

                            {/* Inline Reply Box if open */}
                            {dashboardReplyOpenId === inq.id && (
                              <div className="mt-3 p-3 bg-white rounded-lg border-2 border-[#EA580C]/40 space-y-2">
                                <label className="block text-xs font-bold text-[#3B2F24]">
                                  {language === 'ko' ? '상담원 공식 답변 작성' : 'Write Official Reply'}
                                </label>
                                <textarea
                                  rows={3}
                                  value={replyDrafts[inq.id] || ''}
                                  onChange={e => setReplyDrafts({ ...replyDrafts, [inq.id]: e.target.value })}
                                  placeholder={language === 'ko' ? '방문자에게 전달할 답변을 작성하세요. 저장 시 자동으로 완료 처리됩니다.' : 'Type your answer here...'}
                                  className="w-full px-3 py-2 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-lg font-sans"
                                />
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setDashboardReplyOpenId(null)}
                                    className="px-2.5 py-1 text-xs text-[#7A6B5B] hover:text-[#1E1915] cursor-pointer"
                                  >
                                    {language === 'ko' ? '취소' : 'Cancel'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleSaveInquiryReplyAndNote(inq.id, inq.status);
                                      setDashboardReplyOpenId(null);
                                    }}
                                    className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-[#EA580C] hover:bg-[#D44D06] cursor-pointer flex items-center gap-1"
                                  >
                                    <Send className="w-3 h-3" />
                                    <span>{language === 'ko' ? '답변 저장 및 완료 처리' : 'Save & Resolve'}</span>
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Action Buttons for this inquiry */}
                            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F2ECE2]">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[11px] text-[#8C7A6B] mr-1">{language === 'ko' ? '빠른 상태 변경:' : 'Quick Status:'}</span>
                                {inq.status !== 'in_progress' && (
                                  <button
                                    type="button"
                                    onClick={() => handleQuickStatusChange(inq.id, 'in_progress')}
                                    className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                                  >
                                    {language === 'ko' ? '진행중으로' : 'Mark In Progress'}
                                  </button>
                                )}
                                {inq.status !== 'resolved' && (
                                  <button
                                    type="button"
                                    onClick={() => handleQuickStatusChange(inq.id, 'resolved')}
                                    className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                                  >
                                    {language === 'ko' ? '완료 처리' : 'Mark Resolved'}
                                  </button>
                                )}
                                {inq.status !== 'pending' && (
                                  <button
                                    type="button"
                                    onClick={() => handleQuickStatusChange(inq.id, 'pending')}
                                    className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
                                  >
                                    {language === 'ko' ? '대기 상태로' : 'Mark Pending'}
                                  </button>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (dashboardReplyOpenId === inq.id) {
                                      setDashboardReplyOpenId(null);
                                    } else {
                                      setDashboardReplyOpenId(inq.id);
                                      if (!replyDrafts[inq.id] && inq.adminReply) {
                                        setReplyDrafts({ ...replyDrafts, [inq.id]: inq.adminReply });
                                      }
                                    }
                                  }}
                                  className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#EA580C] bg-[#EA580C]/10 hover:bg-[#EA580C]/20 transition-colors cursor-pointer flex items-center gap-1"
                                >
                                  <MessageSquareQuote className="w-3.5 h-3.5" />
                                  <span>{inq.adminReply ? (language === 'ko' ? '답변 수정' : 'Edit Reply') : (language === 'ko' ? '즉시 답변 작성' : 'Quick Reply')}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteInquiry(inq.id, inq.name)}
                                  className="p-1 rounded-md text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="문의 삭제"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Counselor Info & Config Card */}
                  <div className="mt-4 p-4 rounded-xl bg-[#FAF6F0] border border-[#E8DFD3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#EA580C]/10 text-[#EA580C] flex items-center justify-center shrink-0">
                        <Headphones className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-[#1E1915]">
                          {chatConfig?.counselorName?.ko || '수석 라엘리안 가이드'} ({chatConfig?.counselorTitle?.ko || '24시간 안내 센터'})
                        </div>
                        <div className="text-[#7A6B5B] text-[11px] mt-0.5">
                          {language === 'ko' ? '운영 안내:' : 'Hours:'} {chatConfig?.operatingHours?.ko || '연중무휴 24시간 실시간 상담 운영'} | 직통: {chatConfig?.emergencyPhone || '010-8740-4211'}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('chat')}
                      className="px-3 py-1.5 rounded-lg border border-[#DDD0C0] bg-white text-[#524439] hover:bg-[#F2EAE0] font-semibold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                    >
                      <span>{language === 'ko' ? '상담원 설정 편집' : 'Edit Settings'}</span>
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Free eBooks Library Distribution Overview (7 Books) */}
              <div className="bg-white rounded-2xl border border-[#E5DACD] shadow-xs overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-[#F0E8DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-amber-600" />
                      <h3 className="text-base sm:text-lg font-bold text-[#1E1915] font-display">
                        {language === 'ko' ? '무료 전자책 라이브러리 배포 현황 (총 7권 전권)' : 'Free eBooks Distribution Status (7 Books)'}
                      </h3>
                    </div>
                    <p className="text-xs text-[#7A6B5B] mt-1">
                      {language === 'ko'
                        ? '홈페이지 "무료 전자책 다운로드" 섹션에 전시된 7권 도서 목록이며, PDF 및 EPUB 무료 다운로드가 100% 정상 가동 중입니다.'
                        : 'Review the 7 free eBooks available for instant download in the eBooks section.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => { setActiveTab('books'); setIsCreatingNewBook(true); }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'ko' ? '도서 추가' : 'Add Book'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('books')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-[#DDD0C0] bg-white text-[#524439] hover:bg-[#F2EAE0] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>{language === 'ko' ? '도서 전체 관리' : 'Manage eBooks'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                    {books.map((book, idx) => (
                      <div 
                        key={book.id}
                        onClick={() => {
                          setActiveTab('books');
                          handleStartEditBook(book);
                        }}
                        className="bg-[#FCFAF7] rounded-xl border border-[#EADBCC] p-2.5 hover:border-[#EA580C] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
                      >
                        <div>
                          <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#2A221B] mb-2 shadow-2xs">
                            <img 
                              src={book.coverImage} 
                              alt={book.titleKo} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            />
                            {idx >= 3 && (
                              <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-[#EA580C] text-white text-[9px] font-bold">
                                {language === 'ko' ? '신규' : 'New'}
                              </span>
                            )}
                          </div>
                          <div className="font-bold text-xs text-[#1E1915] line-clamp-1 group-hover:text-[#EA580C] transition-colors">
                            {language === 'ko' ? book.titleKo : book.titleEn}
                          </div>
                          <div className="text-[10px] text-[#8C7A6B] mt-0.5 line-clamp-1">
                            {book.author}
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-[#EDE3D6] flex items-center justify-between text-[10px]">
                          <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                            <Check className="w-3 h-3" />
                            PDF
                          </span>
                          <span className="text-[#8C7A6B]">{book.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. Quick Operations Hub */}
              <div className="bg-white rounded-2xl border border-[#E5DACD] p-5 sm:p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#EA580C]" />
                    <h3 className="text-base sm:text-lg font-bold text-[#1E1915] font-display">
                      {language === 'ko' ? '관리자 신속 제어 허브 (Quick Action Hub)' : 'Quick Action Hub'}
                    </h3>
                  </div>
                  <span className="text-xs text-[#8C7A6B]">
                    {language === 'ko' ? '자주 사용하는 관리 기능 원클릭 실행' : 'One-click shortcuts'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {/* Action 1: Chat */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('chat')}
                    className="p-4 rounded-xl border border-[#E5DACD] bg-[#FCFAF7] hover:bg-[#FAF4EC] hover:border-[#EA580C] transition-all cursor-pointer flex flex-col items-center text-center group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-[#1E1915]">
                      {language === 'ko' ? '24시간 채팅상담' : '24/7 Live Chat'}
                    </span>
                    <span className="text-[10px] text-[#8C7A6B] mt-1">
                      {language === 'ko' ? '실시간 문의 응대' : 'Answer Inquiries'}
                    </span>
                  </button>

                  {/* Action 2: Posts */}
                  <button
                    type="button"
                    onClick={() => { setActiveTab('posts'); setIsCreatingNewPost(true); }}
                    className="p-4 rounded-xl border border-[#E5DACD] bg-[#FCFAF7] hover:bg-[#FAF4EC] hover:border-[#EA580C] transition-all cursor-pointer flex flex-col items-center text-center group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-[#1E1915]">
                      {language === 'ko' ? '새 게시글 작성' : 'New Article'}
                    </span>
                    <span className="text-[10px] text-[#8C7A6B] mt-1">
                      {language === 'ko' ? '공지 및 뉴스 등록' : 'Publish News'}
                    </span>
                  </button>

                  {/* Action 3: Books */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('books')}
                    className="p-4 rounded-xl border border-[#E5DACD] bg-[#FCFAF7] hover:bg-[#FAF4EC] hover:border-[#EA580C] transition-all cursor-pointer flex flex-col items-center text-center group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-[#1E1915]">
                      {language === 'ko' ? '무료 전자책 관리' : 'Manage eBooks'}
                    </span>
                    <span className="text-[10px] text-[#8C7A6B] mt-1">
                      {language === 'ko' ? '7권 도서 및 다운로드' : '7 Free Books'}
                    </span>
                  </button>

                  {/* Action 4: Admins */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('admins')}
                    className="p-4 rounded-xl border border-[#E5DACD] bg-[#FCFAF7] hover:bg-[#FAF4EC] hover:border-[#EA580C] transition-all cursor-pointer flex flex-col items-center text-center group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-[#1E1915]">
                      {language === 'ko' ? '관리자 팀 & 초대' : 'Admin Team'}
                    </span>
                    <span className="text-[10px] text-[#8C7A6B] mt-1">
                      {language === 'ko' ? '운영자 권한 설정' : 'Invites & Roles'}
                    </span>
                  </button>

                  {/* Action 5: Theme */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('theme')}
                    className="p-4 rounded-xl border border-[#E5DACD] bg-[#FCFAF7] hover:bg-[#FAF4EC] hover:border-[#EA580C] transition-all cursor-pointer flex flex-col items-center text-center group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Palette className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-[#1E1915]">
                      {language === 'ko' ? '디자인 & 테마' : 'Theme Settings'}
                    </span>
                    <span className="text-[10px] text-[#8C7A6B] mt-1">
                      {language === 'ko' ? '컬러 및 스타일' : 'Visual Branding'}
                    </span>
                  </button>

                  {/* Action 6: Backup */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('backup')}
                    className="p-4 rounded-xl border border-[#E5DACD] bg-[#FCFAF7] hover:bg-[#FAF4EC] hover:border-[#EA580C] transition-all cursor-pointer flex flex-col items-center text-center group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Database className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-[#1E1915]">
                      {language === 'ko' ? '백업 & 초기화' : 'Backup & Reset'}
                    </span>
                    <span className="text-[10px] text-[#8C7A6B] mt-1">
                      {language === 'ko' ? 'JSON 백업 내보내기' : 'JSON Export'}
                    </span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 1: POST MANAGEMENT */}
          {activeTab === 'posts' && (
            <div>
              {/* Show Post Editor if creating or editing */}
              {(isCreatingNewPost || editingPost) ? (
                <form onSubmit={handleSavePost} className="bg-white rounded-xl border border-[#DDD0C0] p-6 space-y-5 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#EAE0D3] pb-3">
                    <h3 className="text-base font-bold text-[#1E1915] font-display">
                      {editingPost 
                        ? (language === 'ko' ? '게시글 수정' : 'Edit Article') 
                        : (language === 'ko' ? '새 게시글 작성' : 'Create New Article')}
                    </h3>
                    <button
                      type="button"
                      onClick={() => { setIsCreatingNewPost(false); setEditingPost(null); }}
                      className="text-xs text-[#7A6B5B] hover:text-[#1E1915] cursor-pointer"
                    >
                      {language === 'ko' ? '취소하고 목록으로' : 'Cancel'}
                    </button>
                  </div>

                  {/* Title Fields (KO & EN) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                        제목 (한국어) *
                      </label>
                      <input
                        type="text"
                        required
                        value={postForm.titleKo}
                        onChange={e => setPostForm({ ...postForm, titleKo: e.target.value })}
                        placeholder="예: 부탄 팀푸 엘로힘 대사관 유치 세미나"
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                        Title (English) *
                      </label>
                      <input
                        type="text"
                        required
                        value={postForm.titleEn}
                        onChange={e => setPostForm({ ...postForm, titleEn: e.target.value })}
                        placeholder="e.g. Bhutan Thimphu Elohim Embassy Seminar"
                        className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/40"
                      />
                    </div>
                  </div>

                  {/* Category, Status, Author, Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                        카테고리
                      </label>
                      <select
                        value={postForm.category}
                        onChange={e => setPostForm({ ...postForm, category: e.target.value as PostCategory })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl focus:bg-white focus:outline-none"
                      >
                        <option value="announcement">공지사항 (Announcement)</option>
                        <option value="science">지적설계 & 과학 (Science)</option>
                        <option value="philosophy">철학 & 명상 (Philosophy)</option>
                        <option value="embassy">외계인 대사관 (Embassy)</option>
                        <option value="event">행사 & 세미나 (Event)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                        공개 상태
                      </label>
                      <select
                        value={postForm.status}
                        onChange={e => setPostForm({ ...postForm, status: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl focus:bg-white focus:outline-none"
                      >
                        <option value="published">게시됨 (Published)</option>
                        <option value="draft">임시저장 (Draft)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                        작성자 (Author)
                      </label>
                      <input
                        type="text"
                        value={postForm.author}
                        onChange={e => setPostForm({ ...postForm, author: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                        작성일 (Date)
                      </label>
                      <input
                        type="date"
                        value={postForm.date}
                        onChange={e => setPostForm({ ...postForm, date: e.target.value })}
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Summary (KO & EN) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                        한 줄 요약 (한국어)
                      </label>
                      <textarea
                        rows={2}
                        value={postForm.summaryKo}
                        onChange={e => setPostForm({ ...postForm, summaryKo: e.target.value })}
                        placeholder="목록 카드에 표시될 요약글..."
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                        Short Summary (English)
                      </label>
                      <textarea
                        rows={2}
                        value={postForm.summaryEn}
                        onChange={e => setPostForm({ ...postForm, summaryEn: e.target.value })}
                        placeholder="Brief summary shown on cards..."
                        className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Content (KO & EN) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                        본문 내용 (한국어) *
                      </label>
                      <textarea
                        rows={8}
                        required
                        value={postForm.contentKo}
                        onChange={e => setPostForm({ ...postForm, contentKo: e.target.value })}
                        placeholder="상세 본문 내용을 입력하세요 (줄바꿈 지원)..."
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl focus:bg-white focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                        Body Content (English) *
                      </label>
                      <textarea
                        rows={8}
                        required
                        value={postForm.contentEn}
                        onChange={e => setPostForm({ ...postForm, contentEn: e.target.value })}
                        placeholder="Detailed body content in English..."
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl focus:bg-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Cover Image Upload & Tags */}
                  <div className="space-y-4">
                    <ImageUploader
                      id="post-cover-image-uploader"
                      label={language === 'ko' ? '게시글 대표 커버 이미지 (파일 직접 업로드)' : 'Article Cover Image (Upload File)'}
                      helperText={language === 'ko' ? '기기에서 이미지 파일을 드래그하여 올려놓거나 클릭하여 선택하세요. (자동 최적화)' : 'Drag and drop or click to upload an image from your device (Auto-optimized).'}
                      recommendedSize="1200 × 750px 권장"
                      value={postForm.coverImage}
                      onChange={(newImg) => setPostForm({ ...postForm, coverImage: newImg })}
                      language={language}
                      aspectRatio="wide"
                      defaultValue="https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&auto=format&fit=crop&q=80"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                          태그 (쉼표로 구분)
                        </label>
                        <input
                          type="text"
                          value={postForm.tags}
                          onChange={e => setPostForm({ ...postForm, tags: e.target.value })}
                          placeholder="부탄, 엘로힘, 세미나, 평화"
                          className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl focus:bg-white focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#4A3D31] mt-2 sm:mt-0">
                          <input
                            type="checkbox"
                            checked={postForm.isFeatured}
                            onChange={e => setPostForm({ ...postForm, isFeatured: e.target.checked })}
                            className="rounded text-[#EA580C] focus:ring-[#EA580C]"
                          />
                          <span>메인 상단 추천글로 고정 (Featured Article)</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-3 border-t border-[#EAE0D3]">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs cursor-pointer"
                      style={{ backgroundColor: theme.accentColor }}
                    >
                      <Check className="w-4 h-4" />
                      <span>{editingPost ? (language === 'ko' ? '수정사항 저장' : 'Save Changes') : (language === 'ko' ? '게시글 등록하기' : 'Publish Article')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsCreatingNewPost(false); setEditingPost(null); }}
                      className="px-4 py-2.5 rounded-xl bg-[#EFE8DC] text-[#4A3D31] font-semibold text-xs sm:text-sm cursor-pointer"
                    >
                      {language === 'ko' ? '취소' : 'Cancel'}
                    </button>
                  </div>
                </form>
              ) : (
                /* Post Table List */
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-[#1E1915] font-display">
                        {language === 'ko' ? '등록된 게시글 목록' : 'Published Articles'}
                      </h3>
                      <p className="text-xs text-[#7A6B5B]">
                        {language === 'ko' ? '신규 관리자는 자신이 작성한 글을 자유롭게 수정 및 삭제할 수 있습니다.' : 'Admins can edit and delete articles authored by themselves.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Filter Toggle */}
                      <div className="flex items-center bg-[#EFE8DC] p-0.5 rounded-xl border border-[#DDD0C0] text-xs">
                        <button
                          type="button"
                          onClick={() => setPostAuthorFilter('all')}
                          className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                            postAuthorFilter === 'all'
                              ? 'bg-white text-[#1E1915] shadow-xs'
                              : 'text-[#6A5A4A] hover:text-[#1E1915]'
                          }`}
                        >
                          {language === 'ko' ? '전체 글' : 'All'} ({posts.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setPostAuthorFilter('mine')}
                          className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                            postAuthorFilter === 'mine'
                              ? 'bg-[#EA580C] text-white shadow-xs'
                              : 'text-[#6A5A4A] hover:text-[#1E1915]'
                          }`}
                        >
                          <span>{language === 'ko' ? '내가 작성한 글' : 'My Posts'}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                            {posts.filter(p => p.authorId === currentAdmin?.id || p.authorEmail?.toLowerCase() === currentAdmin?.email.toLowerCase() || p.author === currentAdmin?.name).length}
                          </span>
                        </button>
                      </div>

                      <button
                        onClick={handleStartCreatePost}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-xs cursor-pointer whitespace-nowrap"
                        style={{ backgroundColor: theme.accentColor }}
                      >
                        <Plus className="w-4 h-4" />
                        <span>{language === 'ko' ? '새 글 작성' : 'New Article'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-[#DDD0C0] overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-[#F6F0E7] border-b border-[#DDD0C0] text-[#635343] font-bold">
                            <th className="py-3 px-4">제목 (Title)</th>
                            <th className="py-3 px-4">카테고리</th>
                            <th className="py-3 px-4">작성자 (Author)</th>
                            <th className="py-3 px-4">날짜</th>
                            <th className="py-3 px-4">상태</th>
                            <th className="py-3 px-4 text-right">수정 / 삭제</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EFE7DC]">
                          {posts
                            .filter(post => {
                              if (postAuthorFilter === 'mine') {
                                return (
                                  post.authorId === currentAdmin?.id ||
                                  (post.authorEmail && currentAdmin?.email && post.authorEmail.toLowerCase() === currentAdmin.email.toLowerCase()) ||
                                  post.author === currentAdmin?.name
                                );
                              }
                              return true;
                            })
                            .map(post => {
                              const isMyPost =
                                post.authorId === currentAdmin?.id ||
                                (post.authorEmail && currentAdmin?.email && post.authorEmail.toLowerCase() === currentAdmin.email.toLowerCase()) ||
                                post.author === currentAdmin?.name;
                              const userCanEdit = canEditPost(post);
                              const userCanDelete = canDeletePost(post);

                              return (
                                <tr key={post.id} className={`hover:bg-[#FCFAF7] transition-colors ${isMyPost ? 'bg-amber-50/20' : ''}`}>
                                  <td className="py-3 px-4 font-semibold text-[#1E1915] max-w-xs">
                                    <div className="truncate">{post.title[language] || post.title.ko}</div>
                                    {post.summary && (
                                      <div className="text-[11px] text-[#8C7A68] truncate font-normal">
                                        {post.summary[language] || post.summary.ko}
                                      </div>
                                    )}
                                  </td>
                                  <td className="py-3 px-4 text-[#7A6A5A]">
                                    <span className="px-2 py-0.5 rounded-sm bg-[#F0E7DB] text-[11px] font-medium">
                                      {post.category}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-[#5A4B3C]">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-semibold">{post.author}</span>
                                      {isMyPost && (
                                        <span className="px-1.5 py-0.2 rounded-sm text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                          {language === 'ko' ? '내 글' : 'Mine'}
                                        </span>
                                      )}
                                    </div>
                                    {post.authorEmail && (
                                      <div className="text-[10px] text-[#A08E7E] font-mono">{post.authorEmail}</div>
                                    )}
                                  </td>
                                  <td className="py-3 px-4 text-[#7A6A5A] font-mono text-[11px]">
                                    {post.date}
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      post.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                                    }`}>
                                      {post.status}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                                    {userCanEdit ? (
                                      <button
                                        onClick={() => handleStartEditPost(post)}
                                        className="p-1.5 rounded-md hover:bg-[#F0E7DC] text-[#483B2F] transition-colors cursor-pointer inline-flex items-center gap-1 text-xs"
                                        title={language === 'ko' ? '수정' : 'Edit'}
                                      >
                                        <Edit className="w-3.5 h-3.5" />
                                        <span className="hidden md:inline">{language === 'ko' ? '수정' : 'Edit'}</span>
                                      </button>
                                    ) : (
                                      <span
                                        className="p-1.5 rounded-md text-stone-400 inline-flex items-center gap-1 text-xs cursor-not-allowed"
                                        title={language === 'ko' ? `작성자(${post.author}) 또는 최고 관리자만 수정 가능합니다.` : 'Only author or super admin can edit.'}
                                      >
                                        <Lock className="w-3 h-3" />
                                        <span className="hidden md:inline text-[10px] text-stone-400">잠김</span>
                                      </span>
                                    )}

                                    {userCanDelete ? (
                                      <button
                                        onClick={() => handleDeletePost(post.id, post.title[language] || post.title.ko)}
                                        className="p-1.5 rounded-md hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer inline-flex items-center gap-1 text-xs"
                                        title={language === 'ko' ? '삭제' : 'Delete'}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span className="hidden md:inline">{language === 'ko' ? '삭제' : 'Delete'}</span>
                                      </button>
                                    ) : (
                                      <span
                                        className="p-1.5 rounded-md text-stone-400 inline-flex items-center gap-1 text-xs cursor-not-allowed"
                                        title={language === 'ko' ? `작성자(${post.author}) 또는 최고 관리자만 삭제 가능합니다.` : 'Only author or super admin can delete.'}
                                      >
                                        <Lock className="w-3 h-3" />
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: ADMIN TEAM & INVITATIONS */}
          {activeTab === 'admins' && (
            <AdminManagementTab onNotification={showNotification} />
          )}

          {/* TAB 2: MAIN PAGE CONTENT */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#1E1915] font-display">
                    {language === 'ko' ? '메인페이지 콘텐츠 편집' : 'Edit Main Page Content'}
                  </h3>
                  <p className="text-xs text-[#7A6B5B]">
                    {language === 'ko' ? '홈페이지 헤더, 메인 슬로건, 대사관 섹션 텍스트 및 이미지를 실시간으로 변경합니다.' : 'Update hero headlines, subtitles, and section text in both Korean and English.'}
                  </p>
                </div>

                <button
                  onClick={() => showNotification(language === 'ko' ? '콘텐츠 변경사항이 저장되었습니다.' : 'Content updated.')}
                  className="px-4 py-2 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-xs cursor-pointer"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  {language === 'ko' ? '변경사항 저장' : 'Save Changes'}
                </button>
              </div>

              {/* Hero Section Box */}
              <div className="bg-white rounded-xl border border-[#DDD0C0] p-6 space-y-4">
                <h4 className="text-sm font-bold text-[#1E1915] uppercase tracking-wider text-[#EA580C]">
                  1. 히어로 섹션 (Hero Section)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                      배지 텍스트 (한국어)
                    </label>
                    <input
                      type="text"
                      value={content.hero.badge.ko}
                      onChange={e => updateContent({ hero: { ...content.hero, badge: { ...content.hero.badge, ko: e.target.value } } })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                      Badge Text (English)
                    </label>
                    <input
                      type="text"
                      value={content.hero.badge.en}
                      onChange={e => updateContent({ hero: { ...content.hero, badge: { ...content.hero.badge, en: e.target.value } } })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                      메인 헤드라인 (한국어)
                    </label>
                    <textarea
                      rows={2}
                      value={content.hero.title.ko}
                      onChange={e => updateContent({ hero: { ...content.hero, title: { ...content.hero.title, ko: e.target.value } } })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                      Main Headline (English)
                    </label>
                    <textarea
                      rows={2}
                      value={content.hero.title.en}
                      onChange={e => updateContent({ hero: { ...content.hero, title: { ...content.hero.title, en: e.target.value } } })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                      보조 설명문 (한국어)
                    </label>
                    <textarea
                      rows={3}
                      value={content.hero.subtitle.ko}
                      onChange={e => updateContent({ hero: { ...content.hero, subtitle: { ...content.hero.subtitle, ko: e.target.value } } })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                      Subtitle (English)
                    </label>
                    <textarea
                      rows={3}
                      value={content.hero.subtitle.en}
                      onChange={e => updateContent({ hero: { ...content.hero, subtitle: { ...content.hero.subtitle, en: e.target.value } } })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <ImageUploader
                    id="hero-image-uploader"
                    label={language === 'ko' ? '히어로 메인 비주얼 이미지 (파일 직접 업로드)' : 'Main Hero Image (Upload File)'}
                    helperText={language === 'ko' ? '홈페이지 첫 화면 상단 우측 카드에 표시될 메인 이미지를 드래그하거나 선택하여 업로드하세요.' : 'Upload the primary image shown in the hero card on the homepage.'}
                    recommendedSize="1600 × 1000px 권장"
                    value={content.hero.heroImage}
                    onChange={(newImg) => updateContent({ hero: { ...content.hero, heroImage: newImg } })}
                    language={language}
                    aspectRatio="wide"
                    defaultValue="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80"
                  />
                </div>
              </div>

              {/* Embassy Section Box */}
              <div className="bg-white rounded-xl border border-[#DDD0C0] p-6 space-y-4">
                <h4 className="text-sm font-bold text-[#1E1915] uppercase tracking-wider text-[#EA580C]">
                  2. 외계인 대사관 섹션 (Embassy Section)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                      대사관 섹션 제목 (한국어)
                    </label>
                    <input
                      type="text"
                      value={content.embassy.title.ko}
                      onChange={e => updateContent({ embassy: { ...content.embassy, title: { ...content.embassy.title, ko: e.target.value } } })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                      Embassy Title (English)
                    </label>
                    <input
                      type="text"
                      value={content.embassy.title.en}
                      onChange={e => updateContent({ embassy: { ...content.embassy, title: { ...content.embassy.title, en: e.target.value } } })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                      대사관 설명문 (한국어)
                    </label>
                    <textarea
                      rows={3}
                      value={content.embassy.description.ko}
                      onChange={e => updateContent({ embassy: { ...content.embassy, description: { ...content.embassy.description, ko: e.target.value } } })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                      Embassy Description (English)
                    </label>
                    <textarea
                      rows={3}
                      value={content.embassy.description.en}
                      onChange={e => updateContent({ embassy: { ...content.embassy, description: { ...content.embassy.description, en: e.target.value } } })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <ImageUploader
                    id="embassy-image-uploader"
                    label={language === 'ko' ? '대사관 조감도 / 건축 모델 이미지 (파일 직접 업로드)' : 'Embassy Architectural Concept Image (Upload File)'}
                    helperText={language === 'ko' ? '엘로힘 대사관 프로젝트 섹션에 노출될 조감도나 모델 이미지를 업로드하세요.' : 'Upload the 3D model or blueprint image for the Extraterrestrial Embassy.'}
                    recommendedSize="1200 × 800px 권장"
                    value={content.embassy.embassyImage}
                    onChange={(newImg) => updateContent({ embassy: { ...content.embassy, embassyImage: newImg } })}
                    language={language}
                    aspectRatio="wide"
                    defaultValue="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80"
                  />
                </div>
              </div>

              {/* About Section Box */}
              <div className="bg-white rounded-xl border border-[#DDD0C0] p-6 space-y-4">
                <h4 className="text-sm font-bold text-[#1E1915] uppercase tracking-wider text-[#EA580C]">
                  3. 무브먼트 소개 섹션 이미지 (About Movement Section)
                </h4>
                <div className="pt-1">
                  <ImageUploader
                    id="about-image-uploader"
                    label={language === 'ko' ? '무브먼트 소개 대표 사진 (파일 직접 업로드)' : 'About Movement Section Image (Upload File)'}
                    helperText={language === 'ko' ? '인류의 기원과 라엘리안 철학 소개 섹션 좌측에 표시될 이미지를 업로드하세요.' : 'Upload the representative image displayed in the About movement section.'}
                    recommendedSize="1000 × 800px 권장"
                    value={content.about.aboutImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&auto=format&fit=crop&q=80'}
                    onChange={(newImg) => updateContent({ about: { ...content.about, aboutImage: newImg } })}
                    language={language}
                    aspectRatio="wide"
                    defaultValue="https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&auto=format&fit=crop&q=80"
                  />
                </div>
              </div>

              {/* Contact & Inquiries Box */}
              <div className="bg-white rounded-xl border border-[#DDD0C0] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#1E1915] uppercase tracking-wider text-[#EA580C]">
                    4. 온라인 메시지 수신 이메일 및 문의처 설정 (Contact & Inquiry Email)
                  </h4>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-orange-100 text-[#C2410C] font-semibold">
                    연동 이메일: {content.contact.email || 'navihan01@gmail.com'}
                  </span>
                </div>

                <p className="text-xs text-[#6B5A4B]">
                  {language === 'ko'
                    ? '방문자가 홈페이지 하단의 [온라인 메시지 보내기] 양식을 통해 문의를 발송하면 아래 수신 이메일 주소로 실시간 전달됩니다.'
                    : 'Online inquiries submitted on the homepage will be delivered directly to the designated email address below.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                      {language === 'ko' ? '온라인 문의 수신 이메일 (Recipient Email) *' : 'Inquiry Recipient Email *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={content.contact.email}
                      onChange={e => updateContent({ contact: { ...content.contact, email: e.target.value } })}
                      placeholder="navihan01@gmail.com"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl font-medium"
                    />
                    <p className="text-[11px] text-[#8C7A68] mt-1">
                      현재 설정: <strong className="text-[#EA580C]">{content.contact.email || 'navihan01@gmail.com'}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                      {language === 'ko' ? '안내 데스크 전화번호 (Phone)' : 'Contact Phone'}
                    </label>
                    <input
                      type="text"
                      value={content.contact.phone}
                      onChange={e => updateContent({ contact: { ...content.contact, phone: e.target.value } })}
                      placeholder="+975 2 321 000 / +82 10 0000 0000"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                      {language === 'ko' ? '주소 (Address - 한글)' : 'Address (Korean)'}
                    </label>
                    <input
                      type="text"
                      value={content.contact.address.ko}
                      onChange={e => updateContent({
                        contact: {
                          ...content.contact,
                          address: { ...content.contact.address, ko: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                      {language === 'ko' ? '주소 (Address - 영문)' : 'Address (English)'}
                    </label>
                    <input
                      type="text"
                      value={content.contact.address.en}
                      onChange={e => updateContent({
                        contact: {
                          ...content.contact,
                          address: { ...content.contact.address, en: e.target.value }
                        }
                      })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* 5 Core Pillars Section Box */}
              <div className="bg-white rounded-xl border border-[#DDD0C0] p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#1E1915] uppercase tracking-wider text-[#EA580C] flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span>5. 라엘리안 무브먼트 5대 핵심 철학 기둥 (5 Core Philosophy Pillars)</span>
                    </h4>
                    <p className="text-xs text-[#7A6B5B] mt-1">
                      {language === 'ko'
                        ? '생명창조(DNA), 아포칼립스, 예언자, 엘로힘, 대사관 5개 핵심 철학의 상세 내용과 Pillar 05 대사관을 전용 탭에서 손쉽게 수정 및 관리할 수 있습니다.'
                        : 'Manage all 5 core philosophy pillars including Pillar 05 Extraterrestrial Embassy.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('philosophy')}
                    className="px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{language === 'ko' ? '5대 핵심 철학 전용 관리탭 이동' : 'Go to 5 Pillars Tab'}</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB: PHILOSOPHY 5 PILLARS */}
          {activeTab === 'philosophy' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD3] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EA580C]/10 text-[#EA580C] uppercase tracking-wider">
                      5 Core Pillars
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#1E1915] font-display">
                      {language === 'ko' ? '라엘리안 무브먼트 5대 핵심 철학 기둥 관리' : '5 Core Philosophy Pillars Management'}
                    </h3>
                  </div>
                  <p className="text-xs text-[#7A6B5B] mt-1">
                    {language === 'ko'
                      ? '메인 화면에 노출되는 5가지 핵심 철학(기둥 01~05)의 한글/영문 제목, 슬로건, 핵심 설명 포인트 및 이미지를 자유롭게 수정하고 실시간 저장합니다.'
                      : 'Edit titles, taglines, bullet points, and images for all 5 core philosophy pillars.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (window.confirm(language === 'ko' ? '5대 철학 내용을 기본값으로 초기화하시겠습니까?' : 'Reset all 5 pillars to default values?')) {
                        updatePhilosophyPillars(defaultPhilosophyPillars);
                        showNotification(language === 'ko' ? '5대 철학 기둥이 기본값으로 초기화되었습니다.' : 'Pillars reset to default.');
                      }
                    }}
                    className="px-3 py-2 rounded-xl border border-[#DDD0C0] text-[#6B5A4A] hover:bg-[#F2EAE0] text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {language === 'ko' ? '기본값 복원' : 'Reset Defaults'}
                  </button>
                  <button
                    onClick={() => showNotification(language === 'ko' ? '5대 핵심 철학 기둥 내용이 안전하게 저장되었습니다.' : 'All 5 pillars saved successfully.')}
                    className="px-4 py-2 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    <Check className="w-4 h-4" />
                    <span>{language === 'ko' ? '전체 저장 완료' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>

              {/* Pillars list */}
              <div className="space-y-6">
                {(philosophyPillars || defaultPhilosophyPillars).map((pillar, idx) => (
                  <div
                    key={pillar.id}
                    className="bg-white rounded-2xl border border-[#DDD0C0] p-5 sm:p-6 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-3">
                      <div className="flex items-center gap-3">
                        <span 
                          className="w-7 h-7 rounded-lg text-white text-xs font-bold flex items-center justify-center shadow-xs"
                          style={{ backgroundColor: theme.accentColor }}
                        >
                          0{idx + 1}
                        </span>
                        <div>
                          <h4 className="text-sm sm:text-base font-bold text-[#1E1915]">
                            {pillar.title.ko}
                          </h4>
                          <span className="text-[11px] text-[#8C7A68]">
                            ID: {pillar.id} | {pillar.title.en}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#FAF4ED] text-[#EA580C] border border-[#EEDFCE]">
                        Pillar 0{idx + 1}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                          기둥 제목 (한국어) *
                        </label>
                        <input
                          type="text"
                          value={pillar.title.ko}
                          onChange={(e) => {
                            const updated = { ...pillar, title: { ...pillar.title, ko: e.target.value } };
                            updatePillar(updated);
                          }}
                          className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                          Title (English) *
                        </label>
                        <input
                          type="text"
                          value={pillar.title.en}
                          onChange={(e) => {
                            const updated = { ...pillar, title: { ...pillar.title, en: e.target.value } };
                            updatePillar(updated);
                          }}
                          className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                          핵심 슬로건 / 부제 (한국어)
                        </label>
                        <input
                          type="text"
                          value={pillar.tagline.ko}
                          onChange={(e) => {
                            const updated = { ...pillar, tagline: { ...pillar.tagline, ko: e.target.value } };
                            updatePillar(updated);
                          }}
                          className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                          Tagline / Subtitle (English)
                        </label>
                        <input
                          type="text"
                          value={pillar.tagline.en}
                          onChange={(e) => {
                            const updated = { ...pillar, tagline: { ...pillar.tagline, en: e.target.value } };
                            updatePillar(updated);
                          }}
                          className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                          세부 핵심 포인트 목록 (한국어 - 여러 문장은 줄바꿈으로 구분)
                        </label>
                        <textarea
                          rows={4}
                          value={pillar.points.ko.join('\n')}
                          onChange={(e) => {
                            const newLines = e.target.value.split('\n').filter(Boolean);
                            const updated = { ...pillar, points: { ...pillar.points, ko: newLines } };
                            updatePillar(updated);
                          }}
                          placeholder="줄바꿈으로 포인트를 구분하여 입력하세요."
                          className="w-full px-3 py-2 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl leading-relaxed font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                          Key Bullet Points (English - Line separated)
                        </label>
                        <textarea
                          rows={4}
                          value={pillar.points.en.join('\n')}
                          onChange={(e) => {
                            const newLines = e.target.value.split('\n').filter(Boolean);
                            const updated = { ...pillar, points: { ...pillar.points, en: newLines } };
                            updatePillar(updated);
                          }}
                          placeholder="Separate points with new lines."
                          className="w-full px-3 py-2 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl leading-relaxed font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <ImageUploader
                        id={`pillar-${pillar.id}-image-uploader`}
                        label={`${language === 'ko' ? '기둥 대표 배경 이미지' : 'Pillar Background Image'} (${pillar.title.ko})`}
                        helperText={language === 'ko' ? '카드 상단에 표시될 고화질 이미지를 드래그하거나 선택하여 업로드하세요.' : 'Upload background image for this pillar card.'}
                        recommendedSize="800 × 500px 권장"
                        value={pillar.image}
                        onChange={(newImg) => {
                          const updated = { ...pillar, image: newImg };
                          updatePillar(updated);
                          showNotification(`${pillar.title.ko} 이미지가 변경되었습니다.`);
                        }}
                        language={language}
                        aspectRatio="wide"
                        defaultValue={pillar.image}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FREE EBOOKS MANAGEMENT */}
          {activeTab === 'books' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD3] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EA580C]/10 text-[#EA580C] uppercase tracking-wider">
                      eBook Library ({books.length} Books)
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#1E1915] font-display">
                      {language === 'ko' ? '라엘리안 공식 무료 전자책 라이브러리 관리' : 'Official Free eBook Library Management'}
                    </h3>
                  </div>
                  <p className="text-xs text-[#7A6B5B] mt-1">
                    {language === 'ko'
                      ? '메인 페이지의 무료 전자책 섹션에 노출되는 도서(인간복제, 각성으로의 여행 1/2, 하늘에서 온 사람들 만화 등)의 정보, PDF 다운로드 링크 및 표지를 관리합니다.'
                      : 'Manage free downloadable eBooks displayed on the main site, including PDF links, page counts, and book covers.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (window.confirm(language === 'ko' ? '공식 7권 기본 도서 목록으로 초기화하시겠습니까?' : 'Restore official 7 default eBooks?')) {
                        resetBooksToDefault();
                        showNotification(language === 'ko' ? '공식 7권 기본 도서 목록이 복원되었습니다.' : 'Default 7 eBooks restored.');
                      }
                    }}
                    className="px-3 py-2 rounded-xl border border-[#DDD0C0] text-[#6B5A4A] hover:bg-[#F2EAE0] text-xs font-semibold cursor-pointer transition-colors"
                  >
                    {language === 'ko' ? '기본 7권 복원' : 'Restore Defaults'}
                  </button>

                  <button
                    onClick={handleStartCreateBook}
                    className="px-4 py-2 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>{language === 'ko' ? '새 도서 등록' : 'Add eBook'}</span>
                  </button>
                </div>
              </div>

              {/* Add / Edit Form Modal or Panel */}
              {(isCreatingNewBook || editingBook) && (
                <div className="bg-white rounded-2xl border-2 border-[#EA580C]/40 p-5 sm:p-6 shadow-md space-y-4 animate-in fade-in-50 duration-150">
                  <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
                      <h4 className="text-sm sm:text-base font-bold text-[#1E1915]">
                        {editingBook
                          ? (language === 'ko' ? `도서 정보 수정: ${editingBook.title.ko}` : `Edit eBook: ${editingBook.title.en}`)
                          : (language === 'ko' ? '새로운 전자책 등록' : 'Add New eBook')}
                      </h4>
                    </div>
                    <button
                      onClick={() => { setEditingBook(null); setIsCreatingNewBook(false); }}
                      className="text-xs text-[#7A6B5B] hover:text-[#1E1915] cursor-pointer"
                    >
                      {language === 'ko' ? '취소 (닫기)' : 'Cancel'}
                    </button>
                  </div>

                  <form onSubmit={handleSaveBook} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                          도서명 (한국어) *
                        </label>
                        <input
                          type="text"
                          required
                          value={bookForm.titleKo}
                          onChange={(e) => setBookForm({ ...bookForm, titleKo: e.target.value })}
                          placeholder="예: 인간복제 (Yes to Human Cloning)"
                          className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                          Book Title (English) *
                        </label>
                        <input
                          type="text"
                          required
                          value={bookForm.titleEn}
                          onChange={(e) => setBookForm({ ...bookForm, titleEn: e.target.value })}
                          placeholder="Ex: Yes to Human Cloning"
                          className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                          저자 (Author) *
                        </label>
                        <input
                          type="text"
                          required
                          value={bookForm.author}
                          onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                          className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                            페이지 수
                          </label>
                          <input
                            type="number"
                            value={bookForm.pageCount}
                            onChange={(e) => setBookForm({ ...bookForm, pageCount: Number(e.target.value) || 100 })}
                            className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                            지원 언어 (쉼표 구분)
                          </label>
                          <input
                            type="text"
                            value={bookForm.languages}
                            onChange={(e) => setBookForm({ ...bookForm, languages: e.target.value })}
                            placeholder="한국어, English, Français"
                            className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                          무료 PDF 다운로드 링크 (URL) *
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="url"
                            required
                            value={bookForm.downloadUrl}
                            onChange={(e) => setBookForm({ ...bookForm, downloadUrl: e.target.value })}
                            placeholder="https://www.rael.org/books/..."
                            className="flex-1 px-3 py-2 text-xs font-mono bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                          />
                          {bookForm.downloadUrl && (
                            <a
                              href={bookForm.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-200 flex items-center gap-1 shrink-0"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>열기 테스트</span>
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <ImageUploader
                          id="admin-book-cover-uploader"
                          label={language === 'ko' ? '도서 표지 이미지' : 'Book Cover Image'}
                          helperText={language === 'ko' ? '도서 표지 고화질 이미지를 업로드하거나 URL을 입력하세요.' : 'Upload or provide book cover image.'}
                          recommendedSize="세로형 600 × 800px 권장"
                          value={bookForm.coverImage}
                          onChange={(newImg) => setBookForm({ ...bookForm, coverImage: newImg })}
                          language={language}
                          aspectRatio="square"
                          defaultValue={bookForm.coverImage}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                          도서 소개 요약 (한국어)
                        </label>
                        <textarea
                          rows={3}
                          value={bookForm.descKo}
                          onChange={(e) => setBookForm({ ...bookForm, descKo: e.target.value })}
                          placeholder="도서에 대한 핵심 소개글을 작성하세요..."
                          className="w-full px-3 py-2 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                          Description (English)
                        </label>
                        <textarea
                          rows={3}
                          value={bookForm.descEn}
                          onChange={(e) => setBookForm({ ...bookForm, descEn: e.target.value })}
                          placeholder="Book description in English..."
                          className="w-full px-3 py-2 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl leading-relaxed"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0E8DC]">
                      <button
                        type="button"
                        onClick={() => { setEditingBook(null); setIsCreatingNewBook(false); }}
                        className="px-4 py-2 rounded-xl border border-[#DDD0C0] text-xs font-semibold text-[#665544] hover:bg-[#F2EAE0] cursor-pointer"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
                        style={{ backgroundColor: theme.accentColor }}
                      >
                        <Check className="w-4 h-4" />
                        <span>{editingBook ? '도서 정보 수정 저장' : '새 도서 등록 완료'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Books List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {books.map((book, idx) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-2xl border border-[#DDD0C0] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-[#EA580C]/40 transition-all gap-4"
                  >
                    <div className="flex gap-4">
                      {/* Cover Thumbnail */}
                      <div className="w-20 h-28 rounded-lg overflow-hidden bg-stone-100 border border-[#DDD0C0] shrink-0 shadow-xs relative">
                        <img
                          src={book.coverImage}
                          alt={book.title.ko}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
                          }}
                        />
                        <span className="absolute bottom-1 right-1 text-[9px] bg-black/70 text-white px-1 rounded font-bold">
                          0{idx + 1}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wide">
                            {book.author}
                          </span>
                          <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-semibold shrink-0">
                            {book.pageCount}쪽
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-[#1E1915] leading-snug line-clamp-1">
                          {book.title.ko}
                        </h4>
                        <p className="text-[11px] text-[#7A6B5B] line-clamp-1">
                          {book.title.en}
                        </p>

                        <p className="text-xs text-[#55473A] line-clamp-2 leading-relaxed pt-1">
                          {book.description.ko}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-3 border-t border-[#F2ECE2] flex items-center justify-between gap-2 text-xs">
                      <a
                        href={book.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#EA580C] hover:underline font-mono truncate flex items-center gap-1 max-w-[200px] sm:max-w-[240px]"
                        title={book.downloadUrl}
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{book.downloadUrl}</span>
                      </a>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEditBook(book)}
                          className="px-2.5 py-1 rounded-lg border border-[#DDD0C0] text-[#4A3D30] hover:bg-[#FAF7F2] text-xs font-semibold cursor-pointer flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          <span>수정</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBook(book.id, book.title.ko)}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* TAB: 24/7 LIVE CHAT & INQUIRIES MANAGEMENT */}
          {activeTab === 'chat' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD3] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EA580C]/10 text-[#EA580C] uppercase tracking-wider flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      24/7 Live Consultation
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#1E1915] font-display">
                      {language === 'ko' ? '24시간 채팅상담 & 접수 문의 관리' : '24/7 Live Chat & Inquiries Dashboard'}
                    </h3>
                  </div>
                  <p className="text-xs text-[#7A6B5B] mt-1">
                    {language === 'ko'
                      ? '웹사이트 우측 하단 24시간 상담 위젯을 통해 접수된 실시간 상담 내역을 확인하고 답변 상태를 관리하며, 상담원 프로필 및 자동 응답 설정을 구성합니다.'
                      : 'Review customer inquiries from the persistent 24/7 floating chat widget, manage response statuses, and customize counselor settings.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsAddingManualInquiry(true)}
                    className="px-3 py-2 rounded-xl text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'ko' ? '상담 직접 등록' : 'New Inquiry'}</span>
                  </button>

                  <button
                    onClick={handleExportInquiries}
                    className="px-3 py-2 rounded-xl border border-[#DDD0C0] text-[#6B5A4A] hover:bg-[#F2EAE0] text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
                    title="JSON 백업"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{language === 'ko' ? '백업 내보내기' : 'Export'}</span>
                  </button>

                  {chatInquiries.length > 0 && (
                    <button
                      onClick={handleClearAllInquiries}
                      className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{language === 'ko' ? '전체 초기화' : 'Clear All'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl border border-[#E5DACD] p-3.5 shadow-xs">
                  <div className="text-[11px] font-bold text-[#7A6B5B] uppercase tracking-wide">
                    {language === 'ko' ? '전체 문의' : 'Total'}
                  </div>
                  <div className="text-2xl font-bold text-[#1E1915] mt-1">
                    {chatInquiries.length}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-amber-200 bg-amber-50/40 p-3.5 shadow-xs">
                  <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wide flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {language === 'ko' ? '접수 대기' : 'Pending'}
                  </div>
                  <div className="text-2xl font-bold text-amber-900 mt-1">
                    {chatInquiries.filter(i => i.status === 'pending').length}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-blue-200 bg-blue-50/40 p-3.5 shadow-xs">
                  <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wide flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {language === 'ko' ? '상담 진행중' : 'In Progress'}
                  </div>
                  <div className="text-2xl font-bold text-blue-900 mt-1">
                    {chatInquiries.filter(i => i.status === 'in_progress').length}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-emerald-200 bg-emerald-50/40 p-3.5 shadow-xs">
                  <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {language === 'ko' ? '상담 완료' : 'Resolved'}
                  </div>
                  <div className="text-2xl font-bold text-emerald-900 mt-1">
                    {chatInquiries.filter(i => i.status === 'resolved').length}
                  </div>
                </div>
              </div>

              {/* Manual Inquiry Drawer / Form if open */}
              {isAddingManualInquiry && (
                <div className="bg-white rounded-2xl border-2 border-[#EA580C]/40 p-5 sm:p-6 shadow-md space-y-4 animate-in fade-in-50 duration-150">
                  <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
                      <h4 className="text-sm sm:text-base font-bold text-[#1E1915]">
                        {language === 'ko' ? '새 상담 문의 직접 등록' : 'Register Manual Inquiry'}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddingManualInquiry(false)}
                      className="p-1 rounded-lg text-[#8C7A6B] hover:bg-[#F2ECE2] cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateManualInquiry} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                          {language === 'ko' ? '방문자 / 신청자 성명 *' : 'Visitor Name *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={manualInquiryForm.name}
                          onChange={(e) => setManualInquiryForm({ ...manualInquiryForm, name: e.target.value })}
                          placeholder="예: 김상현"
                          className="w-full px-3 py-2 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                          {language === 'ko' ? '연락처 (전화 또는 이메일) *' : 'Contact (Phone / Email) *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={manualInquiryForm.contact}
                          onChange={(e) => setManualInquiryForm({ ...manualInquiryForm, contact: e.target.value })}
                          placeholder="010-0000-0000 또는 email@domain.com"
                          className="w-full px-3 py-2 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                          {language === 'ko' ? '상담 분야' : 'Category'}
                        </label>
                        <select
                          value={manualInquiryForm.category}
                          onChange={(e) => setManualInquiryForm({ ...manualInquiryForm, category: e.target.value })}
                          className="w-full px-3 py-2 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl font-sans"
                        >
                          {(chatConfig?.categories || ['엘로힘 메시지 안내', '전자책 다운로드', '대사관 건설 프로젝트', '명상 아카데미 안내', '일반 문의']).map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                        {language === 'ko' ? '상담 문의 내용 *' : 'Inquiry Message *'}
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={manualInquiryForm.message}
                        onChange={(e) => setManualInquiryForm({ ...manualInquiryForm, message: e.target.value })}
                        placeholder="상담 문의 내용을 상세히 기재하세요."
                        className="w-full px-3 py-2 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                        {language === 'ko' ? '관리자 내부 메모 (선택사항)' : 'Admin Internal Note (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={manualInquiryForm.adminNotes}
                        onChange={(e) => setManualInquiryForm({ ...manualInquiryForm, adminNotes: e.target.value })}
                        placeholder="예: 전화상담 완료 후 이메일로 전자책 추가 안내 예정"
                        className="w-full px-3 py-2 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl font-sans"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-[#F0E8DC]">
                      <button
                        type="button"
                        onClick={() => setIsAddingManualInquiry(false)}
                        className="px-4 py-2 rounded-xl border border-[#DDD0C0] text-[#6B5A4A] text-xs font-semibold cursor-pointer"
                      >
                        {language === 'ko' ? '취소' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-white text-xs font-semibold shadow-xs cursor-pointer"
                        style={{ backgroundColor: theme.accentColor }}
                      >
                        {language === 'ko' ? '상담 등록 완료' : 'Save Inquiry'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Layout Split: Left (Inquiries List), Right (Chat Settings) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 cols: Inquiries List */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Filters & Search */}
                  <div className="bg-white rounded-xl border border-[#E5DACD] p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                      {(['all', 'pending', 'in_progress', 'resolved'] as const).map((filterKey) => {
                        const labels = {
                          all: language === 'ko' ? '전체' : 'All',
                          pending: language === 'ko' ? '대기중' : 'Pending',
                          in_progress: language === 'ko' ? '진행중' : 'In Progress',
                          resolved: language === 'ko' ? '완료' : 'Resolved'
                        };
                        const count = filterKey === 'all' 
                          ? chatInquiries.length 
                          : chatInquiries.filter(i => i.status === filterKey).length;
                        return (
                          <button
                            key={filterKey}
                            onClick={() => setChatInquiryFilter(filterKey)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                              chatInquiryFilter === filterKey
                                ? 'bg-[#1E1915] text-white shadow-xs'
                                : 'text-[#615142] hover:bg-[#F2ECE2]'
                            }`}
                          >
                            <span>{labels[filterKey]}</span>
                            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                              chatInquiryFilter === filterKey ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                            }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="relative w-full sm:w-56 shrink-0">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#9E8E7E]" />
                      <input
                        type="text"
                        value={chatSearchQuery}
                        onChange={(e) => setChatSearchQuery(e.target.value)}
                        placeholder={language === 'ko' ? '이름, 연락처, 내용 검색...' : 'Search inquiries...'}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-lg font-sans"
                      />
                    </div>
                  </div>

                  {/* Inquiry Cards List */}
                  {(() => {
                    const filtered = chatInquiries.filter(item => {
                      const matchesStatus = chatInquiryFilter === 'all' || item.status === chatInquiryFilter;
                      const q = chatSearchQuery.toLowerCase();
                      const matchesSearch = !q ||
                        item.name.toLowerCase().includes(q) ||
                        item.contact.toLowerCase().includes(q) ||
                        item.message.toLowerCase().includes(q) ||
                        (item.category && item.category.toLowerCase().includes(q));
                      return matchesStatus && matchesSearch;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="bg-white rounded-2xl border border-[#E5DACD] p-10 text-center space-y-3">
                          <MessageCircle className="w-10 h-10 mx-auto text-[#C8B8A6]" />
                          <h4 className="text-sm font-bold text-[#1E1915]">
                            {language === 'ko' ? '조회된 상담 문의가 없습니다.' : 'No consultation inquiries found.'}
                          </h4>
                          <p className="text-xs text-[#8C7A6B] max-w-sm mx-auto">
                            {language === 'ko'
                              ? '웹사이트 방문자가 24시간 상담 위젯을 통해 문의를 제출하면 실시간으로 이곳에 등록됩니다.'
                              : 'When site visitors submit inquiries through the 24/7 widget, they will appear here.'}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        {filtered.map((inq) => {
                          const isExpanded = selectedInquiryForReply === inq.id;
                          return (
                            <div
                              key={inq.id}
                              className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs transition-all space-y-3 ${
                                inq.status === 'pending'
                                  ? 'border-amber-300 ring-1 ring-amber-200'
                                  : inq.status === 'in_progress'
                                  ? 'border-blue-300'
                                  : 'border-[#E5DACD]'
                              }`}
                            >
                              {/* Top Bar: Name, Contact, Time, Status */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2ECE2] pb-2.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-sm text-[#1E1915]">
                                    {inq.name}
                                  </span>
                                  <span className="text-xs text-[#7A6B5B] font-mono bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8DFD3]">
                                    {inq.contact}
                                  </span>
                                  {inq.category && (
                                    <span className="text-[10px] font-bold bg-[#EA580C]/10 text-[#EA580C] px-2 py-0.5 rounded-full">
                                      {inq.category}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] text-[#8C7A6B] flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {inq.createdAt}
                                  </span>

                                  {/* Status Selector Dropdown */}
                                  <select
                                    value={inq.status}
                                    onChange={(e) => {
                                      updateChatInquiryStatus(inq.id, e.target.value as any);
                                      showNotification(language === 'ko' ? '상태가 변경되었습니다.' : 'Status updated.');
                                    }}
                                    className={`text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer ${
                                      inq.status === 'pending'
                                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                                        : inq.status === 'in_progress'
                                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                                        : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    }`}
                                  >
                                    <option value="pending">{language === 'ko' ? '대기중' : 'Pending'}</option>
                                    <option value="in_progress">{language === 'ko' ? '진행중' : 'In Progress'}</option>
                                    <option value="resolved">{language === 'ko' ? '완료' : 'Resolved'}</option>
                                  </select>

                                  <button
                                    onClick={() => handleDeleteInquiry(inq.id, inq.name)}
                                    className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer transition-colors"
                                    title="삭제"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Inquiry Message Body */}
                              <div className="bg-[#FCFAF7] rounded-xl p-3 border border-[#EAE2D5] text-xs text-[#2E241B] leading-relaxed whitespace-pre-wrap font-sans">
                                {inq.message}
                              </div>

                              {/* Admin Reply & Notes Display / Action */}
                              {inq.adminReply && (
                                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-xs space-y-1">
                                  <div className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    {language === 'ko' ? '상담원 공식 답변 내용:' : 'Counselor Reply:'}
                                  </div>
                                  <p className="text-emerald-950 whitespace-pre-wrap">{inq.adminReply}</p>
                                </div>
                              )}

                              {inq.adminNotes && (
                                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-900">
                                  <span className="font-bold text-[11px] mr-1">📝 {language === 'ko' ? '내부 메모:' : 'Note:'}</span>
                                  {inq.adminNotes}
                                </div>
                              )}

                              {/* Toggle Reply Editor Button */}
                              <div className="flex items-center justify-between pt-1">
                                <button
                                  onClick={() => {
                                    if (isExpanded) {
                                      setSelectedInquiryForReply(null);
                                    } else {
                                      setSelectedInquiryForReply(inq.id);
                                      if (!replyDrafts[inq.id] && inq.adminReply) {
                                        setReplyDrafts({ ...replyDrafts, [inq.id]: inq.adminReply });
                                      }
                                      if (!noteDrafts[inq.id] && inq.adminNotes) {
                                        setNoteDrafts({ ...noteDrafts, [inq.id]: inq.adminNotes });
                                      }
                                    }
                                  }}
                                  className="text-xs font-semibold text-[#EA580C] hover:underline cursor-pointer flex items-center gap-1"
                                >
                                  <Edit className="w-3 h-3" />
                                  <span>{isExpanded ? (language === 'ko' ? '답변 편집 닫기' : 'Close Reply') : (language === 'ko' ? '답변 작성 / 메모 수정' : 'Reply & Add Note')}</span>
                                </button>
                              </div>

                              {/* Expanded Reply / Note Form */}
                              {isExpanded && (
                                <div className="pt-2 border-t border-[#F2ECE2] space-y-3 animate-in fade-in-50 duration-150">
                                  <div>
                                    <label className="block text-[11px] font-bold text-[#3B2F24] mb-1">
                                      {language === 'ko' ? '상담원 공식 답변 (저장 시 상태가 자동으로 "완료"로 변경됩니다)' : 'Official Reply'}
                                    </label>
                                    <textarea
                                      rows={2}
                                      value={replyDrafts[inq.id] ?? (inq.adminReply || '')}
                                      onChange={(e) => setReplyDrafts({ ...replyDrafts, [inq.id]: e.target.value })}
                                      placeholder="방문자에게 안내할 상담 답변을 작성하세요."
                                      className="w-full px-3 py-2 text-xs bg-white border border-[#DDD0C0] rounded-xl font-sans"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[11px] font-bold text-[#3B2F24] mb-1">
                                      {language === 'ko' ? '관리자 내부 메모' : 'Internal Note'}
                                    </label>
                                    <input
                                      type="text"
                                      value={noteDrafts[inq.id] ?? (inq.adminNotes || '')}
                                      onChange={(e) => setNoteDrafts({ ...noteDrafts, [inq.id]: e.target.value })}
                                      placeholder="내부 공유용 메모 (예: 다음주 정기 모임 초대 안내 완료)"
                                      className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDD0C0] rounded-xl font-sans"
                                    />
                                  </div>

                                  <div className="flex justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedInquiryForReply(null)}
                                      className="px-3 py-1.5 rounded-lg border border-[#DDD0C0] text-[#6B5A4A] text-xs font-semibold cursor-pointer"
                                    >
                                      {language === 'ko' ? '취소' : 'Cancel'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSaveInquiryReplyAndNote(inq.id, inq.status)}
                                      className="px-4 py-1.5 rounded-lg text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1"
                                      style={{ backgroundColor: theme.accentColor }}
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      <span>{language === 'ko' ? '답변 저장 & 처리' : 'Save Reply'}</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* Right 1 col: Chat Widget Config Panel */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-[#E5DACD] p-5 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#F0E8DC] pb-3">
                      <Headphones className="w-4 h-4 text-[#EA580C]" />
                      <h4 className="text-sm font-bold text-[#1E1915]">
                        {language === 'ko' ? '24시간 상담 위젯 환경 설정' : '24/7 Widget Settings'}
                      </h4>
                    </div>

                    {/* Enable Toggle */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FCFAF7] border border-[#EAE2D5]">
                        <div>
                          <div className="text-xs font-bold text-[#1E1915]">
                            {language === 'ko' ? '상담 위젯 활성화' : 'Live Chat Widget'}
                          </div>
                          <div className="text-[11px] text-[#7A6B5B]">
                            {language === 'ko' ? '사이트 하단 플로팅 버튼 표시' : 'Show floating bottom widget'}
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={chatConfigForm.enabled}
                          onChange={(e) => setChatConfigForm({ ...chatConfigForm, enabled: e.target.checked })}
                          className="w-4 h-4 text-[#EA580C] rounded cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FCFAF7] border border-[#EAE2D5]">
                        <div>
                          <div className="text-xs font-bold text-[#1E1915]">
                            {language === 'ko' ? '지능형 자동응답 안내' : 'Auto-Reply Assistant'}
                          </div>
                          <div className="text-[11px] text-[#7A6B5B]">
                            {language === 'ko' ? '키워드 질의 즉시 답변 지원' : 'Instant AI FAQ response'}
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={chatConfigForm.autoReplyEnabled}
                          onChange={(e) => setChatConfigForm({ ...chatConfigForm, autoReplyEnabled: e.target.checked })}
                          className="w-4 h-4 text-[#EA580C] rounded cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Counselor Info */}
                    <div className="space-y-3 pt-2 border-t border-[#F0E8DC]">
                      <div>
                        <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                          {language === 'ko' ? '상담원 이름 (한국어)' : 'Counselor Name (KO)'}
                        </label>
                        <input
                          type="text"
                          value={chatConfigForm.counselorNameKo}
                          onChange={(e) => setChatConfigForm({ ...chatConfigForm, counselorNameKo: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                          {language === 'ko' ? '상담원 소속 / 직함 (한국어)' : 'Counselor Title (KO)'}
                        </label>
                        <input
                          type="text"
                          value={chatConfigForm.counselorTitleKo}
                          onChange={(e) => setChatConfigForm({ ...chatConfigForm, counselorTitleKo: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                          {language === 'ko' ? '환영 안내 메시지 (한국어)' : 'Welcome Message (KO)'}
                        </label>
                        <textarea
                          rows={2}
                          value={chatConfigForm.welcomeKo}
                          onChange={(e) => setChatConfigForm({ ...chatConfigForm, welcomeKo: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                          {language === 'ko' ? '운영 시간 안내 문구' : 'Operating Hours Text'}
                        </label>
                        <input
                          type="text"
                          value={chatConfigForm.operatingHoursKo}
                          onChange={(e) => setChatConfigForm({ ...chatConfigForm, operatingHoursKo: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                            {language === 'ko' ? '긴급 전화' : 'Emergency Phone'}
                          </label>
                          <input
                            type="text"
                            value={chatConfigForm.emergencyPhone}
                            onChange={(e) => setChatConfigForm({ ...chatConfigForm, emergencyPhone: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl font-sans"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                            {language === 'ko' ? '공식 이메일' : 'Email'}
                          </label>
                          <input
                            type="text"
                            value={chatConfigForm.emergencyEmail}
                            onChange={(e) => setChatConfigForm({ ...chatConfigForm, emergencyEmail: e.target.value })}
                            className="w-full px-3 py-1.5 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl font-sans"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                          {language === 'ko' ? '상담 카테고리 태그 (쉼표로 구분)' : 'Categories (comma-separated)'}
                        </label>
                        <input
                          type="text"
                          value={chatConfigForm.categoriesStr}
                          onChange={(e) => setChatConfigForm({ ...chatConfigForm, categoriesStr: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl font-sans"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveChatConfig}
                      className="w-full py-2.5 rounded-xl text-white text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
                      style={{ backgroundColor: theme.accentColor }}
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{language === 'ko' ? '상담 환경 설정 저장' : 'Save Chat Settings'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: THEME & DESIGN */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#1E1915] font-display">
                  {language === 'ko' ? '디자인, 테마 및 색상 커스터마이징' : 'Theme & Color Customization'}
                </h3>
                <p className="text-xs text-[#7A6B5B]">
                  {language === 'ko' ? '요청하신 베이지색 배경과 포인트 주황색을 비롯하여 폰트와 스타일을 자유롭게 조정할 수 있습니다.' : 'Adjust warm beige canvas, orange accent point colors, fonts and border radii.'}
                </p>
              </div>

              {/* Point Accent Color Selector */}
              <div className="bg-white rounded-xl border border-[#DDD0C0] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-4 h-4 rounded-full border border-black/20"
                      style={{ backgroundColor: theme.accentColor }}
                    />
                    <h4 className="text-sm font-bold text-[#1E1915]">
                      {language === 'ko' ? '포인트 컬러 (Point Color - 주황색 계열)' : 'Accent Point Color'}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#55473A]">{theme.accentColor}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { label: '클래식 오렌지 (기본)', hex: '#EA580C' },
                    { label: '밝은 텐저린 오렌지', hex: '#F97316' },
                    { label: '골든 엠버', hex: '#D97706' },
                    { label: '딥 웜 오렌지', hex: '#C2410C' },
                    { label: '코랄 선셋', hex: '#E11D48' }
                  ].map(c => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => {
                        updateTheme({ accentColor: c.hex });
                        showNotification(`포인트 컬러가 ${c.label}(으)로 변경되었습니다.`);
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                        theme.accentColor === c.hex ? 'border-stone-900 bg-stone-50 shadow-xs' : 'border-[#E2D6C6] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full shadow-xs" style={{ backgroundColor: c.hex }} />
                      <span className="text-[11px] font-semibold text-[#3D332A] text-center">{c.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs text-[#635343] font-medium">{language === 'ko' ? '직접 색상 코드 입력:' : 'Custom Hex:'}</span>
                  <input
                    type="text"
                    value={theme.accentColor}
                    onChange={e => updateTheme({ accentColor: e.target.value })}
                    className="px-3 py-1.5 text-xs font-mono bg-[#FCFAF7] border border-[#DDD0C0] rounded-lg w-28"
                  />
                  <input
                    type="color"
                    value={theme.accentColor}
                    onChange={e => updateTheme({ accentColor: e.target.value })}
                    className="w-8 h-8 rounded-md cursor-pointer border border-[#DDD0C0]"
                  />
                </div>
              </div>

              {/* Background Color Palette */}
              <div className="bg-white rounded-xl border border-[#DDD0C0] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-4 h-4 rounded-full border border-black/20"
                      style={{ backgroundColor: theme.bgColor }}
                    />
                    <h4 className="text-sm font-bold text-[#1E1915]">
                      {language === 'ko' ? '배경색 (Background Canvas - 고급 베이지 계열)' : 'Background Canvas (Warm Beige)'}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#55473A]">{theme.bgColor}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: '웜 샌드 베이지 (기본)', hex: '#FAF7F2' },
                    { label: '소프트 아이보리', hex: '#FDFBF7' },
                    { label: '내추럴 리넨', hex: '#F5EFEB' },
                    { label: '앤틱 스톤 베이지', hex: '#EFE8DF' }
                  ].map(b => (
                    <button
                      key={b.hex}
                      type="button"
                      onClick={() => {
                        updateTheme({ bgColor: b.hex });
                        showNotification(`배경색이 ${b.label}(으)로 변경되었습니다.`);
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                        theme.bgColor === b.hex ? 'border-stone-900 bg-stone-50 shadow-xs' : 'border-[#E2D6C6] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full shadow-xs border border-stone-300" style={{ backgroundColor: b.hex }} />
                      <span className="text-[11px] font-semibold text-[#3D332A] text-center">{b.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs text-[#635343] font-medium">{language === 'ko' ? '직접 배경 색상 코드 입력:' : 'Custom Background Hex:'}</span>
                  <input
                    type="text"
                    value={theme.bgColor}
                    onChange={e => updateTheme({ bgColor: e.target.value })}
                    className="px-3 py-1.5 text-xs font-mono bg-[#FCFAF7] border border-[#DDD0C0] rounded-lg w-28"
                  />
                  <input
                    type="color"
                    value={theme.bgColor}
                    onChange={e => updateTheme({ bgColor: e.target.value })}
                    className="w-8 h-8 rounded-md cursor-pointer border border-[#DDD0C0]"
                  />
                </div>
              </div>

              {/* Font Family Selection */}
              <div className="bg-white rounded-xl border border-[#DDD0C0] p-6 space-y-4">
                <h4 className="text-sm font-bold text-[#1E1915]">
                  {language === 'ko' ? '폰트 타이포그래피 스타일' : 'Typography Preset'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'editorial', name: '소프트 모던 (Outfit + Noto)', desc: '부드러운 곡선과 세련된 영문/부탄어 조화' },
                    { key: 'sans', name: '클린 산세리프 (Plus Jakarta)', desc: '현대적이고 높은 가독성의 부드러운 서체' },
                    { key: 'cinzel', name: '클래식 엘레강스 (Cormorant)', desc: '우아하고 섬세한 프리미엄 서체' }
                  ].map(f => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => updateTheme({ fontFamily: f.key as any })}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        theme.fontFamily === f.key ? 'border-[#EA580C] bg-[#FAF7F2] ring-1 ring-[#EA580C]' : 'border-[#E2D6C6] hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-bold text-[#1E1915]">{f.name}</div>
                      <div className="text-[11px] text-[#7A6A5A] mt-1">{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Announcement Banner Bar */}
              <div className="bg-white rounded-xl border border-[#DDD0C0] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#1E1915]">
                    {language === 'ko' ? '상단 공지 알림 배너' : 'Top Announcement Banner'}
                  </h4>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#483C30]">
                    <input
                      type="checkbox"
                      checked={theme.showAnnouncement}
                      onChange={e => updateTheme({ showAnnouncement: e.target.checked })}
                      className="rounded text-[#EA580C]"
                    />
                    <span>{language === 'ko' ? '배너 표시 활성화' : 'Enable Banner'}</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                      배너 문구 (한국어)
                    </label>
                    <input
                      type="text"
                      value={theme.announcementText.ko}
                      onChange={e => updateTheme({ announcementText: { ...theme.announcementText, ko: e.target.value } })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                      Banner Text (English)
                    </label>
                    <input
                      type="text"
                      value={theme.announcementText.en}
                      onChange={e => updateTheme({ announcementText: { ...theme.announcementText, en: e.target.value } })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: SEO & SOCIAL MEDIA */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#1E1915] font-display">
                  {language === 'ko' ? 'SEO 도구 및 소셜 미디어 연동 관리' : 'SEO Tools & Social Media Settings'}
                </h3>
                <p className="text-xs text-[#7A6B5B]">
                  {language === 'ko' ? '검색엔진 최적화 메타태그, 오픈그래프 카드, 소셜 공유 미리보기 및 링크를 관리합니다.' : 'Optimize search engine rankings, OpenGraph share cards, and official channels.'}
                </p>
              </div>

              {/* Live Social Share Simulator Card */}
              <div className="bg-white rounded-xl border border-[#DDD0C0] p-6 space-y-4">
                <h4 className="text-sm font-bold text-[#1E1915] flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#EA580C]" />
                  <span>{language === 'ko' ? '소셜 미디어 공유 카드 실시간 시뮬레이터' : 'Live Social Share Card Simulator'}</span>
                </h4>
                <p className="text-xs text-[#7A6A5A]">
                  {language === 'ko' ? '카카오톡, 페이스북, X, 슬랙 등 링크를 공유했을 때 상대방에게 표시되는 화면입니다.' : 'How your site appears when shared on Facebook, X, Slack, and messaging apps.'}
                </p>

                <div className="max-w-md mx-auto rounded-xl border border-[#D8CCBD] overflow-hidden shadow-md bg-stone-50 text-left">
                  <div className="h-44 bg-stone-200 overflow-hidden relative">
                    <img 
                      src={seo.ogImageUrl} 
                      alt="OG preview" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-sm bg-black/60 text-white text-[10px] font-mono">
                      bhutanrm.org
                    </div>
                  </div>
                  <div className="p-4 space-y-1 bg-white">
                    <div className="text-[11px] uppercase tracking-wider text-[#8A7969] font-bold">
                      {seo.siteName}
                    </div>
                    <div className="text-sm font-bold text-[#1E1915] leading-snug">
                      {seo.metaTitle[language] || seo.metaTitle.ko}
                    </div>
                    <div className="text-xs text-[#635445] line-clamp-2">
                      {seo.metaDescription[language] || seo.metaDescription.ko}
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta Tags Configuration */}
              <div className="bg-white rounded-xl border border-[#DDD0C0] p-6 space-y-4">
                <h4 className="text-sm font-bold text-[#1E1915]">
                  {language === 'ko' ? '메타 태그 설정' : 'Meta Tags'}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                      메타 타이틀 (한국어)
                    </label>
                    <input
                      type="text"
                      value={seo.metaTitle.ko}
                      onChange={e => updateSeo({ metaTitle: { ...seo.metaTitle, ko: e.target.value } })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                      Meta Title (English)
                    </label>
                    <input
                      type="text"
                      value={seo.metaTitle.en}
                      onChange={e => updateSeo({ metaTitle: { ...seo.metaTitle, en: e.target.value } })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                      메타 설명문 (한국어)
                    </label>
                    <textarea
                      rows={3}
                      value={seo.metaDescription.ko}
                      onChange={e => updateSeo({ metaDescription: { ...seo.metaDescription, ko: e.target.value } })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                      Meta Description (English)
                    </label>
                    <textarea
                      rows={3}
                      value={seo.metaDescription.en}
                      onChange={e => updateSeo({ metaDescription: { ...seo.metaDescription, en: e.target.value } })}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                      검색 키워드 (Keywords)
                    </label>
                    <input
                      type="text"
                      value={seo.keywords}
                      onChange={e => updateSeo({ keywords: e.target.value })}
                      placeholder="부탄 라엘리안, 외계인 대사관, 엘로힘"
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <ImageUploader
                    id="seo-og-image-uploader"
                    label={language === 'ko' ? '오픈그래프 대표 공유 이미지 (OG Image, 파일 직접 업로드)' : 'Social Share Card Image (OG Image, Upload File)'}
                    helperText={language === 'ko' ? '카카오톡, 페이스북, 트위터 등에 링크를 공유할 때 나타나는 미리보기 썸네일 카드를 업로드하세요.' : 'Upload the thumbnail card displayed when sharing the link on social media.'}
                    recommendedSize="1200 × 630px 권장"
                    value={seo.ogImageUrl}
                    onChange={(newImg) => updateSeo({ ogImageUrl: newImg })}
                    language={language}
                    aspectRatio="wide"
                    defaultValue="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80"
                  />
                </div>
              </div>

              {/* Social Channels Link Manager */}
              <div className="bg-white rounded-xl border border-[#DDD0C0] p-6 space-y-4">
                <h4 className="text-sm font-bold text-[#1E1915]">
                  {language === 'ko' ? '공식 소셜 미디어 연동 링크' : 'Official Social Channels'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">Facebook URL</label>
                    <input
                      type="url"
                      value={seo.socialLinks.facebook}
                      onChange={e => updateSeo({ socialLinks: { ...seo.socialLinks, facebook: e.target.value } })}
                      className="w-full px-3 py-2 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">YouTube URL</label>
                    <input
                      type="url"
                      value={seo.socialLinks.youtube}
                      onChange={e => updateSeo({ socialLinks: { ...seo.socialLinks, youtube: e.target.value } })}
                      className="w-full px-3 py-2 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">X (Twitter) URL</label>
                    <input
                      type="url"
                      value={seo.socialLinks.twitter}
                      onChange={e => updateSeo({ socialLinks: { ...seo.socialLinks, twitter: e.target.value } })}
                      className="w-full px-3 py-2 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3B2F24] mb-1">Telegram URL</label>
                    <input
                      type="url"
                      value={seo.socialLinks.telegram}
                      onChange={e => updateSeo({ socialLinks: { ...seo.socialLinks, telegram: e.target.value } })}
                      className="w-full px-3 py-2 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: BACKUP & RESET */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#1E1915] font-display">
                  {language === 'ko' ? '데이터 백업, 가져오기 및 초기화' : 'Data Backup, Import & Factory Reset'}
                </h3>
                <p className="text-xs text-[#7A6B5B]">
                  {language === 'ko' ? '작성한 모든 게시글과 설정 데이터를 안전하게 JSON 파일로 내보내거나 백업본을 복원할 수 있습니다.' : 'Safely export your content to a JSON file or restore default sample data.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Export Card */}
                <div className="bg-white rounded-xl border border-[#DDD0C0] p-6 space-y-4 text-left flex flex-col justify-between">
                  <div className="space-y-2">
                    <Download className="w-6 h-6 text-[#EA580C]" />
                    <h4 className="text-sm font-bold text-[#1E1915]">
                      {language === 'ko' ? 'JSON 백업 내보내기' : 'Export JSON Backup'}
                    </h4>
                    <p className="text-xs text-[#635343]">
                      {language === 'ko' 
                        ? '현재 사이트의 모든 텍스트, 아티클, 테마 설정을 컴퓨터에 파일로 저장합니다.' 
                        : 'Download a complete snapshot of all posts, themes, and content.'}
                    </p>
                  </div>
                  <button
                    onClick={exportData}
                    className="w-full py-2.5 rounded-xl bg-[#2D251F] text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#3D332B] transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{language === 'ko' ? '백업 파일 다운로드' : 'Download Backup'}</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="bg-white rounded-xl border border-[#DDD0C0] p-6 space-y-4 text-left flex flex-col justify-between">
                  <div className="space-y-2">
                    <Upload className="w-6 h-6 text-[#EA580C]" />
                    <h4 className="text-sm font-bold text-[#1E1915]">
                      {language === 'ko' ? 'JSON 백업 불러오기' : 'Import JSON Backup'}
                    </h4>
                    <p className="text-xs text-[#635343]">
                      {language === 'ko' 
                        ? '이전에 다운로드한 JSON 백업 파일을 업로드하여 복원합니다.' 
                        : 'Restore your site from a previously saved JSON snapshot.'}
                    </p>
                  </div>
                  <label className="w-full py-2.5 rounded-xl bg-white border border-[#DDD0C0] text-[#3D332A] font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#FAF7F2] transition-colors cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{language === 'ko' ? '파일 선택 및 복원' : 'Choose File'}</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Reset Card */}
                <div className="bg-white rounded-xl border border-rose-200 p-6 space-y-4 text-left flex flex-col justify-between">
                  <div className="space-y-2">
                    <RefreshCw className="w-6 h-6 text-rose-600" />
                    <h4 className="text-sm font-bold text-rose-900">
                      {language === 'ko' ? '기본 샘플 데이터 복원' : 'Reset to Defaults'}
                    </h4>
                    <p className="text-xs text-rose-700">
                      {language === 'ko' 
                        ? '부탄 라엘리안 무브먼트의 공식 기본 샘플 데이터(기사 4건, 대사관, 도서)로 원상 복구합니다.' 
                        : 'Restore the initial pre-filled Bhutan Raëlian Movement sample data.'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm(language === 'ko' ? '정말 기본 샘플 데이터로 복원하시겠습니까? 현재 변경사항이 초기화됩니다.' : 'Reset all data to default samples?')) {
                        resetToDefault();
                        showNotification(language === 'ko' ? '기본 데이터로 복원되었습니다.' : 'Restored to defaults.');
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{language === 'ko' ? '기본 데이터로 초기화' : 'Reset to Defaults'}</span>
                  </button>
                </div>

              </div>

              {/* Admin Account & Security Settings */}
              <div className="bg-white rounded-xl border border-[#DDD0C0] p-6 space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#EA580C]" />
                  <h4 className="text-sm font-bold text-[#1E1915]">
                    {language === 'ko' ? '관리자 계정 및 보안 설정' : 'Admin Security & Password'}
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE0D2] space-y-1">
                    <span className="font-semibold text-[#5A4B3C]">
                      {language === 'ko' ? '로그인 접속 경로' : 'Admin Login URL'}
                    </span>
                    <div className="font-mono text-[#EA580C] font-bold text-xs pt-0.5">
                      /admin0/login (또는 #/admin0/login)
                    </div>
                    <p className="text-[11px] text-[#8C7A68]">
                      {language === 'ko' 
                        ? '일반 방문자에게는 관리자 버튼이 표시되지 않으며, 관리자 로그인 화면을 통해 인증해야 접속할 수 있습니다.' 
                        : 'Admin tools are hidden from regular visitors until authenticated.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE0D2] space-y-2">
                    <span className="font-semibold text-[#5A4B3C]">
                      {language === 'ko' ? '관리자 비밀번호 변경' : 'Change Admin Password'}
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={newPasswordInput}
                        onChange={e => setNewPasswordInput(e.target.value)}
                        placeholder={language === 'ko' ? '새 비밀번호 입력 (4자 이상)' : 'New password (min 4 chars)'}
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#DDD0C0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newPasswordInput.length < 4) {
                            setPwdFeedback(language === 'ko' ? '비밀번호는 4자 이상이어야 합니다.' : 'Must be at least 4 chars.');
                            return;
                          }
                          changeAdminPassword(newPasswordInput);
                          setPwdFeedback(language === 'ko' ? '비밀번호가 성공적으로 변경되었습니다.' : 'Password updated.');
                          setNewPasswordInput('');
                          setTimeout(() => setPwdFeedback(null), 3000);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#2D251F] hover:bg-[#3D332B] text-white font-semibold text-xs transition-colors cursor-pointer"
                      >
                        {language === 'ko' ? '변경' : 'Update'}
                      </button>
                    </div>
                    {pwdFeedback && (
                      <div className="text-[11px] font-semibold text-emerald-600">
                        {pwdFeedback}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
