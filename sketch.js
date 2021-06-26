let environment, main;
let background_image;
let ratio;

let hp_bar, fuel_bar, orb, healthy, special, who, tut;

let credits = {
  artist: 0,
  designer: 0,
  programmer: 0,
  game_tester: 0,
  anka: 0
}

let masks = {
  paper: 0,
  build: 0,
  gas: 0,
  black: 0,
  shield: 0
}

let upgrades = {
  accuracy: 0,
  efficiency: 0,
  heal: 0,
  reload: 0,
  special: 0,
  speed: 0
}

let sound = {
  music: 0,
  hit: 0,
  transform: 0,
  special: 0,
  shoot: 0,
  orb: 0,
  menu: 0,
  menu1: 0,
  purchase: 0,
  keystroke: 0
}

let font;

let start = false;
let tutorial = false;

let video;
let beginning; // beginning camera offset

function setup() {
  c = createCanvas(displayWidth, displayHeight);
  //c = createCanvas(windowWidth, windowHeight);
  c.position(0, 0);
  ratio = createVector(1 / (1366 / width), 1 / (768 / height));
  environment = new Environment(background_image);
  
  let a = random(360);
  beginning = createVector(1366 * 2 * cos(a), 1366 * 2 * sin(a));

  main = new Main();

  DefineParticle("gun", "particle/player/guns/gun.json");
  DefineParticle("rifle", "particle/player/guns/rifle.json");
  DefineParticle("shotgun", "particle/player/guns/shotgun.json");

  DefineParticle("spec_curing", "particle/player/special/curing.json");

  DefineParticle("hit", "particle/infected/hit.json");
  DefineParticle("cured", "particle/infected/cured.json");

  DefineParticle("infected", "particle/healthy/infected.json");

  DefineParticle("downtime", "particle/environment/downtime.json");
  DefineParticle("healthy_taken", "particle/environment/healthy_taken.json");

  sound.menu1.setVolume(0.2);

  //video = createVideo('assets/vid.mp4', () => {video.loop();});
  cursor(CROSS);
  video.loop();
}

function draw() {
  background(100);
  main.start();
  environment.start();
}


function keyPressed(event) {
  if (keyCode === 121) {
    let fs = fullscreen();
    fullscreen(!fs);
  }

  for (let i = 0; i < environment.player.controls.length; i++) {
    if (key == environment.player.controls[i]) {
      environment.player.movement[i] = true;
    }
  }

  if (start) {
    if (key == "e") {
      if (environment.down) {
        environment.menu.active = !environment.menu.active;
      } else {
        environment.menu.popups.push(new Popup(width / 2, height / 1.5, "You can only access upgrades menu in downtime."));
      }
    }

    if (key == "z") {
      if (environment.player.special.ready) {
        environment.player.special.picking = true;
      } else {
        environment.menu.popups.push(new Popup(width / 2, height / 1.5, "Your special power is not ready yet."));
      }
    }

    if (key == "x") {
      environment.player.special.picking = false;
    }

    if (key == " ") {
      if (environment.down) {
        environment.down_timer = environment.max_down_timer;
      }
    }
  }

}

function keyReleased() {
  for (let i = 0; i < environment.player.controls.length; i++) {
    if (key == environment.player.controls[i]) {
      environment.player.movement[i] = false;
    }
  }
}

function mousePressed() {
  if (start) {
    if (environment.player.special.picking && environment.player.special.available) {
      environment.player.startEffect();
    }


    for (let i = 0; i < environment.menu.segments.length; i++) {
      let s = environment.menu.segments[i];
      if (s.hovered()) {
        if (s.levels < s.max_levels) {
          if (environment.player.orbs >= s.price) {
            environment.player.orbs -= s.price;
            sound.purchase.play();
            s.levels++;
          } else {
            environment.menu.popups.push(new Popup(mouseX, mouseY, "You do not have enough orbs!"));
          }
        }
      }
    }
  } else {
    for (let i = 0; i < main.buttons.length; i++) {
      let b = main.buttons[i];
      if (b.hovered()) {
        b.func();
      }
    }
    
    if(dist(mouseX, mouseY, width * 0.1, height * 0.7) < main.who.max_rad) {
      window.open("https://www.who.int/health-topics/coronavirus"); 
    }
  }
}

function preload() {
  video = createVideo("assets/vid.mp4");

  background_image = loadImage("bg.png");
  hp_bar = loadImage("assets/bar.png");
  fuel_bar = loadImage("assets/fuelbar.png");
  orb = loadImage("assets/orb.png");
  healthy = loadImage("assets/healthy.png");
  special = loadImage("assets/special1.png");
  who = loadImage("assets/WHO.png");
  tut = loadImage("assets/tutorial.png");

  masks.paper = loadImage("assets/masks/paper_mask.png");
  masks.black = loadImage("assets/masks/med_mask.png");
  masks.build = loadImage("assets/masks/build_mask.png");
  masks.shield = loadImage("assets/masks/facemask.png");
  masks.gas = loadImage("assets/masks/gas_mask.png");

  upgrades.accuracy = loadImage("assets/upgrades/accuracy.png");
  upgrades.efficiency = loadImage("assets/upgrades/fuel_efficiency.png");
  upgrades.heal = loadImage("assets/upgrades/heal_power.png");
  upgrades.reload = loadImage("assets/upgrades/reload.png");
  upgrades.special = loadImage("assets/upgrades/special.png");
  upgrades.speed = loadImage("assets/upgrades/speed.png");

  sound.music = loadSound("assets/sound/music.mp3");
  sound.hit = loadSound("assets/sound/hit.wav");
  sound.transform = loadSound("assets/sound/transform.wav");
  sound.menu = loadSound("assets/sound/menu1.wav");
  sound.menu1 = loadSound("assets/sound/menu.wav");
  sound.shoot = loadSound("assets/sound/shoot.wav");
  sound.orb = loadSound("assets/sound/orb.wav");
  sound.special = loadSound("assets/sound/special.wav");
  sound.purchase = loadSound("assets/sound/purchase.wav");
  sound.keystroke = loadSound("assets/sound/keystroke.mp3");
  
  credits.programmer = loadImage("assets/credits/programmer.png");
  credits.artist = loadImage("assets/credits/artist.png");
  credits.designer = loadImage("assets/credits/designer.png");
  credits.game_tester = loadImage("assets/credits/game_tester.png");
  credits.anka = loadImage("assets/credits/anka.png");

  font = loadFont("assets/font.ttf");
}

function mouseWheel(event) {
  let amount = -event.delta * 0.3;

  for (let i = 0; i < environment.menu.segments.length; i++) {
      let s = environment.menu.segments[i];
      s.desired += amount;
    }
}