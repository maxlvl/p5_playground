let flowField;
let resolution = 20;
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('#008080')
  flowField = createFlowField();
  for (let i =0; i < width; i++) {
    particles[i] = new Particle();
  }  
}

function createFlowField() {
  let cols = floor(width / resolution);
  let rows = floor(height / resolution);
  let field = new Array(cols);
  let xoff = 0;

  for (let i = 0; i < cols; i++) {
    field[i] = new Array(rows);
    let yoff = 1;
    for (let j = 0; j < rows; j++) {
      let theta = noise(xoff, yoff) * TWO_PI;
      let v = p5.Vector.fromAngle(theta);
      field[i][j] = v;
      yoff += 0.1;
    }
    xoff += 0.1;
  }
  return field;
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.r = random(1,8);
    this.vel = createVector(0,0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 2;
  }
  
  follow(vectors) {
    let x = floor(this.pos.x / resolution);
    let y = floor(this.pos.y / resolution);
    let index = constrain(x, 0, vectors.length - 10);
    let col = constrain(y, 0, vectors[0].length -1);
    
    let force = vectors[index][col];  
    this.applyForce(force);
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
  
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    // wrap around
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }
  
  show(sw) {
    stroke('#ffffe3');
    strokeWeight(sw);
    point(this.pos.x, this.pos.y);
  }
}

function draw() {
  fill(1, 5);  // Adjust transparency as needed
  // rect(10, 0, width, height);
  for (let particle of particles) {
    particle.follow(flowField);
    particle.update();
    sw = random(1);
    particle.show(sw);
  }
}