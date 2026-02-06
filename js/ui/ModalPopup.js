import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class ModalPopup {
    constructor() {
        this.overlay = document.getElementById('modal-overlay');
        this.content = document.getElementById('modal-content');
        this.closeBtn = document.getElementById('modal-close');
        this.viewer = document.getElementById('modal-3d-viewer');
        this.title = document.getElementById('modal-title');
        this.description = document.getElementById('modal-description');
        this.features = document.getElementById('modal-features');

        // 3D viewer components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.productMesh = null;
        this.animationId = null;

        // Callbacks
        this.onClose = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.closeBtn.addEventListener('click', () => this.close());

        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        // Touch support for swipe to rotate
        let touchStartX = 0;
        this.viewer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        this.viewer.addEventListener('touchmove', (e) => {
            if (this.productMesh) {
                const touchX = e.touches[0].clientX;
                const deltaX = touchX - touchStartX;
                this.productMesh.rotation.y += deltaX * 0.01;
                touchStartX = touchX;
            }
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    open(subAreaData) {
        // Populate content
        this.title.textContent = subAreaData.name;
        this.description.textContent = subAreaData.description;

        // Populate features list
        this.features.innerHTML = '';
        if (subAreaData.features) {
            subAreaData.features.forEach(feature => {
                const li = document.createElement('li');
                li.textContent = feature;
                this.features.appendChild(li);
            });
        }

        // Initialize 3D viewer
        this.init3DViewer(subAreaData);

        // Show modal with animation
        this.overlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            this.overlay.classList.add('visible');
        });
    }

    close() {
        this.overlay.classList.remove('visible');

        setTimeout(() => {
            this.overlay.classList.add('hidden');
            this.dispose3DViewer();

            if (this.onClose) {
                this.onClose();
            }
        }, 300);
    }

    isOpen() {
        return this.overlay.classList.contains('visible');
    }

    init3DViewer(subAreaData) {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf8f9fa);

        // Create camera
        const aspect = this.viewer.clientWidth / this.viewer.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
        this.camera.position.set(3, 2, 3);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.viewer.clientWidth, this.viewer.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.viewer.appendChild(this.renderer.domElement);

        // Add OrbitControls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 2;

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        // Create product mesh based on sub-area type
        this.createProductMesh(subAreaData);

        // Add floor grid
        const grid = new THREE.GridHelper(4, 8, 0xcccccc, 0xeeeeee);
        grid.position.y = -0.5;
        this.scene.add(grid);

        // Start animation loop
        this.animate();

        // Handle resize
        this.resizeHandler = () => this.onResize();
        window.addEventListener('resize', this.resizeHandler);
    }

    createProductMesh(subAreaData) {
        const group = new THREE.Group();
        const id = subAreaData.id;

        // Create different product representations based on type
        if (id.includes('forklift') || id.includes('truck') || id.includes('pallet') ||
            id.includes('reach') || id.includes('counter') || id.includes('order') ||
            id.includes('turret') || id.includes('tow') || id.includes('stacker') ||
            id.includes('heavy') || id.includes('matic')) {

            // Forklift-style representation
            group.add(this.createForkliftModel());

        } else if (id.includes('fleet') || id.includes('service') || id.includes('safety') ||
            id.includes('analytics')) {

            // Digital/Software representation
            group.add(this.createDigitalModel());

        } else if (id.includes('charger') || id.includes('li-ion') || id.includes('energy') ||
            id.includes('onboard')) {

            // Energy/Charging representation
            group.add(this.createChargingModel());

        } else if (id.includes('supply') || id.includes('channel') || id.includes('partner')) {

            // Service/Consulting representation
            group.add(this.createServiceModel());

        } else {
            // Default cube representation
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshStandardMaterial({
                color: 0xe67e22,
                metalness: 0.3,
                roughness: 0.7
            });
            group.add(new THREE.Mesh(geometry, material));
        }

        this.productMesh = group;
        this.scene.add(this.productMesh);
    }

    createForkliftModel() {
        const group = new THREE.Group();
        const orangeMaterial = new THREE.MeshStandardMaterial({
            color: 0xe67e22,
            metalness: 0.3,
            roughness: 0.6
        });
        const grayMaterial = new THREE.MeshStandardMaterial({
            color: 0x666666,
            metalness: 0.5,
            roughness: 0.5
        });

        // Body
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.6, 1.2),
            orangeMaterial
        );
        body.position.y = 0.3;
        group.add(body);

        // Operator cabin
        const cabin = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.5, 0.5),
            orangeMaterial
        );
        cabin.position.set(0, 0.7, -0.2);
        group.add(cabin);

        // Mast
        const mast = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 1.2, 0.1),
            grayMaterial
        );
        mast.position.set(0, 0.6, 0.6);
        group.add(mast);

        // Forks
        for (let i = -0.2; i <= 0.2; i += 0.4) {
            const fork = new THREE.Mesh(
                new THREE.BoxGeometry(0.08, 0.05, 0.6),
                grayMaterial
            );
            fork.position.set(i, 0.1, 0.8);
            group.add(fork);
        }

        // Wheels
        const wheelGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
        for (let x = -0.35; x <= 0.35; x += 0.7) {
            for (let z = -0.4; z <= 0.4; z += 0.8) {
                const wheel = new THREE.Mesh(wheelGeom, grayMaterial);
                wheel.rotation.z = Math.PI / 2;
                wheel.position.set(x * 1.2, 0.15, z);
                group.add(wheel);
            }
        }

        group.position.y = -0.2;
        return group;
    }

    createDigitalModel() {
        const group = new THREE.Group();

        // Monitor/Screen
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: 0x2c3e50,
            metalness: 0.8,
            roughness: 0.2
        });

        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(1.4, 0.9, 0.08),
            screenMaterial
        );
        group.add(frame);

        // Screen display
        const display = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.7, 0.02),
            new THREE.MeshStandardMaterial({
                color: 0x3498db,
                emissive: 0x1a5276,
                emissiveIntensity: 0.3
            })
        );
        display.position.z = 0.05;
        group.add(display);

        // Stand
        const stand = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.4, 0.3),
            screenMaterial
        );
        stand.position.set(0, -0.6, 0);
        group.add(stand);

        // Base
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.35, 0.05, 16),
            screenMaterial
        );
        base.position.set(0, -0.8, 0);
        group.add(base);

        // Data visualization dots on screen
        for (let i = 0; i < 8; i++) {
            const dot = new THREE.Mesh(
                new THREE.SphereGeometry(0.03, 8, 8),
                new THREE.MeshStandardMaterial({
                    color: i % 2 === 0 ? 0x2ecc71 : 0xe74c3c,
                    emissive: i % 2 === 0 ? 0x27ae60 : 0xc0392b,
                    emissiveIntensity: 0.5
                })
            );
            dot.position.set(
                (Math.random() - 0.5) * 1,
                (Math.random() - 0.5) * 0.5,
                0.06
            );
            group.add(dot);
        }

        return group;
    }

    createChargingModel() {
        const group = new THREE.Group();

        const whiteMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.8
        });

        // Station body
        const station = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 1.2, 0.4),
            whiteMaterial
        );
        station.position.y = 0.1;
        group.add(station);

        // Display
        const display = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.3, 0.02),
            new THREE.MeshStandardMaterial({
                color: 0x3498db,
                emissive: 0x2980b9,
                emissiveIntensity: 0.4
            })
        );
        display.position.set(0, 0.4, 0.21);
        group.add(display);

        // Charging cable
        const cable = new THREE.Mesh(
            new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8),
            new THREE.MeshStandardMaterial({ color: 0x333333 })
        );
        cable.rotation.z = Math.PI / 3;
        cable.position.set(0.4, -0.2, 0.15);
        group.add(cable);

        // Connector
        const connector = new THREE.Mesh(
            new THREE.CylinderGeometry(0.06, 0.08, 0.15, 8),
            new THREE.MeshStandardMaterial({ color: 0x27ae60 })
        );
        connector.position.set(0.6, -0.4, 0.15);
        group.add(connector);

        // Status LEDs
        const ledColors = [0x2ecc71, 0x2ecc71, 0xf39c12, 0x3498db];
        ledColors.forEach((color, i) => {
            const led = new THREE.Mesh(
                new THREE.SphereGeometry(0.04, 8, 8),
                new THREE.MeshStandardMaterial({
                    color: color,
                    emissive: color,
                    emissiveIntensity: 0.6
                })
            );
            led.position.set(-0.25 + i * 0.15, 0.6, 0.21);
            group.add(led);
        });

        group.position.y = -0.3;
        return group;
    }

    createServiceModel() {
        const group = new THREE.Group();

        // Globe/Network representation
        const globeMaterial = new THREE.MeshStandardMaterial({
            color: 0x3498db,
            metalness: 0.3,
            roughness: 0.6,
            transparent: true,
            opacity: 0.8
        });

        // Sphere (globe)
        const globe = new THREE.Mesh(
            new THREE.SphereGeometry(0.6, 32, 32),
            globeMaterial
        );
        group.add(globe);

        // Grid lines on globe
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x2c3e50 });

        // Latitude lines
        for (let lat = -60; lat <= 60; lat += 30) {
            const radius = 0.61 * Math.cos(lat * Math.PI / 180);
            const y = 0.61 * Math.sin(lat * Math.PI / 180);
            const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI);
            const points = curve.getPoints(32);
            const geometry = new THREE.BufferGeometry().setFromPoints(
                points.map(p => new THREE.Vector3(p.x, y, p.y))
            );
            const line = new THREE.Line(geometry, lineMaterial);
            group.add(line);
        }

        // Connection nodes
        const nodePositions = [
            [0.5, 0.3, 0.2],
            [-0.4, 0.4, 0.3],
            [0.3, -0.4, 0.4],
            [-0.3, -0.3, -0.5],
            [0.2, 0.5, -0.3]
        ];

        nodePositions.forEach(pos => {
            const node = new THREE.Mesh(
                new THREE.SphereGeometry(0.06, 8, 8),
                new THREE.MeshStandardMaterial({
                    color: 0xe74c3c,
                    emissive: 0xc0392b,
                    emissiveIntensity: 0.5
                })
            );
            node.position.set(...pos);
            group.add(node);
        });

        return group;
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());

        if (this.controls) {
            this.controls.update();
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    onResize() {
        if (!this.camera || !this.renderer || !this.viewer) return;

        const width = this.viewer.clientWidth;
        const height = this.viewer.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    dispose3DViewer() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        if (this.controls) {
            this.controls.dispose();
            this.controls = null;
        }

        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
            this.renderer = null;
        }

        if (this.scene) {
            this.scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(m => m.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
            this.scene = null;
        }

        this.productMesh = null;
        this.camera = null;

        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
            this.resizeHandler = null;
        }
    }
}
