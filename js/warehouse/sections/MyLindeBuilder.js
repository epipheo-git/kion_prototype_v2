import * as THREE from 'three';
import { SECTION_LAYOUT } from '../../config/warehouseLayout.js';

export class MyLindeBuilder {
    constructor(warehouseGroup, materials) {
        this.group = warehouseGroup;
        this.materials = materials;
        this.layout = SECTION_LAYOUT.myLinde;
        this.assetScale = this.layout.assetScale;
    }

    build() {
        const baseX = this.layout.origin.x;
        const baseZ = this.layout.origin.z;

        // Floor for collaborative digital workspace
        const officeFloor = new THREE.Mesh(
            new THREE.PlaneGeometry(18, 16),
            this.materials.floorOffice
        );
        officeFloor.rotation.x = -Math.PI / 2;
        officeFloor.position.set(baseX, 0.01, baseZ);
        this.group.add(officeFloor);

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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
    }

    createWallScreen(x, z) {
        // Large wall-mounted display
        const screen = new THREE.Mesh(
            new THREE.BoxGeometry(4, 2.5, 0.1),
            this.materials.monitor
        );
        screen.position.set(x, 2.5, z);
        this.group.add(screen);

        const display = new THREE.Mesh(
            new THREE.PlaneGeometry(3.8, 2.3),
            this.materials.screen
        );
        display.position.set(x, 2.5, z + 0.06);
        this.group.add(display);
    }

    createFilingCabinet(x, z) {
        const cabinet = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 1.5, 0.5),
            this.materials.rack
        );
        cabinet.position.set(x, 0.75, z);
        cabinet.castShadow = true;
        this.group.add(cabinet);

        // Drawer handles
        for (let i = 0; i < 3; i++) {
            const handle = new THREE.Mesh(
                new THREE.BoxGeometry(0.3, 0.05, 0.05),
                this.materials.forkliftMetal
            );
            handle.position.set(x, 0.4 + i * 0.45, z + 0.28);
            this.group.add(handle);
        }
    }
}
