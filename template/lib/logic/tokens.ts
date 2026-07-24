// Token logic for bunk management

export interface TokenStatus {
  subject_code: string;
  credits: number;
  tokens_remaining: number;
  tokens_max: number;
  status: 'abundant' | 'caution' | 'danger';
}

export function getTokenStatus(
  tokensRemaining: number
): 'abundant' | 'caution' | 'danger' {
  if (tokensRemaining >= 5) return 'abundant';
  if (tokensRemaining >= 3) return 'caution';
  return 'danger';
}

export function getTokenStatusColor(
  status: 'abundant' | 'caution' | 'danger'
): string {
  const colors = {
    abundant: '#10b981', // green
    caution: '#f59e0b', // yellow
    danger: '#ef4444', // red
  };
  return colors[status];
}

export function shouldPulse(status: 'abundant' | 'caution' | 'danger'): boolean {
  return status === 'danger'; // Only pulse red
}

export function calculateAttendancePercentage(
  attendedCount: number,
  totalSessions: number
): number {
  if (totalSessions === 0) return 0;
  return Math.round((attendedCount / totalSessions) * 100);
}

export function getAttendanceStatus(
  attendedCount: number,
  totalSessions: number,
  maxBunks: number
): string {
  const attendancePercent = calculateAttendancePercentage(
    attendedCount,
    totalSessions
  );
  const minimumRequired = ((totalSessions - maxBunks) / totalSessions) * 100;

  if (attendancePercent >= minimumRequired) {
    return 'On Track';
  } else if (attendancePercent >= minimumRequired - 5) {
    return 'Caution';
  } else {
    return 'At Risk';
  }
}

export function canSpendBunk(tokensRemaining: number): boolean {
  return tokensRemaining > 0;
}

export function getExecutionRisk(
  tokens: TokenStatus[]
): 'low' | 'medium' | 'high' {
  // High: any subject has <2 tokens
  if (tokens.some((t) => t.tokens_remaining < 2)) {
    return 'high';
  }
  // Medium: any subject has <3 tokens
  if (tokens.some((t) => t.tokens_remaining < 3)) {
    return 'medium';
  }
  // Low: all subjects have >=3 tokens
  return 'low';
}

export function sortByUrgency(tokens: TokenStatus[]): TokenStatus[] {
  return [...tokens].sort((a, b) => {
    const statusOrder = { danger: 0, caution: 1, abundant: 2 };
    const statusDiff =
      statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    // Within same status, sort by tokens remaining (ascending)
    return a.tokens_remaining - b.tokens_remaining;
  });
}
