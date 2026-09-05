/**
 * Helper to format week due dates and badges consistently across NabungID.
 * Formats:
 * - formatWeekDueDate(20, '2026-08-06') -> "6 Agu 2026"
 * - formatWeekBadge(20, '2026-08-06') -> "Mg-20 (6 Agu 2026)"
 * - formatWeekShortBadge(20, '2026-08-06') -> "M20 (6 Agu 2026)"
 */

export function formatWeekDueDate(weekNumber: number, dueDateStr?: string): string {
  if (dueDateStr) {
    const d = new Date(dueDateStr);
    if (!isNaN(d.getTime())) {
      const day = d.getDate();
      const month = d.toLocaleDateString('id-ID', { month: 'short' });
      const year = d.getFullYear();
      return `${day} ${month} ${year}`;
    }
  }

  // Fallback 1447H cycle standard: starts 7 Apr 2025 (H+1 Idul Fitri)
  const d = new Date('2025-04-07T00:00:00.000Z');
  d.setDate(d.getDate() + (weekNumber - 1) * 7);
  const day = d.getDate();
  const month = d.toLocaleDateString('id-ID', { month: 'short' });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatWeekBadge(weekNumber: number, dueDateStr?: string): string {
  const formattedDate = formatWeekDueDate(weekNumber, dueDateStr);
  return `Mg-${weekNumber} (${formattedDate})`;
}

export function formatWeekShortBadge(weekNumber: number, dueDateStr?: string): string {
  const formattedDate = formatWeekDueDate(weekNumber, dueDateStr);
  return `M${weekNumber} (${formattedDate})`;
}
