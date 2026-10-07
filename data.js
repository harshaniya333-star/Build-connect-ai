/**
 * URBAN AURA - Initial Mock Database Seed
 * Comprehensive real-world construction ecosystem data
 */

const INITIAL_DATA = {
  // Current user state
  currentUser: {
    id: "cust_101",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    phone: "+91 98401 23456",
    role: "customer", // 'customer' | 'company' | 'guest'
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    city: "Chennai, Tamil Nadu",
    savedDesigns: ["ai_des_1", "ai_des_2"],
    activeOrderId: "req_201"
  },

  // Verified Construction Companies
  companies: [
    {
      id: "comp_1",
      name: "Apex Infra & Smart Builders",
      tagline: "Pioneering Sustainable Luxury & Smart IoT Homes",
      logo: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=200&auto=format&fit=crop&q=80",
      banner: "assets/hero.jpg",
      rating: 4.9,
      reviewCount: 128,
      completedProjectsCount: 84,
      yearsExperience: 16,
      licenseNo: "TN-RERA/CONST/2018/8892",
      isoCertified: "ISO 9001:2015 & IGBC Platinum",
      baseRatePerSqFt: 2150, // in INR
      location: "Chennai & Coimbatore, TN",
      foundedYear: 2010,
      teamSize: "140+ Engineers & Architects",
      phone: "+91 44 2834 9900",
      email: "contact@apexinfra.in",
      website: "www.apexinfra.in",
      specialties: ["Luxury Smart Villas", "Duplex Homes", "Zero-Carbon Eco Buildings", "BIM 3D Engineered Construction"],
      buildingTypes: ["Villas", "Duplex", "Eco-Homes", "Commercial Complexes"],
      description: "Apex Infra & Smart Builders is South India's premier high-tech construction company specializing in smart home automation integration, green building standards, earthquake-resistant framed structures, and fast-track turnkey execution.",
      services: [
        { title: "Turnkey Residential Construction", rate: "₹2,150 - ₹2,850 / sq.ft", desc: "Complete end-to-end civil construction, architectural detailing, structural MEP, and premium finishing." },
        { title: "Smart IoT & Solar Integration", rate: "₹180 - ₹350 / sq.ft", desc: "Integrated smart electricity metering, rooftop solar grid setup, automated lighting, and biometric access control." },
        { title: "Architectural & Interior Design", rate: "₹80 - ₹150 / sq.ft", desc: "3D BIM architectural planning, structural load engineering, and custom modular interior craftsmanship." },
        { title: "Post-Handover Property Maintenance", rate: "Free 3-Yr Comprehensive Warranty", desc: "Dedicated on-demand electrical, plumbing, painting, and structural health checkups." }
      ],
      portfolio: [
        {
          id: "proj_101",
          title: "The Solarium Luxury Villa",
          category: "Villas",
          location: "ECR, Chennai",
          areaSqFt: 3800,
          budget: "₹85 Lakhs",
          duration: "11 Months",
          image: "assets/ai_villa.jpg",
          description: "A cantilevered 2-story luxury villa with triple-height glass facade, infinity pool, automated solar pergola, and 3 master bedrooms with walk-in teak decks.",
          completedYear: "2025",
          clientName: "Dr. Arvind Swaminathan",
          testimonial: "Apex delivered our dream home 2 weeks ahead of schedule. The smart electricity monitor is saving us 45% on monthly power bills!"
        },
        {
          id: "proj_102",
          title: "Verdant Aura Eco-Residency",
          category: "Eco-Homes",
          location: "Coimbatore Foothills",
          areaSqFt: 4200,
          budget: "₹96 Lakhs",
          duration: "14 Months",
          image: "assets/ai_eco.jpg",
          description: "100% off-grid biophilic residential home featuring vertical hydroponic living walls, rainwater harvesting pond, and 10kW rooftop solar power array.",
          completedYear: "2025",
          clientName: "Meenakshi Sundaram",
          testimonial: "Outstanding craftsmanship. The eco-cooling design keeps the house 5 degrees cooler naturally without running air conditioning all day."
        },
        {
          id: "proj_103",
          title: "Zenith Glass Commercial Boutique",
          category: "Commercial Complexes",
          location: "OMR IT Corridor, Chennai",
          areaSqFt: 12500,
          budget: "₹3.2 Crores",
          duration: "18 Months",
          image: "assets/ai_commercial.jpg",
          description: "5-floor LEED Gold certified commercial technology hub with energy-efficient low-E glass facade and automated central HVAC grid.",
          completedYear: "2024",
          clientName: "NexGen Software Labs",
          testimonial: "Apex executed this complex structural glass tower with zero safety compromises. Truly world-class builder."
        }
      ],
      reviews: [
        {
          id: "rev_1",
          author: "Karthik Subramanian",
          role: "Homeowner, ECR Chennai",
          rating: 5,
          date: "15 Jan 2026",
          verified: true,
          comment: "Urban Aura made it effortless to discover and contract Apex Infra. We loved generating our dream house on the AI studio and Apex built it exactly as visualized!",
          aspects: { quality: 5, timeliness: 5, budgetAccuracy: 4.8, communication: 5 }
        },
        {
          id: "rev_2",
          author: "Divya Nambiar",
          role: "Duplex Villa Owner",
          rating: 4.8,
          date: "02 Feb 2026",
          verified: true,
          comment: "From foundation casting to final interior hand-over, every milestone update was uploaded on our dashboard with drone photos. Highly transparent.",
          aspects: { quality: 5, timeliness: 4.8, budgetAccuracy: 4.9, communication: 4.9 }
        }
      ]
    },
    {
      id: "comp_2",
      name: "AuraCraft Luxury Architects & Builders",
      tagline: "Bespoke Contemporary Architecture & Master Craftsmanship",
      logo: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=200&auto=format&fit=crop&q=80",
      banner: "assets/ai_duplex.jpg",
      rating: 4.95,
      reviewCount: 94,
      completedProjectsCount: 62,
      yearsExperience: 14,
      licenseNo: "TN-RERA/ARCH/2019/5512",
      isoCertified: "Council of Architecture & ISO 14001",
      baseRatePerSqFt: 2450,
      location: "Chennai, Madurai & Bangalore",
      foundedYear: 2012,
      teamSize: "95+ Master Architects & Artisans",
      phone: "+91 44 4920 1100",
      email: "hello@auracraft.design",
      website: "www.auracraft.design",
      specialties: ["Contemporary Duplexes", "Minimalist Concrete Homes", "Rooftop Glass Pergolas", "Vastu Compliant Luxury"],
      buildingTypes: ["Duplex", "Villas", "Renovation", "Commercial Complexes"],
      description: "AuraCraft crafts award-winning contemporary residences characterized by seamless indoor-outdoor living, cantilevered concrete textures, ambient LED linear architecture, and bespoke teak finishes.",
      services: [
        { title: "Architect-Led Design & Build", rate: "₹2,450 - ₹3,200 / sq.ft", desc: "Unified architectural blueprints, structural engineering, 3D visualization, and luxury civil execution." },
        { title: "Rooftop Lounges & Glass Pergolas", rate: "₹450 - ₹750 / sq.ft", desc: "Engineered tempered glass sky-decks, weatherproof wooden pergolas, and ambient lighting." },
        { title: "Vastu Harmony & Energy Balancing", rate: "Included with Project", desc: "Scientific Vastu layout optimization without compromising contemporary minimalist aesthetics." }
      ],
      portfolio: [
        {
          id: "proj_201",
          title: "The Horizon Minimalist Duplex",
          category: "Duplex",
          location: "Anna Nagar, Chennai",
          areaSqFt: 3400,
          budget: "₹82 Lakhs",
          duration: "10 Months",
          image: "assets/ai_duplex.jpg",
          description: "Raw textured exposed concrete duplex with expansive terrace glass pergola lounge, recessed warm illumination, and sunken living room.",
          completedYear: "2025",
          clientName: "Siddharth & Priya Varma",
          testimonial: "A masterwork of contemporary design. Every room receives golden natural sunlight and cross-ventilation."
        },
        {
          id: "proj_202",
          title: "Heritage Chettinad Modern Fusion",
          category: "Villas",
          location: "Madurai Enclave",
          areaSqFt: 4600,
          budget: "₹1.15 Crores",
          duration: "15 Months",
          image: "assets/ai_traditional.jpg",
          description: "Traditional sloping clay-tiled roofs paired with modern glass sliding walls, carved Athangudi pillars, and central water courtyard.",
          completedYear: "2024",
          clientName: "Ramanathan Chettiar",
          testimonial: "Preserved our rich architectural roots while providing every state-of-the-art smart amenity. Flawless work."
        }
      ],
      reviews: [
        {
          id: "rev_3",
          author: "Anand Ranganathan",
          role: "Architectural Enthusiast",
          rating: 5,
          date: "28 Jan 2026",
          verified: true,
          comment: "AuraCraft represents the peak of modern building aesthetics. They took our AI conceptual design from Urban Aura and elevated every single corner!",
          aspects: { quality: 5, timeliness: 4.9, budgetAccuracy: 4.8, communication: 5 }
        }
      ]
    },
    {
      id: "comp_3",
      name: "GreenTerra Eco Constructors",
      tagline: "Zero-Carbon, Solar-Powered & Biophilic Green Homes",
      logo: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&auto=format&fit=crop&q=80",
      banner: "assets/ai_eco.jpg",
      rating: 4.85,
      reviewCount: 76,
      completedProjectsCount: 51,
      yearsExperience: 12,
      licenseNo: "TN-RERA/GREEN/2020/3144",
      isoCertified: "IGBC Platinum Certified Green Builder",
      baseRatePerSqFt: 1950,
      location: "Coimbatore, Ooty & Trichy",
      foundedYear: 2014,
      teamSize: "80+ Green Building Specialists",
      phone: "+91 422 6601 445",
      email: "build@greenterra.eco",
      website: "www.greenterra.eco",
      specialties: ["Earth-Friendly Construction", "Solar Net-Zero Homes", "Living Green Walls", "Natural Micro-Climate Cooling"],
      buildingTypes: ["Eco-Homes", "Villas", "Duplex"],
      description: "GreenTerra creates future-proof sustainable habitats using stabilized compressed earth blocks, engineered timber, high-efficiency solar roofs, and natural passive ventilation.",
      services: [
        { title: "Net-Zero Eco Residential Build", rate: "₹1,950 - ₹2,400 / sq.ft", desc: "Energy-efficient thermal brick masonry, passive solar orientation, and non-toxic natural finishes." },
        { title: "Biophilic Landscaping & Living Walls", rate: "₹250 - ₹400 / sq.ft", desc: "Automated drip-irrigated indoor vertical gardens and micro-climate water bodies." },
        { title: "Solar Micro-Grid & Battery Storage", rate: "₹75,000 / kW Installed", desc: "Rooftop tier-1 monocrystalline panels with smart hybrid grid export and app telemetry." }
      ],
      portfolio: [
        {
          id: "proj_301",
          title: "The Forest Haven Sustainable Estate",
          category: "Eco-Homes",
          location: "Nilgiris, Ooty",
          areaSqFt: 3900,
          budget: "₹88 Lakhs",
          duration: "12 Months",
          image: "assets/ai_eco.jpg",
          description: "Timber clad eco-residence with grass roof insulation, 12kW solar rooftop, and automated greywater filtration.",
          completedYear: "2025",
          clientName: "Dr. Vikram & Sharon Paul",
          testimonial: "Our electricity bill is practically zero! GreenTerra delivered our sanctuary with total eco-integrity."
        }
      ],
      reviews: [
        {
          id: "rev_4",
          author: "Sangeetha Krishnan",
          role: "Eco Homestay Host",
          rating: 4.8,
          date: "12 Jan 2026",
          verified: true,
          comment: "GreenTerra is the only builder we found that genuinely cares about sustainability. The building stays naturally cool even during hot summer days.",
          aspects: { quality: 4.9, timeliness: 4.7, budgetAccuracy: 5, communication: 4.8 }
        }
      ]
    },
    {
      id: "comp_4",
      name: "Heritage Craftsmen & Modern Living",
      tagline: "Traditional Architectural Soul with Cutting-Edge Modernity",
      logo: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=200&auto=format&fit=crop&q=80",
      banner: "assets/ai_traditional.jpg",
      rating: 4.88,
      reviewCount: 62,
      completedProjectsCount: 45,
      yearsExperience: 22,
      licenseNo: "TN-RERA/HERITAGE/2016/1029",
      isoCertified: "Traditional Artisans Guild & ISO 9001",
      baseRatePerSqFt: 2200,
      location: "Thanjavur, Chennai & Madurai",
      foundedYear: 2004,
      teamSize: "110+ Wood Artisans & Structural Engineers",
      phone: "+91 4362 230 450",
      email: "info@heritagecraftsmen.com",
      website: "www.heritagecraftsmen.com",
      specialties: ["Courtyard Homes (Mutram)", "Terracotta Tiled Architecture", "Teakwood Joinery", "Modern Plumbing & Electrical"],
      buildingTypes: ["Villas", "Duplex", "Renovation"],
      description: "Masters in blending timeless Dravidian & Kerala classical architecture—featuring open sky courtyards, laterite stone masonry, and timber arches—with smart concealed electrical grids and modern luxury suites.",
      services: [
        { title: "Traditional Heritage Turnkey Construction", rate: "₹2,200 - ₹2,900 / sq.ft", desc: "Authentic clay tile roofing with thermal insulation, carved pillars, and modern concealed MEP." },
        { title: "Heritage Courtyard & Waterbody Design", rate: "₹300 - ₹600 / sq.ft", desc: "Central rain-fed courtyard systems with stone channels, lotus ponds, and brass spout details." }
      ],
      portfolio: [
        {
          id: "proj_401",
          title: "Vasantham Heritage Courtyard Villa",
          category: "Villas",
          location: "Thanjavur Royal Enclave",
          areaSqFt: 4100,
          budget: "₹92 Lakhs",
          duration: "13 Months",
          image: "assets/ai_traditional.jpg",
          description: "Classical sloping terracotta roof villa with open thinnai verandah, carved teak pillars, and central sky-lit mutram courtyard.",
          completedYear: "2024",
          clientName: "Murali Dharan",
          testimonial: "Feels like living in our ancestral palace with all the comforts of a 5-star smart home."
        }
      ],
      reviews: [
        {
          id: "rev_5",
          author: "Venkatesh Iyer",
          role: "Heritage Homeowner",
          rating: 4.9,
          date: "19 Dec 2025",
          verified: true,
          comment: "Authentic woodwork combined with ultra-modern plumbing and electrical layout. Unmatched finishing.",
          aspects: { quality: 5, timeliness: 4.8, budgetAccuracy: 4.9, communication: 4.8 }
        }
      ]
    },
    {
      id: "comp_5",
      name: "Skylark Highrise & Commercials",
      tagline: "Engineering Landmark Commercial Towers & Urban Complexes",
      logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&auto=format&fit=crop&q=80",
      banner: "assets/ai_commercial.jpg",
      rating: 4.82,
      reviewCount: 110,
      completedProjectsCount: 95,
      yearsExperience: 25,
      licenseNo: "TN-RERA/COMM/2015/0074",
      isoCertified: "ISO 9001:2015 & OHSAS 18001",
      baseRatePerSqFt: 1850,
      location: "Chennai, Bangalore & Hyderabad",
      foundedYear: 2001,
      teamSize: "220+ Heavy Structural Engineers",
      phone: "+91 44 6780 9000",
      email: "towers@skylarkinfra.com",
      website: "www.skylarkinfra.com",
      specialties: ["Commercial Glass Towers", "Boutique Corporate Hubs", "Multi-Family Residential Apartments", "Heavy Steel Frameworks"],
      buildingTypes: ["Commercial Complexes", "Villas", "Duplex"],
      description: "Skylark specializes in structural steel, post-tensioned slabs, glass curtain facades, and institutional projects with rapid prefabricated construction techniques.",
      services: [
        { title: "Commercial Complex Construction", rate: "₹1,850 - ₹2,600 / sq.ft", desc: "Structural glass curtain walls, basement multi-level parking, and high-speed elevator shafts." },
        { title: "Corporate Interior & MEP Contracting", rate: "₹450 - ₹900 / sq.ft", desc: "Central chiller HVAC, fire suppression systems, and clean room acoustic insulation." }
      ],
      portfolio: [
        {
          id: "proj_501",
          title: "The Terraces Tech Park",
          category: "Commercial Complexes",
          location: "Guindy Tech Corridor, Chennai",
          areaSqFt: 18500,
          budget: "₹4.8 Crores",
          duration: "20 Months",
          image: "assets/ai_commercial.jpg",
          description: "Step-terraced corporate commercial building with rooftop sky gardens, double glazed curtain walls, and EV charging bays.",
          completedYear: "2025",
          clientName: "CyberPulse Technologies",
          testimonial: "Delivered top notch industrial grade quality within strict budget guidelines."
        }
      ],
      reviews: [
        {
          id: "rev_6",
          author: "Sanjay Singhal",
          role: "Managing Director, CyberPulse",
          rating: 4.8,
          date: "05 Nov 2025",
          verified: true,
          comment: "Skylark’s engineering team managed heavy crane rigging and glass facade installation flawlessly.",
          aspects: { quality: 4.9, timeliness: 4.8, budgetAccuracy: 4.7, communication: 4.8 }
        }
      ]
    },
    {
      id: "comp_6",
      name: "Vertex Urban Developers",
      tagline: "Next-Gen Urban Residences & High-Velocity Smart Homes",
      logo: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&auto=format&fit=crop&q=80",
      banner: "assets/hero.jpg",
      rating: 4.79,
      reviewCount: 54,
      completedProjectsCount: 38,
      yearsExperience: 9,
      licenseNo: "TN-RERA/URBAN/2021/4091",
      isoCertified: "ISO 9001:2015 Registered",
      baseRatePerSqFt: 1890,
      location: "Chennai & Salem",
      foundedYear: 2017,
      teamSize: "60+ Modern Engineers",
      phone: "+91 44 2450 7812",
      email: "sales@vertexurban.com",
      website: "www.vertexurban.com",
      specialties: ["Compact Urban Villas", "Smart Gated Layouts", "Modular Precast Construction", "Fast-Track Delivery"],
      buildingTypes: ["Villas", "Duplex", "Eco-Homes"],
      description: "Specialists in compact modern urban plots, maximizing floor space index (FSI), natural lighting, and delivering projects within 8-10 months.",
      services: [
        { title: "Compact Urban Villa Build", rate: "₹1,890 - ₹2,350 / sq.ft", desc: "Space-optimized duplex living, cantilevered car porches, and modular terrace gardens." }
      ],
      portfolio: [
        {
          id: "proj_601",
          title: "Vertex Skylight Duplex",
          category: "Duplex",
          location: "Velachery, Chennai",
          areaSqFt: 2600,
          budget: "₹58 Lakhs",
          duration: "9 Months",
          image: "assets/ai_villa.jpg",
          description: "Compact 2-story luxury home on a 30x40 urban plot featuring skylight atriums and smart automation.",
          completedYear: "2025",
          clientName: "Deepak Narayanan",
          testimonial: "Unbelievable space optimization on our compact plot. Vertex completed everything on time."
        }
      ],
      reviews: [
        {
          id: "rev_7",
          author: "Geetha Mohan",
          role: "Homeowner",
          rating: 4.8,
          date: "14 Feb 2026",
          verified: true,
          comment: "Transparent milestone billing with no hidden surprises. Highly recommend Vertex!",
          aspects: { quality: 4.8, timeliness: 5, budgetAccuracy: 4.8, communication: 4.7 }
        }
      ]
    }
  ],

  // AI Design Sample Library & Preset Variations
  aiDesignPresets: [
    {
      id: "ai_des_1",
      title: "Zenith Biophilic 2-Floor Eco Villa",
      prompt: "Modern two-floor house with 3 bedrooms, glass balconies, wooden louvers, garden lawn, EV car parking, and rooftop solar pergola.",
      buildingType: "Villas",
      floors: 2,
      bedrooms: 3,
      plotSizeSqFt: 2400,
      builtAreaSqFt: 3200,
      estimatedBudget: "₹72 Lakhs - ₹80 Lakhs",
      style: "Futuristic Modern Biophilic",
      lightingMode: "Daylight Crisp",
      image: "assets/ai_villa.jpg",
      createdAt: "2026-03-10",
      specs: {
        foundation: "Reinforced Concrete Isolated Footing (M25 Grade)",
        walls: "Fly-Ash Eco Bricks with Waterproof Thermal Plaster",
        fenestration: "Double-Glazed Low-E Aluminum Glass Sliders",
        solarCapacity: "5.5 kW Monocrystalline Rooftop System",
        smartFeatures: "IoT Energy Meter, Automated Louvers, Smart Video Intercom",
        estimatedCompletion: "9 - 11 Months"
      }
    },
    {
      id: "ai_des_2",
      title: "Lumina Minimalist Concrete Duplex",
      prompt: "Contemporary luxury duplex with exposed concrete textures, rooftop glass pergola lounge, warm ambient linear LED lights, and sunken courtyard.",
      buildingType: "Duplex",
      floors: 2,
      bedrooms: 4,
      plotSizeSqFt: 2800,
      builtAreaSqFt: 3600,
      estimatedBudget: "₹85 Lakhs - ₹95 Lakhs",
      style: "Minimalist Brutalist Chic",
      lightingMode: "Sunset Golden Hour",
      image: "assets/ai_duplex.jpg",
      createdAt: "2026-03-14",
      specs: {
        foundation: "Raft Foundation with Anti-Termite & Moisture Membrane",
        walls: "Exposed Form-Finished Concrete & AAC Blocks",
        fenestration: "Floor-to-Ceiling Toughened Glass Partitions",
        solarCapacity: "7.0 kW Hybrid Solar & Storage Battery",
        smartFeatures: "Central HVAC Zoning, Smart Mood Lighting, Biometric Locks",
        estimatedCompletion: "10 - 12 Months"
      }
    },
    {
      id: "ai_des_3",
      title: "Solaris Biophilic Green Sanctuary",
      prompt: "100% Sustainable eco-friendly residential home with living vertical garden walls, timber cladding, natural rainwater pond, and massive solar roof.",
      buildingType: "Eco-Homes",
      floors: 2,
      bedrooms: 3,
      plotSizeSqFt: 3200,
      builtAreaSqFt: 3900,
      estimatedBudget: "₹90 Lakhs - ₹1.05 Crores",
      style: "Biophilic Sustainable Eco-Architecture",
      lightingMode: "Daylight Green Glow",
      image: "assets/ai_eco.jpg",
      createdAt: "2026-03-18",
      specs: {
        foundation: "Stabilized Rammed Earth & Concrete Pile Footing",
        walls: "Compressed Stabilized Earth Blocks & Teak Slats",
        fenestration: "Triple Paned Acoustic & Thermal Glass",
        solarCapacity: "10 kW Rooftop Monocrystalline Net-Metering",
        smartFeatures: "Automated Drip Irrigation, Greywater Recycling, Smart Micro-Grid",
        estimatedCompletion: "12 - 14 Months"
      }
    },
    {
      id: "ai_des_4",
      title: "Chettinad-Vedic Contemporary Courtyard",
      prompt: "Traditional fusion South Indian luxury home with clay-tiled sloping roofs, teakwood carved pillars, central mutram courtyard, and modern glass enclosures.",
      buildingType: "Villas",
      floors: 1.5,
      bedrooms: 4,
      plotSizeSqFt: 3600,
      builtAreaSqFt: 4200,
      estimatedBudget: "₹95 Lakhs - ₹1.10 Crores",
      style: "Neo-Traditional Heritage Fusion",
      lightingMode: "Sunlit Morning Glow",
      image: "assets/ai_traditional.jpg",
      createdAt: "2026-03-22",
      specs: {
        foundation: "Laterite Stone & RCC Strip Footing",
        walls: "Exposed Country Clay Bricks with Lime Mortar Finish",
        fenestration: "Burmese Teak Wood Windows & Sliding Glass Doors",
        solarCapacity: "6 kW Rooftop Solar Concealed Tile System",
        smartFeatures: "Smart Rain Sensors, Concealed Energy Grid, Ambient Copper Sconces",
        estimatedCompletion: "12 - 15 Months"
      }
    },
    {
      id: "ai_des_5",
      title: "Aura Prime Glass Commercial Complex",
      prompt: "Modern 5-story glass corporate boutique building with multi-level landscaped terrace gardens, golden hour facade, and smart automated HVAC.",
      buildingType: "Commercial Complexes",
      floors: 5,
      bedrooms: 0,
      plotSizeSqFt: 6000,
      builtAreaSqFt: 15000,
      estimatedBudget: "₹3.5 Crores - ₹4.2 Crores",
      style: "High-Tech Glass & Steel Commercial",
      lightingMode: "Golden Hour Glass Reflection",
      image: "assets/ai_commercial.jpg",
      createdAt: "2026-03-25",
      specs: {
        foundation: "Deep Bored RCC Piles & Heavy Raft Slab",
        walls: "Structural Low-E Unitized Glass Curtain Walls",
        fenestration: "Seismic-Resistant Tempered Double Glazed Panels",
        solarCapacity: "25 kW Commercial Solar Net-Metering",
        smartFeatures: "BMS Central Automation, High-Speed Smart Elevators, Fire Dampers",
        estimatedCompletion: "16 - 18 Months"
      }
    }
  ],

  // Active Construction Requests / Contracts
  constructionRequests: [
    {
      id: "req_201",
      customer: {
        id: "cust_101",
        name: "Rajesh Kumar",
        email: "rajesh.kumar@example.com",
        phone: "+91 98401 23456",
        city: "Chennai, Tamil Nadu"
      },
      companyId: "comp_1",
      companyName: "Apex Infra & Smart Builders",
      projectName: "Kumar Residence - The Solarium 2-Floor Smart Villa",
      aiDesignId: "ai_des_1",
      designPrompt: "Modern two-floor house with 3 bedrooms, glass balconies, wooden louvers, garden lawn, EV car parking, and rooftop solar pergola.",
      plotLocation: "Plot #42, Bayview Enclave, ECR, Chennai",
      plotSizeSqFt: 2400,
      builtUpAreaSqFt: 3200,
      estimatedCostINR: 7680000, // ₹76.8 Lakhs
      agreedRatePerSqFt: 2400,
      status: "In Progress", // 'Requested' | 'Confirmed' | 'In Progress' | 'Completed'
      progressPercent: 68,
      submittedDate: "2025-11-10",
      startDate: "2025-11-20",
      targetHandoverDate: "2026-09-30",
      assignedLeadArchitect: "Er. S. Venkatraman (Apex Chief Structural Eng.)",
      milestones: [
        { id: "m1", title: "Soil Testing & Deep Foundation Casting", status: "Completed", completedDate: "15 Dec 2025", percentWeight: 15, notes: "M25 grade isolated footings cured with anti-moisture barrier.", sitePhoto: "assets/hero.jpg" },
        { id: "m2", title: "Ground & First Floor RCC Superstructure Framework", status: "Completed", completedDate: "28 Jan 2026", percentWeight: 25, notes: "Earthquake-resistant beam & slab casting completed with NABL test pass.", sitePhoto: "assets/ai_villa.jpg" },
        { id: "m3", title: "Eco-Brick Masonry & Electrical/Plumbing Conduiting", status: "Completed", completedDate: "05 Mar 2026", percentWeight: 20, notes: "Concealed 3-phase wiring & CPVC plumbing lines tested at 10 bar pressure.", sitePhoto: "assets/ai_duplex.jpg" },
        { id: "m4", title: "Internal Plastering & Low-E Glass Fenestration", status: "In Progress", completedDate: "Est. 20 Apr 2026", percentWeight: 18, notes: "Double-glazed glass balcony framing and gypsum plastering underway (80% done).", sitePhoto: "assets/ai_villa.jpg" },
        { id: "m5", title: "Solar Rooftop Grid & Smart IoT Meter Installation", status: "Pending", completedDate: "Est. 30 Jun 2026", percentWeight: 12, notes: "5.5kW Tier-1 panels and hybrid inverter installation.", sitePhoto: "assets/ai_eco.jpg" },
        { id: "m6", title: "Premium Flooring, Painting & Final Handover", status: "Pending", completedDate: "Est. 30 Sep 2026", percentWeight: 10, notes: "Italian marble polishing, exterior acrylic weather-coat, key handover.", sitePhoto: "assets/hero.jpg" }
      ],
      specialRequirements: ["Solar Net Metering", "EV Level-2 Fast Charger in Garage", "Rainwater Recharge Well", "Vastu North-East Water Element", "Smart IoT Electricity Panel"]
    }
  ],

  // Smart Electricity IoT Telemetry for the Customer's Home
  electricityData: {
    meterId: "UA-MTR-988421",
    connectionName: "Rajesh Kumar - Smart Residential Connection (3-Phase)",
    tariffCategory: "Domestic LT-1A (Smart Tariff)",
    currentLiveLoadKW: 2.84,
    todayConsumptionKWh: 18.6,
    thisMonthConsumptionKWh: 420.5,
    projectedMonthlyBillINR: 2680,
    lastMonthBillINR: 3450,
    solarGeneratedThisMonthKWh: 215.2,
    solarSavingsINR: 1720,
    gridSharePercent: 54,
    solarSharePercent: 46,
    carbonOffsetKg: 310,
    treesEquivalent: 14,
    hourlyUsage: [
      { time: "00:00", gridKw: 0.8, solarKw: 0.0 },
      { time: "04:00", gridKw: 0.6, solarKw: 0.0 },
      { time: "08:00", gridKw: 2.1, solarKw: 1.2 },
      { time: "11:00", gridKw: 0.9, solarKw: 4.5 },
      { time: "14:00", gridKw: 1.1, solarKw: 5.1 },
      { time: "17:00", gridKw: 2.8, solarKw: 1.8 },
      { time: "20:00", gridKw: 3.4, solarKw: 0.0 },
      { time: "23:00", gridKw: 1.4, solarKw: 0.0 }
    ],
    monthlyHistory: [
      { month: "Oct 2025", unitsKwh: 580, billINR: 4100, solarUnits: 0 },
      { month: "Nov 2025", unitsKwh: 540, billINR: 3820, solarUnits: 0 },
      { month: "Dec 2025", unitsKwh: 490, billINR: 3450, solarUnits: 80 },
      { month: "Jan 2026", unitsKwh: 450, billINR: 2980, solarUnits: 175 },
      { month: "Feb 2026", unitsKwh: 430, billINR: 2810, solarUnits: 195 },
      { month: "Mar 2026 (Live)", unitsKwh: 420, billINR: 2680, solarUnits: 215 }
    ],
    applianceBreakdown: [
      { name: "Inverter ACs (3 Units)", sharePercent: 38, icon: "snowflake", monthlyCostINR: 1018, status: "Optimized" },
      { name: "Smart Water Heater / Geysers", sharePercent: 18, icon: "flame", monthlyCostINR: 482, status: "Eco Scheduled" },
      { name: "EV Car Fast Charger", sharePercent: 16, icon: "zap", monthlyCostINR: 428, status: "Off-Peak Night Charging" },
      { name: "Kitchen Appliances & Refrigerator", sharePercent: 15, icon: "utensils", monthlyCostINR: 402, status: "Normal" },
      { name: "Smart LED Lighting & Fans", sharePercent: 8, icon: "lightbulb", monthlyCostINR: 214, status: "Ultra-Low Power" },
      { name: "Water Pump & Motor", sharePercent: 5, icon: "droplet", monthlyCostINR: 134, status: "Automated Sensor" }
    ],
    aiEnergySavingSuggestions: [
      {
        id: "tip_1",
        title: "Peak Tariff Shift for Water Pump & Geysers",
        savingsEstimate: "Save ~₹420 / month",
        desc: "Automate your water sump pump and heating cycle to run between 11:30 AM - 2:30 PM when your rooftop solar produces 4.8 kW surplus power.",
        actionable: true,
        actionLabel: "Enable Auto Solar Schedule"
      },
      {
        id: "tip_2",
        title: "AC Eco-Inverter Temperature Optimization",
        savingsEstimate: "Save ~₹680 / month",
        desc: "Raising your dual-inverter AC baseline from 21°C to 24°C with smart fan circulation cuts compressor load by 24% without sacrificing comfort.",
        actionable: true,
        actionLabel: "Sync Smart Thermostat (24°C)"
      },
      {
        id: "tip_3",
        title: "EV Night-Time Off-Peak Charging",
        savingsEstimate: "Save ~₹350 / month",
        desc: "Schedule EV charging after 11:00 PM to take advantage of low night tariffs and balance grid peak load.",
        actionable: true,
        actionLabel: "Set 11 PM EV Auto-Charge"
      }
    ]
  },

  // Building Maintenance Services & Active Tickets
  maintenanceServices: [
    {
      id: "srv_elec",
      category: "Electrical Maintenance",
      icon: "zap",
      title: "Smart Electrical & Wiring Audit",
      basePriceINR: 599,
      turnaround: "Within 2 Hours",
      desc: "Diagnosis of MCB trip issues, short-circuit inspection, smart switch retrofitting, inverter backup health check.",
      popular: true
    },
    {
      id: "srv_plumb",
      category: "Plumbing & Drainage",
      icon: "droplet",
      title: "Pressure Leakage & Fixture Repair",
      basePriceINR: 499,
      turnaround: "Within 3 Hours",
      desc: "Concealed pipe sonar leak detection, CPVC pipeline pressure tests, RO water purifier & pressure pump servicing."
    },
    {
      id: "srv_paint",
      category: "Painting & Waterproofing",
      icon: "paint-roller",
      title: "Terrace Waterproofing & Wall Touch-up",
      basePriceINR: 1499,
      turnaround: "Same Day Inspection",
      desc: "Polymer membrane terrace waterproofing, anti-fungal exterior coats, crack injection sealing, luxury emulsion touch-ups."
    },
    {
      id: "srv_clean",
      category: "Deep Cleaning & Pest Control",
      icon: "sparkles",
      title: "Post-Construction Deep Sanitization",
      basePriceINR: 1999,
      turnaround: "Scheduled 4-Hour Service",
      desc: "Industrial vacuuming, marble floor single-disc buffing, glass facade high-pressure jet washing, eco herbal pest control."
    },
    {
      id: "srv_hvac",
      category: "HVAC & Air Conditioning",
      icon: "wind",
      title: "Central & Split AC Foam Jet Service",
      basePriceINR: 799,
      turnaround: "Within 2 Hours",
      desc: "Indoor jet coil cleaning, gas pressure optimization, anti-bacterial filter treatment, condenser coil flush."
    },
    {
      id: "srv_struct",
      category: "Structural Health & Carpentry",
      icon: "hammer",
      title: "Teak Wood Joinery & Structural Health Audit",
      basePriceINR: 899,
      turnaround: "Within 24 Hours",
      desc: "Ultrasonic concrete rebound hammer inspection, teak door alignment, modular hydraulic hinges repair, glass balustrade tightening."
    }
  ],

  // Maintenance Requests History for Customer
  maintenanceTickets: [
    {
      id: "tkt_801",
      category: "Electrical Maintenance",
      serviceTitle: "Smart Switch Panel Calibration & Solar Sync",
      requestedBy: "Rajesh Kumar",
      phone: "+91 98401 23456",
      address: "Plot #42, Bayview Enclave, ECR, Chennai",
      dateRequested: "2026-03-24",
      scheduledSlot: "Tomorrow, 10:00 AM - 12:00 PM",
      priority: "Medium",
      status: "Technician Assigned", // 'Requested' | 'Technician Assigned' | 'In Progress' | 'Completed'
      assignedTechnician: "Saravanan Murthy (Certified Master Electrician - ID #E-408)",
      technicianRating: 4.9,
      costEstimateINR: 599,
      warrantyCovered: true,
      notes: "Living room smart dimmer switch recalibration and check inverter battery electrolyte level."
    },
    {
      id: "tkt_802",
      category: "Painting & Waterproofing",
      serviceTitle: "Balcony Glass Balustrade Sealant Inspection",
      requestedBy: "Rajesh Kumar",
      phone: "+91 98401 23456",
      address: "Plot #42, Bayview Enclave, ECR, Chennai",
      dateRequested: "2026-02-18",
      scheduledSlot: "19 Feb 2026, 02:00 PM",
      priority: "Normal",
      status: "Completed",
      assignedTechnician: "Anbuchelvan (AuraCare Waterproofing Specialist)",
      technicianRating: 5.0,
      costEstimateINR: 0, // Free under 3-Yr Warranty
      warrantyCovered: true,
      notes: "Applied UV-resistant silicone sealant along master bedroom balcony glass joint. 100% weather-sealed."
    }
  ]
};

// Global export for vanilla JS modules
if (typeof window !== "undefined") {
  window.INITIAL_DATA = INITIAL_DATA;
}
