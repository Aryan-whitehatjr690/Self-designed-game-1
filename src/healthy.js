class Healthy extends Human {
  constructor(x, y) {
    super(x, y);
    //this.color = color(50);
    this.color = color(0, 230, 0);
    this.hp = 100;

    this.angle = random(360);
    this.r = random(0, 1366 * 0.2);
    this.safe = false;
    this.regen_rate = environment.settings.healthy.regen_rate;
    this.speed = 0.3;

    this.bar = {
      h: 7,
      maxw: this.radius * 2,
      w: 0
    }
  }

  AI() {
    push();
    rectMode(CORNER);
    translate(this.position.x, this.position.y);

    stroke(0, this.bar_alpha);
    fill(200, 0, 0, this.bar_alpha);
    rect(-this.bar.maxw / 2, -this.radius * 1.6, this.bar.maxw, this.bar.h);

    noStroke();
    fill(0, 255, 0, this.bar_alpha);
    rect(-this.bar.maxw / 2, -this.radius * 1.6, this.bar.w, this.bar.h);
    pop();

    this.hp = constrain(this.hp, 0, 100);
    if (this.hp < 100) {
      this.hp += this.regen_rate;
    }

    let d = dist(this.position.x, this.position.y, 0, 0);
    if (d > environment.safe_spot_rad - this.radius * 2) {
      this.safe = false;
    } else {
      this.safe = true;
    }

    if (this.safe == false) {
      this.move(createVector(0, 0), this.speed);
    } else {
      this.move(createVector(0, 0), 0.15);
    }

    this.bar.w = map(this.hp, 0, 100, 0, this.bar.maxw);
    this.velocity.limit(6);
  }

  run(other) {
    if (this.safe) {
      if (other.hp > 1) {
        if (environment.player.special.active == true) {
          this.move(environment.player.special.pos, this.speed);
        } else {
          this.move(other.position, map(dist(this.position.x, this.position.y, other.position.x, other.position.y), 0, environment.safe_spot_rad * 2 - this.radius * 2, -this.speed * 0.9, -this.speed * 0.4));
        }
      }
    }
  }

  infected() {
    return this.hp <= 1;
  }

  takeDamage(projectile) {
    this.hp -= projectile.heal;
    this.bar_timer = 0;
  }

}