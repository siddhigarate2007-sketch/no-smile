import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'task' | 'project';
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
}

const EVENTS: CalendarEvent[] = [
  {
    id: 'e-1',
    title: 'Argon2id Session Expiry Policy',
    date: '2026-10-31',
    type: 'task',
    priority: 'URGENT',
  },
  {
    id: 'e-2',
    title: 'Design System 2.0 Code Freeze',
    date: '2026-11-04',
    type: 'project',
    priority: 'HIGH',
  },
  {
    id: 'e-3',
    title: 'Supertest API Auth Coverage',
    date: '2026-11-08',
    type: 'task',
    priority: 'MEDIUM',
  },
  {
    id: 'e-4',
    title: 'DevFlow Cloud Infrastructure Beta',
    date: '2026-11-15',
    type: 'project',
    priority: 'HIGH',
  },
];

export function CalendarPage() {
  const [currentMonth] = useState('November 2026');

  // Days in November 2026: starts on Sunday Nov 1
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">Calendar</h2>
          <p className="text-xs text-[#86868B] mt-0.5">
            Deliverable deadlines, release dates, and scheduled milestones
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-xl bg-white border border-[#E5E5EA] p-1">
            <button className="p-1 rounded-lg hover:bg-[#F5F5F7] text-[#86868B] hover:text-[#1D1D1F]">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-[#1D1D1F] px-2">
              {currentMonth}
            </span>
            <button className="p-1 rounded-lg hover:bg-[#F5F5F7] text-[#86868B] hover:text-[#1D1D1F]">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <Button variant="outline" size="sm">
            Today
          </Button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="rounded-2xl border border-[#E5E5EA] bg-white overflow-hidden shadow-apple">
        {/* Day-of-week header */}
        <div className="grid grid-cols-7 border-b border-[#E5E5EA] bg-[#F5F5F7]/60 text-center py-2.5 text-xs font-semibold text-[#86868B]">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#E5E5EA]">
          {daysInMonth.map((day) => {
            const dateStr = `2026-11-${String(day).padStart(2, '0')}`;
            const dayEvents = EVENTS.filter((e) => e.date === dateStr);

            return (
              <div
                key={day}
                className="min-h-[105px] p-2.5 transition-colors hover:bg-[#F5F5F7]/30 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold ${
                      day === 4
                        ? 'flex h-6 w-6 items-center justify-center rounded-full bg-[#007AFF] text-white'
                        : 'text-[#1D1D1F]'
                    }`}
                  >
                    {day}
                  </span>
                </div>

                <div className="space-y-1 mt-1 flex-1">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-1 px-1.5 rounded-lg text-[10px] font-medium bg-[#007AFF]/10 text-[#007AFF] border border-[#007AFF]/20 truncate"
                      title={ev.title}
                    >
                      {ev.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming milestones */}
      <Card>
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E5EA]">
          <h3 className="text-sm font-semibold text-[#1D1D1F]">Scheduled Milestones</h3>
          <Badge variant="primary">4 Deadlines this month</Badge>
        </div>
        <div className="divide-y divide-[#E5E5EA] pt-2">
          {EVENTS.map((ev) => (
            <div key={ev.id} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#F5F5F7] text-[#1D1D1F]">
                  <CalendarIcon className="w-4 h-4 text-[#007AFF]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1D1D1F]">{ev.title}</p>
                  <p className="text-[10px] text-[#86868B] capitalize">{ev.type} Milestone</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#86868B] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {ev.date}
                </span>
                <Badge variant={ev.priority === 'URGENT' ? 'danger' : 'warning'}>
                  {ev.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
