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
  const frequency = 0.2; // Controls how extreme the terrain is

  create2dScalarField(width, height, frequency);

  /**
   * Randomly creates a 2d array of floating point values between 0 and 1
   * @param width - width of canvas
   * @param height - height of canvas
   * @param frequency - How extreme the terrain is
   */
  function create2dScalarField(width, height, frequency) {
    const cols = width / scale;
    const rows = height / scale;

    for (let x = 0; x < cols; x++) {
      terrain[x] = [];
      for (let y = 0; y < rows; y++) {
        let noiseLevel = noise(x * frequency, y * frequency);
        terrain[x][y] = noiseLevel;
        drawCell(x, y, scale, noiseLevel);
      }
    }
  }

  /**
   * Draws a cell with the noiseLevel in it (used for visualizing)
   * @param x - x coord
   * @param y - y coord
   * @param scale - Controls resultion
   * @param noiseLevel - Perlin noise value
   */
  function drawCell(x, y, scale, noiseLevel) {
    rect(x * scale * 2, y * scale * 2, scale * 2, scale * 2);
    text(noiseLevel.toFixed(2), x * scale * 2, y * scale * 2);
  }
}
