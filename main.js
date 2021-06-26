class Main {
  constructor() {
    this.buttons = [];

    this.buttons.push(new Button(0, 100, "START", () => {
      start = true;
      tutorial = false;
    }));

    this.buttons.push(new Button(0, 100 + height * 0.11, "TUTORIAL", () => {
      start = true;
      tutorial = true;
    }));
    this.buttons.push(new Button(0, 100 + height * 0.22, "CREDITS", () => {
      this.show_credits = !this.show_credits;
    }));

    this.who = {
      rad: 75,
      c: 75,
      max_rad: 100,
      alpha: 75,
      max_alpha: 255,
      hovering: false
    }

    this.credits_alpha = 0;
    this.box_alpha = 0;
    this.show_credits = false;
  }

  start() {
    if (start == false) {
      this.update();
    }
  }

  update() {
    image(video, 0, 0, width, height);

    push();
    imageMode(CENTER);
    noStroke();
    fill(255, this.who.alpha);
    ellipse(width * 0.1, height * 0.7, this.who.rad * 2);
    image(who, width * 0.1, height * 0.7, 200 * ratio.x, 200 * ratio.x);
    pop();

    push();
    imageMode(CENTER);
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    textFont(font);
    translate(width * 0.7, height / 2);

    noStroke();
    fill(255, this.box_alpha);
    rect(0, 0, width * 0.4, height * 0.7, 10);

    if (this.show_credits) {
      image(credits.anka, 0, 0, width * 0.35, width * 0.35);

      image(credits.programmer, width * -0.13, height * -0.3, 48, 48);
      image(credits.artist, 0, height * -0.3, 48, 48);
      image(credits.designer, width * 0.13, height * -0.3, 48, 48);
      image(credits.game_tester, -width * 0.15, height * 0.05, 40, 40);
    }

    fill(0, this.credits_alpha);
    textSize(20);
    text("Kagan Atalay", width * -0.13, height * -0.2);

    text("Mehmet Ali Bagıbala", 0, height * -0.2, 150, height);
    text("Han Eskicioglu", 0, height * -0.1, 150, height);

    text("Kagan Atalay", width * 0.13, height * -0.2, 150, height);
    text("Han Eskicioglu", width * 0.13, height * -0.1, 150, height);
    text("Mehmet Ali Bagıbala", width * 0.13, height * 0, 150, height);


    text("Thanks to our fellow playtesters who's given us inspration and precious feedback to keep us going during development stage.", 0, height * 0.15, width * 0.35, height);
    textSize(20);
    text("Thanks to X-SHARC, team 6838 for organising this wonderful event.", 0, height * 0.3, width * 0.35, height);

    pop();

    if (this.show_credits) {
      this.box_alpha = lerp(this.box_alpha, 150, 0.1);
      this.credits_alpha = lerp(this.credits_alpha, 255, 0.1);
    } else {
      this.box_alpha = lerp(this.box_alpha, 0, 0.1);
      this.credits_alpha = lerp(this.credits_alpha, 0, 0.1);
    }



    if (dist(mouseX, mouseY, width * 0.1, height * 0.7) < this.who.max_rad) {
      this.who.rad = lerp(this.who.rad, this.who.max_rad, 0.1);
      this.who.alpha = lerp(this.who.alpha, this.who.max_alpha, 0.1);
    } else {
      this.who.hovering = false;
      this.who.rad = lerp(this.who.rad, this.who.c, 0.1);
      this.who.alpha = lerp(this.who.alpha, this.who.c, 0.1);
    }

    if (dist(mouseX, mouseY, width * 0.1, height * 0.7) < this.who.max_rad && this.who.hovering == false) {
      sound.menu1.play();
      this.who.hovering = true;
    }


    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].start();
    }
  }
}

function Button(x, y, txt, func) {
  this.x = x;
  this.y = y;

  this.sound = sound.menu1;
  this.hovering = false;

  this.c = width * 0.2;
  this.w = width * 0.2;
  this.h = height * 0.1;
  this.maxw = width * 0.4;
  this.txt = txt;

  this.alpha_c = 150;
  this.alpha = 150;
  this.max_alpha = 255;

  this.func = func;

  this.txt_c = 20 * ratio.x;
  this.txt_size = 20;
  this.max_txt_size = 30 * ratio.x;

  this.start = function() {
    this.render();
    this.update();
  }

  this.render = function() {
    push();
    rectMode(CORNER);
    noStroke();
    fill(220, this.alpha);
    rect(this.x, this.y, this.w, this.h, 4);

    fill(51, this.alpha);
    textSize(this.txt_size);
    textAlign(CENTER, CENTER);
    textFont(font);
    text(this.txt, this.x + this.w / 2, this.y + this.h / 2);
    pop();
  }

  this.update = function() {
    if (this.hovered()) {
      this.w = lerp(this.w, this.maxw, 0.1);
      this.txt_size = lerp(this.txt_size, this.max_txt_size, 0.1);
      this.alpha = lerp(this.alpha, this.max_alpha, 0.1);
    } else {
      this.w = lerp(this.w, this.c, 0.1);
      this.txt_size = lerp(this.txt_size, this.txt_c, 0.1);
      this.alpha = lerp(this.alpha, this.alpha_c, 0.1);
    }

    if (this.hovered() && this.hovering == false) {
      this.sound.play();
      this.hovering = true;
    }

    if (this.hovered() == false) {
      this.hovering = false;
    }
  }

  this.hovered = function() {
    return mouseX >= this.x && mouseX <= this.x + this.w && mouseY >= this.y && mouseY <= this.y + this.h;
  }

}