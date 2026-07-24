// CGPA calculation logic

export interface GradeData {
  subject_code: string;
  credits: number;
  earned_marks: number; // 0-100
}

export interface CGPAResult {
  earned_cgpa: number;
  projected_cgpa: {
    low: number;
    high: number;
  };
  target_cgpa: number;
  gap: {
    low: number;
    high: number;
    status: 'on_track' | 'at_risk' | 'critical';
  };
}

const GRADE_SCALE = [
  { min: 90, max: 100, points: 10, grade: 'O' },
  { min: 80, max: 89, points: 9, grade: 'A+' },
  { min: 70, max: 79, points: 8, grade: 'A' },
  { min: 60, max: 69, points: 7, grade: 'B+' },
  { min: 50, max: 59, points: 6, grade: 'B' },
  { min: 40, max: 49, points: 5, grade: 'C' },
  { min: 0, max: 39, points: 0, grade: 'F' },
];

export function marksToGradePoints(marks: number): number {
  for (const gradeRange of GRADE_SCALE) {
    if (marks >= gradeRange.min && marks <= gradeRange.max) {
      return gradeRange.points;
    }
  }
  return 0;
}

export function calculateEarnedCGPA(grades: GradeData[]): number {
  if (grades.length === 0) return 0;

  let totalPoints = 0;
  let totalCredits = 0;

  for (const grade of grades) {
    const points = marksToGradePoints(grade.earned_marks);
    totalPoints += points * grade.credits;
    totalCredits += grade.credits;
  }

  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

export function calculateProjectedCGPA(
  earnedGrades: GradeData[],
  pendingCredits: number
): { low: number; high: number } {
  const earnedCGPA = calculateEarnedCGPA(earnedGrades);

  if (earnedGrades.length === 0) {
    // No data, assume full range
    return { low: 8.0, high: 10.0 };
  }

  let totalPoints = 0;
  let totalCredits = 0;

  for (const grade of earnedGrades) {
    const points = marksToGradePoints(grade.earned_marks);
    totalPoints += points * grade.credits;
    totalCredits += grade.credits;
  }

  // Low projection: remaining courses score 8 (A)
  const lowProjectionPoints = totalPoints + pendingCredits * 8;
  const lowCGPA = lowProjectionPoints / (totalCredits + pendingCredits);

  // High projection: remaining courses score 10 (O)
  const highProjectionPoints = totalPoints + pendingCredits * 10;
  const highCGPA = highProjectionPoints / (totalCredits + pendingCredits);

  return {
    low: Math.round(lowCGPA * 100) / 100,
    high: Math.round(highCGPA * 100) / 100,
  };
}

export function calculateGoldMedalGap(
  projectedCGPA: { low: number; high: number },
  targetCGPA: number = 9.6
): {
  low: number;
  high: number;
  status: 'on_track' | 'at_risk' | 'critical';
} {
  const gapLow = projectedCGPA.low - targetCGPA;
  const gapHigh = projectedCGPA.high - targetCGPA;

  let status: 'on_track' | 'at_risk' | 'critical';
  if (gapHigh >= 0) {
    status = 'on_track'; // Best case is above target
  } else if (gapLow >= -0.3) {
    status = 'at_risk'; // Worst case is close to target
  } else {
    status = 'critical'; // Worst case is far below target
  }

  return {
    low: Math.round(gapLow * 100) / 100,
    high: Math.round(gapHigh * 100) / 100,
    status,
  };
}

export function calculateCGPAMetrics(
  earnedGrades: GradeData[],
  pendingCredits: number = 10,
  targetCGPA: number = 9.6
): CGPAResult {
  const earned = calculateEarnedCGPA(earnedGrades);
  const projected = calculateProjectedCGPA(earnedGrades, pendingCredits);
  const gap = calculateGoldMedalGap(projected, targetCGPA);

  return {
    earned_cgpa: Math.round(earned * 100) / 100,
    projected_cgpa: projected,
    target_cgpa: targetCGPA,
    gap,
  };
}
