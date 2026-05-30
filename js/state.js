/*
  Cybersecurity Resource Hub & Learning Dashboard
  JS/STATE.JS - Reactivity Engine (Publish-Subscribe State Pattern)
*/

class GlobalState {
  constructor() {
    this.state = {
      theme: 'dark',
      roadmapProgress: {}, // e.g., { 'net-101': true, 'crypt-201': false }
      bookmarks: [],       // array of saved resource objects
      activities: []       // array of actions { id, timestamp, text, type }
    };
    
    this.listeners = {};
  }

  // Subscribe to changes on a specific state key
  subscribe(key, callback) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners[key] = this.listeners[key].filter(cb => cb !== callback);
    };
  }

  // Publish changes to a specific state key
  publish(key, newValue) {
    this.state[key] = newValue;
    if (this.listeners[key]) {
      this.listeners[key].forEach(callback => callback(newValue));
    }
  }

  // Get current state snapshot
  getState() {
    return { ...this.state };
  }

  // Set initial state (usually loaded from storage)
  initialize(initialState) {
    this.state = { ...this.state, ...initialState };
    // Notify all registers
    Object.keys(this.state).forEach(key => {
      if (this.listeners[key]) {
        this.listeners[key].forEach(callback => callback(this.state[key]));
      }
    });
  }

  /* Helper Methods to mutate state */
  
  // Toggle Theme
  setTheme(theme) {
    this.publish('theme', theme);
  }

  // Update Roadmap Node
  toggleRoadmapNode(nodeId, isCompleted) {
    const updatedProgress = { ...this.state.roadmapProgress, [nodeId]: isCompleted };
    this.publish('roadmapProgress', updatedProgress);
    
    // Add dynamic activity
    this.addActivity(
      `Marked "${nodeId.toUpperCase().replace('-', ' ')}" as ${isCompleted ? 'Completed' : 'In Progress'}`,
      isCompleted ? 'success' : 'info'
    );
  }

  // Bookmark / Unbookmark Resource
  toggleBookmark(resource) {
    let updatedBookmarks = [...this.state.bookmarks];
    const index = updatedBookmarks.findIndex(b => b.id === resource.id);
    
    if (index === -1) {
      updatedBookmarks.push(resource);
      this.addActivity(`Bookmarked: ${resource.title}`, 'info');
    } else {
      updatedBookmarks.splice(index, 1);
      this.addActivity(`Removed bookmark: ${resource.title}`, 'warning');
    }
    
    this.publish('bookmarks', updatedBookmarks);
  }

  // Add Logged Activity
  addActivity(text, type = 'info') {
    const newActivity = {
      id: 'act-' + Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      text,
      type
    };
    
    const updatedActivities = [newActivity, ...this.state.activities].slice(0, 10); // Keep last 10
    this.publish('activities', updatedActivities);
  }
}

export const stateStore = new GlobalState();
