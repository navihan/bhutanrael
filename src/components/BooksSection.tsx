import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { BookItem } from '../types';
import { BookOpen, Download, CheckCircle, ExternalLink, Sparkles, FileText } from 'lucide-react';

export const BooksSection: React.FC = () => {
  const { books, language, theme } = useSite();
  const [downloadModalBook, setDownloadModalBook] = useState<BookItem | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(false);

  const handleDownloadClick = (book: BookItem) => {
    setDownloadModalBook(book);
  };

  const handleStartDownload = () => {
    setDownloadProgress(true);
    setTimeout(() => {
      setDownloadProgress(false);
      // Trigger simulation or actual link
      const element = document.createElement('a');
      element.setAttribute('href', downloadModalBook?.downloadUrl || '#');
      element.setAttribute('target', '_blank');
      element.setAttribute('rel', 'noopener noreferrer');
      element.click();
      setDownloadModalBook(null);
    }, 1200);
  };

  return (
    <section id="books" className="py-20 lg:py-28 bg-[#FAF7F2] border-b border-[#E8DFD3] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE8DC] text-[#6E5D4C] text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>{language === 'ko' ? '도서 무료 배포' : 'Free eBooks'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1E1915] font-display">
            {language === 'ko' ? '진실을 알리는 무료 전자책 다운로드' : 'Download Free eBooks by Raël'}
          </h2>
          <p className="text-base text-[#685746]">
            {language === 'ko' 
              ? '엘로힘의 메시지는 모든 인류에게 조건 없이 무료로 개방되어 있습니다. PDF로 즉시 다운로드하여 읽어보세요.'
              : 'The Elohim messages are freely accessible to all humankind without reservation. Download instant high-resolution PDF editions.'}
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {books.map(book => (
            <div
              key={book.id}
              className="bg-white rounded-2xl border border-[#E2D5C5] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-left p-6 sm:p-7"
            >
              <div className="space-y-4">
                {/* Book Cover Visual */}
                <div className="relative rounded-xl overflow-hidden shadow-md h-56 bg-stone-100 border border-[#DDD0C0]">
                  <img
                    src={book.coverImage}
                    alt={book.title[language]}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                    FREE PDF
                  </div>
                </div>

                {/* Info */}
                <div>
                  <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider mb-1">
                    {book.author}
                  </div>
                  <h3 className="text-lg font-bold text-[#1E1915] font-display leading-snug">
                    {book.title[language]}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#665646] mt-2 leading-relaxed line-clamp-3">
                    {book.description[language]}
                  </p>
                </div>

                {/* Metadata Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="text-[11px] bg-[#F4EDE3] text-[#5A4B3C] px-2.5 py-1 rounded-md font-medium">
                    {book.pageCount} {language === 'ko' ? '페이지' : 'pages'}
                  </span>
                  <span className="text-[11px] bg-[#F4EDE3] text-[#5A4B3C] px-2.5 py-1 rounded-md font-medium">
                    {book.languages.slice(0, 3).join(', ')}
                  </span>
                </div>
              </div>

              {/* Download Action Button */}
              <div className="pt-6 border-t border-[#EFE6DB] mt-6">
                <button
                  onClick={() => handleDownloadClick(book)}
                  className="w-full py-3 rounded-xl text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:opacity-95 transition-opacity cursor-pointer"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'ko' ? '무료 PDF 다운로드' : 'Download Free PDF'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Download Confirmation Modal */}
      {downloadModalBook && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] rounded-2xl max-w-md w-full p-6 text-left shadow-2xl border border-[#E0D3C3] space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-[#1E1915]">
                <FileText className="w-4 h-4 text-[#EA580C]" />
                <span>{language === 'ko' ? '전자책 무료 다운로드' : 'Free eBook Download'}</span>
              </div>
              <button
                onClick={() => setDownloadModalBook(null)}
                className="text-xs text-[#7A6B5B] hover:text-[#1E1915] cursor-pointer"
              >
                닫기
              </button>
            </div>

            <div>
              <h4 className="text-base font-bold text-[#1E1915] font-display">
                {downloadModalBook.title[language]}
              </h4>
              <p className="text-xs text-[#635343] mt-1">
                {language === 'ko' 
                  ? '부탄 라엘리안 무브먼트 공식 전자도서관에서 무료로 제공되는 정식 번역본입니다.' 
                  : 'Official free digital edition distributed by the Bhutan Raëlian Movement.'}
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#E3D6C6] text-xs text-[#483B2F] space-y-1">
              <div><strong>저자:</strong> {downloadModalBook.author}</div>
              <div><strong>형식:</strong> PDF (고화질 전자책)</div>
              <div><strong>비용:</strong> 100% 무료 (Free of Charge)</div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleStartDownload}
                disabled={downloadProgress}
                className="flex-1 py-2.5 rounded-xl text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                style={{ backgroundColor: theme.accentColor }}
              >
                <Download className="w-4 h-4" />
                <span>{downloadProgress ? (language === 'ko' ? '준비 중...' : 'Preparing...') : (language === 'ko' ? '다운로드 시작' : 'Start Download')}</span>
              </button>

              <button
                onClick={() => setDownloadModalBook(null)}
                className="px-4 py-2.5 rounded-xl bg-[#EFE8DC] text-[#4A3D30] text-xs sm:text-sm font-semibold hover:bg-[#E8DFD2] cursor-pointer"
              >
                {language === 'ko' ? '취소' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
