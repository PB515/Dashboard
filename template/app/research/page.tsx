import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

async function getResearchData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  // Fetch research projects
  const { data: researchProjects } = await supabase
    .from('research_projects')
    .select('*')
    .order('target_completion_date', { ascending: true });

  // Fetch group projects
  const { data: groupProjects } = await supabase
    .from('group_projects')
    .select('*')
    .order('target_completion_date', { ascending: true });

  // Fetch project milestones
  const { data: milestones } = await supabase
    .from('project_milestones')
    .select('*')
    .order('due_date', { ascending: true });

  // Fetch artifacts
  const { data: artifacts } = await supabase
    .from('artifacts')
    .select('*')
    .order('created_at', { ascending: false });

  // Get subjects for mapping
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, code, name');

  const subjectMap: { [key: string]: any } = {};
  (subjects || []).forEach((s: any) => {
    subjectMap[s.id] = s;
  });

  return {
    researchProjects: (researchProjects || []).map((p: any) => ({
      ...p,
      subject: subjectMap[p.subject_id],
    })),
    groupProjects: (groupProjects || []).map((p: any) => ({
      ...p,
      subject: subjectMap[p.subject_id],
    })),
    milestones,
    artifacts: (artifacts || []).map((a: any) => ({
      ...a,
      subject: subjectMap[a.subject_id],
    })),
  };
}

export default async function ResearchPage() {
  const data = await getResearchData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'submitted':
        return 'text-success bg-success bg-opacity-10 border-success border-opacity-30';
      case 'in_progress':
      case 'active':
      case 'research':
      case 'drafting':
        return 'text-warning bg-warning bg-opacity-10 border-warning border-opacity-30';
      case 'planning':
      case 'pending':
        return 'text-text-secondary bg-surface border-text-secondary border-opacity-20';
      default:
        return 'text-danger bg-danger bg-opacity-10 border-danger border-opacity-30';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-success';
    if (progress >= 50) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="border-b border-text-secondary border-opacity-20 bg-surface p-4">
        <h1 className="text-2xl font-bold">🔬 Research & Projects</h1>
        <p className="text-sm text-text-secondary">Papers, artifacts, group projects & milestones</p>
      </header>

      <main className="mx-auto max-w-4xl p-4 space-y-6">
        {/* Research Projects */}
        <div className="rounded-lg border border-text-secondary border-opacity-20 bg-surface-raised p-6">
          <h2 className="text-lg font-semibold mb-4">📝 Research Projects</h2>
          <div className="space-y-3">
            {data.researchProjects.length === 0 ? (
              <p className="text-text-secondary text-sm">No research projects yet</p>
            ) : (
              data.researchProjects.map((project: any) => (
                <div
                  key={project.id}
                  className={`rounded-lg border p-4 ${getStatusColor(project.status)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold">{project.title}</p>
                      <p className="text-xs text-text-secondary">
                        {project.subject?.code} • {project.project_type.replace('_', ' ')}
                      </p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded bg-surface">
                      {project.status}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-surface-raised rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full ${getProgressColor(project.progress_percent)}`}
                      style={{ width: `${project.progress_percent}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-text-secondary">
                    {project.progress_percent}% complete
                    {project.target_completion_date && (
                      <> • Due: {new Date(project.target_completion_date).toLocaleDateString()}</>
                    )}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Group Projects */}
        <div className="rounded-lg border border-text-secondary border-opacity-20 bg-surface-raised p-6">
          <h2 className="text-lg font-semibold mb-4">👥 Group Projects</h2>
          <div className="space-y-3">
            {data.groupProjects.length === 0 ? (
              <p className="text-text-secondary text-sm">No group projects yet</p>
            ) : (
              data.groupProjects.map((project: any) => (
                <div
                  key={project.id}
                  className={`rounded-lg border p-4 ${getStatusColor(project.status)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold">{project.project_name}</p>
                      <p className="text-xs text-text-secondary">
                        {project.group_members} members • {project.subject?.code}
                      </p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded bg-surface">
                      {project.status}
                    </span>
                  </div>

                  {/* Progress + Milestones */}
                  <div className="w-full h-2 bg-surface-raised rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full ${getProgressColor(project.progress_percent)}`}
                      style={{ width: `${project.progress_percent}%` }}
                    ></div>
                  </div>

                  <div className="text-xs text-text-secondary space-y-1">
                    <p>
                      Progress: {project.progress_percent}%
                      {project.target_completion_date && (
                        <> • Due: {new Date(project.target_completion_date).toLocaleDateString()}</>
                      )}
                    </p>
                    {data.milestones.some((m: any) => m.group_project_id === project.id) && (
                      <p>
                        📌 {data.milestones.filter((m: any) => m.group_project_id === project.id).length}{' '}
                        milestones
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Artifacts */}
        <div className="rounded-lg border border-text-secondary border-opacity-20 bg-surface-raised p-6">
          <h2 className="text-lg font-semibold mb-4">🎨 Artifacts & Outputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.artifacts.length === 0 ? (
              <p className="text-text-secondary text-sm">No artifacts yet</p>
            ) : (
              data.artifacts.map((artifact: any) => (
                <div
                  key={artifact.id}
                  className={`rounded-lg border p-3 ${getStatusColor(artifact.status)}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{artifact.title}</p>
                      <p className="text-xs text-text-secondary">
                        {artifact.artifact_type} • {artifact.subject?.code}
                      </p>
                    </div>
                  </div>

                  {artifact.quality_score && (
                    <p className="text-xs mt-2">
                      Quality: <span className="font-bold">{artifact.quality_score}/100</span>
                    </p>
                  )}

                  <p className="text-xs text-text-secondary mt-1">
                    v{artifact.revision_number} • {artifact.status}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="rounded-lg border border-success border-opacity-30 bg-success bg-opacity-5 p-4">
          <p className="font-semibold text-success">🎯 Next Steps (Phase 3)</p>
          <ul className="text-sm text-text-secondary mt-2 space-y-1">
            <li>✓ Auto-trigger journals from Design Thinking (DT) lectures</li>
            <li>✓ Track milestone completion on group projects</li>
            <li>✓ Score artifacts & research papers (0-100)</li>
            <li>✓ Quality feedback loop for revisions</li>
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
            href="/research"
            className="text-center text-sm font-medium text-text-primary"
          >
            🔬 Research
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
