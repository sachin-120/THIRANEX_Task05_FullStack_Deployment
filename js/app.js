/*
  Cybersecurity Resource Hub & Learning Dashboard
  JS/APP.JS - Central Coordinator & Router (Event Delegation, Reactive Updates, API Dynamic Views)
*/

import { stateStore } from './state.js';
import { StorageManager } from './storage.js';
import { APIService } from './api.js';
import { Utils } from './utils.js';

// Define static source codes for our portfolio projects (Simulating technical audits)
const AUDIT_REPORTS = {
  scanner: {
    title: "Sentinel Port Scanner",
    vulnerabilities: "0 Critical, 1 Low (Hardcoded timeout fallback limits)",
    remediation: "Configure custom dynamically scaled socket timeout constants instead of strict 1.0s boundaries to avoid missing slow endpoints.",
    code: `import socket\nimport threading\n\ndef scan_port(ip, port):\n    try:\n        # AUDIT REVIEW: Hardcoded timeout can block under slow subnet responses\n        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n        sock.settimeout(1.0) \n        result = sock.connect_ex((ip, port))\n        if result == 0:\n            print(f"[+] Port {port} is OPEN")\n        sock.close()\n    except Exception as e:\n        pass`
  },
  vault: {
    title: "Quantum Cipher Vault",
    vulnerabilities: "0 Vulnerabilities (100% Cryptographic Isolation)",
    remediation: "No remediation required. Zero-allocation memory cleaners are active in heap structures, preventing memory scavenging attempts.",
    code: `use ring::aead::{LessSafeKey, UnboundKey, AES_256_GCM, NONCE_LEN};\nuse ring::pbkdf2;\n\npub fn secure_encrypt(data: &[u8], key: &[u8]) -> Vec<u8> {\n    // AUDIT REVIEW: Industry-grade AES-GCM secure block cipher with 96-bit unique nonces\n    let unbound_key = UnboundKey::new(&AES_256_GCM, key).unwrap();\n    let mut seal_key = LessSafeKey::new(unbound_key);\n    let nonce = generate_unique_nonce();\n    let mut in_out = data.to_vec();\n    seal_key.seal_in_place_append_tag(nonce, aead::Aad::empty(), &mut in_out).unwrap();\n    in_out\n}`
  },
  pcap: {
    title: "Beacon PCAP Analyser",
    vulnerabilities: "1 Medium (No regex safety guards on untrusted packet headers)",
    remediation: "Verify payload lengths explicitly in headers before passing into raw string parsing buffers to prevent heap overflow risks.",
    code: `const fs = require('fs');\n\nfunction analyzePacketStream(filePath) {\n  // AUDIT REVIEW: Unrestricted reading of huge pcap arrays can cause heap memory limits overflow\n  const packetBuffer = fs.readFileSync(filePath);\n  let pointer = 0;\n  while (pointer < packetBuffer.length) {\n    const headerSize = packetBuffer.readUInt32LE(pointer);\n    pointer += headerSize + 4;\n  }\n}`
  },
  gitguard: {
    title: "Git-Lock Sentinel Guard",
    vulnerabilities: "0 Critical, 1 Low (ReDoS risk in key matching regex)",
    remediation: "Optimise the API token regex engine to avoid backtracking. Replace complex nested capture brackets with strict non-backtracking alternatives.",
    code: `#!/bin/bash\n# AUDIT REVIEW: Scans local code staged commits for leaked entropy\nSTAGED_FILES=$(git diff --cached --name-only)\n\nfor file in $STAGED_FILES; do\n  if grep -E "AIza[0-9A-Za-z-_]{35}" "$file"; then\n    echo "[!] CRITICAL: Detected staged Google API Secret key in $file!"\n    exit 1\n  fi\ndone`
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize State Store from Storage
  const savedState = StorageManager.load();
  stateStore.initialize(savedState);

  // 2. Automatically save State updates to Storage on changes
  stateStore.subscribe('theme', () => StorageManager.save(stateStore.getState()));
  stateStore.subscribe('roadmapProgress', () => StorageManager.save(stateStore.getState()));
  stateStore.subscribe('bookmarks', () => StorageManager.save(stateStore.getState()));
  stateStore.subscribe('activities', () => StorageManager.save(stateStore.getState()));

  // 3. Global Nav Drawer Controllers & Themes
  initGlobalControllers();

  // 4. Page Router Coordination
  const currentPath = window.location.pathname;

  if (currentPath.includes('dashboard.html')) {
    initDashboardPage();
  } else if (currentPath.includes('projects.html')) {
    initProjectsPage();
  } else if (currentPath.includes('roadmap.html')) {
    initRoadmapPage();
  } else if (currentPath.includes('resources.html')) {
    initResourcesPage();
  } else {
    // Welcome landing Page (index.html) or default fallback
    initLandingPage();
  }
});

/* ==========================================
   GLOBAL CONTROLLER REGISTRATION
   ========================================== */
function initGlobalControllers() {
  const root = document.documentElement;

  // Toggle Theme Listener
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    // Load initial theme state
    const currentTheme = stateStore.getState().theme || 'dark';
    root.setAttribute('data-theme', currentTheme);
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
      const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', nextTheme);
      themeToggle.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
      stateStore.setTheme(nextTheme);
    });
  }

  // Mobile Drawer Toggle Drawer Listener
  const mobileToggle = document.getElementById('mobile-toggle');
  const sidebar = document.getElementById('sidebar');
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });

    // Close mobile sidebar drawer if user clicks outside of it
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('active') && 
          !sidebar.contains(e.target) && 
          e.target !== mobileToggle) {
        sidebar.classList.remove('active');
      }
    });
  }
}

/* ==========================================
   LANDING / WELCOME PAGE (index.html)
   ========================================== */
function initLandingPage() {
  // Any quick index-only initialization (e.g. tracking index metrics)
  console.log("Terminal Console Booted.");
}

/* ==========================================
   COMMAND CENTER PAGE (dashboard.html)
   ========================================== */
function initDashboardPage() {
  // Subscribed Updates
  stateStore.subscribe('roadmapProgress', () => {
    renderDashboardProgress();
  });

  stateStore.subscribe('activities', (acts) => {
    renderActivityList(acts);
  });

  // Trigger initial renders
  renderDashboardProgress();
  renderActivityList(stateStore.getState().activities);
  renderDashboardSparkline();
}

function renderDashboardProgress() {
  const state = stateStore.getState();
  const nodes = Object.keys(state.roadmapProgress);
  const total = nodes.length;
  const completed = nodes.filter(key => state.roadmapProgress[key] === true).length;

  const percentage = total > 0 ? (completed / total) * 100 : 0;

  // Render circular ring meter
  Utils.renderCircularProgress('dashboard-progress-ring', percentage, 140, 'Completed');

  // Update text counter milestones
  const milestoneCountEl = document.getElementById('milestone-counter');
  if (milestoneCountEl) {
    milestoneCountEl.textContent = `${completed} / ${total}`;
  }

  // Render SVG Skills Radar chart based on completed modules
  const skillsDataset = {
    networking: 20 + (state.roadmapProgress['net-101'] ? 40 : 0) + (state.roadmapProgress['net-102'] ? 40 : 0),
    defensive: 15 + (state.roadmapProgress['linux-101'] ? 40 : 0) + (state.roadmapProgress['sec-101'] ? 45 : 0),
    offensive: 10 + (state.roadmapProgress['crypt-101'] ? 50 : 0) + (state.roadmapProgress['pentest-101'] ? 40 : 0),
    cryptography: 20 + (state.roadmapProgress['sec-102'] ? 80 : 0),
    devsecops: 15 + (state.roadmapProgress['rev-101'] ? 80 : 0)
  };

  Utils.renderRadarSkills('dashboard-radar-skills', skillsDataset, 220);
}

function renderActivityList(activities) {
  const container = document.getElementById('activity-log-list');
  if (!container) return;

  if (!activities || activities.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.85rem; text-align: center; margin: auto;">No activity logged.</p>`;
    return;
  }

  container.innerHTML = activities.map(act => `
    <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem; font-family: var(--font-mono); font-size: 0.8rem; border-left: 2px solid var(--accent-${act.type === 'success' ? 'green' : act.type === 'warning' ? 'red' : 'cyan'}); padding-left: 0.5rem;">
      <div style="display: flex; flex-direction: column;">
        <span style="color: var(--text-primary);">${Utils.escapeHTML(act.text)}</span>
        <span style="color: var(--text-muted); font-size: 0.7rem;">${act.timestamp}</span>
      </div>
      <span class="tech-dot ${act.type}"></span>
    </div>
  `).join('');
}

function renderDashboardSparkline() {
  // Sparkline data points represent simulated activity over a 7-day scale
  const activityData = [3, 8, 5, 9, 4, 7, 12];
  Utils.renderLineGraph('activity-sparkline-graph', activityData, 400, 150);
}

/* ==========================================
   PROJECT SHOWCASE PAGE (projects.html)
   ========================================== */
function initProjectsPage() {
  const searchInput = document.getElementById('project-search');
  const filterButtons = document.querySelectorAll('#project-filters button');
  const projectCards = document.querySelectorAll('#project-showcase-grid article');

  // Interactive filtering coordinator
  const filterProjects = () => {
    const query = searchInput.value.toLowerCase();
    const activeFilter = document.querySelector('#project-filters .btn-cyber-primary').getAttribute('data-filter');

    projectCards.forEach(card => {
      const title = card.querySelector('.card-title').textContent.toLowerCase();
      const desc = card.querySelector('p').textContent.toLowerCase();
      const category = card.getAttribute('data-category');

      const matchesSearch = title.includes(query) || desc.includes(query);
      const matchesCategory = activeFilter === 'all' || category === activeFilter;

      if (matchesSearch && matchesCategory) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  };

  // Bind debounced search
  if (searchInput) {
    searchInput.addEventListener('input', Utils.debounce(filterProjects, 250));
  }

  // Bind filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('btn-cyber-primary');
        b.classList.add('btn-cyber-secondary');
      });
      btn.classList.add('btn-cyber-primary');
      btn.classList.remove('btn-cyber-secondary');
      filterProjects();
    });
  });

  // Modal actions (WCAG compliant)
  const modal = document.getElementById('audit-modal');
  const modalBody = document.getElementById('modal-body-content');
  const modalClose = document.getElementById('modal-close');
  let previouslyFocusedElement = null;

  const openAuditModal = (projectId) => {
    const projectReport = AUDIT_REPORTS[projectId];
    if (!projectReport) return;

    previouslyFocusedElement = document.activeElement;

    modalBody.innerHTML = `
      <div>
        <h3 style="color: var(--accent-cyan); font-size: 1.25rem; font-family: var(--font-family); margin-bottom: 0.5rem;">${Utils.escapeHTML(projectReport.title)}</h3>
        <p style="margin-bottom: 1rem;"><strong style="color: var(--accent-red);">Detected Vulnerabilities:</strong> ${Utils.escapeHTML(projectReport.vulnerabilities)}</p>
        <p style="margin-bottom: 1.25rem;"><strong style="color: var(--accent-green);">Recommended Remediation:</strong> ${Utils.escapeHTML(projectReport.remediation)}</p>
        
        <strong style="color: var(--text-primary); font-family: var(--font-mono); font-size: 0.85rem; display: block; margin-bottom: 0.5rem;">[CODE AUDIT MODULE VIEW]</strong>
        <pre style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); padding: 1rem; border-radius: 6px; overflow-x: auto; font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-green); line-height: 1.4;">${Utils.escapeHTML(projectReport.code)}</pre>
      </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    modalClose.focus();
    
    // Trap tab index controls inside modal boundaries
    Utils.trapFocus(modal);
  };

  const closeAuditModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  };

  // Register all Audit Buttons
  const auditButtons = document.querySelectorAll('.btn-audit');
  auditButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.getAttribute('data-project');
      openAuditModal(pId);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeAuditModal);
  }

  // Close modal on escape keypress
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeAuditModal();
    }
  });
}

/* ==========================================
   SENTINEL PATHWAY PAGE (roadmap.html)
   ========================================== */
function initRoadmapPage() {
  const checkboxes = document.querySelectorAll('.roadmap-node input[type="checkbox"]');
  const state = stateStore.getState();

  // Load existing checkbox checklist structures
  checkboxes.forEach(chk => {
    const nodeId = chk.getAttribute('data-node');
    if (state.roadmapProgress[nodeId] === true) {
      chk.checked = true;
      document.getElementById(`node-${nodeId}`).classList.add('completed');
    }

    // Toggle complete handlers
    chk.addEventListener('change', () => {
      const nodeWrapper = document.getElementById(`node-${nodeId}`);
      if (chk.checked) {
        nodeWrapper.classList.add('completed');
        stateStore.toggleRoadmapNode(nodeId, true);
      } else {
        nodeWrapper.classList.remove('completed');
        stateStore.toggleRoadmapNode(nodeId, false);
      }
    });
  });
}

/* ==========================================
   LIVE THREAT FEED PAGE (resources.html)
   ========================================== */
let activeResourceFeed = 'devto'; // Default toggle feed state

function initResourcesPage() {
  const btnDevto = document.getElementById('btn-toggle-devto');
  const btnGithub = document.getElementById('btn-toggle-github');
  const searchInput = document.getElementById('feed-search');

  // Handle feed selection tab
  if (btnDevto && btnGithub) {
    btnDevto.addEventListener('click', () => {
      activeResourceFeed = 'devto';
      btnDevto.classList.add('btn-cyber-primary');
      btnDevto.classList.remove('btn-cyber-secondary');
      btnGithub.classList.add('btn-cyber-secondary');
      btnGithub.classList.remove('btn-cyber-primary');
      loadResourceFeeds();
    });

    btnGithub.addEventListener('click', () => {
      activeResourceFeed = 'github';
      btnGithub.classList.add('btn-cyber-primary');
      btnGithub.classList.remove('btn-cyber-secondary');
      btnDevto.classList.add('btn-cyber-secondary');
      btnDevto.classList.remove('btn-cyber-primary');
      loadResourceFeeds();
    });
  }

  // Subscribe to bookmark mutations to redraw bookmarked panel
  stateStore.subscribe('bookmarks', () => {
    renderBookmarksPanel();
    // Redraw feed to sync active star outlines
    loadResourceFeeds(false); 
  });

  // Bind debounced search
  if (searchInput) {
    searchInput.addEventListener('input', Utils.debounce(() => loadResourceFeeds(false), 250));
  }

  // Initial load
  loadResourceFeeds();
  renderBookmarksPanel();
}

async function loadResourceFeeds(showSkeleton = true) {
  const grid = document.getElementById('resources-feed-grid');
  const searchQuery = document.getElementById('feed-search').value.toLowerCase();
  if (!grid) return;

  if (showSkeleton) {
    // Inject loader skeleton cards
    grid.innerHTML = `
      <div class="cyber-card skeleton-card">
        <div class="card-header"><div class="skeleton skeleton-title"></div></div>
        <div class="skeleton skeleton-text" style="width: 90%;"></div>
        <div class="skeleton skeleton-text" style="width: 80%;"></div>
      </div>
      <div class="cyber-card skeleton-card">
        <div class="card-header"><div class="skeleton skeleton-title"></div></div>
        <div class="skeleton skeleton-text" style="width: 90%;"></div>
        <div class="skeleton skeleton-text" style="width: 80%;"></div>
      </div>
      <div class="cyber-card skeleton-card">
        <div class="card-header"><div class="skeleton skeleton-title"></div></div>
        <div class="skeleton skeleton-text" style="width: 90%;"></div>
        <div class="skeleton skeleton-text" style="width: 80%;"></div>
      </div>
    `;
  }

  // Fetch dynamic items
  let rawData = [];
  if (activeResourceFeed === 'devto') {
    rawData = await APIService.fetchArticles();
  } else {
    rawData = await APIService.fetchGithubProjects();
  }

  const savedBookmarks = stateStore.getState().bookmarks;

  // Filter records in client-side search input queries
  const filteredData = rawData.filter(item => {
    const title = (item.title || item.name || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    return title.includes(searchQuery) || desc.includes(searchQuery);
  });

  if (filteredData.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1 / -1; color: var(--text-muted); font-size: 0.95rem; text-align: center; padding: 3rem 0;">No active threat records found matching queries.</p>`;
    return;
  }

  // Map to structured HTML
  grid.innerHTML = filteredData.map(item => {
    const id = item.id || item.node_id || `item-${Date.now()}-${Math.random()}`;
    const title = item.title || item.name;
    const url = item.url || item.html_url;
    const desc = item.description || 'No additional threat summaries documented.';
    
    // Check if item is bookmarked
    const isBookmarked = savedBookmarks.some(b => b.id === id);

    if (activeResourceFeed === 'devto') {
      const tagsHTML = (item.tag_list || []).map(t => `<span class="badge badge-cyan" style="font-size: 0.6rem;">#${Utils.escapeHTML(t)}</span>`).join(' ');
      
      return `
        <article class="cyber-card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div class="card-header">
              <div class="card-title" style="font-size: 0.95rem; line-height: 1.3;">
                ${Utils.escapeHTML(title)}
              </div>
              <button class="bookmark-star-btn ${isBookmarked ? 'active' : ''}" 
                      data-id="${id}" 
                      data-title="${Utils.escapeHTML(title)}" 
                      data-url="${url}"
                      aria-label="Toggle bookmark for ${Utils.escapeHTML(title)}">
                ★
              </button>
            </div>
            <p style="font-size: 0.85rem; margin-bottom: 1rem;">${Utils.escapeHTML(desc)}</p>
          </div>
          <div>
            <div style="display: flex; gap: 0.25rem; flex-wrap: wrap; margin-bottom: 1rem;">${tagsHTML}</div>
            <div class="flex-between">
              <span style="font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono);">${item.published_at || 'Logs Stable'}</span>
              <a href="${url}" target="_blank" rel="noopener" class="btn btn-cyber-secondary" style="font-size: 0.75rem; padding: 0.4rem 0.8rem;">Read Feed</a>
            </div>
          </div>
        </article>
      `;
    } else {
      // Github feeds layout
      return `
        <article class="cyber-card" style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div class="card-header">
              <div class="card-title" style="font-size: 0.95rem; font-family: var(--font-mono);">
                ${Utils.escapeHTML(title)}
              </div>
              <button class="bookmark-star-btn ${isBookmarked ? 'active' : ''}" 
                      data-id="${id}" 
                      data-title="${Utils.escapeHTML(title)}" 
                      data-url="${url}"
                      aria-label="Toggle bookmark for ${Utils.escapeHTML(title)}">
                ★
              </button>
            </div>
            <p style="font-size: 0.85rem; margin-bottom: 1rem;">${Utils.escapeHTML(desc)}</p>
          </div>
          <div>
            <div class="flex-between">
              <span class="badge badge-purple" style="font-size: 0.65rem;">⭐ ${item.stargazers_count || 0} Stars</span>
              <a href="${url}" target="_blank" rel="noopener" class="btn btn-cyber-secondary" style="font-size: 0.75rem; padding: 0.4rem 0.8rem;">Clone Code</a>
            </div>
          </div>
        </article>
      `;
    }
  }).join('');

  // Register bookmark buttons click events
  grid.querySelectorAll('.bookmark-star-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const res = {
        id: btn.getAttribute('data-id'),
        title: btn.getAttribute('data-title'),
        url: btn.getAttribute('data-url')
      };
      stateStore.toggleBookmark(res);
    });
  });
}

function renderBookmarksPanel() {
  const container = document.getElementById('saved-bookmarks-container');
  const badge = document.getElementById('bookmark-counter-badge');
  if (!container) return;

  const bookmarks = stateStore.getState().bookmarks;

  if (badge) {
    badge.textContent = `${bookmarks.length} SAVED`;
  }

  if (bookmarks.length === 0) {
    container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 1.5rem 0;">No bookmark logs saved yet. Click the star icon on threat feeds above to add records.</p>`;
    return;
  }

  container.innerHTML = bookmarks.map(b => `
    <div class="flex-between" style="background: rgba(0,0,0,0.15); border: 1px solid var(--border-color); padding: 0.75rem 1.25rem; border-radius: 8px;">
      <div style="display: flex; flex-direction: column; gap: 0.15rem;">
        <span style="font-size: 0.9rem; font-weight: 600; color: var(--text-primary);">${Utils.escapeHTML(b.title)}</span>
        <a href="${b.url}" target="_blank" rel="noopener" style="font-size: 0.75rem; color: var(--accent-cyan); text-decoration: none;">${b.url}</a>
      </div>
      <button class="btn btn-cyber-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;" onclick="document.dispatchEvent(new CustomEvent('remove-bookmark', {detail: '${b.id}'}))">
        Remove
      </button>
    </div>
  `).join('');
}

// Global removal listener for bookmark dashboard buttons
document.addEventListener('remove-bookmark', (e) => {
  const targetId = e.detail;
  const bookmarks = stateStore.getState().bookmarks;
  const item = bookmarks.find(b => b.id === targetId);
  if (item) {
    stateStore.toggleBookmark(item);
  }
});
