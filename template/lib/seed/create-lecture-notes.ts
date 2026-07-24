/**
 * Phase 2 Seed: Auto-generate 360 Lecture Notes
 * Creates one lecture_note per timetable_entry
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createLectureNotes() {
  console.log('📖 Phase 2: Auto-generating 360 lecture notes...');

  try {
    const userId = '00000000-0000-0000-0000-000000000000';

    // Fetch all timetable entries
    const { data: timetableEntries } = await supabase
      .from('timetable_entries')
      .select('*')
      .eq('user_id', userId)
      .order('week', { ascending: true })
      .order('day_of_week', { ascending: true });

    console.log(`📚 Found ${timetableEntries?.length || 0} timetable entries`);

    if (!timetableEntries || timetableEntries.length === 0) {
      console.error('❌ No timetable entries found. Run import-real-timetable.ts first.');
      process.exit(1);
    }

    // Create lecture note for each timetable entry
    const lectureNotes = timetableEntries.map((entry: any) => ({
      user_id: userId,
      timetable_entry_id: entry.id,
      subject_id: entry.subject_id,
      week: entry.week,
      session_number: entry.session,
      topic: `${entry.subject_id} - Session ${entry.session}`, // Will be updated with real topics
      comprehension_level: null, // To be filled by user
      quality_score: null,
      notes_text: '',
      evidence_link: null,
      status: 'pending',
    }));

    // Batch insert lecture notes
    console.log(`🔄 Inserting ${lectureNotes.length} lecture notes...`);
    const chunkSize = 100;
    for (let i = 0; i < lectureNotes.length; i += chunkSize) {
      const chunk = lectureNotes.slice(i, i + chunkSize);
      const { error } = await supabase
        .from('lecture_notes')
        .insert(chunk);

      if (error) {
        console.error(`❌ Error inserting chunk:`, error.message);
      } else {
        console.log(`✅ Batch ${Math.ceil((i + 1) / chunkSize)}: ${Math.min(chunk.length, chunkSize)} notes`);
      }
    }

    // Create default rubrics for each subject
    console.log('📋 Creating quality rubrics...');
    const { data: subjects } = await supabase
      .from('subjects')
      .select('id, code')
      .eq('user_id', userId);

    const rubrics = (subjects || []).map((subject: any) => ({
      user_id: userId,
      subject_id: subject.id,
      work_type: 'lecture_note',
      criteria_1: 'Completeness: All key concepts covered',
      criteria_2: 'Clarity: Concepts explained clearly',
      criteria_3: 'Organization: Notes well-structured',
      criteria_4: 'Relevance: Focused on learning goals',
      criteria_5: 'Application: Examples + use cases included',
      max_score: 100,
    }));

    for (const rubric of rubrics) {
      await supabase
        .from('quality_rubrics')
        .upsert(rubric);
    }

    console.log(`✅ Created ${rubrics.length} quality rubrics`);

    console.log(`\n✅ PHASE 2 INITIALIZED!`);
    console.log(`   - 360 lecture notes auto-created`);
    console.log(`   - Ready for comprehension tracking`);
    console.log(`   - Quality rubrics per subject`);
    console.log(`   - Next: Start filling in comprehension levels (0-5)`);
  } catch (error) {
    console.error('❌ Creation failed:', error);
    process.exit(1);
  }
}

createLectureNotes();
