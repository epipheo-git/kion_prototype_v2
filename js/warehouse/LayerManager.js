import * as THREE from 'three';

/**
 * LayerManager — Toggle-able visual overlays for Automation and Safety layers.
 *
 * Automation layer: adds sensor bars, LIDAR dots, warning beacons, and "MATIC"
 * badge meshes as children of each referenced vehicle group.
 *
 * Safety layer: adds translucent colored floor zones (danger / caution / safe).
 */
export class LayerManager {
    constructor(warehouseGroup, materials) {
        this.group = warehouseGroup;
        this.materials = materials;

        // Automation overlay state
        this.automationActive = false;
        this.automationOverlays = []; // { parent: THREE.Group, meshes: THREE.Object3D[] }

        // Safety zone state
        this.safetyActive = false;
        this.safetyZoneMeshes = [];
    }

    // ================================================================
    // AUTOMATION OVERLAYS
    // ================================================================

    /**
     * Create automation overlays for a set of vehicle groups.
     * @param {Map<string, THREE.Group>} vehicleRefs - Map of vehicle id → THREE.Group
     */
    initAutomationOverlays(vehicleRefs) {
        vehicleRefs.forEach((vehicleGroup, id) => {
            const overlayMeshes = this.createOverlaySet(vehicleGroup);
            this.automationOverlays.push({
                parent: vehicleGroup,
                meshes: overlayMeshes
            });
        });
    }

    /**
     * Creates one set of automation overlay meshes and attaches them to a vehicle.
     * All meshes start hidden (visible = false).
     */
    createOverlaySet(vehicleGroup) {
        const meshes = [];

        // Determine vehicle bounds for positioning overlays
        // We'll place overlays relative to the vehicle group's local space
        // The vehicle models are already scaled via group.scale

        // 1. Sensor bar across the front (cyan bar)
        const sensorBar = new THREE.Mesh(
            new THREE.BoxGeometry(1.6, 0.12, 0.12),
            new THREE.MeshStandardMaterial({
                color: 0x00aaff,
                emissive: 0x0066aa,
                emissiveIntensity: 0.6,
                transparent: true,
                opacity: 0.9
            })
        );
        sensorBar.position.set(0, 0.4, 2.0);
        sensorBar.visible = false;
        vehicleGroup.add(sensorBar);
        meshes.push(sensorBar);

        // 2. LIDAR dots (3 cyan dots in arc at front)
        const lidarDotGeom = new THREE.SphereGeometry(0.08, 8, 8);
        const lidarDotMat = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00aaaa,
            emissiveIntensity: 0.8
        });

        [[-0.5, 0.6, 2.2], [0, 0.8, 2.4], [0.5, 0.6, 2.2]].forEach(([dx, dy, dz]) => {
            const dot = new THREE.Mesh(lidarDotGeom, lidarDotMat);
            dot.position.set(dx, dy, dz);
            dot.visible = false;
            vehicleGroup.add(dot);
            meshes.push(dot);
        });

        // 3. Warning beacon on top (orange glow)
        const beaconGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 12);
        const beaconMat = new THREE.MeshStandardMaterial({
            color: 0xff8800,
            emissive: 0xff6600,
            emissiveIntensity: 0.7,
            transparent: true,
            opacity: 0.85
        });
        const beacon = new THREE.Mesh(beaconGeom, beaconMat);
        beacon.position.set(0, 2.2, -0.3);
        beacon.visible = false;
        vehicleGroup.add(beacon);
        meshes.push(beacon);

        // 4. "MATIC" badge (small plane on the side of vehicle)
        const badgeGeom = new THREE.PlaneGeometry(0.8, 0.3);
        const badgeMat = new THREE.MeshBasicMaterial({
            color: 0x00aaff,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        });
        const badge = new THREE.Mesh(badgeGeom, badgeMat);
        badge.position.set(0.72, 0.9, 0);
        badge.rotation.y = Math.PI / 2;
        badge.visible = false;
        vehicleGroup.add(badge);
        meshes.push(badge);

        // Second badge on other side
        const badge2 = badge.clone();
        badge2.position.x = -0.72;
        badge2.visible = false;
        vehicleGroup.add(badge2);
        meshes.push(badge2);

        return meshes;
    }

    /**
     * Toggle automation overlays on/off.
     * @returns {boolean} New active state
     */
    toggleAutomation() {
        this.automationActive = !this.automationActive;

        this.automationOverlays.forEach(({ meshes }) => {
            meshes.forEach(mesh => {
                mesh.visible = this.automationActive;
            });
        });

        return this.automationActive;
    }

    // ================================================================
    // SAFETY ZONES
    // ================================================================

    /**
     * Create safety floor zones.
     * @param {Array<{x, z, width, depth, type}>} zoneDefinitions
     *   type: 'danger' (red), 'caution' (yellow), 'safe' (green)
     */
    initSafetyZones(zoneDefinitions) {
        const zoneMaterials = {
            danger: new THREE.MeshBasicMaterial({
                color: 0xff3333,
                transparent: true,
                opacity: 0.25,
                depthWrite: false,
                side: THREE.DoubleSide
            }),
            caution: new THREE.MeshBasicMaterial({
                color: 0xffaa00,
                transparent: true,
                opacity: 0.2,
                depthWrite: false,
                side: THREE.DoubleSide
            }),
            safe: new THREE.MeshBasicMaterial({
                color: 0x33cc66,
                transparent: true,
                opacity: 0.15,
                depthWrite: false,
                side: THREE.DoubleSide
            })
        };

        zoneDefinitions.forEach(zone => {
            const material = zoneMaterials[zone.type] || zoneMaterials.caution;
            const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(zone.width, zone.depth),
                material
            );
            mesh.rotation.x = -Math.PI / 2;
            mesh.position.set(zone.x, 0.08, zone.z);
            mesh.renderOrder = 998;
            mesh.visible = false;

            this.group.add(mesh);
            this.safetyZoneMeshes.push(mesh);

            // Add striped border for danger zones
            if (zone.type === 'danger') {
                this.addDangerBorder(zone);
            }
        });
    }

    /**
     * Add a striped border around a danger zone (yellow/black hazard stripes).
     */
    addDangerBorder(zone) {
        const stripeMat = new THREE.MeshBasicMaterial({
            color: 0xffcc00,
            transparent: true,
            opacity: 0.35,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        const borderWidth = 0.4;

        // Four border strips (top, bottom, left, right)
        const borders = [
            // Top
            { x: zone.x, z: zone.z - zone.depth / 2, w: zone.width, d: borderWidth },
            // Bottom
            { x: zone.x, z: zone.z + zone.depth / 2, w: zone.width, d: borderWidth },
            // Left
            { x: zone.x - zone.width / 2, z: zone.z, w: borderWidth, d: zone.depth },
            // Right
            { x: zone.x + zone.width / 2, z: zone.z, w: borderWidth, d: zone.depth }
        ];

        borders.forEach(b => {
            const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(b.w, b.d),
                stripeMat
            );
            mesh.rotation.x = -Math.PI / 2;
            mesh.position.set(b.x, 0.09, b.z);
            mesh.renderOrder = 999;
            mesh.visible = false;
            this.group.add(mesh);
            this.safetyZoneMeshes.push(mesh);
        });
    }

    /**
     * Toggle safety zones on/off.
     * @returns {boolean} New active state
     */
    toggleSafety() {
        this.safetyActive = !this.safetyActive;

        this.safetyZoneMeshes.forEach(mesh => {
            mesh.visible = this.safetyActive;
        });

        return this.safetyActive;
    }

    dispose() {
        // Remove automation overlays from parents
        this.automationOverlays.forEach(({ parent, meshes }) => {
            meshes.forEach(mesh => {
                parent.remove(mesh);
                if (mesh.geometry) mesh.geometry.dispose();
                if (mesh.material) mesh.material.dispose();
            });
        });
        this.automationOverlays = [];

        // Remove safety zones
        this.safetyZoneMeshes.forEach(mesh => {
            this.group.remove(mesh);
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) mesh.material.dispose();
        });
        this.safetyZoneMeshes = [];
    }
}
