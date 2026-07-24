import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { TimetableResponse } from '@/lib/types';
import Papa from 'papaparse';

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
    const { searchParams } = new URL(request.url);
    const week = searchParams.get('week');
    const subjectId = searchParams.get('subject_id');

    let query = supabase
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
        subjects:subject_id (id, code, name, credits),
        attendance_logs!left(id, status, date, auto_logged, token_spent)
      `
      )
      .eq('user_id', user.id);

    if (week) {
      const weekNum = parseInt(week, 10);
      if (weekNum < 1 || weekNum > 18) {
        return NextResponse.json(
          { error: 'BadRequest', message: 'Week must be 1-18', status: 400 },
          { status: 400 }
        );
      }
      query = query.eq('week', weekNum);
    }

    if (subjectId) {
      query = query.eq('subject_id', subjectId);
    }

    const { data: entries, error } = await query.order('week', {
      ascending: true,
    });

    if (error) {
      throw error;
    }

    // Calculate week range (simplified)
    const weekNum = week ? parseInt(week, 10) : 1;
    const startDate = new Date(2026, 6, 22); // Jul 22, 2026 (semester start)
    startDate.setDate(startDate.getDate() + (weekNum - 1) * 7);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const response: TimetableResponse = {
      week: weekNum,
      date_range: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
      },
      entries: (entries || []).map((entry: any) => ({
        id: entry.id,
        user_id: user.id,
        subject_id: entry.subject_id,
        week: entry.week,
        day_of_week: entry.day_of_week,
        time_slot: entry.time_slot,
        room: entry.room,
        professor: entry.professor,
        status: entry.status,
        calendar_event_id: entry.calendar_event_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subject: {
          code: entry.subjects?.code || '',
          name: entry.subjects?.name || '',
          credits: entry.subjects?.credits || 2,
        },
        attendance:
          entry.attendance_logs && entry.attendance_logs.length > 0
            ? entry.attendance_logs[0]
            : undefined,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Timetable GET error:', error);
    return NextResponse.json(
      {
        error: 'InternalError',
        message: 'Failed to fetch timetable',
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
    const { csv_data, replace_existing } = await request.json();

    if (!csv_data) {
      return NextResponse.json(
        { error: 'BadRequest', message: 'csv_data required', status: 400 },
        { status: 400 }
      );
    }

    // Parse CSV
    const parsed = Papa.parse(csv_data, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
      return NextResponse.json(
        {
          error: 'BadRequest',
          message: 'CSV format error',
          status: 400,
          details: parsed.errors,
        },
        { status: 400 }
      );
    }

    // Validate and prepare rows
    const rows = parsed.data as any[];
    const validRows = [];
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // +1 for header, +1 for 1-indexing

      // Validate required fields
      if (!row.week || !row.day_of_week || !row.subject_code || !row.time_slot) {
        errors.push({
          row: rowNum,
          error: 'Missing required fields: week, day_of_week, subject_code, time_slot',
        });
        continue;
      }

      // Get subject ID by code
      const { data: subject } = await supabase
        .from('subjects')
        .select('id')
        .eq('user_id', user.id)
        .eq('code', row.subject_code)
        .single();

      if (!subject) {
        errors.push({
          row: rowNum,
          error: `Unknown subject code: ${row.subject_code}`,
        });
        continue;
      }

      validRows.push({
        user_id: user.id,
        subject_id: subject.id,
        week: parseInt(row.week, 10),
        day_of_week: row.day_of_week,
        time_slot: row.time_slot,
        room: row.room || null,
        professor: row.professor || null,
        status: 'scheduled',
      });
    }

    if (validRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          imported_count: 0,
          errors,
          preview: [],
        },
        { status: 400 }
      );
    }

    // Delete existing if requested
    if (replace_existing) {
      await supabase
        .from('timetable_entries')
        .delete()
        .eq('user_id', user.id);
    }

    // Insert valid rows
    const { error: insertError } = await supabase
      .from('timetable_entries')
      .insert(validRows)
      .select();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      imported_count: validRows.length,
      errors,
      preview: validRows.slice(0, 5).map((row) => ({
        week: row.week,
        day: row.day_of_week,
        subject: row.subject_id,
        time: row.time_slot,
        status: 'valid',
      })),
    });
  } catch (error) {
    console.error('Timetable POST error:', error);
    return NextResponse.json(
      {
        error: 'InternalError',
        message: 'Failed to import timetable',
        status: 500,
      },
      { status: 500 }
    );
  }
}
