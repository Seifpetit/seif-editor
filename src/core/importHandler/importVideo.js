// /src/core/importVideo.js
import { R } from "../runtime.js";

//
// Core video importer – reliable thumbnail extraction
//
export async function importVideo(file) {
  return new Promise((resolve, reject) => {

    const url = URL.createObjectURL(file);
    const video = document.createElement("video");

    video.preload = "metadata";
    video.src = url;
    video.crossOrigin = "anonymous";

    video.onerror = () => reject("Failed to load video");

    // 1) Wait for video dimensions
    video.onloadedmetadata = () => {

      // IMPORTANT: move to frame 0.1s (0.0 sometimes returns black)
      video.currentTime = 0.1;

      // 2) Decoded frame is ready here
      video.onseeked = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0);

          const thumb = canvas.toDataURL("image/png");

          // Prepare resulting asset
          const asset = {
            id: crypto.randomUUID(),
            type: "video",
            name: file.name,
            duration: video.duration,
            width: video.videoWidth,
            height: video.videoHeight,
            url,
            file,
            thumbnail: thumb,
            thumbnailImage: null
          };

          // 3) Load p5.Image from the Base64 PNG
          const p = R.p5_instance;

          p.loadImage(thumb, img => {
            asset.thumbnailImage = img;
            resolve(asset);   // resolve AFTER the image loads
          });

        } catch (err) {
          reject(err);
        }
      };
    };
  });
}
