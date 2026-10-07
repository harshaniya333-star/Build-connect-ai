/**
 * URBAN AURA - AI Architectural Conceptual Design Studio Engine
 * Generates conceptual visualizations, 2D floor plan schematics, and structural bill of estimates
 */

class AiDesignEngine {
  constructor() {
    this.styleVisualMap = {
      "Modern Luxury Villa": {
        day: "assets/ai_villa.jpg",
        dusk: "assets/hero.jpg",
        night: "assets/hero.jpg",
        category: "Villas",
        costPerSqFt: 2250,
        materials: "Low-E Aluminum Glazing, Exposed Concrete, Warm Teak Siding, Granite Cobbles",
        tag: "Cantilevered Biophilic Villa"
      },
      "Minimalist Duplex": {
        day: "assets/ai_duplex.jpg",
        dusk: "assets/ai_duplex.jpg",
        night: "assets/hero.jpg",
        category: "Duplex",
        costPerSqFt: 2400,
        materials: "Form-finished Board Concrete, Glass Pergola, Matte Steel Beams, Recessed LED Strips",
        tag: "Contemporary Sky Lounge Duplex"
      },
      "Eco Biophilic Solar Home": {
        day: "assets/ai_eco.jpg",
        dusk: "assets/ai_eco.jpg",
        night: "assets/ai_eco.jpg",
        category: "Eco-Homes",
        costPerSqFt: 2050,
        materials: "Stabilized Earth Blocks, Monocrystalline Solar Roof, Timber Battens, Vertical Hydroponics",
        tag: "Zero-Carbon Biophilic Habitat"
      },
      "Traditional Fusion Courtyard": {
        day: "assets/ai_traditional.jpg",
        dusk: "assets/ai_traditional.jpg",
        night: "assets/ai_traditional.jpg",
        category: "Villas",
        costPerSqFt: 2300,
        materials: "Terracotta Clay Roofing, Carved Burmese Teak Pillars, Laterite Stone, Lime Wash",
        tag: "Chettinad-Vedic Sky Courtyard"
      },
      "Glass Commercial Boutique": {
        day: "assets/ai_commercial.jpg",
        dusk: "assets/ai_commercial.jpg",
        night: "assets/ai_commercial.jpg",
        category: "Commercial Complexes",
        costPerSqFt: 2600,
        materials: "Structural Unitized Curtain Glass, Heavy Flanged Steel, Step Terraces, BMS Sensors",
        tag: "LEED Gold Commercial Hub"
      }
    };
  }

  /**
   * Analyze Natural Language Prompt and Form Inputs
   */
  synthesizeDesign(params) {
    const { prompt = "", buildingType = "Villas", floors = 2, plotAreaSqFt = 2400, style = "Modern Luxury Villa", lightingMode = "day" } = params;

    const lowerPrompt = prompt.toLowerCase();

    // Determine building category & style match
    let matchedStyle = style;
    if (lowerPrompt.includes("eco") || lowerPrompt.includes("sustainable") || lowerPrompt.includes("garden") || lowerPrompt.includes("green") || lowerPrompt.includes("solar")) {
      matchedStyle = "Eco Biophilic Solar Home";
    } else if (lowerPrompt.includes("traditional") || lowerPrompt.includes("chettinad") || lowerPrompt.includes("kerala") || lowerPrompt.includes("courtyard") || lowerPrompt.includes("mutram")) {
      matchedStyle = "Traditional Fusion Courtyard";
    } else if (lowerPrompt.includes("commercial") || lowerPrompt.includes("office") || lowerPrompt.includes("tech") || lowerPrompt.includes("tower")) {
      matchedStyle = "Glass Commercial Boutique";
    } else if (lowerPrompt.includes("duplex") || lowerPrompt.includes("terrace") || lowerPrompt.includes("minimalist")) {
      matchedStyle = "Minimalist Duplex";
    } else if (lowerPrompt.includes("villa") || lowerPrompt.includes("luxury") || lowerPrompt.includes("pool")) {
      matchedStyle = "Modern Luxury Villa";
    }

    const styleMeta = this.styleVisualMap[matchedStyle] || this.styleVisualMap["Modern Luxury Villa"];

    // Select visual based on lighting mode
    const activeImage = styleMeta[lightingMode] || styleMeta.day;

    // Calculate built-up area and estimate
    const fsiFactor = floors === 1 ? 0.75 : floors === 2 ? 1.35 : floors === 3 ? 1.9 : 2.6;
    const builtAreaSqFt = Math.round(plotAreaSqFt * fsiFactor);

    // Extract bedrooms if mentioned in prompt
    let bedrooms = 3;
    const bhkMatch = lowerPrompt.match(/(\d+)\s*(bhk|bedroom|bed)/);
    if (bhkMatch) {
      bedrooms = parseInt(bhkMatch[1], 10);
    } else if (floors >= 3) {
      bedrooms = 4 + (floors - 2);
    }

    const baseCost = builtAreaSqFt * styleMeta.costPerSqFt;
    const minBudgetLakhs = (baseCost * 0.95 / 100000).toFixed(1);
    const maxBudgetLakhs = (baseCost * 1.12 / 100000).toFixed(1);

    // Dynamic specs
    const solarKw = (builtAreaSqFt / 550).toFixed(1);
    const concreteBags = Math.round(builtAreaSqFt * 0.45);
    const steelTons = (builtAreaSqFt * 0.0038).toFixed(1);
    const completionMonths = Math.max(7, Math.round(floors * 4 + (builtAreaSqFt / 1200)));

    const result = {
      id: "ai_gen_" + Date.now(),
      title: `${matchedStyle} (${bedrooms > 0 ? bedrooms + "BHK " : ""}${floors}-Floor Concept)`,
      prompt: prompt || `Modern ${floors}-floor ${matchedStyle} with customized architectural layout.`,
      buildingType: styleMeta.category,
      style: matchedStyle,
      floors: Number(floors),
      bedrooms: bedrooms,
      plotSizeSqFt: Number(plotAreaSqFt),
      builtAreaSqFt: builtAreaSqFt,
      estimatedBudget: `₹${minBudgetLakhs} Lakhs - ₹${maxBudgetLakhs} Lakhs`,
      estimatedCostRawINR: Math.round(baseCost),
      lightingMode: lightingMode,
      image: activeImage,
      createdAt: new Date().toISOString().split("T")[0],
      specs: {
        foundation: floors > 2 ? "Deep Pile Foundation + Raft Beams (M30 RCC)" : "Reinforced Isolated Column Footings (M25 RCC)",
        walls: matchedStyle.includes("Eco") ? "Stabilized Compressed Earth Blocks + Thermal Gypsum" : "High-Density Autoclaved Aerated (AAC) Eco Bricks",
        fenestration: "Double-Glazed Low-E Thermal Break Aluminum Sliders",
        materials: styleMeta.materials,
        solarCapacity: `${solarKw} kW Monocrystalline Solar Array`,
        smartFeatures: "Central Smart IoT Sub-metering, Automated Pergola Shades, Biometric Security",
        estimatedCompletion: `${completionMonths} - ${completionMonths + 2} Months`,
        structuralMetrics: {
          cementEstimate: `${concreteBags} Bags (Ultratech/ACC)`,
          steelTMT: `${steelTons} Metric Tons (Fe 550D TMT)`,
          energyEfficiencyRating: "5-Star BEE / IGBC Platinum Certified",
          carbonReduction: `${Math.round(builtAreaSqFt * 0.12)} Kg CO₂/year saved`
        }
      }
    };

    return result;
  }

  /**
   * Render 2D Floor Plan Schematic Blueprint on HTML5 Canvas
   */
  drawFloorPlan(canvas, design) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Reset & background
    ctx.clearRect(0, 0, width, height);

    // Dark architectural blueprint grid background
    ctx.fillStyle = "#0c1427";
    ctx.fillRect(0, 0, width, height);

    // Draw blueprint grid lines
    ctx.strokeStyle = "rgba(14, 165, 233, 0.12)";
    ctx.lineWidth = 1;
    const gridSize = 24;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Outer Plot Boundary
    const margin = 35;
    const plotW = width - margin * 2;
    const plotH = height - margin * 2;

    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(margin, margin, plotW, plotH);

    // Dimension labels
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`${design.plotSizeSqFt} SQ.FT TOTAL PLOT • LEVEL 01 SCHEMATIC`, width / 2, margin - 12);
    ctx.fillText(`◄── FRONT ROADWAY (NORTH FACING) ──►`, width / 2, height - 12);

    // Room Layout Blocks
    const rooms = [
      { name: "Living & Foyer", dim: "18' x 22'", x: margin + 15, y: margin + 15, w: plotW * 0.48, h: plotH * 0.44, color: "rgba(56, 189, 248, 0.12)", border: "#38bdf8" },
      { name: "Master Suite 01", dim: "16' x 16'", x: margin + plotW * 0.52, y: margin + 15, w: plotW * 0.45, h: plotH * 0.44, color: "rgba(168, 85, 247, 0.12)", border: "#a855f7" },
      { name: "Modular Kitchen", dim: "12' x 14'", x: margin + 15, y: margin + plotH * 0.48, w: plotW * 0.32, h: plotH * 0.32, color: "rgba(245, 158, 11, 0.12)", border: "#f59e0b" },
      { name: "Dining & Courtyard", dim: "14' x 14'", x: margin + plotW * 0.35, y: margin + plotH * 0.48, w: plotW * 0.30, h: plotH * 0.32, color: "rgba(16, 185, 129, 0.12)", border: "#10b981" },
      { name: "Guest Bedroom 02", dim: "14' x 15'", x: margin + plotW * 0.67, y: margin + plotH * 0.48, w: plotW * 0.30, h: plotH * 0.32, color: "rgba(236, 72, 153, 0.12)", border: "#ec4899" },
      { name: "Car Porch & EV Bay", dim: "14' x 18'", x: margin + 15, y: margin + plotH * 0.82, w: plotW * 0.48, h: plotH * 0.16, color: "rgba(6, 182, 212, 0.15)", border: "#06b6d4" },
      { name: "Verandah / Lawn", dim: "18' x 10'", x: margin + plotW * 0.52, y: margin + plotH * 0.82, w: plotW * 0.45, h: plotH * 0.16, color: "rgba(34, 197, 94, 0.15)", border: "#22c55e" }
    ];

    rooms.forEach(r => {
      // Room rect fill
      ctx.fillStyle = r.color;
      ctx.fillRect(r.x, r.y, r.w, r.h);

      // Room border
      ctx.strokeStyle = r.border;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(r.x, r.y, r.w, r.h);

      // Room Title
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px Outfit, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(r.name, r.x + r.w / 2, r.y + r.h / 2 - 4);

      // Dimensions
      ctx.fillStyle = "#94a3b8";
      ctx.font = "9px 'Plus Jakarta Sans', monospace";
      ctx.fillText(r.dim, r.x + r.w / 2, r.y + r.h / 2 + 10);
    });

    // Compass North Indicator
    const compassX = width - 45;
    const compassY = 45;
    ctx.save();
    ctx.translate(compassX, compassY);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(4, 2);
    ctx.lineTo(-4, 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 9px Outfit, sans-serif";
    ctx.fillText("N", 0, -15);
    ctx.restore();
  }
}

// Global AI Engine instance
window.aiEngine = new AiDesignEngine();
