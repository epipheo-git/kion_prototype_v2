import * as THREE from 'three';

export class HighlightSystem {
    constructor(scene) {
        this.scene = scene;
        this.highlightedObjects = new Set();
        this.originalMaterials = new Map();
    }

    highlightObject(object, color = 0xffff00, intensity = 0.3) {
        if (!object || this.highlightedObjects.has(object)) return;

        this.highlightedObjects.add(object);

        object.traverse((child) => {
            if (child.isMesh && child.material) {
                // Store original material
                if (!this.originalMaterials.has(child)) {
                    this.originalMaterials.set(child, child.material.clone());
                }

                // Create highlighted material
                if (child.material.emissive) {
                    child.material.emissive = new THREE.Color(color);
                    child.material.emissiveIntensity = intensity;
                }
            }
        });
    }

    unhighlightObject(object) {
        if (!object || !this.highlightedObjects.has(object)) return;

        this.highlightedObjects.delete(object);

        object.traverse((child) => {
            if (child.isMesh && this.originalMaterials.has(child)) {
                const originalMaterial = this.originalMaterials.get(child);

                if (child.material.emissive) {
                    child.material.emissive = originalMaterial.emissive || new THREE.Color(0x000000);
                    child.material.emissiveIntensity = originalMaterial.emissiveIntensity || 0;
                }
            }
        });
    }

    clearAllHighlights() {
        this.highlightedObjects.forEach((object) => {
            this.unhighlightObject(object);
        });
        this.highlightedObjects.clear();
    }

    pulseHighlight(object, duration = 1000) {
        const startTime = Date.now();
        const originalIntensity = 0;
        const maxIntensity = 0.5;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = (elapsed % duration) / duration;
            const intensity = originalIntensity + (maxIntensity - originalIntensity) * Math.sin(progress * Math.PI);

            object.traverse((child) => {
                if (child.isMesh && child.material && child.material.emissiveIntensity !== undefined) {
                    child.material.emissiveIntensity = intensity;
                }
            });

            if (this.highlightedObjects.has(object)) {
                requestAnimationFrame(animate);
            }
        };

        if (this.highlightedObjects.has(object)) {
            animate();
        }
    }

    dispose() {
        this.clearAllHighlights();
        this.originalMaterials.clear();
    }
}
