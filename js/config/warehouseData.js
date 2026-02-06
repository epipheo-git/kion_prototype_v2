// Warehouse section and asset data configuration

export const COLORS = {
    // Brand colors
    brandRed: 0xc41e3a,

    // Marker colors
    markerBlue: 0x4a90d9,
    markerOrange: 0xe67e22,
    markerRed: 0xc41e3a,

    // Light warehouse palette (matching inspiration reference)
    background: 0x000000,     // Black background
    floor: 0xd8d8d8,          // Light grey floor
    floorLight: 0xe8e8e8,     // Lighter floor areas
    ground: 0xe0e0e0,         // Extended ground

    // Building colors - light grey tones
    wall: 0xf0f0f0,           // Very light grey walls
    wallInner: 0xe8e8e8,      // Inner wall color
    rack: 0xb0b0b0,           // Medium grey racks
    rackLight: 0xc8c8c8,      // Light grey rack shelves

    // Accent colors
    accentYellow: 0xf1c40f,
    accentBlue: 0x3498db,
    accentGreen: 0x4ade80,

    // Box/item colors - neutral greys
    boxLight: 0xd0d0d0,
    boxMedium: 0xb0b0b0,
    boxDark: 0x909090,

    // Equipment colors
    forkliftRed: 0xe30613,    // Linde brand red
    forkliftOrange: 0xe67e22,
    racking: 0x808080,
    pallet: 0xd4c4a8,

    // Floor markings
    floorLine: 0xcccccc,
    floorLineDash: 0xd0d0d0
};

export const SECTIONS = {
    myLinde: {
        id: 'myLinde',
        name: 'myLinde',
        color: COLORS.markerRed,
        position: { x: -50, y: 0, z: 15 },
        markerPosition: { x: -50, y: 10, z: 15 },
        cameraTarget: { x: -50, y: 0, z: 15 },
        cameraZoom: 2.8,
        subAreas: [
            {
                id: 'fleet-management',
                name: 'Fleet Management & Analytics',
                position: { x: -55, y: 0, z: 17 },
                markerPosition: { x: -55, y: 7, z: 17 },
                description: 'Digital fleet management platform for complete visibility and control.',
                features: [
                    'Administration & Driver Management',
                    'Usage Control & PreOp Check',
                    'Fleet Optimization & Utilization',
                    'Service Scheduling'
                ]
            },
            {
                id: 'service-management',
                name: 'Service Management',
                position: { x: -45, y: 0, z: 17 },
                markerPosition: { x: -45, y: 7, z: 17 },
                description: 'Comprehensive maintenance and service management solutions.',
                features: [
                    'Preventive & Predictive Maintenance',
                    'Digital Service Portal',
                    'Real-time Parts Availability',
                    'Automated Reordering'
                ]
            },
            {
                id: 'safety-analytics',
                name: 'Safety Analytics/Guardian',
                position: { x: -50, y: 0, z: 12 },
                markerPosition: { x: -50, y: 7, z: 12 },
                description: 'Advanced safety monitoring and compliance systems.',
                features: [
                    'Linde Safety Guard Proximity Detection',
                    'Automated Speed Zones',
                    'Impact Analysis & Incident Reporting',
                    'Safety Compliance Dashboard'
                ]
            }
        ]
    },

    fullPortfolio: {
        id: 'fullPortfolio',
        name: 'Full Portfolio',
        color: COLORS.markerRed,
        position: { x: 0, y: 0, z: 8 },
        markerPosition: { x: 0, y: 12, z: 8 },
        cameraTarget: { x: 0, y: 0, z: 8 },
        cameraZoom: 1.5,
        subAreas: [
            {
                id: 'pallet-trucks',
                name: 'Pallet Truck',
                position: { x: 17, y: 0, z: -20 },
                markerPosition: { x: 17, y: 5, z: -20 },
                description: 'Versatile pallet trucks designed for efficient horizontal transport across the warehouse floor.',
                features: [
                    'Compact design for tight spaces',
                    'Efficient horizontal transport',
                    'Easy maneuverability',
                    'Low maintenance requirements'
                ]
            },
            {
                id: 'pallet-trucks-rideon',
                name: 'Pallet Truck (Ride-On)',
                position: { x: 32, y: 0, z: -20 },
                markerPosition: { x: 32, y: 5, z: -20 },
                description: 'Ride-on pallet trucks combining speed and comfort for longer transport distances.',
                features: [
                    'Ride-on platform for operator comfort',
                    'Higher transport speed',
                    'Suitable for longer distances',
                    'Robust construction'
                ]
            },
            {
                id: 'tow-tractor',
                name: 'Tow Tractor',
                position: { x: 38, y: 0, z: 24 },
                markerPosition: { x: 38, y: 5, z: 24 },
                description: 'Powerful tow tractors for efficient tugger train operations and internal logistics.',
                features: [
                    'High towing capacity',
                    'Tugger train ready',
                    'Versatile coupling options',
                    'Energy efficient operation'
                ]
            },
            {
                id: 'reach-trucks',
                name: 'Reach Truck',
                position: { x: -28, y: 0, z: -20 },
                markerPosition: { x: -28, y: 8, z: -20 },
                description: 'High-performance reach trucks for efficient storage and retrieval in narrow aisles.',
                features: [
                    'Excellent lift height capability',
                    'Narrow aisle operation',
                    'Precise load handling',
                    'Advanced mast visibility'
                ]
            },
            {
                id: 'turret-truck',
                name: 'Turret Truck',
                position: { x: -13, y: 0, z: -20 },
                markerPosition: { x: -13, y: 10, z: -20 },
                description: 'Very narrow aisle turret trucks maximizing warehouse storage capacity.',
                features: [
                    'Very narrow aisle capability',
                    'Maximum storage density',
                    'High lift heights',
                    'Precise positioning'
                ]
            },
            {
                id: 'pallet-stacker',
                name: 'Pallet Stacker',
                position: { x: 2, y: 0, z: -20 },
                markerPosition: { x: 2, y: 9, z: -20 },
                description: 'Versatile pallet stackers combining lifting capability with compact dimensions.',
                features: [
                    'Compact footprint',
                    'Excellent lift capacity',
                    'Versatile applications',
                    'Easy operation'
                ]
            },
            {
                id: 'order-pickers',
                name: 'Order Picker',
                position: { x: 27, y: 0, z: 3 },
                markerPosition: { x: 27, y: 8, z: 3 },
                description: 'Efficient order picking trucks designed for high-throughput picking operations.',
                features: [
                    'Optimized picking ergonomics',
                    'High throughput capability',
                    'Flexible platform heights',
                    'Integrated safety systems'
                ]
            },
            {
                id: 'counterbalance',
                name: 'Counterbalance Forklift',
                position: { x: 30, y: 0, z: 32 },
                markerPosition: { x: 30, y: 7, z: 32 },
                description: 'Reliable counterbalance forklifts available in electric and internal combustion variants.',
                features: [
                    'Available in electric and IC variants',
                    'Versatile indoor/outdoor use',
                    'Excellent load capacity range',
                    'Proven reliability'
                ]
            },
            {
                id: 'heavy-truck',
                name: 'Heavy Truck',
                position: { x: 45, y: 0, z: 30 },
                markerPosition: { x: 45, y: 8, z: 30 },
                description: 'The Linde heavy truck range delivers outstanding performance for demanding applications.',
                features: [
                    'Powerful performance for heavy-duty applications',
                    'Ergonomic operator compartment for all-day comfort',
                    'Advanced safety features and visibility',
                    'Low total cost of ownership'
                ]
            }
        ]
    },

    automation: {
        id: 'automation',
        name: 'Automation',
        color: COLORS.markerOrange,
        position: { x: -10, y: 0, z: -37 },
        markerPosition: { x: -10, y: 12, z: -37 },
        cameraTarget: { x: -10, y: 0, z: -37 },
        cameraZoom: 2.0,
        subAreas: [
            {
                id: 'p-matic',
                name: 'P-MATIC Tow Tractor',
                position: { x: -18, y: 0, z: -33 },
                markerPosition: { x: -18, y: 6, z: -33 },
                description: 'Automated tow tractor for autonomous tugger train operations. Navigates using natural features without additional infrastructure.',
                features: [
                    'Natural feature navigation',
                    'No infrastructure changes required',
                    'Seamless manual/auto switching',
                    'Multi-sensor safety system'
                ]
            },
            {
                id: 'l-matic',
                name: 'L-MATIC Stacker CB',
                position: { x: -10, y: 0, z: -33 },
                markerPosition: { x: -10, y: 7, z: -33 },
                description: 'Autonomous pallet stacker with advanced sensor technology for efficient warehouse operations.',
                features: [
                    'Autonomous pallet stacking',
                    'Advanced sensor technology',
                    'Natural navigation',
                    'Flexible fleet integration'
                ]
            },
            {
                id: 'r-matic',
                name: 'R-MATIC Reach Truck',
                position: { x: -2, y: 0, z: -33 },
                markerPosition: { x: -2, y: 9, z: -33 },
                description: 'Automated reach truck for autonomous high-rack storage and retrieval operations.',
                features: [
                    'Autonomous high-rack operations',
                    'Precise load positioning',
                    'Geo-navigation technology',
                    'Integrated warehouse management'
                ]
            },
            {
                id: 'k-matic',
                name: 'K-MATIC Turret Truck',
                position: { x: -18, y: 0, z: -41 },
                markerPosition: { x: -18, y: 12, z: -41 },
                description: 'Automated very narrow aisle turret truck for maximum storage density with full automation.',
                features: [
                    'Fully automated VNA operations',
                    'Maximum storage density',
                    'Precision positioning system',
                    '24/7 operation capability'
                ]
            },
            {
                id: 'portfolio-functions',
                name: 'Portfolio Functions',
                position: { x: -10, y: 0, z: -41 },
                markerPosition: { x: -10, y: 6, z: -41 },
                description: 'Comprehensive automation portfolio covering all warehouse functions.',
                features: [
                    'Goods receiving',
                    'Storage and retrieval',
                    'Order picking',
                    'Shipping and dispatch'
                ]
            },
            {
                id: 'workflow-handoffs',
                name: 'Workflow Handoffs',
                position: { x: -2, y: 0, z: -41 },
                markerPosition: { x: -2, y: 6, z: -41 },
                description: 'Seamless integration between automated and manual operations.',
                features: [
                    'Automatic task assignment',
                    'Real-time status tracking',
                    'Human-robot collaboration zones',
                    'Safety interlocking'
                ]
            }
        ]
    },

    energySolutions: {
        id: 'energySolutions',
        name: 'Energy Solutions',
        color: COLORS.accentGreen,
        position: { x: -50, y: 0, z: -37 },
        markerPosition: { x: -50, y: 10, z: -37 },
        cameraTarget: { x: -50, y: 0, z: -37 },
        cameraZoom: 2.5,
        subAreas: [
            {
                id: 'li-ion',
                name: 'Li-ION Battery Technology',
                position: { x: -58, y: 0, z: -31 },
                markerPosition: { x: -58, y: 6, z: -31 },
                description: 'Advanced lithium-ion battery solutions for maximum uptime and efficiency.',
                features: [
                    'Opportunity charging',
                    'Zero maintenance',
                    'Longer lifespan',
                    'Fast charging capability'
                ]
            },
            {
                id: 'lead-acid',
                name: 'Lead-Acid Solutions',
                position: { x: -50, y: 0, z: -31 },
                markerPosition: { x: -50, y: 6, z: -31 },
                description: 'Reliable lead-acid battery solutions for standard duty applications.',
                features: [
                    'Proven technology',
                    'Cost effective',
                    'Wide availability',
                    'Established service network'
                ]
            },
            {
                id: 'fuel-cell',
                name: 'Fuel Cell Technology',
                position: { x: -42, y: 0, z: -31 },
                markerPosition: { x: -42, y: 7, z: -31 },
                description: 'Hydrogen fuel cell solutions for demanding multi-shift operations.',
                features: [
                    'Rapid refueling (under 3 min)',
                    'Consistent power delivery',
                    'Zero emissions',
                    'Multi-shift capability'
                ]
            },
            {
                id: 'linde-chargers',
                name: 'Linde Chargers',
                position: { x: -56, y: 0, z: -43 },
                markerPosition: { x: -56, y: 6, z: -43 },
                description: 'Intelligent charging solutions for optimal battery performance.',
                features: [
                    'Smart charging algorithms',
                    'Energy management',
                    'Fleet charging optimization',
                    'Multiple power options'
                ]
            },
            {
                id: 'energy-storage',
                name: 'Energy Storage',
                position: { x: -44, y: 0, z: -43 },
                markerPosition: { x: -44, y: 8, z: -43 },
                description: 'Large-scale energy storage solutions for sustainable operations.',
                features: [
                    'Grid-scale batteries',
                    'Peak shaving',
                    'Renewable integration',
                    'Energy cost optimization'
                ]
            }
        ]
    },

    expertise: {
        id: 'expertise',
        name: 'Expertise',
        color: COLORS.markerRed,
        position: { x: 40, y: 0, z: -37 },
        markerPosition: { x: 40, y: 14, z: -37 },
        cameraTarget: { x: 40, y: 0, z: -37 },
        cameraZoom: 2.2,
        subAreas: [
            {
                id: 'asrs',
                name: 'AS/RS Systems',
                position: { x: 28, y: 0, z: -37 },
                markerPosition: { x: 28, y: 16, z: -37 },
                description: 'Automated Storage and Retrieval Systems for high-density pallet storage with stacker cranes.',
                features: [
                    'High-bay pallet storage',
                    'Automated stacker cranes',
                    'Real-time inventory tracking',
                    'Maximum vertical space utilization'
                ]
            },
            {
                id: 'miniload',
                name: 'Automated Miniloads',
                position: { x: 40, y: 0, z: -37 },
                markerPosition: { x: 40, y: 14, z: -37 },
                description: 'Compact automated storage for small parts and bins with high-speed retrieval.',
                features: [
                    'Dense bin storage',
                    'High-speed mini cranes',
                    'Integrated conveyor systems',
                    'Goods-to-person picking'
                ]
            },
            {
                id: 'multishuttle',
                name: 'Multishuttle Warehouse',
                position: { x: 52, y: 0, z: -37 },
                markerPosition: { x: 52, y: 14, z: -37 },
                description: 'Multi-level shuttle system for ultra-high throughput and flexible storage.',
                features: [
                    'Multiple shuttle vehicles per level',
                    'Vertical lift integration',
                    'Scalable throughput',
                    'Flexible storage density'
                ]
            }
        ]
    }
};

// Camera positions for different navigation levels
export const CAMERA_POSITIONS = {
    overview: {
        position: { x: 60, y: 50, z: 60 },
        target: { x: 0, y: 0, z: 0 },
        zoom: 1
    }
};

// Animation settings
export const ANIMATION = {
    cameraTransitionDuration: 1200, // ms
    markerPulseDuration: 2000, // ms
    hoverScaleFactor: 1.15,
    easing: 'easeInOutCubic'
};

// Marker settings
export const MARKER_CONFIG = {
    baseRadius: 2,
    height: 0.4,
    segments: 32,
    plusThickness: 0.5,
    plusLength: 1.5,
    hoverGlow: 0.3
};
