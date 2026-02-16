import * as THREE from 'three';

export class ExteriorBuilder {
    constructor(warehouseGroup, materials) {
        this.group = warehouseGroup;
        this.materials = materials;
    }

    // ==========================================
    // EXTERIOR ELEMENTS
    // ==========================================
    build() {
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
        this.group.add(dockFloor);

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
            this.group.add(leftLine);

            const rightLine = new THREE.Mesh(
                new THREE.PlaneGeometry(0.15, 18),
                laneMarkingMaterial
            );
            rightLine.rotation.x = -Math.PI / 2;
            rightLine.position.set(x + 4, 0.01, 52);
            this.group.add(rightLine);

            // Yellow safety zone marking at dock edge
            const safetyZone = new THREE.Mesh(
                new THREE.PlaneGeometry(8, 2),
                new THREE.MeshBasicMaterial({ color: 0xf1c40f, transparent: true, opacity: 0.4 })
            );
            safetyZone.rotation.x = -Math.PI / 2;
            safetyZone.position.set(x, 0.015, 44);
            this.group.add(safetyZone);
        });

        // Approach road extending from docking area
        const approachRoad = new THREE.Mesh(
            new THREE.PlaneGeometry(30, 20),
            new THREE.MeshStandardMaterial({ color: 0x989898, roughness: 0.9 })
        );
        approachRoad.rotation.x = -Math.PI / 2;
        approachRoad.position.set(9, 0.003, 72);
        this.group.add(approachRoad);
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
        this.group.add(group);
    }
}
