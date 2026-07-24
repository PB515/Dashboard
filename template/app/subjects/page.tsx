import Link from 'next/link';

const mockSubjects = [
  {
    id: 'subj-fra',
    code: 'FRA',
    name: 'Financial Risk Analysis',
    credits: 3,
    tokens_remaining: 2,
    tokens_max: 2,
    attended_count: 8,
    total_sessions: 10,
    status: 'abundant',
  },
  {
    id: 'subj-haw',
    code: 'HAW',
    name: 'Heritage and Wisdom',
    credits: 1,
    tokens_remaining: 1,
    tokens_max: 1,
    attended_count: 9,
    total_sessions: 10,
    status: 'caution',
  },
  {
    id: 'subj-marketing',
    code: 'MKT',
    name: 'Strategic Marketing',
    credits: 2,
    tokens_remaining: 2,
    tokens_max: 3,
    attended_count: 8,
    total_sessions: 10,
    status: 'caution',
  },
  {
    id: 'subj-quant',
    code: 'QUANT',
    name: 'Quantitative Methods',
    credits: 2,
    tokens_remaining: 0,
    tokens_max: 3,
    attended_count: 8,
    total_sessions: 10,
    status: 'danger',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'abundant':
      return 'bg-success bg-opacity-10 border-success border-opacity-30 text-success';
    case 'caution':
      return 'bg-warning bg-opacity-10 border-warning border-opacity-30 text-warning';
    case 'danger':
      return 'bg-danger bg-opacity-10 border-danger border-opacity-30 text-danger';
    default:
      return 'bg-surface border-text-secondary border-opacity-20';
  }
};

export default function SubjectsPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="border-b border-text-secondary border-opacity-20 bg-surface p-4">
        <h1 className="text-2xl font-bold">Subjects</h1>
        <p className="text-sm text-text-secondary">Token Vault & Progress</p>
      </header>

      <main className="mx-auto max-w-4xl p-4">
        {mockSubjects.length > 0 && (
          <div className="space-y-4">
            {mockSubjects.map((subject) => (
              <div
                key={subject.id}
                className={`rounded-lg border p-6 ${getStatusColor(subject.status)}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{subject.name}</h3>
                    <p className="text-sm text-text-secondary">
                      {subject.code} · {subject.credits} credit{subject.credits > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {subject.tokens_remaining}/{subject.tokens_max}
                    </p>
                    <p className="text-xs text-text-secondary">tokens</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="h-2 w-full rounded-full bg-surface">
                    <div
                      className={`h-2 rounded-full ${
                        subject.status === 'abundant'
                          ? 'bg-success'
                          : subject.status === 'caution'
                            ? 'bg-warning'
                            : 'bg-danger'
                      }`}
                      style={{
                        width: `${(subject.tokens_remaining / subject.tokens_max) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-text-secondary">Attended</p>
                    <p className="font-semibold">
                      {subject.attended_count}/{subject.total_sessions}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Status</p>
                    <p className="font-semibold capitalize">{subject.status}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Quality Avg</p>
                    <p className="font-semibold">N/A</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    href={`/timetable?subject=${subject.code}`}
                    className="flex-1 text-center rounded-md bg-surface px-4 py-2 text-sm hover:bg-surface-raised"
                  >
                    View Classes
                  </Link>
                  <button className="flex-1 text-center rounded-md bg-accent px-4 py-2 text-sm text-background hover:opacity-90">
                    Spend Bunk
                  </button>
                </div>
              </div>
            ))}
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
            className="text-center text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            📅 Timetable
          </Link>
          <Link
            href="/subjects"
            className="text-center text-sm font-medium text-text-primary"
          >
            📊 Subjects
          </Link>
        </div>
      </footer>
    </div>
  );
}
