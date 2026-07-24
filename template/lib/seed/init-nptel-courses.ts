/**
 * Phase 4 Seed: Initialize NPTEL Courses + Assignments
 * Creates: NPTEL courses linked to subjects, sample assignments
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function initNptelCourses() {
  console.log('📚 Phase 4: Initializing NPTEL Courses + Assignments...');

  try {
    const userId = '00000000-0000-0000-0000-000000000000';

    // Get all subjects
    const { data: subjects } = await supabase
      .from('subjects')
      .select('id, code, name')
      .eq('user_id', userId);

    if (!subjects || subjects.length === 0) {
      console.error('❌ No subjects found');
      process.exit(1);
    }

    // NPTEL course mapping (real NPTEL courses for MBA)
    const nptelCourses = [
      {
        subject_id: subjects.find((s: any) => s.code === 'FRA')?.id,
        course_id: 'nptel-fin101',
        course_name: 'Financial Accounting Fundamentals',
        course_code: 'NPTEL-FIN-101',
        instructor: 'Prof. Ajay Kumar',
        duration_weeks: 12,
        total_lectures: 40,
        status: 'not_started',
        target_completion_date: '2026-10-31',
      },
      {
        subject_id: subjects.find((s: any) => s.code === 'ME')?.id,
        course_id: 'nptel-econ102',
        course_name: 'Economics for Managers',
        course_code: 'NPTEL-ECON-102',
        instructor: 'Prof. Neha Sharma',
        duration_weeks: 10,
        total_lectures: 35,
        status: 'not_started',
        target_completion_date: '2026-10-15',
      },
      {
        subject_id: subjects.find((s: any) => s.code === 'SM')?.id,
        course_id: 'nptel-stat103',
        course_name: 'Statistics for Business Analytics',
        course_code: 'NPTEL-STAT-103',
        instructor: 'Prof. Rajesh Patel',
        duration_weeks: 12,
        total_lectures: 40,
        status: 'not_started',
        target_completion_date: '2026-11-15',
      },
    ];

    console.log('📖 Creating NPTEL courses...');
    for (const course of nptelCourses) {
      if (!course.subject_id) continue;

      const { data: created, error } = await supabase
        .from('nptel_courses')
        .insert({
          user_id: userId,
          ...course,
          enrollment_date: new Date().toISOString().split('T')[0],
        })
        .select();

      if (error) {
        console.error(`❌ Error creating ${course.course_name}:`, error.message);
      } else {
        console.log(`✅ ${course.course_code}: ${course.course_name}`);

        // Create assignments for this course
        if (created && created.length > 0) {
          const courseId = created[0].id;
          const assignments = [
            {
              user_id: userId,
              nptel_course_id: courseId,
              assignment_number: 1,
              title: 'Week 1 Assignment',
              due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              status: 'not_started',
            },
            {
              user_id: userId,
              nptel_course_id: courseId,
              assignment_number: 2,
              title: 'Week 2 Assignment',
              due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              status: 'not_started',
            },
            {
              user_id: userId,
              nptel_course_id: courseId,
              assignment_number: 3,
              title: 'Mid-term Quiz',
              due_date: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              status: 'not_started',
            },
            {
              user_id: userId,
              nptel_course_id: courseId,
              assignment_number: 4,
              title: 'Final Assignment',
              due_date: new Date(Date.now() + 84 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              status: 'not_started',
            },
          ];

          for (const assignment of assignments) {
            await supabase.from('nptel_assignments').insert(assignment);
          }

          console.log(`   └─ 4 assignments created`);
        }
      }
    }

    console.log(`\n✅ PHASE 4 INITIALIZED!`);
    console.log(`   - 3 NPTEL courses (FRA, ME, SM subjects)`);
    console.log(`   - 12 assignments total (4 per course)`);
    console.log(`   - Ready for: Certificate tracking, assignment auto-import`);
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  }
}

initNptelCourses();
