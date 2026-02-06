// Navigation state machine for 3-level hierarchy

export const NavigationLevel = {
    OVERVIEW: 'OVERVIEW',      // Level 1 - Full warehouse view
    SECTION: 'SECTION',        // Level 2 - Zoomed section view
    DETAIL: 'DETAIL'           // Level 3 - Asset detail modal
};

export class NavigationState {
    constructor() {
        this.currentLevel = NavigationLevel.OVERVIEW;
        this.currentSection = null;
        this.currentSubArea = null;
        this.history = [];

        // Callbacks
        this.onLevelChange = null;
        this.onSectionChange = null;
        this.onSubAreaSelect = null;
    }

    // Navigate to a section (Level 1 -> Level 2)
    navigateToSection(sectionId, sectionData) {
        if (this.currentLevel === NavigationLevel.DETAIL) {
            // Close detail first
            this.closeDetail();
        }

        this.history.push({
            level: this.currentLevel,
            section: this.currentSection
        });

        this.currentLevel = NavigationLevel.SECTION;
        this.currentSection = {
            id: sectionId,
            data: sectionData
        };

        this.triggerLevelChange();
        this.triggerSectionChange();
    }

    // Open detail modal (Level 2 -> Level 3)
    openDetail(subAreaId, subAreaData) {
        if (this.currentLevel !== NavigationLevel.SECTION) {
            console.warn('Cannot open detail from current level');
            return;
        }

        this.history.push({
            level: this.currentLevel,
            section: this.currentSection,
            subArea: this.currentSubArea
        });

        this.currentLevel = NavigationLevel.DETAIL;
        this.currentSubArea = {
            id: subAreaId,
            data: subAreaData
        };

        this.triggerLevelChange();
        this.triggerSubAreaSelect();
    }

    // Close detail modal (Level 3 -> Level 2)
    closeDetail() {
        if (this.currentLevel !== NavigationLevel.DETAIL) return;

        this.currentLevel = NavigationLevel.SECTION;
        this.currentSubArea = null;

        this.triggerLevelChange();
    }

    // Go back one level
    goBack() {
        if (this.history.length === 0) {
            // Already at overview
            return false;
        }

        if (this.currentLevel === NavigationLevel.DETAIL) {
            // Close detail, stay in section
            this.closeDetail();
            return true;
        }

        if (this.currentLevel === NavigationLevel.SECTION) {
            // Go back to overview
            this.currentLevel = NavigationLevel.OVERVIEW;
            this.currentSection = null;
            this.currentSubArea = null;
            this.history = [];

            this.triggerLevelChange();
            return true;
        }

        return false;
    }

    // Reset to overview
    resetToOverview() {
        this.currentLevel = NavigationLevel.OVERVIEW;
        this.currentSection = null;
        this.currentSubArea = null;
        this.history = [];

        this.triggerLevelChange();
    }

    // Getters
    getCurrentLevel() {
        return this.currentLevel;
    }

    getCurrentSection() {
        return this.currentSection;
    }

    getCurrentSubArea() {
        return this.currentSubArea;
    }

    isAtOverview() {
        return this.currentLevel === NavigationLevel.OVERVIEW;
    }

    isAtSection() {
        return this.currentLevel === NavigationLevel.SECTION;
    }

    isAtDetail() {
        return this.currentLevel === NavigationLevel.DETAIL;
    }

    canGoBack() {
        return this.currentLevel !== NavigationLevel.OVERVIEW;
    }

    // Event triggers
    triggerLevelChange() {
        if (this.onLevelChange) {
            this.onLevelChange(this.currentLevel, this.currentSection, this.currentSubArea);
        }
    }

    triggerSectionChange() {
        if (this.onSectionChange) {
            this.onSectionChange(this.currentSection);
        }
    }

    triggerSubAreaSelect() {
        if (this.onSubAreaSelect) {
            this.onSubAreaSelect(this.currentSubArea);
        }
    }
}
