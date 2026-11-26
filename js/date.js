const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function getTodayISO(timeZone = 'Europe/Copenhagen') {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date());
    const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
    return `${map.year}-${map.month}-${map.day}`;
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

export function parseDateParts(dateStr) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(dateStr || '').trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const wd = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return {
    year,
    month,
    day,
    dayPadded: String(day).padStart(2, '0'),
    monthShort: MONTHS_SHORT[month - 1] || '',
    monthLong: MONTHS_LONG[month - 1] || '',
    weekdayShort: WEEKDAYS_SHORT[wd] || '',
    weekdayLong: WEEKDAYS_LONG[wd] || '',
  };
}

export function getEventStatus(ev, todayISO = getTodayISO()) {
  const start = ev?.date || '';
  const end = ev?.endDate || start;
  if (!start) return { key: 'upcoming', label: 'Upcoming' };
  if (end < todayISO) return { key: 'past', label: 'Past' };
  if (start <= todayISO && end >= todayISO) return { key: 'today', label: 'Today' };
  return { key: 'upcoming', label: 'Upcoming' };
}

export function formatEventDateRange(ev) {
  const start = parseDateParts(ev?.date);
  if (!start) return 'Date TBA';
  const end = ev?.endDate ? parseDateParts(ev.endDate) : null;
  if (end && ev.endDate !== ev.date) {
    if (start.month === end.month && start.year === end.year) {
      return `${start.monthLong} ${start.day}–${end.day}, ${start.year}`;
    }
    return `${start.monthShort} ${start.day} – ${end.monthShort} ${end.day}, ${end.year}`;
  }
  return `${start.weekdayLong}, ${start.monthLong} ${start.day}, ${start.year}`;
}

export function formatEventTime(ev) {
  if (!ev?.startTime) return 'Time TBA';
  if (ev.endTime) return `${ev.startTime} – ${ev.endTime}`;
  return `From ${ev.startTime}`;
}

export function pickInitialEventIndex(events, todayISO = getTodayISO()) {
  if (!Array.isArray(events) || events.length === 0) return -1;
  const idx = events.findIndex((ev) => (ev.endDate || ev.date || '') >= todayISO);
  return idx >= 0 ? idx : 0;
}
