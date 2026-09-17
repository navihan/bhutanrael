import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, Image as ImageIcon, Check, RefreshCw, Trash2, Link as LinkIcon, FileImage, Sparkles } from 'lucide-react';

interface ImageUploaderProps {
  id?: string;
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  recommendedSize?: string;
  aspectRatio?: 'video' | 'wide' | 'square' | 'auto';
  defaultValue?: string;
  language?: 'ko' | 'en';
  helperText?: string;
}

/**
 * Optimizes an image file via HTML5 Canvas into a high-quality JPEG/WEBP Data URL.
 * Automatically downscales ultra-high resolution camera photos (e.g. 10MB) to ~150-300KB
 * ensuring snappy previews and avoiding localStorage quota limits.
 */
async function processAndOptimizeImage(file: File, maxWidth = 1600, maxHeight = 1200, quality = 0.85): Promise<{ dataUrl: string; width: number; height: number; sizeBytes: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const rawUrl = reader.result as string;
          resolve({ dataUrl: rawUrl, width: img.width, height: img.height, sizeBytes: file.size });
          return;
        }

        // Draw image with smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = file.type === 'image/png' && file.size < 1024 * 1024 ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        
        // Approximate base64 size in bytes
        const sizeBytes = Math.round((dataUrl.length * 3) / 4);

        resolve({ dataUrl, width, height, sizeBytes });
      };
      img.onerror = () => reject(new Error('Failed to load image file.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  id,
  label,
  value,
  onChange,
  recommendedSize,
  aspectRatio = 'auto',
  defaultValue,
  language = 'ko',
  helperText
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [metaInfo, setMetaInfo] = useState<{ width?: number; height?: number; size?: number; name?: string } | null>(null);
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUploadedDataUrl = value && value.startsWith('data:image/');

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert(language === 'ko' ? '이미지 파일만 업로드할 수 있습니다 (JPG, PNG, WEBP, GIF, SVG).' : 'Please upload an image file (JPG, PNG, WEBP, GIF, SVG).');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await processAndOptimizeImage(file);
      onChange(result.dataUrl);
      setCustomUrlInput(result.dataUrl);
      setMetaInfo({
        width: result.width,
        height: result.height,
        size: result.sizeBytes,
        name: file.name
      });
    } catch (err) {
      console.error('Error processing image:', err);
      alert(language === 'ko' ? '이미지 처리 중 오류가 발생했습니다.' : 'Failed to process image file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const handleRemove = () => {
    if (defaultValue) {
      onChange(defaultValue);
      setCustomUrlInput(defaultValue);
    } else {
      onChange('');
      setCustomUrlInput('');
    }
    setMetaInfo(null);
  };

  const handleUrlApply = () => {
    if (customUrlInput.trim()) {
      onChange(customUrlInput.trim());
      setMetaInfo(null);
    }
  };

  const aspectClass = 
    aspectRatio === 'video' ? 'aspect-video' :
    aspectRatio === 'wide' ? 'aspect-21/9 sm:aspect-16/7' :
    aspectRatio === 'square' ? 'aspect-square' :
    'h-48 sm:h-56';

  return (
    <div id={id} className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-[#3B2F24]">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {recommendedSize && (
            <span className="text-[11px] text-[#8C7B6B]">
              {recommendedSize}
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowUrlFallback(!showUrlFallback)}
            className="text-[11px] text-[#A66E38] hover:text-[#EA580C] underline cursor-pointer flex items-center gap-1"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlFallback ? (language === 'ko' ? '업로드 모드로' : 'Upload Mode') : (language === 'ko' ? 'URL 링크 입력' : 'URL Link')}</span>
          </button>
        </div>
      </div>

      {helperText && (
        <p className="text-[11px] text-[#7A6B5B] leading-tight mb-1">
          {helperText}
        </p>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e.target.files)}
        className="hidden"
      />

      {/* Main Upload Box & Preview */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative rounded-xl border-2 transition-all overflow-hidden ${
          isDragging
            ? 'border-[#EA580C] bg-[#FFF7ED] ring-4 ring-[#EA580C]/20 shadow-md'
            : value
            ? 'border-[#D9CCBE] bg-[#FCFAF7]'
            : 'border-dashed border-[#C8B8A6] bg-[#F7F2EB] hover:bg-[#F2ECE2] hover:border-[#A89886]'
        }`}
      >
        {/* State 1: Image already exists */}
        {value ? (
          <div className="relative p-2.5">
            <div className={`w-full ${aspectClass} rounded-lg overflow-hidden relative bg-stone-900/10 border border-[#E0D4C5]`}>
              <img
                src={value}
                alt={label}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Status pill overlay */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium border border-white/20">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>
                  {isUploadedDataUrl
                    ? (language === 'ko' ? '사용자 직접 업로드 파일' : 'Uploaded Image')
                    : (language === 'ko' ? '기본/웹 이미지' : 'Standard Web Image')}
                </span>
                {metaInfo?.size && (
                  <span className="text-stone-300 ml-1">
                    ({formatBytes(metaInfo.size)})
                  </span>
                )}
              </div>

              {/* Hover/Tap Actions Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-lg bg-white/95 text-[#1E1915] text-xs font-bold shadow-md hover:bg-white flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4 text-[#EA580C]" />
                  <span>{language === 'ko' ? '새 이미지로 교체' : 'Replace Image'}</span>
                </button>

                {defaultValue && value !== defaultValue && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="px-3 py-2 rounded-lg bg-black/70 text-white text-xs font-semibold hover:bg-black/90 flex items-center gap-1 transition-colors cursor-pointer"
                    title={language === 'ko' ? '기본 이미지로 복원' : 'Reset to default'}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{language === 'ko' ? '기본값 복원' : 'Reset'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-2 rounded-lg bg-rose-600/90 text-white hover:bg-rose-700 transition-colors cursor-pointer"
                  title={language === 'ko' ? '이미지 삭제' : 'Remove Image'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom mini bar with quick actions */}
            <div className="mt-2 pt-1 flex items-center justify-between px-1 text-xs">
              <span className="text-[11px] text-[#6E5D4C] truncate max-w-xs">
                {metaInfo?.name || (isUploadedDataUrl ? (language === 'ko' ? '로컬 최적화 이미지' : 'Local optimized image') : value.slice(0, 45) + '...')}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#EA580C] hover:underline cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{language === 'ko' ? '다른 파일 선택' : 'Upload Another'}</span>
                </button>

                {defaultValue && value !== defaultValue && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="text-[11px] text-[#8C7B6B] hover:text-[#1E1915] cursor-pointer"
                  >
                    {language === 'ko' ? '기본값' : 'Default'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* State 2: No image, prompt to upload */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-8 flex flex-col items-center justify-center text-center cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-[#EAE0D3] group-hover:bg-[#E2D5C3] group-hover:scale-110 flex items-center justify-center text-[#EA580C] transition-all mb-3 shadow-2xs">
              {isProcessing ? (
                <RefreshCw className="w-6 h-6 animate-spin text-[#EA580C]" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>

            <p className="text-xs sm:text-sm font-bold text-[#2A231C]">
              {language === 'ko' ? '클릭하여 이미지 파일 선택 또는 여기에 드래그' : 'Click to select image or drag & drop here'}
            </p>
            <p className="text-[11px] text-[#7A6B5B] mt-1">
              JPG, PNG, WEBP, GIF, SVG (최대 10MB 자동 최적화)
            </p>
          </div>
        )}

        {/* Loading overlay when processing canvas */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center z-10">
            <RefreshCw className="w-7 h-7 text-[#EA580C] animate-spin mb-2" />
            <span className="text-xs font-bold text-[#1E1915]">
              {language === 'ko' ? '이미지 최적화 처리 중...' : 'Optimizing image...'}
            </span>
          </div>
        )}
      </div>

      {/* Secondary URL Input (if user toggled it) */}
      {showUrlFallback && (
        <div className="p-3 bg-white rounded-xl border border-[#DDD0C0] space-y-2 animate-in fade-in duration-200">
          <div className="text-[11px] font-bold text-[#55473A] flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>{language === 'ko' ? '웹 이미지 URL 링크로 직접 적용' : 'Apply External Web Image URL'}</span>
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              value={customUrlInput}
              onChange={(e) => setCustomUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 px-3 py-1.5 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
            />
            <button
              type="button"
              onClick={handleUrlApply}
              className="px-3 py-1.5 rounded-lg bg-[#2E251E] hover:bg-[#43372C] text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
            >
              {language === 'ko' ? 'URL 적용' : 'Apply URL'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
