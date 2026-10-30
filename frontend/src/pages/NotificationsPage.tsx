import React, { useState } from 'react';
import { CheckCheck, Bell, MessageSquare, UserPlus, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { NotificationItem, NotificationType } from '@/types';

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    type: 'TASK_ASSIGNED',
    title: 'New Task Assignment',
    message: 'Sarah Chen assigned you to "Audit cookie SameSite policy for staging environments".',
    read: false,
    link: '/kanban',
    createdAt: '10 minutes ago',
  },
  {
    id: 'n-2',
    type: 'TASK_COMMENT',
    title: 'New Discussion Comment',
    message: 'Marcus Brody commented on "Migrate PostgreSQL schema to Prisma v6": Clean migration applied!',
    read: false,
    link: '/tasks',
    createdAt: '1 hour ago',
  },
  {
    id: 'n-3',
    type: 'UPCOMING_DEADLINE',
    title: 'Deadline Approaching',
    message: 'Task "Finalize Argon2id session expiration policy" is due in 24 hours.',
    read: true,
    link: '/calendar',
    createdAt: 'Yesterday',
  },
  {
    id: 'n-4',
    type: 'PROJECT_INVITATION',
    title: 'Workspace Access Granted',
    message: 'You have been granted Admin access to the Product & Design workspace.',
    read: true,
    link: '/dashboard',
    createdAt: '3 days ago',
  },
];

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'TASK_ASSIGNED':
        return <Bell className="w-4 h-4 text-[#007AFF]" />;
      case 'TASK_COMMENT':
        return <MessageSquare className="w-4 h-4 text-[#34C759]" />;
      case 'UPCOMING_DEADLINE':
        return <Clock className="w-4 h-4 text-[#FF9F0A]" />;
      default:
        return <UserPlus className="w-4 h-4 text-[#5856D6]" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">Notifications</h2>
          <p className="text-xs text-[#86868B] mt-0.5">
            Real-time updates regarding assignments, mentions, and project deadlines
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="w-4 h-4" /> Mark all read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <Card className="p-0 overflow-hidden">
        <div className="divide-y divide-[#E5E5EA]">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                item.read ? 'bg-white hover:bg-[#F5F5F7]/30' : 'bg-[#007AFF]/5 hover:bg-[#007AFF]/10'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white border border-[#E5E5EA] shadow-subtle shrink-0">
                {getNotificationIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold text-[#1D1D1F]">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-[#86868B] shrink-0">
                    {item.createdAt}
                  </span>
                </div>

                <p className="text-xs text-[#86868B] leading-relaxed">
                  {item.message}
                </p>

                {!item.read && (
                  <span className="inline-block mt-1 text-[10px] font-semibold text-[#007AFF]">
                    • Unread
                  </span>
                )}
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="p-12 text-center text-xs text-[#86868B]">
              No notifications at this time.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
