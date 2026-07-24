'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { TimetableResponse } from '@/lib/types';

export default function TimetablePage() {
  const [timetable, setTimetable] = useState<TimetableResponse | null>(null);
  const [week, setWeek] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTimetable() {
      setLoading(true);
      try {
        const res = await fetch(`/api/timetable?week=${week}`);
        if (!res.ok) {
          throw new Error(`Timetable error: ${res.status}`);
        }
        const data = await res.json();
        setTimetable(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load timetable');
      } finally {
        setLoading(false);
      }
    }

    fetchTimetable();
  }, [week]);

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="border-b border-text-secondary border-opacity-20 bg-surface p-4">
        <h1 className="text-2xl font-bold">Timetable</h1>
      </header>

      <main className="mx-auto max-w-4xl p-4">
        {/* Week Picker */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setWeek(Math.max(1, week - 1))}
            disabled={week === 1}
            className="rounded-md bg-surface px-4 py-2 text-text-secondary disabled:opacity-50"
          >
            ← Prev
          </button>
          <h2 className="text-lg font-semibold">
            Week {week} ({timetable?.date_range.start || 'N/A'} – {timetable?.date_range.end || 'N/A'})
          </h2>
          <button
            onClick={() => setWeek(Math.min(18, week + 1))}
            disabled={week === 18}
            className="rounded-md bg-surface px-4 py-2 text-text-secondary disabled:opacity-50"
          >
            Next →
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-text-secondary">Loading classes...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-danger">
            <p>{error}</p>
          </div>
        )}

        {timetable && (
          <div className="space-y-4">
            {/* Group by day */}
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
              const dayEntries = timetable.entries.filter(
                (e) => e.day_of_week === day
              );

              if (dayEntries.length === 0) return null;

              return (
                <div key={day}>
                  <h3 className="mb-2 font-semibold text-text-secondary">{day}</h3>
                  <div className="space-y-2">
                    {dayEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className={`rounded-lg border p-4 ${
                          entry.status === 'cancelled'
                            ? 'border-text-secondary border-opacity-20 bg-surface opacity-50 line-through'
                            : entry.attendance?.status === 'bunked'
                              ? 'border-danger border-opacity-30 bg-danger bg-opacity-5'
                              : 'border-text-secondary border-opacity-20 bg-surface-raised'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-bold">{entry.time_slot}</p>
                            <p className="font-semibold">{entry.subject.name}</p>
                            <p className="text-sm text-text-secondary">
                              {entry.room} · {entry.professor}
                            </p>
                          </div>
                          <div className="text-right">
                            {entry.status === 'cancelled' ? (
                              <span className="text-xs text-text-secondary">⊘ Cancelled</span>
                            ) : entry.attendance?.status === 'bunked' ? (
                              <span className="text-xs text-danger">🚫 Bunked</span>
                            ) : (
                              <span className="text-xs text-success">✓ Attended</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer Navigation */}
      <footer className="border-t border-text-secondary border-opacity-20 bg-surface p-4 mt-8">
        <div className="mx-auto flex max-w-4xl justify-around">
          <Link
            href="/"
            className="text-center text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            🏠 Home
          </Link>
          <Link
            href="/timetable"
            className="text-center text-sm font-medium text-text-primary"
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
