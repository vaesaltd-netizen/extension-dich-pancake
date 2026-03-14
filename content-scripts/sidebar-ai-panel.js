// content-scripts/sidebar-ai-panel.js - Inject AI tab into Pancake sidebar
(function() {
  'use strict';

  const DEBUG = true;
  const log = (...args) => DEBUG && console.log('[PIT-AI]', ...args);

  // SVG Icons (Heroicons style)
  const ICONS = {
    sparkles: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clip-rule="evenodd"/></svg>`,
    sparklesSmall: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clip-rule="evenodd"/></svg>`,
    languageSmall: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M9 2.25a.75.75 0 0 1 .75.75v1.506a49.384 49.384 0 0 1 5.343.371.75.75 0 1 1-.186 1.489c-.66-.083-1.323-.151-1.99-.206a18.67 18.67 0 0 1-2.97 6.323c.318.384.65.753 1 1.107a.75.75 0 0 1-1.07 1.052A18.902 18.902 0 0 1 9 13.687a18.823 18.823 0 0 1-5.656 4.482.75.75 0 0 1-.688-1.333 17.323 17.323 0 0 0 5.396-4.353A18.72 18.72 0 0 1 5.89 8.598a.75.75 0 0 1 1.388-.568A17.21 17.21 0 0 0 9 11.224a17.168 17.168 0 0 0 2.391-5.165 48.04 48.04 0 0 0-8.298.307.75.75 0 0 1-.186-1.489 49.159 49.159 0 0 1 5.343-.371V3A.75.75 0 0 1 9 2.25ZM15.75 9a.75.75 0 0 1 .68.433l5.25 11.25a.75.75 0 1 1-1.36.634l-1.198-2.567h-6.744l-1.198 2.567a.75.75 0 0 1-1.36-.634l5.25-11.25A.75.75 0 0 1 15.75 9Zm-2.672 8.25h5.344l-2.672-5.726-2.672 5.726Z" clip-rule="evenodd"/></svg>`,
    chatBubble: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clip-rule="evenodd"/></svg>`,
    pencilSquare: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z"/><path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z"/></svg>`,
    language: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M9 2.25a.75.75 0 0 1 .75.75v1.506a49.384 49.384 0 0 1 5.343.371.75.75 0 1 1-.186 1.489c-.66-.083-1.323-.151-1.99-.206a18.67 18.67 0 0 1-2.97 6.323c.318.384.65.753 1 1.107a.75.75 0 0 1-1.07 1.052A18.902 18.902 0 0 1 9 13.687a18.823 18.823 0 0 1-5.656 4.482.75.75 0 0 1-.688-1.333 17.323 17.323 0 0 0 5.396-4.353A18.72 18.72 0 0 1 5.89 8.598a.75.75 0 0 1 1.388-.568A17.21 17.21 0 0 0 9 11.224a17.168 17.168 0 0 0 2.391-5.165 48.04 48.04 0 0 0-8.298.307.75.75 0 0 1-.186-1.489 49.159 49.159 0 0 1 5.343-.371V3A.75.75 0 0 1 9 2.25ZM15.75 9a.75.75 0 0 1 .68.433l5.25 11.25a.75.75 0 1 1-1.36.634l-1.198-2.567h-6.744l-1.198 2.567a.75.75 0 0 1-1.36-.634l5.25-11.25A.75.75 0 0 1 15.75 9Zm-2.672 8.25h5.344l-2.672-5.726-2.672 5.726Z" clip-rule="evenodd"/></svg>`,
    arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/></svg>`,
    clipboard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z" clip-rule="evenodd"/></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd"/></svg>`,
    paperAirplane: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"/></svg>`,
    xMark: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/></svg>`,
    exclamation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd"/></svg>`,
    adjustmentsHorizontal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"/></svg>`,
    cpuChip: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M16.5 7.5h-9v9h9v-9Z"/><path fill-rule="evenodd" d="M8.25 2.25A.75.75 0 0 1 9 3v.75h2.25V3a.75.75 0 0 1 1.5 0v.75H15V3a.75.75 0 0 1 1.5 0v.75h.75a3 3 0 0 1 3 3v.75H21A.75.75 0 0 1 21 9h-.75v2.25H21a.75.75 0 0 1 0 1.5h-.75V15H21a.75.75 0 0 1 0 1.5h-.75v.75a3 3 0 0 1-3 3h-.75V21a.75.75 0 0 1-1.5 0v-.75h-2.25V21a.75.75 0 0 1-1.5 0v-.75H9V21a.75.75 0 0 1-1.5 0v-.75h-.75a3 3 0 0 1-3-3v-.75H3A.75.75 0 0 1 3 15h.75v-2.25H3a.75.75 0 0 1 0-1.5h.75V9H3a.75.75 0 0 1 0-1.5h.75v-.75a3 3 0 0 1 3-3h.75V3a.75.75 0 0 1 .75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h10.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V6.75Z" clip-rule="evenodd"/></svg>`,
    magnifyingGlass: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd"/></svg>`,
    lightBulb: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 .75a8.25 8.25 0 0 0-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 0 0 .577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.714 6.714 0 0 1-.937-.171.75.75 0 1 1 .374-1.453 5.261 5.261 0 0 0 2.626 0 .75.75 0 1 1 .374 1.453 6.712 6.712 0 0 1-.937.171v4.66c0 .327.277.586.6.545.364-.047.722-.112 1.074-.195a.75.75 0 0 0 .577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0 0 12 .75Z"/><path fill-rule="evenodd" d="M9.013 19.9a.75.75 0 0 1 .877-.597 11.319 11.319 0 0 0 4.22 0 .75.75 0 1 1 .28 1.473 12.819 12.819 0 0 1-4.78 0 .75.75 0 0 1-.597-.876ZM9.754 22.344a.75.75 0 0 1 .824-.668 13.682 13.682 0 0 0 2.844 0 .75.75 0 1 1 .156 1.492 15.156 15.156 0 0 1-3.156 0 .75.75 0 0 1-.668-.824Z" clip-rule="evenodd"/></svg>`,
    documentText: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clip-rule="evenodd"/><path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z"/></svg>`
  };

  // Color palette - Trust Blue
  const COLORS = {
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    primaryLight: '#DBEAFE',
    secondary: '#3B82F6',
    accent: '#F97316',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#1E293B',
    textMuted: '#64748B',
    border: '#E2E8F0',
    success: '#10B981',
    error: '#EF4444'
  };

  // Selectors based on Pancake sidebar structure
  const SELECTORS = {
    tabContainer: '.tab-label-item',
    swipeableView: '.swipeable-info-view',
    infoWrapper: '.info-view__wrapper',
    messageContainer: '.message-text-field',
    clientMessage: '.message-text-ele.client-message',
    pageMessage: '.message-text-ele.page-message'
  };

  // Default Quick Tags
  const DEFAULT_QUICK_TAGS = [
    { id: 'price', label: 'Báo giá' },
    { id: 'freeship', label: 'Freeship' },
    { id: 'instock', label: 'Còn hàng' },
    { id: 'consult', label: 'Tư vấn SP' },
    { id: 'usage', label: 'Công dụng' }
  ];

  class AISidebarPanel {
    constructor() {
      this.injected = false;
      this.activeTab = null;
      this.conversationCache = new Map();
      this.quickTags = [...DEFAULT_QUICK_TAGS];
      this.selectedTags = new Set();
      this.selectedFeature = 'auto-reply'; // Default feature: AI tự động
      this.settingsCollapsed = true; // Settings collapsed by default
      this.init();
    }

    async init() {
      log('Initializing AI Sidebar Panel...');

      await window.openaiTranslator.init();

      // Load Quick Tags from storage
      await this.loadQuickTags();

      // Listen for Quick Tags changes from popup
      this.listenForQuickTagsChanges();

      // Wait for Pancake sidebar to load
      this.waitForSidebar();

      // Re-inject on DOM changes (conversation switch)
      this.setupObserver();
    }

    async loadQuickTags() {
      try {
        const result = await chrome.storage.local.get('pitQuickTags');
        if (result.pitQuickTags && Array.isArray(result.pitQuickTags) && result.pitQuickTags.length > 0) {
          this.quickTags = result.pitQuickTags;
          log('Loaded Quick Tags:', this.quickTags);
        } else {
          // Save default tags if not exists
          await chrome.storage.local.set({ pitQuickTags: DEFAULT_QUICK_TAGS });
          log('Saved default Quick Tags');
        }
      } catch (e) {
        log('Failed to load Quick Tags:', e);
      }
    }

    listenForQuickTagsChanges() {
      chrome.storage.onChanged.addListener((changes) => {
        if (changes.pitQuickTags?.newValue) {
          this.quickTags = changes.pitQuickTags.newValue;
          log('Quick Tags updated:', this.quickTags);
          // Re-render tags if panel exists
          this.renderQuickTags();
        }
      });
    }

    renderQuickTags() {
      const container = document.getElementById('pit-quick-tags-container');
      if (!container) return;

      container.innerHTML = this.quickTags.map(tag => `
        <button class="pit-quick-tag ${this.selectedTags.has(tag.id) ? 'pit-quick-tag-selected' : ''}"
                data-tag-id="${tag.id}"
                style="
                  display: inline-flex;
                  align-items: center;
                  gap: 4px;
                  padding: 5px 10px;
                  border-radius: 16px;
                  font-size: 12px;
                  cursor: pointer;
                  transition: all 0.15s ease;
                  border: 1px solid ${this.selectedTags.has(tag.id) ? COLORS.primary : COLORS.border};
                  background: ${this.selectedTags.has(tag.id) ? COLORS.primaryLight : COLORS.surface};
                  color: ${this.selectedTags.has(tag.id) ? COLORS.primary : COLORS.text};
                  font-weight: ${this.selectedTags.has(tag.id) ? '500' : '400'};
                ">
          ${tag.label}
        </button>
      `).join('');

      // Re-attach event listeners
      container.querySelectorAll('.pit-quick-tag').forEach(btn => {
        btn.addEventListener('click', () => this.toggleQuickTag(btn.dataset.tagId));
      });
    }

    toggleQuickTag(tagId) {
      if (this.selectedTags.has(tagId)) {
        this.selectedTags.delete(tagId);
      } else {
        this.selectedTags.add(tagId);
      }

      // Re-render tags
      this.renderQuickTags();

      // Update textarea
      this.updateKeyPointsFromTags();
    }

    updateKeyPointsFromTags() {
      const textarea = document.getElementById('pit-key-points');
      if (!textarea) return;

      // Get selected tag labels
      const selectedLabels = this.quickTags
        .filter(tag => this.selectedTags.has(tag.id))
        .map(tag => tag.label);

      if (selectedLabels.length > 0) {
        // Append to existing text or replace
        const currentText = textarea.value.trim();
        const tagText = selectedLabels.join(', ');

        if (currentText) {
          // Check if current text already has some of these tags
          const existingTags = currentText.split(',').map(t => t.trim().toLowerCase());
          const newTags = selectedLabels.filter(label =>
            !existingTags.includes(label.toLowerCase())
          );

          if (newTags.length > 0) {
            textarea.value = currentText + ', ' + newTags.join(', ');
          }
        } else {
          textarea.value = tagText;
        }
      }
    }

    waitForSidebar() {
      const checkInterval = setInterval(() => {
        const tabContainer = this.findTabContainer();
        if (tabContainer && !this.injected) {
          clearInterval(checkInterval);
          this.injectAITab(tabContainer);
        }
      }, 1000);

      // Timeout after 30s
      setTimeout(() => clearInterval(checkInterval), 30000);
    }

    findTabContainer() {
      // Find the tab labels container (contains "Thông tin", "Tạo đơn")
      const tabs = document.querySelectorAll(SELECTORS.tabContainer);
      if (tabs.length >= 2) {
        return tabs[0].parentElement;
      }
      return null;
    }

    findSidebarContainer() {
      // Find the sidebar container to inject floating button
      return document.querySelector('.info-view__wrapper') ||
             document.querySelector('.swipeable-info-view')?.parentElement;
    }

    setupObserver() {
      // Track current conversation ID to detect changes
      this.currentConversationId = this.getCurrentConversationId();

      const observer = new MutationObserver(() => {
        if (!this.injected) {
          const tabContainer = this.findTabContainer();
          if (tabContainer) {
            this.injectAITab(tabContainer);
          }
        }

        // Re-check if AI tab was removed (Pancake re-rendered)
        const aiTab = document.getElementById('pit-ai-tab');
        if (!aiTab && this.injected) {
          this.injected = false;
          const tabContainer = this.findTabContainer();
          if (tabContainer) {
            this.injectAITab(tabContainer);
          }
        }

        // Detect conversation change
        const newConversationId = this.getCurrentConversationId();
        if (newConversationId && newConversationId !== this.currentConversationId) {
          this.currentConversationId = newConversationId;
          this.onConversationChange();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      // Also listen for clicks on conversation list
      document.addEventListener('click', (e) => {
        // Check if clicked on conversation item (Pancake uses .conversation-list-item)
        const convItem = e.target.closest('.conversation-list-item');
        if (convItem) {
          setTimeout(() => {
            const newId = this.getCurrentConversationId();
            if (newId && newId !== this.currentConversationId) {
              this.currentConversationId = newId;
              this.onConversationChange();
            }
          }, 300);
        }
      }, true);
    }

    getCurrentConversationId() {
      // Get selected conversation from Pancake's conversation list
      const selectedConv = document.querySelector('.conversation-list-item.selected');
      if (selectedConv) {
        // Get ID from parent element (format: pageId_customerId)
        const parentWithId = selectedConv.closest('[id*="_"]');
        if (parentWithId?.id) return parentWithId.id;

        // Fallback: get customer name
        const nameEl = selectedConv.querySelector('.name-text');
        if (nameEl?.textContent) return nameEl.textContent.trim();
      }

      return null;
    }

    onConversationChange() {
      log('Conversation changed, clearing state...');

      // Clear selected tags
      this.selectedTags.clear();
      this.renderQuickTags();

      // Clear textareas
      const keyPointsTextarea = document.getElementById('pit-key-points');
      const translateTextarea = document.getElementById('pit-translate-input');
      if (keyPointsTextarea) keyPointsTextarea.value = '';
      if (translateTextarea) translateTextarea.value = '';

      // Clear result area
      const resultArea = document.getElementById('pit-ai-result');
      if (resultArea) {
        resultArea.innerHTML = `
          <div style="color: ${COLORS.textMuted}; text-align: center; font-size: 12px;">
            Kết quả sẽ hiển thị ở đây
          </div>
        `;
      }
    }

    injectAITab(tabContainer) {
      if (this.injected) return;

      log('Injecting AI floating button...');

      // Load saved position or use default
      const savedPos = this.loadButtonPosition();

      // Create floating AI button (draggable)
      const aiButton = document.createElement('div');
      aiButton.id = 'pit-ai-tab';
      aiButton.className = 'pit-ai-floating-btn';
      aiButton.style.cssText = `
        position: fixed;
        right: ${savedPos.right}px;
        top: ${savedPos.top}px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        cursor: grab;
        border-radius: 8px;
        background: ${COLORS.primary};
        color: white;
        font-weight: 600;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        transition: background 0.2s ease, box-shadow 0.2s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        user-select: none;
      `;
      aiButton.innerHTML = `${ICONS.sparkles}<span>AI Tools</span>`;

      // Hover effect
      aiButton.addEventListener('mouseenter', () => {
        if (!this.isDragging) {
          aiButton.style.background = COLORS.primaryHover;
          aiButton.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
        }
      });
      aiButton.addEventListener('mouseleave', () => {
        aiButton.style.background = COLORS.primary;
        aiButton.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
      });

      // Drag functionality - DISABLED to keep button fixed at right side
      // this.setupDraggable(aiButton);

      // Click handler (only if not dragging)
      aiButton.addEventListener('click', (e) => {
        if (!this.wasDragging) {
          this.toggleAIPanel();
        }
        this.wasDragging = false;
      });

      // Add to body (floating)
      document.body.appendChild(aiButton);

      // Create AI panel content (hidden initially)
      this.createAIPanel();

      this.injected = true;
      log('AI tab injected successfully');
    }

    loadButtonPosition() {
      // Fixed position at right side - no more localStorage
      // Always return fixed position to prevent button from moving
      return { right: 20, top: 60 };
    }

    saveButtonPosition(right, top) {
      try {
        localStorage.setItem('pit-button-position', JSON.stringify({ right, top }));
      } catch (e) {}
    }

    setupDraggable(element) {
      let isDragging = false;
      let startX, startY, startRight, startTop;

      element.addEventListener('mousedown', (e) => {
        isDragging = true;
        this.isDragging = true;
        this.wasDragging = false;
        startX = e.clientX;
        startY = e.clientY;
        startRight = parseInt(element.style.right) || 360;
        startTop = parseInt(element.style.top) || 100;
        element.style.cursor = 'grabbing';
        element.style.transition = 'none';
        e.preventDefault();
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = startX - e.clientX;
        const deltaY = e.clientY - startY;

        const newRight = Math.max(10, Math.min(window.innerWidth - 150, startRight + deltaX));
        const newTop = Math.max(10, Math.min(window.innerHeight - 50, startTop + deltaY));

        element.style.right = newRight + 'px';
        element.style.top = newTop + 'px';

        // Mark as dragging if moved more than 5px
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
          this.wasDragging = true;
        }
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          this.isDragging = false;
          element.style.cursor = 'grab';
          element.style.transition = 'background 0.2s ease, box-shadow 0.2s ease';

          // Save position
          const right = parseInt(element.style.right) || 360;
          const top = parseInt(element.style.top) || 100;
          this.saveButtonPosition(right, top);

          // Update panel position
          this.updatePanelPosition(right, top);
        }
      });
    }

    updatePanelPosition(buttonRight, buttonTop) {
      // No longer needed - panel uses sidebar dimensions
    }

    updatePanelDimensions() {
      const panel = document.getElementById('pit-ai-panel');
      if (!panel || panel.style.display === 'none') return;

      const dims = this.getSidebarDimensions();
      const panelWidth = Math.max(dims.width, 350);
      const panelHeight = Math.max(dims.height, 500);
      const panelTop = dims.top || 50;

      panel.style.right = '0px';
      panel.style.top = panelTop + 'px';
      panel.style.width = panelWidth + 'px';
      panel.style.height = panelHeight + 'px';
    }

    toggleAIPanel() {
      const panel = document.getElementById('pit-ai-panel');
      if (!panel) return;

      if (panel.style.display === 'none') {
        // Update dimensions before showing
        const dims = this.getSidebarDimensions();
        const panelWidth = Math.max(dims.width, 350);
        const panelHeight = Math.max(dims.height, 500);
        const panelTop = dims.top || 50;

        panel.style.right = '0px';
        panel.style.top = panelTop + 'px';
        panel.style.width = panelWidth + 'px';
        panel.style.height = panelHeight + 'px';

        panel.style.display = 'flex';
        panel.style.flexDirection = 'column';
        log('AI Panel opened - dimensions:', panelWidth, 'x', panelHeight);
      } else {
        panel.style.display = 'none';
        log('AI Panel closed');
      }
    }

    getSidebarDimensions() {
      // Method 1: Try #customerCol (visible sidebar container)
      const customerCol = document.getElementById('customerCol');
      if (customerCol) {
        const style = window.getComputedStyle(customerCol);
        const rect = customerCol.getBoundingClientRect();
        log('customerCol:', rect.width, 'x', rect.height, 'display:', style.display);

        // Check if customerCol is visible
        if (style.display !== 'none' && rect.width > 100 && rect.height > 100) {
          return {
            width: rect.width,
            height: rect.height,
            top: Math.max(rect.top, 0),
            right: 0
          };
        }
      }

      // Method 2: Try .info-view__wrapper (contains sidebar content)
      const infoWrapper = document.querySelector('.info-view__wrapper');
      if (infoWrapper) {
        const rect = infoWrapper.getBoundingClientRect();
        log('infoWrapper:', rect.width, 'x', rect.height);
        if (rect.width > 100 && rect.height > 100) {
          return {
            width: rect.width,
            height: rect.height,
            top: Math.max(rect.top, 0),
            right: 0
          };
        }
      }

      // Method 3: Try react-swipeable-view-container
      const swipeContainer = document.querySelector('.react-swipeable-view-container');
      if (swipeContainer) {
        const rect = swipeContainer.getBoundingClientRect();
        log('swipeContainer:', rect.width, 'x', rect.height);
        if (rect.width > 100 && rect.height > 100) {
          return {
            width: rect.width,
            height: rect.height + 45,
            top: Math.max(rect.top - 45, 0),
            right: 0
          };
        }
      }

      // Method 4: Calculate from window - sidebar is typically ~380px wide on the right
      log('Using calculated dimensions');
      return {
        width: 380,
        height: window.innerHeight - 50,
        top: 50,
        right: 0
      };
    }

    createAIPanel() {
      const sidebarDims = this.getSidebarDimensions();

      // Ensure minimum dimensions
      const panelWidth = Math.max(sidebarDims.width, 350);
      const panelHeight = Math.max(sidebarDims.height, 500);
      const panelTop = sidebarDims.top || 50;

      // Chevron icons
      const chevronDown = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/></svg>`;
      const chevronUp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z" clip-rule="evenodd"/></svg>`;

      // Create AI panel that matches sidebar size
      const aiPanel = document.createElement('div');
      aiPanel.id = 'pit-ai-panel';
      aiPanel.className = 'pit-ai-panel';
      aiPanel.style.cssText = `
        position: fixed;
        right: 0px;
        top: ${panelTop}px;
        width: ${panelWidth}px;
        height: ${panelHeight}px;
        min-width: 350px;
        min-height: 500px;
        z-index: 10001;
        display: none;
        flex-direction: column;
        background: ${COLORS.surface};
        border-radius: 0;
        box-shadow: -4px 0 16px rgba(0,0,0,0.08);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        overflow: hidden;
        border-left: 1px solid ${COLORS.border};
      `;

      // Listen for window resize to update panel dimensions
      window.addEventListener('resize', () => this.updatePanelDimensions());

      aiPanel.innerHTML = `
        <!-- Header -->
        <div style="padding: 14px 16px; background: ${COLORS.primary}; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
          <div style="display: flex; align-items: center; gap: 8px; color: white;">
            ${ICONS.sparkles}
            <span style="font-size: 15px; font-weight: 600;">AI Assistant</span>
          </div>
          <button id="pit-close-panel" style="background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.8); display: flex; align-items: center; padding: 4px; border-radius: 4px; transition: background 0.2s;">
            ${ICONS.xMark}
          </button>
        </div>

        <!-- Content -->
        <div style="padding: 12px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; flex: 1; background: ${COLORS.background};">

          <!-- 1. SETTINGS SECTION (Collapsible) -->
          <div id="pit-settings-section" style="background: ${COLORS.surface}; border-radius: 8px; border: 1px solid ${COLORS.border}; overflow: hidden;">
            <!-- Settings Header (Click to expand/collapse) -->
            <div id="pit-settings-header" style="
              display: flex; align-items: center; justify-content: space-between;
              padding: 12px 14px; cursor: pointer; transition: background 0.2s;
            ">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="color: ${COLORS.textMuted}; display: flex;">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clip-rule="evenodd"/></svg>
                </span>
                <span style="font-size: 13px; font-weight: 500; color: ${COLORS.text};">Cài đặt</span>
              </div>
              <span id="pit-settings-chevron" style="color: ${COLORS.textMuted}; display: flex; transition: transform 0.2s;">
                ${chevronDown}
              </span>
            </div>

            <!-- Settings Content (Hidden by default) -->
            <div id="pit-settings-content" style="display: none; padding: 0 14px 14px; border-top: 1px solid ${COLORS.border};">
              <!-- Auto-Translate Toggle -->
              <div id="pit-auto-translate-toggle" style="
                display: flex; align-items: center; justify-content: space-between;
                padding: 12px 0; cursor: pointer; border-bottom: 1px solid ${COLORS.border};
              ">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span id="pit-toggle-icon" style="color: ${COLORS.success}; display: flex;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M9 2.25a.75.75 0 0 1 .75.75v1.506a49.384 49.384 0 0 1 5.343.371.75.75 0 1 1-.186 1.489c-.66-.083-1.323-.151-1.99-.206a18.67 18.67 0 0 1-2.97 6.323c.318.384.65.753 1 1.107a.75.75 0 0 1-1.07 1.052A18.902 18.902 0 0 1 9 13.687a18.823 18.823 0 0 1-5.656 4.482.75.75 0 0 1-.688-1.333 17.323 17.323 0 0 0 5.396-4.353A18.72 18.72 0 0 1 5.89 8.598a.75.75 0 0 1 1.388-.568A17.21 17.21 0 0 0 9 11.224a17.168 17.168 0 0 0 2.391-5.165 48.04 48.04 0 0 0-8.298.307.75.75 0 0 1-.186-1.489 49.159 49.159 0 0 1 5.343-.371V3A.75.75 0 0 1 9 2.25ZM15.75 9a.75.75 0 0 1 .68.433l5.25 11.25a.75.75 0 1 1-1.36.634l-1.198-2.567h-6.744l-1.198 2.567a.75.75 0 0 1-1.36-.634l5.25-11.25A.75.75 0 0 1 15.75 9Zm-2.672 8.25h5.344l-2.672-5.726-2.672 5.726Z" clip-rule="evenodd"/></svg>
                  </span>
                  <div>
                    <div style="font-size: 12px; font-weight: 500; color: ${COLORS.text};">Auto Dịch Tin Nhắn</div>
                    <div id="pit-toggle-status" style="font-size: 10px; color: ${COLORS.success}; margin-top: 1px;">Đang bật</div>
                  </div>
                </div>
                <div id="pit-toggle-switch" style="
                  width: 40px; height: 22px; border-radius: 11px;
                  background: ${COLORS.success}; position: relative;
                  transition: background 0.2s;
                ">
                  <div id="pit-toggle-knob" style="
                    position: absolute; top: 2px; left: 20px;
                    width: 18px; height: 18px; border-radius: 50%;
                    background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                    transition: left 0.2s;
                  "></div>
                </div>
              </div>

              <!-- Settings Row -->
              <div style="display: flex; gap: 8px; padding-top: 12px;">
                <div style="flex: 1;">
                  <label style="font-size: 10px; color: ${COLORS.textMuted}; font-weight: 600; display: flex; align-items: center; gap: 4px; margin-bottom: 5px;">
                    ${ICONS.adjustmentsHorizontal}
                    <span>Độ dài</span>
                  </label>
                  <select id="pit-response-length" style="
                    width: 100%; padding: 7px 8px; border: 1px solid ${COLORS.border}; border-radius: 6px;
                    font-size: 11px; background: ${COLORS.surface}; cursor: pointer; color: ${COLORS.text};
                    outline: none; transition: border-color 0.2s;
                  ">
                    <option value="short">Ngắn gọn</option>
                    <option value="medium" selected>Vừa phải</option>
                    <option value="detailed">Chi tiết</option>
                  </select>
                </div>
                <div style="flex: 1;">
                  <label style="font-size: 10px; color: ${COLORS.textMuted}; font-weight: 600; display: flex; align-items: center; gap: 4px; margin-bottom: 5px;">
                    ${ICONS.cpuChip}
                    <span>Model</span>
                  </label>
                  <select id="pit-model-select" style="
                    width: 100%; padding: 7px 8px; border: 1px solid ${COLORS.border}; border-radius: 6px;
                    font-size: 11px; background: ${COLORS.surface}; cursor: pointer; color: ${COLORS.text};
                    outline: none; transition: border-color 0.2s;
                  ">
                    <option value="gpt-4.1-nano" selected>4.1 Nano (nhanh)</option>
                    <option value="gpt-4.1-mini">4.1 Mini</option>
                    <option value="gpt-4.1">4.1 (tốt nhất)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. PHÂN TÍCH HỘI THOẠI (Fixed section) -->
          <div style="background: ${COLORS.surface}; border-radius: 8px; padding: 12px; border: 1px solid ${COLORS.border};">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; color: ${COLORS.text};">
              ${ICONS.lightBulb}
              <span style="font-weight: 500; font-size: 13px;">Phân tích hội thoại</span>
              <span style="font-size: 10px; background: #8B5CF6; color: white; padding: 2px 6px; border-radius: 10px; font-weight: 500;">GPT-4.1</span>
            </div>
            <p style="font-size: 11px; color: ${COLORS.textMuted}; margin-bottom: 10px; line-height: 1.4;">
              Phân tích ngữ cảnh và đề xuất hành động tiếp theo.
            </p>
            <button class="pit-ai-btn" data-action="analyze-conversation" style="
              width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 12px;
              border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500;
              background: #8B5CF6; color: white; transition: background 0.2s;
            ">
              ${ICONS.magnifyingGlass}
              <span>Phân tích ngay</span>
            </button>
          </div>

          <!-- 3. TẠO CÂU TRẢ LỜI (Segmented Control) -->
          <div style="background: ${COLORS.surface}; border-radius: 8px; padding: 12px; border: 1px solid ${COLORS.border};">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px; color: ${COLORS.text};">
              ${ICONS.chatBubble}
              <span style="font-weight: 500; font-size: 13px;">Tạo câu trả lời</span>
            </div>

            <!-- Segmented Control -->
            <div id="pit-feature-segmented" style="
              display: flex; background: ${COLORS.background}; border-radius: 8px; padding: 3px;
              border: 1px solid ${COLORS.border}; margin-bottom: 12px;
            ">
              <button class="pit-segment-btn" data-feature="auto-reply" style="
                flex: 1; padding: 8px 6px; border: none; border-radius: 6px; cursor: pointer;
                font-size: 11px; font-weight: 500; transition: all 0.2s;
                background: ${COLORS.primary}; color: white;
              ">AI tự động</button>
              <button class="pit-segment-btn" data-feature="expand-reply" style="
                flex: 1; padding: 8px 6px; border: none; border-radius: 6px; cursor: pointer;
                font-size: 11px; font-weight: 500; transition: all 0.2s;
                background: transparent; color: ${COLORS.textMuted};
              ">Ý chính</button>
              <button class="pit-segment-btn" data-feature="translate-reply" style="
                flex: 1; padding: 8px 6px; border: none; border-radius: 6px; cursor: pointer;
                font-size: 11px; font-weight: 500; transition: all 0.2s;
                background: transparent; color: ${COLORS.textMuted};
              ">Dịch</button>
            </div>

            <!-- Dynamic Content Area -->
            <div id="pit-feature-content">
              <!-- Auto-reply content (default) -->
              <div id="pit-content-auto-reply" style="display: block;">
                <p style="font-size: 11px; color: ${COLORS.textMuted}; margin-bottom: 10px; line-height: 1.4;">
                  Đọc tin cuối của khách và tạo câu trả lời tự động.
                </p>
              </div>

              <!-- Expand-reply content -->
              <div id="pit-content-expand-reply" style="display: none;">
                <!-- Quick Tags -->
                <div id="pit-quick-tags-container" style="
                  display: flex;
                  flex-wrap: wrap;
                  gap: 6px;
                  margin-bottom: 10px;
                ">
                  ${this.quickTags.map(tag => `
                    <button class="pit-quick-tag" data-tag-id="${tag.id}" style="
                      display: inline-flex;
                      align-items: center;
                      gap: 4px;
                      padding: 5px 10px;
                      border-radius: 16px;
                      font-size: 11px;
                      cursor: pointer;
                      transition: all 0.15s ease;
                      border: 1px solid ${COLORS.border};
                      background: ${COLORS.surface};
                      color: ${COLORS.text};
                      font-weight: 400;
                    ">
                      ${tag.label}
                    </button>
                  `).join('')}
                </div>
                <textarea id="pit-key-points" class="pit-textarea" placeholder="Nhập ý chính..." style="
                  width: 100%; min-height: 60px; padding: 10px; border: 1px solid ${COLORS.border}; border-radius: 6px;
                  font-size: 12px; font-family: inherit; resize: vertical; outline: none;
                  transition: border-color 0.2s; background: ${COLORS.surface}; color: ${COLORS.text};
                "></textarea>
                <div style="font-size: 10px; color: ${COLORS.textMuted}; margin-top: 4px;">Enter: Tạo · ⌘/Ctrl+Enter: Tạo & Gửi</div>
              </div>

              <!-- Translate-reply content -->
              <div id="pit-content-translate-reply" style="display: none;">
                <textarea id="pit-translate-input" class="pit-textarea" placeholder="Nhập tiếng Việt..." style="
                  width: 100%; min-height: 60px; padding: 10px; border: 1px solid ${COLORS.border}; border-radius: 6px;
                  font-size: 12px; font-family: inherit; resize: vertical; outline: none;
                  transition: border-color 0.2s; background: ${COLORS.surface}; color: ${COLORS.text};
                "></textarea>
                <div style="font-size: 10px; color: ${COLORS.textMuted}; margin-top: 4px;">Enter: Dịch · ⌘/Ctrl+Enter: Dịch & Gửi</div>
              </div>
            </div>

            <!-- Action Buttons (Fixed) -->
            <div style="display: flex; gap: 8px; margin-top: 10px;">
              <button id="pit-action-create" class="pit-ai-btn" data-action="auto-reply" style="
                flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 12px;
                border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500;
                background: ${COLORS.primary}; color: white; transition: background 0.2s;
              ">
                ${ICONS.sparklesSmall}
                <span>Tạo</span>
              </button>
              <button id="pit-action-send" class="pit-ai-btn" data-action="auto-reply-send" style="
                flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 12px;
                border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500;
                background: ${COLORS.success}; color: white; transition: background 0.2s;
              ">
                ${ICONS.paperAirplane}
                <span>Tạo & Gửi</span>
              </button>
            </div>
          </div>

          <!-- Result area -->
          <div id="pit-ai-result" style="background: ${COLORS.surface}; border: 1px solid ${COLORS.border}; border-radius: 8px; padding: 14px; min-height: 80px;">
            <div style="color: ${COLORS.textMuted}; text-align: center; font-size: 12px;">
              Kết quả sẽ hiển thị ở đây
            </div>
          </div>
        </div>
      `;

      // Close button handler
      const closeBtn = aiPanel.querySelector('#pit-close-panel');
      closeBtn.addEventListener('click', () => {
        aiPanel.style.display = 'none';
      });
      closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255,255,255,0.1)';
      });
      closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'none';
      });

      // Add to body (floating panel)
      document.body.appendChild(aiPanel);

      // Add button click handlers with hover effects
      aiPanel.querySelectorAll('.pit-ai-btn').forEach(btn => {
        btn.addEventListener('click', (e) => this.onActionClick(e));

        // Store original background
        const originalBg = btn.style.background;
        btn.addEventListener('mouseenter', () => {
          btn.style.filter = 'brightness(0.9)';
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.filter = 'none';
        });
      });

      // Add focus styles to selects
      aiPanel.querySelectorAll('select').forEach(select => {
        select.addEventListener('focus', () => {
          select.style.borderColor = COLORS.primary;
        });
        select.addEventListener('blur', () => {
          select.style.borderColor = COLORS.border;
        });
      });

      // Add keyboard shortcuts to textareas
      this.setupTextareaKeyboardShortcuts();

      // Setup auto-translate toggle
      this.setupAutoTranslateToggle();

      // Setup Quick Tags event handlers
      this.setupQuickTagsHandlers();

      // Setup Settings collapse/expand
      this.setupSettingsCollapse();

      // Setup Segmented control
      this.setupSegmentedControl();

      // Load saved settings AFTER panel is added to DOM
      this.loadSettings();

      log('AI panel created with dimensions:', panelWidth, 'x', panelHeight);
    }

    // ==================== Quick Tags ====================
    setupQuickTagsHandlers() {
      const container = document.getElementById('pit-quick-tags-container');
      if (!container) return;

      container.querySelectorAll('.pit-quick-tag').forEach(btn => {
        btn.addEventListener('click', () => this.toggleQuickTag(btn.dataset.tagId));

        // Hover effects
        btn.addEventListener('mouseenter', () => {
          if (!this.selectedTags.has(btn.dataset.tagId)) {
            btn.style.borderColor = COLORS.primary;
            btn.style.background = COLORS.primaryLight;
          }
        });
        btn.addEventListener('mouseleave', () => {
          if (!this.selectedTags.has(btn.dataset.tagId)) {
            btn.style.borderColor = COLORS.border;
            btn.style.background = COLORS.surface;
          }
        });
      });

      log('Quick Tags handlers setup complete');
    }

    // ==================== Settings Collapse/Expand ====================
    setupSettingsCollapse() {
      const header = document.getElementById('pit-settings-header');
      const content = document.getElementById('pit-settings-content');
      const chevron = document.getElementById('pit-settings-chevron');

      if (!header || !content || !chevron) return;

      // Chevron icons
      const chevronDown = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/></svg>`;
      const chevronUp = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z" clip-rule="evenodd"/></svg>`;

      // Initial state: collapsed
      content.style.display = 'none';
      chevron.innerHTML = chevronDown;

      // Click handler
      header.addEventListener('click', () => {
        this.settingsCollapsed = !this.settingsCollapsed;

        if (this.settingsCollapsed) {
          content.style.display = 'none';
          chevron.innerHTML = chevronDown;
        } else {
          content.style.display = 'block';
          chevron.innerHTML = chevronUp;
        }
      });

      // Hover effect
      header.addEventListener('mouseenter', () => {
        header.style.background = COLORS.background;
      });
      header.addEventListener('mouseleave', () => {
        header.style.background = 'transparent';
      });

      log('Settings collapse setup complete');
    }

    // ==================== Segmented Control ====================
    setupSegmentedControl() {
      const segmentedContainer = document.getElementById('pit-feature-segmented');
      if (!segmentedContainer) return;

      const buttons = segmentedContainer.querySelectorAll('.pit-segment-btn');

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const feature = btn.dataset.feature;
          this.switchFeature(feature);
        });

        // Hover effect (only for inactive buttons)
        btn.addEventListener('mouseenter', () => {
          if (btn.dataset.feature !== this.selectedFeature) {
            btn.style.background = COLORS.primaryLight;
            btn.style.color = COLORS.primary;
          }
        });
        btn.addEventListener('mouseleave', () => {
          if (btn.dataset.feature !== this.selectedFeature) {
            btn.style.background = 'transparent';
            btn.style.color = COLORS.textMuted;
          }
        });
      });

      log('Segmented control setup complete');
    }

    switchFeature(feature) {
      if (feature === this.selectedFeature) return;

      this.selectedFeature = feature;
      log('Switching to feature:', feature);

      // Update segmented control buttons
      const buttons = document.querySelectorAll('#pit-feature-segmented .pit-segment-btn');
      buttons.forEach(btn => {
        if (btn.dataset.feature === feature) {
          btn.style.background = COLORS.primary;
          btn.style.color = 'white';
        } else {
          btn.style.background = 'transparent';
          btn.style.color = COLORS.textMuted;
        }
      });

      // Show/hide content areas
      const contents = {
        'auto-reply': document.getElementById('pit-content-auto-reply'),
        'expand-reply': document.getElementById('pit-content-expand-reply'),
        'translate-reply': document.getElementById('pit-content-translate-reply')
      };

      Object.entries(contents).forEach(([key, el]) => {
        if (el) {
          el.style.display = key === feature ? 'block' : 'none';
        }
      });

      // Update action button data-actions
      const createBtn = document.getElementById('pit-action-create');
      const sendBtn = document.getElementById('pit-action-send');

      if (createBtn) {
        createBtn.dataset.action = feature;
      }
      if (sendBtn) {
        sendBtn.dataset.action = feature + '-send';
      }

      log('Feature switched to:', feature);
    }

    // ==================== Auto-Translate Toggle ====================
    setupAutoTranslateToggle() {
      const toggleEl = document.getElementById('pit-auto-translate-toggle');
      if (!toggleEl) return;

      // Load initial state
      this.loadAutoTranslateState();

      // Click handler
      toggleEl.addEventListener('click', () => this.toggleAutoTranslate());

      // Hover effect
      toggleEl.addEventListener('mouseenter', () => {
        toggleEl.style.borderColor = COLORS.primary;
      });
      toggleEl.addEventListener('mouseleave', () => {
        toggleEl.style.borderColor = COLORS.border;
      });

      log('Auto-translate toggle setup complete');
    }

    async loadAutoTranslateState() {
      try {
        const result = await chrome.storage.local.get('pitAutoTranslateEnabled');
        // Default to true if not set
        const enabled = result.pitAutoTranslateEnabled !== undefined ? result.pitAutoTranslateEnabled : true;
        this.updateToggleUI(enabled);
      } catch (e) {
        log('Failed to load auto-translate state:', e);
      }
    }

    async toggleAutoTranslate() {
      try {
        const result = await chrome.storage.local.get('pitAutoTranslateEnabled');
        const currentState = result.pitAutoTranslateEnabled !== undefined ? result.pitAutoTranslateEnabled : true;
        const newState = !currentState;

        // Save to storage (inline-translator.js will listen for this)
        await chrome.storage.local.set({ pitAutoTranslateEnabled: newState });

        // Update UI
        this.updateToggleUI(newState);

        log('Auto-translate toggled:', newState);
      } catch (e) {
        log('Failed to toggle auto-translate:', e);
      }
    }

    updateToggleUI(enabled) {
      const iconEl = document.getElementById('pit-toggle-icon');
      const statusEl = document.getElementById('pit-toggle-status');
      const switchEl = document.getElementById('pit-toggle-switch');
      const knobEl = document.getElementById('pit-toggle-knob');

      if (!iconEl || !statusEl || !switchEl || !knobEl) return;

      if (enabled) {
        iconEl.style.color = COLORS.success;
        statusEl.textContent = 'Đang bật';
        statusEl.style.color = COLORS.success;
        switchEl.style.background = COLORS.success;
        knobEl.style.left = '22px';
      } else {
        iconEl.style.color = COLORS.textMuted;
        statusEl.textContent = 'Đã tắt';
        statusEl.style.color = COLORS.textMuted;
        switchEl.style.background = COLORS.textMuted;
        knobEl.style.left = '2px';
      }
    }

    // ==================== Keyboard Shortcuts ====================
    setupTextareaKeyboardShortcuts() {
      // "Ý chính → Câu trả lời" textarea
      const keyPointsTextarea = document.getElementById('pit-key-points');
      if (keyPointsTextarea) {
        keyPointsTextarea.addEventListener('keydown', (e) => {
          this.handleTextareaKeydown(e, 'expand-reply', 'expand-reply-send');
        });
      }

      // "Dịch sang ngôn ngữ khách" textarea
      const translateTextarea = document.getElementById('pit-translate-input');
      if (translateTextarea) {
        translateTextarea.addEventListener('keydown', (e) => {
          this.handleTextareaKeydown(e, 'translate-reply', 'translate-reply-send');
        });
      }

      log('Keyboard shortcuts setup complete');
    }

    handleTextareaKeydown(e, actionBase, actionSend) {
      // Check if Enter key is pressed
      if (e.key === 'Enter') {
        // Cmd+Enter (Mac) or Ctrl+Enter (Windows) = action + send
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
          log('Cmd/Ctrl+Enter pressed, triggering:', actionSend);
          this.triggerActionByName(actionSend);
        }
        // Just Enter (without Shift for new line) = action only
        else if (!e.shiftKey) {
          e.preventDefault();
          log('Enter pressed, triggering:', actionBase);
          this.triggerActionByName(actionBase);
        }
        // Shift+Enter = normal new line (don't prevent default)
      }
    }

    triggerActionByName(actionName) {
      // Find the button with this action and click it
      const btn = document.querySelector(`.pit-ai-btn[data-action="${actionName}"]`);
      if (btn) {
        btn.click();
      } else {
        log('Button not found for action:', actionName);
      }
    }

    onAITabClick(tabElement) {
      log('AI tab clicked');

      // Toggle active state on tabs
      const allTabs = document.querySelectorAll('.tab-label-item');
      allTabs.forEach(tab => tab.classList.remove('active'));
      tabElement.classList.add('active');

      // Hide other content, show AI panel
      const swipeableView = document.querySelector(SELECTORS.swipeableView);
      const aiPanel = document.getElementById('pit-ai-panel');

      if (swipeableView) swipeableView.style.display = 'none';
      if (aiPanel) aiPanel.style.display = 'block';

      this.activeTab = 'ai';
    }

    restoreOriginalView() {
      const swipeableView = document.querySelector(SELECTORS.swipeableView);
      const aiPanel = document.getElementById('pit-ai-panel');

      if (swipeableView) swipeableView.style.display = '';
      if (aiPanel) aiPanel.style.display = 'none';

      this.activeTab = null;
    }

    async onActionClick(e) {
      const action = e.currentTarget.dataset.action;
      const isRegenerate = e.currentTarget.dataset.regenerate === 'true';
      log('Action clicked:', action, isRegenerate ? '(regenerate)' : '');

      // Check if this is a "send" action
      const shouldSend = action.endsWith('-send');
      const baseAction = shouldSend ? action.replace('-send', '') : action;

      // Check API key
      if (!window.openaiTranslator.getApiKey()) {
        this.showResult('error', 'Chưa có API key. Vui lòng cài đặt trong popup extension.');
        return;
      }

      // Get conversation messages
      const messages = this.extractConversation();
      if (messages.length === 0) {
        this.showResult('error', 'Không tìm thấy tin nhắn trong hội thoại.');
        return;
      }

      this.showLoading(baseAction);

      try {
        let result;
        switch (baseAction) {
          case 'auto-reply':
            // 1. AI tạo câu trả lời: đọc tin cuối của khách + context
            result = await this.generateAutoReply(messages);
            break;
          case 'expand-reply':
            // 2. Ý chính → câu trả lời hoàn chỉnh
            const keyPoints = document.getElementById('pit-key-points')?.value?.trim();
            if (!keyPoints) {
              this.showResult('error', 'Vui lòng nhập ý chính trước.');
              return;
            }
            result = await this.expandKeyPoints(messages, keyPoints);
            break;
          case 'translate-reply':
            // 3. Dịch tiếng Việt → ngôn ngữ khách
            const vietnameseText = document.getElementById('pit-translate-input')?.value?.trim();
            if (!vietnameseText) {
              this.showResult('error', 'Vui lòng nhập câu trả lời tiếng Việt cần dịch.');
              return;
            }
            result = await this.translateToCustomerLanguage(messages, vietnameseText);
            break;
          case 'analyze-conversation':
            // 4. Phân tích hội thoại - dùng GPT-4.1
            result = await this.analyzeConversation(messages);
            // Show analysis result với format riêng
            this.showAnalysisResult(result);
            return; // Return early, đã xử lý hiển thị riêng
        }

        // Track last successful action for regenerate button
        this.lastSuccessfulAction = baseAction;

        // Show result with shouldSend flag and action type for regenerate
        this.showResult('success', result, shouldSend, baseAction);
      } catch (err) {
        log('Error:', err);
        this.showResult('error', `Lỗi: ${err.message}`);
      }
    }

    extractConversation() {
      const messages = [];

      // Get all message elements
      const clientMsgs = document.querySelectorAll(SELECTORS.clientMessage);
      const pageMsgs = document.querySelectorAll(SELECTORS.pageMessage);

      // Combine and sort by DOM position
      const allMsgs = [...clientMsgs, ...pageMsgs];

      allMsgs.forEach(el => {
        const innerDiv = el.querySelector(':scope > div');
        if (!innerDiv) return;

        // Skip quote/reply sections and translation elements
        const replySection = innerDiv.querySelector('.content-replied-message');
        let text = '';

        if (replySection) {
          // Get text after reply section, excluding translations
          const children = Array.from(innerDiv.children);
          for (const child of children) {
            if (!child.classList.contains('content-replied-message') &&
                !child.classList.contains('pit-translation') &&
                !child.classList.contains('pit-loading') &&
                !child.classList.contains('pit-error')) {
              text = child.textContent?.trim() || '';
              break;
            }
          }
        } else {
          // Get text excluding any injected translation elements
          text = this.getOriginalText(innerDiv);
        }

        if (text) {
          const isClient = el.classList.contains('client-message');
          messages.push({
            role: isClient ? 'khách' : 'shop',
            text: text
          });
        }
      });

      log('Extracted', messages.length, 'messages');
      return messages;
    }

    // Get original text content, excluding injected translation elements
    getOriginalText(element) {
      // Clone the element to avoid modifying the DOM
      const clone = element.cloneNode(true);

      // Remove all translation-related elements from clone
      const toRemove = clone.querySelectorAll('.pit-translation, .pit-loading, .pit-error');
      toRemove.forEach(el => el.remove());

      return clone.textContent?.trim() || '';
    }

    formatConversation(messages) {
      return messages.map(m => `[${m.role}]: ${m.text}`).join('\n');
    }

    // 1. AI Tạo câu trả lời: đọc tin cuối của khách + context + system prompt
    async generateAutoReply(messages) {
      // Get last messages from customer (consecutive)
      const lastCustomerMessages = this.getLastCustomerMessages(messages);
      if (lastCustomerMessages.length === 0) {
        throw new Error('Không tìm thấy tin nhắn của khách.');
      }

      // Detect customer language
      const customerLang = this.detectConversationLanguage(messages);

      const conversation = this.formatConversation(messages);
      const lastMsgs = lastCustomerMessages.map(m => m.text).join('\n');

      // Get custom system prompt
      const customPrompt = await this.getCustomSystemPrompt();

      const systemPrompt = customPrompt
        ? `${customPrompt}\n\n---\n\nBạn là nhân viên bán hàng. Dựa trên ngữ cảnh cuộc hội thoại và tin nhắn cuối của khách, tạo MỘT câu trả lời ngắn gọn, thân thiện, chuyên nghiệp.\n\nTrả lời theo format sau (QUAN TRỌNG - phải có cả 2 dòng):\nREPLY: [Câu trả lời bằng ${customerLang}]\nVIET: [Bản dịch tiếng Việt]\n\nCHỈ trả lời theo format trên, không giải thích gì thêm.`
        : `Bạn là nhân viên bán hàng. Dựa trên ngữ cảnh cuộc hội thoại và tin nhắn cuối của khách, tạo MỘT câu trả lời ngắn gọn, thân thiện, chuyên nghiệp.\n\nTrả lời theo format sau (QUAN TRỌNG - phải có cả 2 dòng):\nREPLY: [Câu trả lời bằng ${customerLang}]\nVIET: [Bản dịch tiếng Việt]\n\nCHỈ trả lời theo format trên, không giải thích gì thêm.`;

      const userContent = `Cuộc hội thoại:\n${conversation}\n\n---\nTin nhắn cuối của khách:\n${lastMsgs}`;

      return await this.callOpenAI(systemPrompt, userContent);
    }

    // 2. Ý chính → Câu trả lời hoàn chỉnh
    async expandKeyPoints(messages, keyPoints) {
      // Detect customer language
      const customerLang = this.detectConversationLanguage(messages);

      const conversation = this.formatConversation(messages);

      // Get custom system prompt
      const customPrompt = await this.getCustomSystemPrompt();

      const systemPrompt = customPrompt
        ? `${customPrompt}\n\n---\n\nBạn là nhân viên bán hàng. Dựa trên ngữ cảnh hội thoại, system prompt và ý chính được cung cấp, viết MỘT câu trả lời hoàn chỉnh, thân thiện, chuyên nghiệp.\n\nTrả lời theo format sau (QUAN TRỌNG - phải có cả 2 dòng):\nREPLY: [Câu trả lời bằng ${customerLang}]\nVIET: [Bản dịch tiếng Việt]\n\nCHỈ trả lời theo format trên, không giải thích gì thêm.`
        : `Bạn là nhân viên bán hàng. Dựa trên ngữ cảnh hội thoại và ý chính được cung cấp, viết MỘT câu trả lời hoàn chỉnh, thân thiện, chuyên nghiệp.\n\nTrả lời theo format sau (QUAN TRỌNG - phải có cả 2 dòng):\nREPLY: [Câu trả lời bằng ${customerLang}]\nVIET: [Bản dịch tiếng Việt]\n\nCHỈ trả lời theo format trên, không giải thích gì thêm.`;

      const userContent = `Cuộc hội thoại:\n${conversation}\n\n---\nÝ chính cần truyền đạt:\n${keyPoints}`;

      return await this.callOpenAI(systemPrompt, userContent);
    }

    // 3. Dịch tiếng Việt → Ngôn ngữ khách hàng
    async translateToCustomerLanguage(messages, vietnameseText) {
      // Detect customer language from conversation
      const customerLang = this.detectConversationLanguage(messages);

      const conversation = this.formatConversation(messages);

      const systemPrompt = `Dịch câu trả lời tiếng Việt sang ${customerLang}. Dịch tự nhiên, phù hợp ngữ cảnh bán hàng.\n\nTrả lời theo format sau (QUAN TRỌNG - phải có cả 2 dòng):\nREPLY: [Bản dịch sang ${customerLang}]\nVIET: [Câu gốc tiếng Việt]\n\nCHỈ trả lời theo format trên, không giải thích gì thêm.`;

      const userContent = `Ngữ cảnh hội thoại:\n${conversation}\n\n---\nCâu tiếng Việt cần dịch sang ${customerLang}:\n${vietnameseText}`;

      return await this.callOpenAI(systemPrompt, userContent);
    }

    // Get last consecutive messages from customer
    getLastCustomerMessages(messages) {
      const result = [];

      // Traverse from end to find last customer messages
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === 'khách') {
          result.unshift(messages[i]);
        } else if (result.length > 0) {
          // Stop when we hit a shop message after finding customer messages
          break;
        }
      }

      // Limit to last 3 messages max
      return result.slice(-3);
    }

    // Detect the primary language of customer in conversation
    detectConversationLanguage(messages) {
      // Get customer messages
      const customerMsgs = messages.filter(m => m.role === 'khách');
      if (customerMsgs.length === 0) return 'tiếng Anh';

      // Use last few customer messages for detection
      const sampleText = customerMsgs.slice(-3).map(m => m.text).join(' ');

      // Use language detector if available
      if (window.detectLanguage) {
        const detected = window.detectLanguage(sampleText);
        const langNames = {
          'vi': 'tiếng Việt',
          'en': 'tiếng Anh',
          'zh-TW': 'tiếng Trung phồn thể',
          'zh-CN': 'tiếng Trung giản thể',
          'id': 'tiếng Indonesia',
          'tl': 'tiếng Tagalog/Filipino',
          'th': 'tiếng Thái'
        };
        return langNames[detected] || 'tiếng Anh';
      }

      return 'tiếng Anh';
    }

    async getCustomSystemPrompt() {
      try {
        const result = await chrome.storage.local.get('pitSystemPrompt');
        return result.pitSystemPrompt || '';
      } catch (e) {
        return '';
      }
    }

    // Get Analysis System Prompt (separate from reply prompt)
    async getAnalysisSystemPrompt() {
      try {
        const result = await chrome.storage.local.get('pitAnalysisPrompt');
        return result.pitAnalysisPrompt || '';
      } catch (e) {
        return '';
      }
    }

    // 4. Phân tích hội thoại - Thu thập tất cả tin nhắn và phân tích
    async analyzeConversation(messages) {
      if (messages.length < 2) {
        throw new Error('Cần ít nhất 2 tin nhắn để phân tích.');
      }

      const conversation = this.formatConversation(messages);
      const customerLang = this.detectConversationLanguage(messages);

      // Get custom analysis prompt
      const customAnalysisPrompt = await this.getAnalysisSystemPrompt();

      // Build analysis system prompt
      const baseAnalysisPrompt = `Bạn là chuyên gia phân tích hội thoại bán hàng/CSKH. Phân tích cuộc hội thoại và đưa ra nhận định hữu ích cho nhân viên.

Hãy phân tích theo format sau (BẮT BUỘC):

TÓM TẮT:
[Tóm tắt ngắn gọn nội dung cuộc hội thoại trong 2-3 câu]

TRẠNG THÁI KHÁCH:
[Đánh giá tâm trạng/thái độ khách hàng: hài lòng, quan tâm, phàn nàn, do dự, gấp gáp, v.v.]

VẤN ĐỀ CHÍNH:
[Khách đang hỏi/cần gì? Liệt kê các điểm chính]

ĐỀ XUẤT HÀNH ĐỘNG:
[Nhân viên nên làm gì tiếp theo? Đề xuất cụ thể và thiết thực]

CÂU TRẢ LỜI GỢI Ý:
REPLY: [Câu trả lời gợi ý bằng ${customerLang} - thân thiện, chuyên nghiệp]
VIET: [Bản dịch tiếng Việt của câu trả lời trên]`;

      const systemPrompt = customAnalysisPrompt
        ? `${customAnalysisPrompt}\n\n---\n\n${baseAnalysisPrompt}`
        : baseAnalysisPrompt;

      const userContent = `Cuộc hội thoại (${messages.length} tin nhắn):\n\n${conversation}`;

      // Always use GPT-4.1 for analysis (best quality)
      return await this.callOpenAIWithModel(systemPrompt, userContent, 'gpt-4.1', 2000);
    }

    // Call OpenAI with specific model (for analysis)
    async callOpenAIWithModel(systemPrompt, userContent, model, maxTokens) {
      const apiKey = window.openaiTranslator.getApiKey();

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 90000); // 90s timeout for analysis

      log('Calling OpenAI for analysis with model:', model);

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userContent }
            ],
            temperature: 0.4,
            max_tokens: maxTokens
          }),
          signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.error?.message || `API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content?.trim() || 'Không có kết quả';

      } catch (e) {
        clearTimeout(timeout);
        if (e.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw e;
      }
    }

    // Show analysis result with special formatting
    showAnalysisResult(content) {
      const resultDiv = document.getElementById('pit-ai-result');
      if (!resultDiv) return;

      // Parse the analysis sections
      const sections = this.parseAnalysisSections(content);

      // Extract suggested reply
      const foreignMatch = content.match(/REPLY:\s*(.+?)(?=VIET:|$)/s);
      const vietMatch = content.match(/VIET:\s*(.+?)$/s);

      const foreignText = foreignMatch ? foreignMatch[1].trim() : '';
      const vietText = vietMatch ? vietMatch[1].trim() : '';

      // Purple theme for analysis
      const analysisColor = '#8B5CF6';
      const analysisBg = '#F5F3FF';
      const analysisBorder = '#DDD6FE';

      resultDiv.innerHTML = `
        <div>
          <!-- Analysis Header -->
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid ${COLORS.border};">
            ${ICONS.lightBulb}
            <span style="font-weight: 600; font-size: 14px; color: ${analysisColor};">Kết quả phân tích</span>
            <span style="font-size: 10px; background: ${analysisColor}; color: white; padding: 2px 6px; border-radius: 10px;">GPT-4.1</span>
          </div>

          <!-- Summary Section -->
          ${sections.summary ? `
          <div style="background: ${analysisBg}; border-radius: 8px; padding: 12px; margin-bottom: 10px; border-left: 3px solid ${analysisColor};">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
              ${ICONS.documentText}
              <span style="font-size: 11px; font-weight: 600; color: ${analysisColor}; text-transform: uppercase;">Tóm tắt</span>
            </div>
            <div style="font-size: 13px; color: ${COLORS.text}; line-height: 1.5;">${sections.summary}</div>
          </div>
          ` : ''}

          <!-- Customer Status -->
          ${sections.customerStatus ? `
          <div style="background: ${COLORS.background}; border-radius: 8px; padding: 12px; margin-bottom: 10px;">
            <div style="font-size: 11px; font-weight: 600; color: ${COLORS.textMuted}; text-transform: uppercase; margin-bottom: 6px;">Trạng thái khách</div>
            <div style="font-size: 13px; color: ${COLORS.text}; line-height: 1.5;">${sections.customerStatus}</div>
          </div>
          ` : ''}

          <!-- Main Issues -->
          ${sections.mainIssues ? `
          <div style="background: ${COLORS.background}; border-radius: 8px; padding: 12px; margin-bottom: 10px;">
            <div style="font-size: 11px; font-weight: 600; color: ${COLORS.textMuted}; text-transform: uppercase; margin-bottom: 6px;">Vấn đề chính</div>
            <div style="font-size: 13px; color: ${COLORS.text}; line-height: 1.5;">${sections.mainIssues}</div>
          </div>
          ` : ''}

          <!-- Suggested Action -->
          ${sections.suggestedAction ? `
          <div style="background: #ECFDF5; border-radius: 8px; padding: 12px; margin-bottom: 10px; border-left: 3px solid ${COLORS.success};">
            <div style="font-size: 11px; font-weight: 600; color: ${COLORS.success}; text-transform: uppercase; margin-bottom: 6px;">Đề xuất hành động</div>
            <div style="font-size: 13px; color: ${COLORS.text}; line-height: 1.5;">${sections.suggestedAction}</div>
          </div>
          ` : ''}

          <!-- Suggested Reply -->
          ${foreignText ? `
          <div style="background: ${COLORS.primaryLight}; border-radius: 8px; padding: 14px; margin-bottom: 10px; border: 1px solid #BFDBFE;">
            <div style="font-size: 11px; color: ${COLORS.primary}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Câu trả lời gợi ý</div>
            <div style="font-size: 13px; color: #1E40AF; line-height: 1.6; margin-bottom: 8px;">${foreignText}</div>
            ${vietText ? `<div style="font-size: 12px; color: ${COLORS.textMuted}; font-style: italic; padding-top: 8px; border-top: 1px dashed #BFDBFE;">${vietText}</div>` : ''}
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 8px;">
            <button class="pit-analysis-insert" style="
              flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
              background: ${COLORS.primary}; color: white; border: none; padding: 10px 14px;
              border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 500;
              transition: background 0.2s;
            ">
              ${ICONS.paperAirplane}
              <span>Điền vào chatbox</span>
            </button>
            <button class="pit-analysis-send" style="
              flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
              background: ${COLORS.success}; color: white; border: none; padding: 10px 14px;
              border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 500;
              transition: background 0.2s;
            ">
              ${ICONS.paperAirplane}
              <span>Gửi</span>
            </button>
          </div>
          ` : `
          <!-- No suggested reply found - show raw content -->
          <div style="background: ${COLORS.background}; border-radius: 8px; padding: 12px;">
            <div style="font-size: 13px; color: ${COLORS.text}; line-height: 1.6; white-space: pre-wrap;">${content}</div>
          </div>
          `}
        </div>
      `;

      // Add button handlers
      const insertBtn = resultDiv.querySelector('.pit-analysis-insert');
      const sendBtn = resultDiv.querySelector('.pit-analysis-send');

      if (insertBtn && foreignText) {
        insertBtn.addEventListener('click', () => {
          this.insertToChat(foreignText);
          insertBtn.innerHTML = `${ICONS.check}<span>Đã điền</span>`;
          setTimeout(() => {
            insertBtn.innerHTML = `${ICONS.paperAirplane}<span>Điền vào chatbox</span>`;
          }, 2000);
        });
        insertBtn.addEventListener('mouseenter', () => insertBtn.style.filter = 'brightness(0.9)');
        insertBtn.addEventListener('mouseleave', () => insertBtn.style.filter = 'none');
      }

      if (sendBtn && foreignText) {
        sendBtn.addEventListener('click', () => {
          this.insertToChat(foreignText);
          setTimeout(() => {
            this.clickSendButton();
            sendBtn.innerHTML = `${ICONS.check}<span>Đã gửi</span>`;
            setTimeout(() => {
              sendBtn.innerHTML = `${ICONS.paperAirplane}<span>Gửi</span>`;
            }, 2000);
          }, 100);
        });
        sendBtn.addEventListener('mouseenter', () => sendBtn.style.filter = 'brightness(0.9)');
        sendBtn.addEventListener('mouseleave', () => sendBtn.style.filter = 'none');
      }

      log('Analysis result displayed');
    }

    // Parse analysis sections from response
    parseAnalysisSections(content) {
      const sections = {
        summary: '',
        customerStatus: '',
        mainIssues: '',
        suggestedAction: ''
      };

      // Extract each section
      const summaryMatch = content.match(/TÓM TẮT:\s*\n?([\s\S]*?)(?=TRẠNG THÁI KHÁCH:|VẤN ĐỀ CHÍNH:|ĐỀ XUẤT HÀNH ĐỘNG:|CÂU TRẢ LỜI GỢI Ý:|$)/i);
      const statusMatch = content.match(/TRẠNG THÁI KHÁCH:\s*\n?([\s\S]*?)(?=VẤN ĐỀ CHÍNH:|ĐỀ XUẤT HÀNH ĐỘNG:|CÂU TRẢ LỜI GỢI Ý:|$)/i);
      const issuesMatch = content.match(/VẤN ĐỀ CHÍNH:\s*\n?([\s\S]*?)(?=ĐỀ XUẤT HÀNH ĐỘNG:|CÂU TRẢ LỜI GỢI Ý:|$)/i);
      const actionMatch = content.match(/ĐỀ XUẤT HÀNH ĐỘNG:\s*\n?([\s\S]*?)(?=CÂU TRẢ LỜI GỢI Ý:|$)/i);

      if (summaryMatch) sections.summary = summaryMatch[1].trim();
      if (statusMatch) sections.customerStatus = statusMatch[1].trim();
      if (issuesMatch) sections.mainIssues = issuesMatch[1].trim();
      if (actionMatch) sections.suggestedAction = actionMatch[1].trim();

      return sections;
    }

    // Load saved settings from storage
    async loadSettings() {
      try {
        const result = await chrome.storage.local.get(['pitResponseLength', 'pitModel']);

        const lengthSelect = document.getElementById('pit-response-length');
        const modelSelect = document.getElementById('pit-model-select');

        if (lengthSelect && result.pitResponseLength) {
          lengthSelect.value = result.pitResponseLength;
        }
        if (modelSelect && result.pitModel) {
          modelSelect.value = result.pitModel;
        }

        // Add change listeners to save settings
        lengthSelect?.addEventListener('change', () => this.saveSettings());
        modelSelect?.addEventListener('change', () => this.saveSettings());

        log('Settings loaded:', result.pitResponseLength || 'medium', result.pitModel || 'gpt-4.1-nano');
      } catch (e) {
        log('Failed to load settings:', e);
      }
    }

    // Save settings to storage
    async saveSettings() {
      try {
        const lengthSelect = document.getElementById('pit-response-length');
        const modelSelect = document.getElementById('pit-model-select');

        await chrome.storage.local.set({
          pitResponseLength: lengthSelect?.value || 'medium',
          pitModel: modelSelect?.value || 'gpt-4.1-nano'
        });

        log('Settings saved:', lengthSelect?.value, modelSelect?.value);
      } catch (e) {
        log('Failed to save settings:', e);
      }
    }

    // Get current response length setting
    getResponseLength() {
      const select = document.getElementById('pit-response-length');
      return select?.value || 'medium';
    }

    // Get current model setting
    getSelectedModel() {
      const select = document.getElementById('pit-model-select');
      return select?.value || 'gpt-4.1-nano';
    }

    // Get length instruction for prompt
    getLengthInstruction() {
      const length = this.getResponseLength();
      const instructions = {
        'short': 'Trả lời NGẮN GỌN, súc tích (1-2 câu).',
        'medium': 'Trả lời vừa phải, đủ ý (2-3 câu).',
        'detailed': 'Trả lời CHI TIẾT, đầy đủ thông tin (3-5 câu).'
      };
      return instructions[length] || instructions['medium'];
    }

    async callOpenAI(systemPrompt, userContent) {
      const apiKey = window.openaiTranslator.getApiKey();
      const model = this.getSelectedModel();
      const lengthInstruction = this.getLengthInstruction();

      // Add length instruction to system prompt
      const enhancedSystemPrompt = `${systemPrompt}\n\n${lengthInstruction}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      // Adjust max_tokens based on length setting
      const maxTokensMap = {
        'short': 300,
        'medium': 600,
        'detailed': 1200
      };
      const maxTokens = maxTokensMap[this.getResponseLength()] || 600;

      log('Calling OpenAI with model:', model, 'length:', this.getResponseLength());

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: enhancedSystemPrompt },
              { role: 'user', content: userContent }
            ],
            temperature: 0.5,
            max_tokens: maxTokens
          }),
          signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.error?.message || `API error: ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content?.trim() || 'Không có kết quả';

      } catch (e) {
        clearTimeout(timeout);
        if (e.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw e;
      }
    }

    // Insert text into Pancake chat box
    insertToChat(text) {
      const chatBox = document.getElementById('replyBoxComposer');
      if (!chatBox) {
        log('Chat box not found');
        return false;
      }

      // Set value
      chatBox.value = text;

      // Trigger input event to notify React/Vue of the change
      const inputEvent = new Event('input', { bubbles: true });
      chatBox.dispatchEvent(inputEvent);

      // Also trigger change event
      const changeEvent = new Event('change', { bubbles: true });
      chatBox.dispatchEvent(changeEvent);

      // Focus the chat box
      chatBox.focus();

      log('Inserted text to chat box:', text.substring(0, 50) + '...');
      return true;
    }

    // Click send button on Pancake chat
    clickSendButton() {
      // The send button is a span.new-reply-box-btn containing an SVG with fill="#096DD9" (blue)
      // There are multiple .new-reply-box-btn elements, we need to find the one with blue SVG

      // Method 1: Find all .new-reply-box-btn and check which one has blue SVG inside
      const allBtns = document.querySelectorAll('.new-reply-box-btn');
      let sendBtn = null;

      for (const btn of allBtns) {
        const svg = btn.querySelector('svg');
        if (svg && svg.getAttribute('fill') === '#096DD9') {
          sendBtn = btn;
          log('Found send button by blue SVG fill');
          break;
        }
      }

      // Method 2: Direct selector for SVG with blue fill, then get parent
      if (!sendBtn) {
        const blueSvg = document.querySelector('.new-reply-box-btn svg[fill="#096DD9"]');
        if (blueSvg) {
          sendBtn = blueSvg.closest('.new-reply-box-btn') || blueSvg;
          log('Found send button via direct SVG selector');
        }
      }

      if (!sendBtn) {
        log('Send button not found');
        return false;
      }

      // Click the send button
      sendBtn.click();
      log('Send button clicked');
      return true;
    }

    // Insert text and send immediately
    insertAndSend(text) {
      const inserted = this.insertToChat(text);
      if (!inserted) return false;

      // Small delay to ensure React has processed the input
      setTimeout(() => {
        this.clickSendButton();
      }, 100);

      return true;
    }

    showLoading(action) {
      const resultDiv = document.getElementById('pit-ai-result');
      if (!resultDiv) return;

      const actionNames = {
        'auto-reply': 'Đang tạo câu trả lời',
        'expand-reply': 'Đang viết câu trả lời',
        'translate-reply': 'Đang dịch',
        'analyze-conversation': 'Đang phân tích hội thoại'
      };

      resultDiv.innerHTML = `
        <div class="pit-ai-loading" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 30px; gap: 12px;">
          <div class="pit-ai-spinner" style="width: 28px; height: 28px; border: 3px solid ${COLORS.border}; border-top-color: ${COLORS.primary}; border-radius: 50%; animation: pit-spin 0.8s linear infinite;"></div>
          <span style="color: ${COLORS.textMuted}; font-size: 13px;">${actionNames[action] || 'Đang xử lý'}...</span>
        </div>
        <style>
          @keyframes pit-spin { to { transform: rotate(360deg); } }
        </style>
      `;
    }

    showResult(type, content, shouldSend = false, actionType = null) {
      const resultDiv = document.getElementById('pit-ai-result');
      if (!resultDiv) return;

      // Refresh icon SVG
      const refreshIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clip-rule="evenodd"/></svg>`;

      // Check if this action supports regenerate (auto-reply and expand-reply)
      const supportsRegenerate = actionType === 'auto-reply' || actionType === 'expand-reply';

      if (type === 'error') {
        resultDiv.innerHTML = `
          <div style="display: flex; align-items: flex-start; gap: 10px; padding: 12px; background: #FEF2F2; border-radius: 6px; border-left: 3px solid ${COLORS.error};">
            <span style="color: ${COLORS.error}; flex-shrink: 0;">${ICONS.exclamation}</span>
            <span style="color: #991B1B; font-size: 13px;">${content}</span>
          </div>
        `;
      } else {
        // Parse bilingual format: REPLY: ... and VIET: ...
        const foreignMatch = content.match(/REPLY:\s*(.+?)(?=VIET:|$)/s);
        const vietMatch = content.match(/VIET:\s*(.+?)$/s);

        if (foreignMatch && vietMatch) {
          // Bilingual format - show in separate boxes
          const foreignText = foreignMatch[1].trim();
          const vietText = vietMatch[1].trim();

          // Auto-insert to chat box (and send if shouldSend)
          let inserted = false;
          let sent = false;
          if (shouldSend) {
            inserted = this.insertToChat(foreignText);
            if (inserted) {
              sent = true;
              // Small delay to ensure React has processed the input
              setTimeout(() => this.clickSendButton(), 100);
            }
          } else {
            inserted = this.insertToChat(foreignText);
          }

          // Determine notification message
          let notificationMsg = '';
          let notificationBg = '#ECFDF5';
          let notificationBorder = '#A7F3D0';
          let notificationColor = '#059669';

          if (sent) {
            notificationMsg = 'Đã gửi tin nhắn cho khách';
            notificationBg = '#ECFDF5';
            notificationBorder = '#10B981';
            notificationColor = '#059669';
          } else if (inserted) {
            notificationMsg = 'Đã tự động điền vào chat';
          }

          resultDiv.innerHTML = `
            <div>
              <!-- Auto-inserted/sent notification -->
              ${notificationMsg ? `
              <div style="display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: ${notificationBg}; border-radius: 6px; margin-bottom: 10px; border: 1px solid ${notificationBorder};">
                ${ICONS.check}
                <span style="font-size: 12px; color: ${notificationColor}; font-weight: 500;">${notificationMsg}</span>
              </div>
              ` : ''}

              <!-- Foreign text box -->
              <div style="background: ${COLORS.primaryLight}; border-radius: 8px; padding: 14px; margin-bottom: 10px; border: 1px solid #BFDBFE;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <span style="font-size: 11px; color: ${COLORS.primary}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Gửi khách</span>
                  <div style="display: flex; gap: 6px;">
                    <button class="pit-copy-foreign" style="
                      display: flex; align-items: center; gap: 4px;
                      background: ${COLORS.primary}; color: white; border: none; padding: 6px 12px;
                      border-radius: 4px; font-size: 11px; cursor: pointer; font-weight: 500;
                      transition: background 0.2s;
                    ">
                      ${ICONS.clipboard}
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
                <div style="font-size: 13px; color: #1E40AF; line-height: 1.6;">${foreignText}</div>
              </div>

              <!-- Vietnamese reference -->
              <div style="background: ${COLORS.background}; border-radius: 8px; padding: 12px; margin-bottom: 10px; border-left: 3px solid ${COLORS.accent};">
                <div style="font-size: 11px; color: ${COLORS.textMuted}; font-weight: 600; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Tiếng Việt (tham khảo)</div>
                <div style="font-size: 12px; color: ${COLORS.textMuted}; line-height: 1.5; font-style: italic;">${vietText}</div>
              </div>

              <!-- Action buttons row -->
              <div style="display: flex; gap: 8px;">
                ${supportsRegenerate ? `
                <button class="pit-regenerate-result" data-action="${actionType}" style="
                  flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
                  background: ${COLORS.accent}; color: white; border: none; padding: 10px 14px;
                  border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 500;
                  transition: background 0.2s;
                ">
                  ${refreshIcon}
                  <span>Tạo lại</span>
                </button>
                ` : ''}
                <button class="pit-insert-chat" style="
                  flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
                  background: ${COLORS.textMuted}; color: white; border: none; padding: 10px 14px;
                  border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 500;
                  transition: background 0.2s;
                ">
                  ${ICONS.paperAirplane}
                  <span>Điền lại</span>
                </button>
                <button class="pit-send-now" style="
                  flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
                  background: ${COLORS.success}; color: white; border: none; padding: 10px 14px;
                  border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 500;
                  transition: background 0.2s;
                ">
                  ${ICONS.paperAirplane}
                  <span>Gửi</span>
                </button>
              </div>
            </div>
          `;

          // Regenerate button handler
          const regenBtn = resultDiv.querySelector('.pit-regenerate-result');
          if (regenBtn) {
            regenBtn.addEventListener('click', () => {
              const action = regenBtn.dataset.action;
              const btn = document.querySelector(`.pit-ai-btn[data-action="${action}"]:not([data-regenerate])`);
              if (btn) btn.click();
            });
            regenBtn.addEventListener('mouseenter', () => {
              regenBtn.style.filter = 'brightness(0.9)';
            });
            regenBtn.addEventListener('mouseleave', () => {
              regenBtn.style.filter = 'none';
            });
          }

          // Insert to chat handler (for re-insert)
          const insertBtn = resultDiv.querySelector('.pit-insert-chat');
          insertBtn?.addEventListener('click', () => {
            this.insertToChat(foreignText);
            insertBtn.innerHTML = `${ICONS.check}<span>Đã điền</span>`;
            insertBtn.style.background = COLORS.success;
            setTimeout(() => {
              insertBtn.innerHTML = `${ICONS.paperAirplane}<span>Điền lại</span>`;
              insertBtn.style.background = COLORS.textMuted;
            }, 2000);
          });
          insertBtn?.addEventListener('mouseenter', () => {
            insertBtn.style.filter = 'brightness(0.9)';
          });
          insertBtn?.addEventListener('mouseleave', () => {
            insertBtn.style.filter = 'none';
          });

          // Send now button handler
          const sendBtn = resultDiv.querySelector('.pit-send-now');
          sendBtn?.addEventListener('click', () => {
            this.insertToChat(foreignText);
            setTimeout(() => {
              this.clickSendButton();
              sendBtn.innerHTML = `${ICONS.check}<span>Đã gửi</span>`;
              setTimeout(() => {
                sendBtn.innerHTML = `${ICONS.paperAirplane}<span>Gửi</span>`;
              }, 2000);
            }, 100);
          });
          sendBtn?.addEventListener('mouseenter', () => {
            sendBtn.style.filter = 'brightness(0.9)';
          });
          sendBtn?.addEventListener('mouseleave', () => {
            sendBtn.style.filter = 'none';
          });

          // Copy foreign text handler
          const copyBtn = resultDiv.querySelector('.pit-copy-foreign');
          copyBtn?.addEventListener('click', (e) => {
            navigator.clipboard.writeText(foreignText);
            copyBtn.innerHTML = `${ICONS.check}<span>Đã copy</span>`;
            copyBtn.style.background = COLORS.success;
            setTimeout(() => {
              copyBtn.innerHTML = `${ICONS.clipboard}<span>Copy</span>`;
              copyBtn.style.background = COLORS.primary;
            }, 2000);
          });
          copyBtn?.addEventListener('mouseenter', () => {
            copyBtn.style.background = COLORS.primaryHover;
          });
          copyBtn?.addEventListener('mouseleave', () => {
            copyBtn.style.background = COLORS.primary;
          });
        } else {
          // Fallback: regular format
          const formatted = content
            .replace(/\n/g, '<br>')
            .replace(/^(\d+\.)(.+)$/gm, '<div style="margin: 6px 0;"><strong>$1</strong>$2</div>')
            .replace(/^- (.+)$/gm, '<div style="margin: 4px 0; padding-left: 8px;">• $1</div>');

          resultDiv.innerHTML = `
            <div>
              <div style="font-size: 13px; line-height: 1.6; color: ${COLORS.text};">${formatted}</div>
              <button class="pit-copy-btn" style="
                display: flex; align-items: center; gap: 4px;
                background: ${COLORS.primary}; color: white; border: none; padding: 8px 14px;
                border-radius: 4px; font-size: 12px; cursor: pointer; margin-top: 12px; font-weight: 500;
                transition: background 0.2s;
              ">
                ${ICONS.clipboard}
                <span>Copy</span>
              </button>
            </div>
          `;

          const copyBtn = resultDiv.querySelector('.pit-copy-btn');
          copyBtn?.addEventListener('click', () => {
            navigator.clipboard.writeText(content);
            copyBtn.innerHTML = `${ICONS.check}<span>Đã copy</span>`;
            copyBtn.style.background = COLORS.success;
            setTimeout(() => {
              copyBtn.innerHTML = `${ICONS.clipboard}<span>Copy</span>`;
              copyBtn.style.background = COLORS.primary;
            }, 2000);
          });
          copyBtn?.addEventListener('mouseenter', () => {
            copyBtn.style.background = COLORS.primaryHover;
          });
          copyBtn?.addEventListener('mouseleave', () => {
            copyBtn.style.background = COLORS.primary;
          });
        }
      }
    }
  }

  // Handle tab switching (restore original view when other tabs clicked)
  document.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab-label-item');
    if (tab && !tab.classList.contains('pit-ai-tab-label')) {
      // User clicked a non-AI tab, restore original view
      const swipeableView = document.querySelector(SELECTORS.swipeableView);
      const aiPanel = document.getElementById('pit-ai-panel');

      if (swipeableView) swipeableView.style.display = '';
      if (aiPanel) aiPanel.style.display = 'none';
    }
  }, true);

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new AISidebarPanel());
  } else {
    new AISidebarPanel();
  }

})();
