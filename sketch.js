let terrain;

function setup() {
  createCanvas(400, 400);
  background(255);
  terrain = new ScalarField(20, 0.2); // scale, frequency
  terrain.generate();
  terrain.render();
  noLoop();
}

class ScalarField {
  constructor(scale, frequency) {
    this.scale = scale;
    this.frequency = frequency;
    this.cols = width / scale;
    this.rows = height / scale;
    this.grid = [];
  }

  generate() {
    for (let x = 0; x < this.cols; x++) {
      this.grid[x] = [];
      for (let y = 0; y < this.rows; y++) {
        let n = noise(x * this.frequency, y * this.frequency);
        this.grid[x][y] = n;
      }
    }
  }

  render() {
    textAlign(CENTER, CENTER);
    textSize(5);
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        let val = this.grid[x][y];
        let xPos = x * this.scale;
        let yPos = y * this.scale;

        stroke(180);
        noFill();
        rect(xPos, yPos, this.scale, this.scale);

        noStroke();
        fill(0);
        text(val.toFixed(2), xPos + this.scale / 2, yPos + this.scale / 2);
      }
    }
  }
}
