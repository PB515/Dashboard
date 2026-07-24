import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

async function getNptelData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  // Fetch NPTEL courses
  const { data: courses } = await supabase
    .from('nptel_courses')
    .select('*')
    .order('target_completion_date', { ascending: true });

  // Fetch assignments
  const { data: assignments } = await supabase
    .from('nptel_assignments')
    .select('*')
    .order('due_date', { ascending: true });

  // Fetch certificates
  const { data: certificates } = await supabase
    .from('nptel_certificates')
    .select('*');

  // Get subjects for mapping
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, code, name');

  const subjectMap: { [key: string]: any } = {};
  (subjects || []).forEach((s: any) => {
    subjectMap[s.id] = s;
  });

  return {
    courses: (courses || []).map((c: any) => ({
      ...c,
      subject: subjectMap[c.subject_id],
    })),
    assignments: (assignments || []).map((a: any) => ({
      ...a,
      course: (courses || []).find((c: any) => c.id === a.nptel_course_id),
    })),
    certificates,
  };
}

export default async function NptelPage() {
  const data = await getNptelData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'graded':
      case 'issued':
        return 'text-success bg-success bg-opacity-10 border-success border-opacity-30';
      case 'in_progress':
      case 'submitted':
        return 'text-warning bg-warning bg-opacity-10 border-warning border-opacity-30';
      case 'not_started':
      case 'pending':
      case 'eligible':
        return 'text-text-secondary bg-surface border-text-secondary border-opacity-20';
      default:
        return 'text-danger bg-danger bg-opacity-10 border-danger border-opacity-30';
    }
  };

  const overallProgress = data.courses.length > 0
    ? Math.round(
        data.courses.reduce((sum: number, c: any) => sum + c.lectures_completed, 0) /
          data.courses.reduce((sum: number, c: any) => sum + c.total_lectures, 0) *
          100
      )
    : 0;

  const pendingAssignments = (data.assignments || []).filter(
    (a: any) => a.status === 'not_started' || a.status === 'in_progress'
  ).length;

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="border-b border-text-secondary border-opacity-20 bg-surface p-4">
        <h1 className="text-2xl font-bold">📚 NPTEL Courses</h1>
        <p className="text-sm text-text-secondary">Assignments, progress & certificates</p>
      </header>

      <main className="mx-auto max-w-4xl p-4 space-y-6">
        {/* Overall Progress */}
        <div className="rounded-lg border border-text-secondary border-opacity-20 bg-surface-raised p-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-text-secondary">Overall Progress</p>
              <p className="text-3xl font-bold text-success">{overallProgress}%</p>
              <p className="text-xs text-text-secondary mt-1">lectures completed</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Active Courses</p>
              <p className="text-3xl font-bold text-warning">{data.courses.length}</p>
              <p className="text-xs text-text-secondary mt-1">NPTEL enrolled</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Pending Assignments</p>
              <p className="text-3xl font-bold text-danger">{pendingAssignments}</p>
              <p className="text-xs text-text-secondary mt-1">to submit</p>
            </div>
          </div>
        </div>

        {/* NPTEL Courses */}
        <div className="rounded-lg border border-text-secondary border-opacity-20 bg-surface-raised p-6">
          <h2 className="text-lg font-semibold mb-4">📖 NPTEL Courses</h2>
          <div className="space-y-3">
            {data.courses.length === 0 ? (
              <p className="text-text-secondary text-sm">No NPTEL courses enrolled</p>
            ) : (
              data.courses.map((course: any) => {
                const progress = Math.round((course.lectures_completed / course.total_lectures) * 100);

                return (
                  <div
                    key={course.id}
                    className={`rounded-lg border p-4 ${getStatusColor(course.status)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold">{course.course_name}</p>
                        <p className="text-xs text-text-secondary">
                          {course.course_code} • {course.subject?.code}
                        </p>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded bg-surface">
                        {course.status}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-surface-raised rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-success"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <p className="text-xs text-text-secondary">
                      {course.lectures_completed}/{course.total_lectures} lectures ({progress}%)
                      {course.target_completion_date && (
                        <> • Target: {new Date(course.target_completion_date).toLocaleDateString()}</>
                      )}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Pending Assignments */}
        <div className="rounded-lg border border-text-secondary border-opacity-20 bg-surface-raised p-6">
          <h2 className="text-lg font-semibold mb-4">✓ Assignments</h2>
          <div className="space-y-2">
            {data.assignments.length === 0 ? (
              <p className="text-text-secondary text-sm">No assignments</p>
            ) : (
              data.assignments
                .filter((a: any) => a.status !== 'graded')
                .slice(0, 5)
                .map((assignment: any) => (
                  <div
                    key={assignment.id}
                    className={`rounded-lg border p-3 text-sm ${getStatusColor(assignment.status)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-xs text-text-secondary">
                          {assignment.course?.course_code}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium">{assignment.status}</span>
                        {assignment.due_date && (
                          <p className="text-xs text-text-secondary">
                            {new Date(assignment.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Certificates */}
        {data.certificates.length > 0 && (
          <div className="rounded-lg border border-success border-opacity-30 bg-success bg-opacity-5 p-6">
            <h2 className="text-lg font-semibold mb-4">🏆 Certificates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.certificates.map((cert: any) => (
                <div key={cert.id} className="rounded-lg border border-success border-opacity-30 p-3">
                  <p className="font-semibold">{cert.certificate_type.toUpperCase()}</p>
                  {cert.score_percentage && (
                    <p className="text-sm text-text-secondary">
                      Score: {cert.score_percentage}%
                    </p>
                  )}
                  <p className="text-xs mt-1">
                    Status: <span className="font-medium">{cert.status}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="rounded-lg border border-text-secondary border-opacity-20 bg-surface-raised p-4">
          <p className="font-semibold">📌 Next Steps</p>
          <ul className="text-sm text-text-secondary mt-2 space-y-1">
            <li>✓ Watch lectures & complete quizzes</li>
            <li>✓ Submit assignments on time</li>
            <li>✓ Maintain 40%+ score for certificate</li>
            <li>✓ Elite: 95%+ | Gold: 85%+ | Silver: 75%+ | Bronze: 60%+</li>
          </ul>
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
            href="/learning"
            className="text-center text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            📚 Learning
          </Link>
          <Link
            href="/nptel"
            className="text-center text-sm font-medium text-text-primary"
          >
            📖 NPTEL
          </Link>
          <Link
            href="/research"
            className="text-center text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            🔬 Research
          </Link>
        </div>
      </footer>
    </div>
  );
}
