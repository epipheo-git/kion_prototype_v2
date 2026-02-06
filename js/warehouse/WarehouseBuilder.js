import * as THREE from 'three';
import { COLORS } from '../config/warehouseData.js';

export class WarehouseBuilder {
    constructor(scene) {
        this.scene = scene;
        this.materials = this.createMaterials();
        this.warehouseGroup = new THREE.Group();
        this.scene.add(this.warehouseGroup);

        // Track section floors for highlighting
        this.sectionFloors = new Map();
        this.sectionHighlights = new Map();

        // Asset scale factor - makes equipment larger relative to warehouse
        this.assetScale = 1.4;
    }

    // Get section floor bounds for highlighting (matched to wall boundaries)
    getSectionBounds(sectionId) {
        const bounds = {
            // myLinde: Left wall x=-65, Right divider x=-35, Back z=5, Front ~z=25
            myLinde: { x: -50, z: 15, width: 30, depth: 20 },

            // Full Portfolio: Left divider x=-35, Right wall x=60, Back z=-24, Front z=40
            fullPortfolio: { x: 12.5, z: 8, width: 95, depth: 64 },

            // Automation: Left divider x=-35, Right divider x=20, Back z=-50, Front z=-24
            automation: { x: -7.5, z: -37, width: 55, depth: 26 },

            // Energy Solutions: Left wall x=-65, Right divider x=-35, Back z=-50, Front z=-24
            energySolutions: { x: -50, z: -37, width: 30, depth: 26 },

            // Expertise: Left divider x=20, Right wall x=60, Back z=-50, Front z=-24
            expertise: { x: 40, z: -37, width: 40, depth: 26 }
        };
        return bounds[sectionId] || null;
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

    createMaterials() {
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

    build() {
        this.createMainFloor();
        this.createCompartmentWalls();
        this.createMyLindeSection();
        this.createEnergySolutionsSection();
        this.createAutomationSection();
        this.createFullPortfolioSection();
        this.createExpertiseSection();
        this.createExteriorElements();

        // Initialize section highlights (must be after floors are created)
        this.initSectionHighlights();
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
        const wallHeight = 8;
        const wallThickness = 0.4;

        // === MAIN WAREHOUSE ENCLOSURE ===
        // Creates a cohesive building that contains all sections

        // Back wall (full length, from left edge to right edge)
        // At z=-50, spans x: -65 to 60 (width 125)
        this.createWall(-2.5, -50, 125, wallHeight, wallThickness, 0);

        // Left wall (from back wall to front wall)
        // At x=-65, spans z: -50 to 40 (depth 90)
        this.createWall(-65, -5, wallThickness, wallHeight, 90, 0);

        // Front wall (separates interior from docking bay)
        // Left section: x from -65 to -35 (width 30)
        this.createWall(-50, 40, 30, wallHeight, wallThickness, 0);
        // Right section: x from 30 to 60 (width 30)
        this.createWall(45, 40, 30, wallHeight, wallThickness, 0);

        // Right wall (from back wall to front wall)
        // At x=60, spans z: -50 to 40 (depth 90)
        this.createWall(60, -5, wallThickness, wallHeight, 90, 0);

        // === INTERNAL DIVIDERS (partial walls for open-plan layout) ===

        // myLinde / Full Portfolio divider (partial wall)
        // At x=-35, spans z: -10 to 20 (depth 30)
        this.createWall(-35, 5, wallThickness, wallHeight, 30, 0);

        // myLinde back wall (separates myLinde office from main floor)
        // At z=-10, spans x: -65 to -35 (width 30)
        this.createWall(-50, -10, 30, wallHeight, wallThickness, 0);

        // === BACK SECTION DIVIDERS (vertical walls between sections, open to main floor) ===

        // Energy Solutions / Automation divider
        // At x=-35, spans z: -50 to -25 (depth 25)
        this.createWall(-35, -37.5, wallThickness, wallHeight, 25, 0);

        // Automation / Expertise divider
        // At x=20, spans z: -50 to -25 (depth 25)
        this.createWall(20, -37.5, wallThickness, wallHeight, 25, 0);

        // === DOCK DOORS (openings in front wall) ===
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

    // ==========================================
    // MYLINDE SECTION - Compact Admin Office
    // ==========================================
    createMyLindeSection() {
        const baseX = -50;
        const baseZ = 15;

        // Floor for collaborative digital workspace
        const officeFloor = new THREE.Mesh(
            new THREE.PlaneGeometry(18, 16),
            this.materials.floorOffice
        );
        officeFloor.rotation.x = -Math.PI / 2;
        officeFloor.position.set(baseX, 0.01, baseZ);
        this.warehouseGroup.add(officeFloor);

        // === COLLABORATIVE HUB LAYOUT ===
        // Central shared display wall with workstations arranged around it

        // Large shared display wall (back center)
        this.createMyLindeDisplayWall(baseX, baseZ + 7);

        // === THREE WORKSTATION CLUSTERS (arranged in arc facing the display) ===

        // Fleet Management & Analytics (left cluster)
        this.createFleetManagementCluster(baseX - 5, baseZ + 2);

        // Service Management (right cluster)
        this.createServiceManagementCluster(baseX + 5, baseZ + 2);

        // Safety Analytics/Guardian (front center)
        this.createSafetyAnalyticsCluster(baseX, baseZ - 3);

        // === SHARED COLLABORATION ELEMENTS ===

        // Central meeting table (between workstations)
        this.createCollaborationTable(baseX, baseZ + 1);

        // Server infrastructure (side, compact)
        this.createServerRack(baseX - 8, baseZ + 4);
        this.createServerRack(baseX - 8, baseZ + 1);
    }

    // Large shared display wall for myLinde
    createMyLindeDisplayWall(x, z) {
        const group = new THREE.Group();

        // Main large screen (command center style)
        const mainScreen = new THREE.Mesh(
            new THREE.BoxGeometry(8, 3, 0.15),
            this.materials.monitor
        );
        mainScreen.position.set(0, 2.2, 0);
        group.add(mainScreen);

        // Screen display (dark background) - facing inward (negative z)
        const display = new THREE.Mesh(
            new THREE.PlaneGeometry(7.8, 2.8),
            new THREE.MeshBasicMaterial({ color: 0x1a1a2a })
        );
        display.position.set(0, 2.2, -0.08);
        display.rotation.y = Math.PI;
        group.add(display);

        // myLinde branding bar (red stripe at top) - facing inward
        const brandBar = new THREE.Mesh(
            new THREE.PlaneGeometry(8, 0.4),
            new THREE.MeshBasicMaterial({ color: 0xc41e3a })
        );
        brandBar.position.set(0, 3.5, -0.09);
        brandBar.rotation.y = Math.PI;
        group.add(brandBar);

        // Dashboard widgets on screen - facing inward
        // Fleet status widget (left)
        const fleetWidget = new THREE.Mesh(
            new THREE.PlaneGeometry(2.2, 1.8),
            new THREE.MeshBasicMaterial({ color: 0x2a3a4a })
        );
        fleetWidget.position.set(-2.5, 2.0, -0.09);
        fleetWidget.rotation.y = Math.PI;
        group.add(fleetWidget);

        // Service status widget (center)
        const serviceWidget = new THREE.Mesh(
            new THREE.PlaneGeometry(2.2, 1.8),
            new THREE.MeshBasicMaterial({ color: 0x2a4a3a })
        );
        serviceWidget.position.set(0, 2.0, -0.09);
        serviceWidget.rotation.y = Math.PI;
        group.add(serviceWidget);

        // Safety status widget (right)
        const safetyWidget = new THREE.Mesh(
            new THREE.PlaneGeometry(2.2, 1.8),
            new THREE.MeshBasicMaterial({ color: 0x4a2a3a })
        );
        safetyWidget.position.set(2.5, 2.0, -0.09);
        safetyWidget.rotation.y = Math.PI;
        group.add(safetyWidget);

        // Status indicators on each widget - facing inward
        [[-2.5, 0x00ff00], [0, 0x00ff00], [2.5, 0xffaa00]].forEach(([wx, color]) => {
            const indicator = new THREE.Mesh(
                new THREE.CircleGeometry(0.15, 16),
                new THREE.MeshBasicMaterial({ color: color })
            );
            indicator.position.set(wx, 2.7, -0.1);
            indicator.rotation.y = Math.PI;
            group.add(indicator);
        });

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    // Fleet Management & Analytics workstation cluster
    createFleetManagementCluster(x, z) {
        const group = new THREE.Group();

        // Straight desk
        const desk = new THREE.Mesh(
            new THREE.BoxGeometry(2.8, 0.08, 1.0),
            this.materials.deskWhite
        );
        desk.position.set(0, 0.75, 0);
        desk.castShadow = true;
        group.add(desk);

        // Desk legs
        [[-1.2, 0.4], [1.2, 0.4], [-1.2, -0.4], [1.2, -0.4]].forEach(([lx, lz]) => {
            const leg = new THREE.Mesh(
                new THREE.BoxGeometry(0.05, 0.75, 0.05),
                this.materials.rack
            );
            leg.position.set(lx, 0.375, lz);
            group.add(leg);
        });

        // Dual monitors (fleet analytics)
        [-0.5, 0.5].forEach((mx, i) => {
            const monitor = new THREE.Mesh(
                new THREE.BoxGeometry(0.65, 0.45, 0.04),
                this.materials.monitor
            );
            monitor.position.set(mx, 1.2, -0.3);
            group.add(monitor);

            const screen = new THREE.Mesh(
                new THREE.PlaneGeometry(0.6, 0.4),
                new THREE.MeshBasicMaterial({ color: i === 0 ? 0x2266aa : 0x226644 })
            );
            screen.position.set(mx, 1.2, -0.27);
            group.add(screen);
        });

        // Keyboard
        const keyboard = new THREE.Mesh(
            new THREE.BoxGeometry(0.45, 0.02, 0.16),
            this.materials.forkliftDark
        );
        keyboard.position.set(0, 0.8, 0.2);
        group.add(keyboard);

        // Chair
        const chair = this.createOfficeChair();
        chair.position.set(0, 0, 0.8);
        group.add(chair);

        // Small label stand
        const labelStand = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.25, 0.08),
            new THREE.MeshStandardMaterial({ color: 0xc41e3a })
        );
        labelStand.position.set(-1.1, 0.9, -0.35);
        group.add(labelStand);

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    // Service Management workstation cluster
    createServiceManagementCluster(x, z) {
        const group = new THREE.Group();

        // Straight desk (same as fleet management)
        const desk = new THREE.Mesh(
            new THREE.BoxGeometry(2.8, 0.08, 1.0),
            this.materials.deskWhite
        );
        desk.position.set(0, 0.75, 0);
        desk.castShadow = true;
        group.add(desk);

        // Desk legs
        [[-1.2, 0.4], [1.2, 0.4], [-1.2, -0.4], [1.2, -0.4]].forEach(([lx, lz]) => {
            const leg = new THREE.Mesh(
                new THREE.BoxGeometry(0.05, 0.75, 0.05),
                this.materials.rack
            );
            leg.position.set(lx, 0.375, lz);
            group.add(leg);
        });

        // Monitor with service portal
        const monitor = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.5, 0.04),
            this.materials.monitor
        );
        monitor.position.set(-0.3, 1.2, -0.3);
        group.add(monitor);

        const screen = new THREE.Mesh(
            new THREE.PlaneGeometry(0.65, 0.45),
            new THREE.MeshBasicMaterial({ color: 0x224466 })
        );
        screen.position.set(-0.3, 1.2, -0.27);
        group.add(screen);

        // Service scheduling board (standing next to desk)
        const schedBoard = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.6, 0.04),
            new THREE.MeshStandardMaterial({ color: 0xf0f0f0 })
        );
        schedBoard.position.set(0.8, 1.1, -0.3);
        group.add(schedBoard);

        // Task cards on board
        for (let i = 0; i < 4; i++) {
            const card = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.12, 0.01),
                new THREE.MeshBasicMaterial({ color: [0xff6644, 0xffaa44, 0x44aa44, 0x4488cc][i] })
            );
            card.position.set(0.6 + (i % 2) * 0.22, 1.18 - Math.floor(i / 2) * 0.18, -0.27);
            group.add(card);
        }

        // Keyboard
        const keyboard = new THREE.Mesh(
            new THREE.BoxGeometry(0.45, 0.02, 0.16),
            this.materials.forkliftDark
        );
        keyboard.position.set(0, 0.8, 0.2);
        group.add(keyboard);

        // Chair
        const chair = this.createOfficeChair();
        chair.position.set(0, 0, 0.8);
        group.add(chair);

        // Small label stand
        const labelStand = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.25, 0.08),
            new THREE.MeshStandardMaterial({ color: 0xc41e3a })
        );
        labelStand.position.set(1.1, 0.9, -0.35);
        group.add(labelStand);

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    // Safety Analytics/Guardian workstation cluster
    createSafetyAnalyticsCluster(x, z) {
        const group = new THREE.Group();

        // Curved desk (faces the main display)
        const desk = new THREE.Mesh(
            new THREE.BoxGeometry(3.0, 0.08, 1.0),
            this.materials.deskWhite
        );
        desk.position.set(0, 0.75, 0);
        desk.castShadow = true;
        group.add(desk);

        // Desk legs
        [[-1.3, 0.4], [1.3, 0.4], [-1.3, -0.4], [1.3, -0.4]].forEach(([lx, lz]) => {
            const leg = new THREE.Mesh(
                new THREE.BoxGeometry(0.05, 0.75, 0.05),
                this.materials.rack
            );
            leg.position.set(lx, 0.375, lz);
            group.add(leg);
        });

        // Triple monitor setup (safety command center)
        [-0.7, 0, 0.7].forEach((mx, i) => {
            const monitor = new THREE.Mesh(
                new THREE.BoxGeometry(0.6, 0.42, 0.04),
                this.materials.monitor
            );
            monitor.position.set(mx, 1.18, -0.3);
            group.add(monitor);

            const screenColor = i === 1 ? 0x2a4a2a : 0x2a2a4a;
            const screen = new THREE.Mesh(
                new THREE.PlaneGeometry(0.55, 0.38),
                new THREE.MeshBasicMaterial({ color: screenColor })
            );
            screen.position.set(mx, 1.18, -0.27);
            group.add(screen);
        });

        // Safety alert beacon
        const beacon = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 0.15, 8),
            new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00aa00, emissiveIntensity: 0.4 })
        );
        beacon.position.set(1.2, 1.0, -0.3);
        group.add(beacon);

        // Keyboard
        const keyboard = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.02, 0.18),
            this.materials.forkliftDark
        );
        keyboard.position.set(0, 0.8, 0.2);
        group.add(keyboard);

        // Chair
        const chair = this.createOfficeChair();
        chair.position.set(0, 0, 0.8);
        group.add(chair);

        // Small label stand
        const labelStand = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.25, 0.08),
            new THREE.MeshStandardMaterial({ color: 0xc41e3a })
        );
        labelStand.position.set(-1.2, 0.9, -0.3);
        group.add(labelStand);

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    // Shared collaboration table in center
    createCollaborationTable(x, z) {
        const group = new THREE.Group();

        // Round collaboration table
        const table = new THREE.Mesh(
            new THREE.CylinderGeometry(1.2, 1.2, 0.08, 24),
            this.materials.deskWhite
        );
        table.position.y = 0.75;
        table.castShadow = true;
        group.add(table);

        // Table leg (central)
        const leg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.15, 0.2, 0.75, 12),
            this.materials.forkliftMetal
        );
        leg.position.y = 0.375;
        group.add(leg);

        // Base
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.55, 0.05, 16),
            this.materials.forkliftMetal
        );
        base.position.y = 0.025;
        group.add(base);

        // Tablet/documents on table
        const tablet = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.02, 0.2),
            this.materials.monitor
        );
        tablet.position.set(0.3, 0.8, 0.2);
        group.add(tablet);

        // Coffee mugs (collaborative touch)
        [[-0.4, -0.3], [0.5, -0.2]].forEach(([mx, mz]) => {
            const mug = new THREE.Mesh(
                new THREE.CylinderGeometry(0.04, 0.035, 0.1, 8),
                new THREE.MeshStandardMaterial({ color: 0xffffff })
            );
            mug.position.set(mx, 0.84, mz);
            group.add(mug);
        });

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    // Office chair helper
    createOfficeChair() {
        const chair = new THREE.Group();

        // Seat
        const seat = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.08, 0.5),
            this.materials.chair
        );
        seat.position.y = 0.45;
        chair.add(seat);

        // Back
        const back = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 0.06),
            this.materials.chair
        );
        back.position.set(0, 0.72, 0.22);
        chair.add(back);

        // Base
        const basePost = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8),
            this.materials.forkliftMetal
        );
        basePost.position.y = 0.2;
        chair.add(basePost);

        // Wheels base
        const wheelBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.25, 0.25, 0.05, 5),
            this.materials.forkliftMetal
        );
        wheelBase.position.y = 0.05;
        chair.add(wheelBase);

        return chair;
    }


    createOfficeDesk(x, z) {
        const group = new THREE.Group();

        // Desk surface
        const desk = new THREE.Mesh(
            new THREE.BoxGeometry(2.4, 0.08, 1.2),
            this.materials.deskWhite
        );
        desk.position.y = 0.75;
        desk.castShadow = true;
        group.add(desk);

        // Desk legs
        const legGeom = new THREE.BoxGeometry(0.05, 0.75, 0.05);
        [[-1.1, -0.55], [1.1, -0.55], [-1.1, 0.55], [1.1, 0.55]].forEach(([lx, lz]) => {
            const leg = new THREE.Mesh(legGeom, this.materials.rack);
            leg.position.set(lx, 0.375, lz);
            group.add(leg);
        });

        // Monitor
        const monitorStand = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.3, 0.1),
            this.materials.monitor
        );
        monitorStand.position.set(0, 0.9, -0.3);
        group.add(monitorStand);

        const monitorScreen = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 0.55, 0.04),
            this.materials.monitor
        );
        monitorScreen.position.set(0, 1.35, -0.35);
        group.add(monitorScreen);

        const screenDisplay = new THREE.Mesh(
            new THREE.PlaneGeometry(0.8, 0.45),
            this.materials.screen
        );
        screenDisplay.position.set(0, 1.35, -0.32);
        group.add(screenDisplay);

        // Keyboard
        const keyboard = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.02, 0.2),
            this.materials.monitor
        );
        keyboard.position.set(0, 0.8, 0.1);
        group.add(keyboard);

        // Chair
        const chairSeat = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.08, 0.5),
            this.materials.chair
        );
        chairSeat.position.set(0, 0.45, 0.9);
        group.add(chairSeat);

        const chairBack = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 0.05),
            this.materials.chair
        );
        chairBack.position.set(0, 0.7, 1.12);
        group.add(chairBack);

        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    createMeetingTable(x, z) {
        const group = new THREE.Group();

        // Large table
        const table = new THREE.Mesh(
            new THREE.BoxGeometry(4, 0.1, 2),
            this.materials.desk
        );
        table.position.y = 0.75;
        table.castShadow = true;
        group.add(table);

        // Legs
        const legGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.75, 8);
        [[-1.7, -0.8], [1.7, -0.8], [-1.7, 0.8], [1.7, 0.8]].forEach(([lx, lz]) => {
            const leg = new THREE.Mesh(legGeom, this.materials.rack);
            leg.position.set(lx, 0.375, lz);
            group.add(leg);
        });

        // Chairs around table
        for (let i = -1.5; i <= 1.5; i += 1.5) {
            // Front chairs
            const chair1 = new THREE.Mesh(
                new THREE.CylinderGeometry(0.25, 0.25, 0.4, 16),
                this.materials.chair
            );
            chair1.position.set(i, 0.4, -1.5);
            group.add(chair1);

            // Back chairs
            const chair2 = chair1.clone();
            chair2.position.set(i, 0.4, 1.5);
            group.add(chair2);
        }

        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    createServerRack(x, z) {
        const group = new THREE.Group();

        // Main cabinet
        const cabinet = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 2, 0.6),
            this.materials.server
        );
        cabinet.position.y = 1;
        cabinet.castShadow = true;
        group.add(cabinet);

        // LED indicators
        for (let i = 0; i < 5; i++) {
            const led = new THREE.Mesh(
                new THREE.BoxGeometry(0.05, 0.05, 0.02),
                new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00ff00 : 0x00aa00 })
            );
            led.position.set(-0.25, 0.5 + i * 0.3, 0.31);
            group.add(led);
        }

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    createWallScreen(x, z) {
        // Large wall-mounted display
        const screen = new THREE.Mesh(
            new THREE.BoxGeometry(4, 2.5, 0.1),
            this.materials.monitor
        );
        screen.position.set(x, 2.5, z);
        this.warehouseGroup.add(screen);

        const display = new THREE.Mesh(
            new THREE.PlaneGeometry(3.8, 2.3),
            this.materials.screen
        );
        display.position.set(x, 2.5, z + 0.06);
        this.warehouseGroup.add(display);
    }

    createFilingCabinet(x, z) {
        const cabinet = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 1.5, 0.5),
            this.materials.rack
        );
        cabinet.position.set(x, 0.75, z);
        cabinet.castShadow = true;
        this.warehouseGroup.add(cabinet);

        // Drawer handles
        for (let i = 0; i < 3; i++) {
            const handle = new THREE.Mesh(
                new THREE.BoxGeometry(0.3, 0.05, 0.05),
                this.materials.forkliftMetal
            );
            handle.position.set(x, 0.4 + i * 0.45, z + 0.28);
            this.warehouseGroup.add(handle);
        }
    }

    // ==========================================
    // ENERGY SOLUTIONS SECTION - Open Charging Area
    // ==========================================
    createEnergySolutionsSection() {
        const baseX = -50;
        const baseZ = -37;

        // Floor - extended to match compartment
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(32, 28),
            this.materials.floorLight
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(baseX, 0.01, baseZ);
        this.warehouseGroup.add(floor);

        // === FRONT ROW (z = -31): Battery Technologies ===
        // Adjusted positions for better spacing with scaled assets

        // Li-ION Battery Technology (left)
        this.createLiIonStation(-58, -31);

        // Lead-Acid Solutions (center)
        this.createLeadAcidStation(-50, -31);

        // Fuel Cell Technology (right)
        this.createFuelCellStation(-42, -31);

        // === BACK ROW (z = -43): Infrastructure ===

        // Linde Chargers (left)
        this.createLindeChargersDisplay(-56, -43);

        // Energy Storage System (right)
        this.createEnergyStorageSystem(-44, -43);

        // === CENTER: Energy Monitor ===
        this.createEnergyMonitorStation(-50, -37);

        // === Floor markings connecting stations ===
        this.createEnergyFloorMarkings(baseX, baseZ);
    }

    // Li-ION Battery Station - Modern slim design with opportunity charger
    createLiIonStation(x, z) {
        const group = new THREE.Group();

        // Floor marking
        const floorMark = new THREE.Mesh(
            new THREE.PlaneGeometry(6, 5),
            new THREE.MeshBasicMaterial({ color: 0x2d5a27, transparent: true, opacity: 0.25 })
        );
        floorMark.rotation.x = -Math.PI / 2;
        floorMark.position.y = 0.02;
        group.add(floorMark);

        // Modern Li-ION battery pack (slim, tall design)
        const batteryPack = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 1.8, 0.8),
            new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.4, metalness: 0.3 })
        );
        batteryPack.position.set(-1.5, 0.9, 0);
        batteryPack.castShadow = true;
        group.add(batteryPack);

        // Green Li-ION branding stripe
        const stripe = new THREE.Mesh(
            new THREE.BoxGeometry(1.22, 0.15, 0.05),
            new THREE.MeshStandardMaterial({ color: 0x4ade80, emissive: 0x2a8a50, emissiveIntensity: 0.3 })
        );
        stripe.position.set(-1.5, 1.5, 0.41);
        group.add(stripe);

        // Battery cells visible (decorative)
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 2; col++) {
                const cell = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.12, 0.12, 0.4, 8),
                    new THREE.MeshStandardMaterial({ color: 0x2a4a2a, metalness: 0.5 })
                );
                cell.rotation.x = Math.PI / 2;
                cell.position.set(-1.8 + col * 0.6, 0.5 + row * 0.45, 0.41);
                group.add(cell);
            }
        }

        // Opportunity charger (fast charging unit)
        const charger = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 1.5, 0.5),
            this.materials.chargerWhite
        );
        charger.position.set(0.5, 0.75, 0);
        charger.castShadow = true;
        group.add(charger);

        // Charger display
        const display = new THREE.Mesh(
            new THREE.PlaneGeometry(0.5, 0.35),
            this.materials.screen
        );
        display.position.set(0.5, 1.2, 0.26);
        group.add(display);

        // Fast charge indicator (green glow)
        const indicator = new THREE.Mesh(
            new THREE.CircleGeometry(0.1, 16),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );
        indicator.position.set(0.5, 0.8, 0.26);
        group.add(indicator);

        // Charging cable
        const cable = new THREE.Mesh(
            new THREE.CylinderGeometry(0.03, 0.03, 1.2, 8),
            this.materials.forkliftDark
        );
        cable.rotation.z = Math.PI / 4;
        cable.position.set(1.0, 0.4, 0.3);
        group.add(cable);

        // Forklift being charged
        const forklift = this.createCompactForklift('red');
        forklift.position.set(1.5, 0, 1.5);
        forklift.rotation.y = Math.PI;
        group.add(forklift);

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    // Lead-Acid Battery Station - Traditional design with maintenance area
    createLeadAcidStation(x, z) {
        const group = new THREE.Group();

        // Floor marking
        const floorMark = new THREE.Mesh(
            new THREE.PlaneGeometry(6, 5),
            new THREE.MeshBasicMaterial({ color: 0x3a3a4a, transparent: true, opacity: 0.25 })
        );
        floorMark.rotation.x = -Math.PI / 2;
        floorMark.position.y = 0.02;
        group.add(floorMark);

        // Traditional battery cabinet (bulkier)
        const cabinet = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 1.5, 1.2),
            this.materials.battery
        );
        cabinet.position.set(0, 0.75, -1);
        cabinet.castShadow = true;
        group.add(cabinet);

        // Battery cells visible on top
        for (let i = 0; i < 3; i++) {
            const cell = new THREE.Mesh(
                new THREE.BoxGeometry(0.6, 0.4, 0.8),
                new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.8 })
            );
            cell.position.set(-0.8 + i * 0.8, 1.7, -1);
            group.add(cell);

            // Cell terminals
            [-0.15, 0.15].forEach(tx => {
                const terminal = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.05, 0.05, 0.1, 8),
                    new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 })
                );
                terminal.position.set(-0.8 + i * 0.8 + tx, 1.95, -1);
                group.add(terminal);
            });
        }

        // Water filling station (for maintenance)
        const waterStation = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 1.2, 0.4),
            new THREE.MeshStandardMaterial({ color: 0x4488cc, roughness: 0.5 })
        );
        waterStation.position.set(-1.8, 0.6, -1);
        group.add(waterStation);

        // Water tank on top
        const tank = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 0.5, 12),
            new THREE.MeshStandardMaterial({ color: 0x6699cc, transparent: true, opacity: 0.7 })
        );
        tank.position.set(-1.8, 1.45, -1);
        group.add(tank);

        // Standard charger
        const charger = new THREE.Mesh(
            new THREE.BoxGeometry(1.0, 1.6, 0.5),
            this.materials.chargerWhite
        );
        charger.position.set(1.5, 0.8, -1);
        charger.castShadow = true;
        group.add(charger);

        // Charger display
        const display = new THREE.Mesh(
            new THREE.PlaneGeometry(0.6, 0.4),
            this.materials.screen
        );
        display.position.set(1.5, 1.3, -0.74);
        group.add(display);

        // Charging indicator (amber for slower charge)
        const indicator = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 12, 12),
            new THREE.MeshBasicMaterial({ color: 0xffaa00 })
        );
        indicator.position.set(1.8, 1.5, -0.74);
        group.add(indicator);

        // Forklift with battery being serviced
        const forklift = this.createCompactForklift('yellow');
        forklift.position.set(0, 0, 1.5);
        forklift.rotation.y = Math.PI;
        group.add(forklift);

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    // Fuel Cell / Hydrogen Station
    createFuelCellStation(x, z) {
        const group = new THREE.Group();

        // Floor marking (blue for hydrogen)
        const floorMark = new THREE.Mesh(
            new THREE.PlaneGeometry(7, 5),
            new THREE.MeshBasicMaterial({ color: 0x2a4a6a, transparent: true, opacity: 0.25 })
        );
        floorMark.rotation.x = -Math.PI / 2;
        floorMark.position.y = 0.02;
        group.add(floorMark);

        // Hydrogen storage tank (large cylinder)
        const h2Tank = new THREE.Mesh(
            new THREE.CylinderGeometry(0.6, 0.6, 2.5, 16),
            new THREE.MeshStandardMaterial({ color: 0x2266aa, roughness: 0.4, metalness: 0.4 })
        );
        h2Tank.position.set(-2, 1.25, -0.5);
        h2Tank.castShadow = true;
        group.add(h2Tank);

        // Tank end caps
        [0, 2.5].forEach(y => {
            const cap = new THREE.Mesh(
                new THREE.SphereGeometry(0.6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
                new THREE.MeshStandardMaterial({ color: 0x2266aa, roughness: 0.4, metalness: 0.4 })
            );
            cap.position.set(-2, y, -0.5);
            cap.rotation.x = y === 0 ? Math.PI : 0;
            group.add(cap);
        });

        // H2 label on tank
        const h2Label = new THREE.Mesh(
            new THREE.PlaneGeometry(0.8, 0.4),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        h2Label.position.set(-2, 1.5, 0.11);
        group.add(h2Label);

        // Dispenser unit
        const dispenser = new THREE.Mesh(
            new THREE.BoxGeometry(1.0, 2.0, 0.6),
            new THREE.MeshStandardMaterial({ color: 0xe0e0e0, roughness: 0.5 })
        );
        dispenser.position.set(0.5, 1.0, -0.5);
        dispenser.castShadow = true;
        group.add(dispenser);

        // Dispenser display
        const display = new THREE.Mesh(
            new THREE.PlaneGeometry(0.6, 0.4),
            this.materials.screen
        );
        display.position.set(0.5, 1.6, -0.19);
        group.add(display);

        // Nozzle holder
        const nozzleHolder = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.5, 0.15),
            this.materials.forkliftMetal
        );
        nozzleHolder.position.set(0.8, 0.8, -0.15);
        group.add(nozzleHolder);

        // Refueling nozzle
        const nozzle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.06, 0.08, 0.4, 8),
            this.materials.forkliftMetal
        );
        nozzle.rotation.z = Math.PI / 3;
        nozzle.position.set(1.1, 0.6, -0.1);
        group.add(nozzle);

        // Hose
        const hose = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.04, 1.0, 8),
            new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
        );
        hose.rotation.z = Math.PI / 4;
        hose.position.set(1.0, 0.9, -0.1);
        group.add(hose);

        // Status indicators (rapid refuel time)
        for (let i = 0; i < 3; i++) {
            const light = new THREE.Mesh(
                new THREE.SphereGeometry(0.06, 8, 8),
                new THREE.MeshBasicMaterial({ color: 0x00ff00 })
            );
            light.position.set(0.2 + i * 0.2, 1.85, -0.19);
            group.add(light);
        }

        // Safety bollards
        [[-1.2, 1], [1.8, 1]].forEach(([bx, bz]) => {
            const bollard = new THREE.Mesh(
                new THREE.CylinderGeometry(0.12, 0.12, 0.8, 8),
                new THREE.MeshStandardMaterial({ color: 0xffcc00 })
            );
            bollard.position.set(bx, 0.4, bz);
            group.add(bollard);
        });

        // Forklift refueling
        const forklift = this.createCompactForklift('red');
        forklift.position.set(0.5, 0, 1.8);
        forklift.rotation.y = Math.PI;
        group.add(forklift);

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    // Linde Chargers Display - Multiple charger types
    createLindeChargersDisplay(x, z) {
        const group = new THREE.Group();

        // Display platform
        const platform = new THREE.Mesh(
            new THREE.BoxGeometry(8, 0.15, 4),
            new THREE.MeshStandardMaterial({ color: 0xd0d0d0, roughness: 0.8 })
        );
        platform.position.y = 0.075;
        group.add(platform);

        // Row of different charger types
        const chargerTypes = [
            { width: 0.8, height: 1.4, color: 0xf0f0f0, label: 'Standard' },
            { width: 1.0, height: 1.6, color: 0xe8e8e8, label: 'Fast' },
            { width: 1.2, height: 1.8, color: 0xe0e0e0, label: 'HF' },
            { width: 0.6, height: 1.2, color: 0xf0f0f0, label: 'Onboard' }
        ];

        chargerTypes.forEach((type, i) => {
            const charger = new THREE.Mesh(
                new THREE.BoxGeometry(type.width, type.height, 0.5),
                new THREE.MeshStandardMaterial({ color: type.color, roughness: 0.6 })
            );
            charger.position.set(-3 + i * 2, type.height / 2 + 0.15, 0);
            charger.castShadow = true;
            group.add(charger);

            // Display screen
            const screen = new THREE.Mesh(
                new THREE.PlaneGeometry(type.width * 0.6, 0.3),
                this.materials.screen
            );
            screen.position.set(-3 + i * 2, type.height * 0.7 + 0.15, 0.26);
            group.add(screen);

            // Green Linde stripe
            const stripe = new THREE.Mesh(
                new THREE.BoxGeometry(type.width + 0.02, 0.1, 0.02),
                new THREE.MeshStandardMaterial({ color: 0x4ade80, emissive: 0x2a8a50, emissiveIntensity: 0.2 })
            );
            stripe.position.set(-3 + i * 2, type.height - 0.1 + 0.15, 0.26);
            group.add(stripe);

            // Status LED
            const led = new THREE.Mesh(
                new THREE.SphereGeometry(0.05, 8, 8),
                new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00ff00 : 0x00aa00 })
            );
            led.position.set(-3 + i * 2 + type.width * 0.3, type.height * 0.85 + 0.15, 0.26);
            group.add(led);
        });

        // Branding backdrop
        const backdrop = new THREE.Mesh(
            new THREE.BoxGeometry(8.5, 2.5, 0.1),
            new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.8 })
        );
        backdrop.position.set(0, 1.4, -1.5);
        group.add(backdrop);

        // Linde logo area (green rectangle)
        const logoArea = new THREE.Mesh(
            new THREE.PlaneGeometry(3, 0.6),
            new THREE.MeshStandardMaterial({ color: 0x4ade80 })
        );
        logoArea.position.set(0, 2.2, -1.44);
        group.add(logoArea);

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    // Large Energy Storage System
    createEnergyStorageSystem(x, z) {
        const group = new THREE.Group();

        // Main container unit
        const container = new THREE.Mesh(
            new THREE.BoxGeometry(6, 2.8, 2.5),
            new THREE.MeshStandardMaterial({ color: 0x2a4a2a, roughness: 0.6, metalness: 0.2 })
        );
        container.position.set(0, 1.4, 0);
        container.castShadow = true;
        group.add(container);

        // Green energy stripe
        const stripe = new THREE.Mesh(
            new THREE.BoxGeometry(6.02, 0.3, 0.05),
            new THREE.MeshStandardMaterial({ color: 0x4ade80, emissive: 0x2a8a50, emissiveIntensity: 0.3 })
        );
        stripe.position.set(0, 2.4, 1.26);
        group.add(stripe);

        // Ventilation panels
        for (let i = -2; i <= 2; i++) {
            const vent = new THREE.Mesh(
                new THREE.PlaneGeometry(0.8, 1.8),
                new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 })
            );
            vent.position.set(i * 1.1, 1.3, 1.26);
            group.add(vent);
        }

        // Control panel
        const controlPanel = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 1.5, 0.15),
            this.materials.monitor
        );
        controlPanel.position.set(2.5, 1.2, 1.35);
        group.add(controlPanel);

        // Screen on control panel
        const screen = new THREE.Mesh(
            new THREE.PlaneGeometry(1.0, 0.7),
            this.materials.screen
        );
        screen.position.set(2.5, 1.4, 1.43);
        group.add(screen);

        // Energy level bars on screen
        for (let i = 0; i < 5; i++) {
            const bar = new THREE.Mesh(
                new THREE.BoxGeometry(0.12, 0.08 + i * 0.06, 0.02),
                new THREE.MeshBasicMaterial({ color: i < 4 ? 0x00ff00 : 0xffff00 })
            );
            bar.position.set(2.2 + i * 0.15, 1.25 + (0.08 + i * 0.06) / 2, 1.44);
            group.add(bar);
        }

        // Power connection boxes
        [-2, 2].forEach(px => {
            const powerBox = new THREE.Mesh(
                new THREE.BoxGeometry(0.5, 0.8, 0.4),
                this.materials.forkliftMetal
            );
            powerBox.position.set(px, 0.4, 1.5);
            group.add(powerBox);

            // Cable entry
            const cable = new THREE.Mesh(
                new THREE.CylinderGeometry(0.08, 0.08, 0.3, 8),
                this.materials.forkliftDark
            );
            cable.rotation.x = Math.PI / 2;
            cable.position.set(px, 0.5, 1.85);
            group.add(cable);
        });

        // Cooling unit on side
        const cooler = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 2, 1.5),
            new THREE.MeshStandardMaterial({ color: 0x505050, roughness: 0.7 })
        );
        cooler.position.set(-3.4, 1, 0);
        group.add(cooler);

        // Cooling fan grille
        const fanGrille = new THREE.Mesh(
            new THREE.CircleGeometry(0.5, 16),
            new THREE.MeshStandardMaterial({ color: 0x2a2a2a })
        );
        fanGrille.position.set(-3.81, 1.2, 0);
        fanGrille.rotation.y = -Math.PI / 2;
        group.add(fanGrille);

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    // Energy floor markings
    createEnergyFloorMarkings(baseX, baseZ) {
        const markingMaterial = new THREE.MeshBasicMaterial({ color: 0x4ade80, transparent: true, opacity: 0.4 });

        // Connecting paths between stations (adjusted for new positions)
        // Front row horizontal at z=-31
        const frontPath = new THREE.Mesh(
            new THREE.PlaneGeometry(18, 0.3),
            markingMaterial
        );
        frontPath.rotation.x = -Math.PI / 2;
        frontPath.position.set(baseX, 0.015, -31);
        this.warehouseGroup.add(frontPath);

        // Back row horizontal at z=-43
        const backPath = new THREE.Mesh(
            new THREE.PlaneGeometry(14, 0.3),
            markingMaterial
        );
        backPath.rotation.x = -Math.PI / 2;
        backPath.position.set(baseX, 0.015, -43);
        this.warehouseGroup.add(backPath);

        // Vertical connectors (left at x=-58, right at x=-44)
        [[-58, 12], [-44, 12]].forEach(([px, length]) => {
            const vPath = new THREE.Mesh(
                new THREE.PlaneGeometry(0.3, length),
                markingMaterial
            );
            vPath.rotation.x = -Math.PI / 2;
            vPath.position.set(px, 0.015, -37);
            this.warehouseGroup.add(vPath);
        });
    }

    // Compact forklift helper for energy section
    createCompactForklift(color) {
        const group = new THREE.Group();
        const bodyMaterial = color === 'red' ? this.materials.forkliftRed : this.materials.forkliftYellow;

        // Body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(1.0, 0.6, 1.6),
            bodyMaterial
        );
        body.position.y = 0.5;
        body.castShadow = true;
        group.add(body);

        // Mast
        const mast = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 1.8, 0.15),
            this.materials.forkliftMetal
        );
        mast.position.set(0, 1.1, 0.8);
        group.add(mast);

        // Forks
        [-0.2, 0.2].forEach(fx => {
            const fork = new THREE.Mesh(
                new THREE.BoxGeometry(0.08, 0.05, 0.8),
                this.materials.forkliftMetal
            );
            fork.position.set(fx, 0.15, 1.1);
            group.add(fork);
        });

        // Wheels
        const wheelGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.12, 12);
        [[-0.45, 0.5], [0.45, 0.5], [-0.4, -0.6], [0.4, -0.6]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(wheelGeom, this.materials.tire);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.15, wz);
            group.add(wheel);
        });

        // Overhead guard
        const guard = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 0.05, 1.0),
            this.materials.forkliftMetal
        );
        guard.position.set(0, 1.6, 0.2);
        group.add(guard);

        return group;
    }

    createEnergyMonitorStation(x, z) {
        const group = new THREE.Group();

        // Monitor stand
        const stand = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 1.5, 0.3),
            this.materials.forkliftMetal
        );
        stand.position.y = 0.75;
        group.add(stand);

        // Display screen
        const screen = new THREE.Mesh(
            new THREE.BoxGeometry(1.4, 1.0, 0.08),
            this.materials.monitor
        );
        screen.position.y = 1.8;
        group.add(screen);

        const display = new THREE.Mesh(
            new THREE.PlaneGeometry(1.3, 0.9),
            this.materials.screen
        );
        display.position.set(0, 1.8, 0.05);
        group.add(display);

        // Energy bars visualization
        for (let i = 0; i < 6; i++) {
            const bar = new THREE.Mesh(
                new THREE.BoxGeometry(0.12, 0.1 + i * 0.1, 0.02),
                new THREE.MeshBasicMaterial({ color: i < 4 ? 0x00ff00 : (i < 5 ? 0xffff00 : 0xff6600) })
            );
            bar.position.set(-0.5 + i * 0.2, 1.65 + (0.1 + i * 0.1) / 2, 0.06);
            group.add(bar);
        }

        // Base
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(0.4, 0.5, 0.1, 16),
            this.materials.forkliftDark
        );
        base.position.y = 0.05;
        group.add(base);

        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    // ==========================================
    // AUTOMATION SECTION - High-bay, Robotics & Data Center
    // ==========================================
    createAutomationSection() {
        const baseX = -10;
        const baseZ = -37;

        // Floor - extends from x=-35 (Energy Solutions divider) to x=20 (Expertise divider)
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(53, 24),
            this.materials.floorLight
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(baseX + 2, 0.01, baseZ);
        this.warehouseGroup.add(floor);

        // === EVENLY DISTRIBUTED MATIC VEHICLES ===
        // Vehicles positioned inside the conveyor loop (z: -30 to -44)

        // Front row (z = -33): P-MATIC, L-MATIC, R-MATIC
        // P-MATIC Tow Tractor with tugger train (left)
        this.createPMatic(-18, -33);

        // L-MATIC Stacker (center)
        this.createLMatic(-10, -33);

        // R-MATIC Reach Truck (right)
        this.createRMatic(-2, -33);

        // Back row (z = -41): K-MATIC, Portfolio Functions, Workflow Handoffs
        // K-MATIC Turret Truck (left)
        this.createKMatic(-18, -41);

        // Portfolio Functions - Info kiosk (center)
        this.createAutomationInfoKiosk(-10, -41, 'Portfolio');

        // Workflow Handoffs - Handoff station (right)
        this.createWorkflowHandoffStation(-2, -41);

        // === CONVEYOR NETWORK (closed rectangular loop) ===
        // Loop corners: (-24, -30), (4, -30), (4, -44), (-24, -44)
        // Front horizontal conveyor (z = -30)
        this.createConveyorLine(-10, -30, 28, 0);  // centered at x=-10, spans x: -24 to 4
        // Back horizontal conveyor (z = -44)
        this.createConveyorLine(-10, -44, 28, 0);  // centered at x=-10, spans x: -24 to 4
        // Left vertical connector (x = -24)
        this.createConveyorLine(-24, -37, 14, Math.PI / 2);  // centered at z=-37, spans z: -44 to -30
        // Right vertical connector (x = 4)
        this.createConveyorLine(4, -37, 14, Math.PI / 2);  // centered at z=-37, spans z: -44 to -30

        // === CHARGING STATION (center of room) ===
        this.createMATICChargingStation(-10, -37);

        // === FLOOR MARKINGS for AGV paths ===
        this.createAGVPathMarkings(baseX, baseZ);
    }

    createDataCenterZone(x, z) {
        // Server racks in a row (data center style)
        for (let i = 0; i < 4; i++) {
            this.createDataCenterRack(x, z - 4 + i * 3);
        }

        // Cooling unit
        this.createCoolingUnit(x + 4, z);

        // Network cabinet
        this.createNetworkCabinet(x + 4, z + 5);
    }

    createDataCenterRack(x, z) {
        const group = new THREE.Group();

        // Main rack cabinet (taller than regular server)
        const cabinet = new THREE.Mesh(
            new THREE.BoxGeometry(1, 2.5, 0.8),
            this.materials.server
        );
        cabinet.position.y = 1.25;
        cabinet.castShadow = true;
        group.add(cabinet);

        // Front panel with LEDs
        const panel = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 2.3, 0.05),
            this.materials.battery
        );
        panel.position.set(0, 1.25, 0.43);
        group.add(panel);

        // Multiple LED strips (blinking effect simulation)
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 3; col++) {
                const led = new THREE.Mesh(
                    new THREE.BoxGeometry(0.04, 0.04, 0.02),
                    new THREE.MeshBasicMaterial({
                        color: Math.random() > 0.3 ? 0x00ff00 : (Math.random() > 0.5 ? 0x00aa00 : 0x0066ff)
                    })
                );
                led.position.set(-0.25 + col * 0.25, 0.4 + row * 0.25, 0.47);
                group.add(led);
            }
        }

        // Cable management at back
        const cables = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 2, 0.2),
            this.materials.forkliftDark
        );
        cables.position.set(0, 1.25, -0.45);
        group.add(cables);

        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    createCoolingUnit(x, z) {
        const group = new THREE.Group();

        // Main unit
        const unit = new THREE.Mesh(
            new THREE.BoxGeometry(2, 2.5, 1.5),
            new THREE.MeshStandardMaterial({ color: 0x607080, roughness: 0.6, metalness: 0.4 })
        );
        unit.position.y = 1.25;
        unit.castShadow = true;
        group.add(unit);

        // Vent grilles
        for (let i = 0; i < 2; i++) {
            const vent = new THREE.Mesh(
                new THREE.PlaneGeometry(0.8, 1.5),
                new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.8 })
            );
            vent.position.set(-0.4 + i * 0.8, 1.3, 0.76);
            group.add(vent);
        }

        // Status display
        const display = new THREE.Mesh(
            new THREE.PlaneGeometry(0.5, 0.3),
            this.materials.screen
        );
        display.position.set(0, 2.2, 0.76);
        group.add(display);

        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    createNetworkCabinet(x, z) {
        const group = new THREE.Group();

        // Cabinet
        const cabinet = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 2, 0.6),
            this.materials.server
        );
        cabinet.position.y = 1;
        cabinet.castShadow = true;
        group.add(cabinet);

        // Network switch lights
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 4; col++) {
                const port = new THREE.Mesh(
                    new THREE.BoxGeometry(0.08, 0.05, 0.02),
                    new THREE.MeshBasicMaterial({ color: Math.random() > 0.2 ? 0x00ff00 : 0xffaa00 })
                );
                port.position.set(-0.2 + col * 0.15, 0.5 + row * 0.25, 0.31);
                group.add(port);
            }
        }

        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    createRoboticArmStation(x, z) {
        const group = new THREE.Group();

        // Base platform
        const platform = new THREE.Mesh(
            new THREE.CylinderGeometry(1.2, 1.4, 0.3, 16),
            this.materials.conveyor
        );
        platform.position.y = 0.15;
        group.add(platform);

        // Robot arm base
        const armBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.4, 0.5, 0.8, 16),
            this.materials.automationYellow
        );
        armBase.position.y = 0.7;
        armBase.castShadow = true;
        group.add(armBase);

        // Lower arm
        const lowerArm = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 1.5, 0.25),
            this.materials.automationYellow
        );
        lowerArm.position.set(0, 1.8, 0);
        lowerArm.rotation.z = 0.3;
        lowerArm.castShadow = true;
        group.add(lowerArm);

        // Upper arm
        const upperArm = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 1.2, 0.2),
            this.materials.automationYellow
        );
        upperArm.position.set(0.4, 2.8, 0);
        upperArm.rotation.z = -0.5;
        upperArm.castShadow = true;
        group.add(upperArm);

        // Gripper
        const gripper = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 0.3, 0.3),
            this.materials.forkliftMetal
        );
        gripper.position.set(0.8, 3.2, 0);
        group.add(gripper);

        // Safety fence (partial)
        this.createSafetyFence(group, 2);

        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    createSafetyFence(parentGroup, radius) {
        const fenceMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.6 });

        // Corner posts
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI / 2) + Math.PI / 4;
            const post = new THREE.Mesh(
                new THREE.CylinderGeometry(0.05, 0.05, 1.2, 8),
                fenceMat
            );
            post.position.set(Math.cos(angle) * radius, 0.6, Math.sin(angle) * radius);
            parentGroup.add(post);
        }

        // Horizontal rails
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI / 2) + Math.PI / 4;
            const nextAngle = ((i + 1) * Math.PI / 2) + Math.PI / 4;

            const rail = new THREE.Mesh(
                new THREE.BoxGeometry(0.05, 0.05, radius * 1.5),
                fenceMat
            );
            rail.position.set(
                (Math.cos(angle) + Math.cos(nextAngle)) * radius / 2,
                1,
                (Math.sin(angle) + Math.sin(nextAngle)) * radius / 2
            );
            rail.rotation.y = angle + Math.PI / 4;
            parentGroup.add(rail);
        }
    }

    createAGVChargingStation(x, z) {
        const group = new THREE.Group();

        // Charging pad floor marking
        const pad = new THREE.Mesh(
            new THREE.PlaneGeometry(3, 2),
            new THREE.MeshBasicMaterial({ color: 0x2255aa })
        );
        pad.rotation.x = -Math.PI / 2;
        pad.position.y = 0.02;
        group.add(pad);

        // Charging post
        const post = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 1.5, 0.4),
            this.materials.chargerWhite
        );
        post.position.set(0, 0.75, -0.8);
        post.castShadow = true;
        group.add(post);

        // Charging indicator
        const indicator = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 8, 8),
            this.materials.chargerGreen
        );
        indicator.position.set(0, 1.4, -0.6);
        group.add(indicator);

        // AGV being charged
        this.createAGV(0, 0.5, Math.PI);

        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    createControlPanel(x, z) {
        const group = new THREE.Group();

        // Console desk
        const desk = new THREE.Mesh(
            new THREE.BoxGeometry(2, 1, 0.8),
            this.materials.rack
        );
        desk.position.y = 0.5;
        desk.castShadow = true;
        group.add(desk);

        // Multiple monitors
        for (let i = -0.6; i <= 0.6; i += 0.6) {
            const monitor = new THREE.Mesh(
                new THREE.BoxGeometry(0.5, 0.4, 0.05),
                this.materials.monitor
            );
            monitor.position.set(i, 1.3, -0.2);
            group.add(monitor);

            const screen = new THREE.Mesh(
                new THREE.PlaneGeometry(0.45, 0.35),
                this.materials.screen
            );
            screen.position.set(i, 1.3, -0.17);
            group.add(screen);
        }

        // Keyboard
        const keyboard = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.02, 0.2),
            this.materials.forkliftDark
        );
        keyboard.position.set(0, 1.02, 0.1);
        group.add(keyboard);

        // Chair
        const chair = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.1, 0.5),
            this.materials.chair
        );
        chair.position.set(0, 0.45, 0.6);
        group.add(chair);

        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    createHighBaySystem(x, z) {
        const group = new THREE.Group();
        const height = 9;
        const width = 6;
        const depth = 8;

        // Vertical frame posts - yellow
        const postGeom = new THREE.BoxGeometry(0.3, height, 0.3);
        const corners = [
            [-width / 2, -depth / 2], [width / 2, -depth / 2],
            [-width / 2, depth / 2], [width / 2, depth / 2]
        ];

        corners.forEach(([px, pz]) => {
            const post = new THREE.Mesh(postGeom, this.materials.automationYellow);
            post.position.set(px, height / 2, pz);
            post.castShadow = true;
            group.add(post);
        });

        // Horizontal beams
        for (let y = 2; y <= height; y += 2) {
            // Front/back beams
            [-depth / 2, depth / 2].forEach(bz => {
                const beam = new THREE.Mesh(
                    new THREE.BoxGeometry(width, 0.15, 0.15),
                    this.materials.automationYellow
                );
                beam.position.set(0, y, bz);
                group.add(beam);
            });

            // Side beams
            [-width / 2, width / 2].forEach(bx => {
                const beam = new THREE.Mesh(
                    new THREE.BoxGeometry(0.15, 0.15, depth),
                    this.materials.automationYellow
                );
                beam.position.set(bx, y, 0);
                group.add(beam);
            });
        }

        // Storage bins/boxes on each level
        for (let y = 2; y < height; y += 2) {
            for (let row = 0; row < 2; row++) {
                for (let col = 0; col < 2; col++) {
                    if (Math.random() > 0.2) {
                        const bin = new THREE.Mesh(
                            new THREE.BoxGeometry(2, 1.5, 2.5),
                            Math.random() > 0.5 ? this.materials.boxWhite : this.materials.boxGrey
                        );
                        bin.position.set(-1.5 + col * 3, y + 0.8, -2 + row * 4);
                        bin.castShadow = true;
                        group.add(bin);
                    }
                }
            }
        }

        // Stacker crane rail on top
        const rail = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.2, depth + 2),
            this.materials.forkliftMetal
        );
        rail.position.set(0, height + 0.2, 0);
        group.add(rail);

        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    createConveyorLine(x, z, length, rotation) {
        const group = new THREE.Group();

        // Main conveyor structure
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(length, 0.5, 1.2),
            this.materials.conveyor
        );
        frame.position.y = 0.6;
        frame.castShadow = true;
        group.add(frame);

        // Belt surface
        const belt = new THREE.Mesh(
            new THREE.BoxGeometry(length - 0.2, 0.05, 1),
            this.materials.conveyorBelt
        );
        belt.position.y = 0.88;
        group.add(belt);

        // Support legs
        const legGeom = new THREE.BoxGeometry(0.15, 0.6, 0.15);
        for (let i = -length / 2 + 2; i <= length / 2 - 2; i += 4) {
            [-0.5, 0.5].forEach(lz => {
                const leg = new THREE.Mesh(legGeom, this.materials.rack);
                leg.position.set(i, 0.3, lz);
                group.add(leg);
            });
        }

        // Boxes on conveyor
        for (let i = -length / 2 + 3; i < length / 2 - 3; i += 3) {
            if (Math.random() > 0.3) {
                const box = new THREE.Mesh(
                    new THREE.BoxGeometry(0.8, 0.6, 0.8),
                    Math.random() > 0.5 ? this.materials.boxWhite : this.materials.boxBrown
                );
                box.position.set(i, 1.2, 0);
                box.castShadow = true;
                group.add(box);
            }
        }

        group.position.set(x, 0, z);
        group.rotation.y = rotation;
        this.warehouseGroup.add(group);
    }

    createAGV(x, z, rotation) {
        const group = new THREE.Group();

        // AGV body - yellow automated vehicle
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.4, 1.5),
            this.materials.forkliftYellow
        );
        body.position.y = 0.3;
        body.castShadow = true;
        group.add(body);

        // Wheels
        const wheelGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
        [[-0.7, -0.6], [0.7, -0.6], [-0.7, 0.6], [0.7, 0.6]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(wheelGeom, this.materials.tire);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.15, wz);
            group.add(wheel);
        });

        // Load platform
        const platform = new THREE.Mesh(
            new THREE.BoxGeometry(1.6, 0.1, 1.2),
            this.materials.forkliftMetal
        );
        platform.position.y = 0.55;
        group.add(platform);

        // Cargo on AGV
        const cargo = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.8, 1),
            this.materials.boxWhite
        );
        cargo.position.y = 1;
        cargo.castShadow = true;
        group.add(cargo);

        // Warning beacon
        const beacon = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 0.15, 8),
            new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 0.3 })
        );
        beacon.position.set(0.8, 0.65, 0);
        group.add(beacon);

        group.position.set(x, 0, z);
        group.rotation.y = rotation;
        this.warehouseGroup.add(group);
    }

    // ==========================================
    // MATIC AUTOMATED VEHICLES
    // ==========================================

    // P-MATIC - Automated Tow Tractor with tugger train
    createPMatic(x, z) {
        const group = new THREE.Group();

        // Tow tractor body - red Linde color
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(1.8, 0.8, 2.5),
            this.materials.forkliftRed
        );
        body.position.y = 0.6;
        body.castShadow = true;
        group.add(body);

        // Operator cabin
        const cabin = new THREE.Mesh(
            new THREE.BoxGeometry(1.4, 0.9, 1.2),
            this.materials.forkliftRed
        );
        cabin.position.set(0, 1.3, -0.4);
        group.add(cabin);

        // Roof
        const roof = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 0.08, 1.4),
            this.materials.forkliftRed
        );
        roof.position.set(0, 1.8, -0.4);
        group.add(roof);

        // Sensor array (automation sensors)
        const sensorBar = new THREE.Mesh(
            new THREE.BoxGeometry(1.6, 0.15, 0.15),
            this.materials.forkliftMetal
        );
        sensorBar.position.set(0, 1.0, 1.3);
        group.add(sensorBar);

        // Sensors
        [-0.5, 0, 0.5].forEach(sx => {
            const sensor = new THREE.Mesh(
                new THREE.CylinderGeometry(0.08, 0.08, 0.1, 8),
                new THREE.MeshBasicMaterial({ color: 0x00aaff })
            );
            sensor.rotation.x = Math.PI / 2;
            sensor.position.set(sx, 1.0, 1.4);
            group.add(sensor);
        });

        // Wheels
        const wheelGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 16);
        [[-0.8, 0.8], [0.8, 0.8], [-0.7, -1.0], [0.7, -1.0]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(wheelGeom, this.materials.tire);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.25, wz);
            group.add(wheel);
        });

        // Warning beacon
        const beacon = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 0.2, 8),
            new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 0.5 })
        );
        beacon.position.set(0, 1.95, -0.4);
        group.add(beacon);

        // Tugger train carts (2 carts behind)
        for (let i = 0; i < 2; i++) {
            const cart = this.createTuggerCart();
            cart.position.set(0, 0, -3.5 - i * 2.5);
            group.add(cart);

            // Coupling bar
            const coupling = new THREE.Mesh(
                new THREE.BoxGeometry(0.1, 0.1, 1.2),
                this.materials.forkliftMetal
            );
            coupling.position.set(0, 0.3, -2.2 - i * 2.5);
            group.add(coupling);
        }

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        group.rotation.y = Math.PI / 6;
        this.warehouseGroup.add(group);
    }

    createTuggerCart() {
        const cart = new THREE.Group();

        // Cart platform
        const platform = new THREE.Mesh(
            new THREE.BoxGeometry(1.4, 0.15, 2),
            this.materials.forkliftMetal
        );
        platform.position.y = 0.4;
        cart.add(platform);

        // Cart sides
        [-0.65, 0.65].forEach(sx => {
            const side = new THREE.Mesh(
                new THREE.BoxGeometry(0.08, 0.4, 1.8),
                this.materials.forkliftMetal
            );
            side.position.set(sx, 0.65, 0);
            cart.add(side);
        });

        // Wheels
        const wheelGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.12, 12);
        [[-0.6, 0.7], [0.6, 0.7], [-0.6, -0.7], [0.6, -0.7]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(wheelGeom, this.materials.tire);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.15, wz);
            cart.add(wheel);
        });

        // Cargo boxes
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(1.0, 0.5, 1.2),
            this.materials.boxBlue
        );
        box.position.set(0, 0.75, 0);
        cart.add(box);

        return cart;
    }

    // L-MATIC - Automated Pallet Stacker
    createLMatic(x, z) {
        const group = new THREE.Group();

        // Compact body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(1.0, 0.6, 1.8),
            this.materials.forkliftRed
        );
        body.position.y = 0.5;
        body.castShadow = true;
        group.add(body);

        // Mast structure (tall for stacking)
        const mastHeight = 3.5;
        [-0.35, 0.35].forEach(mx => {
            const mast = new THREE.Mesh(
                new THREE.BoxGeometry(0.12, mastHeight, 0.12),
                this.materials.forkliftMetal
            );
            mast.position.set(mx, mastHeight / 2 + 0.3, 0.9);
            group.add(mast);
        });

        // Cross beams on mast
        for (let y = 1; y <= mastHeight; y += 0.8) {
            const beam = new THREE.Mesh(
                new THREE.BoxGeometry(0.6, 0.08, 0.08),
                this.materials.forkliftMetal
            );
            beam.position.set(0, y, 0.9);
            group.add(beam);
        }

        // Fork carriage
        const carriage = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.4, 0.15),
            this.materials.forkliftMetal
        );
        carriage.position.set(0, 1.5, 0.95);
        group.add(carriage);

        // Forks
        [-0.2, 0.2].forEach(fx => {
            const fork = new THREE.Mesh(
                new THREE.BoxGeometry(0.1, 0.06, 1.0),
                this.materials.forkliftMetal
            );
            fork.position.set(fx, 1.35, 1.4);
            group.add(fork);
        });

        // Pallet on forks
        const pallet = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.1, 0.8),
            this.materials.pallet
        );
        pallet.position.set(0, 1.45, 1.5);
        group.add(pallet);

        // Box on pallet
        const cargo = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.5, 0.6),
            this.materials.boxWhite
        );
        cargo.position.set(0, 1.8, 1.5);
        group.add(cargo);

        // Sensor array
        const sensorUnit = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.2, 0.1),
            this.materials.forkliftDark
        );
        sensorUnit.position.set(0, 0.9, 0);
        group.add(sensorUnit);

        // LIDAR sensors
        [-0.3, 0.3].forEach(sx => {
            const lidar = new THREE.Mesh(
                new THREE.CylinderGeometry(0.06, 0.06, 0.08, 8),
                new THREE.MeshBasicMaterial({ color: 0x00ff00 })
            );
            lidar.position.set(sx, 0.9, -0.05);
            group.add(lidar);
        });

        // Wheels
        const wheelGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.15, 12);
        [[-0.45, 0.5], [0.45, 0.5], [-0.35, -0.7], [0.35, -0.7]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(wheelGeom, this.materials.tire);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.18, wz);
            group.add(wheel);
        });

        // Warning beacon
        const beacon = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 0.15, 8),
            new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 0.5 })
        );
        beacon.position.set(0, mastHeight + 0.4, 0.9);
        group.add(beacon);

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        group.rotation.y = -Math.PI / 8;
        this.warehouseGroup.add(group);
    }

    // R-MATIC - Automated Reach Truck
    createRMatic(x, z) {
        const group = new THREE.Group();

        // Main body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.7, 2.2),
            this.materials.forkliftRed
        );
        body.position.y = 0.55;
        body.castShadow = true;
        group.add(body);

        // Operator compartment (even though automated, has the shape)
        const compartment = new THREE.Mesh(
            new THREE.BoxGeometry(1.0, 1.0, 0.8),
            this.materials.forkliftRed
        );
        compartment.position.set(0, 1.2, -0.5);
        group.add(compartment);

        // Tall mast for reach capability
        const mastHeight = 4.5;
        [-0.4, 0.4].forEach(mx => {
            const mast = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, mastHeight, 0.15),
                this.materials.forkliftMetal
            );
            mast.position.set(mx, mastHeight / 2 + 0.3, 1.0);
            group.add(mast);
        });

        // Inner mast (telescopic)
        [-0.25, 0.25].forEach(mx => {
            const innerMast = new THREE.Mesh(
                new THREE.BoxGeometry(0.1, mastHeight * 0.7, 0.1),
                this.materials.forkliftMetal
            );
            innerMast.position.set(mx, mastHeight * 0.5, 1.0);
            group.add(innerMast);
        });

        // Reach mechanism (extending forks)
        const reachBase = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 0.25, 0.8),
            this.materials.forkliftMetal
        );
        reachBase.position.set(0, 2.0, 1.3);
        group.add(reachBase);

        // Extended forks
        [-0.25, 0.25].forEach(fx => {
            const fork = new THREE.Mesh(
                new THREE.BoxGeometry(0.12, 0.06, 1.4),
                this.materials.forkliftMetal
            );
            fork.position.set(fx, 1.9, 1.9);
            group.add(fork);
        });

        // Load on forks
        const pallet = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 0.1, 1.0),
            this.materials.pallet
        );
        pallet.position.set(0, 2.0, 2.2);
        group.add(pallet);

        const cargo = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.6, 0.8),
            this.materials.boxGrey
        );
        cargo.position.set(0, 2.4, 2.2);
        group.add(cargo);

        // Automation sensor dome on top
        const sensorDome = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 16, 8),
            this.materials.forkliftDark
        );
        sensorDome.position.set(0, 1.85, -0.5);
        group.add(sensorDome);

        // Front sensors
        const frontSensor = new THREE.Mesh(
            new THREE.BoxGeometry(1.0, 0.15, 0.1),
            this.materials.forkliftDark
        );
        frontSensor.position.set(0, 0.5, 1.15);
        group.add(frontSensor);

        // Wheels
        const wheelGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.18, 12);
        [[-0.55, 0.6], [0.55, 0.6], [-0.5, -0.9], [0.5, -0.9]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(wheelGeom, this.materials.tire);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.22, wz);
            group.add(wheel);
        });

        // Warning beacon
        const beacon = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 0.2, 8),
            new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 0.5 })
        );
        beacon.position.set(0, mastHeight + 0.5, 1.0);
        group.add(beacon);

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        group.rotation.y = Math.PI / 10;
        this.warehouseGroup.add(group);
    }

    // K-MATIC - Automated Turret Truck (VNA)
    createKMatic(x, z) {
        const group = new THREE.Group();

        // Narrow body for VNA operation
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(1.0, 0.8, 2.8),
            this.materials.forkliftRed
        );
        body.position.y = 0.6;
        body.castShadow = true;
        group.add(body);

        // Operator cabin
        const cabin = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 1.2, 1.0),
            this.materials.forkliftRed
        );
        cabin.position.set(0, 1.5, -0.6);
        group.add(cabin);

        // Very tall mast for high-bay
        const mastHeight = 6;
        [-0.35, 0.35].forEach(mx => {
            const mast = new THREE.Mesh(
                new THREE.BoxGeometry(0.12, mastHeight, 0.12),
                this.materials.forkliftMetal
            );
            mast.position.set(mx, mastHeight / 2 + 0.3, 1.2);
            group.add(mast);
        });

        // Multiple inner masts (triple stage)
        for (let stage = 0; stage < 2; stage++) {
            [-0.2 + stage * 0.05, 0.2 - stage * 0.05].forEach(mx => {
                const innerMast = new THREE.Mesh(
                    new THREE.BoxGeometry(0.08, mastHeight * (0.7 - stage * 0.2), 0.08),
                    this.materials.forkliftMetal
                );
                innerMast.position.set(mx, mastHeight * (0.5 - stage * 0.1), 1.2);
                group.add(innerMast);
            });
        }

        // Turret head (rotating fork assembly)
        const turretBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16),
            this.materials.forkliftMetal
        );
        turretBase.position.set(0, 3.5, 1.2);
        group.add(turretBase);

        // Fork carriage on turret
        const carriage = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.35, 0.2),
            this.materials.forkliftMetal
        );
        carriage.position.set(0, 3.5, 1.5);
        group.add(carriage);

        // Forks (rotated to side for turret operation)
        [-0.2, 0.2].forEach(fx => {
            const fork = new THREE.Mesh(
                new THREE.BoxGeometry(0.1, 0.05, 1.2),
                this.materials.forkliftMetal
            );
            fork.position.set(fx, 3.4, 2.0);
            group.add(fork);
        });

        // Load on forks
        const cargo = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.5, 0.8),
            this.materials.boxBlue
        );
        cargo.position.set(0, 3.7, 2.2);
        group.add(cargo);

        // Guide wheels (VNA guidance)
        const guideWheelGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12);
        [[0.55, 0.8], [-0.55, 0.8], [0.55, -1.2], [-0.55, -1.2]].forEach(([gx, gz]) => {
            const guide = new THREE.Mesh(guideWheelGeom, this.materials.tire);
            guide.rotation.x = Math.PI / 2;
            guide.position.set(gx, 0.8, gz);
            group.add(guide);
        });

        // Main wheels
        const wheelGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.15, 16);
        [[-0.45, 0], [0.45, 0]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(wheelGeom, this.materials.tire);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.25, wz);
            group.add(wheel);
        });

        // Automation sensors
        const sensorArray = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.15, 0.15),
            this.materials.forkliftDark
        );
        sensorArray.position.set(0, 0.9, 1.5);
        group.add(sensorArray);

        // Top beacon
        const beacon = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 0.2, 8),
            new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 0.5 })
        );
        beacon.position.set(0, mastHeight + 0.5, 1.2);
        group.add(beacon);

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        group.rotation.y = Math.PI / 5;
        this.warehouseGroup.add(group);
    }

    // Automation Info Kiosk for Portfolio Functions
    createAutomationInfoKiosk(x, z, label) {
        const group = new THREE.Group();

        // Kiosk stand
        const stand = new THREE.Mesh(
            new THREE.CylinderGeometry(0.15, 0.2, 1.2, 16),
            this.materials.forkliftMetal
        );
        stand.position.y = 0.6;
        group.add(stand);

        // Display panel (angled)
        const panel = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 1.0, 0.08),
            this.materials.monitor
        );
        panel.position.set(0, 1.5, 0.2);
        panel.rotation.x = -0.3;
        group.add(panel);

        // Screen
        const screen = new THREE.Mesh(
            new THREE.PlaneGeometry(1.4, 0.9),
            new THREE.MeshBasicMaterial({ color: 0x2288cc })
        );
        screen.position.set(0, 1.5, 0.25);
        screen.rotation.x = -0.3;
        group.add(screen);

        // Base
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.6, 0.1, 16),
            this.materials.forkliftDark
        );
        base.position.y = 0.05;
        group.add(base);

        // Decorative elements - icons on ground
        const iconPad = new THREE.Mesh(
            new THREE.CircleGeometry(1.2, 32),
            new THREE.MeshBasicMaterial({ color: 0x3366aa, transparent: true, opacity: 0.3 })
        );
        iconPad.rotation.x = -Math.PI / 2;
        iconPad.position.y = 0.02;
        group.add(iconPad);

        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    // Workflow Handoff Station
    createWorkflowHandoffStation(x, z) {
        const group = new THREE.Group();

        // Handoff zone floor marking
        const zoneMark = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 3),
            new THREE.MeshBasicMaterial({ color: 0x44aa44, transparent: true, opacity: 0.3 })
        );
        zoneMark.rotation.x = -Math.PI / 2;
        zoneMark.position.y = 0.02;
        group.add(zoneMark);

        // Divider line
        const divider = new THREE.Mesh(
            new THREE.PlaneGeometry(0.1, 3),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        divider.rotation.x = -Math.PI / 2;
        divider.position.y = 0.03;
        group.add(divider);

        // "AUTO" side label post
        const autoPost = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 1.5, 0.1),
            this.materials.forkliftOrange
        );
        autoPost.position.set(-1.5, 0.75, 0);
        group.add(autoPost);

        const autoSign = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.3, 0.05),
            new THREE.MeshStandardMaterial({ color: 0xff6600 })
        );
        autoSign.position.set(-1.5, 1.4, 0);
        group.add(autoSign);

        // "MANUAL" side label post
        const manualPost = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 1.5, 0.1),
            this.materials.chargerGreen
        );
        manualPost.position.set(1.5, 0.75, 0);
        group.add(manualPost);

        const manualSign = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.3, 0.05),
            new THREE.MeshStandardMaterial({ color: 0x44aa44 })
        );
        manualSign.position.set(1.5, 1.4, 0);
        group.add(manualSign);

        // Pallet in handoff zone
        const pallet = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.12, 1.0),
            this.materials.pallet
        );
        pallet.position.set(0, 0.06, 0);
        group.add(pallet);

        // Box on pallet
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 0.6, 0.8),
            this.materials.boxWhite
        );
        box.position.set(0, 0.45, 0);
        group.add(box);

        // Sensor post for zone detection
        const sensorPost = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 2, 8),
            this.materials.forkliftMetal
        );
        sensorPost.position.set(-1.8, 1, 1.3);
        group.add(sensorPost);

        const sensorHead = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 0.25, 0.25),
            this.materials.forkliftDark
        );
        sensorHead.position.set(-1.8, 2, 1.3);
        group.add(sensorHead);

        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    // MATIC Charging Station
    createMATICChargingStation(x, z) {
        const group = new THREE.Group();

        // Charging bay floor
        const bayFloor = new THREE.Mesh(
            new THREE.PlaneGeometry(4, 3),
            new THREE.MeshBasicMaterial({ color: 0x2255aa, transparent: true, opacity: 0.4 })
        );
        bayFloor.rotation.x = -Math.PI / 2;
        bayFloor.position.y = 0.02;
        group.add(bayFloor);

        // Main charging unit
        const chargerBody = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 2, 0.6),
            this.materials.chargerWhite
        );
        chargerBody.position.set(0, 1, -1.2);
        chargerBody.castShadow = true;
        group.add(chargerBody);

        // Display screen
        const display = new THREE.Mesh(
            new THREE.PlaneGeometry(0.8, 0.5),
            this.materials.screen
        );
        display.position.set(0, 1.5, -0.89);
        group.add(display);

        // Charging connectors
        [-0.4, 0.4].forEach(cx => {
            const connector = new THREE.Mesh(
                new THREE.CylinderGeometry(0.08, 0.1, 0.3, 8),
                this.materials.forkliftMetal
            );
            connector.rotation.x = Math.PI / 2;
            connector.position.set(cx, 0.5, -0.75);
            group.add(connector);
        });

        // Status indicators
        for (let i = 0; i < 3; i++) {
            const indicator = new THREE.Mesh(
                new THREE.SphereGeometry(0.08, 8, 8),
                new THREE.MeshBasicMaterial({ color: i === 1 ? 0x00ff00 : 0x00aa00 })
            );
            indicator.position.set(-0.4 + i * 0.4, 1.8, -0.89);
            group.add(indicator);
        }

        // Charging cable coil
        const cableCoil = new THREE.Mesh(
            new THREE.TorusGeometry(0.2, 0.04, 8, 16),
            this.materials.forkliftDark
        );
        cableCoil.position.set(0.6, 0.5, -0.9);
        cableCoil.rotation.y = Math.PI / 2;
        group.add(cableCoil);

        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    // AGV Path Markings
    createAGVPathMarkings(baseX, baseZ) {
        const pathMaterial = new THREE.MeshBasicMaterial({ color: 0x4488ff, transparent: true, opacity: 0.5 });

        // Horizontal paths
        [[-32, 28], [-40, 16]].forEach(([z, length]) => {
            const path = new THREE.Mesh(
                new THREE.PlaneGeometry(length, 0.4),
                pathMaterial
            );
            path.rotation.x = -Math.PI / 2;
            path.position.set(baseX, 0.015, z);
            this.warehouseGroup.add(path);
        });

        // Vertical paths
        [[-25, 10], [5, 10]].forEach(([x, length]) => {
            const path = new THREE.Mesh(
                new THREE.PlaneGeometry(0.4, length),
                pathMaterial
            );
            path.rotation.x = -Math.PI / 2;
            path.position.set(x, 0.015, -38);
            this.warehouseGroup.add(path);
        });

        // Path intersection dots
        [[-25, -32], [-25, -44], [-10, -32], [-10, -44], [5, -32], [5, -44]].forEach(([px, pz]) => {
            const dot = new THREE.Mesh(
                new THREE.CircleGeometry(0.5, 16),
                pathMaterial
            );
            dot.rotation.x = -Math.PI / 2;
            dot.position.set(px, 0.016, pz);
            this.warehouseGroup.add(dot);
        });
    }

    // ==========================================
    // FULL PORTFOLIO SECTION - Main Warehouse with Vehicle Displays
    // Grid layout distributing vehicles across full width
    // ==========================================
    createFullPortfolioSection() {
        const baseX = 0;
        const baseZ = 5;

        // Initialize animation arrays
        this.conveyorBoxes = [];
        this.animatedForklifts = [];

        // Floor
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(85, 65),
            this.materials.floor
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(baseX + 5, 0.01, baseZ);
        this.warehouseGroup.add(floor);

        // === ZONE 1: Storage Racks (4x3 grid, left-center) ===
        this.createCentralRackZone(baseX - 5, baseZ - 5);

        // === ZONE 2: Conveyor from Docking Bay to Shelves (keep animation) ===
        this.createDockToShelfConveyor(baseX, baseZ);

        // === ZONE 3: Working Forklift - Counterbalance (animated) ===
        this.createWorkingForklift(baseX - 5, baseZ - 5);

        // === ZONE 4: Loading Docks (front) ===
        this.createLoadingDockZone(baseX, baseZ + 30);

        // === ZONE 5: Pallet Trucks (south row) ===
        this.createPalletTruck(17, -20);
        this.createPalletTruckRideOn(32, -20);

        // === ZONE 6: Heavy Equipment (east, near docks) ===
        this.createHeavyTruck(45, 30, -Math.PI / 4);
        this.createCounterbalanceForklift(30, 32, -Math.PI / 4);

        // === ZONE 7: Tow Tractor (east mid, train extends toward -z) ===
        this.createTowTractor(38, 24, 0);

        // === ZONE 8: Order Picking Area (right side) ===
        this.createOrderPickingZone(baseX + 35, baseZ - 2);

        // === ZONE 9: High-Reach Vehicles (south row) ===
        this.createReachTruck(-28, -20, 0);
        this.createTurretTruck(-13, -20, 0);
        this.createPalletStacker(2, -20);

        // === ZONE 10: Staging Area (moved to front-left, away from counterbalance) ===
        this.createStagingArea(baseX - 38, baseZ + 20);
    }

    createCentralRackZone(x, z) {
        // 4x3 orange rack grid (spacing adjusted for scaled assets)
        const rackSpacingX = 8;  // Increased from 6 to account for 1.4x scale
        const rackSpacingZ = 7.5;  // Increased from 5.5 to account for 1.4x scale
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 4; col++) {
                this.createStorageRack(x - 8 + col * rackSpacingX, z + row * rackSpacingZ);
            }
        }
    }

    // Legacy zone functions removed - vehicles now placed directly in createFullPortfolioSection

    // ==========================================
    // VEHICLE MODELS
    // ==========================================

    // Pallet Truck (Ride-On)
    createPalletTruckRideOn(x, z, rotation = 0) {
        const group = new THREE.Group();

        // Fork base - longer
        const forkBase = new THREE.Mesh(
            new THREE.BoxGeometry(1.6, 0.2, 4.4),
            this.materials.forkliftRed
        );
        forkBase.position.y = 0.24;
        group.add(forkBase);

        // Forks
        [-0.5, 0.5].forEach(fx => {
            const fork = new THREE.Mesh(
                new THREE.BoxGeometry(0.28, 0.16, 3.2),
                this.materials.forkliftMetal
            );
            fork.position.set(fx, 0.12, 0.6);
            group.add(fork);
        });

        // Operator platform
        const platform = new THREE.Mesh(
            new THREE.BoxGeometry(1.4, 0.3, 1.2),
            this.materials.forkliftDark
        );
        platform.position.set(0, 0.4, -1.8);
        group.add(platform);

        // Control column
        const column = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 1.6, 0.5),
            this.materials.forkliftRed
        );
        column.position.set(0, 1.2, -1.1);
        group.add(column);

        // Handle bars
        const handleBar = new THREE.Mesh(
            new THREE.BoxGeometry(1.0, 0.1, 0.1),
            this.materials.forkliftMetal
        );
        handleBar.position.set(0, 2.0, -1.1);
        group.add(handleBar);

        // Wheels
        const wheelGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.24, 16);
        // Front wheels (under forks)
        [[-0.7, 1.8], [0.7, 1.8]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(wheelGeom, this.materials.tire);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.3, wz);
            group.add(wheel);
        });
        // Rear wheels (under platform)
        [[-0.6, -1.8], [0.6, -1.8]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(wheelGeom, this.materials.tire);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.3, wz);
            group.add(wheel);
        });

        // Pallet on forks
        this.addPalletWithBoxes(group, 0, 0.44, 0.8);

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        group.rotation.y = rotation;
        this.warehouseGroup.add(group);
        return group;
    }

    // Tow Tractor with tugger train
    createTowTractor(x, z, rotation = 0) {
        const group = new THREE.Group();

        // Tractor body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.6, 1.8),
            this.materials.forkliftRed
        );
        body.position.y = 0.5;
        body.castShadow = true;
        group.add(body);

        // Cabin
        const cabin = new THREE.Mesh(
            new THREE.BoxGeometry(1.0, 0.8, 0.9),
            this.materials.forkliftDark
        );
        cabin.position.set(0, 1.1, -0.3);
        group.add(cabin);

        // Tow hitch
        const hitch = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 0.15, 0.3),
            this.materials.forkliftMetal
        );
        hitch.position.set(0, 0.3, -1.0);
        group.add(hitch);

        // Wheels
        const wheelGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 16);
        [[-0.55, 0.5], [0.55, 0.5], [-0.55, -0.5], [0.55, -0.5]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(wheelGeom, this.materials.tire);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.2, wz);
            group.add(wheel);
        });

        // Beacon light
        const beacon = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 0.12, 8),
            new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 0.3 })
        );
        beacon.position.set(0, 1.55, -0.3);
        group.add(beacon);

        // Tugger train (3 carts)
        for (let i = 0; i < 3; i++) {
            const cart = this.createTuggerCart();
            cart.position.set(0, 0, -2.2 - i * 2.0);
            group.add(cart);
        }

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        group.rotation.y = rotation;
        this.warehouseGroup.add(group);
        return group;
    }

    createTuggerCart() {
        const cart = new THREE.Group();

        // Cart platform
        const platform = new THREE.Mesh(
            new THREE.BoxGeometry(1.0, 0.1, 1.4),
            this.materials.forkliftMetal
        );
        platform.position.y = 0.35;
        cart.add(platform);

        // Sides
        const side = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 0.3, 1.3),
            this.materials.forkliftMetal
        );
        side.position.set(-0.47, 0.55, 0);
        cart.add(side);
        const side2 = side.clone();
        side2.position.x = 0.47;
        cart.add(side2);

        // Wheels
        const wheelGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 12);
        [[-0.4, 0.5], [0.4, 0.5], [-0.4, -0.5], [0.4, -0.5]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(wheelGeom, this.materials.tire);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.12, wz);
            cart.add(wheel);
        });

        // Boxes on cart
        const boxColors = [this.materials.boxBrown, this.materials.boxWhite, this.materials.boxGrey];
        for (let i = 0; i < 2; i++) {
            const box = new THREE.Mesh(
                new THREE.BoxGeometry(0.4, 0.35, 0.5),
                boxColors[Math.floor(Math.random() * boxColors.length)]
            );
            box.position.set(-0.2 + i * 0.4, 0.6, 0);
            cart.add(box);
        }

        // Coupling
        const coupling = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.1, 0.4),
            this.materials.forkliftMetal
        );
        coupling.position.set(0, 0.3, 0.9);
        cart.add(coupling);

        return cart;
    }

    // Reach Truck - narrow body, tall mast
    // Turret Truck - VNA with rotating turret head
    createTurretTruck(x, z, rotation = 0) {
        const group = new THREE.Group();

        // Narrow base
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 0.25, 2.4),
            this.materials.forkliftRed
        );
        base.position.y = 0.2;
        group.add(base);

        // Operator cabin (enclosed)
        const cabin = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 1.8, 1.0),
            this.materials.forkliftRed
        );
        cabin.position.set(0, 1.2, -0.5);
        group.add(cabin);

        // Cabin windows
        const window1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.02, 0.6, 0.6),
            this.materials.glass
        );
        window1.position.set(0.4, 1.4, -0.5);
        group.add(window1);
        const window2 = window1.clone();
        window2.position.x = -0.4;
        group.add(window2);

        // Very tall mast
        const mastHeight = 5.5;
        [-0.25, 0.25].forEach(mx => {
            const mast = new THREE.Mesh(
                new THREE.BoxGeometry(0.07, mastHeight, 0.07),
                this.materials.forkliftMetal
            );
            mast.position.set(mx, mastHeight / 2, 0.9);
            group.add(mast);
        });

        // Turret head (rotatable fork assembly)
        const turretHead = new THREE.Group();

        const turretBase = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 0.15, 16),
            this.materials.forkliftMetal
        );
        turretHead.add(turretBase);

        // Forks on turret (rotated 45 degrees to show turret capability)
        const forkAssembly = new THREE.Group();
        [-0.15, 0.15].forEach(fx => {
            const fork = new THREE.Mesh(
                new THREE.BoxGeometry(0.06, 0.04, 1.0),
                this.materials.forkliftMetal
            );
            fork.position.set(fx, -0.1, 0.5);
            forkAssembly.add(fork);
        });
        const forkBack = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 0.25, 0.08),
            this.materials.forkliftMetal
        );
        forkBack.position.set(0, -0.05, 0);
        forkAssembly.add(forkBack);

        forkAssembly.rotation.y = Math.PI / 4; // Rotated to show turret function
        turretHead.add(forkAssembly);

        turretHead.position.set(0, 3.5, 0.9);
        group.add(turretHead);

        // Wheels
        const wheelGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 12);
        [[-0.35, -0.9], [0.35, -0.9], [-0.35, 0.9], [0.35, 0.9]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(wheelGeom, this.materials.tire);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.12, wz);
            group.add(wheel);
        });

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        group.rotation.y = rotation;
        this.warehouseGroup.add(group);
        return group;
    }

    // Pallet Stacker - straddle legs, medium mast
    // Pallet Stacker - built at final size, no scaling
    createPalletStacker(x, z, rotation = 0) {
        const group = new THREE.Group();

        // Straddle legs
        [-0.6, 0.6].forEach(lx => {
            const leg = new THREE.Mesh(
                new THREE.BoxGeometry(0.22, 0.3, 2.1),
                this.materials.forkliftRed
            );
            leg.position.set(lx, 0.15, 0.45);
            group.add(leg);
        });

        // Main body/power unit
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(1.05, 1.2, 0.9),
            this.materials.forkliftRed
        );
        body.position.set(0, 0.9, -0.75);
        group.add(body);

        // Mast
        const mastHeight = 4.5;
        [-0.3, 0.3].forEach(mx => {
            const mast = new THREE.Mesh(
                new THREE.BoxGeometry(0.09, mastHeight, 0.09),
                this.materials.forkliftMetal
            );
            mast.position.set(mx, mastHeight / 2 + 0.3, 0.15);
            group.add(mast);
        });

        // Carriage
        const carriage = new THREE.Mesh(
            new THREE.BoxGeometry(0.75, 0.45, 0.12),
            this.materials.forkliftMetal
        );
        carriage.position.set(0, 2.25, 0.22);
        group.add(carriage);

        // Forks
        [-0.22, 0.22].forEach(fx => {
            const fork = new THREE.Mesh(
                new THREE.BoxGeometry(0.12, 0.08, 1.5),
                this.materials.forkliftMetal
            );
            fork.position.set(fx, 2.0, 0.9);
            group.add(fork);
        });

        // Handle
        const handle = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.06, 0.06),
            this.materials.forkliftMetal
        );
        handle.position.set(0, 1.65, -1.2);
        group.add(handle);
        const handlePost = new THREE.Mesh(
            new THREE.BoxGeometry(0.06, 0.6, 0.06),
            this.materials.forkliftMetal
        );
        handlePost.position.set(0, 1.35, -1.2);
        group.add(handlePost);

        // Wheels
        const wheelGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.12, 12);
        // Straddle wheels
        [[-0.6, 1.35], [0.6, 1.35]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(wheelGeom, this.materials.tire);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.15, wz);
            group.add(wheel);
        });
        // Rear wheels
        [[-0.38, -1.05], [0.38, -1.05]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.15, 12), this.materials.tire);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.18, wz);
            group.add(wheel);
        });

        // Pallet on forks
        this.addPalletWithBoxes(group, 0, 2.1, 1.05, 0.9);

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        group.rotation.y = rotation;
        this.warehouseGroup.add(group);
        return group;
    }

    // Order Picker - platform that elevates with operator
    createOrderPickerVehicle(x, z, rotation = 0) {
        const group = new THREE.Group();

        // Base
        const base = new THREE.Mesh(
            new THREE.BoxGeometry(1.0, 0.25, 1.8),
            this.materials.forkliftRed
        );
        base.position.y = 0.2;
        group.add(base);

        // Mast
        const mastHeight = 4.0;
        [-0.3, 0.3].forEach(mx => {
            const mast = new THREE.Mesh(
                new THREE.BoxGeometry(0.08, mastHeight, 0.08),
                this.materials.forkliftMetal
            );
            mast.position.set(mx, mastHeight / 2, 0.6);
            group.add(mast);
        });

        // Elevated operator platform
        const platformHeight = 2.0;
        const platform = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 0.1, 1.0),
            this.materials.forkliftMetal
        );
        platform.position.set(0, platformHeight, 0.3);
        group.add(platform);

        // Platform railings
        const railGeom = new THREE.BoxGeometry(0.03, 0.5, 0.03);
        [[-0.4, -0.4], [0.4, -0.4], [-0.4, 0.4], [0.4, 0.4]].forEach(([rx, rz]) => {
            const rail = new THREE.Mesh(railGeom, this.materials.forkliftMetal);
            rail.position.set(rx, platformHeight + 0.3, 0.3 + rz);
            group.add(rail);
        });

        // Top rail
        const topRail = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 0.03, 0.03),
            this.materials.forkliftMetal
        );
        topRail.position.set(0, platformHeight + 0.55, -0.1);
        group.add(topRail);

        // Forks (at platform level)
        [-0.2, 0.2].forEach(fx => {
            const fork = new THREE.Mesh(
                new THREE.BoxGeometry(0.08, 0.05, 0.8),
                this.materials.forkliftMetal
            );
            fork.position.set(fx, platformHeight - 0.1, 1.0);
            group.add(fork);
        });

        // Control unit on platform
        const controls = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.4, 0.2),
            this.materials.forkliftDark
        );
        controls.position.set(0.25, platformHeight + 0.25, 0);
        group.add(controls);

        // Wheels
        const wheelGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 12);
        [[-0.4, -0.7], [0.4, -0.7], [-0.4, 0.7], [0.4, 0.7]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(wheelGeom, this.materials.tire);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.15, wz);
            group.add(wheel);
        });

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        group.rotation.y = rotation;
        this.warehouseGroup.add(group);
        return group;
    }

    // Heavy Truck - large counterbalance for heavy loads
    createHeavyTruck(x, z, rotation = 0) {
        const group = new THREE.Group();

        // Large body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(2.0, 1.2, 3.0),
            this.materials.forkliftRed
        );
        body.position.y = 0.9;
        body.castShadow = true;
        group.add(body);

        // Heavy counterweight
        const counter = new THREE.Mesh(
            new THREE.BoxGeometry(1.9, 1.0, 1.0),
            this.materials.forkliftRed
        );
        counter.position.set(0, 0.7, -1.8);
        counter.castShadow = true;
        group.add(counter);

        // Large cabin
        const cabin = new THREE.Mesh(
            new THREE.BoxGeometry(1.6, 1.4, 1.4),
            this.materials.forkliftDark
        );
        cabin.position.set(0, 2.0, -0.5);
        group.add(cabin);

        // Cabin windows
        const frontWindow = new THREE.Mesh(
            new THREE.BoxGeometry(1.4, 0.8, 0.02),
            this.materials.glass
        );
        frontWindow.position.set(0, 2.2, 0.2);
        group.add(frontWindow);

        // Heavy mast
        const mastHeight = 3.5;
        [-0.5, 0, 0.5].forEach(mx => {
            const mast = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, mastHeight, 0.15),
                this.materials.forkliftMetal
            );
            mast.position.set(mx, mastHeight / 2 + 0.3, 1.6);
            group.add(mast);
        });

        // Heavy duty forks
        [-0.4, 0.4].forEach(fx => {
            const fork = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.1, 1.8),
                this.materials.forkliftMetal
            );
            fork.position.set(fx, 0.2, 2.4);
            group.add(fork);
        });

        // Large wheels
        const wheelGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 16);
        [[-0.85, 0.8], [0.85, 0.8], [-0.85, -1.2], [0.85, -1.2]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(wheelGeom, this.materials.tire);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.35, wz);
            group.add(wheel);
        });

        // Beacon
        const beacon = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 0.18, 8),
            new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 0.3 })
        );
        beacon.position.set(0, 2.8, -0.5);
        group.add(beacon);

        // Heavy pallet with large load
        const heavyPallet = new THREE.Mesh(
            new THREE.BoxGeometry(1.4, 0.15, 1.2),
            this.materials.pallet
        );
        heavyPallet.position.set(0, 0.35, 2.6);
        group.add(heavyPallet);

        const heavyLoad = new THREE.Mesh(
            new THREE.BoxGeometry(1.3, 1.0, 1.1),
            this.materials.boxGrey
        );
        heavyLoad.position.set(0, 0.95, 2.6);
        heavyLoad.castShadow = true;
        group.add(heavyLoad);

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        group.rotation.y = rotation;
        this.warehouseGroup.add(group);
        return group;
    }

    // Helper: Add pallet with boxes to a group
    addPalletWithBoxes(group, x, y, z, scale = 1.0) {
        const pallet = new THREE.Mesh(
            new THREE.BoxGeometry(1.0 * scale, 0.1 * scale, 0.8 * scale),
            this.materials.pallet
        );
        pallet.position.set(x, y, z);
        group.add(pallet);

        // Stack of boxes
        const boxMaterials = [this.materials.boxBrown, this.materials.boxWhite, this.materials.boxGrey];
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 2; col++) {
                const box = new THREE.Mesh(
                    new THREE.BoxGeometry(0.35 * scale, 0.3 * scale, 0.35 * scale),
                    boxMaterials[Math.floor(Math.random() * boxMaterials.length)]
                );
                box.position.set(
                    x - 0.18 * scale + col * 0.36 * scale,
                    y + 0.1 * scale + row * 0.32 * scale + 0.15 * scale,
                    z
                );
                box.castShadow = true;
                group.add(box);
            }
        }
    }

    createDockToShelfConveyor(baseX, baseZ) {
        // Simple L-shaped conveyor from docking bay to shelf entrance
        // Path: Dock door -> straight down -> turn left -> into shelf aisle

        // Define waypoints for clean L-shape path
        // Adjusted z values to prevent intersection with scaled racks (racks extend to z~16.4)
        this.conveyorPath = [
            { x: baseX + 10, z: baseZ + 33 },   // Start: at dock door
            { x: baseX + 10, z: baseZ + 20 },   // Straight down (along -Z) - moved further from racks
            { x: baseX - 8, z: baseZ + 20 },    // Turn left, go horizontal (along -X) to shelf area
        ];

        // Create conveyor segments along the path
        for (let i = 0; i < this.conveyorPath.length - 1; i++) {
            const start = this.conveyorPath[i];
            const end = this.conveyorPath[i + 1];

            const dx = end.x - start.x;
            const dz = end.z - start.z;
            const length = Math.sqrt(dx * dx + dz * dz);
            const midX = (start.x + end.x) / 2;
            const midZ = (start.z + end.z) / 2;

            // Conveyor segment is built along X axis by default
            // Rotation = 0 means belt runs along X (horizontal)
            // Rotation = PI/2 means belt runs along Z (vertical)
            const isVertical = Math.abs(dz) > Math.abs(dx);
            const rotation = isVertical ? Math.PI / 2 : 0;

            this.createConveyorSegment(midX, midZ, length, rotation);
        }

        // Corner piece at the turn
        this.createConveyorCorner(this.conveyorPath[1].x, this.conveyorPath[1].z);

        // End platform where boxes drop off
        this.createDropOffPlatform(this.conveyorPath[2].x - 2, this.conveyorPath[2].z);

        // Create animated boxes along the path
        this.createPathBoxes();
    }

    createDropOffPlatform(x, z) {
        // Larger platform at conveyor end with pile of boxes
        const platform = new THREE.Mesh(
            new THREE.BoxGeometry(5, 0.3, 4),
            this.materials.conveyor
        );
        platform.position.set(x, 0.4, z);
        this.warehouseGroup.add(platform);

        // Pile of boxes waiting to be picked up
        const boxConfigs = [
            // Bottom row
            { x: -1.5, y: 0.8, z: -0.8, color: 'boxBrown' },
            { x: -0.5, y: 0.8, z: -0.8, color: 'boxWhite' },
            { x: 0.5, y: 0.8, z: -0.8, color: 'boxGrey' },
            { x: 1.5, y: 0.8, z: -0.8, color: 'boxBrown' },
            { x: -1.0, y: 0.8, z: 0.2, color: 'boxWhite' },
            { x: 0, y: 0.8, z: 0.2, color: 'boxBrown' },
            { x: 1.0, y: 0.8, z: 0.2, color: 'boxGrey' },
            { x: -0.5, y: 0.8, z: 1.2, color: 'boxBrown' },
            { x: 0.5, y: 0.8, z: 1.2, color: 'boxWhite' },
            // Second row (stacked)
            { x: -1.0, y: 1.35, z: -0.8, color: 'boxGrey' },
            { x: 0, y: 1.35, z: -0.8, color: 'boxBrown' },
            { x: 1.0, y: 1.35, z: -0.8, color: 'boxWhite' },
            { x: -0.5, y: 1.35, z: 0.2, color: 'boxBrown' },
            { x: 0.5, y: 1.35, z: 0.2, color: 'boxGrey' },
            // Top row
            { x: 0, y: 1.9, z: -0.8, color: 'boxWhite' },
            { x: 0, y: 1.9, z: 0.2, color: 'boxBrown' },
        ];

        boxConfigs.forEach(cfg => {
            const box = new THREE.Mesh(
                new THREE.BoxGeometry(0.7, 0.5, 0.5),
                this.materials[cfg.color]
            );
            box.position.set(x + cfg.x, cfg.y, z + cfg.z);
            box.rotation.y = Math.random() * 0.2 - 0.1;  // Slight random rotation
            box.castShadow = true;
            this.warehouseGroup.add(box);
        });
    }

    createPathBoxes() {
        // Boxes that travel along the conveyor path
        const boxCount = 5;

        for (let i = 0; i < boxCount; i++) {
            const box = new THREE.Mesh(
                new THREE.BoxGeometry(0.7, 0.5, 0.5),
                i % 2 === 0 ? this.materials.boxBrown : this.materials.boxWhite
            );
            box.castShadow = true;
            box.userData = {
                progress: i / boxCount
            };
            this.warehouseGroup.add(box);
            this.conveyorBoxes.push(box);
        }
    }

    updatePathBoxPosition(box) {
        if (!this.conveyorPath || this.conveyorPath.length < 2) return;

        const progress = box.userData.progress;

        // Calculate total path length
        let totalLength = 0;
        const segmentLengths = [];
        for (let i = 0; i < this.conveyorPath.length - 1; i++) {
            const start = this.conveyorPath[i];
            const end = this.conveyorPath[i + 1];
            const dx = end.x - start.x;
            const dz = end.z - start.z;
            const length = Math.sqrt(dx * dx + dz * dz);
            segmentLengths.push(length);
            totalLength += length;
        }

        // Find position along path based on progress
        let targetDist = progress * totalLength;
        let accumulatedDist = 0;

        for (let i = 0; i < segmentLengths.length; i++) {
            if (accumulatedDist + segmentLengths[i] >= targetDist) {
                const start = this.conveyorPath[i];
                const end = this.conveyorPath[i + 1];
                const segmentProgress = (targetDist - accumulatedDist) / segmentLengths[i];

                const px = start.x + (end.x - start.x) * segmentProgress;
                const pz = start.z + (end.z - start.z) * segmentProgress;

                // Position box on top of conveyor belt
                box.position.set(px, 0.95, pz);
                return;
            }
            accumulatedDist += segmentLengths[i];
        }

        // If past the end, wrap to start
        const firstPoint = this.conveyorPath[0];
        box.position.set(firstPoint.x, 0.95, firstPoint.z);
    }

    createWorkingForklift(shelfX, shelfZ) {
        // Forklift that picks up boxes from conveyor and brings them to shelves
        // Route goes AROUND the LEFT side of shelves to avoid conveyor belt

        // Shelf aisle position - centered between scaled rack rows
        // Racks at z=0, 7.5, 15 with scaled depth 2.8, so aisle between rows 1&2 is at z~11.25
        const aisleZ = shelfZ + 11.25;
        const shelfPoint = { x: -5, z: aisleZ };

        // Exit point - to the LEFT of all shelves (scaled shelves start around x=-17)
        const exitLeft = { x: -28, z: aisleZ };

        // Top left corner - go up on the left side (away from conveyor)
        // Conveyor is now at z=25, so go to z=25
        const topLeft = { x: -28, z: 25 };

        // Pickup point at conveyor drop-off (approach from the left)
        // Dropoff platform is at x=-10, z=25
        const pickupPoint = { x: -14, z: 25 };

        const forklift = this.createAnimatedForklift(shelfPoint.x, shelfPoint.z);

        // Create a box that the forklift will carry (initially hidden)
        const carriedBox = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.5, 0.5),
            this.materials.boxBrown
        );
        carriedBox.position.set(0, 0.4, 1.8);  // On the forks
        carriedBox.visible = false;
        forklift.add(carriedBox);

        forklift.userData = {
            type: 'working',
            carriedBox: carriedBox,
            // Route goes around LEFT side: shelf -> exit left -> top left -> pickup -> return same way
            waypoints: [
                shelfPoint,      // 0: In the aisle (start/end)
                exitLeft,        // 1: Exit to the left of shelves
                topLeft,         // 2: Top left corner
                pickupPoint,     // 3: At conveyor pickup (approached from left)
                topLeft,         // 4: Return via top left
                exitLeft,        // 5: Back to exit point
                shelfPoint       // 6: Back to shelf aisle
            ],
            currentWaypoint: 0,
            progress: 0,
            state: 'moving',  // 'moving', 'picking', 'placing'
            stateTimer: 0,
            hasBox: false,
            pickupIndex: 3,    // Waypoint index for pickup
            dropoffIndex: 0    // Waypoint index for drop-off
        };

        forklift.rotation.y = -Math.PI / 2;  // Face left initially
        this.workingForklift = forklift;
    }

    createConveyorSegment(x, z, length, rotation) {
        const group = new THREE.Group();

        // Main frame
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(length, 0.4, 1),
            this.materials.conveyor
        );
        frame.position.y = 0.5;
        frame.castShadow = true;
        group.add(frame);

        // Belt surface
        const belt = new THREE.Mesh(
            new THREE.BoxGeometry(length - 0.1, 0.05, 0.8),
            this.materials.conveyorBelt
        );
        belt.position.y = 0.73;
        group.add(belt);

        // Support legs
        const legGeom = new THREE.BoxGeometry(0.1, 0.5, 0.1);
        for (let i = -length / 2 + 1.5; i <= length / 2 - 1.5; i += 3) {
            [-0.4, 0.4].forEach(lz => {
                const leg = new THREE.Mesh(legGeom, this.materials.rack);
                leg.position.set(i, 0.25, lz);
                group.add(leg);
            });
        }

        group.position.set(x, 0, z);
        group.rotation.y = rotation;
        this.warehouseGroup.add(group);
    }

    createConveyorCorner(x, z) {
        const corner = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.4, 1.2),
            this.materials.conveyor
        );
        corner.position.set(x, 0.5, z);
        this.warehouseGroup.add(corner);

        const belt = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.05, 1),
            this.materials.conveyorBelt
        );
        belt.position.set(x, 0.73, z);
        this.warehouseGroup.add(belt);
    }

    // Old closed-loop conveyor functions removed - replaced by S-pattern conveyor

    createAnimatedForklift(x, z) {
        const group = new THREE.Group();

        // Body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(1.4, 0.9, 2.2),
            this.materials.forkliftRed
        );
        body.position.y = 0.65;
        body.castShadow = true;
        group.add(body);

        // Cabin
        const cabin = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 1.1, 1.1),
            this.materials.forkliftDark
        );
        cabin.position.set(0, 1.4, -0.3);
        group.add(cabin);

        // Counterweight
        const counter = new THREE.Mesh(
            new THREE.BoxGeometry(1.3, 0.7, 0.7),
            this.materials.forkliftRed
        );
        counter.position.set(0, 0.55, -1.3);
        group.add(counter);

        // Mast
        [-0.4, 0, 0.4].forEach(mx => {
            const mast = new THREE.Mesh(
                new THREE.BoxGeometry(0.12, 2.5, 0.12),
                this.materials.forkliftMetal
            );
            mast.position.set(mx, 1.4, 1.2);
            group.add(mast);
        });

        // Forks
        [-0.3, 0.3].forEach(fx => {
            const fork = new THREE.Mesh(
                new THREE.BoxGeometry(0.1, 0.06, 1.5),
                this.materials.forkliftMetal
            );
            fork.position.set(fx, 0.13, 1.8);
            group.add(fork);
        });

        // Wheels
        const wheelGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 16);
        [[-0.65, 0.7], [0.65, 0.7], [-0.45, -0.9], [0.45, -0.9]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(wheelGeom, this.materials.tire);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.25, wz);
            group.add(wheel);
        });

        // Beacon
        const beacon = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 0.15, 8),
            new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 0.3 })
        );
        beacon.position.set(0, 2.05, -0.3);
        group.add(beacon);

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        group.rotation.y = Math.PI;
        this.warehouseGroup.add(group);
        return group;
    }

    // Animation update - call from main loop
    updateAnimations(time) {
        // Animate conveyor boxes along the path (slower speed)
        if (this.conveyorBoxes && this.conveyorBoxes.length > 0) {
            this.conveyorBoxes.forEach(box => {
                // Move box along path - slower speed
                box.userData.progress += 0.0008;

                // Loop back to start when reaching end
                if (box.userData.progress >= 1) {
                    box.userData.progress = 0;
                }

                this.updatePathBoxPosition(box);
            });
        }

        // Animate working forklift (pickup from conveyor, drop at shelf)
        if (this.workingForklift) {
            const fl = this.workingForklift;
            const data = fl.userData;
            const speed = 0.003;  // Slower forklift speed

            if (data.state === 'moving') {
                // Update progress along current segment
                data.progress += speed;

                // Check if reached next waypoint
                if (data.progress >= 1) {
                    data.progress = 0;
                    data.currentWaypoint = (data.currentWaypoint + 1) % data.waypoints.length;

                    // Check if we've reached pickup point
                    if (data.currentWaypoint === data.pickupIndex) {
                        data.state = 'picking';
                        data.stateTimer = 0;
                    }
                    // Check if we've reached drop-off point (only when returning with box)
                    else if (data.currentWaypoint === data.dropoffIndex && data.hasBox) {
                        data.state = 'placing';
                        data.stateTimer = 0;
                    }
                }

                // Get current and next waypoint AFTER potential update
                const currentIdx = data.currentWaypoint;
                const nextIdx = (currentIdx + 1) % data.waypoints.length;
                const current = data.waypoints[currentIdx];
                const next = data.waypoints[nextIdx];

                // Interpolate position
                const currentX = current.x + (next.x - current.x) * data.progress;
                const currentZ = current.z + (next.z - current.z) * data.progress;
                fl.position.x = currentX;
                fl.position.z = currentZ;

                // Calculate direction and face direction of movement
                const dx = next.x - current.x;
                const dz = next.z - current.z;
                if (Math.abs(dx) > Math.abs(dz)) {
                    fl.rotation.y = dx > 0 ? Math.PI / 2 : -Math.PI / 2;
                } else {
                    fl.rotation.y = dz > 0 ? 0 : Math.PI;
                }

            } else if (data.state === 'picking') {
                // Pause at conveyor to pick up box
                data.stateTimer += 16;
                if (data.stateTimer > 1200) {  // Longer pause
                    // Pick up the box
                    data.hasBox = true;
                    data.carriedBox.visible = true;
                    data.state = 'moving';
                    data.stateTimer = 0;
                }

            } else if (data.state === 'placing') {
                // Pause at shelf to place box
                data.stateTimer += 16;
                if (data.stateTimer > 1200) {  // Longer pause
                    // Drop the box
                    data.hasBox = false;
                    data.carriedBox.visible = false;
                    data.state = 'moving';
                    data.stateTimer = 0;
                }
            }
        }
    }

    createOrderPickingZone(x, z) {
        // Pick-to-light shelving units - spread further apart
        for (let row = 0; row < 3; row++) {
            this.createPickingShelf(x + 3, z - 6 + row * 5);
        }

        // Order Picker Vehicle - elevated platform truck (moved further from shelves)
        this.createOrderPickerVehicle(x - 8, z, -Math.PI / 6);

        // Picking carts - moved to better positions
        this.createPickingCart(x - 8, z - 5);
        this.createPickingCart(x - 8, z + 5);
    }

    createPickingShelf(x, z) {
        const group = new THREE.Group();
        const width = 6;
        const height = 2.5;

        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, 0.8),
            this.materials.rack
        );
        frame.position.y = height / 2;
        group.add(frame);

        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 8; col++) {
                const bin = new THREE.Mesh(
                    new THREE.BoxGeometry(0.6, 0.5, 0.5),
                    Math.random() > 0.3 ? this.materials.boxWhite : this.materials.boxGrey
                );
                bin.position.set(-width / 2 + 0.5 + col * 0.75, 0.5 + row * 0.7, 0);
                group.add(bin);
            }
        }

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    createPickingCart(x, z) {
        const group = new THREE.Group();

        const cart = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.8, 0.8),
            this.materials.forkliftMetal
        );
        cart.position.y = 0.6;
        group.add(cart);

        const handle = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 0.6, 0.05),
            this.materials.forkliftMetal
        );
        handle.position.set(0, 1.1, -0.35);
        group.add(handle);

        const wheelGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 8);
        [[-0.5, -0.3], [0.5, -0.3], [-0.5, 0.3], [0.5, 0.3]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(wheelGeom, this.materials.tire);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.1, wz);
            group.add(wheel);
        });

        const box = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.4, 0.5),
            this.materials.boxBrown
        );
        box.position.y = 1.2;
        group.add(box);

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    createLoadingDockZone(x, z) {
        for (let i = -2; i <= 2; i++) {
            this.createLoadingDock(x + i * 8, z);
        }

        // Staging pallets near docks
        for (let i = -1; i <= 1; i++) {
            this.createLoadedPallet(x + i * 8 - 2, z - 4);
            this.createLoadedPallet(x + i * 8 + 2, z - 4);
        }
    }

    createStagingArea(x, z) {
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 3; col++) {
                this.createLoadedPallet(x - 3 + col * 3, z - 2 + row * 3);
            }
        }

        this.createWrappedPalletStack(x + 5, z);
        this.createWrappedPalletStack(x + 5, z + 3);
    }

    createWrappedPalletStack(x, z) {
        const group = new THREE.Group();

        const pallet = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.12, 1),
            this.materials.pallet
        );
        pallet.position.y = 0.06;
        group.add(pallet);

        const wrapped = new THREE.Mesh(
            new THREE.BoxGeometry(1.1, 1.8, 0.9),
            new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, roughness: 0.3 })
        );
        wrapped.position.y = 1.05;
        wrapped.castShadow = true;
        group.add(wrapped);

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    createStorageRackGrid(x, z) {
        // Create a 4x5 grid of storage racks (dense like reference)
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 5; col++) {
                this.createStorageRack(x - 12 + col * 5.5, z - 10 + row * 5);
            }
        }
    }

    createStorageRack(x, z) {
        const group = new THREE.Group();
        const height = 6;
        const width = 5;
        const depth = 2;

        // Vertical posts - orange
        const postGeom = new THREE.BoxGeometry(0.2, height, 0.2);
        [[-width / 2, -depth / 2], [width / 2, -depth / 2],
        [-width / 2, depth / 2], [width / 2, depth / 2]].forEach(([px, pz]) => {
            const post = new THREE.Mesh(postGeom, this.materials.rackOrange);
            post.position.set(px, height / 2, pz);
            post.castShadow = true;
            group.add(post);
        });

        // Horizontal beams and shelves
        for (let y = 1.5; y <= height; y += 1.5) {
            // Beams
            const beam = new THREE.Mesh(
                new THREE.BoxGeometry(width, 0.1, 0.1),
                this.materials.rackOrange
            );
            beam.position.set(0, y, -depth / 2);
            group.add(beam);

            const beam2 = beam.clone();
            beam2.position.z = depth / 2;
            group.add(beam2);

            // Shelf
            const shelf = new THREE.Mesh(
                new THREE.BoxGeometry(width - 0.3, 0.08, depth - 0.2),
                this.materials.rack
            );
            shelf.position.set(0, y, 0);
            group.add(shelf);

            // Boxes/pallets on shelves
            this.addShelfContent(group, y + 0.1, width);
        }

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    addShelfContent(group, y, width) {
        const materials = [this.materials.boxWhite, this.materials.boxGrey, this.materials.boxBrown];

        for (let i = 0; i < 3; i++) {
            if (Math.random() > 0.25) {
                const boxWidth = 0.8 + Math.random() * 0.6;
                const boxHeight = 0.4 + Math.random() * 0.6;
                const box = new THREE.Mesh(
                    new THREE.BoxGeometry(boxWidth, boxHeight, 0.8 + Math.random() * 0.4),
                    materials[Math.floor(Math.random() * materials.length)]
                );
                box.position.set(-width / 2 + 1 + i * (width / 3), y + boxHeight / 2, 0);
                box.castShadow = true;
                group.add(box);
            }
        }
    }


    createCounterbalanceForklift(x, z, rotation) {
        const forklift = this.createForklift(x, z, rotation, 'red');
        return forklift;
    }

    createForklift(x, z, rotation, color = 'red') {
        const group = new THREE.Group();
        const material = color === 'red' ? this.materials.forkliftRed : this.materials.forkliftYellow;

        // Main body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(1.4, 0.9, 2.2),
            material
        );
        body.position.y = 0.65;
        body.castShadow = true;
        group.add(body);

        // Cabin
        const cabin = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 1.1, 1.1),
            this.materials.forkliftDark
        );
        cabin.position.set(0, 1.4, -0.3);
        cabin.castShadow = true;
        group.add(cabin);

        // Counterweight
        const counter = new THREE.Mesh(
            new THREE.BoxGeometry(1.3, 0.7, 0.7),
            material
        );
        counter.position.set(0, 0.55, -1.3);
        counter.castShadow = true;
        group.add(counter);

        // Mast
        const mast = new THREE.Mesh(
            new THREE.BoxGeometry(0.12, 2.5, 0.12),
            this.materials.forkliftMetal
        );
        mast.position.set(0, 1.4, 1.2);
        group.add(mast);

        const mast2 = mast.clone();
        mast2.position.x = 0.4;
        group.add(mast2);

        const mast3 = mast.clone();
        mast3.position.x = -0.4;
        group.add(mast3);

        // Carriage
        const carriage = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.5, 0.12),
            this.materials.forkliftMetal
        );
        carriage.position.set(0, 0.5, 1.1);
        group.add(carriage);

        // Forks
        [-0.3, 0.3].forEach(fx => {
            const fork = new THREE.Mesh(
                new THREE.BoxGeometry(0.1, 0.06, 1.5),
                this.materials.forkliftMetal
            );
            fork.position.set(fx, 0.13, 1.8);
            group.add(fork);
        });

        // Wheels
        const wheelGeom = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 16);
        [[-0.65, 0.7], [0.65, 0.7], [-0.45, -0.9], [0.45, -0.9]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(wheelGeom, this.materials.tire);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.25, wz);
            group.add(wheel);
        });

        // Warning light
        const beacon = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 0.15, 8),
            new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff6600, emissiveIntensity: 0.3 })
        );
        beacon.position.set(0, 2.05, -0.3);
        group.add(beacon);

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        group.rotation.y = rotation;
        this.warehouseGroup.add(group);
        return group;
    }

    createReachTruck(x, z, rotation = 0) {
        const group = new THREE.Group();

        // Body - narrower than counterbalance
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(1.1, 1.2, 2.4),
            this.materials.forkliftRed
        );
        body.position.y = 0.8;
        body.castShadow = true;
        group.add(body);

        // Standing platform area
        const platform = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.1, 0.8),
            this.materials.forkliftDark
        );
        platform.position.set(0, 0.2, -0.6);
        group.add(platform);

        // Tall mast for reach functionality
        const mastHeight = 4;
        const mast = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, mastHeight, 0.15),
            this.materials.forkliftMetal
        );
        mast.position.set(-0.3, mastHeight / 2, 1);
        group.add(mast);

        const mast2 = mast.clone();
        mast2.position.x = 0.3;
        group.add(mast2);

        // Reach mechanism
        const reachArm = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.3, 1.2),
            this.materials.forkliftMetal
        );
        reachArm.position.set(0, 0.35, 1.5);
        group.add(reachArm);

        // Forks
        [-0.25, 0.25].forEach(fx => {
            const fork = new THREE.Mesh(
                new THREE.BoxGeometry(0.08, 0.05, 1.2),
                this.materials.forkliftMetal
            );
            fork.position.set(fx, 0.12, 2.2);
            group.add(fork);
        });

        // Wheels
        const wheelGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 16);
        [[-0.45, 0.8], [0.45, 0.8], [-0.35, -0.8], [0.35, -0.8]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(wheelGeom, this.materials.tire);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.2, wz);
            group.add(wheel);
        });

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        group.rotation.y = rotation;
        this.warehouseGroup.add(group);
        return group;
    }

    createPalletTruck(x, z, rotation = 0) {
        const group = new THREE.Group();

        // Small body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.4, 0.8),
            this.materials.forkliftRed
        );
        body.position.set(0, 0.35, -0.3);
        body.castShadow = true;
        group.add(body);

        // Handle
        const handle = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 1.2, 0.08),
            this.materials.forkliftMetal
        );
        handle.position.set(0, 0.8, -0.8);
        handle.rotation.x = -0.2;
        group.add(handle);

        // Fork frame
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.15, 1.4),
            this.materials.forkliftRed
        );
        frame.position.set(0, 0.12, 0.5);
        group.add(frame);

        // Forks
        [-0.25, 0.25].forEach(fx => {
            const fork = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.08, 1.4),
                this.materials.forkliftMetal
            );
            fork.position.set(fx, 0.06, 0.5);
            group.add(fork);
        });

        // Wheels
        const rearWheel = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.12, 0.5, 16),
            this.materials.tire
        );
        rearWheel.rotation.z = Math.PI / 2;
        rearWheel.position.set(0, 0.12, -0.5);
        group.add(rearWheel);

        // Front rollers
        [-0.25, 0.25].forEach(fx => {
            const roller = new THREE.Mesh(
                new THREE.CylinderGeometry(0.06, 0.06, 0.12, 8),
                this.materials.tire
            );
            roller.rotation.z = Math.PI / 2;
            roller.position.set(fx, 0.06, 1.1);
            group.add(roller);
        });

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        group.rotation.y = rotation;
        this.warehouseGroup.add(group);
        return group;
    }

    createPalletArea(x, z) {
        // Group of pallets with stacked goods
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 3; col++) {
                this.createLoadedPallet(x - 3 + col * 3, z - 2 + row * 3);
            }
        }
    }

    createLoadedPallet(x, z) {
        const group = new THREE.Group();

        // Pallet base
        const pallet = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.12, 1),
            this.materials.pallet
        );
        pallet.position.y = 0.06;
        group.add(pallet);

        // Stacked boxes
        const stackHeight = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < stackHeight; i++) {
            const box = new THREE.Mesh(
                new THREE.BoxGeometry(1, 0.7, 0.9),
                Math.random() > 0.5 ? this.materials.boxWhite : this.materials.boxBrown
            );
            box.position.y = 0.5 + i * 0.75;
            box.castShadow = true;
            group.add(box);
        }

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    createLoadingDock(x, z) {
        // Dock door frame
        const doorFrame = new THREE.Mesh(
            new THREE.BoxGeometry(4, 4, 0.3),
            this.materials.rack
        );
        doorFrame.position.set(x, 2, z);
        this.warehouseGroup.add(doorFrame);

        // Door (rolled up)
        const door = new THREE.Mesh(
            new THREE.BoxGeometry(3.5, 0.5, 0.1),
            this.materials.forkliftMetal
        );
        door.position.set(x, 3.8, z - 0.1);
        this.warehouseGroup.add(door);

        // Dock leveler
        const leveler = new THREE.Mesh(
            new THREE.BoxGeometry(3, 0.1, 2),
            this.materials.forkliftMetal
        );
        leveler.position.set(x, 0.05, z + 1);
        leveler.rotation.x = -0.05;
        this.warehouseGroup.add(leveler);
    }

    // ==========================================
    // EXPERTISE SECTION - Open Plan Consulting Area (Back row, right of Automation)
    // ==========================================
    createExpertiseSection() {
        // Position: Back row, between x=20 (left divider) and x=60 (right wall)
        const floorWidth = 38;  // From x=21 to x=59
        const floorDepth = 24;  // Match other back-row sections
        const baseX = 40;       // Center of the section
        const baseZ = -37;      // Same z as Energy Solutions and Automation

        // Floor - industrial concrete for automated warehouse
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(floorWidth, floorDepth),
            this.materials.floor
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(baseX, 0.01, baseZ);
        this.warehouseGroup.add(floor);

        // === THREE AUTOMATED STORAGE SYSTEMS ===

        // ZONE 1: AS/RS System (left side, marker at 28, -37)
        // Two tall parallel rack towers with stacker crane in center aisle
        this.createASRSSystem(28, -37);

        // ZONE 2: Automated Miniloads (center, marker at 40, -37)
        // Dense bin storage with mini crane and I/O conveyor
        this.createMiniloadSystem(40, -37);

        // ZONE 3: Multishuttle Warehouse (right side, marker at 52, -37)
        // Multiple levels with rails, shuttle vehicles, vertical lift
        this.createMultishuttleSystem(52, -37);
    }

    // AS/RS - Automated Storage and Retrieval System
    // Two tall parallel rack towers with stacker crane
    createASRSSystem(x, z) {
        const group = new THREE.Group();
        const rackHeight = 10;  // Tall structure
        const rackLevels = 8;
        const levelHeight = rackHeight / rackLevels;

        // Two parallel rack structures (front and back of aisle)
        [-3, 3].forEach(rackOffset => {
            const rackGroup = new THREE.Group();

            // Vertical uprights
            [-2.5, 2.5].forEach(xOff => {
                const upright = new THREE.Mesh(
                    new THREE.BoxGeometry(0.15, rackHeight, 0.15),
                    this.materials.forkliftOrange
                );
                upright.position.set(xOff, rackHeight / 2, 0);
                upright.castShadow = true;
                rackGroup.add(upright);
            });

            // Horizontal beams and shelves at each level
            for (let level = 0; level < rackLevels; level++) {
                const y = level * levelHeight + 0.5;

                // Cross beam
                const beam = new THREE.Mesh(
                    new THREE.BoxGeometry(5.2, 0.1, 0.1),
                    this.materials.forkliftOrange
                );
                beam.position.set(0, y, 0);
                rackGroup.add(beam);

                // Shelf surface
                const shelf = new THREE.Mesh(
                    new THREE.BoxGeometry(5, 0.05, 1.2),
                    this.materials.rack
                );
                shelf.position.set(0, y + 0.05, 0);
                rackGroup.add(shelf);

                // Pallets with boxes on most levels
                if (level < rackLevels - 1 && Math.random() > 0.2) {
                    [-1.8, 0, 1.8].forEach(palletX => {
                        if (Math.random() > 0.3) {
                            // Pallet
                            const pallet = new THREE.Mesh(
                                new THREE.BoxGeometry(1.2, 0.08, 1.0),
                                this.materials.pallet
                            );
                            pallet.position.set(palletX, y + 0.12, 0);
                            rackGroup.add(pallet);

                            // Box on pallet
                            const boxHeight = 0.4 + Math.random() * 0.4;
                            const box = new THREE.Mesh(
                                new THREE.BoxGeometry(1.0, boxHeight, 0.8),
                                Math.random() > 0.5 ? this.materials.boxLight : this.materials.boxMedium
                            );
                            box.position.set(palletX, y + 0.16 + boxHeight / 2, 0);
                            box.castShadow = true;
                            rackGroup.add(box);
                        }
                    });
                }
            }

            // Top beam
            const topBeam = new THREE.Mesh(
                new THREE.BoxGeometry(5.2, 0.15, 0.15),
                this.materials.forkliftOrange
            );
            topBeam.position.set(0, rackHeight, 0);
            rackGroup.add(topBeam);

            rackGroup.position.z = rackOffset;
            group.add(rackGroup);
        });

        // Stacker crane in center aisle
        const craneGroup = new THREE.Group();

        // Vertical mast
        const craneMast = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, rackHeight + 1, 0.3),
            this.materials.forkliftYellow
        );
        craneMast.position.set(0, (rackHeight + 1) / 2, 0);
        craneGroup.add(craneMast);

        // Top rail
        const topRail = new THREE.Mesh(
            new THREE.BoxGeometry(6, 0.2, 0.2),
            this.materials.forkliftMetal
        );
        topRail.position.set(0, rackHeight + 0.5, 0);
        craneGroup.add(topRail);

        // Bottom rail
        const bottomRail = new THREE.Mesh(
            new THREE.BoxGeometry(6, 0.1, 0.3),
            this.materials.forkliftMetal
        );
        bottomRail.position.set(0, 0.05, 0);
        craneGroup.add(bottomRail);

        // Crane carriage (at mid height)
        const carriage = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.6, 2.5),
            this.materials.forkliftYellow
        );
        carriage.position.set(0, rackHeight * 0.6, 0);
        craneGroup.add(carriage);

        // Fork attachment on carriage
        const forkBase = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.3, 0.4),
            this.materials.forkliftMetal
        );
        forkBase.position.set(0, rackHeight * 0.6 - 0.3, 1.2);
        craneGroup.add(forkBase);

        [-0.15, 0.15].forEach(forkX => {
            const fork = new THREE.Mesh(
                new THREE.BoxGeometry(0.08, 0.05, 1.0),
                this.materials.forkliftMetal
            );
            fork.position.set(forkX, rackHeight * 0.6 - 0.45, 1.5);
            craneGroup.add(fork);
        });

        group.add(craneGroup);

        // I/O station at front
        const ioStation = new THREE.Mesh(
            new THREE.BoxGeometry(3, 0.8, 1.5),
            this.materials.conveyorFrame
        );
        ioStation.position.set(0, 0.4, 6);
        group.add(ioStation);

        // Conveyor rollers on I/O
        for (let i = 0; i < 6; i++) {
            const roller = new THREE.Mesh(
                new THREE.CylinderGeometry(0.08, 0.08, 1.3, 8),
                this.materials.forkliftMetal
            );
            roller.rotation.z = Math.PI / 2;
            roller.position.set(-1.2 + i * 0.5, 0.85, 6);
            group.add(roller);
        }

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    // Automated Miniload System - compact bins with high-speed crane
    createMiniloadSystem(x, z) {
        const group = new THREE.Group();
        const rackHeight = 9;
        const rackLevels = 10;  // More levels, smaller bins
        const levelHeight = rackHeight / rackLevels;

        // Two rack walls for miniload aisle
        [-2.5, 2.5].forEach(rackOffset => {
            const rackGroup = new THREE.Group();

            // Vertical uprights (narrower spacing for miniload)
            [-3, 0, 3].forEach(xOff => {
                const upright = new THREE.Mesh(
                    new THREE.BoxGeometry(0.1, rackHeight, 0.1),
                    this.materials.rack
                );
                upright.position.set(xOff, rackHeight / 2, 0);
                rackGroup.add(upright);
            });

            // Levels with bins
            for (let level = 0; level < rackLevels; level++) {
                const y = level * levelHeight + 0.3;

                // Shelf
                const shelf = new THREE.Mesh(
                    new THREE.BoxGeometry(6.5, 0.03, 0.8),
                    this.materials.rack
                );
                shelf.position.set(0, y, 0);
                rackGroup.add(shelf);

                // Bins/totes on each level
                for (let col = -4; col <= 4; col++) {
                    if (Math.random() > 0.15) {
                        const bin = new THREE.Mesh(
                            new THREE.BoxGeometry(0.6, levelHeight * 0.7, 0.6),
                            Math.random() > 0.5 ? this.materials.boxBlue : this.materials.boxGrey
                        );
                        bin.position.set(col * 0.7, y + levelHeight * 0.4, 0);
                        rackGroup.add(bin);
                    }
                }
            }

            // Top frame
            const topFrame = new THREE.Mesh(
                new THREE.BoxGeometry(6.5, 0.1, 0.1),
                this.materials.rack
            );
            topFrame.position.set(0, rackHeight, 0);
            rackGroup.add(topFrame);

            rackGroup.position.z = rackOffset;
            group.add(rackGroup);
        });

        // Miniload crane (smaller, faster design)
        const craneGroup = new THREE.Group();

        // Slim vertical mast
        const mast = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, rackHeight + 0.5, 0.2),
            this.materials.forkliftRed
        );
        mast.position.set(0, (rackHeight + 0.5) / 2, 0);
        craneGroup.add(mast);

        // Guide rails top and bottom
        const railTop = new THREE.Mesh(
            new THREE.BoxGeometry(7, 0.15, 0.15),
            this.materials.forkliftMetal
        );
        railTop.position.set(0, rackHeight + 0.3, 0);
        craneGroup.add(railTop);

        const railBottom = new THREE.Mesh(
            new THREE.BoxGeometry(7, 0.08, 0.2),
            this.materials.forkliftMetal
        );
        railBottom.position.set(0, 0.04, 0);
        craneGroup.add(railBottom);

        // Extractor head (grabber mechanism)
        const extractorY = rackHeight * 0.7;
        const extractor = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.4, 1.8),
            this.materials.forkliftRed
        );
        extractor.position.set(0, extractorY, 0);
        craneGroup.add(extractor);

        // Gripper arms
        [-0.6, 0.6].forEach(armZ => {
            const arm = new THREE.Mesh(
                new THREE.BoxGeometry(0.08, 0.25, 0.15),
                this.materials.forkliftMetal
            );
            arm.position.set(0, extractorY - 0.2, armZ);
            craneGroup.add(arm);
        });

        group.add(craneGroup);

        // Conveyor system at front (I/O)
        const conveyorLength = 5;
        const conveyorFrame = new THREE.Mesh(
            new THREE.BoxGeometry(conveyorLength, 0.3, 1.2),
            this.materials.conveyorFrame
        );
        conveyorFrame.position.set(0, 0.7, 5);
        group.add(conveyorFrame);

        // Conveyor rollers
        for (let i = 0; i < 10; i++) {
            const roller = new THREE.Mesh(
                new THREE.CylinderGeometry(0.06, 0.06, 1.0, 8),
                this.materials.forkliftMetal
            );
            roller.rotation.z = Math.PI / 2;
            roller.position.set(-2 + i * 0.5, 0.9, 5);
            group.add(roller);
        }

        // Bins on conveyor
        [-1.5, 0.5].forEach(binX => {
            const bin = new THREE.Mesh(
                new THREE.BoxGeometry(0.6, 0.4, 0.6),
                this.materials.boxBlue
            );
            bin.position.set(binX, 1.1, 5);
            group.add(bin);
        });

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    // Multishuttle System - multiple levels with shuttle vehicles
    createMultishuttleSystem(x, z) {
        const group = new THREE.Group();
        const rackHeight = 8;
        const rackLevels = 6;
        const levelHeight = rackHeight / rackLevels;
        const rackDepth = 8;

        // Main rack structure (wider, with multiple shuttle lanes)
        const rackGroup = new THREE.Group();

        // Vertical corner posts
        [[-3, -rackDepth / 2], [3, -rackDepth / 2], [-3, rackDepth / 2], [3, rackDepth / 2]].forEach(([px, pz]) => {
            const post = new THREE.Mesh(
                new THREE.BoxGeometry(0.2, rackHeight, 0.2),
                this.materials.forkliftOrange
            );
            post.position.set(px, rackHeight / 2, pz);
            post.castShadow = true;
            rackGroup.add(post);
        });

        // Each level with rails and storage positions
        for (let level = 0; level < rackLevels; level++) {
            const y = level * levelHeight + 0.5;

            // Level platform/rails
            const railLeft = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.08, rackDepth + 0.5),
                this.materials.forkliftMetal
            );
            railLeft.position.set(-2, y, 0);
            rackGroup.add(railLeft);

            const railRight = new THREE.Mesh(
                new THREE.BoxGeometry(0.15, 0.08, rackDepth + 0.5),
                this.materials.forkliftMetal
            );
            railRight.position.set(2, y, 0);
            rackGroup.add(railRight);

            // Storage shelves on both sides
            [-2.7, 2.7].forEach(shelfX => {
                const shelf = new THREE.Mesh(
                    new THREE.BoxGeometry(1.2, 0.05, rackDepth - 0.5),
                    this.materials.rack
                );
                shelf.position.set(shelfX, y, 0);
                rackGroup.add(shelf);

                // Bins/totes on shelves
                for (let pos = -3; pos <= 3; pos++) {
                    if (Math.random() > 0.25) {
                        const tote = new THREE.Mesh(
                            new THREE.BoxGeometry(0.8, levelHeight * 0.6, 0.9),
                            Math.random() > 0.5 ? this.materials.boxLight : this.materials.boxBlue
                        );
                        tote.position.set(shelfX, y + levelHeight * 0.35, pos * 1.1);
                        rackGroup.add(tote);
                    }
                }
            });

            // Shuttle vehicle on some levels
            if (level === 2 || level === 4) {
                const shuttle = this.createShuttleVehicle();
                shuttle.position.set(0, y + 0.1, (level === 2 ? 1 : -2));
                rackGroup.add(shuttle);
            }
        }

        // Cross beams at top
        const topBeamFront = new THREE.Mesh(
            new THREE.BoxGeometry(6.5, 0.15, 0.15),
            this.materials.forkliftOrange
        );
        topBeamFront.position.set(0, rackHeight, -rackDepth / 2);
        rackGroup.add(topBeamFront);

        const topBeamBack = new THREE.Mesh(
            new THREE.BoxGeometry(6.5, 0.15, 0.15),
            this.materials.forkliftOrange
        );
        topBeamBack.position.set(0, rackHeight, rackDepth / 2);
        rackGroup.add(topBeamBack);

        group.add(rackGroup);

        // Vertical lift tower at front
        const liftGroup = new THREE.Group();

        // Lift frame
        const liftFrame = new THREE.Mesh(
            new THREE.BoxGeometry(2, rackHeight + 1, 0.15),
            this.materials.forkliftOrange
        );
        liftFrame.position.set(0, (rackHeight + 1) / 2, rackDepth / 2 + 1);
        liftGroup.add(liftFrame);

        // Lift uprights
        [-0.9, 0.9].forEach(lx => {
            const upright = new THREE.Mesh(
                new THREE.BoxGeometry(0.1, rackHeight + 1, 0.8),
                this.materials.forkliftOrange
            );
            upright.position.set(lx, (rackHeight + 1) / 2, rackDepth / 2 + 1);
            liftGroup.add(upright);
        });

        // Lift platform (at mid height)
        const liftPlatform = new THREE.Mesh(
            new THREE.BoxGeometry(1.6, 0.15, 0.8),
            this.materials.forkliftYellow
        );
        liftPlatform.position.set(0, rackHeight * 0.5, rackDepth / 2 + 1);
        liftGroup.add(liftPlatform);

        // Tote on lift platform
        const liftTote = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.5, 0.6),
            this.materials.boxBlue
        );
        liftTote.position.set(0, rackHeight * 0.5 + 0.35, rackDepth / 2 + 1);
        liftGroup.add(liftTote);

        group.add(liftGroup);

        // Output conveyor
        const outConveyor = new THREE.Mesh(
            new THREE.BoxGeometry(4, 0.25, 1),
            this.materials.conveyorFrame
        );
        outConveyor.position.set(0, 0.6, rackDepth / 2 + 3);
        group.add(outConveyor);

        // Conveyor rollers
        for (let i = 0; i < 8; i++) {
            const roller = new THREE.Mesh(
                new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8),
                this.materials.forkliftMetal
            );
            roller.rotation.z = Math.PI / 2;
            roller.position.set(-1.5 + i * 0.45, 0.78, rackDepth / 2 + 3);
            group.add(roller);
        }

        group.scale.set(this.assetScale, this.assetScale, this.assetScale);
        group.position.set(x, 0, z);
        this.warehouseGroup.add(group);
    }

    // Shuttle vehicle for multishuttle system
    createShuttleVehicle() {
        const shuttle = new THREE.Group();

        // Main body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 0.25, 0.8),
            this.materials.forkliftRed
        );
        body.position.y = 0.15;
        shuttle.add(body);

        // Wheels
        [[-0.5, -0.3], [-0.5, 0.3], [0.5, -0.3], [0.5, 0.3]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(
                new THREE.CylinderGeometry(0.08, 0.08, 0.1, 8),
                this.materials.tire
            );
            wheel.rotation.x = Math.PI / 2;
            wheel.position.set(wx, 0.08, wz);
            shuttle.add(wheel);
        });

        // Load platform on top
        const platform = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.05, 0.6),
            this.materials.forkliftMetal
        );
        platform.position.y = 0.3;
        shuttle.add(platform);

        // Sensors/indicators
        const sensor = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.1, 0.1),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        );
        sensor.position.set(0.65, 0.2, 0);
        shuttle.add(sensor);

        return shuttle;
    }

    // ==========================================
    // EXTERIOR ELEMENTS
    // ==========================================
    createExteriorElements() {
        // === DOCKING BAY AREA ===
        this.createDockingBayArea();

        // 2 Trucks backed up to dock doors (trailer backs facing the dock)
        // Rotation 0 means trailer back (at negative z in local) faces the dock (at z=40)
        // Position z=54 so trailer back is at approximately z=43.5 (close to dock platform)
        this.createTruck(0, 54, 0);    // Dock 1
        this.createTruck(18, 54, 0);   // Dock 2
    }

    createDockingBayArea() {
        const dockPositions = [0, 18]; // Match the 2 dock door positions

        // Docking bay floor (concrete apron outside the warehouse)
        const dockFloor = new THREE.Mesh(
            new THREE.PlaneGeometry(70, 25),
            new THREE.MeshStandardMaterial({ color: 0xa0a0a0, roughness: 0.95 })
        );
        dockFloor.rotation.x = -Math.PI / 2;
        dockFloor.position.set(9, 0.005, 55);
        this.warehouseGroup.add(dockFloor);

        // Lane markings for trucks
        const laneMarkingMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });

        dockPositions.forEach(x => {
            // Guide lines for each dock (dashed approach lines)
            const leftLine = new THREE.Mesh(
                new THREE.PlaneGeometry(0.15, 18),
                laneMarkingMaterial
            );
            leftLine.rotation.x = -Math.PI / 2;
            leftLine.position.set(x - 4, 0.01, 52);
            this.warehouseGroup.add(leftLine);

            const rightLine = new THREE.Mesh(
                new THREE.PlaneGeometry(0.15, 18),
                laneMarkingMaterial
            );
            rightLine.rotation.x = -Math.PI / 2;
            rightLine.position.set(x + 4, 0.01, 52);
            this.warehouseGroup.add(rightLine);

            // Yellow safety zone marking at dock edge
            const safetyZone = new THREE.Mesh(
                new THREE.PlaneGeometry(8, 2),
                new THREE.MeshBasicMaterial({ color: 0xf1c40f, transparent: true, opacity: 0.4 })
            );
            safetyZone.rotation.x = -Math.PI / 2;
            safetyZone.position.set(x, 0.015, 44);
            this.warehouseGroup.add(safetyZone);
        });

        // Approach road extending from docking area
        const approachRoad = new THREE.Mesh(
            new THREE.PlaneGeometry(30, 20),
            new THREE.MeshStandardMaterial({ color: 0x989898, roughness: 0.9 })
        );
        approachRoad.rotation.x = -Math.PI / 2;
        approachRoad.position.set(9, 0.003, 72);
        this.warehouseGroup.add(approachRoad);
    }

    createTruck(x, z, rotation = 0) {
        const group = new THREE.Group();

        // Cab
        const cab = new THREE.Mesh(
            new THREE.BoxGeometry(2.5, 2.5, 3.5),
            this.materials.truckWhite
        );
        cab.position.set(0, 1.5, 2);
        cab.castShadow = true;
        group.add(cab);

        // Windshield
        const windshield = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 1.5),
            this.materials.glass
        );
        windshield.position.set(0, 2.2, 3.76);
        group.add(windshield);

        // Trailer
        const trailer = new THREE.Mesh(
            new THREE.BoxGeometry(2.8, 3.5, 12),
            this.materials.truckWhite
        );
        trailer.position.set(0, 2, -4.5);
        trailer.castShadow = true;
        group.add(trailer);

        // Wheels
        const wheelGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16);
        [[1.2, 1], [-1.2, 1], [1.2, -2], [-1.2, -2], [1.2, -8], [-1.2, -8]].forEach(([wx, wz]) => {
            const wheel = new THREE.Mesh(wheelGeom, this.materials.tire);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.5, wz);
            group.add(wheel);
        });

        group.position.set(x, 0, z);
        group.rotation.y = rotation;
        this.warehouseGroup.add(group);
    }

    getWarehouseGroup() {
        return this.warehouseGroup;
    }
}
