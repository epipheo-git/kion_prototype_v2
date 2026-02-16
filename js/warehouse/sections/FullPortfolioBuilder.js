import * as THREE from 'three';
import { SECTION_LAYOUT } from '../../config/warehouseLayout.js';

export class FullPortfolioBuilder {
    constructor(warehouseGroup, materials) {
        this.group = warehouseGroup;
        this.materials = materials;
        this.layout = SECTION_LAYOUT.fullPortfolio;
        this.assetScale = this.layout.assetScale;

        // Animation arrays
        this.conveyorBoxes = [];
        this.animatedForklifts = [];
        this.conveyorPath = null;
        this.workingForklift = null;

        // Vehicle references for layer overlays
        this.vehicleRefs = new Map();
    }

    // ==========================================
    // FULL PORTFOLIO SECTION - Main Warehouse with Vehicle Displays
    // Grid layout distributing vehicles across full width
    // ==========================================
    build() {
        const baseX = this.layout.origin.x;
        const baseZ = this.layout.origin.z;

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
        this.group.add(floor);

        // === ZONE 1: Storage Racks (4x3 grid, left-center) ===
        this.createCentralRackZone(baseX - 5, baseZ - 5);

        // === ZONE 2: Conveyor from Docking Bay to Shelves (keep animation) ===
        this.createDockToShelfConveyor(baseX, baseZ);

        // === ZONE 3: Working Forklift - Counterbalance (animated) ===
        this.createWorkingForklift(baseX - 5, baseZ - 5);

        // === ZONE 4: Loading Docks (front) ===
        this.createLoadingDockZone(baseX, baseZ + 30);

        // === ZONE 5: Pallet Trucks (south row) ===
        this.vehicleRefs.set('pallet-truck', this.createPalletTruck(17, -20));
        this.vehicleRefs.set('pallet-truck-rideon', this.createPalletTruckRideOn(32, -20));

        // === ZONE 6: Heavy Equipment (east, near docks) ===
        this.vehicleRefs.set('heavy-truck', this.createHeavyTruck(45, 30, -Math.PI / 4));
        this.vehicleRefs.set('counterbalance', this.createCounterbalanceForklift(30, 32, -Math.PI / 4));

        // === ZONE 7: Tow Tractor (east mid, train extends toward -z) ===
        this.vehicleRefs.set('tow-tractor', this.createTowTractor(38, 24, 0));

        // === ZONE 8: Order Picking Area (right side) ===
        this.createOrderPickingZone(baseX + 35, baseZ - 2);

        // === ZONE 9: High-Reach Vehicles (south row) ===
        this.vehicleRefs.set('reach-truck', this.createReachTruck(-28, -20, 0));
        this.vehicleRefs.set('turret-truck', this.createTurretTruck(-13, -20, 0));
        this.vehicleRefs.set('pallet-stacker', this.createPalletStacker(2, -20));

        // === ZONE 10: Staging Area (moved to front-left, away from counterbalance) ===
        this.createStagingArea(baseX - 38, baseZ + 20);
    }

    getVehicleRefs() {
        return this.vehicleRefs;
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(platform);

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
            this.group.add(box);
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
            this.group.add(box);
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

    getAnimationData() {
        return {
            pathBoxes: this.conveyorBoxes,
            workingForklift: this.workingForklift,
            conveyorPath: this.conveyorPath
        };
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
        this.group.add(group);
    }

    createConveyorCorner(x, z) {
        const corner = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.4, 1.2),
            this.materials.conveyor
        );
        corner.position.set(x, 0.5, z);
        this.group.add(corner);

        const belt = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.05, 1),
            this.materials.conveyorBelt
        );
        belt.position.set(x, 0.73, z);
        this.group.add(belt);
    }

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
        this.group.add(group);
        return group;
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
        return group;
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
        this.group.add(group);
    }

    createLoadingDock(x, z) {
        // Dock door frame
        const doorFrame = new THREE.Mesh(
            new THREE.BoxGeometry(4, 4, 0.3),
            this.materials.rack
        );
        doorFrame.position.set(x, 2, z);
        this.group.add(doorFrame);

        // Door (rolled up)
        const door = new THREE.Mesh(
            new THREE.BoxGeometry(3.5, 0.5, 0.1),
            this.materials.forkliftMetal
        );
        door.position.set(x, 3.8, z - 0.1);
        this.group.add(door);

        // Dock leveler
        const leveler = new THREE.Mesh(
            new THREE.BoxGeometry(3, 0.1, 2),
            this.materials.forkliftMetal
        );
        leveler.position.set(x, 0.05, z + 1);
        leveler.rotation.x = -0.05;
        this.group.add(leveler);
    }
}
