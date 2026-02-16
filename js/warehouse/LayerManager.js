import * as THREE from 'three';

/**
 * LayerManager — Toggle-able visual overlays for Automation and Safety layers.
 *
 * Automation layer: large ground-level detection rings, sensor arcs, glowing
 * beacon columns, and MATIC halo rings on each tracked vehicle.
 *
 * Safety layer: translucent colored floor zones (danger / caution / safe)
 * with animated pulsing on danger areas.
 */
export class LayerManager {
    constructor(warehouseGroup, materials) {
        this.group = warehouseGroup;
        this.materials = materials;

        // Automation overlay state
        this.automationActive = false;
        this.automationOverlays = []; // { parent, meshes }

        // Animation tracking arrays (subsets for per-frame updates)
        this.automationRings = [];
        this.automationArcs = [];
        this.automationBeacons = [];
        this.automationGlows = [];

        // Safety zone state
        this.safetyActive = false;
        this.safetyZoneMeshes = [];
        this.dangerZoneMeshes = [];
        this.dangerBorderMeshes = [];
    }

    // ================================================================
    // AUTOMATION OVERLAYS
    // ================================================================

    /**
     * Create automation overlays for a set of vehicle groups.
     * @param {Map<string, THREE.Group>} vehicleRefs
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
     * Dimensions are in vehicle LOCAL space (will be scaled 1.4x by vehicle group).
     */
    createOverlaySet(vehicleGroup) {
        const meshes = [];

        // 1. Ground detection ring — large cyan ring on floor around vehicle
        const ring = new THREE.Mesh(
            new THREE.RingGeometry(3.5, 4.2, 64),
            new THREE.MeshBasicMaterial({
                color: 0x00ccff,
                transparent: true,
                opacity: 0.55,
                side: THREE.DoubleSide,
                depthWrite: false
            })
        );
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(0, 0.15, 0);
        ring.renderOrder = 997;
        ring.visible = false;
        vehicleGroup.add(ring);
        meshes.push(ring);
        this.automationRings.push(ring);

        // 2. Inner detection fill — subtle fill inside ring
        const fill = new THREE.Mesh(
            new THREE.CircleGeometry(3.5, 64),
            new THREE.MeshBasicMaterial({
                color: 0x00aaff,
                transparent: true,
                opacity: 0.12,
                side: THREE.DoubleSide,
                depthWrite: false
            })
        );
        fill.rotation.x = -Math.PI / 2;
        fill.position.set(0, 0.14, 0);
        fill.renderOrder = 996;
        fill.visible = false;
        vehicleGroup.add(fill);
        meshes.push(fill);

        // 3. Sensor sweep arc — 120° arc in front of vehicle
        const arc = new THREE.Mesh(
            new THREE.RingGeometry(2.0, 5.0, 32, 1,
                Math.PI / 2 - Math.PI / 3,   // thetaStart: centered forward
                2 * Math.PI / 3              // thetaLength: 120 degrees
            ),
            new THREE.MeshBasicMaterial({
                color: 0x00ffaa,
                transparent: true,
                opacity: 0.25,
                side: THREE.DoubleSide,
                depthWrite: false
            })
        );
        arc.rotation.x = -Math.PI / 2;
        arc.position.set(0, 0.16, 1.5);
        arc.renderOrder = 997;
        arc.visible = false;
        vehicleGroup.add(arc);
        meshes.push(arc);
        this.automationArcs.push(arc);

        // 4. Beacon column — tall glowing pillar on top of vehicle
        const beacon = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16),
            new THREE.MeshStandardMaterial({
                color: 0x00ccff,
                emissive: 0x00aaff,
                emissiveIntensity: 1.0,
                transparent: true,
                opacity: 0.85
            })
        );
        beacon.position.set(0, 3.0, 0);
        beacon.visible = false;
        vehicleGroup.add(beacon);
        meshes.push(beacon);
        this.automationBeacons.push(beacon);

        // 5. Beacon glow sphere — soft halo bloom
        const glow = new THREE.Mesh(
            new THREE.SphereGeometry(1.0, 16, 16),
            new THREE.MeshBasicMaterial({
                color: 0x00ccff,
                transparent: true,
                opacity: 0.25,
                depthWrite: false
            })
        );
        glow.position.set(0, 3.5, 0);
        glow.visible = false;
        vehicleGroup.add(glow);
        meshes.push(glow);
        this.automationGlows.push(glow);

        // 6. MATIC halo ring — horizontal ring at vehicle midsection
        const halo = new THREE.Mesh(
            new THREE.TorusGeometry(1.2, 0.15, 8, 32),
            new THREE.MeshStandardMaterial({
                color: 0x00aaff,
                emissive: 0x0088cc,
                emissiveIntensity: 0.8
            })
        );
        halo.rotation.x = Math.PI / 2;
        halo.position.set(0, 1.8, 0);
        halo.visible = false;
        vehicleGroup.add(halo);
        meshes.push(halo);

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
     */
    initSafetyZones(zoneDefinitions) {
        const zoneMaterials = {
            danger: new THREE.MeshBasicMaterial({
                color: 0xff2222,
                transparent: true,
                opacity: 0.55,
                depthWrite: false,
                side: THREE.DoubleSide
            }),
            caution: new THREE.MeshBasicMaterial({
                color: 0xffbb00,
                transparent: true,
                opacity: 0.40,
                depthWrite: false,
                side: THREE.DoubleSide
            }),
            safe: new THREE.MeshBasicMaterial({
                color: 0x22dd55,
                transparent: true,
                opacity: 0.30,
                depthWrite: false,
                side: THREE.DoubleSide
            })
        };

        zoneDefinitions.forEach(zone => {
            const material = (zoneMaterials[zone.type] || zoneMaterials.caution).clone();
            const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(zone.width, zone.depth),
                material
            );
            mesh.rotation.x = -Math.PI / 2;
            mesh.position.set(zone.x, 0.20, zone.z);
            mesh.renderOrder = 1000;
            mesh.visible = false;
            mesh.userData.zoneType = zone.type;
            mesh.userData.isBorder = false;

            this.group.add(mesh);
            this.safetyZoneMeshes.push(mesh);

            // Track danger zones separately for animation
            if (zone.type === 'danger') {
                this.dangerZoneMeshes.push(mesh);
                this.addDangerBorder(zone);
            }
        });
    }

    /**
     * Add a striped border around a danger zone.
     */
    addDangerBorder(zone) {
        const stripeMat = new THREE.MeshBasicMaterial({
            color: 0xffdd00,
            transparent: true,
            opacity: 0.65,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        const borderWidth = 1.5;

        const borders = [
            // Top
            { x: zone.x, z: zone.z - zone.depth / 2, w: zone.width + borderWidth, d: borderWidth },
            // Bottom
            { x: zone.x, z: zone.z + zone.depth / 2, w: zone.width + borderWidth, d: borderWidth },
            // Left
            { x: zone.x - zone.width / 2, z: zone.z, w: borderWidth, d: zone.depth },
            // Right
            { x: zone.x + zone.width / 2, z: zone.z, w: borderWidth, d: zone.depth }
        ];

        borders.forEach(b => {
            const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry(b.w, b.d),
                stripeMat.clone()
            );
            mesh.rotation.x = -Math.PI / 2;
            mesh.position.set(b.x, 0.22, b.z);
            mesh.renderOrder = 1001;
            mesh.visible = false;
            mesh.userData.zoneType = 'danger';
            mesh.userData.isBorder = true;

            this.group.add(mesh);
            this.safetyZoneMeshes.push(mesh);
            this.dangerBorderMeshes.push(mesh);
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

    // ================================================================
    // ANIMATION UPDATE
    // ================================================================

    /**
     * Per-frame update for animated overlays.
     * Only runs calculations when the respective layer is active.
     */
    update(time) {
        if (this.automationActive) {
            const pulse = 0.55 + 0.15 * Math.sin(time * 0.003);
            const glowPulse = 0.25 + 0.15 * Math.sin(time * 0.004);
            const beaconIntensity = 0.7 + 0.3 * Math.sin(time * 0.005);

            // Pulse detection rings
            this.automationRings.forEach(ring => {
                ring.material.opacity = pulse;
            });

            // Slowly rotate sensor arcs
            this.automationArcs.forEach(arc => {
                arc.rotation.z += 0.002;
            });

            // Pulse beacon emissive
            this.automationBeacons.forEach(beacon => {
                beacon.material.emissiveIntensity = beaconIntensity;
            });

            // Pulse beacon glow
            this.automationGlows.forEach(glow => {
                glow.material.opacity = glowPulse;
            });
        }

        if (this.safetyActive) {
            const dangerPulse = 0.50 + 0.10 * Math.sin(time * 0.004);
            const borderPulse = 0.625 + 0.125 * Math.sin(time * 0.004);

            // Pulse danger zones
            this.dangerZoneMeshes.forEach(mesh => {
                mesh.material.opacity = dangerPulse;
            });

            // Pulse danger borders
            this.dangerBorderMeshes.forEach(mesh => {
                mesh.material.opacity = borderPulse;
            });
        }
    }

    // ================================================================
    // CLEANUP
    // ================================================================

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
        this.automationRings = [];
        this.automationArcs = [];
        this.automationBeacons = [];
        this.automationGlows = [];

        // Remove safety zones
        this.safetyZoneMeshes.forEach(mesh => {
            this.group.remove(mesh);
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) mesh.material.dispose();
        });
        this.safetyZoneMeshes = [];
        this.dangerZoneMeshes = [];
        this.dangerBorderMeshes = [];
    }
}
