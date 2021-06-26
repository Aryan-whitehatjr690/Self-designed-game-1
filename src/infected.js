class Infected extends Human {
  constructor(x, y, weapon) {
    super(x, y);

    this.hp = environment.settings.infected.hp;
    this.max_hp = this.hp;
    this.infect_rate = environment.settings.infected.infect_rate;
    this.speed = environment.settings.infected.speed;
    this.infect_radius = this.radius * 2.5;
    this.range = 300;

    this.healthy_in_range = false;
    this.target = null;

    this.behaviour = random(100);

    this.bar = {
      h: 7,
      maxw: this.radius * 2,
      w: 0
    }

    this.transformation = 0;
    this.transformation_rate = environment.settings.infected.transformation_rate;

    if (weapon) {
      this.desired_angle = 0;
      this.angle = 0;

      this.projectiles = []

      this.weapon = weapon;
      this.gun_pos = this.weapon.width;
      this.shot_timer = 0;

      this.x_distance = 0;
      this.y_distance = 0;
    }
  }

  AI() {
    if (this.hp > 0) {
      if (environment.healthy.length < 1) {
        this.healthy_in_range = false;
      } else {
        this.healthy_in_range = environment.healthy.some((h) => dist(h.position.x, h.position.y, this.position.x, this.position.y) < this.range);
      }

      if (this.behaviour < 60) {
        if (this.healthy_in_range) {
          for (let i = 0; i < environment.healthy.length; i++) {
            if (dist(this.position.x, this.position.y, environment.healthy[i].position.x, environment.healthy[i].position.y) < this.range) {
              if (this.target == null || this.target == environment.player) {
                this.target = environment.healthy[i];
              }
            }
          }
        } else {
          this.target = environment.player;
        }
      } else {
        this.target = environment.player;
      }


      if (this.target) {
        if (this.target.hp > 1) {
          if (this.weapon) {
            if (this.targetInRange() == false) {
              this.move(this.target.position, this.speed);
            }
          } else {
            this.move(this.target.position, this.speed);
          }
        } else {
          this.target = null;
        }

      }
    }

    if (this.weapon) {
      this._weapon(this.weapon);
    }

    push();
    rectMode(CORNER);
    translate(this.position.x, this.position.y);

    stroke(0, this.bar_alpha);
    fill(200, 0, 0, this.bar_alpha);
    rect(-this.bar.maxw / 2, -this.radius * 1.6, this.bar.maxw, this.bar.h);

    if (this.hp <= 0) {
      fill(0, 150, 150, this.bar_alpha);
    } else {
      fill(0, 255, 0, this.bar_alpha);
    }
    noStroke();
    rect(-this.bar.maxw / 2, -this.radius * 1.6, this.bar.w, this.bar.h);
    pop();

    this.hp = constrain(this.hp, 0, this.max_hp);

    if (this.hp <= 0) {
      this.bar.w = map(this.transformation, 0, 100, 0, this.bar.maxw);
      this.transformation += this.transformation_rate;
      this.color = color(map(this.transformation, 0, 100, 230, 0), map(this.transformation, 0, 100, 0, 230), map(this.transformation, 0, 100, 0, 0));
    } else {
      this.bar.w = map(this.hp, 0, this.max_hp, 0, this.bar.maxw);
    }
  }

  _weapon(properties) {
    if (this.hp > 1) {
      this.angle = lerp(this.angle, this.desired_angle, 0.1);
    }

    if (frameCount % properties.freq == 0 && this.targetInRange() && this.hp > 1) {
      for (let i = 0; i < properties.ppershot; i++) {
        this.gun_pos = properties.width - properties.reload * properties.freq;
        let r = this.gun_pos + properties.width / 2;
        let x = r * cos(this.desired_angle);
        let y = r * sin(this.desired_angle);

        let projectile = new Projectile(this.weapon, createVector(x + this.position.x, y + this.position.y), this.angle + radians(random(-properties.offset, properties.offset)) + radians(random(-10, 10)), this.color)
        this.projectiles.push(projectile);

        if (this.weapon == environment.weapons.rifle) {
          environment.shake(1.5);
          Instantiate("rifle", x + this.position.x, y + this.position.y);
        } else if (this.weapon == environment.weapons.shotgun) {
          environment.shake(3);
          Instantiate("shotgun", x + this.position.x, y + this.position.y);
        } else if (this.weapon == environment.weapons.gun) {
          environment.shake(2);
          Instantiate("gun", x + this.position.x, y + this.position.y);
        }

      }
      this.shot_timer = this.weapon.freq;
      sound.shoot.play();
    }

    if (this.gun_pos < properties.width) {
      this.gun_pos += properties.reload;
    }

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      this.projectiles[i].start();
      if (this.projectiles[i].dead()) {
        this.projectiles.splice(i, 1);
      }

      if (this.projectiles[i] && this.projectiles[i].collides(environment.player)) {
        environment.player.takeDamage(this.projectiles[i]);
        environment.hit_timer = 0;
        Instantiate("hit", this.projectiles[i].position.x, this.projectiles[i].position.y);
        environment.shake(1);
        sound.hit.play();
        this.projectiles.splice(i, 1);
      }

      for (let j = 0; j < environment.healthy.length; j++) {
        if (this.projectiles[i]) {
          if (environment.healthy[j].hp > 0 && this.projectiles[i].collides(environment.healthy[j])) {
            environment.healthy[j].takeDamage(this.projectiles[i]);
            Instantiate("hit", this.projectiles[i].position.x, this.projectiles[i].position.y);
            environment.shake(1);
            sound.hit.play();
            this.projectiles.splice(i, 1);
          }
        }

      }
    }

    if (this.shot_timer > 0) {
      this.shot_timer--;
    }


    if (this.targetInRange()) {
      let distance = dist(this.position.x, this.position.y, this.target.position.x + this.x_distance, this.target.position.y + this.y_distance);

      let projectile_travel_time = distance / this.weapon.speed;

      this.x_distance = (this.shot_timer + projectile_travel_time) * this.target.velocity.x;
      this.y_distance = (this.shot_timer + projectile_travel_time) * this.target.velocity.y;

      this.desired_angle = atan2(this.target.position.y + this.y_distance - this.position.y, this.target.position.x + this.x_distance - this.position.x);
    } else {
      this.desired_angle = this.velocity.heading();
    }

    push();
    rectMode(CENTER);
    translate(this.position.x, this.position.y);
    rotate(this.angle);

    noStroke();
    fill(40);
    rect(this.gun_pos, 0, properties.width, properties.height);
    pop();
  }

  cured() {
    return this.transformation >= 100;
  }

  infect(healthy) {
    if (this.hp > 0) {
      let d = dist(this.position.x, this.position.y, healthy.position.x, healthy.position.y);
      if (d < this.infect_radius) {
        healthy.hp -= this.infect_rate;
        healthy.bar_timer = 0;
        this.bar_timer = 0;

        if (frameCount % 60 == 0 && healthy == environment.player) {
          environment.hit_timer = 0;
        }
      }
    }
  }

  targetInRange() {
    if (this.target) {
      let d = dist(this.target.position.x, this.target.position.y, this.position.x, this.position.y);
      return d < this.range;
    } else {
      return false;
    }
  }

  takeDamage(projectile) {
    this.hp -= projectile.heal;
    this.bar_timer = 0;
  }
}