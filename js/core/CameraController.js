import * as THREE from 'three';
import { ANIMATION, CAMERA_POSITIONS } from '../config/warehouseData.js';

export class CameraController {
    constructor(camera, controls) {
        this.camera = camera;
        this.controls = controls;

        // Animation state
        this.isAnimating = false;
        this.animationProgress = 0;

        // Current and target states
        this.currentTarget = new THREE.Vector3(0, 0, 0);
        this.currentPosition = camera.position.clone();

        // Animation endpoints
        this.startTarget = new THREE.Vector3();
        this.endTarget = new THREE.Vector3();
        this.startPosition = new THREE.Vector3();
        this.endPosition = new THREE.Vector3();

        // Animation callbacks
        this.onAnimationComplete = null;
    }

    // Easing function - easeInOutCubic
    easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Calculate camera position for a target with zoom level
    calculateCameraPosition(target, zoomLevel) {
        // Base offset for birds-eye view
        const baseDistance = 60;
        const distance = baseDistance / zoomLevel;

        // Keep the same angle but adjust distance
        const angle = Math.PI / 4; // 45 degree angle
        const elevation = 50 / zoomLevel;

        return new THREE.Vector3(
            target.x + distance * Math.sin(angle),
            elevation,
            target.z + distance * Math.cos(angle)
        );
    }

    // Animate to a new target position with zoom
    animateTo(target, zoom, onComplete = null) {
        if (this.isAnimating) {
            // Force complete current animation
            this.completeAnimation();
        }

        // Disable controls during animation
        if (this.controls) {
            this.controls.enabled = false;
        }

        this.isAnimating = true;
        this.animationProgress = 0;
        this.onAnimationComplete = onComplete;

        // Store starting state
        this.startTarget.copy(this.controls ? this.controls.target : this.currentTarget);
        this.startPosition.copy(this.camera.position);

        // Set ending state
        this.endTarget.set(target.x, target.y, target.z);
        this.endPosition.copy(this.calculateCameraPosition(target, zoom));
    }

    // Animate back to overview
    animateToOverview(onComplete = null) {
        const overview = CAMERA_POSITIONS.overview;

        if (this.isAnimating) {
            this.completeAnimation();
        }

        if (this.controls) {
            this.controls.enabled = false;
        }

        this.isAnimating = true;
        this.animationProgress = 0;
        this.onAnimationComplete = onComplete;

        // Store starting state
        this.startTarget.copy(this.controls ? this.controls.target : this.currentTarget);
        this.startPosition.copy(this.camera.position);

        // Set ending state
        this.endTarget.set(overview.target.x, overview.target.y, overview.target.z);
        this.endPosition.set(overview.position.x, overview.position.y, overview.position.z);
    }

    // Animate to section
    animateToSection(sectionData, onComplete = null) {
        this.animateTo(
            sectionData.cameraTarget,
            sectionData.cameraZoom,
            onComplete
        );
    }

    // Update animation each frame
    update(deltaTime) {
        if (!this.isAnimating) return;

        // Progress animation
        const duration = ANIMATION.cameraTransitionDuration / 1000; // Convert to seconds
        this.animationProgress += deltaTime / duration;

        if (this.animationProgress >= 1) {
            this.completeAnimation();
            return;
        }

        // Apply easing
        const t = this.easeInOutCubic(this.animationProgress);

        // Interpolate target
        this.currentTarget.lerpVectors(this.startTarget, this.endTarget, t);

        // Interpolate position
        this.currentPosition.lerpVectors(this.startPosition, this.endPosition, t);

        // Update camera
        this.camera.position.copy(this.currentPosition);
        this.camera.lookAt(this.currentTarget);

        // Update controls target
        if (this.controls) {
            this.controls.target.copy(this.currentTarget);
        }
    }

    completeAnimation() {
        this.isAnimating = false;
        this.animationProgress = 1;

        // Set final values
        this.currentTarget.copy(this.endTarget);
        this.currentPosition.copy(this.endPosition);

        this.camera.position.copy(this.currentPosition);
        this.camera.lookAt(this.currentTarget);

        // Update and re-enable controls
        if (this.controls) {
            this.controls.target.copy(this.currentTarget);
            this.controls.enabled = true;
            this.controls.update();
        }

        // Call completion callback
        if (this.onAnimationComplete) {
            const callback = this.onAnimationComplete;
            this.onAnimationComplete = null;
            callback();
        }
    }

    // Get current state
    getCurrentTarget() {
        return this.currentTarget.clone();
    }

    isInMotion() {
        return this.isAnimating;
    }

    // Set immediate position without animation
    setImmediate(target, zoom) {
        const position = this.calculateCameraPosition(target, zoom);

        this.currentTarget.set(target.x, target.y, target.z);
        this.currentPosition.copy(position);

        this.camera.position.copy(position);
        this.camera.lookAt(this.currentTarget);

        if (this.controls) {
            this.controls.target.copy(this.currentTarget);
            this.controls.update();
        }
    }
}
