import { loadSiteData } from './api.js';
import { getTodayISO, pickInitialEventIndex } from './date.js';
import {
  renderTopbarButtons,
  renderFooter,
  renderCards,
  renderSpotlight,
  renderEmptyState,
} from './ui.js';

const els = {
  topbarActions: document.getElementById('topbar-actions'),
  emptyHost: document.getElementById('empty-host'),
  workspaceGrid: document.getElementById('workspace-grid'),
  filterAllBtn: document.getElementById('filter-all'),
  filterUpcomingBtn: document.getElementById('filter-upcoming'),
  eventsCount: document.getElementById('events-count'),
  cardsList: document.getElementById('cards-list'),
  eventMedia: document.getElementById('event-media'),
  spotlightDetails: document.getElementById('spotlight-details'),
  footerLinks: document.getElementById('footer-links'),
};

let siteState = null;
let filterMode = 'upcoming'; // 'upcoming' | 'all'
let visibleEvents = [];
let selectedIdx = 0;

function getAllPublicEvents() {
  return (siteState?.current?.events || []).filter(
    (ev) => String(ev?.visibility || 'public').toLowerCase() !== 'internal',
  );
}

function getFilteredEvents() {
  const all = getAllPublicEvents();
  if (filterMode !== 'upcoming') return all;
  const today = getTodayISO(siteState?.config?.timezone);
  return all.filter((ev) => (ev.endDate || ev.date || '') >= today);
}

function selectEvent(idx) {
  if (visibleEvents.length === 0) return;
  selectedIdx = ((idx % visibleEvents.length) + visibleEvents.length) % visibleEvents.length;

  els.cardsList.querySelectorAll('.event-card').forEach((card, i) => {
    const active = i === selectedIdx;
    card.classList.toggle('is-active', active);
    card.setAttribute('aria-pressed', String(active));
  });

  const today = getTodayISO(siteState?.config?.timezone);
  renderSpotlight(els.eventMedia, els.spotlightDetails, visibleEvents[selectedIdx], today);
}

function refreshView() {
  visibleEvents = getFilteredEvents();

  if (getAllPublicEvents().length === 0) {
    els.workspaceGrid.classList.add('hidden');
    els.emptyHost.classList.remove('hidden');
    renderEmptyState(els.emptyHost);
    return;
  }

  els.emptyHost.classList.add('hidden');
  els.workspaceGrid.classList.remove('hidden');

  const today = getTodayISO(siteState?.config?.timezone);
  const startIdx = pickInitialEventIndex(visibleEvents, today);
  selectedIdx = startIdx >= 0 ? startIdx : 0;

  renderCards(els.cardsList, els.eventsCount, visibleEvents, selectedIdx, today, selectEvent);
  renderSpotlight(els.eventMedia, els.spotlightDetails, visibleEvents[selectedIdx], today);
}

async function init() {
  siteState = await loadSiteData();

  renderTopbarButtons(els.topbarActions, siteState.config);
  renderFooter(els.footerLinks, siteState.config.organization);

  els.filterUpcomingBtn.addEventListener('click', () => {
    filterMode = 'upcoming';
    els.filterUpcomingBtn.classList.add('is-active');
    els.filterAllBtn.classList.remove('is-active');
    refreshView();
  });

  els.filterAllBtn.addEventListener('click', () => {
    filterMode = 'all';
    els.filterAllBtn.classList.add('is-active');
    els.filterUpcomingBtn.classList.remove('is-active');
    refreshView();
  });

  refreshView();
}

init();
