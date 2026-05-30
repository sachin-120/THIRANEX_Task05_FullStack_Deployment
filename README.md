# ☣ Cybersecurity Sentinel Console & Learning Dashboard

[![License: MIT](https://img.shields.b2c.wtf/badge/License-MIT-00ccff.svg)](LICENSE)
[![Accessibility: WCAG 2.1](https://img.shields.b2c.wtf/badge/Accessibility-WCAG%202.1-00ff66.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Aesthetic: Premium Dark](https://img.shields.b2c.wtf/badge/Design-Neon%20Cyberpunk-9d4edd.svg)](#)

Welcome to the **Cybersecurity Sentinel Console & Learning Dashboard**—a production-ready, ultra-premium capstone web application engineered to showcase the absolute peak of modern front-end capabilities, modular architecture, responsive engineering, and robust API integration.

This terminal command center is custom-tailored for recruiters to evaluate technical capabilities in software architecture, web accessibility, secure code, data flow, and modern web aesthetics.

---

## 🛠 System Architecture Diagram

This application runs on a clean, single-page-application (SPA) data flow model powered entirely by **Vanilla Web Standards (ES6+, CSS3, Semantic HTML5)**. No heavy framework overlays, no package bloat. Ultra-low latency, blazing fast performance.

```
       +--------------------------------------------------------+
       |                  GUEST RECRUITER / USER                |
       +----------------------------+---------------------------+
                                    |
                                    v (Interacts with Checklists, Toggles, Searches)
       +----------------------------+---------------------------+
       |               SEMANTIC VIEW CONTROLLER (DOM)           |
       |  [index.html]   [dashboard.html]   [projects.html]      |
       |  [roadmap.html] [resources.html]                       |
       +----------------------------+---------------------------+
                                    |
            Subscribes to           | Publishes Changes to
           State mutations          | (Checklist click / Bookmark Toggle)
                                    v
       +----------------------------+---------------------------+
       |               RE-ACTIVE PUB-SUB STATE STORE            |
       |                     (js/state.js)                      |
       +-------+--------------------+--------------------+------+
               |                                         |
               v (Syncs Offline storage)                 v (Dynamic API Fetch)
+--------------+--------------+          +---------------+---------------+
|    LOCALSTORAGE PERSISTENCE |          |      FETCH API MANAGER        |
|       (js/storage.js)       |          |        (js/api.js)            |
|                              |          |  - Memory Cache (10 mins)     |
|  - Sandbox Safe Exceptions   |          |  - Graceful Mock Recovers     |
+------------------------------+          +---------------+---------------+
                                                          |
                                           Query parallel | async requests
                                                          v
                                         +----------------+---------------+
                                         |    Dev.to & GitHub REST APIs   |
                                         +--------------------------------+
```

---

## 💎 Elite Feature Set

1. **Reactive State Engine (`stateStore`)**: Implements an enterprise-grade Publish-Subscribe pattern. Updates made on the *Sentinel Learning Pathway* checklist (e.g. Linux Hardening) instantly recalculate circular indicators, activity metrics, and the Vector Skills radar mesh on the *Command Center Dashboard* without requiring page reloads.
2. **Dynamic Vector SVG Graphics**: Custom rendering algorithms in `js/utils.js` generate lightweight, beautiful, responsive radar skill meshes and circular progress indicators inside vanilla SVG blocks at 60fps.
3. **Smart Cache Fetch System (`APIService`)**: Integrates with live, public REST APIs (**Dev.to** & **GitHub API**) to pull authentic threat feeds and cybersecurity projects. Features a 10-minute automated memory cache layer to limit network spam, and gracefully recovers with pre-loaded mock databases if the client goes offline or exceeds rate limits.
4. **Keyboard Accessibility (WCAG Compliance)**: Focus-trapping methods (`Utils.trapFocus`) clamp tab navigation securely inside opened code audit modals, and close controls bind cleanly to the `Escape` key. Fully semantic landmarks, high-contrast layouts, and explicit `aria-labels` guarantee clean screen-reader narration.
5. **Glassmorphic Cyber Aesthetics**: Rich, responsive dark cyberpunk theme using custom CSS design tokens, glowing border highlights, retro CRT scanline filters, grid layouts, and smooth animations. Full dark-to-light theme toggle active!

---

## 📂 Project Structure

```
cybersec-hub-dashboard/
│
├── index.html                  # Recruiter portfolio landing page
│
├── pages/
│   ├── dashboard.html          # Dynamic Command Center metrics & progress
│   ├── projects.html           # Project showcase, tag filter & code audit modals
│   ├── roadmap.html            # Learning checklist linked to state Store
│   └── resources.html          # Dynamic live API feeds with search & bookmarks
│
├── css/
│   ├── layout.css              # Structural variables, scrollbars & grid setups
│   ├── style.css               # Typography, scanline overlays & animations
│   ├── components.css          # Glassmorphic cards, SVG progress rings & loaders
│   └── responsive.css          # Desktop, tablet & mobile media queries
│
├── js/
│   ├── app.js                  # Main controller, event routing & DOM linkages
│   ├── state.js                # PubSub state manager store
│   ├── api.js                  # Cache-friendly Fetch client
│   ├── storage.js              # Sandbox-safe LocalStorage helper
│   └── utils.js                # SVG chart generators, debouncers & WCAG traps
│
└── README.md                   # Complete system technical documentation
```

---

## 🚀 Installation & Local Launch

No builds or package installs are required! Run natively in any web browser:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/cybersec-hub-dashboard.git
   cd cybersec-hub-dashboard
   ```
2. **Boot Local Server**:
   Since the codebase utilizes ES6 ES Modules (`import/export`), files must be served from a local server. You can run one with a single terminal command:
   * **NodeJS**: `npx serve .` or `npx live-server`
   * **Python**: `python -m http.server 8000`
   * **VS Code extension**: Right-click `index.html` and choose **"Open with Live Server"**.

3. **Navigate Workspace**: Open `http://localhost:8000` in your browser.

---

## 🚢 DevOps Multi-Platform Deployment Guide

This workspace is fully optimized for continuous integration (CI) and zero-config deployment. Follow these guides to showcase it live:

### 1. GitHub Pages (Highly Recommended)
* Push your repository to public GitHub.
* Go to **Settings** > **Pages** inside the repo.
* Select the branch as **`main`** and folder as **`/ (root)`**.
* Click **Save**. Your site goes live at `https://<username>.github.io/cybersec-hub-dashboard/` within 2 minutes!

### 2. Netlify
* Drag-and-drop the entire project folder directly into the [Netlify App Dropzone](https://app.netlify.com/drop).
* *Or*, connect your GitHub repo and select **`cybersec-hub-dashboard`** for automatic build deployments on every push. No build commands needed.

### 3. Vercel
* Install Vercel CLI (`npm install -g vercel`) and execute `vercel` in the project root directory.
* *Or*, import your public GitHub repository inside the [Vercel Dashboard](https://vercel.com/dashboard) and click **Deploy**.

---

## 🔮 Future Console Iterations

* **Interactive Terminal Shell**: Integrate a pseudo-interactive bash shell allowing users to type commands (e.g. `help`, `scan <ip>`, `audit`) for premium recruiter engagement.
* **Database Integration**: Connect serverless database frameworks (e.g. Firebase or Supabase) to support multi-student account logins and cross-device synced paths.
* **CVE Threat API**: Expand resources with CVE-search APIs to display hot vulnerability patches instantly as they are released.

---

## 👔 Connect & Review Portfolio

* **GitHub Repository**: [github.com/your-username](https://github.com/sachin-120)
* **Professional LinkedIn**: [linkedin.com/in/your-profile](https://www.linkedin.com/in/sachin-sharma-b93345404)

---

## 📢 LinkedIn Portfolio Showcase Post Template

*Ready to share with recruiters? Copy and paste the template below:*

```text
🚀 I am excited to share my capstone internship project: The Cybersecurity Sentinel Console & Learning Dashboard!

Built entirely with clean, vanilla web standards (HTML5, CSS3, ES6+ Modules), this production-ready application demonstrates advanced software architecture patterns, accessibility (WCAG), responsive design, and dynamic API integrations:

🛡️ Reactive PubSub State Engine: Local check modifications instantly recalculate dashboard stats, skills metrics, and custom SVG radar graphs in real time.
📡 High-Performance API Feeds: Connects dynamically to live Dev.to & GitHub REST APIs, with a robust 10-minute cache layer and mock offline recoveries.
♿ Accessibility First: Native keyboard focus trapping, full aria-labels, high contrast, and smooth animations (WCAG compliance).
🎨 Modern Cyber Glassmorphism: Neon accents, micro-transitions, custom CSS design tokens, and a clean dark theme switch.

A massive thank you to my mentors! Check out the console live and view the repository here:
👉 Live Site: [Link]
👉 GitHub: [Link]

#cybersecurity #softwareengineering #webdevelopment #javascript #frontend #portfolio #devsecops
```
