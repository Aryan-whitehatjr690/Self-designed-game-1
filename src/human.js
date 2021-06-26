class Human {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector();
    this.acceleration = createVector();
    this.radius = 18;
    //this.color = color(0, 255, 70);
    this.color = color(230, 0, 0);
    
    this.bar_alpha = 255;
    this.bar_timer = 60;
    this.max_bar_timer = 60;
    this.alpha_decrement = 4;
  }

  start() {
    this.render();
    this.update();
  }

  render() {
    push();
    noStroke();
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.radius * 2);
    pop();
    
    if(this.bar_timer < this.max_bar_timer) {
      this.bar_timer++;
      this.bar_alpha = 255;
    } else {
      this.bar_alpha -= this.alpha_decrement; 
    }
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    
    this.velocity.mult(0.9);
  }

  applyForce(x, y) {
    this.acceleration.add(createVector(x, y));
  }
  
  repel(other, arg) {
    if(other != this) {
       let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
      if(arg) {
        if(d < other.radius + this.radius + environment.safe_distance) {
          this.move(other.position, -this.speed*1.5);
        }
      } else {
        if(d < other.radius + this.radius) {
          this.move(other.position, -this.speed*1.5);
        }
      }
      
    }
  }
  
  move(destination, force) {
    let dest = createVector(destination.x, destination.y);
    dest.sub(this.position);
    dest.setMag(force);
    this.applyForce(dest.x, dest.y);
  }
}