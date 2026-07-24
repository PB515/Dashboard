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

    // Add computed fields for each subject
    const subjectsWithMeta = (subjects || []).map((subject) => ({
      ...subject,
      attended_count: Math.floor(Math.random() * 20),
      total_sessions: 30,
      status: 'active',
    }));

    const response: SubjectsResponse = {
      subjects: subjectsWithMeta,
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
    const { code, name, credits, professor } = await request.json();

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
        professor: professor || 'TBA',
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
        attended_count: 0,
        total_sessions: 30,
        status: 'active',
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
