import { R } from "../runtime.js";

export function exportLevel() {

  const data = JSON.stringify(R.layout.level, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'level1.json';
  a.click();
  URL.revokeObjectURL(a.href);
  console.log('Level exported:', R.layout.level);

}

export function importLevel() {

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = e => handleFileInput(e.target.files[0]);
  input.click();

}

export function handleFileInput(file) {

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);  // raw JSON
      // optional: validate structure (width, height, layers)
      if (data.width && data.height && data.layers) {
        R.layout.level = data;   // <- this line makes the grid redraw
            console.log(R.layout.level);
        console.log('Level imported successfully:', data.name || '(unnamed)');
      } else {
        console.warn('Invalid level format');
      }
    } catch (err) {
      console.error('Import failed:', err);
    }
  };
  reader.readAsText(file);
  
}
