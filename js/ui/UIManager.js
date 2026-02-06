import { SECTIONS, COLORS } from '../config/warehouseData.js';
import { NavigationLevel } from '../state/NavigationState.js';

export class UIManager {
    constructor(navigationState) {
        this.navigationState = navigationState;

        // DOM Elements
        this.backButton = document.getElementById('back-button');
        this.sectionTitle = document.getElementById('section-title');
        this.legendPanel = document.getElementById('legend-panel');
        this.legendItems = document.getElementById('legend-items');
        this.loadingScreen = document.getElementById('loading-screen');

        // Callbacks
        this.onBackClick = null;
        this.onLegendItemClick = null;
        this.onLegendItemHover = null;
        this.onLegendItemHoverEnd = null;

        this.setupEventListeners();
        this.updateLegend();
    }

    setupEventListeners() {
        this.backButton.addEventListener('click', () => {
            if (this.onBackClick) {
                this.onBackClick();
            }
        });

        // Touch feedback for back button
        this.backButton.addEventListener('touchstart', () => {
            this.backButton.style.transform = 'scale(0.95)';
        });

        this.backButton.addEventListener('touchend', () => {
            this.backButton.style.transform = '';
        });
    }

    updateForLevel(level, section, subArea) {
        switch (level) {
            case NavigationLevel.OVERVIEW:
                this.showOverviewUI();
                break;
            case NavigationLevel.SECTION:
                this.showSectionUI(section);
                break;
            case NavigationLevel.DETAIL:
                // Modal handles this
                break;
        }
    }

    showOverviewUI() {
        this.backButton.classList.add('hidden');
        this.sectionTitle.classList.add('hidden');
        this.updateLegendForOverview();
    }

    showSectionUI(section) {
        this.backButton.classList.remove('hidden');

        if (section && section.data) {
            this.sectionTitle.textContent = section.data.name;
            this.sectionTitle.classList.remove('hidden');
            this.updateLegendForSection(section.data);
        }
    }

    updateLegend() {
        this.updateLegendForOverview();
    }

    updateLegendForOverview() {
        this.legendItems.innerHTML = '';

        // Add all main sections to legend
        Object.values(SECTIONS).forEach(section => {
            const item = this.createLegendItem(section.id, section.name, section.color);
            this.legendItems.appendChild(item);
        });
    }

    updateLegendForSection(sectionData) {
        this.legendItems.innerHTML = '';

        // Add sub-areas to legend
        if (sectionData.subAreas) {
            sectionData.subAreas.forEach(subArea => {
                const item = this.createLegendItem(subArea.id, subArea.name, sectionData.color);
                this.legendItems.appendChild(item);
            });
        }
    }

    createLegendItem(id, name, color) {
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.dataset.id = id;

        const dot = document.createElement('div');
        dot.className = 'legend-dot';
        dot.style.backgroundColor = '#' + color.toString(16).padStart(6, '0');

        const label = document.createElement('span');
        label.textContent = name;

        item.appendChild(dot);
        item.appendChild(label);

        // Click handler
        item.addEventListener('click', () => {
            if (this.onLegendItemClick) {
                this.onLegendItemClick(id);
            }
        });

        // Hover handlers for floor highlighting
        item.addEventListener('mouseenter', () => {
            this.highlightLegendItem(id);
            if (this.onLegendItemHover) {
                this.onLegendItemHover(id, color);
            }
        });

        item.addEventListener('mouseleave', () => {
            this.clearLegendHighlight();
            if (this.onLegendItemHoverEnd) {
                this.onLegendItemHoverEnd(id);
            }
        });

        return item;
    }

    highlightLegendItem(id) {
        const items = this.legendItems.querySelectorAll('.legend-item');
        items.forEach(item => {
            if (item.dataset.id === id) {
                item.style.background = 'rgba(255, 255, 255, 0.15)';
            } else {
                item.style.background = '';
            }
        });
    }

    clearLegendHighlight() {
        const items = this.legendItems.querySelectorAll('.legend-item');
        items.forEach(item => {
            item.style.background = '';
        });
    }

    hideLoading() {
        this.loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
        }, 500);
    }

    showLoading() {
        this.loadingScreen.style.display = 'flex';
        this.loadingScreen.classList.remove('fade-out');
    }

    // Marker label tooltip
    showMarkerLabel(label, screenPosition) {
        let tooltip = document.querySelector('.marker-label');

        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'marker-label';
            document.body.appendChild(tooltip);
        }

        tooltip.textContent = label;
        tooltip.style.left = screenPosition.x + 'px';
        tooltip.style.top = screenPosition.y + 'px';
        tooltip.classList.add('visible');
    }

    hideMarkerLabel() {
        const tooltip = document.querySelector('.marker-label');
        if (tooltip) {
            tooltip.classList.remove('visible');
        }
    }

    dispose() {
        const tooltip = document.querySelector('.marker-label');
        if (tooltip) {
            tooltip.remove();
        }
    }
}
