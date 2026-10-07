/**
 * URBAN AURA - Main Application Logic & Controller
 * Implements Single-Page Routing, Dynamic Views, AI Studio, Interactive Dashboards & Expo Presentation Tour
 */

class UrbanAuraApp {
  constructor() {
    this.currentView = "home";
    this.selectedCompanyId = null;
    this.comparisonList = ["comp_1", "comp_2"];
    this.currentAiDesign = null;
    this.tourStep = 0;
    this.chartInstance = null;

    this.init();
  }

  init() {
    // Subscribe to state changes
    window.appStore.subscribe(state => {
      this.updateGlobalHeader(state);
      this.renderCurrentView();
    });

    // Initial render
    this.updateGlobalHeader(window.appStore.getState());
    this.renderView("home");

    // Initialize AI Studio default design
    this.currentAiDesign = window.appStore.getState().aiDesignPresets[0];

    // Bind navigation & hash routing
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.replace("#", "") || "home";
      this.renderView(hash);
    });

    // Check if initial hash exists
    if (window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      if (hash) this.renderView(hash);
    }
  }

  // --- Router & Navigation ---
  navigateTo(view, params = {}) {
    if (params.companyId) this.selectedCompanyId = params.companyId;
    window.location.hash = view;
    this.renderView(view, params);
  }

  renderView(view, params = {}) {
    this.currentView = view;
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Update active nav links
    document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.toggle("active", link.getAttribute("data-view") === view);
    });

    const mainContainer = document.getElementById("main-view-container");
    if (!mainContainer) return;

    switch (view) {
      case "home":
        mainContainer.innerHTML = this.renderHomeView();
        break;
      case "explore":
        mainContainer.innerHTML = this.renderExploreView();
        this.bindExploreFilters();
        break;
      case "company-profile":
        const compId = params.companyId || this.selectedCompanyId || "comp_1";
        mainContainer.innerHTML = this.renderCompanyProfileView(compId);
        break;
      case "compare":
        mainContainer.innerHTML = this.renderCompareView();
        break;
      case "ai-studio":
        mainContainer.innerHTML = this.renderAiStudioView();
        this.initAiStudio();
        break;
      case "request":
        mainContainer.innerHTML = this.renderRequestWizardView(params);
        break;
      case "customer-dashboard":
        mainContainer.innerHTML = this.renderCustomerDashboardView();
        break;
      case "electricity":
        mainContainer.innerHTML = this.renderElectricityDashboardView();
        this.initElectricityChart();
        break;
      case "maintenance":
        mainContainer.innerHTML = this.renderMaintenanceDashboardView();
        break;
      case "company-dashboard":
        mainContainer.innerHTML = this.renderCompanyDashboardView();
        break;
      default:
        mainContainer.innerHTML = this.renderHomeView();
        break;
    }
  }

  renderCurrentView() {
    // Re-renders the current view when state changes
    this.renderView(this.currentView, { companyId: this.selectedCompanyId });
  }

  // --- Toast Notifications ---
  showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    let icon = "check-circle";
    if (type === "info") icon = "info";
    if (type === "error") icon = "alert-circle";

    toast.innerHTML = `
      <i data-lucide="${icon}" style="width: 20px; height: 20px; color: ${type === 'success' ? '#10b981' : type === 'info' ? '#06b6d4' : '#f43f5e'};"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // --- Header & Role Badge ---
  updateGlobalHeader(state) {
    const user = state.currentUser;
    const roleBadge = document.getElementById("header-user-badge");
    if (!roleBadge) return;

    if (user && user.role !== "guest") {
      roleBadge.innerHTML = `
        <img src="${user.avatar || 'assets/hero.jpg'}" class="user-avatar" alt="${user.name}">
        <div class="user-info">
          <span class="user-name">${user.name.split(" ")[0]}</span>
          <span class="user-role-label">${user.role === 'company' ? 'Builder' : 'Customer'}</span>
        </div>
      `;
    } else {
      roleBadge.innerHTML = `
        <div class="user-avatar" style="background: rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center;">
          <i data-lucide="user" style="width:16px; height:16px;"></i>
        </div>
        <div class="user-info">
          <span class="user-name">Login / Register</span>
          <span class="user-role-label">Guest</span>
        </div>
      `;
    }

    // Update active role button in top demo bar
    document.querySelectorAll(".role-btn").forEach(btn => {
      const role = btn.getAttribute("data-role");
      if (role === "customer" && user.role === "customer") btn.classList.add("active");
      else if (role === "company" && user.role === "company") btn.classList.add("active");
      else if (role === "guest" && user.role === "guest") btn.classList.add("active");
      else btn.classList.remove("active");
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // --- Views ---

  // 1. Home View
  renderHomeView() {
    const state = window.appStore.getState();
    const featuredCompanies = state.companies.slice(0, 3);

    return `
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="app-container">
          <div class="hero-grid">
            <div class="hero-content">
              <div class="hero-pill">
                <span class="pulse-dot"></span> Next-Gen Construction & AI Architecture Ecosystem
              </div>
              <h1 class="hero-title">
                Your Space, Your Choice, <br><span class="gradient-text">Your Vision.</span>
              </h1>
              <p class="hero-description">
                Discover and compare top verified construction companies, generate instant AI 3D architectural conceptual designs, track milestone execution with live drone updates, and monitor smart post-build electricity & maintenance.
              </p>
              
              <div class="hero-cta-group">
                <button class="btn btn-primary btn-lg" onclick="app.navigateTo('ai-studio')">
                  <i data-lucide="sparkles"></i> Launch AI Design Studio
                </button>
                <button class="btn btn-secondary btn-lg" onclick="app.navigateTo('explore')">
                  <i data-lucide="search"></i> Browse Builders
                </button>
                <button class="btn btn-cyan btn-lg" onclick="app.startPresentationTour()">
                  <i data-lucide="play-circle"></i> Science Expo Demo Tour
                </button>
              </div>

              <div class="hero-stats-row">
                <div class="stat-item">
                  <h3>120+</h3>
                  <p>Smart Projects Built</p>
                </div>
                <div class="stat-item">
                  <h3>45+</h3>
                  <p>Verified RERA Builders</p>
                </div>
                <div class="stat-item">
                  <h3>4.9 ★</h3>
                  <p>Customer Satisfaction</p>
                </div>
              </div>
            </div>

            <div class="hero-visual-card">
              <div class="hero-img-wrap">
                <img src="assets/hero.jpg" alt="Urban Aura Modern Architecture">
              </div>
              <div class="hero-floating-badge">
                <div class="floating-badge-info">
                  <h4>The Solarium Luxury Villa</h4>
                  <p><i data-lucide="map-pin" style="width:14px; height:14px; display:inline;"></i> ECR Chennai • Built by Apex Infra</p>
                </div>
                <button class="btn btn-sm btn-outline-gold" onclick="app.navigateTo('company-profile', {companyId: 'comp_1'})">
                  View Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Workflow Section -->
      <section class="section" style="background: rgba(0, 0, 0, 0.25);">
        <div class="app-container">
          <div class="section-header">
            <span class="section-subtitle">Seamless End-to-End Journey</span>
            <h2 class="section-title">How URBAN AURA Transforms Construction</h2>
            <p class="section-desc">From your first AI dream house sketch to post-handover smart solar monitoring and on-demand maintenance.</p>
          </div>

          <div class="workflow-grid">
            <div class="workflow-card">
              <span class="workflow-step-num">01</span>
              <div class="workflow-icon-box workflow-icon-gold">
                <i data-lucide="compass"></i>
              </div>
              <h3>Explore & Compare</h3>
              <p>Browse verified builders, examine past luxury villas & commercial portfolios, read verified client reviews, and compare pricing.</p>
            </div>

            <div class="workflow-card">
              <span class="workflow-step-num">02</span>
              <div class="workflow-icon-box workflow-icon-cyan">
                <i data-lucide="sparkles"></i>
              </div>
              <h3>AI Conceptual Studio</h3>
              <p>Describe your dream house in natural words. AI instantly generates 3D exterior renders, 2D floor plans, and material estimates.</p>
            </div>

            <div class="workflow-card">
              <span class="workflow-step-num">03</span>
              <div class="workflow-icon-box workflow-icon-emerald">
                <i data-lucide="check-circle-2"></i>
              </div>
              <h3>Hire & Track Live</h3>
              <p>Send construction requests, lock milestone escrow budgets, and track foundation-to-handover progress with photo updates.</p>
            </div>

            <div class="workflow-card">
              <span class="workflow-step-num">04</span>
              <div class="workflow-icon-box workflow-icon-purple">
                <i data-lucide="zap"></i>
              </div>
              <h3>Smart Power & Care</h3>
              <p>Monitor live electricity load, cut power bills with solar AI tips, and book on-demand electrical, plumbing, and painting maintenance.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Construction Companies -->
      <section class="section">
        <div class="app-container">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 36px;">
            <div>
              <span class="section-subtitle">Top Verified Contractors</span>
              <h2 class="section-title" style="margin-bottom: 0;">Featured Construction Companies</h2>
            </div>
            <button class="btn btn-secondary" onclick="app.navigateTo('explore')">
              View All 45+ Companies <i data-lucide="arrow-right"></i>
            </button>
          </div>

          <div class="companies-grid">
            ${featuredCompanies.map(comp => this.renderCompanyCardHtml(comp)).join("")}
          </div>
        </div>
      </section>

      <!-- AI Studio Interactive Teaser Banner -->
      <section class="section">
        <div class="app-container">
          <div class="glass-card" style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9)); border: 1.5px solid var(--accent-gold); padding: 48px;">
            <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 36px; align-items: center;">
              <div>
                <span class="badge badge-gold" style="margin-bottom: 12px;"><i data-lucide="sparkles"></i> AI Architectural Generator</span>
                <h2 style="font-size: 2.2rem; margin-bottom: 14px;">Have a Dream House in Mind? Let AI Visualize It in 3 Seconds!</h2>
                <p style="color: var(--text-muted); font-size: 1rem; margin-bottom: 24px;">
                  Describe your plot size, floors, and aesthetics. Our AI generative studio crafts photorealistic exterior architecture and 2D blueprint layouts ready for contractor estimation.
                </p>
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                  <button class="btn btn-primary btn-lg" onclick="app.navigateTo('ai-studio')">
                    <i data-lucide="wand-2"></i> Try AI Studio Now
                  </button>
                  <button class="btn btn-secondary btn-lg" onclick="app.navigateTo('compare')">
                    <i data-lucide="columns"></i> Compare Contractors
                  </button>
                </div>
              </div>
              <div style="border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--glass-border); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <img src="assets/ai_villa.jpg" alt="AI Generated Villa Preview">
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // 2. Explore Construction Companies View
  renderExploreView() {
    const state = window.appStore.getState();
    const companies = state.companies;

    return `
      <section class="section">
        <div class="app-container">
          <div class="section-header" style="text-align: left; margin-bottom: 32px;">
            <span class="section-subtitle">Verified Builder Directory</span>
            <h2 class="section-title">Explore Top Construction Companies</h2>
            <p class="section-desc">Compare licensed contractors, structural specialists, and green builders with transparent rates and past project portfolios.</p>
          </div>

          <div class="explore-layout">
            <!-- Sidebar Filters -->
            <aside class="filter-sidebar">
              <h3>
                <span><i data-lucide="filter" style="width:18px; height:18px; display:inline;"></i> Filter Builders</span>
                <button class="btn-sm btn-secondary" onclick="app.resetFilters()">Reset</button>
              </h3>

              <div class="filter-group">
                <label>Search Builder</label>
                <input type="text" id="search-company-input" class="filter-input" placeholder="Search by name or keyword..." oninput="app.filterCompanies()">
              </div>

              <div class="filter-group">
                <label>Building Type</label>
                <div class="filter-pills-wrap" id="building-type-filters">
                  <span class="filter-pill active" data-type="All" onclick="app.setBuildingTypeFilter(this, 'All')">All Types</span>
                  <span class="filter-pill" data-type="Villas" onclick="app.setBuildingTypeFilter(this, 'Villas')">Villas</span>
                  <span class="filter-pill" data-type="Duplex" onclick="app.setBuildingTypeFilter(this, 'Duplex')">Duplex</span>
                  <span class="filter-pill" data-type="Eco-Homes" onclick="app.setBuildingTypeFilter(this, 'Eco-Homes')">Eco Homes</span>
                  <span class="filter-pill" data-type="Commercial Complexes" onclick="app.setBuildingTypeFilter(this, 'Commercial Complexes')">Commercial</span>
                </div>
              </div>

              <div class="filter-group">
                <label>Budget Base Rate (₹/sq.ft)</label>
                <select id="rate-filter-select" class="custom-select" onchange="app.filterCompanies()">
                  <option value="all">Any Pricing</option>
                  <option value="under-2000">Under ₹2,000 / sq.ft</option>
                  <option value="2000-2300">₹2,000 - ₹2,300 / sq.ft</option>
                  <option value="above-2300">Above ₹2,300 / sq.ft</option>
                </select>
              </div>

              <div class="filter-group">
                <label>Minimum Rating</label>
                <select id="rating-filter-select" class="custom-select" onchange="app.filterCompanies()">
                  <option value="0">All Ratings</option>
                  <option value="4.8">4.8+ Stars (Elite)</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>

              <div style="background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: var(--radius-md); padding: 16px; margin-top: 20px;">
                <h5 style="color: var(--accent-cyan); font-size: 0.85rem; margin-bottom: 6px;">Compare Multiple</h5>
                <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 12px;">Select checkboxes on company cards to compare side-by-side.</p>
                <button class="btn btn-cyan btn-sm" style="width: 100%;" onclick="app.navigateTo('compare')">
                  <i data-lucide="columns"></i> Open Comparison (${this.comparisonList.length})
                </button>
              </div>
            </aside>

            <!-- Companies Grid -->
            <main>
              <div id="companies-grid-container" class="companies-grid">
                ${companies.map(comp => this.renderCompanyCardHtml(comp)).join("")}
              </div>
            </main>
          </div>
        </div>
      </section>
    `;
  }

  renderCompanyCardHtml(comp) {
    const isCompared = this.comparisonList.includes(comp.id);
    return `
      <div class="company-card" data-comp-id="${comp.id}" data-type="${comp.buildingTypes.join(',')}" data-rate="${comp.baseRatePerSqFt}" data-rating="${comp.rating}">
        <div class="company-card-banner">
          <img src="${comp.banner}" alt="${comp.name}">
          <span class="company-card-rate-tag">Starts ₹${comp.baseRatePerSqFt.toLocaleString()} / sq.ft</span>
        </div>

        <div class="company-card-body">
          <div class="company-card-header">
            <img src="${comp.logo}" class="company-logo-img" alt="${comp.name}">
            <div class="company-title-wrap">
              <h4>${comp.name}</h4>
              <span class="company-location-text"><i data-lucide="map-pin" style="width:12px; height:12px; display:inline;"></i> ${comp.location}</span>
            </div>
          </div>

          <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 10px; line-height: 1.5;">
            ${comp.tagline}
          </p>

          <div class="company-specs-row">
            <div class="company-spec-item">
              <i data-lucide="star"></i>
              <span><strong>${comp.rating}</strong> (${comp.reviewCount})</span>
            </div>
            <div class="company-spec-item">
              <i data-lucide="building"></i>
              <span><strong>${comp.completedProjectsCount}</strong> Delivered</span>
            </div>
            <div class="company-spec-item">
              <i data-lucide="shield-check"></i>
              <span><strong>${comp.yearsExperience}</strong> Yrs Exp</span>
            </div>
          </div>

          <div class="company-tags-wrap">
            ${comp.specialties.slice(0, 3).map(spec => `<span class="badge badge-cyan">${spec}</span>`).join("")}
          </div>

          <div class="company-card-footer">
            <label class="compare-checkbox-label">
              <input type="checkbox" ${isCompared ? 'checked' : ''} onchange="app.toggleCompare('${comp.id}', this.checked)">
              Compare
            </label>

            <div style="display: flex; gap: 8px;">
              <button class="btn btn-sm btn-secondary" onclick="app.navigateTo('company-profile', {companyId: '${comp.id}'})">
                Profile & Projects
              </button>
              <button class="btn btn-sm btn-primary" onclick="app.navigateTo('request', {companyId: '${comp.id}'})">
                Hire / Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 3. Company Detailed Profile View
  renderCompanyProfileView(companyId) {
    const state = window.appStore.getState();
    const comp = state.companies.find(c => c.id === companyId) || state.companies[0];

    return `
      <section class="section" style="padding-top: 20px;">
        <div class="app-container">
          <!-- Back button -->
          <div style="margin-bottom: 16px;">
            <button class="btn btn-sm btn-secondary" onclick="app.navigateTo('explore')">
              <i data-lucide="arrow-left"></i> Back to Explore Builders
            </button>
          </div>

          <!-- Banner & Header -->
          <div class="company-profile-banner">
            <img src="${comp.banner}" alt="${comp.name}">
            <div class="company-profile-overlay">
              <div class="profile-header-content">
                <div class="profile-title-area">
                  <span class="badge badge-gold" style="margin-bottom: 8px;"><i data-lucide="check-circle-2"></i> Verified RERA & ISO Builder</span>
                  <h2>${comp.name}</h2>
                  <p class="profile-tagline">${comp.tagline}</p>
                </div>

                <div style="display: flex; gap: 12px;">
                  <button class="btn btn-secondary btn-lg" onclick="app.toggleCompare('${comp.id}', true); app.navigateTo('compare');">
                    <i data-lucide="columns"></i> Add to Compare
                  </button>
                  <button class="btn btn-primary btn-lg" onclick="app.navigateTo('request', {companyId: '${comp.id}'})">
                    <i data-lucide="send"></i> Send Construction Request
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Stats Bar -->
          <div class="glass-card" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; text-align: center; margin-bottom: 36px; padding: 20px;">
            <div>
              <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase;">Average Rating</span>
              <h3 style="font-size: 1.8rem; color: var(--accent-gold);">${comp.rating} ★</h3>
              <p style="font-size: 0.75rem; color: var(--text-dim);">${comp.reviewCount} Verified Reviews</p>
            </div>
            <div>
              <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase;">Projects Delivered</span>
              <h3 style="font-size: 1.8rem; color: var(--accent-cyan);">${comp.completedProjectsCount}+</h3>
              <p style="font-size: 0.75rem; color: var(--text-dim);">100% On-Time Execution</p>
            </div>
            <div>
              <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase;">Turnkey Base Rate</span>
              <h3 style="font-size: 1.8rem; color: var(--accent-emerald);">₹${comp.baseRatePerSqFt}</h3>
              <p style="font-size: 0.75rem; color: var(--text-dim);">Per Square Foot</p>
            </div>
            <div>
              <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase;">Experience & RERA</span>
              <h3 style="font-size: 1.8rem; color: var(--text-main);">${comp.yearsExperience} Yrs</h3>
              <p style="font-size: 0.75rem; color: var(--text-dim);">${comp.licenseNo}</p>
            </div>
          </div>

          <!-- Tabs for Company Details -->
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 32px;">
            <div>
              <!-- About -->
              <div class="glass-card" style="margin-bottom: 28px;">
                <h3 style="margin-bottom: 12px; font-size: 1.3rem;">About Company & Philosophy</h3>
                <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 16px;">${comp.description}</p>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  ${comp.specialties.map(s => `<span class="badge badge-gold">${s}</span>`).join("")}
                </div>
              </div>

              <!-- Services & Pricing Catalog -->
              <div class="glass-card" style="margin-bottom: 28px;">
                <h3 style="margin-bottom: 16px; font-size: 1.3rem;">Services & Pricing Schedule</h3>
                <div style="display: flex; flex-direction: column; gap: 14px;">
                  ${comp.services.map(srv => `
                    <div style="background: rgba(0, 0, 0, 0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; display: flex; justify-content: space-between; align-items: center; gap: 16px;">
                      <div>
                        <h4 style="font-size: 1rem; margin-bottom: 4px;">${srv.title}</h4>
                        <p style="font-size: 0.8rem; color: var(--text-muted);">${srv.desc}</p>
                      </div>
                      <span class="badge badge-emerald" style="font-size: 0.82rem; white-space: nowrap;">${srv.rate}</span>
                    </div>
                  `).join("")}
                </div>
              </div>

              <!-- Previous Construction Projects Portfolio -->
              <div class="glass-card" style="margin-bottom: 28px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <h3 style="font-size: 1.3rem;">Previous Completed Projects</h3>
                  <span class="badge badge-cyan">${comp.portfolio.length} Projects Showcase</span>
                </div>

                <div class="portfolio-grid">
                  ${comp.portfolio.map(proj => `
                    <div class="portfolio-card" onclick="app.showProjectModal('${comp.id}', '${proj.id}')">
                      <div class="portfolio-thumb">
                        <img src="${proj.image}" alt="${proj.title}">
                      </div>
                      <div class="portfolio-body">
                        <span class="badge badge-gold" style="font-size: 0.7rem; margin-bottom: 4px;">${proj.category}</span>
                        <h4>${proj.title}</h4>
                        <p style="font-size: 0.78rem; color: var(--text-muted);"><i data-lucide="map-pin" style="width:12px; height:12px; display:inline;"></i> ${proj.location}</p>
                        <div class="portfolio-meta">
                          <span>${proj.areaSqFt} sq.ft</span>
                          <strong style="color: var(--accent-gold);">${proj.budget}</strong>
                        </div>
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>

              <!-- Customer Ratings & Past Reviews -->
              <div class="glass-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                  <h3 style="font-size: 1.3rem;">Verified Customer Reviews & Ratings</h3>
                  <button class="btn btn-sm btn-outline-gold" onclick="app.showAddReviewModal('${comp.id}')">
                    <i data-lucide="plus"></i> Write a Review
                  </button>
                </div>

                <div class="reviews-summary-box">
                  <div class="review-big-score">
                    <h2>${comp.rating}</h2>
                    <div style="color: var(--accent-gold); font-size: 1.1rem; margin: 4px 0;">★★★★★</div>
                    <p style="font-size: 0.78rem; color: var(--text-muted);">${comp.reviewCount} ratings</p>
                  </div>
                  <div class="review-bars-wrap">
                    <div class="rating-bar-row">
                      <span>Construction Quality</span>
                      <div class="progress-track"><div class="progress-fill-gold" style="width: 98%;"></div></div>
                      <span>4.9</span>
                    </div>
                    <div class="rating-bar-row">
                      <span>Schedule Adherence</span>
                      <div class="progress-track"><div class="progress-fill-cyan" style="width: 95%;"></div></div>
                      <span>4.8</span>
                    </div>
                    <div class="rating-bar-row">
                      <span>Budget Transparency</span>
                      <div class="progress-track"><div class="progress-fill-gold" style="width: 96%;"></div></div>
                      <span>4.8</span>
                    </div>
                    <div class="rating-bar-row">
                      <span>Client Communication</span>
                      <div class="progress-track"><div class="progress-fill-cyan" style="width: 99%;"></div></div>
                      <span>5.0</span>
                    </div>
                  </div>
                </div>

                <div class="reviews-list">
                  ${comp.reviews.map(rev => `
                    <div class="review-item-card">
                      <div class="review-item-header">
                        <div class="reviewer-meta">
                          <h5>${rev.author} ${rev.verified ? '<span class="badge badge-emerald" style="font-size: 0.65rem; margin-left: 6px;">Verified Client</span>' : ''}</h5>
                          <span>${rev.role} • ${rev.date}</span>
                        </div>
                        <div style="color: var(--accent-gold); font-weight: 700; font-size: 0.95rem;">
                          ${rev.rating} ★
                        </div>
                      </div>
                      <p style="font-size: 0.88rem; color: var(--text-main); line-height: 1.6;">${rev.comment}</p>
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>

            <!-- Sidebar Info & Contact CTA -->
            <div>
              <div class="glass-card" style="position: sticky; top: 96px;">
                <h4 style="font-size: 1.15rem; margin-bottom: 16px;">Direct Contractor Contact</h4>
                
                <div style="display: flex; flex-direction: column; gap: 14px; font-size: 0.88rem; margin-bottom: 24px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <i data-lucide="phone" style="color: var(--accent-gold);"></i>
                    <span>${comp.phone}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <i data-lucide="mail" style="color: var(--accent-cyan);"></i>
                    <span>${comp.email}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <i data-lucide="globe" style="color: var(--accent-emerald);"></i>
                    <span>${comp.website}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <i data-lucide="award" style="color: var(--accent-purple);"></i>
                    <span>${comp.isoCertified}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <i data-lucide="users" style="color: var(--text-muted);"></i>
                    <span>${comp.teamSize}</span>
                  </div>
                </div>

                <button class="btn btn-primary btn-lg" style="width: 100%; margin-bottom: 10px;" onclick="app.navigateTo('request', {companyId: '${comp.id}'})">
                  <i data-lucide="file-check"></i> Request Construction Order
                </button>
                <button class="btn btn-secondary btn-sm" style="width: 100%;" onclick="app.navigateTo('ai-studio')">
                  <i data-lucide="sparkles"></i> Design Dream House With AI First
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // 4. Compare Companies Matrix View
  renderCompareView() {
    const state = window.appStore.getState();
    const comparedCompanies = state.companies.filter(c => this.comparisonList.includes(c.id));

    return `
      <section class="section">
        <div class="app-container">
          <div class="section-header">
            <span class="section-subtitle">Side-by-Side Evaluation</span>
            <h2 class="section-title">Compare Construction Companies</h2>
            <p class="section-desc">Analyze rates, completed track records, warranties, structural technologies, and client ratings side-by-side to make the confident choice.</p>
          </div>

          ${comparedCompanies.length === 0 ? `
            <div class="glass-card" style="text-align: center; padding: 60px;">
              <i data-lucide="columns" style="width: 48px; height: 48px; color: var(--accent-gold); margin-bottom: 16px;"></i>
              <h3>No companies selected for comparison yet</h3>
              <p style="color: var(--text-muted); margin-bottom: 20px;">Browse the builder catalog and check "Compare" on 2 to 4 companies.</p>
              <button class="btn btn-primary" onclick="app.navigateTo('explore')">Browse Builders Now</button>
            </div>
          ` : `
            <div class="compare-table-container">
              <table class="compare-table">
                <thead>
                  <tr>
                    <th>Key Metric / Feature</th>
                    ${comparedCompanies.map(c => `
                      <th class="compare-card-col">
                        <div class="compare-company-top">
                          <img src="${c.logo}" style="width: 44px; height: 44px; border-radius: var(--radius-md); object-fit: cover;" alt="${c.name}">
                          <h5>${c.name}</h5>
                          <span class="badge badge-gold">${c.rating} ★ (${c.reviewCount})</span>
                          <button class="btn btn-sm btn-outline-gold" style="font-size: 0.72rem; padding: 2px 8px;" onclick="app.toggleCompare('${c.id}', false)">Remove</button>
                        </div>
                      </th>
                    `).join("")}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Base Pricing / sq.ft</td>
                    ${comparedCompanies.map(c => `
                      <td class="compare-card-col"><strong style="color: var(--accent-emerald); font-size: 1.1rem;">₹${c.baseRatePerSqFt.toLocaleString()}</strong> / sq.ft</td>
                    `).join("")}
                  </tr>
                  <tr>
                    <td>Experience & History</td>
                    ${comparedCompanies.map(c => `
                      <td class="compare-card-col"><strong>${c.yearsExperience} Years</strong> (Founded ${c.foundedYear})</td>
                    `).join("")}
                  </tr>
                  <tr>
                    <td>Completed Deliveries</td>
                    ${comparedCompanies.map(c => `
                      <td class="compare-card-col"><strong style="color: var(--accent-cyan);">${c.completedProjectsCount}+ Projects</strong></td>
                    `).join("")}
                  </tr>
                  <tr>
                    <td>Specialties & Focus</td>
                    ${comparedCompanies.map(c => `
                      <td class="compare-card-col" style="font-size: 0.8rem;">${c.specialties.join(", ")}</td>
                    `).join("")}
                  </tr>
                  <tr>
                    <td>License & Compliance</td>
                    ${comparedCompanies.map(c => `
                      <td class="compare-card-col" style="font-size: 0.78rem;">${c.licenseNo}<br><span style="color:var(--accent-purple);">${c.isoCertified}</span></td>
                    `).join("")}
                  </tr>
                  <tr>
                    <td>Free Comprehensive Warranty</td>
                    ${comparedCompanies.map(c => `
                      <td class="compare-card-col"><span class="badge badge-emerald">3-Year Structure & MEP</span></td>
                    `).join("")}
                  </tr>
                  <tr>
                    <td>Smart IoT Electricity Ready</td>
                    ${comparedCompanies.map(c => `
                      <td class="compare-card-col"><i data-lucide="check" style="color: var(--accent-emerald);"></i> Included</td>
                    `).join("")}
                  </tr>
                  <tr>
                    <td>AI Studio Integration</td>
                    ${comparedCompanies.map(c => `
                      <td class="compare-card-col"><i data-lucide="check" style="color: var(--accent-gold);"></i> 100% Compatible</td>
                    `).join("")}
                  </tr>
                  <tr>
                    <td>Action</td>
                    ${comparedCompanies.map(c => `
                      <td class="compare-card-col">
                        <button class="btn btn-primary btn-sm" style="width: 100%;" onclick="app.navigateTo('request', {companyId: '${c.id}'})">
                          Select & Build
                        </button>
                      </td>
                    `).join("")}
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="display: flex; justify-content: center; gap: 16px; margin-top: 30px;">
              <button class="btn btn-secondary" onclick="app.navigateTo('explore')">
                <i data-lucide="plus"></i> Add More Builders
              </button>
              <button class="btn btn-primary" onclick="app.navigateTo('ai-studio')">
                <i data-lucide="sparkles"></i> Generate AI Design for Selected Builder
              </button>
            </div>
          `}
        </div>
      </section>
    `;
  }

  // 5. AI Architectural Conceptual Design Studio View
  renderAiStudioView() {
    return `
      <section class="section">
        <div class="app-container">
          <div class="section-header">
            <span class="section-subtitle">AI Generative Architecture Engine</span>
            <h2 class="section-title">AI Conceptual Design Studio</h2>
            <p class="section-desc">Describe your dream building in everyday words. Our AI visualizes photorealistic exterior architecture, computes structural bill of estimates, and draws 2D blueprint layouts.</p>
          </div>

          <div class="ai-studio-layout">
            <!-- Studio Controls -->
            <div class="ai-controls-card">
              <div class="ai-prompt-box">
                <label>
                  <span><i data-lucide="sparkles" style="width:16px; height:16px; display:inline;"></i> Describe Your Dream House</span>
                  <span style="font-size: 0.72rem; color: var(--text-dim);">Natural Language Input</span>
                </label>
                <textarea id="ai-prompt-input" class="ai-textarea" placeholder="e.g., Enakku modern two-floor house venum, 3 bedrooms, balcony, garden and car parking venum with rooftop solar...">Enakku modern two-floor house venum, 3 bedrooms, balcony, garden and car parking venum.</textarea>

                <div class="ai-prompt-presets-bar">
                  <span class="preset-chip" onclick="app.setAiPrompt('Modern two-floor luxury villa with 3 master bedrooms, cantilevered glass balcony, lush lawn and EV charging parking.')">✨ Modern 3BHK Villa</span>
                  <span class="preset-chip" onclick="app.setAiPrompt('Contemporary concrete duplex with rooftop glass pergola lounge, warm ambient linear LED lights, and sunken courtyard.')">✨ Minimalist Duplex</span>
                  <span class="preset-chip" onclick="app.setAiPrompt('100% Sustainable eco-friendly residential home with living vertical garden walls, timber cladding, natural rainwater pond, and massive solar roof.')">✨ Eco Solar Biophilic</span>
                  <span class="preset-chip" onclick="app.setAiPrompt('Traditional fusion South Indian luxury home with clay-tiled sloping roofs, teakwood carved pillars, central mutram courtyard, and modern glass enclosures.')">✨ Heritage Fusion</span>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Building Type</label>
                  <select id="ai-building-type" class="custom-select">
                    <option value="Villas">Luxury Villa</option>
                    <option value="Duplex">Contemporary Duplex</option>
                    <option value="Eco-Homes">Eco-Friendly Solar Home</option>
                    <option value="Commercial Complexes">Commercial Complex</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Total Floors</label>
                  <select id="ai-floors" class="custom-select">
                    <option value="1">1 Floor (Single Story)</option>
                    <option value="2" selected>2 Floors (Duplex / Villa)</option>
                    <option value="3">3 Floors (G + 2)</option>
                    <option value="5">5 Floors (Commercial Hub)</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Plot Size (Sq.Ft)</label>
                  <input type="number" id="ai-plot-size" class="custom-input" value="2400" step="100">
                </div>
                <div class="form-group">
                  <label>Architectural Style</label>
                  <select id="ai-style" class="custom-select">
                    <option value="Modern Luxury Villa">Futuristic Modern</option>
                    <option value="Minimalist Duplex">Minimalist Concrete</option>
                    <option value="Eco Biophilic Solar Home">Biophilic Green</option>
                    <option value="Traditional Fusion Courtyard">Neo-Traditional Fusion</option>
                    <option value="Glass Commercial Boutique">Glass Curtain Tower</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>Day / Lighting Atmosphere</label>
                <div class="lighting-modes-wrap">
                  <button type="button" class="lighting-mode-btn active" data-mode="day" onclick="app.setAiLighting('day', this)">
                    <i data-lucide="sun"></i> Bright Daylight
                  </button>
                  <button type="button" class="lighting-mode-btn" data-mode="dusk" onclick="app.setAiLighting('dusk', this)">
                    <i data-lucide="sunset"></i> Golden Dusk
                  </button>
                  <button type="button" class="lighting-mode-btn" data-mode="night" onclick="app.setAiLighting('night', this)">
                    <i data-lucide="moon"></i> Night LED Glow
                  </button>
                </div>
              </div>

              <button id="ai-generate-btn" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 10px;" onclick="app.triggerAiGeneration()">
                <i data-lucide="sparkles"></i> Generate AI Conceptual Design
              </button>
            </div>

            <!-- Studio Output Viewport -->
            <div class="ai-output-viewport">
              <div class="ai-render-frame" id="ai-render-frame">
                <img id="ai-render-img" src="assets/ai_villa.jpg" alt="AI Generated Architecture">
                
                <div class="ai-render-badge-bar">
                  <span class="badge badge-gold" id="ai-concept-badge"><i data-lucide="sparkles"></i> AI 3D Conceptual Visualization</span>
                  <span class="badge badge-cyan" id="ai-lighting-badge">Bright Daylight</span>
                </div>

                <div id="ai-loading-overlay" class="ai-generating-overlay" style="display: none;">
                  <div class="ai-pulse-spinner"></div>
                  <h4 style="color: #fff; font-size: 1.1rem;">Synthesizing Architectural Geometry...</h4>
                  <p style="color: var(--accent-gold); font-size: 0.8rem;">Calculating structural load, spatial ergonomics & material aesthetics</p>
                </div>
              </div>

              <!-- Mandatory Expo Disclaimer -->
              <div class="ai-disclaimer-box">
                <strong><i data-lucide="info" style="width:14px; height:14px; display:inline;"></i> Important Notice:</strong>
                AI generate panra indha visualization just conceptual aesthetic planning mattum. Actual structural load calculations, soil compliance, and municipal permits will be finalized by your selected licensed construction builder.
              </div>

              <!-- AI Structural & Budget Summary -->
              <div>
                <h4 style="margin-bottom: 12px; font-size: 1.1rem;">AI Structural & Budget Estimate</h4>
                <div class="ai-specs-grid" id="ai-specs-container">
                  <div class="spec-mini-card">
                    <span>Estimated Construction Cost</span>
                    <h5 id="ai-est-budget" style="color: var(--accent-emerald);">₹72 - ₹80 Lakhs</h5>
                  </div>
                  <div class="spec-mini-card">
                    <span>Built-Up Area (FSI 1.35)</span>
                    <h5 id="ai-est-area">3,200 Sq.Ft</h5>
                  </div>
                  <div class="spec-mini-card">
                    <span>Target Execution Timeline</span>
                    <h5 id="ai-est-time">9 - 11 Months</h5>
                  </div>
                  <div class="spec-mini-card">
                    <span>Recommended Solar Power</span>
                    <h5 id="ai-est-solar">5.5 kW Monocrystalline</h5>
                  </div>
                  <div class="spec-mini-card">
                    <span>Foundation Specification</span>
                    <h5 id="ai-est-found" style="font-size: 0.82rem;">RCC Isolated Footing M25</h5>
                  </div>
                  <div class="spec-mini-card">
                    <span>Eco-Carbon Offset</span>
                    <h5 id="ai-est-carbon" style="color: var(--accent-cyan);">384 Kg CO₂/Yr Saved</h5>
                  </div>
                </div>
              </div>

              <!-- 2D Floor Plan Blueprint Schematic Canvas -->
              <div class="blueprint-canvas-box">
                <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 10px;">
                  <h5 style="color: var(--accent-cyan); font-size: 0.9rem;"><i data-lucide="grid"></i> Level-1 2D Blueprint Schematic</h5>
                  <span style="font-size: 0.75rem; color: var(--text-dim);">Auto-Calculated by Spatial AI</span>
                </div>
                <canvas id="blueprint-canvas" class="blueprint-canvas" width="600" height="280"></canvas>
              </div>

              <!-- Actions Bar -->
              <div style="display: flex; gap: 14px; flex-wrap: wrap;">
                <button class="btn btn-primary btn-lg" style="flex: 1;" onclick="app.proceedToOrderWithCurrentAiDesign()">
                  <i data-lucide="check-circle"></i> Confirm & Request Construction Order
                </button>
                <button class="btn btn-secondary btn-lg" onclick="app.saveCurrentAiDesign()">
                  <i data-lucide="bookmark"></i> Save to My Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // 6. Construction Request & Order Wizard View
  renderRequestWizardView(params = {}) {
    const state = window.appStore.getState();
    const targetCompId = params.companyId || this.selectedCompanyId || "comp_1";
    const selectedComp = state.companies.find(c => c.id === targetCompId) || state.companies[0];
    const aiDesign = this.currentAiDesign || state.aiDesignPresets[0];

    return `
      <section class="section">
        <div class="app-container">
          <div class="request-wizard-card">
            <div class="wizard-steps-indicator">
              <div class="wizard-step-node active">
                <div class="wizard-step-circle">1</div>
                <span class="wizard-step-label">Select Builder</span>
              </div>
              <div class="wizard-step-node active">
                <div class="wizard-step-circle">2</div>
                <span class="wizard-step-label">AI Design Concept</span>
              </div>
              <div class="wizard-step-node active">
                <div class="wizard-step-circle">3</div>
                <span class="wizard-step-label">Project Specs</span>
              </div>
              <div class="wizard-step-node active">
                <div class="wizard-step-circle">4</div>
                <span class="wizard-step-label">Confirm Order</span>
              </div>
            </div>

            <h2 style="font-size: 1.8rem; margin-bottom: 8px;">Construction Request & Milestone Confirmation</h2>
            <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 28px;">
              Submit your architectural requirements and AI concept to <strong>${selectedComp.name}</strong> to initiate formal contract & milestone scheduling.
            </p>

            <form id="construction-request-form" onsubmit="app.handleOrderSubmission(event)">
              <!-- Builder Selection -->
              <div class="form-group" style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--glass-border); margin-bottom: 20px;">
                <label style="color: var(--accent-gold);">Selected Construction Company</label>
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <img src="${selectedComp.logo}" style="width: 42px; height: 42px; border-radius: var(--radius-md); object-fit: cover;" alt="${selectedComp.name}">
                    <div>
                      <h4 style="font-size: 1rem;">${selectedComp.name}</h4>
                      <span style="font-size: 0.78rem; color: var(--accent-emerald);">Base Rate: ₹${selectedComp.baseRatePerSqFt} / sq.ft • Rating: ${selectedComp.rating} ★</span>
                    </div>
                  </div>
                  <button type="button" class="btn btn-sm btn-secondary" onclick="app.navigateTo('explore')">Change</button>
                </div>
                <input type="hidden" id="req-company-id" value="${selectedComp.id}">
              </div>

              <!-- Attached AI Design Concept -->
              <div class="form-group" style="background: rgba(6, 182, 212, 0.08); padding: 16px; border-radius: var(--radius-md); border: 1px solid rgba(6, 182, 212, 0.3); margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <label style="color: var(--accent-cyan); margin-bottom: 0;">Attached AI Architectural Concept</label>
                  <button type="button" class="btn btn-sm btn-outline-gold" onclick="app.navigateTo('ai-studio')">Customize in Studio</button>
                </div>
                
                <div style="display: grid; grid-template-columns: 120px 1fr; gap: 16px; align-items: center;">
                  <img src="${aiDesign.image}" style="width: 120px; height: 80px; object-fit: cover; border-radius: var(--radius-sm);" alt="Attached AI Design">
                  <div>
                    <h5 style="font-size: 0.95rem;">${aiDesign.title}</h5>
                    <p style="font-size: 0.78rem; color: var(--text-muted);">${aiDesign.prompt}</p>
                    <span class="badge badge-gold" style="font-size: 0.7rem; margin-top: 4px;">Est. Budget: ${aiDesign.estimatedBudget}</span>
                  </div>
                </div>
                <input type="hidden" id="req-design-id" value="${aiDesign.id}">
                <input type="hidden" id="req-design-prompt" value="${aiDesign.prompt}">
              </div>

              <!-- Project Specifications -->
              <div class="form-row">
                <div class="form-group">
                  <label>Project Title / Residence Name</label>
                  <input type="text" id="req-project-name" class="custom-input" value="Kumar Residence - 2-Floor Smart Villa" required>
                </div>
                <div class="form-group">
                  <label>Plot Location & Address</label>
                  <input type="text" id="req-location" class="custom-input" value="Plot #42, Bayview Enclave, ECR, Chennai" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Plot Area (Sq.Ft)</label>
                  <input type="number" id="req-plot-area" class="custom-input" value="${aiDesign.plotSizeSqFt || 2400}" required>
                </div>
                <div class="form-group">
                  <label>Estimated Built-Up Area (Sq.Ft)</label>
                  <input type="number" id="req-built-area" class="custom-input" value="${aiDesign.builtAreaSqFt || 3200}" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Estimated Total Budget (INR)</label>
                  <input type="text" id="req-budget" class="custom-input" value="₹76,80,000 (₹2,400/sq.ft turnkey)" readonly>
                </div>
                <div class="form-group">
                  <label>Target Commencement Date</label>
                  <input type="date" id="req-start-date" class="custom-input" value="2026-04-15" required>
                </div>
              </div>

              <!-- Special Inclusions -->
              <div class="form-group">
                <label>Special Smart Technology & Sustainable Inclusions</label>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.82rem; margin-top: 6px;">
                  <label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" checked> Smart IoT Electricity Sub-metering</label>
                  <label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" checked> 5.5 kW Monocrystalline Solar Grid</label>
                  <label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" checked> EV Level-2 Fast Charging Bay</label>
                  <label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" checked> Rainwater Harvesting & Recharge Pit</label>
                  <label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" checked> 3-Year Free Comprehensive Maintenance</label>
                  <label style="display:flex; align-items:center; gap:8px; cursor:pointer;"><input type="checkbox" checked> Vastu Architectural Energy Alignment</label>
                </div>
              </div>

              <div style="display: flex; gap: 14px; margin-top: 30px;">
                <button type="submit" class="btn btn-primary btn-lg" style="flex: 1;">
                  <i data-lucide="check-circle-2"></i> Confirm Construction Request & Send to Builder
                </button>
                <button type="button" class="btn btn-secondary btn-lg" onclick="app.navigateTo('explore')">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    `;
  }

  // 7. Customer Dashboard View (Milestones & Saved Designs)
  renderCustomerDashboardView() {
    const state = window.appStore.getState();
    const user = state.currentUser;
    const requests = state.constructionRequests;
    const activeReq = requests[0] || null;
    const savedDesigns = state.aiDesignPresets.filter(d => (user.savedDesigns || []).includes(d.id));

    return `
      <section class="section">
        <div class="app-container">
          <!-- User Profile Bar -->
          <div class="glass-card" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; padding: 24px;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <img src="${user.avatar || 'assets/hero.jpg'}" style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent-gold);" alt="${user.name}">
              <div>
                <h3 style="font-size: 1.4rem;">${user.name}</h3>
                <p style="font-size: 0.82rem; color: var(--text-muted);"><i data-lucide="map-pin" style="width:12px; height:12px; display:inline;"></i> ${user.city || 'Chennai, India'} • ${user.phone || ''}</p>
              </div>
            </div>

            <div style="display: flex; gap: 12px;">
              <button class="btn btn-sm btn-cyan" onclick="app.navigateTo('electricity')">
                <i data-lucide="zap"></i> Live Smart Electricity
              </button>
              <button class="btn btn-sm btn-emerald" onclick="app.navigateTo('maintenance')">
                <i data-lucide="wrench"></i> Property Maintenance
              </button>
              <button class="btn btn-sm btn-primary" onclick="app.navigateTo('ai-studio')">
                <i data-lucide="sparkles"></i> New AI Design
              </button>
            </div>
          </div>

          <div class="dashboard-grid">
            <!-- Left Main Column: Active Construction Project -->
            <div>
              ${activeReq ? `
                <div class="project-timeline-box">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                    <div>
                      <span class="badge badge-gold" style="margin-bottom: 6px;">Live Construction Tracking</span>
                      <h3 style="font-size: 1.35rem;">${activeReq.projectName}</h3>
                      <p style="font-size: 0.82rem; color: var(--text-muted);"><i data-lucide="building-2" style="width:12px; height:12px; display:inline;"></i> Builder: <strong>${activeReq.companyName}</strong></p>
                    </div>

                    <div style="text-align: right;">
                      <span style="font-size: 0.8rem; color: var(--text-muted);">Overall Progress</span>
                      <h2 style="font-size: 2rem; color: var(--accent-gold); font-family: var(--font-heading);">${activeReq.progressPercent}%</h2>
                    </div>
                  </div>

                  <!-- Overall Progress Bar -->
                  <div class="progress-track" style="height: 12px; margin-bottom: 28px;">
                    <div class="progress-fill-gold" style="width: ${activeReq.progressPercent}%;"></div>
                  </div>

                  <!-- Milestone Stages -->
                  <h4 style="font-size: 1.1rem; margin-bottom: 16px;">Milestone Execution Stages</h4>
                  <div class="milestone-track-list">
                    ${activeReq.milestones.map(m => {
                      const isDone = m.status === "Completed";
                      const isInProg = m.status === "In Progress";
                      return `
                        <div class="milestone-item ${isDone ? 'completed' : isInProg ? 'in-progress' : 'pending'}">
                          <div class="milestone-status-icon">
                            ${isDone ? '<i data-lucide="check" style="width:18px; height:18px;"></i>' : isInProg ? '<i data-lucide="hammer" style="width:18px; height:18px;"></i>' : '<i data-lucide="clock" style="width:18px; height:18px; color: var(--text-dim);"></i>'}
                          </div>
                          <div class="milestone-content">
                            <div class="milestone-header">
                              <h4>${m.title}</h4>
                              <span class="badge ${isDone ? 'badge-emerald' : isInProg ? 'badge-gold' : 'badge-purple'}">${m.status} • ${m.completedDate}</span>
                            </div>
                            <p class="milestone-notes">${m.notes}</p>
                          </div>
                        </div>
                      `;
                    }).join("")}
                  </div>
                </div>
              ` : `
                <div class="glass-card" style="text-align: center; padding: 48px;">
                  <i data-lucide="hard-hat" style="width: 48px; height: 48px; color: var(--accent-gold); margin-bottom: 12px;"></i>
                  <h3>No Active Construction Request Yet</h3>
                  <p style="color: var(--text-muted); margin-bottom: 20px;">Use our AI Studio to visualize your home and send your first request to top builders.</p>
                  <button class="btn btn-primary" onclick="app.navigateTo('ai-studio')">Open AI Design Studio</button>
                </div>
              `}

              <!-- Saved AI Architectural Concepts -->
              <div class="glass-card" style="margin-top: 28px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                  <h4 style="font-size: 1.15rem;"><i data-lucide="sparkles" style="color: var(--accent-gold);"></i> My Saved AI Conceptual Designs</h4>
                  <button class="btn btn-sm btn-outline-gold" onclick="app.navigateTo('ai-studio')">+ Create New</button>
                </div>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                  ${savedDesigns.map(d => `
                    <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); overflow: hidden;">
                      <img src="${d.image}" style="width: 100%; height: 140px; object-fit: cover;" alt="${d.title}">
                      <div style="padding: 14px;">
                        <h5 style="font-size: 0.95rem; margin-bottom: 4px;">${d.title}</h5>
                        <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 10px;">${d.prompt}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                          <strong style="font-size: 0.82rem; color: var(--accent-gold);">${d.estimatedBudget}</strong>
                          <button class="btn btn-sm btn-primary" style="font-size: 0.72rem; padding: 4px 10px;" onclick="app.proceedToOrderFromSaved('${d.id}')">Build This</button>
                        </div>
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>
            </div>

            <!-- Right Sidebar: Quick Telemetry & Post-Build Shortcuts -->
            <div>
              <!-- Quick Smart Electricity Widget -->
              <div class="glass-card" style="margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <h4 style="font-size: 1.05rem; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="zap" style="color: var(--accent-gold);"></i> Smart Electricity
                  </h4>
                  <span class="badge badge-emerald">Online IoT</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; text-align: center; margin-bottom: 16px;">
                  <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: var(--radius-sm);">
                    <span style="font-size: 0.72rem; color: var(--text-muted);">Current Load</span>
                    <h4 style="color: var(--accent-cyan); font-size: 1.2rem;">2.84 kW</h4>
                  </div>
                  <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: var(--radius-sm);">
                    <span style="font-size: 0.72rem; color: var(--text-muted);">Solar Share</span>
                    <h4 style="color: var(--accent-emerald); font-size: 1.2rem;">46%</h4>
                  </div>
                </div>
                <button class="btn btn-secondary btn-sm" style="width: 100%;" onclick="app.navigateTo('electricity')">
                  Open Power Dashboard <i data-lucide="arrow-right"></i>
                </button>
              </div>

              <!-- Quick Maintenance Widget -->
              <div class="glass-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                  <h4 style="font-size: 1.05rem; display: flex; align-items: center; gap: 8px;">
                    <i data-lucide="wrench" style="color: var(--accent-cyan);"></i> Maintenance
                  </h4>
                  <span class="badge badge-gold">1 Active Ticket</span>
                </div>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 14px;">
                  Smart Switch Panel Calibration & Solar Sync is scheduled for tomorrow 10:00 AM.
                </p>
                <button class="btn btn-secondary btn-sm" style="width: 100%;" onclick="app.navigateTo('maintenance')">
                  Manage Service Tickets <i data-lucide="arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // 8. Electricity Dashboard View (Smart Energy IoT)
  renderElectricityDashboardView() {
    const state = window.appStore.getState();
    const elec = state.electricityData;

    return `
      <section class="section">
        <div class="app-container">
          <div class="section-header" style="text-align: left; margin-bottom: 28px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
              <div>
                <span class="section-subtitle">Post-Construction IoT Telemetry</span>
                <h2 class="section-title">Smart Building Electricity Dashboard</h2>
                <p class="section-desc">Connected Smart Meter: <strong>${elec.meterId}</strong> • ${elec.connectionName}</p>
              </div>
              <span class="badge badge-emerald" style="padding: 6px 14px; font-size: 0.85rem;"><span class="pulse-dot"></span> Live Telemetry Connected</span>
            </div>
          </div>

          <!-- Top Power Metrics -->
          <div class="power-metrics-grid">
            <div class="power-metric-card gold">
              <div class="metric-header-row">
                <span>LIVE POWER DRAW</span>
                <i data-lucide="activity"></i>
              </div>
              <div class="metric-val" style="color: var(--accent-gold);">${elec.currentLiveLoadKW} <span style="font-size: 1rem;">kW</span></div>
              <div class="metric-subtext">3-Phase Balanced Load</div>
            </div>

            <div class="power-metric-card cyan">
              <div class="metric-header-row">
                <span>TODAY CONSUMPTION</span>
                <i data-lucide="zap"></i>
              </div>
              <div class="metric-val" style="color: var(--accent-cyan);">${elec.todayConsumptionKWh} <span style="font-size: 1rem;">kWh</span></div>
              <div class="metric-subtext">Units used in last 24 hrs</div>
            </div>

            <div class="power-metric-card emerald">
              <div class="metric-header-row">
                <span>SOLAR ROOFTOP SHARE</span>
                <i data-lucide="sun"></i>
              </div>
              <div class="metric-val" style="color: var(--accent-emerald);">${elec.solarSharePercent}%</div>
              <div class="metric-subtext">Saved ₹${elec.solarSavingsINR} this billing cycle</div>
            </div>

            <div class="power-metric-card purple">
              <div class="metric-header-row">
                <span>PROJECTED MONTHLY BILL</span>
                <i data-lucide="receipt"></i>
              </div>
              <div class="metric-val" style="color: var(--accent-purple);">₹${elec.projectedMonthlyBillINR}</div>
              <div class="metric-subtext">vs ₹${elec.lastMonthBillINR} previous month</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 28px; margin-bottom: 32px;">
            <!-- Interactive 12-Month Consumption & Solar Chart -->
            <div class="glass-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h4 style="font-size: 1.15rem;"><i data-lucide="bar-chart-3" style="color: var(--accent-cyan);"></i> Monthly Power Consumption vs Solar Generation</h4>
                <span class="badge badge-gold">LT-1A Domestic Tariff</span>
              </div>
              <div style="position: relative; height: 300px; width: 100%;">
                <canvas id="electricity-chart"></canvas>
              </div>
            </div>

            <!-- Appliance Level Breakdown -->
            <div class="glass-card">
              <h4 style="font-size: 1.15rem; margin-bottom: 16px;"><i data-lucide="pie-chart" style="color: var(--accent-gold);"></i> Connected Appliance Loads</h4>
              <div class="appliance-breakdown-list">
                ${elec.applianceBreakdown.map(app => `
                  <div class="appliance-row">
                    <i data-lucide="${app.icon || 'zap'}" style="color: var(--accent-gold);"></i>
                    <div>
                      <strong style="font-size: 0.85rem;">${app.name}</strong>
                      <div class="progress-track" style="height: 4px; margin-top: 4px;">
                        <div class="progress-fill-cyan" style="width: ${app.sharePercent * 2}%;"></div>
                      </div>
                    </div>
                    <span style="font-weight: 700; font-size: 0.85rem;">${app.sharePercent}%</span>
                    <span style="font-size: 0.78rem; color: var(--accent-emerald);">₹${app.monthlyCostINR}/mo</span>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>

          <!-- AI Energy Saving Suggestions -->
          <div class="glass-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <div>
                <h3 style="font-size: 1.25rem;"><i data-lucide="sparkles" style="color: var(--accent-emerald);"></i> AI Energy-Saving Suggestions</h3>
                <p style="font-size: 0.82rem; color: var(--text-muted);">Smart algorithms detecting peak tariffs, surplus solar generation, and compressor efficiency.</p>
              </div>
              <span class="badge badge-emerald">Total Potential Savings: ~₹1,450 / Month</span>
            </div>

            <div>
              ${elec.aiEnergySavingSuggestions.map(tip => `
                <div class="energy-tip-card">
                  <div>
                    <h4 style="font-size: 0.98rem; margin-bottom: 4px;">${tip.title} <span class="badge badge-emerald" style="font-size: 0.7rem; margin-left: 6px;">${tip.savingsEstimate}</span></h4>
                    <p style="font-size: 0.82rem; color: var(--text-muted);">${tip.desc}</p>
                  </div>
                  <button class="btn btn-sm btn-emerald" onclick="app.applyEnergyRule('${tip.id}')">
                    <i data-lucide="toggle-right"></i> ${tip.actionLabel}
                  </button>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // 9. Maintenance Dashboard View
  renderMaintenanceDashboardView() {
    const state = window.appStore.getState();
    const services = state.maintenanceServices;
    const tickets = state.maintenanceTickets;

    return `
      <section class="section">
        <div class="app-container">
          <div class="section-header" style="text-align: left; margin-bottom: 28px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
              <div>
                <span class="section-subtitle">Post-Handover Property Care</span>
                <h2 class="section-title">Building Maintenance & Care Portal</h2>
                <p class="section-desc">Manage electrical, plumbing, painting, deep cleaning, and structural inspections with guaranteed 2-hour SLA technicians.</p>
              </div>
              <button class="btn btn-primary" onclick="app.showBookMaintenanceModal()">
                <i data-lucide="calendar-plus"></i> Book Service Technician
              </button>
            </div>
          </div>

          <!-- Services Catalog Grid -->
          <h3 style="font-size: 1.3rem; margin-bottom: 16px;">Available On-Demand Maintenance Services</h3>
          <div class="services-catalog-grid">
            ${services.map(srv => `
              <div class="service-card">
                <div class="service-icon-wrap">
                  <i data-lucide="${srv.icon}"></i>
                </div>
                <h4>${srv.title}</h4>
                <p>${srv.desc}</p>
                <div class="service-footer">
                  <div>
                    <span style="font-size: 0.72rem; color: var(--text-muted); display: block;">Base Charge</span>
                    <strong style="color: var(--accent-gold);">₹${srv.basePriceINR}</strong>
                  </div>
                  <button class="btn btn-sm btn-cyan" onclick="app.showBookMaintenanceModal('${srv.category}', '${srv.title}')">
                    Book Service
                  </button>
                </div>
              </div>
            `).join("")}
          </div>

          <!-- Active Maintenance Tickets & History -->
          <div class="glass-card">
            <h3 style="font-size: 1.3rem; margin-bottom: 20px;">Maintenance History & Service Requests</h3>
            
            <div class="tickets-list">
              ${tickets.map(tkt => {
                const isCompleted = tkt.status === "Completed";
                return `
                  <div class="ticket-item-card">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                      <div>
                        <span class="badge badge-cyan" style="font-size: 0.7rem; margin-bottom: 4px;">Ticket #${tkt.id} • ${tkt.category}</span>
                        <h4 style="font-size: 1.05rem;">${tkt.serviceTitle}</h4>
                        <p style="font-size: 0.78rem; color: var(--text-muted);"><i data-lucide="clock" style="width:12px; height:12px; display:inline;"></i> Requested: ${tkt.dateRequested} • Slot: <strong>${tkt.scheduledSlot}</strong></p>
                      </div>

                      <div style="text-align: right;">
                        <span class="badge ${isCompleted ? 'badge-emerald' : 'badge-gold'}" style="font-size: 0.8rem;">${tkt.status}</span>
                        ${tkt.warrantyCovered ? '<div style="font-size: 0.72rem; color: var(--accent-emerald); margin-top: 4px;">100% Free (Under 3-Yr Warranty)</div>' : ''}
                      </div>
                    </div>

                    <div style="background: rgba(0,0,0,0.25); padding: 12px; border-radius: var(--radius-sm); font-size: 0.82rem; margin-bottom: 10px;">
                      <strong>Assigned Specialist:</strong> ${tkt.assignedTechnician} (${tkt.technicianRating} ★)
                      <div style="color: var(--text-muted); margin-top: 4px;">${tkt.notes}</div>
                    </div>

                    ${!isCompleted ? `
                      <div style="display: flex; justify-content: flex-end; gap: 8px;">
                        <button class="btn btn-sm btn-emerald" onclick="app.markTicketComplete('${tkt.id}')">
                          <i data-lucide="check"></i> Mark Service Complete
                        </button>
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join("")}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // 10. Construction Company Dashboard View (Contractor Portal)
  renderCompanyDashboardView() {
    const state = window.appStore.getState();
    const user = state.currentUser;
    const companyId = user.companyId || "comp_1";
    const comp = state.companies.find(c => c.id === companyId) || state.companies[0];
    const incomingRequests = state.constructionRequests;

    return `
      <section class="section">
        <div class="app-container">
          <!-- Contractor Portal Header -->
          <div class="company-dash-header">
            <div style="display: flex; align-items: center; gap: 18px;">
              <img src="${comp.logo}" style="width: 64px; height: 64px; border-radius: var(--radius-md); object-fit: cover; border: 2px solid var(--accent-gold);" alt="${comp.name}">
              <div>
                <span class="badge badge-gold" style="margin-bottom: 4px;">Enterprise Contractor Portal</span>
                <h2 style="font-size: 1.8rem;">${comp.name}</h2>
                <p style="font-size: 0.82rem; color: var(--text-muted);"><i data-lucide="map-pin" style="width:12px; height:12px; display:inline;"></i> ${comp.location} • License: ${comp.licenseNo}</p>
              </div>
            </div>

            <div style="display: flex; gap: 10px;">
              <button class="btn btn-sm btn-outline-gold" onclick="app.showAddProjectModal('${comp.id}')">
                <i data-lucide="plus"></i> Add Past Project
              </button>
              <button class="btn btn-sm btn-primary" onclick="app.showEditProfileModal('${comp.id}')">
                <i data-lucide="edit"></i> Edit Company Profile
              </button>
            </div>
          </div>

          <!-- Contractor KPI Metrics -->
          <div class="power-metrics-grid" style="margin-bottom: 32px;">
            <div class="power-metric-card gold">
              <div class="metric-header-row"><span>CUSTOMER REQUESTS</span><i data-lucide="inbox"></i></div>
              <div class="metric-val" style="color: var(--accent-gold);">${incomingRequests.length}</div>
              <div class="metric-subtext">Active construction leads</div>
            </div>
            <div class="power-metric-card cyan">
              <div class="metric-header-row"><span>PROJECTS UNDERWAY</span><i data-lucide="hammer"></i></div>
              <div class="metric-val" style="color: var(--accent-cyan);">1 Active</div>
              <div class="metric-subtext">Milestone progress tracking</div>
            </div>
            <div class="power-metric-card emerald">
              <div class="metric-header-row"><span>TOTAL CONTRACT VALUE</span><i data-lucide="dollar-sign"></i></div>
              <div class="metric-val" style="color: var(--accent-emerald);">₹76.8 L</div>
              <div class="metric-subtext">Secured in escrow contract</div>
            </div>
            <div class="power-metric-card purple">
              <div class="metric-header-row"><span>CONTRACTOR RATING</span><i data-lucide="star"></i></div>
              <div class="metric-val" style="color: var(--accent-purple);">${comp.rating} ★</div>
              <div class="metric-subtext">${comp.reviewCount} verified client reviews</div>
            </div>
          </div>

          <!-- Manage Customer Construction Orders -->
          <div class="glass-card" style="margin-bottom: 32px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <h3 style="font-size: 1.3rem;">Incoming Construction Requests & Milestone Management</h3>
              <span class="badge badge-gold">Real-time LocalSync</span>
            </div>

            <div>
              ${incomingRequests.map(req => `
                <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 20px;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                    <div>
                      <span class="badge badge-cyan" style="margin-bottom: 6px;">Order #${req.id} • Status: ${req.status}</span>
                      <h4 style="font-size: 1.2rem;">${req.projectName}</h4>
                      <p style="font-size: 0.82rem; color: var(--text-muted);">
                        Client: <strong>${req.customer.name}</strong> (${req.customer.phone}) • Location: ${req.plotLocation}
                      </p>
                      <div style="font-size: 0.78rem; color: var(--accent-gold); margin-top: 4px;">
                        Built-Up Area: ${req.builtUpAreaSqFt} sq.ft • Agreed Value: ₹${(req.estimatedCostINR / 100000).toFixed(1)} Lakhs
                      </div>
                    </div>

                    <div style="text-align: right;">
                      <span style="font-size: 0.8rem; color: var(--text-muted);">Current Milestone Progress</span>
                      <h3 style="color: var(--accent-gold); font-size: 1.6rem;">${req.progressPercent}%</h3>
                    </div>
                  </div>

                  <!-- Contractor Milestone Progress Updater Slider -->
                  <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-cyan); border-radius: var(--radius-md); padding: 18px; margin-bottom: 18px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                      <label style="font-size: 0.85rem; font-weight: 700; color: var(--accent-cyan);">
                        <i data-lucide="sliders" style="width:14px; height:14px; display:inline;"></i> Update Milestone Progress to Customer
                      </label>
                      <span id="slider-val-${req.id}" style="font-weight: 700; color: var(--accent-gold); font-size: 1rem;">${req.progressPercent}%</span>
                    </div>
                    <input type="range" min="0" max="100" value="${req.progressPercent}" class="custom-input" style="width: 100%; cursor: pointer;" oninput="document.getElementById('slider-val-${req.id}').innerText = this.value + '%'" onchange="app.updateContractorProgress('${req.id}', this.value)">
                    <p style="font-size: 0.75rem; color: var(--text-dim); margin-top: 6px;">Adjusting this slider updates the Customer's Dashboard progress bar instantly in real-time!</p>
                  </div>

                  <!-- Milestones List for Contractor -->
                  <h5 style="font-size: 0.95rem; margin-bottom: 10px;">Milestones Status List:</h5>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    ${req.milestones.map(m => `
                      <div style="background: rgba(0,0,0,0.25); padding: 10px 14px; border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem;">
                        <span>${m.title}</span>
                        <span class="badge ${m.status === 'Completed' ? 'badge-emerald' : m.status === 'In Progress' ? 'badge-gold' : 'badge-purple'}">${m.status}</span>
                      </div>
                    `).join("")}
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Manage Portfolio Section -->
          <div class="glass-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <h3 style="font-size: 1.3rem;">Company Portfolio Showcase (${comp.portfolio.length} Projects)</h3>
              <button class="btn btn-sm btn-primary" onclick="app.showAddProjectModal('${comp.id}')">
                <i data-lucide="plus"></i> Add New Project
              </button>
            </div>

            <div class="portfolio-grid">
              ${comp.portfolio.map(p => `
                <div class="portfolio-card">
                  <div class="portfolio-thumb"><img src="${p.image}" alt="${p.title}"></div>
                  <div class="portfolio-body">
                    <span class="badge badge-gold" style="font-size: 0.7rem;">${p.category}</span>
                    <h4>${p.title}</h4>
                    <p style="font-size: 0.78rem; color: var(--text-muted);">${p.location} • ${p.areaSqFt} sq.ft</p>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // --- AI Design Studio Interactivity ---
  initAiStudio() {
    const canvas = document.getElementById("blueprint-canvas");
    if (canvas && window.aiEngine && this.currentAiDesign) {
      window.aiEngine.drawFloorPlan(canvas, this.currentAiDesign);
    }
  }

  setAiPrompt(promptText) {
    const input = document.getElementById("ai-prompt-input");
    if (input) {
      input.value = promptText;
      this.triggerAiGeneration();
    }
  }

  setAiLighting(mode, btn) {
    document.querySelectorAll(".lighting-mode-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");

    const badge = document.getElementById("ai-lighting-badge");
    if (badge) {
      badge.innerText = mode === "day" ? "Bright Daylight" : mode === "dusk" ? "Golden Dusk" : "Night LED Glow";
    }

    if (this.currentAiDesign) {
      this.currentAiDesign.lightingMode = mode;
      const img = document.getElementById("ai-render-img");
      if (img && window.aiEngine) {
        const synthesized = window.aiEngine.synthesizeDesign({
          prompt: this.currentAiDesign.prompt,
          style: this.currentAiDesign.style,
          floors: this.currentAiDesign.floors,
          plotAreaSqFt: this.currentAiDesign.plotSizeSqFt,
          lightingMode: mode
        });
        img.src = synthesized.image;
      }
    }
  }

  triggerAiGeneration() {
    const prompt = document.getElementById("ai-prompt-input")?.value || "";
    const buildingType = document.getElementById("ai-building-type")?.value || "Villas";
    const floors = parseInt(document.getElementById("ai-floors")?.value || "2", 10);
    const plotSize = parseInt(document.getElementById("ai-plot-size")?.value || "2400", 10);
    const style = document.getElementById("ai-style")?.value || "Modern Luxury Villa";
    const activeLightingBtn = document.querySelector(".lighting-mode-btn.active");
    const lightingMode = activeLightingBtn ? activeLightingBtn.getAttribute("data-mode") : "day";

    const loadingOverlay = document.getElementById("ai-loading-overlay");
    if (loadingOverlay) loadingOverlay.style.display = "flex";

    setTimeout(() => {
      if (loadingOverlay) loadingOverlay.style.display = "none";

      const design = window.aiEngine.synthesizeDesign({
        prompt,
        buildingType,
        floors,
        plotAreaSqFt: plotSize,
        style,
        lightingMode
      });

      this.currentAiDesign = design;

      // Update UI
      const img = document.getElementById("ai-render-img");
      if (img) img.src = design.image;

      const badge = document.getElementById("ai-concept-badge");
      if (badge) badge.innerHTML = `<i data-lucide="sparkles"></i> ${design.title}`;

      const estBudget = document.getElementById("ai-est-budget");
      if (estBudget) estBudget.innerText = design.estimatedBudget;

      const estArea = document.getElementById("ai-est-area");
      if (estArea) estArea.innerText = `${design.builtAreaSqFt.toLocaleString()} Sq.Ft`;

      const estTime = document.getElementById("ai-est-time");
      if (estTime) estTime.innerText = design.specs.estimatedCompletion;

      const estSolar = document.getElementById("ai-est-solar");
      if (estSolar) estSolar.innerText = design.specs.solarCapacity;

      const estFound = document.getElementById("ai-est-found");
      if (estFound) estFound.innerText = design.specs.foundation;

      const estCarbon = document.getElementById("ai-est-carbon");
      if (estCarbon) estCarbon.innerText = design.specs.structuralMetrics.carbonReduction;

      // Draw 2D canvas
      const canvas = document.getElementById("blueprint-canvas");
      if (canvas && window.aiEngine) {
        window.aiEngine.drawFloorPlan(canvas, design);
      }

      this.showToast(`AI generated new ${design.style} concept!`, "success");
      if (window.lucide) window.lucide.createIcons();
    }, 900);
  }

  saveCurrentAiDesign() {
    if (!this.currentAiDesign) return;
    window.appStore.saveAiDesign(this.currentAiDesign);
    this.showToast("Conceptual design saved to your profile!", "success");
  }

  proceedToOrderWithCurrentAiDesign() {
    if (!this.currentAiDesign) this.triggerAiGeneration();
    this.navigateTo("request", { companyId: this.selectedCompanyId || "comp_1" });
  }

  proceedToOrderFromSaved(designId) {
    const design = window.appStore.getAiDesignById(designId);
    if (design) {
      this.currentAiDesign = design;
      this.navigateTo("request", { companyId: this.selectedCompanyId || "comp_1" });
    }
  }

  // --- Order & Request Handlers ---
  handleOrderSubmission(event) {
    event.preventDefault();

    const companyId = document.getElementById("req-company-id")?.value || "comp_1";
    const comp = window.appStore.getCompanyById(companyId);
    const designId = document.getElementById("req-design-id")?.value || "ai_des_1";
    const projectName = document.getElementById("req-project-name")?.value || "New Residence";
    const location = document.getElementById("req-location")?.value || "Chennai";
    const plotArea = parseInt(document.getElementById("req-plot-area")?.value || "2400", 10);
    const builtArea = parseInt(document.getElementById("req-built-area")?.value || "3200", 10);
    const startDate = document.getElementById("req-start-date")?.value || "2026-05-01";

    const user = window.appStore.getState().currentUser;

    const request = window.appStore.createConstructionRequest({
      customer: {
        id: user.id || "cust_101",
        name: user.name || "Customer",
        email: user.email || "customer@example.com",
        phone: user.phone || "+91 98401 23456",
        city: location
      },
      companyId: comp.id,
      companyName: comp.name,
      projectName: projectName,
      aiDesignId: designId,
      designPrompt: this.currentAiDesign ? this.currentAiDesign.prompt : "Custom modern house",
      plotLocation: location,
      plotSizeSqFt: plotArea,
      builtUpAreaSqFt: builtArea,
      estimatedCostINR: builtArea * comp.baseRatePerSqFt,
      agreedRatePerSqFt: comp.baseRatePerSqFt,
      startDate: startDate
    });

    this.showToast(`Order confirmed with ${comp.name}! Milestone scheduling active.`, "success");
    this.navigateTo("customer-dashboard");
  }

  // --- Contractor Dashboard Progress Update ---
  updateContractorProgress(requestId, newPercent) {
    const percent = parseInt(newPercent, 10);
    window.appStore.updateProjectProgress(requestId, percent);
    this.showToast(`Updated project progress to ${percent}% (Synced to Customer Dashboard)`, "success");
  }

  // --- Filter & Compare Logic ---
  bindExploreFilters() {
    if (window.lucide) window.lucide.createIcons();
  }

  setBuildingTypeFilter(element, type) {
    document.querySelectorAll("#building-type-filters .filter-pill").forEach(p => p.classList.remove("active"));
    if (element) element.classList.add("active");
    this.filterCompanies();
  }

  filterCompanies() {
    const searchVal = (document.getElementById("search-company-input")?.value || "").toLowerCase();
    const activeTypePill = document.querySelector("#building-type-filters .filter-pill.active");
    const typeFilter = activeTypePill ? activeTypePill.getAttribute("data-type") : "All";
    const rateFilter = document.getElementById("rate-filter-select")?.value || "all";
    const ratingFilter = parseFloat(document.getElementById("rating-filter-select")?.value || "0");

    const cards = document.querySelectorAll(".company-card");
    cards.forEach(card => {
      const compId = card.getAttribute("data-comp-id");
      const comp = window.appStore.getCompanyById(compId);
      if (!comp) return;

      const nameMatch = comp.name.toLowerCase().includes(searchVal) || comp.tagline.toLowerCase().includes(searchVal) || comp.location.toLowerCase().includes(searchVal);
      const typeMatch = typeFilter === "All" || comp.buildingTypes.includes(typeFilter);

      let rateMatch = true;
      if (rateFilter === "under-2000") rateMatch = comp.baseRatePerSqFt < 2000;
      else if (rateFilter === "2000-2300") rateMatch = comp.baseRatePerSqFt >= 2000 && comp.baseRatePerSqFt <= 2300;
      else if (rateFilter === "above-2300") rateMatch = comp.baseRatePerSqFt > 2300;

      const ratingMatch = comp.rating >= ratingFilter;

      if (nameMatch && typeMatch && rateMatch && ratingMatch) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  resetFilters() {
    const search = document.getElementById("search-company-input");
    if (search) search.value = "";
    const rate = document.getElementById("rate-filter-select");
    if (rate) rate.value = "all";
    const rating = document.getElementById("rating-filter-select");
    if (rating) rating.value = "0";

    const allPill = document.querySelector('#building-type-filters .filter-pill[data-type="All"]');
    if (allPill) this.setBuildingTypeFilter(allPill, "All");
    else this.filterCompanies();
  }

  toggleCompare(companyId, shouldAdd) {
    if (shouldAdd) {
      if (!this.comparisonList.includes(companyId)) {
        if (this.comparisonList.length >= 4) {
          this.showToast("Maximum 4 companies can be compared simultaneously", "info");
          return;
        }
        this.comparisonList.push(companyId);
        this.showToast("Company added to comparison matrix", "info");
      }
    } else {
      this.comparisonList = this.comparisonList.filter(id => id !== companyId);
      this.showToast("Removed from comparison", "info");
    }
    this.renderCurrentView();
  }

  // --- Electricity Chart Initialization ---
  initElectricityChart() {
    const canvas = document.getElementById("electricity-chart");
    if (!canvas) return;

    const data = window.appStore.getState().electricityData.monthlyHistory;
    const labels = data.map(d => d.month);
    const units = data.map(d => d.unitsKwh);
    const solarUnits = data.map(d => d.solarUnits);

    if (window.Chart) {
      if (this.chartInstance) this.chartInstance.destroy();

      const ctx = canvas.getContext("2d");
      this.chartInstance = new window.Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Grid Consumption (kWh)",
              data: units,
              backgroundColor: "rgba(6, 182, 212, 0.7)",
              borderColor: "#06b6d4",
              borderWidth: 1,
              borderRadius: 6
            },
            {
              label: "Rooftop Solar Generated (kWh)",
              data: solarUnits,
              backgroundColor: "rgba(245, 158, 11, 0.8)",
              borderColor: "#f59e0b",
              borderWidth: 1,
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: "#94a3b8", font: { family: "Plus Jakarta Sans" } }
            }
          },
          scales: {
            x: {
              grid: { color: "rgba(255, 255, 255, 0.05)" },
              ticks: { color: "#94a3b8" }
            },
            y: {
              grid: { color: "rgba(255, 255, 255, 0.05)" },
              ticks: { color: "#94a3b8" }
            }
          }
        }
      });
    }
  }

  applyEnergyRule(tipId) {
    window.appStore.applyEnergySavingRule(tipId);
    this.showToast("Smart Energy Automation Activated! Projected monthly bill updated.", "success");
    this.renderCurrentView();
  }

  // --- Maintenance Actions ---
  markTicketComplete(ticketId) {
    window.appStore.updateMaintenanceTicketStatus(ticketId, "Completed", "Service inspection verified and passed.");
    this.showToast("Service ticket completed & closed!", "success");
    this.renderCurrentView();
  }

  // --- Modals Controller ---
  openModal(htmlContent) {
    const backdrop = document.getElementById("global-modal-backdrop");
    const container = document.getElementById("global-modal-container");
    if (backdrop && container) {
      container.innerHTML = htmlContent;
      backdrop.classList.add("open");
      if (window.lucide) window.lucide.createIcons();
    }
  }

  closeModal() {
    const backdrop = document.getElementById("global-modal-backdrop");
    if (backdrop) backdrop.classList.remove("open");
  }

  showAuthModal(initialTab = "customer") {
    const modalHtml = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 style="font-size: 1.3rem;">Welcome to URBAN AURA</h3>
          <button class="modal-close-btn" onclick="app.closeModal()">&times;</button>
        </div>

        <!-- Role Quick Switcher for Science Expo -->
        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: var(--radius-md); padding: 14px; margin-bottom: 20px; text-align: center;">
          <span style="font-size: 0.78rem; font-weight: 700; color: var(--accent-gold); display: block; margin-bottom: 8px;">
            ✨ SCIENCE EXPO 1-CLICK DEMO ACCOUNTS
          </span>
          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-sm btn-primary" onclick="app.quickLoginAs('customer'); app.closeModal();">
              <i data-lucide="user"></i> Rajesh (Customer)
            </button>
            <button class="btn btn-sm btn-cyan" onclick="app.quickLoginAs('company', 'comp_1'); app.closeModal();">
              <i data-lucide="hard-hat"></i> Apex Infra (Builder)
            </button>
            <button class="btn btn-sm btn-emerald" onclick="app.quickLoginAs('company', 'comp_2'); app.closeModal();">
              <i data-lucide="pencil-ruler"></i> AuraCraft (Architect)
            </button>
          </div>
        </div>

        <div style="display: flex; border-bottom: 1px solid var(--border-subtle); margin-bottom: 20px;">
          <button id="auth-tab-cust" class="btn ${initialTab === 'customer' ? 'btn-primary' : 'btn-secondary'} btn-sm" style="flex:1;" onclick="app.switchAuthTab('customer')">
            Customer Login
          </button>
          <button id="auth-tab-comp" class="btn ${initialTab === 'company' ? 'btn-primary' : 'btn-secondary'} btn-sm" style="flex:1;" onclick="app.switchAuthTab('company')">
            Company Portal Login
          </button>
        </div>

        <form id="auth-form" onsubmit="app.handleAuthSubmit(event)">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" id="auth-email" class="custom-input" value="${initialTab === 'customer' ? 'rajesh.kumar@example.com' : 'contact@apexinfra.in'}" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="auth-password" class="custom-input" value="password123" required>
          </div>
          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 10px;">
            Sign In to Account
          </button>
        </form>
      </div>
    `;
    this.openModal(modalHtml);
  }

  quickLoginAs(role, companyId = null) {
    window.appStore.switchRole(role, companyId);
    this.showToast(`Logged in as ${role === 'customer' ? 'Rajesh Kumar (Customer)' : 'Apex Infra (Builder Portal)'}`, "success");
    if (role === "customer") this.navigateTo("customer-dashboard");
    else this.navigateTo("company-dashboard");
  }

  showProjectModal(companyId, projId) {
    const comp = window.appStore.getCompanyById(companyId);
    if (!comp) return;
    const proj = comp.portfolio.find(p => p.id === projId) || comp.portfolio[0];

    const modalHtml = `
      <div class="modal-dialog modal-dialog-lg">
        <div class="modal-header">
          <div>
            <span class="badge badge-gold" style="margin-bottom: 4px;">${proj.category} • Completed ${proj.completedYear}</span>
            <h3 style="font-size: 1.4rem;">${proj.title}</h3>
          </div>
          <button class="modal-close-btn" onclick="app.closeModal()">&times;</button>
        </div>

        <div style="border-radius: var(--radius-lg); overflow: hidden; height: 340px; margin-bottom: 20px; border: 1px solid var(--glass-border);">
          <img src="${proj.image}" style="width: 100%; height: 100%; object-fit: cover;" alt="${proj.title}">
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; text-align: center;">
          <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: var(--radius-sm);">
            <span style="font-size: 0.72rem; color: var(--text-muted);">Total Area</span>
            <h4 style="color: var(--accent-cyan); font-size: 1rem;">${proj.areaSqFt} sq.ft</h4>
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: var(--radius-sm);">
            <span style="font-size: 0.72rem; color: var(--text-muted);">Budget</span>
            <h4 style="color: var(--accent-emerald); font-size: 1rem;">${proj.budget}</h4>
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: var(--radius-sm);">
            <span style="font-size: 0.72rem; color: var(--text-muted);">Duration</span>
            <h4 style="color: var(--accent-gold); font-size: 1rem;">${proj.duration}</h4>
          </div>
          <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: var(--radius-sm);">
            <span style="font-size: 0.72rem; color: var(--text-muted);">Location</span>
            <h4 style="font-size: 0.85rem;">${proj.location}</h4>
          </div>
        </div>

        <p style="color: var(--text-muted); line-height: 1.6; margin-bottom: 16px;">${proj.description}</p>

        <div style="background: rgba(16, 185, 129, 0.08); border-left: 3px solid var(--accent-emerald); padding: 12px; border-radius: var(--radius-sm); font-size: 0.85rem; margin-bottom: 20px;">
          <strong>Client Testimonial (${proj.clientName}):</strong> "${proj.testimonial}"
        </div>

        <button class="btn btn-primary" style="width: 100%;" onclick="app.closeModal(); app.navigateTo('request', {companyId: '${comp.id}'})">
          <i data-lucide="check"></i> Request Similar Construction Build
        </button>
      </div>
    `;
    this.openModal(modalHtml);
  }

  showAddReviewModal(companyId) {
    const comp = window.appStore.getCompanyById(companyId);
    const modalHtml = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 style="font-size: 1.25rem;">Write a Review for ${comp.name}</h3>
          <button class="modal-close-btn" onclick="app.closeModal()">&times;</button>
        </div>

        <form onsubmit="app.handleAddReview(event, '${companyId}')">
          <div class="form-group">
            <label>Your Name</label>
            <input type="text" id="new-rev-author" class="custom-input" value="Rajesh Kumar" required>
          </div>
          <div class="form-group">
            <label>Star Rating</label>
            <select id="new-rev-rating" class="custom-select">
              <option value="5">★★★★★ (5.0 - Exceptional)</option>
              <option value="4.8">★★★★★ (4.8 - Excellent)</option>
              <option value="4.0">★★★★☆ (4.0 - Good)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Your Construction Experience</label>
            <textarea id="new-rev-comment" class="ai-textarea" style="height: 90px;" placeholder="Describe quality of civil build, finishing, and timeline..." required></textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Post Verified Review</button>
        </form>
      </div>
    `;
    this.openModal(modalHtml);
  }

  handleAddReview(event, companyId) {
    event.preventDefault();
    const author = document.getElementById("new-rev-author")?.value || "Customer";
    const rating = parseFloat(document.getElementById("new-rev-rating")?.value || "5");
    const comment = document.getElementById("new-rev-comment")?.value || "";

    window.appStore.addCompanyReview(companyId, {
      id: "rev_" + Date.now(),
      author,
      role: "Verified Homeowner",
      rating,
      date: "Today",
      verified: true,
      comment,
      aspects: { quality: rating, timeliness: rating, budgetAccuracy: rating, communication: rating }
    });

    this.showToast("Review submitted successfully!", "success");
    this.closeModal();
    this.renderCurrentView();
  }

  showBookMaintenanceModal(category = "Electrical Maintenance", defaultTitle = "") {
    const modalHtml = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 style="font-size: 1.25rem;">Book Maintenance Technician</h3>
          <button class="modal-close-btn" onclick="app.closeModal()">&times;</button>
        </div>

        <form onsubmit="app.handleBookMaintenanceSubmit(event)">
          <div class="form-group">
            <label>Service Category</label>
            <select id="tkt-category" class="custom-select">
              <option value="Electrical Maintenance" ${category === 'Electrical Maintenance' ? 'selected' : ''}>Electrical Maintenance</option>
              <option value="Plumbing & Drainage" ${category.includes('Plumb') ? 'selected' : ''}>Plumbing & Drainage</option>
              <option value="Painting & Waterproofing" ${category.includes('Paint') ? 'selected' : ''}>Painting & Waterproofing</option>
              <option value="Deep Cleaning & Pest Control" ${category.includes('Clean') ? 'selected' : ''}>Deep Cleaning & Sanitation</option>
              <option value="HVAC & Air Conditioning" ${category.includes('HVAC') ? 'selected' : ''}>HVAC Servicing</option>
              <option value="Structural Health & Carpentry" ${category.includes('Struct') ? 'selected' : ''}>Structural Carpentry</option>
            </select>
          </div>
          <div class="form-group">
            <label>Service Requirement Details</label>
            <input type="text" id="tkt-title" class="custom-input" value="${defaultTitle || 'Emergency Circuit Check & Inverter Calibration'}" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Preferred Date Slot</label>
              <input type="date" id="tkt-date" class="custom-input" value="2026-04-10" required>
            </div>
            <div class="form-group">
              <label>Priority</label>
              <select id="tkt-priority" class="custom-select">
                <option value="Normal">Normal (Within 24 Hrs)</option>
                <option value="Urgent" selected>Urgent (Within 2 Hrs)</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Service Address</label>
            <input type="text" id="tkt-address" class="custom-input" value="Plot #42, Bayview Enclave, ECR, Chennai" required>
          </div>
          <button type="submit" class="btn btn-emerald btn-lg" style="width: 100%; margin-top: 10px;">
            <i data-lucide="check-circle"></i> Dispatch Verified Technician
          </button>
        </form>
      </div>
    `;
    this.openModal(modalHtml);
  }

  handleBookMaintenanceSubmit(event) {
    event.preventDefault();
    const category = document.getElementById("tkt-category")?.value;
    const title = document.getElementById("tkt-title")?.value;
    const address = document.getElementById("tkt-address")?.value;

    window.appStore.createMaintenanceTicket({
      category,
      serviceTitle: title,
      address,
      scheduledSlot: "Today, Within 2 Hours",
      status: "Technician Assigned",
      assignedTechnician: "Saravanan Murthy (Certified Master Tech #E-408)",
      notes: "Technician en route with diagnostic tools."
    });

    this.showToast("Technician assigned & dispatch notice sent to your phone!", "success");
    this.closeModal();
    this.navigateTo("maintenance");
  }

  showAddProjectModal(companyId) {
    const modalHtml = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 style="font-size: 1.25rem;">Add Completed Project to Portfolio</h3>
          <button class="modal-close-btn" onclick="app.closeModal()">&times;</button>
        </div>

        <form onsubmit="app.handleAddProjectSubmit(event, '${companyId}')">
          <div class="form-group">
            <label>Project Title</label>
            <input type="text" id="new-proj-title" class="custom-input" placeholder="e.g. Marina Breeze 3-Floor Villa" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Category</label>
              <select id="new-proj-cat" class="custom-select">
                <option value="Villas">Villas</option>
                <option value="Duplex">Duplex</option>
                <option value="Eco-Homes">Eco-Homes</option>
                <option value="Commercial Complexes">Commercial</option>
              </select>
            </div>
            <div class="form-group">
              <label>Area (Sq.Ft)</label>
              <input type="number" id="new-proj-area" class="custom-input" value="3500" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Total Budget</label>
              <input type="text" id="new-proj-budget" class="custom-input" value="₹85 Lakhs" required>
            </div>
            <div class="form-group">
              <label>Duration</label>
              <input type="text" id="new-proj-dur" class="custom-input" value="10 Months" required>
            </div>
          </div>
          <div class="form-group">
            <label>Location</label>
            <input type="text" id="new-proj-loc" class="custom-input" value="Anna Nagar, Chennai" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
            Save to Portfolio
          </button>
        </form>
      </div>
    `;
    this.openModal(modalHtml);
  }

  handleAddProjectSubmit(event, companyId) {
    event.preventDefault();
    const title = document.getElementById("new-proj-title")?.value;
    const category = document.getElementById("new-proj-cat")?.value;
    const area = parseInt(document.getElementById("new-proj-area")?.value || "3000", 10);
    const budget = document.getElementById("new-proj-budget")?.value;
    const duration = document.getElementById("new-proj-dur")?.value;
    const location = document.getElementById("new-proj-loc")?.value;

    window.appStore.addCompanyProject(companyId, {
      id: "proj_" + Date.now(),
      title,
      category,
      location,
      areaSqFt: area,
      budget,
      duration,
      image: "assets/ai_villa.jpg",
      description: "Custom turnkey engineered residence executed with precision.",
      completedYear: "2026",
      clientName: "Private Client",
      testimonial: "Exceptional speed and execution."
    });

    this.showToast("New project added to your company portfolio!", "success");
    this.closeModal();
    this.renderCurrentView();
  }

  showEditProfileModal(companyId) {
    const comp = window.appStore.getCompanyById(companyId);
    const modalHtml = `
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 style="font-size: 1.25rem;">Edit Contractor Profile</h3>
          <button class="modal-close-btn" onclick="app.closeModal()">&times;</button>
        </div>

        <form onsubmit="app.handleEditProfileSubmit(event, '${companyId}')">
          <div class="form-group">
            <label>Tagline / Motto</label>
            <input type="text" id="edit-comp-tagline" class="custom-input" value="${comp.tagline}" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Turnkey Base Rate (₹/sq.ft)</label>
              <input type="number" id="edit-comp-rate" class="custom-input" value="${comp.baseRatePerSqFt}" required>
            </div>
            <div class="form-group">
              <label>Operating Cities</label>
              <input type="text" id="edit-comp-loc" class="custom-input" value="${comp.location}" required>
            </div>
          </div>
          <div class="form-group">
            <label>Description & Bio</label>
            <textarea id="edit-comp-desc" class="ai-textarea" style="height: 80px;">${comp.description}</textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Save Profile Changes</button>
        </form>
      </div>
    `;
    this.openModal(modalHtml);
  }

  handleEditProfileSubmit(event, companyId) {
    event.preventDefault();
    const tagline = document.getElementById("edit-comp-tagline")?.value;
    const rate = parseInt(document.getElementById("edit-comp-rate")?.value || "2200", 10);
    const location = document.getElementById("edit-comp-loc")?.value;
    const desc = document.getElementById("edit-comp-desc")?.value;

    window.appStore.updateCompanyProfile(companyId, {
      tagline,
      baseRatePerSqFt: rate,
      location,
      description: desc
    });

    this.showToast("Profile details updated successfully!", "success");
    this.closeModal();
    this.renderCurrentView();
  }

  // --- Presentation Tour for Science Expo Judges ---
  startPresentationTour() {
    this.tourStep = 1;
    this.showTourStepModal();
  }

  showTourStepModal() {
    const steps = [
      {
        title: "Step 1: Explore & Compare Contractors",
        text: "Judges can browse verified construction firms, filter by building types (Villas, Duplex, Eco-Homes), check pricing per sq.ft, read verified client reviews, and select multiple companies into the live comparison matrix.",
        actionBtn: "Go to Explore Builders",
        actionFn: () => { this.closeModal(); this.navigateTo('explore'); }
      },
      {
        title: "Step 2: AI Architectural Conceptual Studio",
        text: "The flagship innovation! Type or pick any dream house requirement (e.g. '2-floor villa with 3 BHK, glass balconies & solar roof'). The AI generates photorealistic renders, 2D floor plans, and structural estimates in 3 seconds!",
        actionBtn: "Open AI Studio",
        actionFn: () => { this.closeModal(); this.navigateTo('ai-studio'); }
      },
      {
        title: "Step 3: Construction Order & Escrow Milestone Confirmation",
        text: "Attach your AI design, specify plot dimensions, select terms, and send the request to the contractor. Digital contracts and milestone schedules are created seamlessly.",
        actionBtn: "View Request Flow",
        actionFn: () => { this.closeModal(); this.navigateTo('request', { companyId: 'comp_1' }); }
      },
      {
        title: "Step 4: Customer Dashboard & Live Drone Tracking",
        text: "Real-time Gantt tracking from Excavation to Handover. Live progress bar and contractor updates keep the homeowner 100% informed.",
        actionBtn: "Open Customer Dashboard",
        actionFn: () => { this.closeModal(); this.navigateTo('customer-dashboard'); }
      },
      {
        title: "Step 5: Post-Build Smart Electricity & Care",
        text: "After handover, the building connects to IoT Smart Energy monitoring and on-demand maintenance (electrical, plumbing, painting, deep cleaning) with 2-hour SLA.",
        actionBtn: "Open Smart Electricity Dashboard",
        actionFn: () => { this.closeModal(); this.navigateTo('electricity'); }
      },
      {
        title: "Step 6: Construction Company Enterprise Portal",
        text: "Contractors manage incoming leads, update project milestones with live sliders, upload site photos, and manage their portfolio and reviews.",
        actionBtn: "Open Company Dashboard",
        actionFn: () => { this.closeModal(); this.quickLoginAs('company', 'comp_1'); }
      }
    ];

    const current = steps[this.tourStep - 1] || steps[0];

    const modalHtml = `
      <div class="modal-dialog">
        <div class="modal-header">
          <div>
            <span class="badge badge-gold" style="margin-bottom: 4px;">Science Expo Guided Demonstration</span>
            <h3 style="font-size: 1.35rem;">${current.title}</h3>
          </div>
          <button class="modal-close-btn" onclick="app.closeModal()">&times;</button>
        </div>

        <p style="color: var(--text-muted); line-height: 1.6; font-size: 0.95rem; margin-bottom: 24px;">
          ${current.text}
        </p>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
          <span style="font-size: 0.8rem; color: var(--text-dim);">Step ${this.tourStep} of ${steps.length}</span>
          <div style="display: flex; gap: 10px;">
            ${this.tourStep < steps.length ? `
              <button class="btn btn-secondary btn-sm" onclick="app.tourStep++; app.showTourStepModal();">Next Step</button>
            ` : ''}
            <button class="btn btn-primary btn-sm" onclick="(${current.actionFn.toString()})()">
              ${current.actionBtn} <i data-lucide="arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    this.openModal(modalHtml);
  }
}

// Global application bootstrap
window.addEventListener("DOMContentLoaded", () => {
  window.app = new UrbanAuraApp();
  if (window.lucide) window.lucide.createIcons();
});
