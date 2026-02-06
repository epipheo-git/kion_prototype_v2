import * as THREE from 'three';

import { SceneManager } from './core/SceneManager.js';
import { CameraController } from './core/CameraController.js';
import { InputHandler } from './core/InputHandler.js';

import { WarehouseBuilder } from './warehouse/WarehouseBuilder.js';
import { MarkerSystem } from './warehouse/MarkerSystem.js';
import { HighlightSystem } from './warehouse/HighlightSystem.js';

import { NavigationState, NavigationLevel } from './state/NavigationState.js';
import { UIManager } from './ui/UIManager.js';
import { ModalPopup } from './ui/ModalPopup.js';

import { SECTIONS, COLORS } from './config/warehouseData.js';

class WarehouseExperience {
    constructor() {
        this.container = document.getElementById('canvas-container');

        // Core systems
        this.sceneManager = null;
        this.cameraController = null;
        this.inputHandler = null;

        // Warehouse systems
        this.warehouseBuilder = null;
        this.markerSystem = null;
        this.highlightSystem = null;

        // State and UI
        this.navigationState = null;
        this.uiManager = null;
        this.modalPopup = null;

        // Current markers data
        this.sectionMarkers = [];
        this.subAreaMarkers = [];

        this.init();
    }

    async init() {
        // Initialize scene
        this.sceneManager = new SceneManager(this.container);

        // Initialize camera controller with controls reference
        this.cameraController = new CameraController(
            this.sceneManager.getCamera(),
            this.sceneManager.getControls()
        );

        // Initialize input handler
        this.inputHandler = new InputHandler(
            this.sceneManager.getRenderer(),
            this.sceneManager.getCamera()
        );

        // Build warehouse
        this.warehouseBuilder = new WarehouseBuilder(this.sceneManager.getScene());
        this.warehouseBuilder.build();

        // Initialize marker system
        this.markerSystem = new MarkerSystem(this.sceneManager.getScene());
        this.createSectionMarkers();

        // Initialize highlight system
        this.highlightSystem = new HighlightSystem(this.sceneManager.getScene());

        // Initialize navigation state
        this.navigationState = new NavigationState();
        this.setupNavigationCallbacks();

        // Initialize UI
        this.uiManager = new UIManager(this.navigationState);
        this.setupUICallbacks();

        // Initialize modal
        this.modalPopup = new ModalPopup();
        this.setupModalCallbacks();

        // Setup input callbacks
        this.setupInputCallbacks();

        // Set initial interactive objects
        this.updateInteractiveObjects();

        // Hide loading screen
        setTimeout(() => {
            this.uiManager.hideLoading();
        }, 500);

        // Start render loop
        this.animate();
    }

    createSectionMarkers() {
        // Create markers for each main section
        Object.entries(SECTIONS).forEach(([key, section]) => {
            const marker = this.markerSystem.createMarker(
                section.id,
                section.markerPosition,
                section.color,
                section.name,
                'section'
            );
            this.sectionMarkers.push(marker);
        });
    }

    createSubAreaMarkers(sectionData) {
        // Clear existing sub-area markers
        this.subAreaMarkers.forEach(marker => {
            this.markerSystem.markers.delete(marker.userData.id);
            this.markerSystem.markerGroup.remove(marker);
        });
        this.subAreaMarkers = [];

        // Create markers for sub-areas
        if (sectionData.subAreas) {
            sectionData.subAreas.forEach(subArea => {
                const marker = this.markerSystem.createMarker(
                    subArea.id,
                    subArea.markerPosition,
                    sectionData.color,
                    subArea.name,
                    'subArea'
                );
                this.subAreaMarkers.push(marker);
            });
        }
    }

    clearSubAreaMarkers() {
        this.subAreaMarkers.forEach(marker => {
            this.markerSystem.markers.delete(marker.userData.id);
            this.markerSystem.markerGroup.remove(marker);
        });
        this.subAreaMarkers = [];
    }

    updateInteractiveObjects() {
        const level = this.navigationState.getCurrentLevel();
        this.inputHandler.clearInteractiveObjects();

        if (level === NavigationLevel.OVERVIEW) {
            // Only section markers are interactive
            this.sectionMarkers.forEach(marker => {
                this.inputHandler.addInteractiveObject(marker);
            });
            // Show section markers, hide sub-area markers
            this.markerSystem.showMarkers(this.sectionMarkers.map(m => m.userData.id));
        } else if (level === NavigationLevel.SECTION) {
            // Only sub-area markers are interactive
            this.subAreaMarkers.forEach(marker => {
                this.inputHandler.addInteractiveObject(marker);
            });
            // Show only sub-area markers
            this.markerSystem.hideAllMarkers();
            this.markerSystem.showMarkers(this.subAreaMarkers.map(m => m.userData.id));
        }
    }

    setupNavigationCallbacks() {
        this.navigationState.onLevelChange = (level, section, subArea) => {
            this.onNavigationLevelChange(level, section, subArea);
        };
    }

    onNavigationLevelChange(level, section, subArea) {
        // Disable input during transitions
        this.inputHandler.setEnabled(false);

        // Update UI
        this.uiManager.updateForLevel(level, section, subArea);

        switch (level) {
            case NavigationLevel.OVERVIEW:
                this.clearSubAreaMarkers();
                this.cameraController.animateToOverview(() => {
                    this.updateInteractiveObjects();
                    this.inputHandler.setEnabled(true);
                });
                break;

            case NavigationLevel.SECTION:
                if (section && section.data) {
                    this.createSubAreaMarkers(section.data);
                    this.cameraController.animateToSection(section.data, () => {
                        this.updateInteractiveObjects();
                        this.inputHandler.setEnabled(true);
                    });
                }
                break;

            case NavigationLevel.DETAIL:
                // Modal handles the detail view
                this.inputHandler.setEnabled(false);
                break;
        }
    }

    setupUICallbacks() {
        this.uiManager.onBackClick = () => {
            this.navigationState.goBack();
        };

        this.uiManager.onLegendItemClick = (id) => {
            // Find and click the corresponding marker
            const level = this.navigationState.getCurrentLevel();

            if (level === NavigationLevel.OVERVIEW) {
                const sectionData = SECTIONS[id] || Object.values(SECTIONS).find(s => s.id === id);
                if (sectionData) {
                    this.navigationState.navigateToSection(id, sectionData);
                }
            } else if (level === NavigationLevel.SECTION) {
                const currentSection = this.navigationState.getCurrentSection();
                if (currentSection && currentSection.data && currentSection.data.subAreas) {
                    const subArea = currentSection.data.subAreas.find(sa => sa.id === id);
                    if (subArea) {
                        this.navigationState.openDetail(id, subArea);
                        this.modalPopup.open(subArea);
                    }
                }
            }
        };

        // Legend hover callbacks for floor highlighting
        this.uiManager.onLegendItemHover = (id, color) => {
            const level = this.navigationState.getCurrentLevel();
            if (level === NavigationLevel.OVERVIEW) {
                this.warehouseBuilder.hideAllHighlights();
                this.warehouseBuilder.showSectionHighlight(id, color);
            }
        };

        this.uiManager.onLegendItemHoverEnd = (id) => {
            const level = this.navigationState.getCurrentLevel();
            if (level === NavigationLevel.OVERVIEW) {
                this.warehouseBuilder.hideSectionHighlight(id);
            }
        };
    }

    setupModalCallbacks() {
        this.modalPopup.onClose = () => {
            this.navigationState.closeDetail();
            this.inputHandler.setEnabled(true);
        };
    }

    setupInputCallbacks() {
        this.inputHandler.onHover = (marker) => {
            if (!marker || !marker.userData) return;

            this.markerSystem.setMarkerHover(marker.userData.id, true);
            marker.userData.isHovered = true;

            // Show label tooltip
            const screenPos = this.inputHandler.getScreenPosition(marker.position);
            this.uiManager.showMarkerLabel(marker.userData.label, screenPos);

            // Highlight legend item
            this.uiManager.highlightLegendItem(marker.userData.id);

            // Highlight section floor (only for main section markers)
            if (marker.userData.type === 'section') {
                const sectionId = marker.userData.id;
                const sectionData = SECTIONS[sectionId];
                const highlightColor = sectionData ? sectionData.color : 0x4a90d9;
                this.warehouseBuilder.hideAllHighlights();
                this.warehouseBuilder.showSectionHighlight(sectionId, highlightColor);
            }
        };

        this.inputHandler.onHoverEnd = (marker) => {
            if (!marker || !marker.userData) return;

            this.markerSystem.setMarkerHover(marker.userData.id, false);
            marker.userData.isHovered = false;

            // Hide label tooltip
            this.uiManager.hideMarkerLabel();

            // Clear legend highlight
            this.uiManager.clearLegendHighlight();

            // Hide floor highlight
            if (marker.userData.type === 'section') {
                this.warehouseBuilder.hideSectionHighlight(marker.userData.id);
            }
        };

        this.inputHandler.onClick = (marker) => {
            if (!marker || !marker.userData) return;

            const level = this.navigationState.getCurrentLevel();

            if (level === NavigationLevel.OVERVIEW && marker.userData.type === 'section') {
                // Navigate to section
                const sectionId = marker.userData.id;
                const sectionData = SECTIONS[sectionId] || Object.values(SECTIONS).find(s => s.id === sectionId);

                if (sectionData) {
                    this.uiManager.hideMarkerLabel();
                    this.navigationState.navigateToSection(sectionId, sectionData);
                }
            } else if (level === NavigationLevel.SECTION && marker.userData.type === 'subArea') {
                // Open detail modal
                const currentSection = this.navigationState.getCurrentSection();
                if (currentSection && currentSection.data && currentSection.data.subAreas) {
                    const subArea = currentSection.data.subAreas.find(
                        sa => sa.id === marker.userData.id
                    );

                    if (subArea) {
                        this.uiManager.hideMarkerLabel();
                        this.navigationState.openDetail(marker.userData.id, subArea);
                        this.modalPopup.open(subArea);
                    }
                }
            }
        };
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const deltaTime = this.sceneManager.getDelta();
        const time = performance.now();

        // Update orbit controls
        this.sceneManager.update();

        // Update camera controller
        this.cameraController.update(deltaTime);

        // Update marker animations
        this.markerSystem.update(deltaTime);

        // Update warehouse animations (conveyor boxes, forklifts)
        if (this.warehouseBuilder && this.warehouseBuilder.updateAnimations) {
            this.warehouseBuilder.updateAnimations(time);
        }

        // Render scene
        this.sceneManager.render();
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.warehouseExperience = new WarehouseExperience();
});
