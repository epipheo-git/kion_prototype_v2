export class ModalPopup {
    constructor() {
        this.overlay = document.getElementById('modal-overlay');
        this.content = document.getElementById('modal-content');
        this.closeBtn = document.getElementById('modal-close');
        this.productHeader = document.getElementById('modal-product-header');
        this.title = document.getElementById('modal-title');
        this.description = document.getElementById('modal-description');
        this.features = document.getElementById('modal-features');

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

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    open(subAreaData) {
        // Create product header with icon
        this.createProductHeader(subAreaData);

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

        // Show panel with slide-in animation
        this.overlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            this.overlay.classList.add('visible');
        });
    }

    close() {
        this.overlay.classList.remove('visible');

        setTimeout(() => {
            this.overlay.classList.add('hidden');

            if (this.onClose) {
                this.onClose();
            }
        }, 400); // Match CSS transition duration
    }

    isOpen() {
        return this.overlay.classList.contains('visible');
    }

    createProductHeader(subAreaData) {
        const modelType = subAreaData.modelType || 'vehicle';

        // Icon SVGs for each model type
        const ICONS = {
            vehicle: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="8" y="18" width="24" height="16" rx="2"/>
                <rect x="28" y="24" width="12" height="10" rx="1"/>
                <line x1="6" y1="14" x2="6" y2="30"/>
                <line x1="2" y1="26" x2="10" y2="26"/>
                <line x1="2" y1="22" x2="10" y2="22"/>
                <circle cx="14" cy="38" r="4"/>
                <circle cx="34" cy="38" r="4"/>
            </svg>`,
            digital: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="6" y="6" width="36" height="26" rx="2"/>
                <rect x="10" y="10" width="28" height="18" rx="1"/>
                <line x1="24" y1="32" x2="24" y2="38"/>
                <line x1="16" y1="38" x2="32" y2="38"/>
                <circle cx="20" cy="19" r="2" fill="currentColor"/>
                <circle cx="28" cy="19" r="2" fill="currentColor"/>
                <path d="M14 24 L20 20 L26 22 L34 16"/>
            </svg>`,
            energy: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="12" y="8" width="24" height="32" rx="3"/>
                <rect x="16" y="14" width="16" height="8" rx="1"/>
                <path d="M26 18 L22 24 L28 24 L24 30" fill="currentColor"/>
                <circle cx="18" cy="34" r="2" fill="currentColor"/>
                <circle cx="24" cy="34" r="2" fill="currentColor"/>
                <circle cx="30" cy="34" r="2" fill="currentColor"/>
                <path d="M36 28 Q42 28 42 22 L42 20" stroke-dasharray="3 2"/>
            </svg>`,
            service: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="24" cy="24" r="16"/>
                <ellipse cx="24" cy="24" rx="16" ry="6"/>
                <ellipse cx="24" cy="24" rx="6" ry="16"/>
                <circle cx="16" cy="16" r="3" fill="currentColor"/>
                <circle cx="34" cy="20" r="3" fill="currentColor"/>
                <circle cx="20" cy="32" r="3" fill="currentColor"/>
            </svg>`
        };

        const TYPE_LABELS = {
            vehicle: 'Vehicle',
            digital: 'Digital Solution',
            energy: 'Energy Solution',
            service: 'Service & Support'
        };

        const TYPE_COLORS = {
            vehicle: '#e67e22',
            digital: '#3498db',
            energy: '#2ecc71',
            service: '#9b59b6'
        };

        const icon = ICONS[modelType] || ICONS.vehicle;
        const label = TYPE_LABELS[modelType] || 'Product';
        const color = TYPE_COLORS[modelType] || '#e67e22';

        this.productHeader.style.borderLeftColor = color;
        this.productHeader.innerHTML = `
            <div class="product-icon" style="color: ${color}">${icon}</div>
            <span class="product-type-badge" style="background: ${color}">${label}</span>
        `;
    }
}
