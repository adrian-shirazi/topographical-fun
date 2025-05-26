function setup() {
  // Create canvas
  const width = 800;
  const height = 800;
  createCanvas(width, height);
  const scale = 20; // Controls resolution
  const backgroundColor = "#FFFFFF";
  const lineColor = "#000000";
  // Would be kind of dope to have a gradient (ie darker = higher, lighter = base)
  let terrain = [];
  const smoothness = 0.2; // Controls how extreme the terrain is

  const cols = width / scale;
  const rows = height / scale;

  // Create 2d array
  for (let x = 0; x < cols; x++) {
    terrain[x] = [];
    for (let y = 0; y < rows; y++) {
      let noiseVal = noise(x * smoothness, y * smoothness);
      terrain[x][y] = noiseVal;
      let c = map(noiseVal, 0, 1, 30, 240);
      fill(c);
      noStroke();
      square(x * scale, y * scale, scale);
    }
  }
}
