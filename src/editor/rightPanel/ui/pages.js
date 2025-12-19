import { PalettePage } from "../books/palettePage/index.js";
import { AudioAssetsPage } from "../books/audioAssetsPage/index.js";
import { VideoAssetsPage } from "../books/video/videoAssetsPage/index.js";
// import more later: AudioPatternPage, LogicPage, etc

export const PAGE_TYPES = {
  PALETTE:      PalettePage,
  AUDIO_ASSETS: AudioAssetsPage,
  VIDEO_ASSETS: VideoAssetsPage,
  // AUDIO_PATTERN: AudioPatternPage,
  // LOGIC_TRIGGERS: LogicTriggersPage,
  // …
};

export const BOOKS = [
  { label: "Tiles",    ref: "TILES" },
  { label: "Audio",    ref: "AUDIO" },
  { label: "Video",    ref: "VIDEO" },
  { label: "Logic",    ref: "LOGIC" },
  { label: "Files",    ref: "FILES" },
];


export const PAGES = {

  TILES: [
    { label: "world_tileset", page: "WORLD_TILESET", type: "PALETTE", atlas: "world_tileset" },
    { label: "coin",          page: "COIN",          type: "PALETTE", atlas: "coin" },
    { label: "fruits",        page: "FRUITS",        type: "PALETTE", atlas: "fruits" },
  ],

  AUDIO: [
    { label: "Assets",  page: "AUDIO_ASSETS",  type: "AUDIO_ASSETS" },
    { label: "Pattern", page: "AUDIO_PATTERN", type: "AUDIO_PATTERN" }, 
  ],

  VIDEO: [
    { label: "Assets",    page: "VIDEO_ASSETS",   type: "VIDEO_ASSETS" },
    { label: "Preview",   page: "PIXEL_PREVIEW",  type: "PIXEL_PREVIEW" },
    { label: "Export",    page: "GRID_EXPORT",    type: "GRID_EXPORT" },
  ],

  LOGIC: [
    { label: "Triggers", page: "LOGIC_TRIGGERS", type: "LOGIC_TRIGGERS" },
    { label: "Events",   page: "LOGIC_EVENTS",   type: "LOGIC_EVENTS" },
  ],

  FILES: [
    { label: "Levels", page: "FILE_LEVELS", type: "LEVELS_PAGE" },
    { label: "Save",   page: "FILE_SAVE",   type: "FILE_SAVE_PAGE" },
    { label: "Load",   page: "FILE_LOAD",   type: "FILE_LOAD_PAGE" },
  ],

  
};
