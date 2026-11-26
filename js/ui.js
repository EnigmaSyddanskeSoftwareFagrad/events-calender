import {
  escapeHtml,
  parseDateParts,
  getEventStatus,
  formatEventDateRange,
  formatEventTime,
} from './date.js';

const ICONS = {
  discord:
    '<svg class="btn-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52.07.07 0 0 0-.08.04c-.21.38-.44.87-.61 1.25a18.27 18.27 0 0 0-5.49 0 12.64 12.64 0 0 0-.62-1.25.08.08 0 0 0-.08-.04A19.74 19.74 0 0 0 3.67 4.37a.07.07 0 0 0-.03.03C.53 9.05-.32 13.58.1 18.06a.08.08 0 0 0 .03.06 19.9 19.9 0 0 0 5.99 3.03.08.08 0 0 0 .08-.03c.46-.63.87-1.3 1.23-2a.08.08 0 0 0-.04-.11 13.1 13.1 0 0 1-1.87-.89.08.08 0 0 1-.01-.13c.13-.09.25-.19.37-.29a.08.08 0 0 1 .08-.01c3.93 1.79 8.18 1.79 12.06 0a.08.08 0 0 1 .08.01c.12.1.24.2.37.29a.08.08 0 0 1 0 .13c-.6.35-1.22.65-1.88.89a.08.08 0 0 0-.04.11c.36.7.78 1.37 1.23 2a.08.08 0 0 0 .08.03 19.83 19.83 0 0 0 6-3.03.08.08 0 0 0 .03-.06c.5-5.18-.84-9.68-3.55-13.66a.06.06 0 0 0-.03-.03ZM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.34-.96 2.42-2.16 2.42Zm7.97 0c-1.18 0-2.16-1.08-2.16-2.42 0-1.33.96-2.42 2.16-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.34-.95 2.42-2.16 2.42Z"/></svg>',
  facebook:
    '<svg class="btn-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.57v1.89h2.77l-.44 2.91h-2.33V22c4.78-.76 8.43-4.92 8.43-9.94Z"/></svg>',
  linkedin:
    '<svg class="btn-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z"/></svg>',
  github:
    '<svg class="btn-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/></svg>',
  calendar:
    '<svg class="btn-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 16H5V10h14v10Zm0-12H5V6h14v2Z"/></svg>',
};

function statusBadgeClass(key) {
  if (key === 'today') return 'badge-today';
  if (key === 'past') return 'badge-past';
  return 'badge-upcoming';
}

export function renderTopbarButtons(container, config) {
  const socialButtons = (config.socials || [])
    .map((s) => {
      const key = String(s.id || s.name || '').toLowerCase();
      return `<a class="btn" href="${escapeHtml(s.url)}" target="_blank" rel="noopener">${ICONS[key] || ''}<span>${escapeHtml(s.name)}</span></a>`;
    })
    .join('');

  const calHref = config.calendarUrl || 'https://calendar.google.com';
  container.innerHTML = `
    ${socialButtons}
    <a class="btn" id="calendar-btn" href="${escapeHtml(calHref)}" target="_blank" rel="noopener">${ICONS.calendar}<span>Calendar</span></a>
  `;
}

export function renderFooter(container, organization) {
  container.innerHTML = `
    <span>📍 ${escapeHtml(organization.location)}</span>
    <a href="mailto:${escapeHtml(organization.email)}">${escapeHtml(organization.email)}</a>
  `;
}

export function renderEventMedia(container, ev) {
  const imageUrl = ev?.image || ev?.poster;

  const showLogoFallback = () => {
    container.className = 'event-media event-media--logo';
    container.innerHTML = '<img class="event-media__logo" src="assets/logo-text-white.svg" alt="ENIGMA Logo" />';
  };

  if (!imageUrl) {
    showLogoFallback();
    return;
  }

  const img = document.createElement('img');
  img.className = 'event-media__img';
  img.alt = ev.title || 'Event image';
  img.src = imageUrl;
  img.addEventListener('error', showLogoFallback);

  container.className = 'event-media event-media--image';
  container.innerHTML = '';
  container.appendChild(img);
}

export function renderCards(container, countEl, events, selectedIdx, todayISO, onSelect) {
  countEl.textContent = `${events.length} ${events.length === 1 ? 'event' : 'events'}`;

  if (events.length === 0) {
    container.innerHTML =
      '<p style="color: var(--enigma-text-muted); padding: 12px;">No events match the selected filter.</p>';
    return;
  }

  container.innerHTML = events
    .map((ev, idx) => {
      const dateParts = parseDateParts(ev.date);
      const status = getEventStatus(ev, todayISO);
      const isSelected = idx === selectedIdx;
      const partners = Array.isArray(ev.collaborators) ? ev.collaborators : [];

      return `
        <button type="button" class="event-card ${isSelected ? 'is-active' : ''} ${status.key === 'past' ? 'is-past' : ''}" data-index="${idx}" aria-pressed="${isSelected}">
          <div class="event-card__date">
            <span class="event-card__day">${escapeHtml(dateParts ? dateParts.dayPadded : '—')}</span>
            <span class="event-card__month">${escapeHtml(dateParts ? dateParts.monthShort : 'TBA')}</span>
            <span class="event-card__weekday">${escapeHtml(dateParts ? dateParts.weekdayShort : '')}</span>
          </div>
          <div class="event-card__body">
            <div class="event-card__top">
              <h3 class="event-card__title">${escapeHtml(ev.title)}</h3>
              <span class="badge ${statusBadgeClass(status.key)}">${escapeHtml(status.label)}</span>
            </div>
            <div class="event-card__meta">
              <span>🕒 ${escapeHtml(formatEventTime(ev))}</span>
              <span>📍 ${escapeHtml(ev.location || 'SDU')}</span>
            </div>
            ${ev.summary ? `<p class="event-card__summary">${escapeHtml(ev.summary)}</p>` : ''}
            <div class="event-card__tags">
              ${ev.category ? `<span class="badge badge-category">${escapeHtml(ev.category)}</span>` : ''}
              ${partners.map((p) => `<span class="badge badge-partner">x ${escapeHtml(p)}</span>`).join('')}
            </div>
          </div>
        </button>
      `;
    })
    .join('');

  container.querySelectorAll('.event-card').forEach((cardEl) => {
    cardEl.addEventListener('click', () => onSelect(Number(cardEl.getAttribute('data-index'))));
  });
}

export function renderSpotlight(mediaEl, detailsEl, ev, todayISO) {
  renderEventMedia(mediaEl, ev);

  if (!ev) {
    detailsEl.innerHTML =
      '<p style="color: var(--enigma-text-muted);">Select an event on the left to view its details.</p>';
    return;
  }

  const status = getEventStatus(ev, todayISO);
  const partners = Array.isArray(ev.collaborators) && ev.collaborators.length > 0
    ? ev.collaborators.join(', ')
    : 'Enigma';
  const showSeparateSummary = Boolean(ev.summary && ev.description && ev.summary !== ev.description);

  detailsEl.innerHTML = `
    <div class="spotlight-details__header">
      <h2 class="spotlight-details__title">${escapeHtml(ev.title)}</h2>
      <div class="spotlight-details__badges">
        <span class="badge ${statusBadgeClass(status.key)}">${escapeHtml(status.label)}</span>
        ${ev.category ? `<span class="badge badge-category">${escapeHtml(ev.category)}</span>` : ''}
      </div>
    </div>
    <div class="spotlight-meta-grid">
      <div class="meta-tile">
        <span class="meta-tile__label">Date</span>
        <span class="meta-tile__value">${escapeHtml(formatEventDateRange(ev))}</span>
      </div>
      <div class="meta-tile">
        <span class="meta-tile__label">Time</span>
        <span class="meta-tile__value">${escapeHtml(formatEventTime(ev))}</span>
      </div>
      <div class="meta-tile">
        <span class="meta-tile__label">Location</span>
        <span class="meta-tile__value">${escapeHtml(ev.location || 'Softwarezonen (Ø20-604b-1)')}</span>
      </div>
      <div class="meta-tile">
        <span class="meta-tile__label">Organizers / Partners</span>
        <span class="meta-tile__value">${escapeHtml(partners)}</span>
      </div>
    </div>
    ${
      showSeparateSummary || ev.description
        ? `<div class="spotlight-scroll">
            ${showSeparateSummary ? `<p class="spotlight-details__summary">${escapeHtml(ev.summary)}</p>` : ''}
            <p class="spotlight-details__desc">${escapeHtml(ev.description || ev.summary || '')}</p>
          </div>`
        : ''
    }
    ${
      ev.signupUrl
        ? `<div class="spotlight-actions">
            <a class="btn btn-primary" href="${escapeHtml(ev.signupUrl)}" target="_blank" rel="noopener">🔗 More info / Sign up</a>
          </div>`
        : ''
    }
  `;
}

export function renderEmptyState(container) {
  container.innerHTML = `
    <div class="empty-panel">
      <img class="empty-panel__logo" src="assets/logo-icon.svg" alt="Enigma" />
      <h2>No events published yet</h2>
      <p>Check back soon or follow Enigma on Discord, Facebook, LinkedIn, and GitHub for upcoming announcements.</p>
    </div>
  `;
}
