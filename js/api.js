/*
  Cybersecurity Resource Hub & Learning Dashboard
  JS/API.JS - Dynamic Fetch API Manager (Caching, Dev.to & GitHub Integrations, Mock Fallbacks)
*/

// Cache config (10 minutes)
const CACHE_DURATION = 10 * 60 * 1000; 

// Local Memory Cache
const apiCache = {
  devto: { data: null, timestamp: 0 },
  github: { data: null, timestamp: 0 }
};

// High-fidelity Mock Datasets as robust offline/rate-limit recovery fallback
const MOCK_DATA = {
  devto: [
    {
      id: 'mock-art-1',
      title: 'Demystifying Buffer Overflows: A Practical Hands-on Guide',
      description: 'Learn how buffer overflow vulnerabilities operate, explore stacks, and write safe secure C/C++ architectures to secure memory limits.',
      url: 'https://dev.to/t/cybersecurity',
      user: { name: 'SecOps_Pro', profile_image: 'https://placehold.co/100x100/101830/00ccff?text=SP' },
      published_at: new Date().toLocaleDateString(),
      tag_list: ['cybersecurity', 'c', 'hacking', 'exploit']
    },
    {
      id: 'mock-art-2',
      title: 'Practical Zero Trust Architecture: Implementation Patterns',
      description: 'Moving beyond buzzwords. A complete architectural blueprint to design identity-aware network access and strict micro-segmentation.',
      url: 'https://dev.to/t/cybersecurity',
      user: { name: 'NetSec_Engineer', profile_image: 'https://placehold.co/100x100/101830/9d4edd?text=NE' },
      published_at: new Date().toLocaleDateString(),
      tag_list: ['security', 'network', 'cloud', 'sysadmin']
    },
    {
      id: 'mock-art-3',
      title: 'Top 5 Open Source Tools for Automated Vulnerability Scanning',
      description: 'Boost your defensive posture with these production-grade scanners that integrate perfectly with Git and active CI/CD pipelines.',
      url: 'https://dev.to/t/cybersecurity',
      user: { name: 'AppSec_Analyst', profile_image: 'https://placehold.co/100x100/101830/00ff66?text=AA' },
      published_at: new Date().toLocaleDateString(),
      tag_list: ['devsecops', 'github', 'automation', 'infosec']
    }
  ],
  github: [
    {
      id: 'mock-repo-1',
      name: 'awesome-cybersecurity-blue-team',
      description: 'A curated list of awesome resources, toolsets, and frameworks for defensive security, threat hunting, and security operations centers (SOC).',
      html_url: 'https://github.com',
      stargazers_count: 8520,
      language: 'Markdown',
      owner: { avatar_url: 'https://placehold.co/100x100/101830/00ccff?text=AB' }
    },
    {
      id: 'mock-repo-2',
      name: 'packet-sniper',
      description: 'Ultra-fast asynchronous packet dissection and sniffing module written in Rust, featuring real-time stream analysis and anomaly flagging.',
      html_url: 'https://github.com',
      stargazers_count: 3240,
      language: 'Rust',
      owner: { avatar_url: 'https://placehold.co/100x100/101830/9d4edd?text=PS' }
    },
    {
      id: 'mock-repo-3',
      name: 'active-directory-fortress',
      description: 'Auditing scripts to analyze AD environments, identify misconfigured ACLs, scan for kerberoasting routes, and apply lock security GPOs.',
      html_url: 'https://github.com',
      stargazers_count: 1980,
      language: 'PowerShell',
      owner: { avatar_url: 'https://placehold.co/100x100/101830/00ff66?text=AD' }
    }
  ]
};

export const APIService = {
  // Fetch Cybersecurity Articles (Dev.to API)
  async fetchArticles(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && apiCache.devto.data && (now - apiCache.devto.timestamp < CACHE_DURATION)) {
      return apiCache.devto.data;
    }

    try {
      const response = await fetch('https://dev.to/api/articles?tag=cybersecurity&per_page=6', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
      
      const articles = await response.json();
      
      // Update cache
      apiCache.devto.data = articles;
      apiCache.devto.timestamp = now;
      return articles;
    } catch (error) {
      console.warn('API connection to Dev.to failed. Recovering with high-fidelity local database mock data.', error);
      return MOCK_DATA.devto;
    }
  },

  // Fetch Trending Github Cyber Projects
  async fetchGithubProjects(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && apiCache.github.data && (now - apiCache.github.timestamp < CACHE_DURATION)) {
      return apiCache.github.data;
    }

    try {
      // Query GitHub API for high-star cybersecurity repos
      const response = await fetch('https://api.github.com/search/repositories?q=cybersecurity+topic:cybersecurity&sort=stars&order=desc&per_page=6', {
        method: 'GET',
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });

      if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
      
      const result = await response.json();
      const repositories = result.items || [];
      
      // Update cache
      apiCache.github.data = repositories;
      apiCache.github.timestamp = now;
      return repositories;
    } catch (error) {
      console.warn('API connection to GitHub failed. Recovering with high-fidelity local database mock data.', error);
      return MOCK_DATA.github;
    }
  }
};
