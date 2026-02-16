// Warehouse section content and configuration data
// Spatial positions are derived from warehouseLayout.js — the single source of truth.

import {
    SECTION_LAYOUT,
    getSectionMarkerPosition,
    getSectionCameraTarget,
    getSubAreaAbsolutePosition,
    getSubAreaMarkerPosition
} from './warehouseLayout.js';

export { COLORS } from './colors.js';

// Helper to build a section object that derives spatial data from the layout
function defineSection(id, name, color, subAreas) {
    const layout = SECTION_LAYOUT[id];
    return {
        id,
        name,
        color,
        get position() { return { x: layout.origin.x, y: 0, z: layout.origin.z }; },
        get markerPosition() { return getSectionMarkerPosition(id); },
        get cameraTarget() { return getSectionCameraTarget(id); },
        get cameraZoom() { return layout.cameraZoom; },
        subAreas: subAreas.map(sa => ({
            ...sa,
            get position() { return getSubAreaAbsolutePosition(id, sa); },
            get markerPosition() { return getSubAreaMarkerPosition(id, sa); }
        }))
    };
}

export const SECTIONS = {
    myLinde: defineSection('myLinde', 'myLinde', 0xc41e3a, [
        {
            id: 'fleet-management',
            name: 'Fleet Management & Analytics',
            offset: { x: -5, z: 2 },
            markerOffsetY: 7,
            modelType: 'digital',
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
            offset: { x: 5, z: 2 },
            markerOffsetY: 7,
            modelType: 'digital',
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
            offset: { x: 0, z: -3 },
            markerOffsetY: 7,
            modelType: 'digital',
            description: 'Advanced safety monitoring and compliance systems.',
            features: [
                'Linde Safety Guard Proximity Detection',
                'Automated Speed Zones',
                'Impact Analysis & Incident Reporting',
                'Safety Compliance Dashboard'
            ]
        }
    ]),

    fullPortfolio: defineSection('fullPortfolio', 'Full Portfolio', 0xc41e3a, [
        {
            id: 'pallet-trucks',
            name: 'Pallet Truck',
            offset: { x: 17, z: -28 },
            markerOffsetY: 5,
            modelType: 'vehicle',
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
            offset: { x: 32, z: -28 },
            markerOffsetY: 5,
            modelType: 'vehicle',
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
            offset: { x: 38, z: 16 },
            markerOffsetY: 5,
            modelType: 'vehicle',
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
            offset: { x: -28, z: -28 },
            markerOffsetY: 8,
            modelType: 'vehicle',
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
            offset: { x: -13, z: -28 },
            markerOffsetY: 10,
            modelType: 'vehicle',
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
            offset: { x: 2, z: -28 },
            markerOffsetY: 9,
            modelType: 'vehicle',
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
            offset: { x: 27, z: -5 },
            markerOffsetY: 8,
            modelType: 'vehicle',
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
            offset: { x: 30, z: 24 },
            markerOffsetY: 7,
            modelType: 'vehicle',
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
            offset: { x: 45, z: 22 },
            markerOffsetY: 8,
            modelType: 'vehicle',
            description: 'The Linde heavy truck range delivers outstanding performance for demanding applications.',
            features: [
                'Powerful performance for heavy-duty applications',
                'Ergonomic operator compartment for all-day comfort',
                'Advanced safety features and visibility',
                'Low total cost of ownership'
            ]
        }
    ]),

    automation: defineSection('automation', 'Automation', 0xe67e22, [
        {
            id: 'p-matic',
            name: 'P-MATIC Tow Tractor',
            offset: { x: -8, z: 4 },
            markerOffsetY: 6,
            modelType: 'vehicle',
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
            offset: { x: 0, z: 4 },
            markerOffsetY: 7,
            modelType: 'vehicle',
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
            offset: { x: 8, z: 4 },
            markerOffsetY: 9,
            modelType: 'vehicle',
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
            offset: { x: -8, z: -4 },
            markerOffsetY: 12,
            modelType: 'vehicle',
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
            offset: { x: 0, z: -4 },
            markerOffsetY: 6,
            modelType: 'digital',
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
            offset: { x: 8, z: -4 },
            markerOffsetY: 6,
            modelType: 'service',
            description: 'Seamless integration between automated and manual operations.',
            features: [
                'Automatic task assignment',
                'Real-time status tracking',
                'Human-robot collaboration zones',
                'Safety interlocking'
            ]
        }
    ]),

    energySolutions: defineSection('energySolutions', 'Energy Solutions', 0x4ade80, [
        {
            id: 'li-ion',
            name: 'Li-ION Battery Technology',
            offset: { x: -11, z: -9 },
            markerOffsetY: 6,
            modelType: 'energy',
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
            offset: { x: 0, z: -9 },
            markerOffsetY: 6,
            modelType: 'energy',
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
            offset: { x: 11, z: -9 },
            markerOffsetY: 7,
            modelType: 'energy',
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
            offset: { x: -11, z: 2 },
            markerOffsetY: 6,
            modelType: 'energy',
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
            offset: { x: 11, z: 2 },
            markerOffsetY: 8,
            modelType: 'energy',
            description: 'Large-scale energy storage solutions for sustainable operations.',
            features: [
                'Grid-scale batteries',
                'Peak shaving',
                'Renewable integration',
                'Energy cost optimization'
            ]
        }
    ]),

    expertise: defineSection('expertise', 'Expertise', 0xc41e3a, [
        {
            id: 'asrs',
            name: 'AS/RS Systems',
            offset: { x: -12, z: 0 },
            markerOffsetY: 16,
            modelType: 'vehicle',
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
            offset: { x: 0, z: 0 },
            markerOffsetY: 14,
            modelType: 'vehicle',
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
            offset: { x: 12, z: 0 },
            markerOffsetY: 14,
            modelType: 'vehicle',
            description: 'Multi-level shuttle system for ultra-high throughput and flexible storage.',
            features: [
                'Multiple shuttle vehicles per level',
                'Vertical lift integration',
                'Scalable throughput',
                'Flexible storage density'
            ]
        }
    ])
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
