const SPRITE_SHEET_URL = "./assets/tilemap_packed.png";
const tmpSpriteSheet = new Image();
tmpSpriteSheet.src = SPRITE_SHEET_URL;
export const SPRITE_MAP = {
    enemy: { x: 0, y: 9 * 16 + 1, width: 15, height: 16 },
    player: { x: 0, y: 8 * 16 + 1, width: 16, height: 16 },
    bullet: { x: 8 * 16, y: 8 * 16, width: 16, height: 16 },
    map0: { x: 0, y: 4 * 16 + 1, width: 16, height: 14 },
    map2: { x: 1 * 16, y: 4 * 16 + 1, width: 16, height: 14 },
    map1: { x: 2 * 16, y: 4 * 16 + 1, width: 16, height: 14 },
};
export const spriteSheet = tmpSpriteSheet;

const UI_SHEET_URL = "./assets/UISheet.png";
const tmpUISpriteSheet = new Image();
tmpUISpriteSheet.src = UI_SHEET_URL;
export const UI_SPRITE_MAP = {
    "button1-1-1": { x: (0 + 6 * 3) * 18, y: 0 * 18, width: 16, height: 16 },
    "button1-1-2": { x: (1 + 6 * 3) * 18, y: 0 * 18, width: 16, height: 16 },
    "button1-1-3": { x: (2 + 6 * 3) * 18, y: 0 * 18, width: 16, height: 16 },
    "button1-2-1": { x: (3 + 6 * 3) * 18, y: 0 * 18, width: 16, height: 16 },
    "button1-2-2": { x: (4 + 6 * 3) * 18, y: 0 * 18, width: 16, height: 16 },
    "button1-2-3": { x: (5 + 6 * 3) * 18, y: 0 * 18, width: 16, height: 16 },

    // "button1-3-1": { x: (0 + 6) * 18, y: 2 * 18, width: 16, height: 16 },
    // "button1-3-2": { x: (1 + 6) * 18, y: 2 * 18, width: 16, height: 16 },
    // "button1-3-3": { x: (2 + 6) * 18, y: 2 * 18, width: 16, height: 16 },
    // "button1-4-1": { x: (0 + 6) * 18, y: 3 * 18, width: 16, height: 16 },
    // "button1-4-2": { x: (1 + 6) * 18, y: 3 * 18, width: 16, height: 16 },
    // "button1-4-3": { x: (2 + 6) * 18, y: 3 * 18, width: 16, height: 16 },
};
export const uiSpriteSheet = tmpUISpriteSheet;

const BG_URL = "./assets/backgroundColorFall.png";
const tmpBg = new Image();
tmpBg.src = BG_URL;
export const bg = tmpBg;
