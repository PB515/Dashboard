'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { DashboardResponse } from '@/lib/types';

export default function Home() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard');
        if (!res.ok) {
          throw new Error(`Dashboard error: ${res.status}`);
        }
        const data = await res.json();
        setDashboard(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-text-secondary border-t-accent"></div>
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-danger mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-accent px-4 py-2 text-background"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-text-secondary">No dashboard data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="border-b border-text-secondary border-opacity-20 bg-surface p-4">
        <h1 className="text-2xl font-bold">MBA Execution OS</h1>
        <p className="text-sm text-text-secondary">Gold Medal Track: Week 5+</p>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl space-y-6 p-4">
        {/* Next Class (Hero Card) */}
        {dashboard.next_class ? (
          <div className="rounded-lg border border-text-secondary border-opacity-20 bg-surface-raised p-6">
            <h2 className="mb-2 text-sm font-medium text-text-secondary">
              🎓 NEXT CLASS
            </h2>
            <h3 className="mb-2 text-2xl font-bold">
              {dashboard.next_class.subject.name}
            </h3>
            <p className="mb-4 text-sm text-text-secondary">
              {dashboard.next_class.room} · {dashboard.next_class.professor}
            </p>
            <p className="mb-6 text-base text-text-secondary">
              {dashboard.next_class.day_of_week} {dashboard.next_class.time_slot}
            </p>
            <div className="flex gap-4">
              <button className="flex-1 rounded-md border border-text-secondary border-opacity-30 bg-transparent px-4 py-2 text-text-secondary hover:bg-surface">
                ✓ Auto-logged
              </button>
              <button className="flex-1 rounded-md bg-danger px-4 py-2 text-background hover:opacity-90">
                Spend Bunk
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-surface-raised p-6 text-center">
            <p className="text-text-secondary">No classes today</p>
          </div>
        )}

        {/* Token Vault */}
        <div className="rounded-lg border border-text-secondary border-opacity-20 bg-surface-raised p-6">
          <h2 className="mb-4 text-lg font-semibold">Buffer Vault</h2>
          <div className="space-y-3">
            {dashboard.token_vault.map((subject) => {
              const statusColor =
                subject.status === 'abundant'
                  ? 'text-success'
                  : subject.status === 'caution'
                    ? 'text-warning'
                    : 'text-danger';
              const statusBg =
                subject.status === 'abundant'
                  ? 'bg-success bg-opacity-10'
                  : subject.status === 'caution'
                    ? 'bg-warning bg-opacity-10'
                    : 'bg-danger bg-opacity-10';

              return (
                <Link
                  key={subject.id}
                  href={`/subjects?id=${subject.id}`}
                  className="block rounded-md border border-text-secondary border-opacity-20 bg-surface p-3 hover:bg-surface hover:bg-opacity-70"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">
                        {subject.code} ({subject.credits}cr)
                      </p>
                      <div className="mt-1 h-2 w-full rounded-full bg-surface-raised">
                        <div
                          className={`h-2 rounded-full ${statusBg}`}
                          style={{
                            width: `${(subject.tokens_remaining / subject.tokens_max) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <p className={`text-xs mt-1 ${statusColor}`}>
                        {subject.tokens_remaining}/{subject.tokens_max} tokens
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Pending Tasks */}
        {(dashboard.pending_tasks.urgent.length > 0 ||
          dashboard.pending_tasks.momentum.length > 0) && (
          <div className="rounded-lg border border-text-secondary border-opacity-20 bg-surface-raised p-6">
            <h2 className="mb-4 text-lg font-semibold">Pending Tasks</h2>

            {dashboard.pending_tasks.urgent.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-medium text-danger">
                  🔴 URGENT GAPS
                </h3>
                <div className="space-y-2">
                  {dashboard.pending_tasks.urgent.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-md border border-danger border-opacity-20 bg-danger bg-opacity-5 p-3"
                    >
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-text-secondary">
                        Quality: {task.quality_score || 'N/A'}/100 | Due:{' '}
                        {task.deadline || 'TBD'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {dashboard.pending_tasks.momentum.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-medium text-success">
                  🟢 MOMENTUM
                </h3>
                <div className="space-y-2">
                  {dashboard.pending_tasks.momentum.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-md border border-success border-opacity-20 bg-success bg-opacity-5 p-3"
                    >
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-text-secondary">
                        Quality: {task.quality_score || 'N/A'}/100
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Gold Medal Status */}
        <div className="rounded-lg border border-text-secondary border-opacity-20 bg-surface-raised p-6">
          <h2 className="mb-4 text-lg font-semibold">📊 Gold Medal Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-secondary">Earned CGPA</p>
              <p className="text-2xl font-bold">
                {dashboard.gold_medal_status.earned_cgpa}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Projected</p>
              <p className="text-2xl font-bold">
                {dashboard.gold_medal_status.projected_cgpa.low}–
                {dashboard.gold_medal_status.projected_cgpa.high}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Target</p>
              <p className="text-2xl font-bold">
                {dashboard.gold_medal_status.target_cgpa}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Gap</p>
              <p
                className={`text-2xl font-bold ${
                  dashboard.gold_medal_status.gap.status === 'on_track'
                    ? 'text-success'
                    : 'text-danger'
                }`}
              >
                {dashboard.gold_medal_status.gap.high > 0 ? '+' : ''}
                {dashboard.gold_medal_status.gap.high}
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div>
              <p className="text-xs text-text-secondary">Mastery</p>
              <div className="mt-1 h-2 rounded-full bg-surface">
                <div
                  className="h-2 rounded-full bg-success"
                  style={{
                    width: `${dashboard.gold_medal_status.mastery_percent}%`,
                  }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-text-secondary">
              Execution Risk:{' '}
              <span
                className={
                  dashboard.gold_medal_status.execution_risk === 'low'
                    ? 'text-success'
                    : dashboard.gold_medal_status.execution_risk === 'medium'
                      ? 'text-warning'
                      : 'text-danger'
                }
              >
                {dashboard.gold_medal_status.execution_risk.toUpperCase()}
              </span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="border-t border-text-secondary border-opacity-20 bg-surface p-4">
        <div className="mx-auto flex max-w-4xl justify-around">
          <Link
            href="/"
            className="text-center text-sm font-medium text-text-primary"
          >
            🏠 Home
          </Link>
          <Link
            href="/timetable"
            className="text-center text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            📅 Timetable
          </Link>
          <Link
            href="/subjects"
            className="text-center text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            📊 Subjects
          </Link>
        </div>
      </footer>
    </div>
  );
}
