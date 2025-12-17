// /src/core/importRouter.js

import { importAudio } from "./importAudio.js";
import { importVideo } from "./importVideo.js";
import { importImage } from "./importImage.js";

import { ToasterUI } from "../../services/Toaster.js";

import { R } from "../runtime.js";

export async function handleImportedFiles(files) {
  if (!files || files.length === 0) return;

  for (const file of files) {
    // 1) SHOW LOADING MODAL
    ToasterUI.showLoading(`${file.name} is Loading`);

    const ext = file.name.split(".").pop().toLowerCase();
    const type = getFileType(ext);

    // 2) UNKNOWN FILE TYPE
    if (type === "unknown") {
      ToasterUI.showError(`${file.name} is unknown...wait how?`);
      continue;
    }

    const activeBook = R.ui.selectedBook;
    const mapping = typeToBook(type);

    const correctBook = mapping.book;
    const correctFolder = mapping.folder;

    const isCorrect = activeBook === correctBook;

    try {
      let asset;

      // 3) IMPORT BY TYPE
      if (type === "audio") asset = await importAudio(file);
      else if (type === "video") asset = await importVideo(file);
      else if (type === "image") asset = await importImage(file);

      // 4) STORE IN CORRECT ASSET FOLDER
      if (!R.assets[correctFolder]) R.assets[correctFolder] = [];
      R.assets[correctFolder] = [...R.assets[correctFolder], asset];
      R.assetsVersion++;


      // 5) FEEDBACK MODAL (DIFFERENT IF ROUTED)
      if (isCorrect) {// SUCCESS popup — auto closes
        ToasterUI.showSuccess(`Imported ${file.name}`);
      } else {// ROUTED popup — requires click to close
        ToasterUI.showWarning(`${file.name} was routed to ${correctBook}`);
      }

    } catch (err) {console.error(err);
        ToasterUI.showError(`Error importing ${file.name}`);

    }
  }

  


}


/* ------------------------------------------------------------
   HELPER: DETECT FILE TYPE
------------------------------------------------------------ */

function getFileType(ext) {
  if (["mp3", "wav", "ogg", "aac"].includes(ext)) return "audio";
  if (["mp4", "mov", "webm"].includes(ext)) return "video";
  if (["png", "jpg", "jpeg", "gif"].includes(ext)) return "image";
  return "unknown";
}

/* ------------------------------------------------------------
   HELPER: MAP TYPE → BOOK + ASSET FOLDER
------------------------------------------------------------ */

function typeToBook(type) {
  switch (type) {
    case "audio":
      return { book: "AUDIO", folder: "audio" };

    case "video":
      return { book: "VIDEO", folder: "video" };

    case "image":
      return { book: "VIDEO", folder: "image" };

    default:
      return { book: "FILES", folder: "misc" };
  }
}
