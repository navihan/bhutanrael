export type Language = 'ko' | 'en';

export type PostCategory = 'all' | 'announcement' | 'philosophy' | 'science' | 'embassy' | 'event';

export type AdminRole = 'super_admin' | 'admin' | 'editor';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  password?: string;
  status: 'active' | 'invited';
  invitedAt?: string;
  invitedBy?: string;
  lastLoginAt?: string;
  postCount?: number;
}

export interface AdminInvite {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  inviteCode: string;
  status: 'pending' | 'accepted' | 'expired';
  invitedAt: string;
  invitedBy: string;
  tempPassword?: string;
  expiresAt: string;
}

export interface Post {
  id: string;
  title: {
    ko: string;
    en: string;
  };
  summary: {
    ko: string;
    en: string;
  };
  content: {
    ko: string;
    en: string;
  };
  category: PostCategory;
  author: string;
  authorId?: string;
  authorEmail?: string;
  authorRole?: AdminRole;
  date: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  isFeatured?: boolean;
  status: 'published' | 'draft';
  views: number;
}

export interface BookItem {
  id: string;
  title: {
    ko: string;
    en: string;
  };
  author: string;
  description: {
    ko: string;
    en: string;
  };
  coverImage: string;
  downloadUrl: string;
  pageCount: number;
  languages: string[];
}

export interface EventItem {
  id: string;
  title: {
    ko: string;
    en: string;
  };
  location: {
    ko: string;
    en: string;
  };
  date: string;
  time: string;
  description: {
    ko: string;
    en: string;
  };
  isOnline: boolean;
  meetingLink?: string;
  status: 'upcoming' | 'completed';
}

export interface ThemeConfig {
  bgColor: string; // e.g., '#FAF7F2'
  accentColor: string; // e.g., '#EA580C'
  fontFamily: 'editorial' | 'sans' | 'cinzel';
  borderRadius: 'rounded-md' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl';
  showAnnouncement: boolean;
  announcementText: {
    ko: string;
    en: string;
  };
  announcementLink: string;
}

export interface SeoConfig {
  metaTitle: {
    ko: string;
    en: string;
  };
  metaDescription: {
    ko: string;
    en: string;
  };
  keywords: string;
  ogImageUrl: string;
  canonicalUrl: string;
  siteName: string;
  socialLinks: {
    facebook: string;
    youtube: string;
    twitter: string;
    instagram: string;
    telegram: string;
    email: string;
  };
}

export interface SiteContent {
  hero: {
    badge: { ko: string; en: string };
    title: { ko: string; en: string };
    subtitle: { ko: string; en: string };
    primaryCtaText: { ko: string; en: string };
    primaryCtaLink: string;
    secondaryCtaText: { ko: string; en: string };
    secondaryCtaLink: string;
    heroImage: string;
  };
  about: {
    title: { ko: string; en: string };
    subtitle: { ko: string; en: string };
    description: { ko: string; en: string };
    quote: { ko: string; en: string };
    quoteAuthor: { ko: string; en: string };
    aboutImage?: string;
  };
  embassy: {
    title: { ko: string; en: string };
    subtitle: { ko: string; en: string };
    description: { ko: string; en: string };
    highlightPoints: {
      ko: string[];
      en: string[];
    };
    embassyImage: string;
  };
  contact: {
    address: { ko: string; en: string };
    phone: string;
    email: string;
    meetingHours: { ko: string; en: string };
  };
}

export interface SiteState {
  theme: ThemeConfig;
  seo: SeoConfig;
  content: SiteContent;
  posts: Post[];
  events: EventItem[];
  books: BookItem[];
  language: Language;
}
