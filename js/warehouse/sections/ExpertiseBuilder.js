import * as THREE from 'three';
import { SECTION_LAYOUT } from '../../config/warehouseLayout.js';

export class ExpertiseBuilder {
    constructor(warehouseGroup, materials) {
        this.group = warehouseGroup;
        this.materials = materials;
        this.layout = SECTION_LAYOUT.expertise;
        this.assetScale = this.layout.assetScale;
    }

    // ==========================================
    // EXPERTISE SECTION - Open Plan Consulting Area (Back row, right of Automation)
    // ==========================================
    build() {
        // Position: Back row, between x=20 (left divider) and x=60 (right wall)
        const floorWidth = 38;  // From x=21 to x=59
        const floorDepth = 24;  // Match other back-row sections
        const baseX = this.layout.origin.x;
        const baseZ = this.layout.origin.z;

        // Floor - industrial concrete for automated warehouse
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(floorWidth, floorDepth),
            this.materials.floor
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(baseX, 0.01, baseZ);
        this.group.add(floor);

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
        this.group.add(group);
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
        this.group.add(group);
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
        this.group.add(group);
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
}
