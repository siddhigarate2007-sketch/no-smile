import React, { useState } from 'react';
import { UserPlus, Mail, Shield, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { WorkspaceRole } from '@/types';

interface MemberItem {
  id: string;
  name: string;
  email: string;
  role: WorkspaceRole;
  joinedAt: string;
}

const INITIAL_MEMBERS: MemberItem[] = [
  {
    id: 'm-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@devflow.io',
    role: 'OWNER',
    joinedAt: '2026-09-01',
  },
  {
    id: 'm-2',
    name: 'Sarah Chen',
    email: 'sarah.chen@devflow.io',
    role: 'ADMIN',
    joinedAt: '2026-09-12',
  },
  {
    id: 'm-3',
    name: 'Marcus Brody',
    email: 'marcus.brody@devflow.io',
    role: 'MEMBER',
    joinedAt: '2026-10-04',
  },
  {
    id: 'm-4',
    name: 'Elena Rostova',
    email: 'elena.rostova@devflow.io',
    role: 'MEMBER',
    joinedAt: '2026-10-15',
  },
];

export function TeamPage() {
  const [members, setMembers] = useState<MemberItem[]>(INITIAL_MEMBERS);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<WorkspaceRole>('MEMBER');
  const [generatedInviteLink, setGeneratedInviteLink] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    // Simulate token generation with 7-day expiration
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const link = `${window.location.origin}/invite?token=${token}`;
    setGeneratedInviteLink(link);

    // Also add to member list
    const newMember: MemberItem = {
      id: 'm-' + Date.now(),
      name: inviteEmail.split('@')[0].replace('.', ' '),
      email: inviteEmail,
      role: inviteRole,
      joinedAt: new Date().toISOString().split('T')[0],
    };
    setMembers([...members, newMember]);
    setInviteEmail('');
  };

  const handleCopyLink = () => {
    if (generatedInviteLink) {
      navigator.clipboard.writeText(generatedInviteLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleRoleChange = (memberId: string, nextRole: WorkspaceRole) => {
    setMembers(
      members.map((m) => (m.id === memberId ? { ...m, role: nextRole } : m))
    );
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter((m) => m.id !== memberId));
  };

  const getRoleBadge = (role: WorkspaceRole) => {
    switch (role) {
      case 'OWNER':
        return <Badge variant="primary">Owner</Badge>;
      case 'ADMIN':
        return <Badge variant="warning">Admin</Badge>;
      default:
        return <Badge variant="default">Member</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">Team Members</h2>
          <p className="text-xs text-[#86868B] mt-0.5">
            Manage engineers, invitations, and role-based workspace permissions
          </p>
        </div>
        <Button size="sm" onClick={() => { setIsInviteOpen(true); setGeneratedInviteLink(null); }}>
          <UserPlus className="w-4 h-4" /> Invite Member
        </Button>
      </div>

      {/* Members List Table */}
      <div className="rounded-2xl border border-[#E5E5EA] bg-white overflow-hidden shadow-apple">
        <div className="divide-y divide-[#E5E5EA]">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4.5 hover:bg-[#F5F5F7]/40 transition-colors gap-4"
            >
              <div className="flex items-center gap-3.5">
                <Avatar name={member.name} size="md" />
                <div>
                  <h4 className="text-sm font-semibold text-[#1D1D1F]">
                    {member.name}
                  </h4>
                  <p className="text-xs text-[#86868B]">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#86868B] hidden sm:inline">
                  Joined {member.joinedAt}
                </span>

                {getRoleBadge(member.role)}

                {member.role !== 'OWNER' && (
                  <select
                    value={member.role}
                    onChange={(e) =>
                      handleRoleChange(member.id, e.target.value as WorkspaceRole)
                    }
                    className="h-8 px-2 rounded-lg bg-[#F5F5F7] border border-[#E5E5EA] text-xs text-[#1D1D1F] focus:border-[#007AFF] focus:outline-none"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                )}

                {member.role !== 'OWNER' && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-xs text-[#FF3B30] hover:underline px-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invite Team Member"
        description="Send a secure workspace invitation with role assignment"
      >
        {generatedInviteLink ? (
          <div className="space-y-4">
            <div className="p-3 bg-[#34C759]/10 rounded-xl border border-[#34C759]/20 text-xs text-[#248A3D]">
              Member invitation generated! Copy the link below to share with your colleague.
            </div>

            <div className="flex items-center gap-2">
              <input
                readOnly
                value={generatedInviteLink}
                className="w-full h-10 px-3 rounded-xl border border-[#E5E5EA] bg-[#F5F5F7] text-xs font-mono text-[#1D1D1F]"
              />
              <Button size="sm" onClick={handleCopyLink}>
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {isCopied ? 'Copied' : 'Copy'}
              </Button>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" variant="outline" onClick={() => setIsInviteOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleInvite} className="space-y-4">
            <Input
              label="Colleague's Work Email"
              type="email"
              placeholder="engineer@devflow.io"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />

            <Select
              label="Assigned Role"
              options={[
                { label: 'Member (Read & Execute)', value: 'MEMBER' },
                { label: 'Admin (Manage projects & team)', value: 'ADMIN' },
              ]}
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as WorkspaceRole)}
            />

            <div className="p-3 bg-[#F5F5F7] rounded-xl text-[11px] text-[#86868B] space-y-1">
              <span className="font-semibold text-[#1D1D1F] block">Role Permissions:</span>
              <p>• <strong>Member:</strong> Access assigned tasks, comment, update sprint statuses.</p>
              <p>• <strong>Admin:</strong> Create projects, manage team memberships and settings.</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsInviteOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Generate Invitation
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
