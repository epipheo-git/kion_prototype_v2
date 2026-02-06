import * as THREE from 'three';
import { MARKER_CONFIG, ANIMATION } from '../config/warehouseData.js';

export class MarkerSystem {
    constructor(scene) {
        this.scene = scene;
        this.markers = new Map();
        this.markerGroup = new THREE.Group();
        this.scene.add(this.markerGroup);

        this.time = 0;
    }

    createMarker(id, position, color, label, type = 'section') {
        const marker = new THREE.Group();
        marker.userData = {
            isMarker: true,
            id: id,
            label: label,
            type: type,
            baseY: position.y,
            color: color
        };

        // Create the circular base
        const baseGeometry = new THREE.CylinderGeometry(
            MARKER_CONFIG.baseRadius,
            MARKER_CONFIG.baseRadius,
            MARKER_CONFIG.height,
            MARKER_CONFIG.segments
        );
        const baseMaterial = new THREE.MeshLambertMaterial({
            color: color,
            transparent: true,
            opacity: 0.95
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.castShadow = true;
        marker.add(base);

        // Create the plus sign
        const plusGroup = this.createPlusSign(color);
        plusGroup.position.y = MARKER_CONFIG.height / 2 + 0.1;
        marker.add(plusGroup);

        // Create glow ring (for hover effect)
        const glowGeometry = new THREE.RingGeometry(
            MARKER_CONFIG.baseRadius,
            MARKER_CONFIG.baseRadius + 0.5,
            MARKER_CONFIG.segments
        );
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.rotation.x = -Math.PI / 2;
        glow.position.y = 0.1;
        marker.add(glow);

        // Store reference to materials for animation
        marker.userData.baseMaterial = baseMaterial;
        marker.userData.glowMaterial = glowMaterial;
        marker.userData.plusGroup = plusGroup;

        // Position the marker
        marker.position.set(position.x, position.y, position.z);

        this.markers.set(id, marker);
        this.markerGroup.add(marker);

        return marker;
    }

    createPlusSign(color) {
        const group = new THREE.Group();
        const material = new THREE.MeshLambertMaterial({ color: 0xffffff });

        // Horizontal bar
        const horizontalGeometry = new THREE.BoxGeometry(
            MARKER_CONFIG.plusLength,
            0.2,
            MARKER_CONFIG.plusThickness
        );
        const horizontal = new THREE.Mesh(horizontalGeometry, material);
        group.add(horizontal);

        // Vertical bar
        const verticalGeometry = new THREE.BoxGeometry(
            MARKER_CONFIG.plusThickness,
            0.2,
            MARKER_CONFIG.plusLength
        );
        const vertical = new THREE.Mesh(verticalGeometry, material);
        group.add(vertical);

        return group;
    }

    setMarkerHover(id, isHovered) {
        const marker = this.markers.get(id);
        if (!marker) return;

        const targetScale = isHovered ? ANIMATION.hoverScaleFactor : 1;
        const targetGlow = isHovered ? MARKER_CONFIG.hoverGlow : 0;

        // Animate scale
        this.animateMarkerScale(marker, targetScale);

        // Animate glow
        marker.userData.glowMaterial.opacity = targetGlow;
    }

    animateMarkerScale(marker, targetScale) {
        const currentScale = marker.scale.x;
        const diff = targetScale - currentScale;

        if (Math.abs(diff) > 0.01) {
            marker.scale.setScalar(currentScale + diff * 0.2);
        } else {
            marker.scale.setScalar(targetScale);
        }
    }

    clearMarkers() {
        this.markers.forEach((marker) => {
            this.markerGroup.remove(marker);
            // Dispose of geometries and materials
            marker.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        });
        this.markers.clear();
    }

    hideAllMarkers() {
        this.markers.forEach((marker) => {
            marker.visible = false;
        });
    }

    showMarkers(ids) {
        this.markers.forEach((marker, id) => {
            marker.visible = ids.includes(id);
        });
    }

    showAllMarkers() {
        this.markers.forEach((marker) => {
            marker.visible = true;
        });
    }

    getMarker(id) {
        return this.markers.get(id);
    }

    getAllMarkers() {
        return Array.from(this.markers.values());
    }

    getMarkersByType(type) {
        return Array.from(this.markers.values()).filter(
            marker => marker.userData.type === type
        );
    }

    update(deltaTime) {
        this.time += deltaTime;

        // Subtle floating animation for markers
        this.markers.forEach((marker) => {
            if (marker.visible) {
                const floatOffset = Math.sin(this.time * 2 + marker.userData.id.length) * 0.2;
                marker.position.y = marker.userData.baseY + floatOffset;

                // Animate scale for hovered markers
                const targetScale = marker.userData.isHovered ? ANIMATION.hoverScaleFactor : 1;
                this.animateMarkerScale(marker, targetScale);
            }
        });
    }

    getInteractiveObjects() {
        return Array.from(this.markers.values());
    }
}
