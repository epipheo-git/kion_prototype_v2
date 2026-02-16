import * as THREE from 'three';
import { SECTION_LAYOUT } from '../../config/warehouseLayout.js';

export class AutomationBuilder {
    constructor(warehouseGroup, materials) {
        this.group = warehouseGroup;
        this.materials = materials;
        this.layout = SECTION_LAYOUT.automation;
        this.assetScale = this.layout.assetScale;
    }

    // ==========================================
    // AUTOMATION SECTION - High-bay, Robotics & Data Center
    // ==========================================
    build() {
        const baseX = this.layout.origin.x;
        const baseZ = this.layout.origin.z;

        // Floor - extends from x=-35 (Energy Solutions divider) to x=20 (Expertise divider)
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(53, 24),
            this.materials.floorLight
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(baseX + 2, 0.01, baseZ);
        this.group.add(floor);

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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
            this.group.add(path);
        });

        // Vertical paths
        [[-25, 10], [5, 10]].forEach(([x, length]) => {
            const path = new THREE.Mesh(
                new THREE.PlaneGeometry(0.4, length),
                pathMaterial
            );
            path.rotation.x = -Math.PI / 2;
            path.position.set(x, 0.015, -38);
            this.group.add(path);
        });

        // Path intersection dots
        [[-25, -32], [-25, -44], [-10, -32], [-10, -44], [5, -32], [5, -44]].forEach(([px, pz]) => {
            const dot = new THREE.Mesh(
                new THREE.CircleGeometry(0.5, 16),
                pathMaterial
            );
            dot.rotation.x = -Math.PI / 2;
            dot.position.set(px, 0.016, pz);
            this.group.add(dot);
        });
    }
}
