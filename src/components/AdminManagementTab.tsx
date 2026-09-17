import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { AdminRole, AdminUser, AdminInvite } from '../types';
import {
  UserPlus,
  Users,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Check,
  Trash2,
  KeyRound,
  Mail,
  User,
  Clock,
  Sparkles,
  FileText,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  X
} from 'lucide-react';

export const AdminManagementTab: React.FC<{
  onNotification: (msg: string) => void;
}> = ({ onNotification }) => {
  const {
    adminUsers,
    adminInvites,
    currentAdmin,
    inviteAdmin,
    removeAdmin,
    updateAdmin,
    revokeInvite,
    posts,
    language,
    theme
  } = useSite();

  // Invite modal / form state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminRole>('admin');
  const [invitePassword, setInvitePassword] = useState('');
  const [lastInvitedResult, setLastInvitedResult] = useState<{
    invite: AdminInvite;
    loginUrl: string;
  } | null>(null);

  // Password reset modal state
  const [passwordResetTarget, setPasswordResetTarget] = useState<AdminUser | null>(null);
  const [newTargetPassword, setNewTargetPassword] = useState('');

  // Copy feedback states
  const [copiedInviteId, setCopiedInviteId] = useState<string | null>(null);
  const [copiedCredentials, setCopiedCredentials] = useState(false);

  // In-app deletion and error states (avoiding iframe-blocked window.confirm/alert)
  const [adminToDelete, setAdminToDelete] = useState<AdminUser | null>(null);
  const [inviteToRevoke, setInviteToRevoke] = useState<AdminInvite | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [inviteError, setInviteError] = useState<string | null>(null);

  // Generate random strong temporary password
  const generateRandomPassword = () => {
    const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
    let pass = 'rael';
    for (let i = 0; i < 4; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    pass += '!';
    setInvitePassword(pass);
  };

  const handleOpenInvite = () => {
    setInviteEmail('');
    setInviteName('');
    setInviteRole('admin');
    setInviteError(null);
    generateRandomPassword();
    setLastInvitedResult(null);
    setIsInviteOpen(true);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);

    const email = inviteEmail.trim().toLowerCase();
    const name = inviteName.trim();

    if (!email || !name) {
      setInviteError(language === 'ko' ? '이름과 초대 이메일을 모두 입력해주세요.' : 'Please enter both name and email.');
      return;
    }

    const tempPass = invitePassword.trim() || 'rael2026!';

    const res = inviteAdmin({
      email: email,
      name: name,
      role: inviteRole,
      tempPassword: tempPass
    });

    if (!res.success) {
      setInviteError(res.message || (language === 'ko' ? '초대에 실패했습니다.' : 'Failed to invite administrator.'));
      return;
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    
    let token = '';
    try {
      token = btoa(unescape(encodeURIComponent(JSON.stringify({
        email: res.invite.email,
        name: res.invite.name,
        role: res.invite.role,
        code: res.invite.inviteCode,
        temp: tempPass,
        inviter: currentAdmin?.name || '최고 관리자'
      }))));
    } catch (e) {
      console.warn('token gen error:', e);
    }

    const queryParams = new URLSearchParams({
      email: res.invite.email,
      invite: res.invite.inviteCode,
      name: res.invite.name,
      role: res.invite.role,
      temp: tempPass,
      token: token
    }).toString();

    const loginUrl = `${origin}${pathname}#/admin/login?${queryParams}`;

    setLastInvitedResult({
      invite: { ...res.invite, tempPassword: tempPass },
      loginUrl
    });

    onNotification(language === 'ko' ? `${res.invite.name} 관리자 초대 및 계정 생성 완료` : `Invited ${res.invite.name}`);
  };

  const handleCopyInviteLink = (invite: AdminInvite) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const tempPass = invite.tempPassword || 'rael2026!';

    let token = '';
    try {
      token = btoa(unescape(encodeURIComponent(JSON.stringify({
        email: invite.email,
        name: invite.name,
        role: invite.role,
        code: invite.inviteCode,
        temp: tempPass,
        inviter: invite.invitedBy || currentAdmin?.name || '최고 관리자'
      }))));
    } catch (e) {
      console.warn('token gen error:', e);
    }

    const queryParams = new URLSearchParams({
      email: invite.email,
      invite: invite.inviteCode,
      name: invite.name,
      role: invite.role,
      temp: tempPass,
      token: token
    }).toString();

    const loginUrl = `${origin}${pathname}#/admin/login?${queryParams}`;

    navigator.clipboard.writeText(loginUrl);
    setCopiedInviteId(invite.id);
    onNotification(language === 'ko' ? '초대 링크가 복사되었습니다.' : 'Invite link copied to clipboard.');
    setTimeout(() => setCopiedInviteId(null), 2500);
  };

  const handleCopyFullCredentials = () => {
    if (!lastInvitedResult) return;
    const { invite, loginUrl } = lastInvitedResult;
    const text = language === 'ko' 
      ? `[부탄 라엘리안 무브먼트 관리자 초대 안내]\n` +
        `이름: ${invite.name}\n` +
        `이메일(아이디): ${invite.email}\n` +
        `임시 비밀번호: ${invite.tempPassword}\n` +
        `역할: ${getRoleLabel(invite.role)}\n` +
        `로그인 접속 주소: ${loginUrl}\n` +
        `\n* 접속 후 바로 게시글을 작성하고 본인의 게시물을 수정 및 삭제하실 수 있습니다.`
      : `[Bhutan Raëlian Movement Admin Invitation]\n` +
        `Name: ${invite.name}\n` +
        `Email ID: ${invite.email}\n` +
        `Temp Password: ${invite.tempPassword}\n` +
        `Role: ${invite.role}\n` +
        `Login URL: ${loginUrl}\n`;

    navigator.clipboard.writeText(text);
    setCopiedCredentials(true);
    onNotification(language === 'ko' ? '초대 정보가 복사되었습니다.' : 'Credentials copied.');
    setTimeout(() => setCopiedCredentials(false), 2500);
  };

  const handleDeleteAdmin = (user: AdminUser) => {
    const isSelf = currentAdmin?.id === user.id || currentAdmin?.email.toLowerCase() === user.email.toLowerCase();
    if (isSelf) {
      onNotification(language === 'ko' ? '현재 로그인 중인 본인 계정은 삭제할 수 없습니다.' : 'Cannot delete your own account.');
      return;
    }
    setDeleteError(null);
    setAdminToDelete(user);
  };

  const confirmExecuteDeleteAdmin = () => {
    if (!adminToDelete) return;
    const res = removeAdmin(adminToDelete.id);
    if (res.success) {
      onNotification(language === 'ko' ? `"${adminToDelete.name}" 관리자가 삭제되었습니다.` : `Admin "${adminToDelete.name}" removed.`);
      setAdminToDelete(null);
      setDeleteError(null);
    } else {
      setDeleteError(res.message || (language === 'ko' ? '삭제에 실패했습니다.' : 'Failed to delete admin.'));
    }
  };

  const handleRevokeInvite = (invite: AdminInvite) => {
    setInviteToRevoke(invite);
  };

  const confirmExecuteRevokeInvite = () => {
    if (!inviteToRevoke) return;
    revokeInvite(inviteToRevoke.id);
    onNotification(language === 'ko' ? `"${inviteToRevoke.name}" 초대장이 취소/삭제되었습니다.` : `Invite for "${inviteToRevoke.name}" revoked.`);
    setInviteToRevoke(null);
  };

  const handleSaveResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordResetTarget || newTargetPassword.length < 4) {
      onNotification(language === 'ko' ? '비밀번호는 4자 이상이어야 합니다.' : 'Password must be at least 4 characters.');
      return;
    }
    updateAdmin({
      ...passwordResetTarget,
      password: newTargetPassword
    });
    onNotification(language === 'ko' ? `${passwordResetTarget.name} 비밀번호 변경 완료` : 'Password updated.');
    setPasswordResetTarget(null);
    setNewTargetPassword('');
  };

  const handleChangeRole = (user: AdminUser, newRole: AdminRole) => {
    if (user.id === 'admin-master' && newRole !== 'super_admin') {
      onNotification(language === 'ko' ? '기본 최고 관리자의 권한은 변경할 수 없습니다.' : 'Cannot demote the master super admin.');
      return;
    }
    updateAdmin({
      ...user,
      role: newRole
    });
    onNotification(language === 'ko' ? `${user.name} 권한이 변경되었습니다.` : `Role updated for ${user.name}`);
  };

  const getRoleLabel = (role: AdminRole) => {
    if (role === 'super_admin') return language === 'ko' ? '최고 관리자 (Super Admin)' : 'Super Admin';
    if (role === 'admin') return language === 'ko' ? '일반 관리자 (Admin)' : 'Admin';
    return language === 'ko' ? '콘텐츠 에디터 (Editor)' : 'Content Editor';
  };

  const getRoleBadge = (role: AdminRole) => {
    if (role === 'super_admin') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-700 border border-rose-500/30">
          <ShieldAlert className="w-3 h-3 text-rose-600" />
          <span>{language === 'ko' ? '최고 관리자' : 'Super Admin'}</span>
        </span>
      );
    }
    if (role === 'admin') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-800 border border-amber-500/30">
          <ShieldCheck className="w-3 h-3 text-amber-600" />
          <span>{language === 'ko' ? '일반 관리자' : 'Admin'}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-500/30">
        <Shield className="w-3 h-3 text-emerald-600" />
        <span>{language === 'ko' ? '콘텐츠 에디터' : 'Editor'}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner / Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-[#DDD0C0] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#8C7A68]">
            <span className="text-xs font-semibold">{language === 'ko' ? '총 등록 관리자' : 'Total Admins'}</span>
            <Users className="w-4 h-4 text-[#EA580C]" />
          </div>
          <div className="text-2xl font-bold font-display text-[#1E1915]">
            {adminUsers.length} <span className="text-xs font-normal text-[#8C7A68]">{language === 'ko' ? '명' : 'users'}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#DDD0C0] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#8C7A68]">
            <span className="text-xs font-semibold">{language === 'ko' ? '초대 대기 중' : 'Pending Invites'}</span>
            <Mail className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-display text-amber-600">
            {adminInvites.filter(i => i.status === 'pending').length} <span className="text-xs font-normal text-[#8C7A68]">{language === 'ko' ? '건' : 'invites'}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#DDD0C0] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#8C7A68]">
            <span className="text-xs font-semibold">{language === 'ko' ? '내가 작성한 글' : 'My Articles'}</span>
            <FileText className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-display text-[#1E1915]">
            {posts.filter(p => p.authorId === currentAdmin?.id || p.authorEmail === currentAdmin?.email || p.author === currentAdmin?.name).length}
            <span className="text-xs font-normal text-[#8C7A68]"> / {posts.length} {language === 'ko' ? '개' : 'posts'}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#DDD0C0] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#8C7A68]">
            <span className="text-xs font-semibold">{language === 'ko' ? '내 접속 권한' : 'My Session'}</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="pt-0.5">
            {currentAdmin ? getRoleBadge(currentAdmin.role) : <span className="text-xs font-bold text-stone-500">Guest</span>}
          </div>
        </div>
      </div>

      {/* Main Admin Section Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2] p-4 rounded-xl border border-[#E3D6C6]">
        <div>
          <h3 className="text-base font-bold text-[#1E1915] font-display flex items-center gap-2">
            <Users className="w-4 h-4 text-[#EA580C]" />
            <span>{language === 'ko' ? '관리자 팀 및 권한 초대 관리' : 'Admin Team & Invitation Management'}</span>
          </h3>
          <p className="text-xs text-[#7A6B5B] mt-0.5">
            {language === 'ko' 
              ? '팀원을 관리자로 초대하고, 신규 관리자가 작성한 게시글의 수정 및 삭제 권한을 부여합니다.' 
              : 'Invite new admins and empower them to post, edit, and delete their own publications.'}
          </p>
        </div>

        <button
          onClick={handleOpenInvite}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-xs hover:opacity-95 transition-all cursor-pointer whitespace-nowrap"
          style={{ backgroundColor: theme.accentColor }}
        >
          <UserPlus className="w-4 h-4" />
          <span>{language === 'ko' ? '새 관리자 초대하기' : 'Invite New Admin'}</span>
        </button>
      </div>

      {/* Invite Modal / Drawer */}
      {isInviteOpen && (
        <div className="bg-white rounded-2xl border-2 border-[#EA580C]/40 p-5 sm:p-6 shadow-lg space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-[#EAE0D2] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#EA580C]/10 flex items-center justify-center text-[#EA580C]">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1E1915]">
                  {language === 'ko' ? '새 관리자 초대 및 계정 생성' : 'Invite Administrator & Create Account'}
                </h4>
                <p className="text-[11px] text-[#7A6A5A]">
                  {language === 'ko' ? '초대된 관리자는 즉시 부여된 계정으로 로그인하여 글을 작성하고 관리할 수 있습니다.' : 'Invited members can immediately log in to create and manage their own articles.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => { setIsInviteOpen(false); setLastInvitedResult(null); }}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {!lastInvitedResult ? (
            <form onSubmit={handleSendInvite} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                    {language === 'ko' ? '이름 / 직책 *' : 'Full Name / Title *'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-[#A08E7E]" />
                    <input
                      type="text"
                      required
                      value={inviteName}
                      onChange={e => setInviteName(e.target.value)}
                      placeholder={language === 'ko' ? '예: 팀푸 지부장, 김라엘' : 'e.g. Karma Dorji, Editor'}
                      className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                    {language === 'ko' ? '초대 이메일 (로그인 ID) *' : 'Email Address (Login ID) *'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-[#A08E7E]" />
                    <input
                      type="email"
                      required
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      placeholder="admin@rael.org"
                      className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/40"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                    {language === 'ko' ? '관리자 권한 역할 (Role) *' : 'Role & Permissions *'}
                  </label>
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value as AdminRole)}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/40 font-medium"
                  >
                    <option value="admin">일반 관리자 (Admin) - 게시글 등록/본인 글 수정·삭제, 콘텐츠 관리</option>
                    <option value="editor">콘텐츠 에디터 (Editor) - 게시글 작성 및 본인 글 전용 수정·삭제</option>
                    <option value="super_admin">최고 관리자 (Super Admin) - 모든 관리자 초대·삭제 및 전 게시글 제어</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3B2F24] mb-1 flex items-center justify-between">
                    <span>{language === 'ko' ? '임시 비밀번호 설정' : 'Temporary Password'}</span>
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="text-[11px] text-[#EA580C] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{language === 'ko' ? '새 비밀번호 자동 생성' : 'Generate'}</span>
                    </button>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-[#A08E7E]" />
                    <input
                      type="text"
                      required
                      value={invitePassword}
                      onChange={e => setInvitePassword(e.target.value)}
                      placeholder="초기 비밀번호"
                      className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/40"
                    />
                  </div>
                </div>
              </div>

              {inviteError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-semibold">{inviteError}</span>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  {language === 'ko'
                    ? '초대 완료 즉시 해당 이메일과 비밀번호로 로그인 가능한 관리자 계정이 활성화되며, 전용 초대 링크가 생성됩니다. 신규 관리자는 본인이 등록한 게시글을 자유롭게 수정하고 삭제할 수 있습니다.'
                    : 'Invited administrators can immediately sign in with their temp password and manage their own created posts.'}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-white font-semibold text-xs sm:text-sm shadow-xs cursor-pointer flex items-center gap-1.5 hover:opacity-95 transition-opacity"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  <Check className="w-4 h-4" />
                  <span>{language === 'ko' ? '초대장 발송 및 계정 생성' : 'Create & Generate Invitation'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#EFE8DC] hover:bg-[#E2D6C6] text-[#4A3D31] font-semibold text-xs sm:text-sm cursor-pointer transition-colors"
                >
                  {language === 'ko' ? '취소' : 'Cancel'}
                </button>
              </div>
            </form>
          ) : (
            /* Invite Completed Box */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>{language === 'ko' ? '관리자 초대 계정이 성공적으로 등록되었습니다!' : 'Admin Invitation Created Successfully!'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-lg border border-emerald-100">
                  <div>
                    <span className="text-[#8C7A68]">{language === 'ko' ? '초대된 관리자' : 'Admin Name'}:</span>{' '}
                    <strong className="text-[#1E1915]">{lastInvitedResult.invite.name}</strong>
                  </div>
                  <div>
                    <span className="text-[#8C7A68]">{language === 'ko' ? '이메일 (ID)' : 'Email'}:</span>{' '}
                    <strong className="text-[#1E1915] font-mono">{lastInvitedResult.invite.email}</strong>
                  </div>
                  <div>
                    <span className="text-[#8C7A68]">{language === 'ko' ? '부여된 권한' : 'Role'}:</span>{' '}
                    {getRoleBadge(lastInvitedResult.invite.role)}
                  </div>
                  <div>
                    <span className="text-[#8C7A68]">{language === 'ko' ? '임시 비밀번호' : 'Temp Password'}:</span>{' '}
                    <strong className="text-emerald-700 font-mono text-xs">{lastInvitedResult.invite.tempPassword}</strong>
                  </div>
                </div>

                {/* Direct Login Link */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-[#5A4E42]">
                    {language === 'ko' ? '관리자 바로가기 초대 링크' : 'Direct Invitation Login Link'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={lastInvitedResult.loginUrl}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-emerald-200 rounded-lg text-emerald-900 font-mono select-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyInviteLink(lastInvitedResult.invite)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedInviteId === lastInvitedResult.invite.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{language === 'ko' ? '복사됨' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{language === 'ko' ? '링크 복사' : 'Copy Link'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Copy complete invitation text */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyFullCredentials}
                    className="px-4 py-2 rounded-lg bg-[#2D251F] hover:bg-[#3D332B] text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                  >
                    {copiedCredentials ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{language === 'ko' ? '초대 안내문 전체 복사 (카톡/메일 전송용)' : 'Copy Full Invite Instructions'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsInviteOpen(false);
                      setLastInvitedResult(null);
                    }}
                    className="px-3 py-2 rounded-lg bg-white border border-[#DDD0C0] text-[#5A4E42] text-xs font-semibold cursor-pointer"
                  >
                    {language === 'ko' ? '닫기' : 'Close'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Admin Users Table */}
      <div className="bg-white rounded-xl border border-[#DDD0C0] overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[#EFE7DC] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
            <h4 className="text-sm font-bold text-[#1E1915]">
              {language === 'ko' ? '등록된 관리자 목록' : 'Registered Administrators'} ({adminUsers.length})
            </h4>
          </div>
          <span className="text-[11px] text-[#8C7A68]">
            {language === 'ko' ? '게시글 작성자는 본인 게시글의 수정 및 삭제 권한을 갖습니다.' : 'Authors have full edit/delete privileges for their posts.'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#F6F0E7] border-b border-[#DDD0C0] text-[#635343] font-bold">
                <th className="py-3 px-4">{language === 'ko' ? '관리자' : 'Administrator'}</th>
                <th className="py-3 px-4">{language === 'ko' ? '역할 & 권한' : 'Role'}</th>
                <th className="py-3 px-4">{language === 'ko' ? '작성한 글' : 'Posts Authored'}</th>
                <th className="py-3 px-4">{language === 'ko' ? '최근 활동 / 초대일' : 'Last Active'}</th>
                <th className="py-3 px-4 text-right">{language === 'ko' ? '관리' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE7DC]">
              {adminUsers.map(user => {
                const userPosts = posts.filter(
                  p => p.authorId === user.id || p.authorEmail?.toLowerCase() === user.email.toLowerCase() || p.author === user.name
                );
                const isCurrentUser = currentAdmin?.id === user.id || currentAdmin?.email.toLowerCase() === user.email.toLowerCase();
                const isMaster = user.id === 'admin-master';

                return (
                  <tr key={user.id} className={`hover:bg-[#FCFAF7] transition-colors ${isCurrentUser ? 'bg-amber-50/40' : ''}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#EFE8DC] border border-[#DDD0C0] flex items-center justify-center font-bold text-xs text-[#5A4E42]">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-[#1E1915]">{user.name}</span>
                            {isCurrentUser && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-sm font-semibold">
                                {language === 'ko' ? '현재 접속' : 'You'}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#8C7A68] font-mono">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div>{getRoleBadge(user.role)}</div>
                        {currentAdmin?.role === 'super_admin' && !isMaster && (
                          <select
                            value={user.role}
                            onChange={e => handleChangeRole(user, e.target.value as AdminRole)}
                            className="text-[10px] px-2 py-0.5 bg-white border border-[#DDD0C0] rounded-sm text-[#5A4E42] cursor-pointer"
                          >
                            <option value="super_admin">최고 관리자</option>
                            <option value="admin">일반 관리자</option>
                            <option value="editor">콘텐츠 에디터</option>
                          </select>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-emerald-700 text-xs">
                          {userPosts.length}
                        </span>
                        <span className="text-[11px] text-[#8C7A68]">
                          {language === 'ko' ? '개 등록됨' : 'articles'}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-500 block">
                        {language === 'ko' ? '수정 및 삭제 가능' : 'Can edit & delete'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[#7A6A5A] text-xs">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Clock className="w-3 h-3 text-[#A08E7E]" />
                        <span>{user.lastLoginAt ? user.lastLoginAt : (user.invitedAt ? `초대됨: ${user.invitedAt}` : '-')}</span>
                      </div>
                      {user.invitedBy && (
                        <span className="text-[10px] text-[#A08E7E] block truncate max-w-xs">
                          by {user.invitedBy}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      {/* Password Reset */}
                      <button
                        onClick={() => {
                          setPasswordResetTarget(user);
                          setNewTargetPassword('');
                        }}
                        className="p-1.5 rounded-md hover:bg-[#F0E7DC] text-[#483B2F] transition-colors cursor-pointer inline-flex items-center gap-1 text-xs"
                        title={language === 'ko' ? '비밀번호 재설정' : 'Reset Password'}
                      >
                        <KeyRound className="w-3.5 h-3.5 text-stone-600" />
                        <span className="hidden sm:inline">{language === 'ko' ? '비번변경' : 'Password'}</span>
                      </button>

                      {/* Delete Admin */}
                      {!isCurrentUser && (
                        <button
                          type="button"
                          onClick={() => handleDeleteAdmin(user)}
                          className="p-1.5 rounded-md hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer inline-flex items-center gap-1 text-xs"
                          title={language === 'ko' ? '관리자 삭제' : 'Remove Admin'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{language === 'ko' ? '삭제' : 'Delete'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Invitations Section */}
      {adminInvites.length > 0 && (
        <div className="bg-white rounded-xl border border-[#DDD0C0] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-bold text-[#1E1915] flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-600" />
              <span>{language === 'ko' ? '발송된 초대장 목록' : 'Pending Invitations'} ({adminInvites.length})</span>
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {adminInvites.map(inv => (
              <div key={inv.id} className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE0D2] flex flex-col justify-between space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#1E1915]">{inv.name}</span>
                      {getRoleBadge(inv.role)}
                    </div>
                    <div className="text-[11px] text-[#8C7A68] font-mono">{inv.email}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRevokeInvite(inv)}
                    className="text-stone-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1"
                    title={language === 'ko' ? '초대장 삭제 / 취소' : 'Revoke invite'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[11px] text-rose-600 font-semibold">{language === 'ko' ? '삭제' : 'Delete'}</span>
                  </button>
                </div>

                <div className="text-[11px] text-[#7A6A5A] space-y-1">
                  <div>코드: <strong className="font-mono text-[#EA580C]">{inv.inviteCode}</strong></div>
                  {inv.tempPassword && (
                    <div>임시비밀번호: <strong className="font-mono text-emerald-700">{inv.tempPassword}</strong></div>
                  )}
                  <div className="text-[10px] text-stone-400">만료일: {inv.expiresAt} (by {inv.invitedBy})</div>
                </div>

                <div className="pt-2 border-t border-[#EAE0D2] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleCopyInviteLink(inv)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#EA580C] hover:underline cursor-pointer"
                  >
                    {copiedInviteId === inv.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">{language === 'ko' ? '링크 복사됨' : 'Link Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>{language === 'ko' ? '초대 링크 복사' : 'Copy Invite Link'}</span>
                      </>
                    )}
                  </button>

                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                    {inv.status === 'pending' ? (language === 'ko' ? '대기 중' : 'Pending') : inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {passwordResetTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-[#DDD0C0] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#1E1915] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#EA580C]" />
                <span>{language === 'ko' ? '관리자 비밀번호 재설정' : 'Reset Admin Password'}</span>
              </h4>
              <button
                onClick={() => setPasswordResetTarget(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#6A5A4A]">
              <strong>{passwordResetTarget.name}</strong> ({passwordResetTarget.email}) 관리자의 새 비밀번호를 설정합니다.
            </p>

            <form onSubmit={handleSaveResetPassword} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#3B2F24] mb-1">
                  {language === 'ko' ? '새 비밀번호 (4자 이상)' : 'New Password'}
                </label>
                <input
                  type="password"
                  required
                  value={newTargetPassword}
                  onChange={e => setNewTargetPassword(e.target.value)}
                  placeholder="새 비밀번호 입력"
                  className="w-full px-3 py-2 text-xs bg-[#FCFAF7] border border-[#DDD0C0] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]/40"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl text-white font-semibold text-xs shadow-xs cursor-pointer"
                  style={{ backgroundColor: theme.accentColor }}
                >
                  {language === 'ko' ? '비밀번호 변경 완료' : 'Save Password'}
                </button>
                <button
                  type="button"
                  onClick={() => setPasswordResetTarget(null)}
                  className="px-3 py-2 rounded-xl bg-stone-100 text-stone-600 text-xs font-semibold cursor-pointer"
                >
                  {language === 'ko' ? '취소' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Admin Confirmation Modal */}
      {adminToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-rose-200 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-rose-600 font-bold text-sm sm:text-base">
                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-rose-600" />
                </div>
                <span>{language === 'ko' ? '관리자 계정 삭제 확인' : 'Confirm Delete Admin'}</span>
              </div>
              <button
                type="button"
                onClick={() => { setAdminToDelete(null); setDeleteError(null); }}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-[#5A4E42] space-y-2">
              <p>
                <strong>{adminToDelete.name}</strong> ({adminToDelete.email}) 관리자 계정을 완전히 삭제하시겠습니까?
              </p>
              <div className="p-2.5 bg-rose-50/70 border border-rose-100 rounded-xl text-[11px] text-rose-800">
                {language === 'ko'
                  ? '※ 계정 삭제 시 해당 관리자는 더 이상 로그인할 수 없습니다. 이미 작성된 게시글은 안전하게 보존됩니다.'
                  : '※ The administrator will no longer be able to log in. Their authored articles remain preserved.'}
              </div>
            </div>

            {deleteError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setAdminToDelete(null); setDeleteError(null); }}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer transition-colors"
              >
                {language === 'ko' ? '취소' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={confirmExecuteDeleteAdmin}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'ko' ? '삭제 확정' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Revoke Invitation Confirmation Modal */}
      {inviteToRevoke && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-amber-200 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-amber-700 font-bold text-sm sm:text-base">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-amber-600" />
                </div>
                <span>{language === 'ko' ? '초대장 취소 / 삭제' : 'Revoke Invitation'}</span>
              </div>
              <button
                type="button"
                onClick={() => setInviteToRevoke(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-[#5A4E42] space-y-2">
              <p>
                <strong>{inviteToRevoke.name}</strong> ({inviteToRevoke.email}) 님에게 발송된 초대장을 삭제하시겠습니까?
              </p>
              <div className="p-2.5 bg-amber-50/70 border border-amber-100 rounded-xl text-[11px] text-amber-800">
                {language === 'ko'
                  ? '※ 삭제 시 해당 초대 링크와 발급된 임시 코드는 즉시 무효화됩니다.'
                  : '※ The invitation link and temporary code will immediately be invalidated.'}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setInviteToRevoke(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer transition-colors"
              >
                {language === 'ko' ? '취소' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={confirmExecuteRevokeInvite}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'ko' ? '초대장 삭제' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
