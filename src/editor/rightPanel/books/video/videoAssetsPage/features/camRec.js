import { R } from "../../../../../../core/runtime.js";

export class CamRecTask {
  constructor(videoPage) {
    this.page = videoPage;        // link back to VideoPage if needed
    this.showVideo = false;
    this.video = null;

    this.recorder = null;
    this.recordedChunks = [];
    this.isRecording = false;

    this.initCamera();
  }

  initCamera() {
    const p = R.p5_instance;
    this.video = p.createCapture(p.VIDEO, () => {
      this.showVideo = true;
    });
    this.video.hide();
  }

  startRecording() {
    if (!this.video || this.isRecording) return;

    const stream = this.video.elt.srcObject;
    this.recordedChunks = [];

    this.recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

    this.recorder.ondataavailable = e => {
      if (e.data.size > 0) this.recordedChunks.push(e.data);
    };

    this.recorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: "video/webm" });
      this.download(blob);
    };

    this.recorder.start();
    this.isRecording = true;
  }

  stopRecording() {
    if (!this.recorder || !this.isRecording) return;
    this.recorder.stop();
    this.isRecording = false;
  }

  download(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recording.webm";
    a.click();
  }

  draw(g, x, y, w, h) {
    g.push();
    g.fill(230);

    // Title
    g.textSize(16);
    g.textAlign(g.LEFT, g.TOP);
    g.text("Camera Recorder", x, y);

    // --- UI Buttons ---
    const btnY = y + 30;
    this.drawButton(g, x + 20, btnY, 100, 30, "Start", !this.isRecording);
    this.drawButton(g, x + 140, btnY, 100, 30, "Stop", this.isRecording);

    // --- Video Preview ---
    if (this.showVideo) {
      g.image(this.video, x, y + 80, w, h - 80);
    }

    g.pop();
  }

  drawButton(g, bx, by, bw, bh, label, enabled) {
    g.fill(enabled ? 180 : 120);
    g.rect(bx, by, bw, bh, 6);
    g.fill(0);
    g.text(label, bx + 10, by + 8);
  }

  onClick(mx, my) {console.log("mx: ", mx,"|my: ", my );
    // Start button 
    if (mx > 20 && mx < 120 && my > 30 && my < 60) {
      this.startRecording(); 
    }

    // Stop button
    if (mx > 140 && mx < 240 && my > 30 && my < 60) {
      this.stopRecording(); console.log("stoped");
    }
  }

  onClose() {
    if (this.isRecording) this.stopRecording();
    if (this.video) this.video.remove();
  }


}