import * as THREE from 'three';

export class InputHandler {
    constructor(renderer, camera) {
        this.renderer = renderer;
        this.camera = camera;
        this.domElement = renderer.domElement;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Interaction state
        this.hoveredObject = null;
        this.interactiveObjects = [];
        this.enabled = true;

        // Callbacks
        this.onHover = null;
        this.onHoverEnd = null;
        this.onClick = null;

        // Touch handling
        this.touchStartTime = 0;
        this.touchStartPosition = { x: 0, y: 0 };
        this.isTouchDevice = 'ontouchstart' in window;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Mouse events
        this.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.domElement.addEventListener('click', (e) => this.onClickEvent(e));

        // Touch events
        this.domElement.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
        this.domElement.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: false });
        this.domElement.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
    }

    setInteractiveObjects(objects) {
        this.interactiveObjects = objects;
    }

    addInteractiveObject(object) {
        if (!this.interactiveObjects.includes(object)) {
            this.interactiveObjects.push(object);
        }
    }

    removeInteractiveObject(object) {
        const index = this.interactiveObjects.indexOf(object);
        if (index !== -1) {
            this.interactiveObjects.splice(index, 1);
        }
    }

    clearInteractiveObjects() {
        this.interactiveObjects = [];
    }

    updateMousePosition(clientX, clientY) {
        const rect = this.domElement.getBoundingClientRect();
        this.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    }

    performRaycast() {
        if (!this.enabled || this.interactiveObjects.length === 0) return null;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

        if (intersects.length > 0) {
            // Find the marker parent
            let object = intersects[0].object;
            while (object && !object.userData.isMarker) {
                object = object.parent;
            }
            return object;
        }

        return null;
    }

    onMouseMove(event) {
        if (!this.enabled) return;

        this.updateMousePosition(event.clientX, event.clientY);
        const intersected = this.performRaycast();

        if (intersected !== this.hoveredObject) {
            // Hover ended on previous object
            if (this.hoveredObject && this.onHoverEnd) {
                this.onHoverEnd(this.hoveredObject);
            }

            // Hover started on new object
            this.hoveredObject = intersected;

            if (this.hoveredObject && this.onHover) {
                this.onHover(this.hoveredObject);
            }
        }

        // Update cursor
        this.domElement.style.cursor = intersected ? 'pointer' : 'default';
    }

    onClickEvent(event) {
        if (!this.enabled) return;

        this.updateMousePosition(event.clientX, event.clientY);
        const intersected = this.performRaycast();

        if (intersected && this.onClick) {
            this.onClick(intersected);
        }
    }

    onTouchStart(event) {
        if (!this.enabled) return;

        if (event.touches.length === 1) {
            event.preventDefault();

            const touch = event.touches[0];
            this.touchStartTime = Date.now();
            this.touchStartPosition = { x: touch.clientX, y: touch.clientY };

            // Update hover state on touch
            this.updateMousePosition(touch.clientX, touch.clientY);
            const intersected = this.performRaycast();

            if (intersected !== this.hoveredObject) {
                if (this.hoveredObject && this.onHoverEnd) {
                    this.onHoverEnd(this.hoveredObject);
                }

                this.hoveredObject = intersected;

                if (this.hoveredObject && this.onHover) {
                    this.onHover(this.hoveredObject);
                }
            }
        }
    }

    onTouchMove(event) {
        if (!this.enabled) return;

        // Update hover state during touch move
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            this.updateMousePosition(touch.clientX, touch.clientY);

            const intersected = this.performRaycast();

            if (intersected !== this.hoveredObject) {
                if (this.hoveredObject && this.onHoverEnd) {
                    this.onHoverEnd(this.hoveredObject);
                }

                this.hoveredObject = intersected;

                if (this.hoveredObject && this.onHover) {
                    this.onHover(this.hoveredObject);
                }
            }
        }
    }

    onTouchEnd(event) {
        if (!this.enabled) return;

        event.preventDefault();

        const touchDuration = Date.now() - this.touchStartTime;
        const touchEndPosition = event.changedTouches[0];

        // Calculate distance moved
        const dx = touchEndPosition.clientX - this.touchStartPosition.x;
        const dy = touchEndPosition.clientY - this.touchStartPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Treat as tap if short duration and minimal movement
        if (touchDuration < 300 && distance < 20) {
            this.updateMousePosition(touchEndPosition.clientX, touchEndPosition.clientY);
            const intersected = this.performRaycast();

            if (intersected && this.onClick) {
                this.onClick(intersected);
            }
        }

        // Clear hover state
        if (this.hoveredObject && this.onHoverEnd) {
            this.onHoverEnd(this.hoveredObject);
        }
        this.hoveredObject = null;
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) {
            this.domElement.style.cursor = 'default';
            if (this.hoveredObject && this.onHoverEnd) {
                this.onHoverEnd(this.hoveredObject);
            }
            this.hoveredObject = null;
        }
    }

    // Get screen position of a 3D point
    getScreenPosition(worldPosition) {
        const vector = new THREE.Vector3(worldPosition.x, worldPosition.y, worldPosition.z);
        vector.project(this.camera);

        const widthHalf = window.innerWidth / 2;
        const heightHalf = window.innerHeight / 2;

        return {
            x: (vector.x * widthHalf) + widthHalf,
            y: -(vector.y * heightHalf) + heightHalf
        };
    }

    dispose() {
        this.domElement.removeEventListener('mousemove', this.onMouseMove);
        this.domElement.removeEventListener('click', this.onClickEvent);
        this.domElement.removeEventListener('touchstart', this.onTouchStart);
        this.domElement.removeEventListener('touchend', this.onTouchEnd);
        this.domElement.removeEventListener('touchmove', this.onTouchMove);
    }
}
