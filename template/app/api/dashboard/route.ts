import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { DashboardResponse } from '@/lib/types';

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'User not authenticated' },
      { status: 401 }
    );
  }

  try {
    // 1. Get today's date for next class
    const today = new Date();
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const todayName = dayNames[today.getDay()];
    const todayWeek = Math.ceil(today.getDate() / 7); // Simplified week calc

    // 2. Fetch next class (today, order by time)
    const { data: timetableEntries, error: timetableError } = await supabase
      .from('timetable_entries')
      .select(
        `
        id,
        week,
        day_of_week,
        time_slot,
        room,
        professor,
        status,
        calendar_event_id,
        subject_id,
        subjects:subject_id (id, code, name, credits)
      `
      )
      .eq('user_id', user.id)
      .eq('day_of_week', todayName)
      .eq('status', 'scheduled')
      .order('time_slot', { ascending: true })
      .limit(1);

    if (timetableError) {
      throw timetableError;
    }

    const nextClass = timetableEntries?.[0]
      ? {
          id: timetableEntries[0].id,
          subject_id: timetableEntries[0].subject_id,
          week: timetableEntries[0].week,
          day_of_week: timetableEntries[0].day_of_week,
          time_slot: timetableEntries[0].time_slot,
          room: timetableEntries[0].room,
          professor: timetableEntries[0].professor,
          status: timetableEntries[0].status,
          calendar_event_id: timetableEntries[0].calendar_event_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: user.id,
          subject: {
            code: timetableEntries[0].subjects?.code || '',
            name: timetableEntries[0].subjects?.name || '',
            credits: timetableEntries[0].subjects?.credits || 2,
          },
        }
      : null;

    // 3. Fetch all subjects with token counts
    const { data: subjects, error: subjectsError } = await supabase
      .from('subjects')
      .select('*')
      .eq('user_id', user.id)
      .order('code', { ascending: true });

    if (subjectsError) {
      throw subjectsError;
    }

    // Calculate tokens for each subject
    const { data: attendanceLogs } = await supabase
      .from('attendance_logs')
      .select('timetable_entry_id, status')
      .eq('user_id', user.id);

    const tokenVault = (subjects || []).map((subject) => {
      const bunked = (attendanceLogs || []).filter(
        (log) => log.status === 'bunked'
      ).length;
      const tokensRemaining = subject.max_bunks_allowed - subject.bunks_used;
      const status =
        tokensRemaining >= 5
          ? 'abundant'
          : tokensRemaining >= 3
            ? 'caution'
            : 'danger';

      return {
        ...subject,
        tokens_remaining: tokensRemaining,
        attended_count: Math.floor(Math.random() * subject.total_sessions), // Placeholder, calc from logs
        status,
      };
    });

    // 4. Fetch pending tasks (Phase 1: all work_items with status != completed)
    const { data: pendingTasks } = await supabase
      .from('work_items')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['pending', 'in_progress'])
      .order('deadline', { ascending: true })
      .limit(10);

    const urgent = (pendingTasks || []).filter(
      (t) => t.status === 'pending' && t.quality_score && t.quality_score < 80
    );
    const momentum = (pendingTasks || []).filter(
      (t) => t.status === 'completed' || (t.quality_score && t.quality_score >= 80)
    );

    // 5. Calculate CGPA (placeholder for Phase 1)
    const earnedCGPA = 8.9; // Placeholder: would be calculated from graded work_items
    const projectedLow = 9.2;
    const projectedHigh = 9.5;
    const targetCGPA = 9.6;
    const gap = projectedHigh - targetCGPA;
    const gapStatus = gap >= 0 ? 'on_track' : gap >= -0.3 ? 'at_risk' : 'critical';

    const mastery = 0; // Phase 2+
    const executionRisk = tokenVault.some((s) => s.tokens_remaining < 2)
      ? 'high'
      : tokenVault.some((s) => s.tokens_remaining < 3)
        ? 'medium'
        : 'low';

    const response: DashboardResponse = {
      next_class: nextClass,
      token_vault: tokenVault,
      pending_tasks: {
        urgent: (urgent as any) || [],
        momentum: (momentum as any) || [],
      },
      gold_medal_status: {
        earned_cgpa: earnedCGPA,
        projected_cgpa: {
          low: projectedLow,
          high: projectedHigh,
        },
        target_cgpa: targetCGPA,
        gap: {
          low: projectedLow - targetCGPA,
          high: projectedHigh - targetCGPA,
          status: gapStatus,
        },
        mastery_percent: mastery,
        execution_risk: executionRisk,
        data_status: 'current',
        last_updated: new Date().toISOString(),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      {
        error: 'InternalError',
        message: 'Failed to fetch dashboard data',
        status: 500,
      },
      { status: 500 }
    );
  }
}
