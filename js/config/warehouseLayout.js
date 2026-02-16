// SINGLE SOURCE OF TRUTH for all spatial positions, bounds, and derived data.
// To move a section: change its `origin` here. Everything else recomputes.

export const WAREHOUSE_BOUNDS = {
    left: -65,
    right: 60,
    back: -50,
    front: 40,
    wallHeight: 8,
    wallThickness: 0.4
};

export const SECTION_LAYOUT = {
    myLinde: {
        origin: { x: -50, z: 15 },
        size: { width: 30, depth: 20 },
        wallBounds: { left: -65, right: -35, back: 5, front: 25 },
        markerY: 10,
        cameraZoom: 2.8,
        floorMaterial: 'floorOffice',
        assetScale: 1.4
    },
    fullPortfolio: {
        origin: { x: 0, z: 8 },
        size: { width: 95, depth: 64 },
        wallBounds: { left: -35, right: 60, back: -24, front: 40 },
        markerY: 12,
        cameraZoom: 1.5,
        floorMaterial: 'floor',
        assetScale: 1.4
    },
    automation: {
        origin: { x: -10, z: -37 },
        size: { width: 55, depth: 26 },
        wallBounds: { left: -35, right: 20, back: -50, front: -24 },
        markerY: 12,
        cameraZoom: 2.0,
        floorMaterial: 'floorLight',
        assetScale: 1.4
    },
    energySolutions: {
        origin: { x: -50, z: -37 },
        size: { width: 30, depth: 26 },
        wallBounds: { left: -65, right: -35, back: -50, front: -24 },
        markerY: 10,
        cameraZoom: 2.5,
        floorMaterial: 'floorLight',
        assetScale: 1.4
    },
    expertise: {
        origin: { x: 40, z: -37 },
        size: { width: 40, depth: 26 },
        wallBounds: { left: 20, right: 60, back: -50, front: -24 },
        markerY: 14,
        cameraZoom: 2.2,
        floorMaterial: 'floor',
        assetScale: 1.4
    }
};

// --- Derived functions (computed from SECTION_LAYOUT) ---

// Section bounds for highlight overlays — replaces getSectionBounds() in WarehouseBuilder
export function getSectionBounds(sectionId) {
    const layout = SECTION_LAYOUT[sectionId];
    if (!layout) return null;
    return {
        x: layout.origin.x,
        z: layout.origin.z,
        width: layout.size.width,
        depth: layout.size.depth
    };
}

// Marker position from origin — replaces markerPosition in warehouseData
export function getSectionMarkerPosition(sectionId) {
    const layout = SECTION_LAYOUT[sectionId];
    if (!layout) return null;
    return {
        x: layout.origin.x,
        y: layout.markerY,
        z: layout.origin.z
    };
}

// Camera target from origin — replaces cameraTarget in warehouseData
export function getSectionCameraTarget(sectionId) {
    const layout = SECTION_LAYOUT[sectionId];
    if (!layout) return null;
    return {
        x: layout.origin.x,
        y: 0,
        z: layout.origin.z
    };
}

// Compute absolute position for a subArea from section origin + subArea offset
export function getSubAreaAbsolutePosition(sectionId, subArea) {
    const layout = SECTION_LAYOUT[sectionId];
    if (!layout) return subArea.offset;
    return {
        x: layout.origin.x + subArea.offset.x,
        y: subArea.offset.y || 0,
        z: layout.origin.z + subArea.offset.z
    };
}

// Compute marker position for a subArea
export function getSubAreaMarkerPosition(sectionId, subArea) {
    const layout = SECTION_LAYOUT[sectionId];
    if (!layout) return subArea.offset;
    return {
        x: layout.origin.x + subArea.offset.x,
        y: subArea.markerOffsetY,
        z: layout.origin.z + subArea.offset.z
    };
}

// Wall segments computed from section wallBounds — replaces hardcoded createWall() calls
export function computeWallSegments() {
    const B = WAREHOUSE_BOUNDS;
    const walls = [];

    // === MAIN WAREHOUSE ENCLOSURE ===

    // Back wall (full length)
    walls.push({
        x: (B.left + B.right) / 2,
        z: B.back,
        width: B.right - B.left,
        depth: B.wallThickness
    });

    // Left wall
    walls.push({
        x: B.left,
        z: (B.back + B.front) / 2,
        width: B.wallThickness,
        depth: B.front - B.back
    });

    // Right wall
    walls.push({
        x: B.right,
        z: (B.back + B.front) / 2,
        width: B.wallThickness,
        depth: B.front - B.back
    });

    // Front wall — left section (myLinde front)
    const ml = SECTION_LAYOUT.myLinde;
    walls.push({
        x: (B.left + ml.wallBounds.right) / 2,
        z: B.front,
        width: ml.wallBounds.right - B.left,
        depth: B.wallThickness
    });

    // Front wall — right section
    walls.push({
        x: (30 + B.right) / 2,
        z: B.front,
        width: B.right - 30,
        depth: B.wallThickness
    });

    // === INTERNAL DIVIDERS ===

    // myLinde / Full Portfolio divider (x=-35, z: -10 to 20, depth 30)
    walls.push({
        x: ml.wallBounds.right,
        z: 5,
        width: B.wallThickness,
        depth: 30
    });

    // myLinde back wall (z=-10, x: -65 to -35, width 30)
    walls.push({
        x: (B.left + ml.wallBounds.right) / 2,
        z: ml.wallBounds.back,
        width: ml.wallBounds.right - B.left,
        depth: B.wallThickness
    });

    // Energy Solutions / Automation divider (x=-35, z: -50 to -25, depth 25)
    const es = SECTION_LAYOUT.energySolutions;
    walls.push({
        x: es.wallBounds.right,
        z: -37.5,
        width: B.wallThickness,
        depth: 25
    });

    // Automation / Expertise divider (x=20, z: -50 to -25, depth 25)
    const ex = SECTION_LAYOUT.expertise;
    walls.push({
        x: ex.wallBounds.left,
        z: -37.5,
        width: B.wallThickness,
        depth: 25
    });

    return walls;
}

// Spotlight positions derived from section origins — replaces hardcoded SceneManager positions
export function computeSpotlightPositions() {
    const positions = [];

    // One spotlight per section origin
    Object.values(SECTION_LAYOUT).forEach(layout => {
        positions.push({ x: layout.origin.x, z: layout.origin.z });
    });

    // Extra spotlights for the large fullPortfolio section
    const fp = SECTION_LAYOUT.fullPortfolio;
    positions.push({ x: fp.origin.x - 30, z: fp.origin.z });
    positions.push({ x: fp.origin.x + 30, z: fp.origin.z });
    positions.push({ x: fp.origin.x, z: fp.origin.z + 25 });

    return positions;
}
