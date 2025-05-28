let scale = 4;
let terrain = [];
let cols, rows;
let isovalue = 0.5;
let seed = null;

function setup() {
  let lowColor = color(20, 60, 20);
  let highColor = color(150, 255, 150);
  if (seed != null) {
    noiseSeed(seed);
  }
  createCanvas(800, 800);
  background(255);
  textAlign(CENTER, CENTER);
  textSize(10);
  noStroke();

  cols = width / scale;
  rows = height / scale;
  const frequency = 0.01;
  create2dScalarField(frequency);
  for (let iso = 0.0; iso < 1; iso += 0.05) {
    let color = lerpColor(lowColor, highColor, iso);
    drawContours(iso, color);
  }
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

function getInterpolatedEdges(x, y, a, b, c, d, isovalue) {
  let A = createVector(x * scale, y * scale);
  let B = createVector((x + 1) * scale, y * scale);
  let C = createVector((x + 1) * scale, (y + 1) * scale);
  let D = createVector(x * scale, (y + 1) * scale);

  return {
    AB: interpolate(A, B, a, b, isovalue),
    BC: interpolate(B, C, b, c, isovalue),
    CD: interpolate(C, D, c, d, isovalue),
    DA: interpolate(D, A, d, a, isovalue),
  };
}

function interpolate(p1, p2, v1, v2, iso) {
  let t = (iso - v1) / (v2 - v1);
  t = constrain(t, 0, 1); // In case v1 == v2
  return p5.Vector.lerp(p1, p2, t);
}

function drawContours(isovalue, color) {
  stroke(color);
  strokeWeight(4);

  for (let x = 0; x < cols - 1; x++) {
    for (let y = 0; y < rows - 1; y++) {
      let aVal = terrain[x][y];
      let bVal = terrain[x + 1][y];
      let cVal = terrain[x + 1][y + 1];
      let dVal = terrain[x][y + 1];

      let a = aVal >= isovalue ? 1 : 0;
      let b = bVal >= isovalue ? 1 : 0;
      let c = cVal >= isovalue ? 1 : 0;
      let d = dVal >= isovalue ? 1 : 0;

      let cellIndex = (a << 3) | (b << 2) | (c << 1) | d;

      let m = getInterpolatedEdges(x, y, aVal, bVal, cVal, dVal, isovalue);

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
