import * as THREE from 'three';
import { getSectionBounds as getLayoutSectionBounds, computeWallSegments, WAREHOUSE_BOUNDS } from '../config/warehouseLayout.js';
import { createMaterials } from './MaterialLibrary.js';
import { LayerManager } from './LayerManager.js';

// Section builders
import { MyLindeBuilder } from './sections/MyLindeBuilder.js';
import { EnergySolutionsBuilder } from './sections/EnergySolutionsBuilder.js';
import { AutomationBuilder } from './sections/AutomationBuilder.js';
import { FullPortfolioBuilder } from './sections/FullPortfolioBuilder.js';
import { ExpertiseBuilder } from './sections/ExpertiseBuilder.js';
import { ExteriorBuilder } from './sections/ExteriorBuilder.js';

// Safety zone definitions — floor overlay areas with hazard types
const SAFETY_ZONES = [
    // Dock approach zones (danger — vehicle/pedestrian conflict)
    { x: 0, z: 36, width: 14, depth: 8, type: 'danger' },
    { x: 18, z: 36, width: 14, depth: 8, type: 'danger' },

    // Main east-west aisles (caution)
    { x: 0, z: 20, width: 60, depth: 4, type: 'caution' },
    { x: 0, z: -5, width: 60, depth: 4, type: 'caution' },

    // Main north-south aisle (caution)
    { x: -5, z: 8, width: 4, depth: 55, type: 'caution' },

    // VNA aisles between racks (danger — narrow)
    { x: -13, z: 3, width: 2, depth: 20, type: 'danger' },
    { x: -5, z: 3, width: 2, depth: 20, type: 'danger' },
    { x: 3, z: 3, width: 2, depth: 20, type: 'danger' },

    // Pedestrian safe zones (near office / myLinde)
    { x: -50, z: 15, width: 20, depth: 14, type: 'safe' },

    // Staging area (caution)
    { x: -38, z: 28, width: 14, depth: 8, type: 'caution' },

    // Order picking zone (safe - lower traffic)
    { x: 35, z: 6, width: 18, depth: 14, type: 'safe' }
];

export class WarehouseBuilder {
    constructor(scene) {
        this.scene = scene;
        this.materials = createMaterials();
        this.warehouseGroup = new THREE.Group();
        this.scene.add(this.warehouseGroup);

        // Track section floors for highlighting
        this.sectionFloors = new Map();
        this.sectionHighlights = new Map();

        // Asset scale factor - makes equipment larger relative to warehouse
        this.assetScale = 1.4;

        // Section builder instances (populated in build())
        this.fullPortfolioBuilder = null;
        this.layerManager = null;
    }

    // Get section floor bounds for highlighting — delegates to warehouseLayout.js
    getSectionBounds(sectionId) {
        return getLayoutSectionBounds(sectionId);
    }

    // Create highlight overlay for a section
    createSectionHighlight(sectionId) {
        const bounds = this.getSectionBounds(sectionId);
        if (!bounds) return null;

        const highlightMaterial = new THREE.MeshBasicMaterial({
            color: 0x4a90d9,  // Blue highlight
            transparent: true,
            opacity: 0,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        const highlight = new THREE.Mesh(
            new THREE.PlaneGeometry(bounds.width, bounds.depth),
            highlightMaterial
        );
        highlight.rotation.x = -Math.PI / 2;
        highlight.position.set(bounds.x, 0.15, bounds.z);  // Raised higher to be clearly visible
        highlight.userData.sectionId = sectionId;
        highlight.renderOrder = 999;  // Render on top
        highlight.visible = false;

        this.warehouseGroup.add(highlight);
        this.sectionHighlights.set(sectionId, highlight);

        return highlight;
    }

    // Initialize all section highlights
    initSectionHighlights() {
        ['myLinde', 'fullPortfolio', 'automation', 'energySolutions', 'expertise'].forEach(id => {
            this.createSectionHighlight(id);
        });
    }

    // Show highlight for a section with animation
    showSectionHighlight(sectionId, color = 0x4a90d9) {
        const highlight = this.sectionHighlights.get(sectionId);
        if (!highlight) return;

        highlight.material.color.setHex(color);
        highlight.visible = true;
        highlight.material.opacity = 0.4;
    }

    // Hide highlight for a section
    hideSectionHighlight(sectionId) {
        const highlight = this.sectionHighlights.get(sectionId);
        if (!highlight) return;

        highlight.visible = false;
        highlight.material.opacity = 0;
    }

    // Hide all highlights
    hideAllHighlights() {
        this.sectionHighlights.forEach((highlight, id) => {
            this.hideSectionHighlight(id);
        });
    }

    build() {
        // Shared infrastructure
        this.createMainFloor();
        this.createCompartmentWalls();

        // Delegate to section builders
        new MyLindeBuilder(this.warehouseGroup, this.materials).build();
        new EnergySolutionsBuilder(this.warehouseGroup, this.materials).build();
        new AutomationBuilder(this.warehouseGroup, this.materials).build();

        this.fullPortfolioBuilder = new FullPortfolioBuilder(this.warehouseGroup, this.materials);
        this.fullPortfolioBuilder.build();

        new ExpertiseBuilder(this.warehouseGroup, this.materials).build();
        new ExteriorBuilder(this.warehouseGroup, this.materials).build();

        // Initialize section highlights (must be after floors are created)
        this.initSectionHighlights();

        // Initialize layer overlays (automation + safety)
        this.layerManager = new LayerManager(this.warehouseGroup, this.materials);
        this.layerManager.initAutomationOverlays(this.fullPortfolioBuilder.getVehicleRefs());
        this.layerManager.initSafetyZones(SAFETY_ZONES);
    }

    createMainFloor() {
        // Main warehouse floor
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(120, 100),
            this.materials.floor
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(0, 0, 0);
        floor.receiveShadow = true;
        this.warehouseGroup.add(floor);

        // Extended ground
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(300, 300),
            new THREE.MeshStandardMaterial({ color: 0xb0b0b0, roughness: 1 })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.02;
        ground.receiveShadow = true;
        this.warehouseGroup.add(ground);
    }

    createCompartmentWalls() {
        const wallHeight = WAREHOUSE_BOUNDS.wallHeight;

        // Generate wall segments from layout data
        const walls = computeWallSegments();
        walls.forEach(w => {
            this.createWall(w.x, w.z, w.width, wallHeight, w.depth, 0);
        });

        // Dock doors (openings in front wall)
        this.createDockDoors();
    }

    createDockDoors() {
        // === DOCKING WALL STRUCTURE ===
        // Create a proper wall section with 2 dock door openings
        const wallHeight = 8;
        const wallThickness = 0.5;
        const doorWidth = 7;
        const doorHeight = 6;
        const doorPositions = [0, 18]; // x positions for 2 dock doors (centered in the opening)

        // Wall sections between and around dock doors
        // Opening in front wall is from x=-35 to x=30 (width 65)
        // We'll create wall sections with door openings

        // Left wall section (from x=-35 to first door)
        const leftWallWidth = 35 + doorPositions[0] - doorWidth/2; // -35 to -3.5
        if (leftWallWidth > 0) {
            this.createWall(-35 + leftWallWidth/2, 40, leftWallWidth, wallHeight, wallThickness, 0);
        }

        // Wall between the two doors
        const betweenStart = doorPositions[0] + doorWidth/2;
        const betweenEnd = doorPositions[1] - doorWidth/2;
        const betweenWidth = betweenEnd - betweenStart;
        if (betweenWidth > 0) {
            this.createWall(betweenStart + betweenWidth/2, 40, betweenWidth, wallHeight, wallThickness, 0);
        }

        // Right wall section (from second door to x=30)
        const rightWallStart = doorPositions[1] + doorWidth/2;
        const rightWallWidth = 30 - rightWallStart;
        if (rightWallWidth > 0) {
            this.createWall(rightWallStart + rightWallWidth/2, 40, rightWallWidth, wallHeight, wallThickness, 0);
        }

        // Create the dock door openings with frames
        doorPositions.forEach((x, index) => {
            // Raised loading dock platform
            const platform = new THREE.Mesh(
                new THREE.BoxGeometry(doorWidth + 2, 1.2, 3),
                this.materials.floor
            );
            platform.position.set(x, 0.6, 41.5);
            platform.castShadow = true;
            this.warehouseGroup.add(platform);

            // Door frame (yellow/orange for visibility)
            const frameThickness = 0.5;

            // Top frame
            const topFrame = new THREE.Mesh(
                new THREE.BoxGeometry(doorWidth + 1, frameThickness, wallThickness + 0.2),
                this.materials.automationYellow
            );
            topFrame.position.set(x, doorHeight + frameThickness/2, 40);
            this.warehouseGroup.add(topFrame);

            // Left frame
            const leftFrame = new THREE.Mesh(
                new THREE.BoxGeometry(frameThickness, doorHeight, wallThickness + 0.2),
                this.materials.automationYellow
            );
            leftFrame.position.set(x - doorWidth/2 - frameThickness/2, doorHeight/2, 40);
            this.warehouseGroup.add(leftFrame);

            // Right frame
            const rightFrame = new THREE.Mesh(
                new THREE.BoxGeometry(frameThickness, doorHeight, wallThickness + 0.2),
                this.materials.automationYellow
            );
            rightFrame.position.set(x + doorWidth/2 + frameThickness/2, doorHeight/2, 40);
            this.warehouseGroup.add(rightFrame);

            // Dock bumpers (rubber stoppers at platform edge)
            const bumperLeft = new THREE.Mesh(
                new THREE.BoxGeometry(0.4, 0.8, 0.5),
                this.materials.forkliftDark
            );
            bumperLeft.position.set(x - 2.5, 1.6, 42.7);
            this.warehouseGroup.add(bumperLeft);

            const bumperRight = new THREE.Mesh(
                new THREE.BoxGeometry(0.4, 0.8, 0.5),
                this.materials.forkliftDark
            );
            bumperRight.position.set(x + 2.5, 1.6, 42.7);
            this.warehouseGroup.add(bumperRight);

            // Dock number sign above door
            this.createDockNumber(x, doorHeight + 1.5, 39.5, index + 1);
        });
    }

    createDockNumber(x, y, z, number) {
        // Simple dock number indicator (small box with number plate)
        const plate = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 0.8, 0.1),
            this.materials.chargerWhite
        );
        plate.position.set(x, y, z);
        this.warehouseGroup.add(plate);
    }

    createLowPartition(x, z, length, rotation) {
        const partition = new THREE.Mesh(
            new THREE.BoxGeometry(length, 1.5, 0.2),
            this.materials.rack
        );
        partition.position.set(x, 0.75, z);
        partition.rotation.y = rotation;
        partition.castShadow = true;
        this.warehouseGroup.add(partition);
    }

    createWall(x, z, width, height, depth, rotation) {
        const wall = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, depth),
            this.materials.wall
        );
        wall.position.set(x, height / 2, z);
        wall.rotation.y = rotation;
        wall.castShadow = true;
        wall.receiveShadow = true;
        this.warehouseGroup.add(wall);
    }

    // Layer toggle pass-through methods
    toggleAutomation() {
        if (this.layerManager) {
            return this.layerManager.toggleAutomation();
        }
        return false;
    }

    toggleSafety() {
        if (this.layerManager) {
            return this.layerManager.toggleSafety();
        }
        return false;
    }

    updateAnimations(time) {
        if (this.fullPortfolioBuilder) {
            this.fullPortfolioBuilder.updateAnimations(time);
        }
        if (this.layerManager) {
            this.layerManager.update(time);
        }
    }

    getWarehouseGroup() {
        return this.warehouseGroup;
    }
}
