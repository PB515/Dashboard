import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

async function getLearningData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  // Fetch lecture notes
  const { data: lectureNotes } = await supabase
    .from('lecture_notes')
    .select('*, subject_id')
    .order('week', { ascending: false });

  // Calculate mastery per subject
  const subjectStats: { [key: string]: any } = {};

  (lectureNotes || []).forEach((note: any) => {
    if (!subjectStats[note.subject_id]) {
      subjectStats[note.subject_id] = {
        total: 0,
        completed: 0,
        comprehension_sum: 0,
        low_comprehension: [],
      };
    }
    subjectStats[note.subject_id].total++;

    if (note.status === 'completed' || note.status === 'reviewed') {
      subjectStats[note.subject_id].completed++;
    }

    if (note.comprehension_level) {
      subjectStats[note.subject_id].comprehension_sum += note.comprehension_level;

      if (note.comprehension_level < 3) {
        subjectStats[note.subject_id].low_comprehension.push({
          week: note.week,
          session: note.session_number,
          topic: note.topic,
          level: note.comprehension_level,
        });
      }
    }
  });

  // Get subjects for mapping
  const { data: subjects } = await supabase
    .from('subjects')
    .select('*');

  const subjectMap: { [key: string]: any } = {};
  (subjects || []).forEach((s: any) => {
    subjectMap[s.id] = s;
  });

  // Build mastery stats
  const masteryStats = Object.entries(subjectStats).map(([subjectId, stats]: any) => {
    const subject = subjectMap[subjectId];
    const completion = Math.round((stats.completed / stats.total) * 100);
    const avgComprehension = stats.completed > 0
      ? (stats.comprehension_sum / stats.completed).toFixed(2)
      : 0;
    const mastery = Math.round((completion + (parseFloat(avgComprehension) * 20)) / 2);

    return {
      subjectId,
      code: subject?.code || 'N/A',
      name: subject?.name || 'Unknown',
      credits: subject?.credits || 0,
      completion,
      avgComprehension: parseFloat(avgComprehension as any),
      mastery,
      lowComprehensionCount: stats.low_comprehension.length,
      gaps: stats.low_comprehension.slice(0, 3), // Top 3 gaps
    };
  });

  // Sort by mastery descending
  masteryStats.sort((a, b) => b.mastery - a.mastery);

  // Overall stats
  const totalLectures = lectureNotes?.length || 0;
  const completedLectures = (lectureNotes || []).filter(
    (n: any) => n.status === 'completed' || n.status === 'reviewed'
  ).length;
  const overallCompletion = totalLectures > 0 ? Math.round((completedLectures / totalLectures) * 100) : 0;

  return {
    masteryStats,
    overallCompletion,
    totalLectures,
    completedLectures,
    lectureNotes,
  };
}

export default async function LearningPage() {
  const data = await getLearningData();

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="border-b border-text-secondary border-opacity-20 bg-surface p-4">
        <h1 className="text-2xl font-bold">📚 Learning Mastery</h1>
        <p className="text-sm text-text-secondary">Comprehension tracking & gap detection</p>
      </header>

      <main className="mx-auto max-w-4xl p-4 space-y-6">
        {/* Overall Progress */}
        <div className="rounded-lg border border-text-secondary border-opacity-20 bg-surface-raised p-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-text-secondary">Overall Completion</p>
              <p className="text-3xl font-bold text-success">{data.overallCompletion}%</p>
              <p className="text-xs text-text-secondary mt-1">
                {data.completedLectures}/{data.totalLectures} lectures
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Pending Notes</p>
              <p className="text-3xl font-bold text-warning">
                {data.totalLectures - data.completedLectures}
              </p>
              <p className="text-xs text-text-secondary mt-1">to fill in</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Low Comprehension Topics</p>
              <p className="text-3xl font-bold text-danger">
                {data.masteryStats.reduce((sum, s) => sum + s.lowComprehensionCount, 0)}
              </p>
              <p className="text-xs text-text-secondary mt-1">needs focus</p>
            </div>
          </div>
        </div>

        {/* Mastery per Subject */}
        <div className="rounded-lg border border-text-secondary border-opacity-20 bg-surface-raised p-6">
          <h2 className="text-lg font-semibold mb-4">Subject Mastery Scores</h2>
          <div className="space-y-3">
            {data.masteryStats.map((subject: any) => {
              const statusColor =
                subject.mastery >= 75
                  ? 'text-success'
                  : subject.mastery >= 50
                    ? 'text-warning'
                    : 'text-danger';

              return (
                <div
                  key={subject.subjectId}
                  className="rounded-lg border border-text-secondary border-opacity-20 bg-surface p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold">
                        {subject.code} ({subject.credits}cr)
                      </p>
                      <p className="text-xs text-text-secondary">{subject.name}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${statusColor}`}>
                        {subject.mastery}%
                      </p>
                      <p className="text-xs text-text-secondary">mastery</p>
                    </div>
                  </div>

                  {/* Progress bars */}
                  <div className="grid grid-cols-2 gap-3 text-xs mt-2">
                    <div>
                      <p className="text-text-secondary mb-1">Completion</p>
                      <div className="w-full h-2 bg-surface-raised rounded-full overflow-hidden">
                        <div
                          className="h-full bg-success"
                          style={{ width: `${subject.completion}%` }}
                        ></div>
                      </div>
                      <p className="mt-1 text-text-secondary">{subject.completion}%</p>
                    </div>
                    <div>
                      <p className="text-text-secondary mb-1">Comprehension</p>
                      <div className="w-full h-2 bg-surface-raised rounded-full overflow-hidden">
                        <div
                          className="h-full bg-warning"
                          style={{ width: `${(subject.avgComprehension / 5) * 100}%` }}
                        ></div>
                      </div>
                      <p className="mt-1 text-text-secondary">{subject.avgComprehension}/5.0</p>
                    </div>
                  </div>

                  {/* Gap topics */}
                  {subject.gaps.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-text-secondary border-opacity-10">
                      <p className="text-xs font-medium text-danger mb-1">
                        ⚠️ Low comprehension ({subject.lowComprehensionCount} topics):
                      </p>
                      <ul className="text-xs text-text-secondary space-y-1">
                        {subject.gaps.map((gap: any, idx: number) => (
                          <li key={idx}>
                            Week {gap.week}, Session {gap.session}: {gap.topic}
                            <span className="ml-1 text-danger font-medium">({gap.level}/5)</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Steps */}
        <div className="rounded-lg border border-success border-opacity-30 bg-success bg-opacity-5 p-4">
          <p className="font-semibold text-success">🎯 Next Steps</p>
          <ul className="text-sm text-text-secondary mt-2 space-y-1">
            <li>✓ Fill in comprehension levels (0-5) for each lecture</li>
            <li>✓ Add notes & evidence for low comprehension topics</li>
            <li>✓ Review gap topics before mid-term exam</li>
            <li>✓ Quality score assignments (0-100)</li>
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
            href="/timetable"
            className="text-center text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            📅 Timetable
          </Link>
          <Link
            href="/learning"
            className="text-center text-sm font-medium text-text-primary"
          >
            📚 Learning
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
