import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  KanbanSquare,
  BarChart3,
  Users2,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full max-w-6xl mx-auto px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E5E5EA] shadow-apple mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Sparkles className="w-3.5 h-3.5 text-[#007AFF]" />
          <span className="text-xs font-medium text-[#1D1D1F]">
            DevFlow 1.0 is now live for modern engineering teams
          </span>
        </div>

        {/* Apple-style typography */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#1D1D1F] max-w-4xl mx-auto leading-[1.08]">
          Your Projects. <br className="hidden sm:inline" />
          <span className="text-[#86868B]">Your Team.</span>{' '}
          <span className="text-[#007AFF]">Your Progress.</span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-[#86868B] max-w-2xl mx-auto font-normal leading-relaxed">
          The calm, precision developer productivity platform. Organize complex
          codebases, track sprints with interactive Kanban, and eliminate status meeting fatigue.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto shadow-apple-md"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto"
          >
            Explore Interactive Demo
          </Button>
        </div>

        {/* Micro guarantees */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#86868B]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#34C759]" /> No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#34C759]" /> 14-day free workspace
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#34C759]" /> Production-ready RBAC
          </span>
        </div>

        {/* Product Dashboard Preview Mockup */}
        <div className="mt-16 rounded-2xl border border-[#E5E5EA] bg-white p-2 sm:p-4 shadow-apple-lg max-w-5xl mx-auto overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#E5E5EA]/60 bg-[#F5F5F7]/50 rounded-xl mb-4 text-xs text-[#86868B]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF3B30]/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF9F0A]/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#34C759]/80" />
              <span className="ml-2 font-mono text-[11px] text-[#1D1D1F]">
                devflow.io/workspace/engineering
              </span>
            </div>
            <span className="font-medium text-[#007AFF]">Sprint 42 • Active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left p-2">
            <div className="rounded-xl border border-[#E5E5EA] bg-[#F5F5F7]/50 p-4">
              <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">
                Active Projects
              </span>
              <p className="text-2xl font-bold text-[#1D1D1F] mt-1">12</p>
              <div className="mt-2 text-[11px] text-[#34C759] font-medium">
                +3 delivered this month
              </div>
            </div>

            <div className="rounded-xl border border-[#E5E5EA] bg-[#F5F5F7]/50 p-4">
              <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">
                Sprint Velocity
              </span>
              <p className="text-2xl font-bold text-[#1D1D1F] mt-1">94%</p>
              <div className="mt-2 text-[11px] text-[#007AFF] font-medium">
                Ahead of scheduled target
              </div>
            </div>

            <div className="rounded-xl border border-[#E5E5EA] bg-[#F5F5F7]/50 p-4">
              <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">
                Completed Tasks
              </span>
              <p className="text-2xl font-bold text-[#1D1D1F] mt-1">184</p>
              <div className="mt-2 text-[11px] text-[#86868B]">
                28 pending review
              </div>
            </div>

            <div className="rounded-xl border border-[#E5E5EA] bg-[#F5F5F7]/50 p-4">
              <span className="text-[11px] font-semibold text-[#86868B] uppercase tracking-wider">
                Team Health
              </span>
              <p className="text-2xl font-bold text-[#34C759] mt-1">Optimal</p>
              <div className="mt-2 text-[11px] text-[#86868B]">
                0 blocked engineers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="w-full bg-white py-24 border-t border-[#E5E5EA]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="primary" className="mb-3">
              Crafted Architecture
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1D1D1F] tracking-tight">
              Built for how engineers actually work
            </h2>
            <p className="text-sm sm:text-base text-[#86868B] mt-3">
              Every detail is engineered for minimal cognitive load and instant responsiveness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hoverable className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center">
                <KanbanSquare className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#1D1D1F]">
                Fluid Drag & Drop Kanban
              </h3>
              <p className="text-xs text-[#86868B] leading-relaxed">
                4-column workflow with dnd-kit mechanics. Update status, priority,
                and deadlines instantly without page refreshes.
              </p>
            </Card>

            <Card hoverable className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#34C759]/10 text-[#248A3D] flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#1D1D1F]">
                Real-Time Productivity Analytics
              </h3>
              <p className="text-xs text-[#86868B] leading-relaxed">
                Recharts-powered task completion distributions, weekly output curves,
                and milestone progress backed by PostgreSQL metrics.
              </p>
            </Card>

            <Card hoverable className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#FF9F0A]/10 text-[#C97800] flex items-center justify-center">
                <Users2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#1D1D1F]">
                Team Collaboration & RBAC
              </h3>
              <p className="text-xs text-[#86868B] leading-relaxed">
                Granular Workspace permissions (Owner, Admin, Member), invite tokens,
                task comments, and audit activity feeds.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full py-24 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="default" className="mb-3">
            Workflow
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1D1D1F] tracking-tight">
            From idea to deployment in 3 steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5E5EA] shadow-apple flex items-center justify-center text-base font-bold text-[#007AFF] mx-auto">
              1
            </div>
            <h3 className="text-base font-semibold text-[#1D1D1F]">
              Create Your Workspace
            </h3>
            <p className="text-xs text-[#86868B] max-w-xs mx-auto">
              Set up dedicated environments with isolated databases for your squad or project.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5E5EA] shadow-apple flex items-center justify-center text-base font-bold text-[#007AFF] mx-auto">
              2
            </div>
            <h3 className="text-base font-semibold text-[#1D1D1F]">
              Plan & Assign Sprints
            </h3>
            <p className="text-xs text-[#86868B] max-w-xs mx-auto">
              Break down roadmap deliverables into high-priority tasks and assign owners.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#E5E5EA] shadow-apple flex items-center justify-center text-base font-bold text-[#007AFF] mx-auto">
              3
            </div>
            <h3 className="text-base font-semibold text-[#1D1D1F]">
              Ship With Confidence
            </h3>
            <p className="text-xs text-[#86868B] max-w-xs mx-auto">
              Track real-time burn-down charts, eliminate roadblocks, and celebrate velocity.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="w-full bg-white py-20 border-t border-[#E5E5EA]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-[#1D1D1F] tracking-tight">
            Ready to upgrade your team&apos;s flow state?
          </h2>
          <p className="text-sm text-[#86868B] mt-3 max-w-xl mx-auto">
            Join hundreds of engineering teams who replaced bloated project software with DevFlow.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="shadow-apple-md"
            >
              Start Free Today
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
