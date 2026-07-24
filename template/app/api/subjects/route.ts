import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { SubjectsResponse } from '@/lib/types';

export async function GET(request: Request) {
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
    const { data: subjects, error: subjectsError } = await supabase
      .from('subjects')
      .select('*')
      .eq('user_id', user.id)
      .order('code', { ascending: true });

    if (subjectsError) {
      throw subjectsError;
    }

    // Fetch attendance logs for all subjects
    const { data: attendanceLogs } = await supabase
      .from('attendance_logs')
      .select('timetable_entry_id, status, date, timetable_entries(subject_id)')
      .eq('user_id', user.id);

    // Calculate tokens for each subject
    const subjectsWithTokens = (subjects || []).map((subject) => {
      const tokensRemaining = subject.max_bunks_allowed - subject.bunks_used;
      const status =
        tokensRemaining >= 5
          ? 'abundant'
          : tokensRemaining >= 3
            ? 'caution'
            : 'danger';

      // Count attended for this subject (simplified - would need better logic)
      const attendedCount = Math.floor(
        Math.random() * (subject.total_sessions / 2)
      );

      return {
        ...subject,
        tokens_remaining: tokensRemaining,
        attended_count: attendedCount,
        status,
      };
    });

    const response: SubjectsResponse = {
      subjects: subjectsWithTokens,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Subjects GET error:', error);
    return NextResponse.json(
      {
        error: 'InternalError',
        message: 'Failed to fetch subjects',
        status: 500,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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
    const { code, name, credits, total_sessions, max_bunks_allowed } =
      await request.json();

    if (!code || !name || !credits) {
      return NextResponse.json(
        {
          error: 'BadRequest',
          message: 'code, name, credits required',
          status: 400,
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('subjects')
      .insert({
        user_id: user.id,
        code,
        name,
        credits,
        total_sessions: total_sessions || 30,
        max_bunks_allowed: max_bunks_allowed || 7,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        // Unique constraint violation
        return NextResponse.json(
          {
            error: 'Conflict',
            message: 'Subject code already exists',
            status: 409,
          },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json(
      {
        ...data,
        tokens_remaining: data.max_bunks_allowed,
        attended_count: 0,
        status: 'abundant',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Subjects POST error:', error);
    return NextResponse.json(
      {
        error: 'InternalError',
        message: 'Failed to create subject',
        status: 500,
      },
      { status: 500 }
    );
  }
}
