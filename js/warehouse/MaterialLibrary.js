import * as THREE from 'three';

export function createMaterials() {
    return {
        // Wall materials (white/near-white for high contrast)
        wall: new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.9, metalness: 0.1 }),
        wallLight: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, metalness: 0.1 }),
        wallInner: new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.8, metalness: 0.1 }),

        // Floor materials (darker grey for strong contrast with white walls)
        floor: new THREE.MeshStandardMaterial({ color: 0xa8a8a8, roughness: 0.9, metalness: 0.1 }),
        floorLight: new THREE.MeshStandardMaterial({ color: 0xb8b8b8, roughness: 0.9 }),
        floorOffice: new THREE.MeshStandardMaterial({ color: 0xb0b0b0, roughness: 0.8 }),

        // Rack materials (medium-light grey)
        rack: new THREE.MeshStandardMaterial({ color: 0xb0b0b0, roughness: 0.7, metalness: 0.2 }),
        rackOrange: new THREE.MeshStandardMaterial({ color: 0xff6600, roughness: 0.5, metalness: 0.3 }),
        rackBlue: new THREE.MeshStandardMaterial({ color: 0x3366cc, roughness: 0.5, metalness: 0.3 }),

        // Box/cargo materials
        boxWhite: new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.9 }),
        boxGrey: new THREE.MeshStandardMaterial({ color: 0xa0a0a0, roughness: 0.9 }),
        boxDark: new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.9 }),
        boxBrown: new THREE.MeshStandardMaterial({ color: 0xc4a882, roughness: 0.9 }),
        boxBlue: new THREE.MeshStandardMaterial({ color: 0x3498db, roughness: 0.7 }),
        boxLight: new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.9 }),
        boxMedium: new THREE.MeshStandardMaterial({ color: 0xb0b0b0, roughness: 0.9 }),

        // Pallet
        pallet: new THREE.MeshStandardMaterial({ color: 0xd4c4a8, roughness: 0.9 }),

        // Forklift materials
        forkliftRed: new THREE.MeshStandardMaterial({ color: 0xe30613, roughness: 0.4, metalness: 0.3 }),
        forkliftDark: new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.5, metalness: 0.3 }),
        forkliftMetal: new THREE.MeshStandardMaterial({ color: 0x505050, roughness: 0.3, metalness: 0.8 }),
        forkliftYellow: new THREE.MeshStandardMaterial({ color: 0xf4b400, roughness: 0.4, metalness: 0.3 }),
        forkliftOrange: new THREE.MeshStandardMaterial({ color: 0xff6600, roughness: 0.4, metalness: 0.3 }),

        // Office/furniture
        desk: new THREE.MeshStandardMaterial({ color: 0x8b7355, roughness: 0.8 }),
        deskWhite: new THREE.MeshStandardMaterial({ color: 0xd0d0d0, roughness: 0.7 }),
        chair: new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.6 }),
        monitor: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3, metalness: 0.5 }),
        screen: new THREE.MeshBasicMaterial({ color: 0x4488cc }),
        server: new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.4, metalness: 0.6 }),

        // Energy/charger
        chargerWhite: new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.7 }),
        chargerGreen: new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.5, emissive: 0x2a8a50, emissiveIntensity: 0.2 }),
        battery: new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5, metalness: 0.4 }),

        // Automation
        automationYellow: new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.5, metalness: 0.2 }),
        conveyor: new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.6, metalness: 0.3 }),
        conveyorBelt: new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 }),
        conveyorFrame: new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.5, metalness: 0.4 }),

        // Glass/windows
        glass: new THREE.MeshStandardMaterial({ color: 0x88ccff, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.4 }),

        // Solar panels
        solarPanel: new THREE.MeshStandardMaterial({ color: 0x1a237e, roughness: 0.3, metalness: 0.7 }),
        solarFrame: new THREE.MeshStandardMaterial({ color: 0xc0c0c0, roughness: 0.4, metalness: 0.8 }),

        // Roof
        roof: new THREE.MeshStandardMaterial({ color: 0xd0d0d0, roughness: 0.9 }),

        // Vehicle
        truckWhite: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 }),
        tire: new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 })
    };
}
