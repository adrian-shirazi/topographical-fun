let scale = 20;
let terrain = [];
let cols, rows;
let isovalue = 0.5;

function setup() {
  createCanvas(800, 800);
  background(255);
  textAlign(CENTER, CENTER);
  textSize(10);
  noStroke();

  cols = width / scale;
  rows = height / scale;
  const frequency = 0.2;
  create2dScalarField(frequency);
  drawContours(0.5);
  noLoop();
}

function create2dScalarField(frequency) {
  for (let x = 0; x < cols; x++) {
    terrain[x] = [];
    for (let y = 0; y < rows; y++) {
      let noiseVal = noise(x * frequency, y * frequency);
      terrain[x][y] = noiseVal;
      // drawCell(x, y, noiseVal);
    }
  }
}

function drawCell(x, y, noiseVal) {
  let xPos = x * scale;
  let yPos = y * scale;

  stroke(200);
  noFill();
  rect(xPos, yPos, scale, scale);

  noStroke();
  fill(0);

  // Display 1 or 0 based on isovalue threshold
  let label = noiseVal >= isovalue ? 1 : 0;
  text(label, xPos + scale / 2, yPos + scale / 2);
}

/**
 * A ---- B
 * |      |
 * D ---- C
 */
const caseTable = {
  1: [["CD", "DA"]],
  2: [["BC", "CD"]],
  3: [["BC", "DA"]],
  4: [["AB", "BC"]],
  5: [
    ["AB", "DA"],
    ["BC", "CD"],
  ],
  6: [["AB", "CD"]],
  7: [["AB", "DA"]],
  8: [["AB", "DA"]],
  9: [["AB", "CD"]],
  10: [
    ["AB", "BC"],
    ["CD", "DA"],
  ],
  11: [["AB", "BC"]],
  12: [["BC", "DA"]],
  13: [["BC", "CD"]],
  14: [["CD", "DA"]],
};

function getMidpoints(x, y) {
  let A = createVector(x * scale, y * scale);
  let B = createVector((x + 1) * scale, y * scale);
  let C = createVector((x + 1) * scale, (y + 1) * scale);
  let D = createVector(x * scale, (y + 1) * scale);

  return {
    A,
    B,
    C,
    D,
    AB: p5.Vector.lerp(A, B, 0.5),
    BC: p5.Vector.lerp(B, C, 0.5),
    CD: p5.Vector.lerp(C, D, 0.5),
    DA: p5.Vector.lerp(D, A, 0.5),
  };
}

function drawContours(isovalue) {
  stroke(0);
  strokeWeight(2);

  for (let x = 0; x < cols - 1; x++) {
    for (let y = 0; y < rows - 1; y++) {
      let a = terrain[x][y] >= isovalue ? 1 : 0;
      let b = terrain[x + 1][y] >= isovalue ? 1 : 0;
      let c = terrain[x + 1][y + 1] >= isovalue ? 1 : 0;
      let d = terrain[x][y + 1] >= isovalue ? 1 : 0;

      let cellIndex = (a << 3) | (b << 2) | (c << 1) | d;

      let m = getMidpoints(x, y);

      let caseLines = caseTable[cellIndex];
      if (!caseLines) continue;

      for (let caseLine of caseLines) {
        let [start, end] = caseLine;
        let p1 = edgeToPoint(start, m);
        let p2 = edgeToPoint(end, m);
        line(p1.x, p1.y, p2.x, p2.y);
      }
    }
  }
}

function edgeToPoint(label, m) {
  switch (label) {
    case "A":
      return m.A;
    case "B":
      return m.B;
    case "C":
      return m.C;
    case "D":
      return m.D;
    case "AB":
      return m.AB;
    case "BC":
      return m.BC;
    case "CD":
      return m.CD;
    case "DA":
      return m.DA;
    default:
      return createVector(0, 0);
  }
}
