# 🚢 Cybersecurity Sentinel Hub Deployment & Launch Manual

This DevOps manual guides you through deploying the **Cybersecurity Sentinel Console** live to production. It contains build checklists, automated performance checkpoints, and detailed step-by-step guides for GitHub Pages, Netlify, and Vercel.

---

## 📋 Pre-Deployment Checklists

Before launching your project live to recruiters, run through these automated and manual security/quality assurance checks:

### 1. File Structure & Path Integrations
- [ ] Check relative URLs across subpages. Pages in `/pages` must call stylesheets via `../css/style.css` and scripts via `../js/app.js` with `type="module"`.
- [ ] Check root level redirection links. The top brand link must point cleanly to `../index.html` from secondary pages and `index.html` from the landing page.
- [ ] Verify there are no missing asset dependencies (icons, images) which could result in `404 Not Found` network exceptions.

### 2. Code Quality & Security Verification
- [ ] Ensure all debug variables (`console.log`, `debugger` statements) are removed from JavaScript files.
- [ ] Confirm no hardcoded API keys are staged in client-side script modules.
- [ ] Verify that the custom `Utils.escapeHTML` sanitize utility is utilized on all dynamic JSON string renders inside feeds to neutralize XSS vulnerability paths.

### 3. Performance & Accessibility (WCAG Alignment)
- [ ] **Contrast Verification**: Open Developer Tools and verify that text colors maintain a contrast ratio of `4.5:1` against cards (Dark/Light mode compliant).
- [ ] **Keyboard Navigation**: Press `Tab` and navigate through pages. Ensure a visible blue neon outline bounds active items. Pressing `Enter` on roadmap checks must toggle checkbox state cleanly.
- [ ] **Modal Focus Clamp**: Open the Project Showcase, click "Audit Source", and press `Tab`. Ensure focus circles strictly within modal boundaries. Pressing `Escape` must close the window instantly and return focus to the clicked button.
- [ ] **Lighthouse Performance Test**: Audit the site locally. Ensure ratings of **90+** are maintained across Performance, Accessibility, Best Practices, and SEO.

---

## 🌐 Deployment Pathways

Since this is a lightweight serverless client built entirely on clean web standards, it is perfectly suited for free, high-performance static hosting platforms.

### Option A: GitHub Pages (Automatic Git Actions Integration)
1. **Prepare Local Git Repository**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial production-ready capstone console launch"
   ```
2. **Push to Public GitHub**:
   * Create a new empty repository on [GitHub](https://github.com/new). Name it `cybersec-hub-dashboard`.
   * Bind local path to repository and push:
     ```bash
     git remote add origin https://github.com/<your-username>/cybersec-hub-dashboard.git
     git branch -M main
     git push -u origin main
     ```
3. **Configure Pages deployment**:
   * Navigate to the repository page on GitHub.
   * Click **Settings** (gear icon) in the top tabs.
   * On the left sidebar, click **Pages** (under Code and Automation).
   * Set the Source to **Deploy from a branch**.
   * Under Branch, select **`main`** and folder as **`/ (root)`**.
   * Click **Save**.
   * Within 1-2 minutes, a GitHub Action will build and deploy the app. The URL will be active at: `https://<your-username>.github.io/cybersec-hub-dashboard/`

---

### Option B: Netlify (Quick Dropzone Drag & Drop)
1. **No-Git Drag Deploy**:
   * Open the [Netlify Drag & Drop App Dropzone](https://app.netlify.com/drop).
   * Drag your entire `cybersec-hub-dashboard` root folder and drop it onto the cloud dropzone.
   * Netlify will securely allocate the assets and publish the live site instantly under a randomly generated domain!
2. **Dynamic Git CD (Recommended)**:
   * Log into the [Netlify Dashboard](https://app.netlify.com/).
   * Click **Add new site** > **Import an existing project**.
   * Select **GitHub** and authorize.
   * Click **`cybersec-hub-dashboard`**.
   * Under Build Settings:
     * **Build Command**: *Leave blank* (Since we are using fast, zero-dependency vanilla assets).
     * **Publish Directory**: `.` (Root folder containing index.html).
   * Click **Deploy site**. Updates pushed to your git main branch will now trigger auto-rebuild deployments!

---

### Option C: Vercel (Command Line Instant Launch)
1. **Vercel CLI Deploy**:
   * Open terminal in your project root and install Vercel CLI globally:
     ```bash
     npm install -g vercel
     ```
   * Authenticate and deploy by executing:
     ```bash
     vercel
     ```
   * Press `y` to confirm deployment, bind to your personal account, select "No" to existing project, and set default settings.
   * Vercel will process files and hand back a staging live URL instantly!
2. **Vercel Web Dashboard Deploy**:
   * Visit the [Vercel Web Console](https://vercel.com/new) and link your GitHub account.
   * Select the repository `cybersec-hub-dashboard` and click **Import**.
   * Leave Build and Development settings as default and click **Deploy**. Your site goes live at `https://<project-name>.vercel.app` in under 30 seconds.

---

## 🧪 Post-Launch Production Integrity Check

Once your live URL is generated, execute these final verification tests:

1. **API Latency Check**: Navigate to the live `/pages/resources.html` page. Confirm that news posts from the Dev.to endpoint render cleanly. Verify that the cache prevents refetching if you jump pages and come back within 10 minutes.
2. **Offline Recovery Simulation**: Turn on Airplane mode or select "Offline" under the Network tab in Developer Tools. Confirm that refreshing the feed gracefully displays high-fidelity mock records alongside a warning banner, instead of failing or displaying a blank page.
3. **Cross-Browser Verification**: Load the live link across **Google Chrome, Mozilla Firefox, and Apple Safari** (or mobile web browsers). Confirm that glassmorphic transparencies (`backdrop-filter`) and grid column structures adapt correctly across multiple engines.
