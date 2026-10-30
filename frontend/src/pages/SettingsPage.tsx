import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

export function SettingsPage() {
  const { currentWorkspace } = useAuth();
  const [wsName, setWsName] = useState(currentWorkspace?.name || 'DevFlow Engineering');
  const [wsDesc, setWsDesc] = useState(currentWorkspace?.description || 'Core platform engineering and cloud infrastructure.');
  const [isSaved, setIsSaved] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  // Notification toggles
  const [emailDigest, setEmailDigest] = useState(true);
  const [taskAssignments, setTaskAssignments] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);

  const handleSaveWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleDeleteWorkspace = () => {
    if (deleteConfirmationText === currentWorkspace?.name) {
      alert('Workspace successfully deleted.');
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">Settings</h2>
        <p className="text-xs text-[#86868B] mt-0.5">
          Configure workspace preferences, notifications, and administrative controls
        </p>
      </div>

      {/* Workspace Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Workspace Configuration</CardTitle>
          <CardDescription>
            Settings for {currentWorkspace?.name || 'the active workspace'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveWorkspace} className="space-y-4">
            <Input
              label="Workspace Name"
              value={wsName}
              onChange={(e) => setWsName(e.target.value)}
              required
            />

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-medium text-[#1D1D1F]">
                Workspace Description
              </label>
              <textarea
                rows={2}
                value={wsDesc}
                onChange={(e) => setWsDesc(e.target.value)}
                className="w-full rounded-xl border border-[#E5E5EA] bg-white px-3.5 py-2 text-xs text-[#1D1D1F] placeholder:text-[#86868B] focus:border-[#007AFF] focus:outline-none transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {isSaved ? (
                <span className="text-xs text-[#34C759] flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Workspace saved!
                </span>
              ) : <div />}
              <Button type="submit" size="sm">
                Save Workspace
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Preferences</CardTitle>
          <CardDescription>
            Choose how DevFlow notifies you of critical sprint events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#F5F5F7]/60 border border-[#E5E5EA] cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-[#1D1D1F]">Task Assignment Alerts</p>
              <p className="text-[11px] text-[#86868B]">
                Receive instant notifications when an engineer delegates a task to you
              </p>
            </div>
            <input
              type="checkbox"
              checked={taskAssignments}
              onChange={(e) => setTaskAssignments(e.target.checked)}
              className="h-4 w-4 rounded text-[#007AFF] focus:ring-[#007AFF]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[#F5F5F7]/60 border border-[#E5E5EA] cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-[#1D1D1F]">Deadline Reminders</p>
              <p className="text-[11px] text-[#86868B]">
                Alert me 24 hours before a sprint milestone expires
              </p>
            </div>
            <input
              type="checkbox"
              checked={deadlineReminders}
              onChange={(e) => setDeadlineReminders(e.target.checked)}
              className="h-4 w-4 rounded text-[#007AFF] focus:ring-[#007AFF]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[#F5F5F7]/60 border border-[#E5E5EA] cursor-pointer">
            <div>
              <p className="text-xs font-semibold text-[#1D1D1F]">Weekly Velocity Digest</p>
              <p className="text-[11px] text-[#86868B]">
                A weekly summary of shipped features, burn-down metrics, and team health
              </p>
            </div>
            <input
              type="checkbox"
              checked={emailDigest}
              onChange={(e) => setEmailDigest(e.target.checked)}
              className="h-4 w-4 rounded text-[#007AFF] focus:ring-[#007AFF]"
            />
          </label>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-[#FF3B30]/30 bg-[#FF3B30]/5">
        <CardHeader>
          <CardTitle className="text-base text-[#FF3B30] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently delete this workspace and all associated projects, tasks, and audit logs.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between pt-2">
          <p className="text-xs text-[#86868B]">
            This action is irreversible and requires Workspace Owner authorization.
          </p>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 className="w-4 h-4" /> Delete Workspace
          </Button>
        </CardContent>
      </Card>

      {/* Delete Workspace Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Workspace Deletion"
        description="This action cannot be undone. All project files, tasks, and database records will be erased."
      >
        <div className="space-y-4">
          <p className="text-xs text-[#1D1D1F]">
            To confirm, please type{' '}
            <strong className="font-mono text-[#FF3B30]">{currentWorkspace?.name}</strong>{' '}
            below:
          </p>
          <Input
            placeholder={currentWorkspace?.name}
            value={deleteConfirmationText}
            onChange={(e) => setDeleteConfirmationText(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={deleteConfirmationText !== currentWorkspace?.name}
              onClick={handleDeleteWorkspace}
            >
              Permanently Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
