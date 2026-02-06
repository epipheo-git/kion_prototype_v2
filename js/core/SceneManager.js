import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { COLORS } from '../config/warehouseData.js';

export class SceneManager {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.clock = new THREE.Clock();

        this.init();
    }

    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createControls();
        this.createLighting();
        this.createGround();

        window.addEventListener('resize', () => this.onResize());
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(COLORS.background);

        // Add fog for depth - matches dark background
        this.scene.fog = new THREE.Fog(COLORS.background, 120, 300);
    }

    createCamera() {
        // Perspective camera for better depth perception (like reference)
        const aspect = window.innerWidth / window.innerHeight;

        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);

        // Higher angle birds-eye view position
        this.camera.position.set(60, 50, 60);
        this.camera.lookAt(0, 0, 0);
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance'
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;

        this.container.appendChild(this.renderer.domElement);
    }

    createControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2.2; // Prevent going below ground
        this.controls.minDistance = 20;
        this.controls.maxDistance = 120;
        this.controls.target.set(0, 0, 0);
        this.controls.enablePan = true;
        this.controls.panSpeed = 0.5;
    }

    createLighting() {
        // Bright ambient light for modern warehouse feel
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        // Main directional light (sun) from above-front-right
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        sunLight.position.set(60, 100, 60);
        sunLight.castShadow = true;

        // Shadow configuration
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 200;
        sunLight.shadow.camera.left = -80;
        sunLight.shadow.camera.right = 80;
        sunLight.shadow.camera.top = 80;
        sunLight.shadow.camera.bottom = -80;
        sunLight.shadow.bias = -0.0001;

        this.scene.add(sunLight);

        // Hemisphere light - bright sky, medium floor reflection
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xa8a8a8, 0.5);
        this.scene.add(hemiLight);

        // Spotlight effects for even warehouse lighting coverage
        const spotlightPositions = [
            { x: -30, z: -20 },
            { x: 0, z: -20 },
            { x: 30, z: -20 },
            { x: -30, z: 10 },
            { x: 0, z: 10 },
            { x: 30, z: 10 },
            { x: -30, z: 35 },
            { x: 30, z: 35 }
        ];

        spotlightPositions.forEach(pos => {
            const spotlight = new THREE.SpotLight(0xffffff, 0.8);
            spotlight.position.set(pos.x, 25, pos.z);
            spotlight.target.position.set(pos.x, 0, pos.z);
            spotlight.angle = Math.PI / 5;
            spotlight.penumbra = 0.3;
            spotlight.decay = 1.2;
            spotlight.distance = 50;
            spotlight.castShadow = false; // Performance optimization
            this.scene.add(spotlight);
            this.scene.add(spotlight.target);
        });
    }

    createGround() {
        // Main warehouse floor - dark grey concrete
        const floorGeometry = new THREE.PlaneGeometry(80, 70);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: COLORS.floor,
            roughness: 0.9,
            metalness: 0.1
        });

        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Extended ground plane - dark to match background
        const groundGeometry = new THREE.PlaneGeometry(300, 300);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: COLORS.ground,
            roughness: 1.0,
            metalness: 0.0
        });

        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.02;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Floor markings - subtle grey lines
        this.createFloorMarkings();
    }

    createFloorMarkings() {
        const lineMaterial = new THREE.MeshBasicMaterial({ color: COLORS.floorLine });

        // Main aisle lines - horizontal
        const hLineGeom = new THREE.PlaneGeometry(60, 0.15);
        [-10, 10].forEach(z => {
            const line = new THREE.Mesh(hLineGeom, lineMaterial);
            line.rotation.x = -Math.PI / 2;
            line.position.set(0, 0.01, z);
            this.scene.add(line);
        });

        // Vertical lines
        const vLineGeom = new THREE.PlaneGeometry(0.15, 50);
        [-30, 30].forEach(x => {
            const line = new THREE.Mesh(vLineGeom, lineMaterial);
            line.rotation.x = -Math.PI / 2;
            line.position.set(x, 0.01, 0);
            this.scene.add(line);
        });

        // Dashed center line
        const dashMat = new THREE.MeshBasicMaterial({ color: COLORS.floorLineDash });
        for (let i = -28; i < 28; i += 3) {
            const dashGeom = new THREE.PlaneGeometry(2, 0.1);
            const dash = new THREE.Mesh(dashGeom, dashMat);
            dash.rotation.x = -Math.PI / 2;
            dash.position.set(i, 0.01, 0);
            this.scene.add(dash);
        }
    }

    onResize() {
        const aspect = window.innerWidth / window.innerHeight;

        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update() {
        if (this.controls) {
            this.controls.update();
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    add(object) {
        this.scene.add(object);
    }

    remove(object) {
        this.scene.remove(object);
    }

    getScene() {
        return this.scene;
    }

    getCamera() {
        return this.camera;
    }

    getRenderer() {
        return this.renderer;
    }

    getControls() {
        return this.controls;
    }

    getDelta() {
        return this.clock.getDelta();
    }

    getElapsedTime() {
        return this.clock.getElapsedTime();
    }

    // For camera animation - disable controls temporarily
    setControlsEnabled(enabled) {
        if (this.controls) {
            this.controls.enabled = enabled;
        }
    }

    // Update controls target for camera animation
    setControlsTarget(x, y, z) {
        if (this.controls) {
            this.controls.target.set(x, y, z);
        }
    }
}
