class Player {
  constructor(x, y, weapon) {
    this.position = createVector(x, y);
    this.velocity = createVector();
    this.acceleration = createVector();
    this.radius = 18;
    this.speed = 0.47;

    this.angle = 0;
    this.projectiles = [];

    this.regen_rate = 0.07;

    this.weapon = weapon;
    this.gun_pos = this.weapon.width;

    this.color = color(0, 150, 0);
    this.hp = 100;
    this.max_hp = 150;
    this.attract_rad = 100;

    this.orbs = 0;

    this.fuel = 50;
    this.max_fuel = 100;
    this.fuel_recharge = 0.12;

    this.controls = ["w", "a", "s", "d"];
    this.movement = [false, false, false, false];

    this.special = {
      active: false,
      load_timer: 0,
      max_load_timer: 4600,
      load_timer_recharge: 100,
      ready: false,
      c: 40,
      alpha: 0,
      max_alpha: 150,
      heal: 1,
      available: false,
      pos: createVector(),
      picking: false,
      effect_timer: 300,
      max_effect_timer: 300,
      effect_radius: 120,
    }
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

    this._weapon(this.weapon);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);

    this.velocity.mult(0.9);

    if (this.movement[2]) {
      this.applyForce(0, this.speed);
    }

    if (this.movement[0]) {
      this.applyForce(0, -this.speed);
    }

    if (this.movement[1]) {
      this.applyForce(-this.speed, 0);
    }

    if (this.movement[3]) {
      this.applyForce(this.speed, 0);
    }

    this.position.x = constrain(this.position.x, -1366 * 0.75 + this.radius * 2, 1366 * 0.75 - this.radius * 2);
    this.position.y = constrain(this.position.y, -1366 * 0.75 + this.radius * 2, 1366 * 0.75 - this.radius * 2);

    this.angle = atan2(mouseY - height / 2, mouseX - width / 2);

    this.hp = constrain(this.hp, 0, this.max_hp);
    if (this.hp < this.max_hp) {
      this.hp += this.regen_rate;
    }

    this.fuel = constrain(this.fuel, 0, this.max_fuel);
    if (this.fuel < this.max_fuel) {
      this.fuel += this.fuel_recharge;
    }

    if (this.hp <= this.regen_rate) {
      environment.game_over = true;
      environment.end.title = "You are infected."
    }

    this.curing();
  }

  _weapon(properties) {
    if (mouseIsPressed) {
      if (this.special.picking == false && this.fuel >= properties.fuel_consumption && environment.menu.active == false) {
        if (frameCount % properties.freq == 0) {
          for (let i = 0; i < properties.ppershot; i++) {
            this.gun_pos = properties.width - properties.reload * properties.freq;
            let r = this.gun_pos + properties.width / 2;
            let x = r * cos(this.angle);
            let y = r * sin(this.angle);

            environment.shake(1.5);
            Instantiate("rifle", x + this.position.x, y + this.position.y);
            this.fuel -= this.weapon.fuel_consumption;

            let projectile = new Projectile(properties, createVector(x + this.position.x, y + this.position.y), this.angle + radians(random(-properties.offset, properties.offset)), color(0, 0, 50))
            this.projectiles.push(projectile);
          }

          let recoil_force = p5.Vector.fromAngle(this.angle).mult(-1 * this.weapon.force);
          this.applyForce(recoil_force.x, recoil_force.y);
          sound.shoot.play();

        }
      }
    }

    if (this.gun_pos < properties.width) {
      this.gun_pos += properties.reload;
    }

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      this.projectiles[i].start();
      if (this.projectiles[i].dead()) {
        this.projectiles.splice(i, 1);
      }

      for (let j = 0; j < environment.infected.length; j++) {
        if (this.projectiles[i]) {
          if (environment.infected[j].hp > 0 && this.projectiles[i].collides(environment.infected[j])) {
            environment.infected[j].takeDamage(this.projectiles[i]);
            Instantiate("hit", this.projectiles[i].position.x, this.projectiles[i].position.y);
            environment.shake(1);
            sound.hit.play();
            this.projectiles.splice(i, 1);
          }
        }

      }
    }

    push();
    rectMode(CENTER);
    translate(this.position.x, this.position.y);
    rotate(this.angle);

    noStroke();
    fill(51);
    rect(this.gun_pos, 0, properties.width, properties.height);
    pop();
  }

  reset() {
    this.hp = this.max_hp;
    this.fuel = this.max_fuel;
    this.special.load_timer = this.special.max_load_timer;
  }


  curing() {
    if (this.special.picking) {
      push();
      if (this.special.available) {
        noFill();
        stroke(0, 255, 70);
        strokeWeight(6);
        point(environment.mouse.x, environment.mouse.y);
        strokeWeight(2);
        ellipse(environment.mouse.x, environment.mouse.y, this.special.effect_radius * 2);
      }

      noFill();
      stroke(255);
      strokeWeight(1);
      ellipse(this.position.x, this.position.y, 800);
      pop();
    }

    if (this.special.load_timer < this.special.max_load_timer) {
      this.special.load_timer++;
      this.special.ready = false;
    } else {
      this.special.ready = true;
    }

    if (this.special.effect_timer < this.special.max_effect_timer) {
      this.special.effect_timer++;
      this.special.active = true;
    } else {
      this.special.active = false;
    }

    if (this.special.picking && dist(environment.mouse.x, environment.mouse.y, this.position.x, this.position.y) < 400) {
      this.special.available = true;
    } else {
      this.special.available = false;
    }

    if (this.special.active) {
      push();
      fill(0, 255, 70, this.special.alpha);
      noStroke();
      ellipse(this.special.pos.x, this.special.pos.y, this.special.effect_radius * 2);
      pop();

      if (this.special.effect_timer < this.special.c) {
        this.special.alpha = map(this.special.effect_timer, 0, this.special.c, 0, this.special.max_alpha);
      } else if (this.special.effect_timer > this.special.max_effect_timer - this.special.c) {
        this.special.alpha = map(this.special.effect_timer, this.special.max_effect_timer - this.special.c, this.special.max_effect_timer, this.special.max_alpha, 0);
      }
    }
  }

  startEffect() {
    this.special.pos = createVector(environment.mouse.x, environment.mouse.y);
    this.special.effect_timer = 0;
    this.special.load_timer = 0;
    this.special.picking = false;

    sound.special.play();

    Instantiate("spec_curing", this.special.pos.x, this.special.pos.y);
  }

  in_curing_chamber(infected) {
    if (this.special.active) {
      let distance = dist(this.special.pos.x, this.special.pos.y, infected.position.x, infected.position.y);
      return distance < this.special.effect_radius;
    }
  }

  applyForce(x, y) {
    this.acceleration.add(createVector(x, y));
  }

  takeDamage(projectile) {
    this.hp -= projectile.heal;
  }
}