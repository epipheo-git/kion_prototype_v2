import * as THREE from 'three';
import { SECTION_LAYOUT } from '../../config/warehouseLayout.js';

export class EnergySolutionsBuilder {
    constructor(warehouseGroup, materials) {
        this.group = warehouseGroup;
        this.materials = materials;
        this.layout = SECTION_LAYOUT.energySolutions;
        this.assetScale = this.layout.assetScale;
    }

    // ==========================================
    // ENERGY SOLUTIONS SECTION - Open Charging Area
    // ==========================================
    build() {
        const baseX = this.layout.origin.x;
        const baseZ = this.layout.origin.z;

        // Floor - extended to match compartment
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(32, 28),
            this.materials.floorLight
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(baseX, 0.01, baseZ);
        this.group.add(floor);

        // === CORNER/WALL POSITIONS: Tucked-away utility placement ===

        // Li-ION Battery Technology (back-left corner)
        this.createLiIonStation(-61, -46);

        // Lead-Acid Solutions (back wall center)
        this.createLeadAcidStation(-50, -46);

        // Fuel Cell Technology (back-right area, near divider)
        this.createFuelCellStation(-39, -46);

        // Linde Chargers (left wall)
        this.createLindeChargersDisplay(-61, -35);

        // Energy Storage System (right wall, near divider)
        this.createEnergyStorageSystem(-39, -35);

        // === CENTER: Energy Monitor (stays central) ===
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
    }

    // Energy floor markings
    createEnergyFloorMarkings(baseX, baseZ) {
        const markingMaterial = new THREE.MeshBasicMaterial({ color: 0x4ade80, transparent: true, opacity: 0.2 });

        // Connecting paths between stations (adjusted for wall/corner positions)
        // Back row horizontal at z=-46
        const backPath = new THREE.Mesh(
            new THREE.PlaneGeometry(24, 0.3),
            markingMaterial
        );
        backPath.rotation.x = -Math.PI / 2;
        backPath.position.set(baseX, 0.015, -46);
        this.group.add(backPath);

        // Mid row horizontal at z=-35
        const midPath = new THREE.Mesh(
            new THREE.PlaneGeometry(24, 0.3),
            markingMaterial
        );
        midPath.rotation.x = -Math.PI / 2;
        midPath.position.set(baseX, 0.015, -35);
        this.group.add(midPath);

        // Vertical connectors (left wall x=-61, right wall x=-39)
        [[-61, 12], [-39, 12]].forEach(([px, length]) => {
            const vPath = new THREE.Mesh(
                new THREE.PlaneGeometry(0.3, length),
                markingMaterial
            );
            vPath.rotation.x = -Math.PI / 2;
            vPath.position.set(px, 0.015, -40.5);
            this.group.add(vPath);
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
        this.group.add(group);
    }
}
