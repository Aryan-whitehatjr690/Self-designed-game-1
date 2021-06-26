class UI {
  constructor() {
    this.hp_bar = {
      h: height * 0.08,
      maxw: width * 0.21,
      w: 0,
    }

    this.fuel_bar = {
      w: width * 0.05,
      maxh: width * 0.19,
      h: 0
    }

    this.wave = {
      timer: 300,
      max_timer: 300,
      c1: 60,
      c2: 240,
      alpha: 0,
      max_alpha: 255,

      w: 0,
      maxw: width,
    }

    this.clock = {
      angle: 270
    }
  }

  start() {
    this.render();
    this.update();
  }

  render() {

    push();
    // CLOCK
    noStroke();
    fill(0, 150);
    ellipse(width * 0.05, height * 0.1, 100, 100);
    stroke(255);
    strokeWeight(4);
    fill(255, 100);
    arc(width * 0.05, height * 0.1, 100, 100, radians(270), radians(this.clock.angle));
    pop();

    push();
    rectMode(CENTER);
    fill(51);
    noStroke();
    rect(width / 2, height / 2, this.wave.w, height * 0.15);

    // WAVE COUNTER
    fill(255, this.wave.alpha);
    textAlign(CENTER, CENTER);
    textSize(60);
    textFont(font);
    text("Wave " + environment.wave, width / 2, height / 2);

    if (environment.down) {
      fill(51);
      textSize(40);
      text("Downtime", width / 2, height * 0.2);
      text("Press 'e' to open upgrades menu.", width / 2, height * 0.74);
      textSize(28);
      text("Press spacebar to skip downtime.", width / 2, height * 0.8);
    }
    pop();

    // HP BAR
    push();
    rectMode(CORNER);
    noStroke();
    fill(213, 0, 0, 230);
    rect(width * 0.86 - this.hp_bar.maxw / 2, height * 0.06, this.hp_bar.w, this.hp_bar.h);
    image(hp_bar, width * 0.86 - this.hp_bar.maxw / 2, height * 0.06, this.hp_bar.maxw, this.hp_bar.h);

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(18);
    textFont(font);
    text(floor(environment.player.hp), width * 0.88 - this.hp_bar.maxw / 2, height * 0.12);
    pop();

    // FUEL BAR
    push();
    rectMode(CORNER);
    translate(width * 0.07, height * 0.97);
    rotate(radians(180));
    noStroke();
    fill(33, 150, 243, 230);
    rect(0, 0, this.fuel_bar.w, this.fuel_bar.h);
    image(fuel_bar, 0, 0, this.fuel_bar.w, this.fuel_bar.maxh);
    pop();

    // SPECIAL
    push();
    rectMode(CORNER);
    imageMode(CENTER);
    fill(0, 150);
    strokeWeight(4);
    stroke(255);
    rect(width * 0.09, height * 0.88, 70, 70, 4);
    if (environment.player.special.ready) {
      tint(255, 255);
      textAlign(CENTER, CENTER);
      textFont(font);
      textSize(20);
      rectMode(CENTER);
      fill(0);
      noStroke();
      text("'z' to activate", width * 0.09 + 160, height * 0.88 + 35);
    } else {
      tint(255, 100);
    }

    image(special, width * 0.09 + 35, height * 0.88 + 35, 70, 70);

    if (environment.player.special.ready) {
      fill(255, 0);
    } else {
      fill(255, 130);
    }

    noStroke();
    arc(width * 0.09 + 35, height * 0.88 + 35, 60, 60, radians(270), radians(map(environment.player.special.load_timer, 0, environment.player.special.max_load_timer, -90, 270)));

    if (environment.player.special.picking) {
      fill(0, 200);
      textAlign(CENTER, CENTER);
      textSize(30);
      textFont(font);
      text("Press 'x' to cancel", width / 2, height * 0.8);
    }

    pop();


    push();
    imageMode(CENTER);
    image(orb, width * 0.9 - this.hp_bar.maxw / 2, height * 0.18, 48, 48);

    textAlign(CENTER, CENTER);
    fill(255);
    textSize(20);
    textFont(font);
    text(environment.player.orbs, width * 0.9 - this.hp_bar.maxw / 2, height * 0.18);
    pop();

    push();
    imageMode(CENTER);
    tint(0, 150, 0);
    image(healthy, width * 0.98 - this.hp_bar.maxw / 2, height * 0.18, 28.15, 48);

    textAlign(CENTER, CENTER);
    if (environment.pass_wave) {
      fill(255);
    } else {
      fill(255, 0, 0);
    }
    textSize(20);
    textFont(font);
    text(environment.healthy.length + "/" + environment.settings.spawn.min_healthy, width * 0.98 - this.hp_bar.maxw / 2, height * 0.18);
    pop();
  }

  update() {
    this.hp_bar.w = map(environment.player.hp, 0, environment.player.max_hp, 0, this.hp_bar.maxw);
    this.fuel_bar.h = map(environment.player.fuel, 0, environment.player.max_fuel, 0, this.fuel_bar.maxh);

    if (this.wave.timer < this.wave.max_timer) {
      this.wave.timer++;
    }

    if (this.wave.timer < this.wave.c1) {
      this.wave.alpha = lerp(this.wave.alpha, this.wave.max_alpha, 0.1);
      this.wave.w = lerp(this.wave.w, this.wave.maxw, 0.15);
    } else if (this.wave.timer > this.wave.c2 && this.wave.timer < this.wave.max_timer) {
      this.wave.alpha = lerp(this.wave.alpha, 0, 0.1);
      this.wave.w = lerp(this.wave.w, 0, 0.15);
    }

    this.clock.angle = map(environment.wave_timer, 0, environment.max_wave_timer, 270, -90);
  }
}