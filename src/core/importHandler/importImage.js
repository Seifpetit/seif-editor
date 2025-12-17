// /src/core/importImage.js
import { R } from "../runtime.js";
//
// Convert <img> into a thumbnail
//
function makeThumbnail(img) {
  const MAX = 256; // keep memory small

  const scale = Math.min(MAX / img.width, MAX / img.height, 1);

  const canvas = document.createElement("canvas");
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL("image/png");
}

//
// Core importer
//
export async function importImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const thumb = makeThumbnail(img);

      const asset = {
        id: crypto.randomUUID(),
        type: "image",
        name: file.name,
        width: img.width,
        height: img.height,
        url,
        file,
        thumbnail: thumb,
        thumbnailImage: null
      };

      const p = R.p5_instance;
      p.loadImage(thumb, img => asset.thumbnailImage = img);

      resolve(asset);
    };

    img.onerror = () => reject("Failed to load image file");

    img.src = url;
  });
}


