import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

async function getTimetableData(week: number) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  // Fetch timetable entries for the week
  const { data: entries } = await supabase
    .from('timetable_entries')
    .select('*')
    .eq('week', week)
    .order('day_of_week', { ascending: true })
    .order('session', { ascending: true });

  // Group by day of week
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const classesByDay: { [key: string]: any[] } = {};

  days.forEach(day => {
    classesByDay[day] = (entries || []).filter(e => e.day_of_week === day);
  });

  return classesByDay;
}

export default async function TimetablePage({ searchParams }: { searchParams: { week?: string } }) {
  const week = parseInt(searchParams.week || '1', 10);
  const classesByDay = await getTimetableData(week);

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
            disabled
            className="rounded-md bg-surface px-4 py-2 text-text-secondary disabled:opacity-50"
          >
            ← Prev
          </button>
          <h2 className="text-lg font-semibold">Week {week} (N/A – N/A)</h2>
          <button className="rounded-md bg-surface px-4 py-2 text-text-secondary hover:bg-surface-raised">
            Next →
          </button>
        </div>

        {/* Classes by Day */}
        <div className="space-y-4">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
            const dayClasses = classesByDay[day];

            if (!dayClasses || dayClasses.length === 0) return null;

            return (
              <div key={day}>
                <h3 className="mb-2 font-semibold text-text-secondary">{day}</h3>
                <div className="space-y-2">
                  {dayClasses.map((entry: any) => (
                    <div
                      key={entry.id}
                      className={`rounded-lg border p-4 ${
                        entry.status === 'cancelled'
                          ? 'border-text-secondary border-opacity-20 bg-surface opacity-50 line-through'
                          : 'border-text-secondary border-opacity-20 bg-surface-raised'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-bold">{entry.time_slot}</p>
                          <p className="font-semibold">{entry.subject_id}</p>
                          <p className="text-sm text-text-secondary">
                            {entry.room} · {entry.professor}
                          </p>
                        </div>
                        <div className="text-right">
                          {entry.status === 'cancelled' ? (
                            <span className="text-xs text-text-secondary">⊘ Cancelled</span>
                          ) : (
                            <span className="text-xs text-success">✓ Scheduled</span>
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
