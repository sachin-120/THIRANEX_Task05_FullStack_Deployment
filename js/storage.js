/*
  Cybersecurity Resource Hub & Learning Dashboard
  JS/STORAGE.JS - LocalStorage Persistence Layer & Initial Seed Data
*/

const STORAGE_KEY = 'CYBERSEC_HUB_STATE';

// Initial Mock Seed Data if localStore is empty (Gives recruiter immediate feedback)
const DEFAULT_SEED_DATA = {
  theme: 'dark',
  roadmapProgress: {
    'net-101': true,
    'net-102': true,
    'linux-101': true,
    'sec-101': false,
    'sec-102': false,
    'crypt-101': false,
    'pentest-101': false,
    'rev-101': false
  },
  bookmarks: [
    {
      id: 'res-seed-1',
      title: 'OWASP Top 10 Reference Guide',
      url: 'https://owasp.org/www-project-top-ten/',
      category: 'Web Security',
      addedAt: 'Seed Data'
    }
  ],
  activities: [
    {
      id: 'act-seed-1',
      timestamp: new Date().toLocaleTimeString(),
      text: 'Initialized Cyber Learning Environment',
      type: 'success'
    }
  ]
};

export const StorageManager = {
  // Test if storage is available
  isAvailable() {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('LocalStorage is blocked or not available in this context:', e);
      return false;
    }
  },

  // Save state
  save(stateSnapshot) {
    if (!this.isAvailable()) return;
    try {
      const serialized = JSON.stringify(stateSnapshot);
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (e) {
      console.error('Failed to serialize/save state:', e);
    }
  },

  // Load state
  load() {
    if (!this.isAvailable()) return DEFAULT_SEED_DATA;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // First boot: write initial seed
        this.save(DEFAULT_SEED_DATA);
        return DEFAULT_SEED_DATA;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading/parsing from LocalStorage. Loading defaults.', e);
      return DEFAULT_SEED_DATA;
    }
  },

  // Clear/Reset state
  clear() {
    if (!this.isAvailable()) return;
    localStorage.removeItem(STORAGE_KEY);
  }
};
