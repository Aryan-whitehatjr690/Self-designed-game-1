class Projectile {
  constructor(weapon, position, angle, col) {
    this.position = createVector(position.x, position.y);
    this.velocity = p5.Vector.fromAngle(angle).mult(weapon.speed);
    this.color = col;
    this.radius = weapon.radius;
    this.heal = weapon.heal;
  }
  
  start() {
    this.render();
    this.update();
  }
  
  render() {
    push();
    noStroke();
    fill(this.color);
    circle(this.position.x, this.position.y, this.radius * 2);
    pop();
  }
  
  update() {
    this.position.add(this.velocity);
  }
  
  dead() {
     if(this.position.x >= 1366 * 0.75 || this.position.x <= -1366 * 0.75 || this.position.y >= 1366 * 0.75 || this.position.y <= -1366 * 0.75) {
        return true; 
     } else {
        return false; 
     }
  }
  
  collides(target) {
    let d = dist(this.position.x, this.position.y, target.position.x, target.position.y);
    if(d < target.radius + this.radius) {
       return true; 
    } else {
       return false; 
    }
  }
}