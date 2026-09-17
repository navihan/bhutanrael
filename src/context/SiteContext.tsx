import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SiteState,
  ThemeConfig,
  SeoConfig,
  SiteContent,
  Post,
  EventItem,
  BookItem,
  Language,
  AdminRole,
  AdminUser,
  AdminInvite
} from '../types';
import {
  defaultTheme,
  defaultSeo,
  defaultContent,
  defaultPosts,
  defaultEvents,
  defaultBooks
} from '../data/defaultData';

interface SiteContextType {
  state: SiteState;
  theme: ThemeConfig;
  seo: SeoConfig;
  content: SiteContent;
  posts: Post[];
  events: EventItem[];
  books: BookItem[];
  language: Language;
  isAdminOpen: boolean;
  isAdminAuthenticated: boolean;
  adminUsername: string;
  currentAdmin: AdminUser | null;
  adminUsers: AdminUser[];
  adminInvites: AdminInvite[];
  currentPath: string;
  adminLogin: (identifier: string, pass: string) => { success: boolean; message?: string };
  adminLogout: () => void;
  changeAdminPassword: (newPass: string) => void;
  inviteAdmin: (data: { email: string; name: string; role: AdminRole; tempPassword?: string }) => { success: boolean; invite: AdminInvite; message?: string };
  removeAdmin: (id: string) => { success: boolean; message?: string };
  updateAdmin: (user: AdminUser) => void;
  revokeInvite: (inviteId: string) => void;
  canEditPost: (post: Post) => boolean;
  canDeletePost: (post: Post) => boolean;
  editingPostTarget: Post | null;
  setEditingPostTarget: (post: Post | null) => void;
  openEditPost: (post: Post) => void;
  navigate: (path: string) => void;
  selectedPostForDetail: Post | null;
  selectedEventForRsvp: EventItem | null;
  setLanguage: (lang: Language) => void;
  setIsAdminOpen: (open: boolean) => void;
  setSelectedPostForDetail: (post: Post | null) => void;
  setSelectedEventForRsvp: (event: EventItem | null) => void;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  updateSeo: (seo: Partial<SeoConfig>) => void;
  updateContent: (content: Partial<SiteContent>) => void;
  addPost: (post: Omit<Post, 'id' | 'views'>) => Post;
  updatePost: (post: Post) => void;
  deletePost: (id: string) => void;
  incrementPostViews: (id: string) => void;
  resetToDefault: () => void;
  exportData: () => void;
  importData: (jsonStr: string) => boolean;
}

const STORAGE_KEY = 'bhutan_rm_site_data_v1';
const ADMIN_AUTH_KEY = 'bhutan_rm_admin_auth_v1';
const ADMIN_PWD_KEY = 'bhutan_rm_admin_pwd_v1';
const ADMIN_CURRENT_USER_KEY = 'bhutan_rm_current_admin_v1';
const ADMIN_USERS_KEY = 'bhutan_rm_admin_users_v1';
const ADMIN_INVITES_KEY = 'bhutan_rm_admin_invites_v1';
const DEFAULT_ADMIN_PWD = 'rael2026!';
const DEFAULT_ADMIN_EMAIL = 'navihan01@gmail.com';

const defaultAdminUsers: AdminUser[] = [
  {
    id: 'admin-master',
    email: 'navihan01@gmail.com',
    name: '최고 관리자 (navihan)',
    role: 'super_admin',
    password: 'rael2026!',
    status: 'active',
    lastLoginAt: '2026-09-16 12:00',
    invitedBy: '시스템 마스터',
    invitedAt: '2026-01-01'
  },
  {
    id: 'admin-bhutan-editor',
    email: 'bhutan.editor@rael.org',
    name: '부탄 지부 콘텐츠 에디터',
    role: 'admin',
    password: 'rael2026!',
    status: 'active',
    lastLoginAt: '2026-09-15 18:30',
    invitedBy: 'navihan01@gmail.com',
    invitedAt: '2026-08-15'
  },
  {
    id: 'admin-thimphu',
    email: 'thimphu.coord@gmail.com',
    name: '팀푸 지역 코디네이터',
    role: 'editor',
    password: 'rael2026!',
    status: 'active',
    lastLoginAt: '2026-09-14 10:00',
    invitedBy: 'navihan01@gmail.com',
    invitedAt: '2026-09-14'
  }
];

const defaultAdminInvites: AdminInvite[] = [
  {
    id: 'inv-sample-1',
    email: 'thimphu.coord@gmail.com',
    name: '팀푸 지역 코디네이터',
    role: 'editor',
    inviteCode: 'RAEL-THIMPHU-2026',
    status: 'pending',
    invitedAt: '2026-09-14',
    invitedBy: 'navihan01@gmail.com',
    tempPassword: 'rael2026!',
    expiresAt: '2026-10-14'
  }
];

export interface ParsedInviteUrlData {
  email: string;
  code?: string;
  temp?: string;
  name?: string;
  role?: AdminRole;
  inviter?: string;
}

export const parseInviteFromUrl = (): ParsedInviteUrlData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const href = window.location.href;
    const url = new URL(href);
    let token = url.searchParams.get('token');
    let email = url.searchParams.get('email');
    let invite = url.searchParams.get('invite');
    let temp = url.searchParams.get('temp');
    let name = url.searchParams.get('name');
    let role = url.searchParams.get('role');

    if (window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.split('?')[1];
      const hp = new URLSearchParams(hashQuery);
      if (!token) token = hp.get('token');
      if (!email) email = hp.get('email');
      if (!invite) invite = hp.get('invite');
      if (!temp) temp = hp.get('temp');
      if (!name) name = hp.get('name');
      if (!role) role = hp.get('role');
    }

    if (token) {
      try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(token))));
        if (decoded && decoded.email) {
          return {
            email: String(decoded.email).trim().toLowerCase(),
            code: decoded.code,
            temp: decoded.temp,
            name: decoded.name,
            role: decoded.role || 'admin',
            inviter: decoded.inviter
          };
        }
      } catch (e) {
        console.warn('Failed to parse invite token:', e);
      }
    }

    if (email) {
      return {
        email: decodeURIComponent(email).trim().toLowerCase(),
        code: invite ? decodeURIComponent(invite) : undefined,
        temp: temp ? decodeURIComponent(temp) : undefined,
        name: name ? decodeURIComponent(name) : undefined,
        role: role ? (decodeURIComponent(role) as AdminRole) : 'admin',
      };
    }
  } catch (e) {
    console.warn('Error reading URL params:', e);
  }
  return null;
};

const getInitialPath = (): string => {
  if (typeof window === 'undefined') return '/';
  const hash = window.location.hash.replace(/^#\/?/, '');
  const path = window.location.pathname.replace(/^\/+/, '');
  if (hash.startsWith('admin/login') || path.startsWith('admin/login')) {
    return 'admin/login';
  }
  return '/';
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('bhutan_rm_lang');
    return (saved === 'en' || saved === 'ko') ? saved : 'ko';
  });

  const [theme, setTheme] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_theme');
      return saved ? JSON.parse(saved) : defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  const [seo, setSeo] = useState<SeoConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_seo');
      return saved ? JSON.parse(saved) : defaultSeo;
    } catch {
      return defaultSeo;
    }
  });

  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.contact?.email || parsed.contact.email === 'bhutan@rael.org') {
          parsed.contact = { ...parsed.contact, email: 'navihan01@gmail.com' };
        }
        return parsed;
      }
      return defaultContent;
    } catch {
      return defaultContent;
    }
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_posts');
      return saved ? JSON.parse(saved) : defaultPosts;
    } catch {
      return defaultPosts;
    }
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_events');
      return saved ? JSON.parse(saved) : defaultEvents;
    } catch {
      return defaultEvents;
    }
  });

  const [books] = useState<BookItem[]>(defaultBooks);

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_USERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return defaultAdminUsers;
    } catch {
      return defaultAdminUsers;
    }
  });

  const [adminInvites, setAdminInvites] = useState<AdminInvite[]>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_INVITES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return defaultAdminInvites;
    } catch {
      return defaultAdminInvites;
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(ADMIN_CURRENT_USER_KEY);
      if (saved) return JSON.parse(saved);
      if (localStorage.getItem(ADMIN_AUTH_KEY) === 'true') {
        return defaultAdminUsers[0];
      }
      return null;
    } catch {
      return null;
    }
  });

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);
  const [isAdminOpen, setIsAdminOpenState] = useState(false);
  const [editingPostTarget, setEditingPostTarget] = useState<Post | null>(null);
  const [selectedPostForDetail, setSelectedPostForDetail] = useState<Post | null>(null);
  const [selectedEventForRsvp, setSelectedEventForRsvp] = useState<EventItem | null>(null);

  // Auto-register from URL invite params if present on mount/route change
  useEffect(() => {
    const inviteData = parseInviteFromUrl();
    if (inviteData && inviteData.email) {
      const emailLower = inviteData.email.toLowerCase();
      // Ensure exists in adminInvites
      setAdminInvites(prev => {
        const exists = prev.some(i => i.email.toLowerCase() === emailLower);
        if (exists) return prev;
        const newInv: AdminInvite = {
          id: `inv-url-${Date.now()}`,
          email: emailLower,
          name: inviteData.name || emailLower.split('@')[0],
          role: inviteData.role || 'admin',
          inviteCode: inviteData.code || 'RAEL-INVITE',
          status: 'pending',
          invitedAt: new Date().toISOString().split('T')[0],
          invitedBy: inviteData.inviter || '최고 관리자',
          tempPassword: inviteData.temp || DEFAULT_ADMIN_PWD,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };
        return [newInv, ...prev];
      });

      // Ensure exists in adminUsers
      setAdminUsers(prev => {
        const exists = prev.some(u => u.email.toLowerCase() === emailLower);
        if (exists) {
          // If already exists but has temporary password from invite, update it
          if (inviteData.temp) {
            return prev.map(u => u.email.toLowerCase() === emailLower ? { ...u, password: inviteData.temp! } : u);
          }
          return prev;
        }
        const newUser: AdminUser = {
          id: `admin-url-${Date.now()}`,
          email: emailLower,
          name: inviteData.name || emailLower.split('@')[0],
          role: inviteData.role || 'admin',
          password: inviteData.temp || DEFAULT_ADMIN_PWD,
          status: 'active',
          invitedAt: new Date().toISOString().split('T')[0],
          invitedBy: inviteData.inviter || '최고 관리자'
        };
        return [...prev, newUser];
      });
    }
  }, [currentPath]);

  // Sync admin users and invites
  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(adminUsers));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [adminUsers]);

  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_INVITES_KEY, JSON.stringify(adminInvites));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [adminInvites]);

  useEffect(() => {
    try {
      if (currentAdmin) {
        localStorage.setItem(ADMIN_CURRENT_USER_KEY, JSON.stringify(currentAdmin));
      } else {
        localStorage.removeItem(ADMIN_CURRENT_USER_KEY);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [currentAdmin]);

  // Listen to browser URL navigation and hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(getInitialPath());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (path: string) => {
    const cleanPath = path.replace(/^\/+/, '');
    if (cleanPath === 'admin/login') {
      window.location.hash = '/admin/login';
      setCurrentPath('admin/login');
    } else {
      window.location.hash = '';
      setCurrentPath('/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Secure setter for Admin Modal - prevents unauthorized access
  const setIsAdminOpen = (open: boolean) => {
    if (open && !isAdminAuthenticated) {
      navigate('admin/login');
      return;
    }
    setIsAdminOpenState(open);
  };

  const adminUsername = currentAdmin?.name 
    ? `${currentAdmin.name} (${currentAdmin.email})`
    : (currentAdmin?.email || DEFAULT_ADMIN_EMAIL);

  const adminLogin = (identifier: string, pass: string): { success: boolean; message?: string } => {
    const validIdentifier = identifier.trim().toLowerCase();
    const urlInvite = parseInviteFromUrl();

    // 1. Check if identifier matches a URL invitation token/params
    if (urlInvite && urlInvite.email.toLowerCase() === validIdentifier) {
      const matchesTemp = urlInvite.temp && pass === urlInvite.temp;
      const matchesCode = urlInvite.code && pass === urlInvite.code;
      if (matchesTemp || matchesCode) {
        const existing = adminUsers.find(u => u.email.toLowerCase() === validIdentifier);
        const activeUser: AdminUser = existing ? {
          ...existing,
          password: pass,
          status: 'active',
          lastLoginAt: new Date().toLocaleString()
        } : {
          id: `admin-${Date.now()}`,
          email: validIdentifier,
          name: urlInvite.name || validIdentifier.split('@')[0],
          role: urlInvite.role || 'admin',
          password: pass,
          status: 'active',
          lastLoginAt: new Date().toLocaleString(),
          invitedAt: new Date().toISOString().split('T')[0],
          invitedBy: urlInvite.inviter || '최고 관리자'
        };

        setAdminUsers(prev => [activeUser, ...prev.filter(u => u.email.toLowerCase() !== validIdentifier)]);
        setAdminInvites(prev => prev.map(inv => inv.email.toLowerCase() === validIdentifier ? { ...inv, status: 'accepted' } : inv));
        setCurrentAdmin(activeUser);
        setIsAdminAuthenticated(true);
        try {
          localStorage.setItem(ADMIN_AUTH_KEY, 'true');
          localStorage.setItem(ADMIN_CURRENT_USER_KEY, JSON.stringify(activeUser));
        } catch (e) {
          console.warn('LocalStorage error:', e);
        }
        return { success: true };
      }
    }

    // 2. Find among existing adminUsers
    let foundUser = adminUsers.find(u => 
      u.email.toLowerCase() === validIdentifier || 
      u.id.toLowerCase() === validIdentifier
    );

    // Fallback aliases for convenience
    if (!foundUser) {
      if (validIdentifier === 'admin' || validIdentifier === 'navihan01' || validIdentifier === 'navihan') {
        foundUser = adminUsers.find(u => u.id === 'admin-master') || adminUsers[0];
      }
    }

    // 3. If NOT found in adminUsers, check adminInvites
    if (!foundUser) {
      const foundInvite = adminInvites.find(inv => 
        inv.email.toLowerCase() === validIdentifier || 
        inv.inviteCode.toLowerCase() === validIdentifier
      );

      if (foundInvite) {
        const expectedTemp = foundInvite.tempPassword || DEFAULT_ADMIN_PWD;
        if (pass === expectedTemp || pass === foundInvite.inviteCode) {
          const newUser: AdminUser = {
            id: `admin-${Date.now()}`,
            email: foundInvite.email,
            name: foundInvite.name,
            role: foundInvite.role,
            password: pass,
            status: 'active',
            lastLoginAt: new Date().toLocaleString(),
            invitedAt: foundInvite.invitedAt,
            invitedBy: foundInvite.invitedBy
          };

          setAdminUsers(prev => [newUser, ...prev.filter(u => u.email.toLowerCase() !== newUser.email.toLowerCase())]);
          setAdminInvites(prev => prev.map(inv => inv.id === foundInvite.id ? { ...inv, status: 'accepted' } : inv));
          setCurrentAdmin(newUser);
          setIsAdminAuthenticated(true);
          try {
            localStorage.setItem(ADMIN_AUTH_KEY, 'true');
            localStorage.setItem(ADMIN_CURRENT_USER_KEY, JSON.stringify(newUser));
          } catch (e) {
            console.warn('LocalStorage error:', e);
          }
          return { success: true };
        } else {
          return {
            success: false,
            message: language === 'ko'
              ? '임시 비밀번호가 올바르지 않습니다. 전달받으신 초대 비밀번호를 확인해주세요.'
              : 'Invalid temporary password. Please check your invitation credentials.'
          };
        }
      }

      return { 
        success: false, 
        message: language === 'ko' 
          ? '등록되지 않은 관리자 계정입니다. 초대된 이메일 또는 관리자 계정을 확인해주세요.' 
          : 'Administrator account not found. Please check your invited email or ID.' 
      };
    }

    // 4. Validate password for foundUser
    // Check direct password, master password fallback, matching invite tempPassword, or URL invite temp
    const matchingInvite = adminInvites.find(inv => inv.email.toLowerCase() === foundUser?.email.toLowerCase());
    const isPasswordValid = 
      pass === foundUser.password || 
      (matchingInvite && (pass === matchingInvite.tempPassword || pass === matchingInvite.inviteCode)) ||
      (foundUser.id === 'admin-master' && (pass === localStorage.getItem(ADMIN_PWD_KEY) || pass === DEFAULT_ADMIN_PWD)) ||
      (urlInvite && urlInvite.email.toLowerCase() === validIdentifier && (pass === urlInvite.temp || pass === urlInvite.code));

    if (!isPasswordValid) {
      return { 
        success: false, 
        message: language === 'ko' 
          ? '비밀번호가 올바르지 않습니다.' 
          : 'Incorrect password.' 
      };
    }

    // Update lastLoginAt
    const nowFormatted = new Date().toLocaleString();
    const updatedUser: AdminUser = {
      ...foundUser,
      password: pass, // sync latest valid password
      lastLoginAt: nowFormatted,
      status: 'active'
    };

    setAdminUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentAdmin(updatedUser);
    setIsAdminAuthenticated(true);

    try {
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      localStorage.setItem(ADMIN_CURRENT_USER_KEY, JSON.stringify(updatedUser));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    return { success: true };
  };

  const adminLogout = () => {
    try {
      localStorage.removeItem(ADMIN_AUTH_KEY);
      localStorage.removeItem(ADMIN_CURRENT_USER_KEY);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    setIsAdminAuthenticated(false);
    setCurrentAdmin(null);
    setIsAdminOpenState(false);
  };

  const changeAdminPassword = (newPass: string) => {
    if (!newPass || newPass.length < 4) return;
    try {
      localStorage.setItem(ADMIN_PWD_KEY, newPass);
      if (currentAdmin) {
        const updated = { ...currentAdmin, password: newPass };
        setCurrentAdmin(updated);
        setAdminUsers(prev => prev.map(u => u.id === currentAdmin.id ? updated : u));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  };

  // Invite a new Administrator (or reissue credentials for existing invite)
  const inviteAdmin = (data: { email: string; name: string; role: AdminRole; tempPassword?: string }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    
    // Prevent re-inviting master admin
    if (cleanEmail === 'navihan01@gmail.com' && currentAdmin?.email !== 'navihan01@gmail.com') {
      return {
        success: false,
        invite: {} as AdminInvite,
        message: language === 'ko' ? '최고 관리자 계정은 초대할 수 없습니다.' : 'Cannot invite the master administrator.'
      };
    }

    const tempPwd = data.tempPassword || 'rael' + Math.floor(1000 + Math.random() * 9000) + '!';
    const code = 'RAEL-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    const now = new Date();
    const expires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const newInvite: AdminInvite = {
      id: `inv-${Date.now()}`,
      email: cleanEmail,
      name: data.name.trim(),
      role: data.role,
      inviteCode: code,
      status: 'pending',
      invitedAt: now.toISOString().split('T')[0],
      invitedBy: currentAdmin?.name || currentAdmin?.email || '최고 관리자',
      tempPassword: tempPwd,
      expiresAt: expires.toISOString().split('T')[0]
    };

    // If already exists in adminUsers, update credentials
    const existing = adminUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      const updatedExisting: AdminUser = {
        ...existing,
        name: data.name.trim(),
        role: data.role,
        password: tempPwd,
        status: 'active'
      };
      setAdminUsers(prev => prev.map(u => u.id === existing.id ? updatedExisting : u));
    } else {
      const newUser: AdminUser = {
        id: `admin-${Date.now()}`,
        email: cleanEmail,
        name: data.name.trim(),
        role: data.role,
        password: tempPwd,
        status: 'active',
        invitedAt: now.toISOString().split('T')[0],
        invitedBy: currentAdmin?.name || currentAdmin?.email || '최고 관리자'
      };
      setAdminUsers(prev => [...prev, newUser]);
    }

    // Update or add invite
    setAdminInvites(prev => [newInvite, ...prev.filter(i => i.email.toLowerCase() !== cleanEmail)]);

    return {
      success: true,
      invite: newInvite
    };
  };

  const removeAdmin = (id: string) => {
    if (currentAdmin?.id === id) {
      return {
        success: false,
        message: language === 'ko' ? '현재 접속 중인 본인 계정은 삭제할 수 없습니다.' : 'Cannot delete your own currently logged-in account.'
      };
    }

    const targetUser = adminUsers.find(u => u.id === id);
    setAdminUsers(prev => prev.filter(u => u.id !== id));
    if (targetUser) {
      setAdminInvites(prev => prev.filter(inv => inv.email.toLowerCase() !== targetUser.email.toLowerCase()));
    }
    return { success: true };
  };

  const updateAdmin = (user: AdminUser) => {
    setAdminUsers(prev => prev.map(u => u.id === user.id ? user : u));
    if (currentAdmin?.id === user.id) {
      setCurrentAdmin(user);
    }
  };

  const revokeInvite = (inviteId: string) => {
    const invite = adminInvites.find(inv => inv.id === inviteId);
    setAdminInvites(prev => prev.filter(inv => inv.id !== inviteId));
    if (invite) {
      // Also remove any inactive user with this email
      setAdminUsers(prev => prev.filter(u => u.email.toLowerCase() !== invite.email.toLowerCase() || u.id === 'admin-master'));
    }
  };

  // Author & Permission Checks
  const canEditPost = (post: Post): boolean => {
    if (!isAdminAuthenticated) return false;
    if (!currentAdmin) return true;
    if (currentAdmin.role === 'super_admin') return true;
    if (post.authorId && post.authorId === currentAdmin.id) return true;
    if (post.authorEmail && post.authorEmail.toLowerCase() === currentAdmin.email.toLowerCase()) return true;
    if (post.author && post.author.toLowerCase() === currentAdmin.name.toLowerCase()) return true;
    // If post has no assigned authorId (pre-existing post), allow admin role
    if (!post.authorId && currentAdmin.role === 'admin') return true;
    return false;
  };

  const canDeletePost = (post: Post): boolean => {
    if (!isAdminAuthenticated) return false;
    if (!currentAdmin) return true;
    if (currentAdmin.role === 'super_admin') return true;
    if (post.authorId && post.authorId === currentAdmin.id) return true;
    if (post.authorEmail && post.authorEmail.toLowerCase() === currentAdmin.email.toLowerCase()) return true;
    if (post.author && post.author.toLowerCase() === currentAdmin.name.toLowerCase()) return true;
    if (!post.authorId && currentAdmin.role === 'admin') return true;
    return false;
  };

  const openEditPost = (post: Post) => {
    setEditingPostTarget(post);
    setIsAdminOpen(true);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_theme', JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_seo', JSON.stringify(seo));
  }, [seo]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_content', JSON.stringify(content));
  }, [content]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_events', JSON.stringify(events));
  }, [events]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('bhutan_rm_lang', lang);
  };

  // Dynamically update CSS variables and document title
  useEffect(() => {
    document.documentElement.style.setProperty('--site-bg', theme.bgColor);
    document.documentElement.style.setProperty('--site-accent', theme.accentColor);
    document.body.style.backgroundColor = theme.bgColor;

    // Font family style
    if (theme.fontFamily === 'editorial') {
      document.body.style.fontFamily = "'Noto Sans KR', 'Plus Jakarta Sans', sans-serif";
    } else if (theme.fontFamily === 'cinzel') {
      document.body.style.fontFamily = "'Cinzel', 'Noto Sans KR', serif";
    } else {
      document.body.style.fontFamily = "'Plus Jakarta Sans', 'Noto Sans KR', sans-serif";
    }
  }, [theme]);

  useEffect(() => {
    const title = seo.metaTitle[language] || seo.metaTitle.ko;
    document.title = title;
  }, [seo, language]);

  const updateTheme = (newTheme: Partial<ThemeConfig>) => {
    setTheme(prev => ({ ...prev, ...newTheme }));
  };

  const updateSeo = (newSeo: Partial<SeoConfig>) => {
    setSeo(prev => ({ ...prev, ...newSeo }));
  };

  const updateContent = (newContent: Partial<SiteContent>) => {
    setContent(prev => ({ ...prev, ...newContent }));
  };

  const addPost = (newPostData: Omit<Post, 'id' | 'views'>): Post => {
    const authorName = newPostData.author?.trim() || currentAdmin?.name || (language === 'ko' ? '부탄 지부 운영위원회' : 'Bhutan RM Committee');
    const newPost: Post = {
      ...newPostData,
      id: `post-${Date.now()}`,
      views: 1,
      author: authorName,
      authorId: currentAdmin?.id || 'admin-master',
      authorEmail: currentAdmin?.email || DEFAULT_ADMIN_EMAIL,
      authorRole: currentAdmin?.role || 'super_admin'
    };
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  };

  const updatePost = (updated: Post) => {
    setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const incrementPostViews = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, views: p.views + 1 } : p));
  };

  const resetToDefault = () => {
    setTheme(defaultTheme);
    setSeo(defaultSeo);
    setContent(defaultContent);
    setPosts(defaultPosts);
    setEvents(defaultEvents);
    localStorage.removeItem(STORAGE_KEY + '_theme');
    localStorage.removeItem(STORAGE_KEY + '_seo');
    localStorage.removeItem(STORAGE_KEY + '_content');
    localStorage.removeItem(STORAGE_KEY + '_posts');
    localStorage.removeItem(STORAGE_KEY + '_events');
  };

  const exportData = () => {
    const data = {
      version: 2,
      exportDate: new Date().toISOString(),
      theme,
      seo,
      content,
      posts,
      events,
      adminUsers: adminUsers.map(({ password, ...rest }) => rest), // exclude raw passwords for security
      adminInvites
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bhutan_rm_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.theme) setTheme(parsed.theme);
      if (parsed.seo) setSeo(parsed.seo);
      if (parsed.content) setContent(parsed.content);
      if (Array.isArray(parsed.posts)) setPosts(parsed.posts);
      if (Array.isArray(parsed.events)) setEvents(parsed.events);
      return true;
    } catch (err) {
      console.error('Failed to import backup data', err);
      return false;
    }
  };

  const state: SiteState = {
    theme,
    seo,
    content,
    posts,
    events,
    books,
    language
  };

  return (
    <SiteContext.Provider
      value={{
        state,
        theme,
        seo,
        content,
        posts,
        events,
        books,
        language,
        isAdminOpen,
        isAdminAuthenticated,
        adminUsername,
        currentAdmin,
        adminUsers,
        adminInvites,
        currentPath,
        adminLogin,
        adminLogout,
        changeAdminPassword,
        inviteAdmin,
        removeAdmin,
        updateAdmin,
        revokeInvite,
        canEditPost,
        canDeletePost,
        editingPostTarget,
        setEditingPostTarget,
        openEditPost,
        navigate,
        selectedPostForDetail,
        selectedEventForRsvp,
        setLanguage,
        setIsAdminOpen,
        setSelectedPostForDetail,
        setSelectedEventForRsvp,
        updateTheme,
        updateSeo,
        updateContent,
        addPost,
        updatePost,
        deletePost,
        incrementPostViews,
        resetToDefault,
        exportData,
        importData
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
