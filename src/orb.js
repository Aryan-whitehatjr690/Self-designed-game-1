class Orb {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-3, 3), random(-3, 3));
    this.acceleration = createVector();
    this.speed = 0.5;
    this.radius = 5;
    this.alpha = 255;
    this.timer = 0;
    this.max_timer = 200;
    this.loss_rate = 1;
  }

  start() {
    this.render();
    this.update();
  }

  render() {
    push();
    imageMode(CENTER);
    image(orb, this.position.x, this.position.y, this.radius * 2, this.radius * 2);
    pop();
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    
    if(this.timer < this.max_timer) {
      this.timer++; 
    } else {
      this.alpha -= this.loss_rate; 
    }

    let d = dist(this.position.x, this.position.y, environment.player.position.x, environment.player.position.y);
    if (d < environment.player.attract_rad) {
      this.move(environment.player.position, map(d, 0, environment.player.attract_rad, this.speed, this.speed * 0.1));
    }

    this.velocity.mult(0.9);

  }

  collides(p) {
    let d = dist(this.position.x, this.position.y, p.position.x, p.position.y);
    return d < p.radius;
  }
  
  dead() {
    return this.alpha <= 0; 
  }

  applyForce(x, y) {
    this.acceleration.add(createVector(x, y));
  }

  move(destination, force) {
    let dest = createVector(destination.x, destination.y);
    dest.sub(this.position);
    dest.setMag(force);
    this.applyForce(dest.x, dest.y);
  }
}