import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import {
  X,
  Calendar,
  Clock,
  Eye,
  Share2,
  Check,
  Bookmark,
  Facebook,
  Twitter,
  Send,
  ArrowLeft,
  Edit,
  Trash2,
  User,
  ShieldCheck
} from 'lucide-react';

export const ArticleDetailModal: React.FC = () => {
  const {
    selectedPostForDetail,
    setSelectedPostForDetail,
    language,
    theme,
    isAdminAuthenticated,
    currentAdmin,
    canEditPost,
    canDeletePost,
    openEditPost,
    deletePost
  } = useSite();
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!selectedPostForDetail) return null;

  const post = selectedPostForDetail;
  const isMyPost =
    isAdminAuthenticated &&
    (post.authorId === currentAdmin?.id ||
      post.authorEmail?.toLowerCase() === currentAdmin?.email.toLowerCase() ||
      post.author === currentAdmin?.name);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    openEditPost(post);
    setSelectedPostForDetail(null);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deletePost(post.id);
    setSelectedPostForDetail(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-[#FAF7F2] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E0D3C3] flex flex-col relative text-left"
        onClick={e => e.stopPropagation()}
      >
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-20 bg-[#FAF7F2]/95 backdrop-blur-md px-6 py-4 border-b border-[#E8DFD3] flex items-center justify-between">
          <button
            onClick={() => setSelectedPostForDetail(null)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A4E42] hover:text-[#1E1915] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'ko' ? '목록으로 돌아가기' : 'Back to News'}</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Admin Edit / Delete Actions */}
            {isAdminAuthenticated && canEditPost(post) && (
              <button
                type="button"
                onClick={handleEdit}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#DDD0C0] text-[#3B2F24] hover:bg-[#F3ECE1] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title={language === 'ko' ? '게시글 수정' : 'Edit Post'}
              >
                <Edit className="w-3.5 h-3.5 text-[#EA580C]" />
                <span className="hidden sm:inline">{language === 'ko' ? '수정' : 'Edit'}</span>
              </button>
            )}

            {isAdminAuthenticated && canDeletePost(post) && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title={language === 'ko' ? '게시글 삭제' : 'Delete Post'}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'ko' ? '삭제' : 'Delete'}</span>
              </button>
            )}

            <button
              onClick={handleCopyLink}
              className="p-2 rounded-lg bg-white border border-[#DDD0C0] text-[#5A4E42] hover:bg-[#F3ECE1] transition-colors cursor-pointer"
              title="링크 복사"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setSelectedPostForDetail(null)}
              className="p-2 rounded-lg bg-white border border-[#DDD0C0] text-[#5A4E42] hover:bg-[#F3ECE1] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-6">
          
          {/* Category & Meta */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span 
                className="px-3 py-1 rounded-full text-xs font-bold uppercase text-white shadow-2xs"
                style={{ backgroundColor: theme.accentColor }}
              >
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-[#8C7B6C] bg-white px-2.5 py-0.5 rounded-full border border-[#E0D3C3]">
                <User className="w-3 h-3 text-[#A08E7E]" />
                <strong className="text-[#4A3D31]">{post.author}</strong>
                {post.authorEmail && <span className="text-[10px] text-stone-400 font-mono">({post.authorEmail})</span>}
              </span>
              {isMyPost && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {language === 'ko' ? '내가 작성한 글' : 'My Article'}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E1915] font-display leading-tight">
              {post.title[language]}
            </h1>

            <div className="flex items-center gap-4 text-xs text-[#7A6A5A] pt-1 border-b border-[#E8DFD3] pb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {post.views} {language === 'ko' ? '회 조회' : 'views'}
              </span>
            </div>
          </div>

          {/* Lead Summary */}
          <div className="p-4 rounded-xl bg-[#F0E7DC] border-l-4 border-[#EA580C] text-[#3D3328] font-medium text-sm sm:text-base leading-relaxed">
            {post.summary[language]}
          </div>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="rounded-xl overflow-hidden shadow-md border border-[#E2D6C6] bg-stone-100">
              <img
                src={post.coverImage}
                alt={post.title[language]}
                className="w-full max-h-96 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Main Formatted Text */}
          <div className="space-y-4 text-sm sm:text-base text-[#2E2721] leading-relaxed whitespace-pre-line font-body">
            {post.content[language]}
          </div>

          {/* Tags */}
          <div className="pt-6 border-t border-[#E8DFD3] flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#786757]">
              {language === 'ko' ? '관련 태그:' : 'Tags:'}
            </span>
            {post.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="px-2.5 py-1 rounded-md bg-white border border-[#DDD0C0] text-xs font-medium text-[#504337]"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Social Share Strip */}
          <div className="p-4 rounded-xl bg-white border border-[#E3D6C6] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-bold text-[#3B3026]">
              {language === 'ko' ? '이 글을 친구들과 공유하기' : 'Share this insight with friends'}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#DDD0C0] text-xs font-semibold text-[#4A3E33] hover:bg-[#EFE7DC] flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? (language === 'ko' ? '복사완료!' : 'Copied!') : (language === 'ko' ? '링크 복사' : 'Copy Link')}</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* In-app Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-rose-200 shadow-2xl space-y-4 text-left">
            <div className="flex items-center gap-2.5 text-rose-600 font-bold text-base">
              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-rose-600" />
              </div>
              <span>{language === 'ko' ? '게시글 삭제 확인' : 'Delete Article'}</span>
            </div>

            <p className="text-xs text-[#5A4E42]">
              &ldquo;{post.title[language] || post.title.ko}&rdquo; {language === 'ko' ? '게시글을 완전히 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.' : 'Are you sure you want to delete this article? This action cannot be undone.'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer transition-colors"
              >
                {language === 'ko' ? '취소' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'ko' ? '삭제 확정' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
