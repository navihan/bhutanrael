import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Post, PostCategory, ThemeConfig, SeoConfig, SiteContent } from '../types';
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
  Shield
} from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { AdminManagementTab } from './AdminManagementTab';

type AdminTab = 'posts' | 'admins' | 'content' | 'theme' | 'seo' | 'backup';

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
    posts,
    addPost,
    updatePost,
    deletePost,
    resetToDefault,
    exportData,
    importData,
    language
  } = useSite();

  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [pwdFeedback, setPwdFeedback] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>('posts');

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

  if (!isAdminOpen) return null;

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

            </div>
          )}

          {/* TAB 3: DESIGN & THEME */}
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
                    { key: 'editorial', name: '에디토리얼 럭셔리 (Cinzel + Noto)', desc: '고급스럽고 장엄한 영적 분위기' },
                    { key: 'sans', name: '모던 산세리프 (Plus Jakarta)', desc: '현대적이고 직관적인 가독성' },
                    { key: 'cinzel', name: '클래식 로열 (Cinzel Classic)', desc: '웅장하고 고풍스러운 서체' }
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
                      /admin/login (또는 #/admin/login)
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
