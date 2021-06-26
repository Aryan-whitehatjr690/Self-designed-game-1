class Menu {
  constructor() {
    this.color = color(150);
    this.ratio = createVector(1 / (1366 / width), 1 / (768 / height));
    
    this.width = 0;
    this.max_width = width * 0.9;

    this.height = 0;
    this.max_height = height * 0.9;

    this.active = false;
    this.segments = [];

    this.popups = [];

    this.source = null;
    
    // WEAPON

    // Accuracy 0
    this.segments.push(new Segment(width * 0.12, height * 0.16, 4, "Increases accuracy while shooting. Upgrade to have better precision", upgrades.accuracy, "+ Accuracy", 10, 60));

    // Reload Speed 1
    this.segments.push(new Segment(width * 0.12, height * 0.16 + 150 * ratio.y, 5, "Increases projectiles shot per second. Upgrade to make your disincfect gun go 'ratatatata'", upgrades.reload, "+ Shooting Frequency", 15, 80));

    // Healing Power 2 
    this.segments.push(new Segment(width * 0.12, height * 0.16 + 300 * ratio.y, 5, "Increases healing power. Upgrade to heal people faster. Even covid - 20 can not stand on your way!", upgrades.heal, "+ Heal Power", 20, 100));

    // Fuel Efficiency 3
    this.segments.push(new Segment(width * 0.12, height * 0.16 + 450 * ratio.y, 5, "Decreases fuel usage per shot, which means you can keep shooting for longer periods. Upgrade if you are tired of constantly checking your disinfect bar.", upgrades.efficiency, "- Disinfect Consumption per Projectile", 15, 80));

    // Projectile Speed 4
    this.segments.push(new Segment(width * 0.12, height * 0.16 + 600 * ratio.y, 4, "Increases projectile speed. Upgrade to make your disinfect gun shoot out projectiles faster. Less travel time = more precision", upgrades.speed, "+ Projectile Speed", 10, 60));


    // PROTECTION
    // Mask 5
    this.segments.push(new Segment(width * 0.12, height * 0.16 + 850 * ratio.y, 5, "Increases immunity against the virus. This upgrade also applies to people you have cured. Upgrade if you do not want that filthy little virus in your life.", masks.paper, "+ Immunity Against The Virus", 20, 80));

    // SPECIAL
    // Curing Chamber 6
    this.segments.push(new Segment(width * 0.12, height * 0.16 + 1150 * ratio.y, 5, "Upgrades curing special power. Upgrade to have your special power stay on the ground for longer and with a bigger radius.", upgrades.special, "+ Active Time  + Effect Radius  + Heal Power", 15, 80));
  }

  start() {
    this.render();
    this.update();
  }
  
  render() {
    push();
    rectMode(CENTER);
    noStroke();
    fill(0, 100);
    rect(width / 2, height / 2, this.width, this.height);
    fill(this.color);
    rect(width / 2, height / 2, this.width, this.height);
    pop();

    if (this.width >= this.max_width - 50) {
      for (let i = 0; i < this.segments.length; i++) {
        this.segments[i].start();
        if (this.segments[i].hovered() && this.source == null) {
          this.source = this.segments[i];
        }
      }

      push();
      textAlign(LEFT, CENTER);
      textSize(35 * this.ratio.x);
      textFont(font);

      let y1 = height / 2 - environment.menu.height / 2 + width * 0.04 * this.ratio.x;
      let y2 = height / 2 + environment.menu.height / 2 - width * 0.04 * this.ratio.x;

      if (!(this.segments[0].y - 100 + this.segments[0].h / 2 <= y1 + width * 0.04 || this.segments[0].y - 100 - this.segments[0].h / 2 >= y2 - width * 0.04)) {
        text("Disinfect Gun", this.segments[0].x - this.segments[0].w / 2, this.segments[0].y - 100 * ratio.y);
      }

      if (!(this.segments[5].y - 100 + this.segments[5].h / 2 <= y1 + width * 0.04 || this.segments[5].y - 100 - this.segments[0].h / 2 >= y2 - width * 0.04)) {
        text("Protection", this.segments[0].x - this.segments[5].w / 2, this.segments[5].y - 100 * ratio.y);
      }

      if (!(this.segments[6].y - 100 + this.segments[0].h / 2 <= y1 + width * 0.04 || this.segments[6].y - 100 - this.segments[0].h / 2 >= y2 - width * 0.04)) {
        text("Special Power", this.segments[0].x - this.segments[5].w / 2, this.segments[6].y - 100 * ratio.y);
      }
      pop();

      push();
      rectMode(CORNER);
      noStroke();
      fill(200);
      rect(width / 2 - this.width / 2, height / 2 - this.height / 2, this.width, width * 0.08);
      rect(width / 2 - this.width / 2, height / 2 + this.height / 2 - width * 0.08, this.width, width * 0.08);

      if (this.source) {
        textFont(font);
        textSize(25 * this.ratio.x);
        fill(0, 200, 0);
        text(this.source.gain, width / 2 - this.width / 2 + width * 0.02, height / 2 + this.height / 2 - width * 0.04);
      }
      pop();

      // ORB COUNT
      push();
      imageMode(CENTER);
      image(orb, width * 0.92 * this.ratio.x, height * 0.11 * this.ratio.y, 48 * this.ratio.x, 48 * this.ratio.x);
      textAlign(CENTER, CENTER);
      fill(255);
      textSize(20);
      textFont(font);
      text(environment.player.orbs, width * 0.92 * this.ratio.x, height * 0.11 * this.ratio.y);

      textAlign(LEFT, CENTER);
      textSize(40 * ratio.x);
      fill(0);
      text("Upgrades", width / 2 - this.width / 2 + 30, height / 2 - this.height / 2 + width * 0.04);
      pop();
    }

    if (this.segments[5].levels == 0) {
      this.segments[5].img = masks.black;
    } else if (this.segments[5].levels == 1) {
      this.segments[5].img = masks.paper;
    } else if (this.segments[5].levels == 2) {
      this.segments[5].img = masks.build
    } else if (this.segments[5].levels == 3) {
      this.segments[5].img = masks.shield
    } else if (this.segments[5].levels == 4) {
      this.segments[5].img = masks.gas
    }
  }

  update() {
    if (this.active) {
      this.width = lerp(this.width, this.max_width, 0.06);
      this.height = lerp(this.height, this.max_height, 0.05);
    } else {
      this.width = lerp(this.width, 0, 0.06);
      this.height = lerp(this.height, 0, 0.05);
    }

    if (this.source) {
      if (this.source.hovered() == false) {
        this.source = null;
      }
    }

    for (let i = this.popups.length - 1; i >= 0; i--) {
      this.popups[i].start();
      if (this.popups[i].dead()) {
        this.popups.splice(i, 1);
      }
    }
    
    if(environment.down == false) {
      this.active = false; 
    }
  }
}

function Segment(x, y, max_levels, txt, img, gain, nprice, xprice) {
  this.x = x * ratio.x;
  this.y = y * ratio.y;
  this.desired = y;
  this.w = width * 0.07;
  this.h = width * 0.07;
  this.img = img;
  this.price = 5;

  this.txt = txt;
  this.txt_alpha = 200;
  this.txt_max_alpha = 200;

  this.gain = gain;

  this.orbs = [];
  
  this.hovering = false;
  this.sound = sound.menu;

  this.levels = 0;
  this.max_levels = max_levels;

  this.nprice = nprice;
  this.xprice = xprice;
  
  this.bar = {
    h: this.h * 0.25,
    maxw: 0,
    c: this.w * 5,
    desired_w: 0,
    w: 0,
    _alpha: 0,
    _max_alpha: 255,
    ghost_w: 0,
    ghost_desired_w: this.w * 5 / this.max_levels
  }

  this.start = function() {
    this.render();
    this.update();
  }

  this.render = function() {
    if (this.outside() == false) {
      // Image and the box.
      push();
      imageMode(CENTER);
      rectMode(CORNER);

      if (this.hovered()) {
        strokeWeight(6 * environment.menu.ratio.x);
        stroke(255, 0, 0);
      } else {
        strokeWeight(2 * environment.menu.ratio.x);
        stroke(0);
      }

      fill(51);
      rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h, 4);
      if (this.img) {
        image(this.img, this.x, this.y, this.w - 10, this.h - 10);
      }
      pop();

      // Progress Bar
      push();
      rectMode(CORNER);

      stroke(0, this.bar._alpha);
      fill(200, 0, 0, this.bar._alpha);
      rect(this.x + this.w * 2, this.y - this.bar.h / 2, this.bar.maxw, this.bar.h);

      noStroke();
      fill(0, 255, 0, this.bar._alpha);
      rect(this.x + this.w * 2, this.y - this.bar.h / 2, this.bar.w, this.bar.h);

      fill(0, 255, 0, this.bar._alpha - 150);
      rect(this.x + this.w * 2, this.y - this.bar.h / 2, this.bar.ghost_w, this.bar.h);

      tint(255, this.bar._alpha - 50);
      image(orb, this.bar.maxw * 2, this.y - 22, 48 * environment.menu.ratio.x, 48 * environment.menu.ratio.x);
      pop();

      // Text
      push();
      textFont(font);
      fill(0, this.txt_alpha);
      textSize(18 * environment.menu.ratio.x);
      text(this.txt, this.x + this.w, this.y - this.h / 2, this.x + this.w * 4, this.y + this.h / 2);

      fill(0, this.bar._alpha);
      textAlign(CENTER, CENTER);
      textSize(20 * environment.menu.ratio.x);
      text("Level " + this.levels, this.x + this.w * 2 + this.bar.c / 2, this.y - this.bar.h * 2);

      fill(255, this.bar._alpha);
      textSize(22 * environment.menu.ratio.x);
      text(this.price, this.bar.maxw * 2 + 24, this.y);
      pop();
    }
  }

  this.update = function() {
    if (this.hovered()) {
      this.bar.maxw = lerp(this.bar.maxw, this.bar.c * environment.menu.ratio.x, 0.1);
      this.bar._alpha = lerp(this.bar._alpha, this.bar._max_alpha, 0.1);

      this.txt_alpha = lerp(this.txt_alpha, 0, 0.15);
    } else {
      this.bar.maxw = lerp(this.bar.maxw, 0, 0.1);
      this.bar._alpha = lerp(this.bar._alpha, 0, 0.1);

      this.txt_alpha = lerp(this.txt_alpha, this.txt_max_alpha, 0.15);
    }

    this.bar.desired_w = map(this.levels, 0, this.max_levels, 0, this.bar.maxw);
    this.bar.w = lerp(this.bar.w, this.bar.desired_w, 0.1);
    this.bar.ghost_w = lerp(this.bar.ghost_w, this.bar.ghost_desired_w, 0.1);

    if (this.bar.w >= this.bar.ghost_w - 1 && this.levels < this.max_levels) {
      this.bar.ghost_desired_w += this.bar.c / this.max_levels;
    }

    if (abs(this.desired - this.y) > 5) {
      this.y = lerp(this.y, this.desired, 0.1);
    }


    if (this.levels >= this.max_levels) {
      this.price = "max"
    } else {
      this.price = int(map(this.levels, 0, this.max_levels - 1, this.nprice, this.xprice));
    }
    
    if(this.hovered() && this.hovering == false) {
      this.sound.play();
      this.hovering = true;
    }
    
    if(this.hovered() == false) {
      this.hovering = false; 
    }

  }

  this.outside = function() {
    let y1 = height / 2 - environment.menu.height / 2 + width * 0.04;
    let y2 = height / 2 + environment.menu.height / 2 - width * 0.04;

    if (this.y + this.h / 2 <= y1 + width * 0.04 || this.y - this.h / 2 >= y2 - width * 0.04) {
      return true;
    } else {
      return false;
    }

  }

  this.hovered = function() {
    return mouseX >= this.x - this.w / 2 && mouseX <= this.x + this.w / 2 && mouseY >= this.y - this.h / 2 && mouseY <= this.y + this.h / 2 && this.outside() == false;
  }

}

function Popup(x, y, txt) {
  this.x = x;
  this.y = y;
  this.txt = txt;
  this.alpha = 255;
  this.alpha_dec = 2;

  this.start = function() {
    push();
    textAlign(CENTER, CENTER);
    stroke(0, this.alpha);
    textFont(font);
    textSize(30 * ratio.x);
    fill(200, 0, 0, this.alpha);
    text(this.txt, this.x - 150 * ratio.x, this.y - 150 * ratio.y, 300, 300);
    pop();

    this.alpha -= this.alpha_dec;
    this.y -= 0.3;
  }

  this.dead = function() {
    return this.alpha <= 0;
  }
}