/*
  Cybersecurity Resource Hub & Learning Dashboard
  JS/UTILS.JS - High-Performance SVG Graph Builders, Accessibility Focus Traps, Security HTML Sanitizers & Performance Debouncers
*/

export const Utils = {
  // Performance Debouncer for Search Inputs
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Security: HTML Sanitizer to prevent XSS injection in dynamic API renders
  escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  },

  // Accessibility: Focus Trap within dynamic modals
  trapFocus(modalElement) {
    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    modalElement.addEventListener('keydown', (e) => {
      const isTabPressed = e.key === 'Tab' || e.keyCode === 9;
      if (!isTabPressed) return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    });
  },

  // Dynamic SVG Circular Progress Ring generator
  renderCircularProgress(containerId, percentage, size = 120, label = 'Completed') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    container.innerHTML = `
      <div class="progress-circle-container">
        <svg class="progress-circle-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <circle class="progress-circle-bg" cx="${size / 2}" cy="${size / 2}" r="${radius}" />
          <circle class="progress-circle-bar" 
                  cx="${size / 2}" 
                  cy="${size / 2}" 
                  r="${radius}" 
                  style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset};" />
        </svg>
        <div class="progress-text">
          <span class="progress-value" aria-live="polite">${Math.round(percentage)}%</span>
          <span class="progress-label">${label}</span>
        </div>
      </div>
    `;
  },

  // Dynamic SVG Line Graph / Activity Sparkline generator
  renderLineGraph(containerId, dataPoints, width = 300, height = 150) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (dataPoints.length === 0) {
      container.innerHTML = `<p style="text-align: center; color: var(--text-muted);">No activity data yet</p>`;
      return;
    }

    const padding = 15;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const maxVal = Math.max(...dataPoints, 10);
    const minVal = 0;

    // Map points to SVG coordinates
    const coords = dataPoints.map((val, idx) => {
      const x = padding + (idx / (dataPoints.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
      return `${x},${y}`;
    });

    const pathData = `M ${coords.join(' L ')}`;
    const areaData = `${pathData} L ${coords[coords.length - 1].split(',')[0]},${height - padding} L ${coords[0].split(',')[0]},${height - padding} Z`;

    container.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" style="display: block;">
        <defs>
          <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--accent-cyan)" stop-opacity="0.3" />
            <stop offset="100%" stop-color="var(--accent-cyan)" stop-opacity="0" />
          </linearGradient>
        </defs>
        <!-- Horizontal Gridlines -->
        <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="rgba(255,255,255,0.03)" />
        <line x1="${padding}" y1="${padding + chartHeight / 2}" x2="${width - padding}" y2="${padding + chartHeight / 2}" stroke="rgba(255,255,255,0.03)" />
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.05)" />
        
        <!-- Gradient Area -->
        <path d="${areaData}" fill="url(#area-grad)" />
        
        <!-- Graph Line -->
        <path d="${pathData}" fill="none" stroke="var(--accent-cyan)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        
        <!-- Data nodes -->
        ${coords.map((c, i) => `
          <circle cx="${c.split(',')[0]}" cy="${c.split(',')[1]}" r="4" fill="var(--bg-secondary)" stroke="var(--accent-green)" stroke-width="2" />
        `).join('')}
      </svg>
    `;
  },

  // Dynamic SVG Radar Skill Grid generator
  renderRadarSkills(containerId, skills, size = 260) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const center = size / 2;
    const rMax = size * 0.35;
    const labels = Object.keys(skills);
    const count = labels.length;
    const angleStep = (2 * Math.PI) / count;

    // Web background polygon points (e.g. 100%, 75%, 50%, 25%)
    let gridHTML = '';
    const rings = [0.25, 0.5, 0.75, 1.0];
    
    rings.forEach(fraction => {
      const ringPoints = [];
      for (let i = 0; i < count; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + rMax * fraction * Math.cos(angle);
        const y = center + rMax * fraction * Math.sin(angle);
        ringPoints.push(`${x},${y}`);
      }
      gridHTML += `<polygon class="skills-grid-bg" points="${ringPoints.join(' ')}" />`;
    });

    // Spoke/Axis lines
    let spokesHTML = '';
    const labelCoords = [];
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const xEnd = center + rMax * Math.cos(angle);
      const yEnd = center + rMax * Math.sin(angle);
      spokesHTML += `<line class="skills-grid-bg" x1="${center}" y1="${center}" x2="${xEnd}" y2="${yEnd}" />`;

      // Label coords slightly offset further than rMax
      const xLabel = center + (rMax + 24) * Math.cos(angle);
      const yLabel = center + (rMax + 14) * Math.sin(angle);
      labelCoords.push({ x: xLabel, y: yLabel, text: labels[i] });
    }

    // Dynamic Filled Player Skills Polygon
    const fillPoints = [];
    labels.forEach((label, i) => {
      const fraction = skills[label] / 100;
      const angle = i * angleStep - Math.PI / 2;
      const x = center + rMax * fraction * Math.cos(angle);
      const y = center + rMax * fraction * Math.sin(angle);
      fillPoints.push(`${x},${y}`);
    });

    container.innerHTML = `
      <div class="skills-svg-container">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <!-- Background Grid Rings -->
          ${gridHTML}
          
          <!-- Spokes -->
          ${spokesHTML}
          
          <!-- Value Polygon Area -->
          <polygon class="skills-filled-poly" points="${fillPoints.join(' ')}" />
          
          <!-- Value Points -->
          ${fillPoints.map(pt => `<circle cx="${pt.split(',')[0]}" cy="${pt.split(',')[1]}" r="4.5" fill="var(--accent-purple)" stroke="#fff" stroke-width="1.5" />`).join('')}
          
          <!-- Labels -->
          ${labelCoords.map(lc => `
            <text x="${lc.x}" y="${lc.y}" 
                  fill="var(--text-secondary)" 
                  font-size="10.5" 
                  font-weight="600"
                  text-anchor="middle" 
                  alignment-baseline="middle">
              ${lc.text.toUpperCase()}
            </text>
          `).join('')}
        </svg>
      </div>
    `;
  }
};
