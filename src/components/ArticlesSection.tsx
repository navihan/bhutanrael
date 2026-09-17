import React, { useState, useMemo } from 'react';
import { useSite } from '../context/SiteContext';
import { Post, PostCategory } from '../types';
import {
  Newspaper,
  Search,
  Eye,
  Calendar,
  Clock,
  PlusCircle,
  ArrowRight,
  Tag,
  Edit,
  Trash2,
  User,
  ShieldCheck
} from 'lucide-react';

export const ArticlesSection: React.FC = () => {
  const {
    posts,
    language,
    theme,
    setSelectedPostForDetail,
    setIsAdminOpen,
    incrementPostViews,
    isAdminAuthenticated,
    currentAdmin,
    canEditPost,
    canDeletePost,
    openEditPost,
    deletePost
  } = useSite();
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const categories: { key: PostCategory; label: { ko: string; en: string } }[] = [
    { key: 'all', label: { ko: '전체 소식', en: 'All News' } },
    { key: 'announcement', label: { ko: '공지사항', en: 'Announcements' } },
    { key: 'science', label: { ko: '지적설계 & 과학', en: 'Science' } },
    { key: 'philosophy', label: { ko: '철학 & 명상', en: 'Philosophy' } },
    { key: 'embassy', label: { ko: '외계인 대사관', en: 'Embassy' } }
  ];

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Check published status
      if (post.status !== 'published') return false;

      // Check category
      if (selectedCategory !== 'all' && post.category !== selectedCategory) {
        return false;
      }

      // Check search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const titleKo = post.title.ko.toLowerCase();
        const titleEn = post.title.en.toLowerCase();
        const summaryKo = post.summary.ko.toLowerCase();
        const summaryEn = post.summary.en.toLowerCase();
        const author = post.author.toLowerCase();
        const matchTags = post.tags.some(t => t.toLowerCase().includes(query));

        return (
          titleKo.includes(query) ||
          titleEn.includes(query) ||
          summaryKo.includes(query) ||
          summaryEn.includes(query) ||
          author.includes(query) ||
          matchTags
        );
      }

      return true;
    });
  }, [posts, selectedCategory, searchQuery]);

  const handleOpenPost = (post: Post) => {
    incrementPostViews(post.id);
    setSelectedPostForDetail(post);
  };

  return (
    <section id="articles" className="py-20 lg:py-28 bg-[#F6F0E7] border-b border-[#E7DDD0] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & New Post Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE0D2] text-[#635343] text-xs font-semibold uppercase tracking-wider">
              <Newspaper className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>{language === 'ko' ? '최신 소식 & 칼럼' : 'News & Articles'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1E1915] font-display">
              {language === 'ko' ? '부탄 라엘리안 아카이브' : 'Bhutan Raëlian Insights'}
            </h2>
            <p className="text-sm sm:text-base text-[#685747]">
              {language === 'ko' 
                ? '과학, 명상, 대사관 유치 비전 및 부탄 지부의 공식 발표와 컬럼을 확인하세요.' 
                : 'Stay updated with philosophical discoveries, science notes, and official movement statements in Bhutan.'}
            </p>
          </div>

          {isAdminAuthenticated && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-xs hover:opacity-95 transition-all cursor-pointer"
                style={{ backgroundColor: theme.accentColor }}
              >
                <PlusCircle className="w-4 h-4" />
                <span>{language === 'ko' ? '새 글 작성하기' : 'Write New Article'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'text-white shadow-xs'
                    : 'bg-white/80 text-[#5C4D3E] border border-[#DDD0C0] hover:bg-white'
                }`}
                style={{
                  backgroundColor: selectedCategory === cat.key ? theme.accentColor : undefined
                }}
              >
                {cat.label[language]}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#8C7A68] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={language === 'ko' ? '제목, 내용, 태그 검색...' : 'Search posts, tags...'}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#DDD0C0] rounded-xl text-[#2B231C] placeholder-[#9E8E7E] focus:outline-none focus:ring-2 focus:ring-[#EA580C]/40"
            />
          </div>
        </div>

        {/* Post Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E0D3C3] p-8">
            <p className="text-[#6E5D4C] text-sm sm:text-base">
              {language === 'ko' ? '검색 결과 또는 등록된 게시글이 없습니다.' : 'No articles found matching your criteria.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 text-xs font-semibold text-[#EA580C] hover:underline"
            >
              {language === 'ko' ? '모든 필터 초기화' : 'Clear all filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <article
                key={post.id}
                onClick={() => handleOpenPost(post)}
                className="bg-white rounded-2xl border border-[#E3D6C6] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col cursor-pointer group transform hover:-translate-y-1"
              >
                {/* Cover Image */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-stone-100">
                  <img
                    src={post.coverImage}
                    alt={post.title[language]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3">
                    <span 
                      className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase text-white shadow-xs"
                      style={{ backgroundColor: theme.accentColor }}
                    >
                      {categories.find(c => c.key === post.category)?.label[language] || post.category}
                    </span>
                  </div>
                  {post.isFeatured && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-xs">
                      FEATURED
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between text-left space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 flex-wrap text-[11px] text-[#857463]">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views}
                        </span>
                      </div>

                      {/* Author Tag */}
                      <div className="flex items-center gap-1 text-[10px] text-[#6E5D4D]">
                        <User className="w-3 h-3 text-[#A08E7E]" />
                        <span className="font-medium truncate max-w-[120px]">{post.author}</span>
                        {isAdminAuthenticated && (
                          (post.authorId === currentAdmin?.id || post.authorEmail?.toLowerCase() === currentAdmin?.email.toLowerCase() || post.author === currentAdmin?.name) && (
                            <span className="px-1.5 py-0.2 rounded-sm bg-emerald-100 text-emerald-800 font-bold">
                              {language === 'ko' ? '내 글' : 'Mine'}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-[#1E1915] font-display line-clamp-2 group-hover:text-[#EA580C] transition-colors leading-snug">
                      {post.title[language]}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#665749] line-clamp-3 leading-relaxed">
                      {post.summary[language]}
                    </p>
                  </div>

                  {/* Tags, Admin Controls, and Read more */}
                  <div className="pt-3 border-t border-[#EFE5D9] flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="text-[10px] bg-[#F2EAE0] text-[#6E5D4D] px-2 py-0.5 rounded-sm flex items-center gap-0.5">
                          <Tag className="w-2.5 h-2.5" />
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Authorized Admin Quick Actions */}
                      {isAdminAuthenticated && (canEditPost(post) || canDeletePost(post)) && (
                        <div className="flex items-center gap-1 bg-[#F4EDE3] px-1.5 py-0.5 rounded-lg border border-[#DDD0C0]" onClick={e => e.stopPropagation()}>
                          {canEditPost(post) && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditPost(post);
                              }}
                              className="p-1 rounded text-[#5A4E42] hover:text-[#EA580C] hover:bg-white transition-colors cursor-pointer"
                              title={language === 'ko' ? '게시글 수정' : 'Edit Article'}
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                          )}
                          {canDeletePost(post) && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPostToDelete(post);
                              }}
                              className="p-1 rounded text-[#5A4E42] hover:text-rose-600 hover:bg-white transition-colors cursor-pointer"
                              title={language === 'ko' ? '게시글 삭제' : 'Delete Article'}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#EA580C] group-hover:translate-x-1 transition-transform">
                        <span>{language === 'ko' ? '읽기' : 'Read'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}

      </div>

      {/* Delete Post Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-rose-200 shadow-2xl space-y-4 text-left">
            <div className="flex items-center gap-2.5 text-rose-600 font-bold text-base">
              <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-rose-600" />
              </div>
              <span>{language === 'ko' ? '게시글 삭제 확인' : 'Delete Article'}</span>
            </div>

            <p className="text-xs text-[#5A4E42]">
              &ldquo;{postToDelete.title[language] || postToDelete.title.ko}&rdquo; {language === 'ko' ? '게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.' : 'Are you sure you want to delete this article?'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer transition-colors"
              >
                {language === 'ko' ? '취소' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  deletePost(postToDelete.id);
                  setPostToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'ko' ? '삭제 확정' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
