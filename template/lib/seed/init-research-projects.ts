/**
 * Phase 3 Seed: Initialize Research Projects + Group Projects
 * Creates: 2 research papers, 1 white paper, group projects per subject
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function initResearchProjects() {
  console.log('🔬 Phase 3: Initializing Research Projects + Group Projects...');

  try {
    const userId = '00000000-0000-0000-0000-000000000000';

    // Get all subjects
    const { data: subjects } = await supabase
      .from('subjects')
      .select('id, code, name, credits')
      .eq('user_id', userId);

    if (!subjects || subjects.length === 0) {
      console.error('❌ No subjects found');
      process.exit(1);
    }

    // 1. Create Research Projects (2 papers + 1 white paper)
    console.log('📝 Creating 3 research projects...');

    const researchProjects = [
      {
        user_id: userId,
        subject_id: subjects[5]?.id || subjects[0].id, // FRA or first subject
        title: 'Financial Analysis of Infrastructure Companies',
        description: 'Comparative analysis of financial statements of top 5 infrastructure firms',
        project_type: 'research_paper',
        status: 'research',
        progress_percent: 25,
        start_date: '2026-07-24',
        target_completion_date: '2026-08-30',
      },
      {
        user_id: userId,
        subject_id: subjects[3]?.id || subjects[1].id, // MM or second subject
        title: 'Digital Transformation in Infrastructure Marketing',
        description: 'Study on digital marketing strategies in the infrastructure sector',
        project_type: 'research_paper',
        status: 'planning',
        progress_percent: 0,
        start_date: '2026-08-01',
        target_completion_date: '2026-09-15',
      },
      {
        user_id: userId,
        subject_id: subjects[0]?.id, // HAW or first subject
        title: 'Wellness Programs in Infrastructure Organizations',
        description: 'White paper on employee wellness initiatives and ROI',
        project_type: 'white_paper',
        status: 'planning',
        progress_percent: 0,
        start_date: '2026-08-15',
        target_completion_date: '2026-10-31',
      },
    ];

    for (const project of researchProjects) {
      const { error } = await supabase
        .from('research_projects')
        .insert(project);

      if (error) {
        console.error(`❌ Error creating ${project.title}:`, error.message);
      } else {
        console.log(`✅ ${project.project_type}: ${project.title}`);
      }
    }

    // 2. Create Group Projects for high-credit subjects
    console.log('👥 Creating group projects...');

    const groupProjects = subjects
      .filter((s: any) => s.credits >= 2) // Only for 2+ credit subjects
      .map((subject: any) => ({
        user_id: userId,
        subject_id: subject.id,
        project_name: `${subject.code} Group Project - Term 1`,
        group_members: 4,
        description: `Collaborative project for ${subject.name}`,
        status: 'planning',
        progress_percent: 0,
        target_completion_date: '2026-09-30',
      }));

    for (const project of groupProjects) {
      const { error } = await supabase
        .from('group_projects')
        .insert(project);

      if (error) {
        console.error(`❌ Error creating ${project.project_name}:`, error.message);
      } else {
        console.log(`✅ Group: ${project.project_name}`);
      }
    }

    // 3. Create milestones for first group project
    console.log('🎯 Creating project milestones...');

    const { data: groupProjectsData } = await supabase
      .from('group_projects')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (groupProjectsData && groupProjectsData.length > 0) {
      const firstProjectId = groupProjectsData[0].id;

      const milestones = [
        {
          user_id: userId,
          group_project_id: firstProjectId,
          milestone_name: 'Topic Selection & Research',
          due_date: '2026-08-10',
          status: 'pending',
        },
        {
          user_id: userId,
          group_project_id: firstProjectId,
          milestone_name: 'Literature Review Complete',
          due_date: '2026-08-25',
          status: 'pending',
        },
        {
          user_id: userId,
          group_project_id: firstProjectId,
          milestone_name: 'Draft Report Submission',
          due_date: '2026-09-15',
          status: 'pending',
        },
        {
          user_id: userId,
          group_project_id: firstProjectId,
          milestone_name: 'Final Presentation',
          due_date: '2026-09-30',
          status: 'pending',
        },
      ];

      for (const milestone of milestones) {
        await supabase.from('project_milestones').insert(milestone);
      }

      console.log(`✅ Created 4 milestones`);
    }

    // 4. Create initial artifacts
    console.log('🎨 Creating artifact templates...');

    const artifacts = [
      {
        user_id: userId,
        subject_id: subjects[5]?.id || subjects[0].id,
        artifact_type: 'paper',
        title: 'Infrastructure Finance Paper - Draft',
        status: 'draft',
        revision_number: 1,
      },
      {
        user_id: userId,
        subject_id: subjects[3]?.id || subjects[1].id,
        artifact_type: 'presentation',
        title: 'Marketing Strategy Presentation',
        status: 'draft',
        revision_number: 1,
      },
      {
        user_id: userId,
        subject_id: subjects[0]?.id,
        artifact_type: 'case_study',
        title: 'Wellness Program Case Study',
        status: 'draft',
        revision_number: 1,
      },
    ];

    for (const artifact of artifacts) {
      await supabase.from('artifacts').insert(artifact);
    }

    console.log(`✅ Created ${artifacts.length} artifact templates`);

    console.log(`\n✅ PHASE 3 INITIALIZED!`);
    console.log(`   - 3 research projects (2 papers + 1 white paper)`);
    console.log(`   - ${groupProjects.length} group projects`);
    console.log(`   - 4 project milestones`);
    console.log(`   - Ready for: Journals auto-trigger from DT classes`);
    console.log(`   - Ready for: Quality scoring on artifacts`);
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  }
}

initResearchProjects();
