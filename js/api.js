export const DEFAULT_CONFIG = {
  organization: {
    name: 'ENIGMA',
    location: 'Softwarezonen (Ø20-604b-1)',
    email: 'enigma@org.sdu.dk',
  },
  timezone: 'Europe/Copenhagen',
  calendarUrl: 'https://calendar.google.com',
  socials: [
    {
      id: 'discord',
      name: 'Discord',
      handle: 'discord.gg/5t9FZAS',
      url: 'https://discord.gg/5t9FZAS',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      handle: 'fb.me/EnigmaSSF',
      url: 'https://fb.me/EnigmaSSF',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      handle: 'Enigma - SDU',
      url: 'https://www.linkedin.com/company/enigma-sdu',
    },
    {
      id: 'github',
      name: 'GitHub',
      handle: 'EnigmaSyddanskeSoftwareFagrad',
      url: 'https://github.com/EnigmaSyddanskeSoftwareFagrad',
    },
  ],
};

async function readJsonFile(url) {
  try {
    const res = await fetch(`${url}${url.includes('?') ? '&' : '?'}v=${Date.now()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const text = (await res.text()).trim();
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

function normalizePayload(raw) {
  if (!raw) return null;
  const events = Array.isArray(raw) ? raw : Array.isArray(raw.events) ? raw.events : [];
  const sorted = [...events].sort((a, b) => {
    const d = String(a?.date || '').localeCompare(String(b?.date || ''));
    return d !== 0 ? d : String(a?.startTime || '').localeCompare(String(b?.startTime || ''));
  });
  return { events: sorted };
}

export async function loadSiteData() {
  const [rawConfig, rawCurrent] = await Promise.all([
    readJsonFile('config.json'),
    readJsonFile('current.json'),
  ]);

  const config = {
    ...DEFAULT_CONFIG,
    ...(rawConfig || {}),
    organization: { ...DEFAULT_CONFIG.organization, ...(rawConfig?.organization || {}) },
    socials: Array.isArray(rawConfig?.socials) ? rawConfig.socials : DEFAULT_CONFIG.socials,
  };

  return {
    config,
    current: normalizePayload(rawCurrent),
  };
}
