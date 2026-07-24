import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { AttendanceOverrideResponse } from '@/lib/types';

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
    const { timetable_entry_id, date, action } = await request.json();

    if (!timetable_entry_id || !date || !action) {
      return NextResponse.json(
        {
          error: 'BadRequest',
          message: 'timetable_entry_id, date, action required',
          status: 400,
        },
        { status: 400 }
      );
    }

    if (action !== 'bunk' && action !== 'undo') {
      return NextResponse.json(
        {
          error: 'BadRequest',
          message: 'action must be "bunk" or "undo"',
          status: 400,
        },
        { status: 400 }
      );
    }

    // Get timetable entry
    const { data: entry, error: entryError } = await supabase
      .from('timetable_entries')
      .select('id, subject_id, week, day_of_week, session, time_slot')
      .eq('id', timetable_entry_id)
      .eq('user_id', user.id)
      .single();

    if (entryError || !entry) {
      return NextResponse.json(
        {
          error: 'NotFound',
          message: 'Timetable entry not found',
          status: 404,
        },
        { status: 404 }
      );
    }

    if (action === 'bunk') {
      // Check if already bunked
      const { data: existingLog } = await supabase
        .from('attendance_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('timetable_entry_id', timetable_entry_id)
        .eq('date', date)
        .single();

      if (existingLog) {
        return NextResponse.json(
          {
            error: 'Conflict',
            message: 'Attendance already logged for this date',
            status: 409,
          },
          { status: 409 }
        );
      }

      // Check if subject exists
      const { data: subject } = await supabase
        .from('subjects')
        .select('id, code, credits')
        .eq('id', entry.subject_id)
        .eq('user_id', user.id)
        .single();

      if (!subject) {
        return NextResponse.json(
          {
            error: 'NotFound',
            message: 'Subject not found',
            status: 404,
          },
          { status: 404 }
        );
      }

      // Insert attendance log
      const { data: log, error: logError } = await supabase
        .from('attendance_logs')
        .insert({
          user_id: user.id,
          timetable_entry_id,
          status: 'bunked',
          bunk_token_spent: true,
          marked_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (logError) {
        throw logError;
      }

      const response: AttendanceOverrideResponse = {
        success: true,
        attendance: {
          id: log.id,
          user_id: user.id,
          timetable_entry_id,
          status: 'bunked',
          created_at: log.created_at,
        },
      };

      return NextResponse.json(response);
    } else if (action === 'undo') {
      // Delete attendance log for this date
      const { error: deleteError } = await supabase
        .from('attendance_logs')
        .delete()
        .eq('user_id', user.id)
        .eq('timetable_entry_id', timetable_entry_id)
        .eq('date', date)
        .eq('status', 'bunked');

      if (deleteError) {
        throw deleteError;
      }

      // Decrement subject bunks_used
      const { data: subject } = await supabase
        .from('subjects')
        .select('id, max_bunks_allowed, bunks_used')
        .eq('id', entry.subject_id)
        .eq('user_id', user.id)
        .single();

      if (!subject) {
        return NextResponse.json(
          {
            error: 'NotFound',
            message: 'Subject not found',
            status: 404,
          },
          { status: 404 }
        );
      }

      await supabase
        .from('subjects')
        .update({ bunks_used: Math.max(0, subject.bunks_used - 1) })
        .eq('id', entry.subject_id)
        .eq('user_id', user.id);

      const response: AttendanceOverrideResponse = {
        success: true,
        attendance: {
          id: '',
          user_id: user.id,
          timetable_entry_id,
          date,
          status: 'attended',
          token_spent: false,
          auto_logged: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        subject_tokens_updated: {
          subject_code: (entry.subjects as any)?.code || '',
          tokens_remaining:
            subject.max_bunks_allowed -
            Math.max(0, subject.bunks_used - 1),
          tokens_max: subject.max_bunks_allowed,
        },
      };

      return NextResponse.json(response);
    }
  } catch (error) {
    console.error('Attendance override error:', error);
    return NextResponse.json(
      {
        error: 'InternalError',
        message: 'Failed to override attendance',
        status: 500,
      },
      { status: 500 }
    );
  }
}
