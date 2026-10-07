/**
 * URBAN AURA - State Store & Reactive Persistence Layer
 * Handles LocalStorage sync, state subscriptions, and business actions
 */

class Store {
  constructor() {
    this.STORAGE_KEY = "urban_aura_app_state_v1";
    this.listeners = [];
    this.state = this.loadState();
  }

  loadState() {
    try {
      const cached = localStorage.getItem(this.STORAGE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.warn("Could not load from localStorage, seeding initial data", e);
    }
    // Deep clone initial data
    const initial = JSON.parse(JSON.stringify(window.INITIAL_DATA || {}));
    this.saveState(initial);
    return initial;
  }

  saveState(state) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  }

  setState(updater) {
    const newState = typeof updater === "function" ? updater(this.state) : { ...this.state, ...updater };
    this.state = newState;
    this.saveState(this.state);
    this.notify();
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (e) {
        console.error("Error in store subscriber:", e);
      }
    }
  }

  resetDemoData() {
    const initial = JSON.parse(JSON.stringify(window.INITIAL_DATA || {}));
    this.setState(() => initial);
  }

  // --- Auth & Role Switcher Actions ---
  login(userObj) {
    this.setState(state => ({
      ...state,
      currentUser: userObj
    }));
  }

  logout() {
    this.setState(state => ({
      ...state,
      currentUser: {
        id: "guest",
        name: "Guest User",
        email: "",
        role: "guest",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
      }
    }));
  }

  switchRole(role, specificId = null) {
    if (role === "customer") {
      this.setState(state => ({
        ...state,
        currentUser: {
          id: "cust_101",
          name: "Rajesh Kumar",
          email: "rajesh.kumar@example.com",
          phone: "+91 98401 23456",
          role: "customer",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          city: "Chennai, Tamil Nadu",
          savedDesigns: ["ai_des_1", "ai_des_2"],
          activeOrderId: "req_201"
        }
      }));
    } else if (role === "company") {
      const companyId = specificId || "comp_1";
      const comp = this.state.companies.find(c => c.id === companyId) || this.state.companies[0];
      this.setState(state => ({
        ...state,
        currentUser: {
          id: comp.id,
          name: comp.name,
          email: comp.email,
          phone: comp.phone,
          role: "company",
          avatar: comp.logo,
          companyId: comp.id,
          city: comp.location
        }
      }));
    } else {
      this.logout();
    }
  }

  // --- Companies & Reviews ---
  getCompanyById(id) {
    return this.state.companies.find(c => c.id === id);
  }

  addCompanyReview(companyId, review) {
    this.setState(state => {
      const companies = state.companies.map(comp => {
        if (comp.id === companyId) {
          const newReviews = [review, ...comp.reviews];
          const totalRating = newReviews.reduce((sum, r) => sum + r.rating, 0);
          const newAvg = +(totalRating / newReviews.length).toFixed(2);
          return {
            ...comp,
            rating: newAvg,
            reviewCount: comp.reviewCount + 1,
            reviews: newReviews
          };
        }
        return comp;
      });
      return { ...state, companies };
    });
  }

  updateCompanyProfile(companyId, updateData) {
    this.setState(state => ({
      ...state,
      companies: state.companies.map(comp => comp.id === companyId ? { ...comp, ...updateData } : comp)
    }));
  }

  addCompanyProject(companyId, project) {
    this.setState(state => ({
      ...state,
      companies: state.companies.map(comp => {
        if (comp.id === companyId) {
          return {
            ...comp,
            completedProjectsCount: comp.completedProjectsCount + 1,
            portfolio: [project, ...comp.portfolio]
          };
        }
        return comp;
      })
    }));
  }

  // --- AI Designs ---
  saveAiDesign(design) {
    this.setState(state => {
      const existing = state.aiDesignPresets.find(d => d.id === design.id);
      const updatedPresets = existing
        ? state.aiDesignPresets.map(d => d.id === design.id ? design : d)
        : [design, ...state.aiDesignPresets];

      const currentCust = state.currentUser.role === "customer" ? state.currentUser : null;
      let updatedUser = state.currentUser;
      if (currentCust) {
        const saved = Array.from(new Set([design.id, ...(currentCust.savedDesigns || [])]));
        updatedUser = { ...currentCust, savedDesigns: saved };
      }

      return {
        ...state,
        currentUser: updatedUser,
        aiDesignPresets: updatedPresets
      };
    });
  }

  getAiDesignById(id) {
    return this.state.aiDesignPresets.find(d => d.id === id);
  }

  // --- Construction Requests & Orders ---
  createConstructionRequest(requestData) {
    const newRequest = {
      id: "req_" + Date.now(),
      submittedDate: new Date().toISOString().split("T")[0],
      status: "Requested",
      progressPercent: 0,
      milestones: [
        { id: "m1", title: "Soil Testing & Deep Foundation Casting", status: "Pending", completedDate: "Pending", percentWeight: 15, notes: "Site survey, soil core extraction, structural footing.", sitePhoto: "assets/hero.jpg" },
        { id: "m2", title: "Ground & First Floor Superstructure Framework", status: "Pending", completedDate: "Pending", percentWeight: 25, notes: "RCC columns, beams, floor slabs.", sitePhoto: "assets/ai_villa.jpg" },
        { id: "m3", title: "Brick Masonry & Electrical/Plumbing Conduiting", status: "Pending", completedDate: "Pending", percentWeight: 20, notes: "High strength thermal blocks & piping.", sitePhoto: "assets/ai_duplex.jpg" },
        { id: "m4", title: "Internal Plastering & Low-E Glass Fenestration", status: "Pending", completedDate: "Pending", percentWeight: 18, notes: "Smooth gypsum finish, aluminum frames.", sitePhoto: "assets/ai_villa.jpg" },
        { id: "m5", title: "Solar Rooftop Grid & Smart IoT Meter Installation", status: "Pending", completedDate: "Pending", percentWeight: 12, notes: "Monocrystalline panels & IoT meter.", sitePhoto: "assets/ai_eco.jpg" },
        { id: "m6", title: "Premium Flooring, Painting & Final Handover", status: "Pending", completedDate: "Pending", percentWeight: 10, notes: "Italian marble, fixtures, key handover.", sitePhoto: "assets/hero.jpg" }
      ],
      ...requestData
    };

    this.setState(state => {
      const currentCust = state.currentUser.role === "customer" ? state.currentUser : null;
      let updatedUser = state.currentUser;
      if (currentCust) {
        updatedUser = { ...currentCust, activeOrderId: newRequest.id };
      }

      return {
        ...state,
        currentUser: updatedUser,
        constructionRequests: [newRequest, ...state.constructionRequests]
      };
    });

    return newRequest;
  }

  updateRequestStatus(requestId, newStatus, additionalFields = {}) {
    this.setState(state => ({
      ...state,
      constructionRequests: state.constructionRequests.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            status: newStatus,
            ...additionalFields
          };
        }
        return req;
      })
    }));
  }

  updateProjectProgress(requestId, progressPercent, milestoneUpdates = []) {
    this.setState(state => ({
      ...state,
      constructionRequests: state.constructionRequests.map(req => {
        if (req.id === requestId) {
          let updatedMilestones = req.milestones;
          if (milestoneUpdates.length > 0) {
            updatedMilestones = milestoneUpdates;
          }
          return {
            ...req,
            progressPercent,
            milestones: updatedMilestones
          };
        }
        return req;
      })
    }));
  }

  // --- Maintenance Service Tickets ---
  createMaintenanceTicket(ticketData) {
    const newTicket = {
      id: "tkt_" + Math.floor(1000 + Math.random() * 9000),
      dateRequested: new Date().toISOString().split("T")[0],
      status: "Requested",
      assignedTechnician: "Assigning nearest verified engineer...",
      technicianRating: 4.9,
      warrantyCovered: true,
      ...ticketData
    };

    this.setState(state => ({
      ...state,
      maintenanceTickets: [newTicket, ...state.maintenanceTickets]
    }));

    return newTicket;
  }

  updateMaintenanceTicketStatus(ticketId, status, notes = null) {
    this.setState(state => ({
      ...state,
      maintenanceTickets: state.maintenanceTickets.map(tkt => {
        if (tkt.id === ticketId) {
          return {
            ...tkt,
            status,
            ...(notes ? { notes } : {})
          };
        }
        return tkt;
      })
    }));
  }

  // --- Electricity Telemetry Toggles ---
  applyEnergySavingRule(tipId) {
    this.setState(state => {
      const elec = { ...state.electricityData };
      elec.projectedMonthlyBillINR = Math.max(1200, elec.projectedMonthlyBillINR - 350);
      elec.solarSavingsINR += 350;
      elec.solarSharePercent = Math.min(85, elec.solarSharePercent + 8);
      elec.gridSharePercent = 100 - elec.solarSharePercent;
      elec.carbonOffsetKg += 45;
      elec.treesEquivalent += 2;

      return {
        ...state,
        electricityData: elec
      };
    });
  }
}

// Global instance
window.appStore = new Store();
