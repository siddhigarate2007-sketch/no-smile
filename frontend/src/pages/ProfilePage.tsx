import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { CheckCircle2, Shield } from 'lucide-react';

export function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Alex Rivera');
  const [bio, setBio] = useState(user?.bio || 'Staff Software Architect & Engineering Lead at DevFlow.');
  const [isSaved, setIsSaved] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      setPasswordSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSaved(false), 2500);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">User Profile</h2>
        <p className="text-xs text-[#86868B] mt-0.5">
          Manage your personal details, bio, and login credentials
        </p>
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Information</CardTitle>
          <CardDescription>Update your public display information and avatar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div className="flex items-center gap-4 pb-2">
              <Avatar name={name} size="xl" />
              <div>
                <Button variant="outline" size="sm" type="button">
                  Change Photo
                </Button>
                <p className="text-[10px] text-[#86868B] mt-1.5">
                  JPG, GIF or PNG. Max size 2MB.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                value={user?.email || 'alex@devflow.io'}
                disabled
                helperText="Email addresses are managed via organization SSO"
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-medium text-[#1D1D1F]">About Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl border border-[#E5E5EA] bg-white px-3.5 py-2 text-xs text-[#1D1D1F] placeholder:text-[#86868B] focus:border-[#007AFF] focus:outline-none transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {isSaved ? (
                <span className="text-xs text-[#34C759] flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
                </span>
              ) : <div />}
              <Button type="submit" size="sm">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security & Password Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#007AFF]" /> Security & Password
          </CardTitle>
          <CardDescription>
            Change your password using secure Argon2id cryptographic hashing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="New Password"
                type="password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {passwordSaved ? (
                <span className="text-xs text-[#34C759] flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Password changed securely!
                </span>
              ) : <div />}
              <Button type="submit" size="sm" variant="secondary">
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
