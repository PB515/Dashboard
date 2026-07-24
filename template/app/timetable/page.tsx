import Link from 'next/link';

const mockClasses = {
  Monday: [
    {
      id: '1',
      time_slot: '09:00 AM - 10:30 AM',
      subject: { name: 'Financial Risk Analysis' },
      room: 'Lab 101',
      professor: 'Dr. Patel',
      status: 'scheduled',
      attendance: { status: 'attended' },
    },
    {
      id: '2',
      time_slot: '11:00 AM - 12:30 PM',
      subject: { name: 'Strategic Marketing' },
      room: 'Room 205',
      professor: 'Prof. Shah',
      status: 'scheduled',
      attendance: { status: 'attended' },
    },
  ],
  Tuesday: [
    {
      id: '3',
      time_slot: '10:00 AM - 11:30 AM',
      subject: { name: 'Heritage and Wisdom' },
      room: 'Auditorium',
      professor: 'Dr. Kumar',
      status: 'scheduled',
      attendance: { status: 'bunked' },
    },
  ],
  Wednesday: [
    {
      id: '4',
      time_slot: '02:00 PM - 03:30 PM',
      subject: { name: 'Financial Risk Analysis' },
      room: 'Lab 101',
      professor: 'Dr. Patel',
      status: 'scheduled',
      attendance: { status: 'attended' },
    },
  ],
  Thursday: [
    {
      id: '5',
      time_slot: '09:00 AM - 10:30 AM',
      subject: { name: 'Strategic Marketing' },
      room: 'Room 205',
      professor: 'Prof. Shah',
      status: 'cancelled',
      attendance: null,
    },
  ],
  Friday: [
    {
      id: '6',
      time_slot: '11:00 AM - 12:30 PM',
      subject: { name: 'Financial Risk Analysis' },
      room: 'Lab 101',
      professor: 'Dr. Patel',
      status: 'scheduled',
      attendance: { status: 'attended' },
    },
  ],
};

export default function TimetablePage() {
  const week = 1;

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
            const dayClasses = (mockClasses as any)[day];

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
