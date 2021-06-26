class Environment {
  constructor(img) {
    this.weapons = {
      player: {
        fuel_consumption: 10,
        freq: 28,
        reload: 0.3,
        width: 30,
        height: 10.5,
        heal: 15,
        offset: 6,
        speed: 9,
        ppershot: 1,
        force: 0.8,
        radius: 6,
      },

      gun: {
        freq: 25,
        reload: 0.3,
        width: 25,
        height: 10,
        heal: 18,
        offset: 0,
        speed: 9,
        ppershot: 1,
        force: 0.8,
        radius: 6,
      },

      rifle: {
        freq: 10,
        reload: 0.5,
        width: 30,
        height: 10.5,
        heal: 12,
        offset: 5,
        speed: 10,
        ppershot: 1,
        force: 0.3,
        radius: 5.5,
      },

      shotgun: {
        freq: 60,
        reload: 0.3,
        width: 29,
        height: 11,
        heal: 16,
        offset: 9,
        speed: 8,
        ppershot: 6,
        force: 3,
        radius: 4,
      }
    }

    this.mouse = {
      x: 0,
      y: 0
    }

    this.cam_offset = createVector();
    this.shake_timer = 0;
    this.max_shake_timer = 10;
    this.shake_mag = 0;

    this.image = img;

    this.infected = [];
    this.healthy = [];
    this.player = new Player(0, 0, this.weapons.player);
    this.menu = new Menu();
    this.ui = new UI();

    this.safe_spot_rad = 1366 * 0.25;
    this.orbs = [];

    this.pass_wave = false;

    this.wave = 1;
    this.max_waves = 15;
    this.settings = {
      weapons: {
        gun: 0,
        rifle: 0,
        shotgun: 0
      },

      infected: {
        infect_rate: 0.3,
        speed: 0.3,
        transformation_rate: 1,
      },

      healthy: {
        regen_rate: 0.1
      },

      spawn: {
        rate: 300,
        count: 1,
        orb_x: 3,
        orb_n: 1,
        min_healthy: 1,
        max_min_healthy: 10
      }
    }

    this.safe_distance = 25;

    this.wave_timer = 0;
    this.max_wave_timer = 6000;

    this.down = false;
    this.down_timer = 0;
    this.max_down_timer = 2000;

    this.hit_timer = 30;
    this.max_hit_timer = 40;
    this.hit_alpha = 0;
    this.max_hit_alpha = 130;

    this.game_over = false;
    this.end = {
      title: "",
      timer: 0,
      max_timer: 1000,
      alpha: 0,
      txt1: "Leave the job of fighting the virus to our doctor and nurses.",
      txt_index1: 0,
      txt2: "Stay home, stay safe.",
      txt_index2: 0,
      txt_alpha: 0,
      c1: 80,
      c2: 100
    }

    sound.music.setVolume(0.35);
    sound.hit.setVolume(0.5);
    sound.transform.setVolume(0.5);
    sound.menu.setVolume(0.4);
    sound.shoot.setVolume(0.5);
    sound.orb.setVolume(0.5);
    sound.special.setVolume(0.5);
    sound.purchase.setVolume(0.5);
    sound.keystroke.setVolume(0.1);

    //this.filt = new p5.BandPass();
    //this.freq = 500;
    //sound.music.disconnect();
    //sound.music.connect(this.filt);
  }

  start() {
    if (start) {
      if (tutorial) {
        push();
        imageMode(CENTER);
        textAlign(CENTER, CENTER);
        textFont(font);
        image(tut, width / 2, height / 2, width, height);
        pop();
      } else {
        video.hide();
        if (this.end.alpha < 250) {
          this.mouse.x = mouseX + this.player.position.x - width / 2;
          this.mouse.y = mouseY + this.player.position.y - height / 2;


          //this.filt.freq(map(this.end.timer, 0, this.end.c1, 500, 250));
          sound.music.rate(map(this.end.timer, 0, this.end.c1, 1, 0.5));
          if (sound.music.isPlaying() == false) {
            sound.music.play();
          }

          beginning.x = lerp(beginning.x, 0, 0.03);
          beginning.y = lerp(beginning.y, 0, 0.03);

          push();
          translate(width / 2 - this.player.position.x + this.cam_offset.x + map(mouseX, 0, width, 10, -10) + beginning.x, height / 2 - this.player.position.y + this.cam_offset.y + map(mouseY, 0, height, 10, -10) + beginning.y);

          imageMode(CENTER);
          image(this.image, 0, 0, 1366 * 4.5, 1366 * 4.5);

          for (let i = this.orbs.length - 1; i >= 0; i--) {
            this.orbs[i].start();

            if (this.orbs[i].dead() == false) {
              if (this.orbs[i].collides(this.player)) {
                this.player.orbs++;
                sound.orb.play();
                this.orbs.splice(i, 1);
              }
            } else {
              this.orbs.splice(i, 1);
            }

          }

          for (let i = this.infected.length - 1; i >= 0; i--) {
            this.infected[i].start();
            this.infected[i].AI();

            this.infected[i].infect(this.player);
            this.infected[i].repel(this.player);

            if (this.player.in_curing_chamber(this.infected[i])) {
              let damage = {
                heal: this.player.special.heal
              }
              this.infected[i].takeDamage(damage);
            }

            if (this.infected[i].cured()) {
              this.healthy.push(new Healthy(this.infected[i].position.x, this.infected[i].position.y));
              sound.transform.play();

              for (let n = 0; n < int(random(this.settings.spawn.orb_n, this.settings.spawn.orb_x)); n++) {
                this.orbs.push(new Orb(this.infected[i].position.x, this.infected[i].position.y));
              }
              Instantiate("cured", this.infected[i].position.x, this.infected[i].position.y);
              environment.shake(5);
              this.player.special.load_timer += this.player.special.load_timer_recharge;
              this.infected.splice(i, 1);
            }

            for (let j = this.infected.length - 1; j >= 0; j--) {
              if (this.infected[i]) {
                this.infected[i].repel(this.infected[j]);
              }
            }
          }

          for (let i = 0; i < this.healthy.length; i++) {
            this.healthy[i].start();
            this.healthy[i].AI();

            this.healthy[i].repel(this.player);

            if (this.player.in_curing_chamber(this.healthy[i])) {
              let damage = {
                heal: -this.player.special.heal
              }
              this.healthy[i].takeDamage(damage);
            }

            for (let j = 0; j < this.healthy.length; j++) {
              this.healthy[i].repel(this.healthy[j], "safe");
            }
          }

          for (let i = this.healthy.length - 1; i >= 0; i--) {
            for (let j = this.infected.length - 1; j >= 0; j--) {
              this.infected[j].infect(this.healthy[i]);
              if (dist(this.infected[j].position.x, this.infected[j].position.x, 0, 0) < this.safe_spot_rad) {
                this.healthy[i].run(this.infected[j]);
              }
              this.healthy[i].repel(this.infected[j]);
            }

            if (this.healthy[i].infected()) {
              Instantiate("infected", this.healthy[i].position.x, this.healthy[i].position.y);
              environment.shake(10);
              environment.spawn(this.healthy[i].position);
              this.healthy.splice(i, 1);
            }
          }

          this.player.start();

          if (this.down == false) {
            if (frameCount % this.settings.spawn.rate == 0) {
              this.spawn();
            }
          }

          ParticleHandler();

          pop();


          this.cameraShake();
          this.optimize();
          this.gameLoop();
          this.ui.start();
          this.menu.start();

          this.pass_wave = this.healthy.length >= this.settings.spawn.min_healthy;

          if (this.hit_timer < this.max_hit_timer) {
            this.hit_timer++;
          }

          this.hit_alpha = map(this.hit_timer, 0, this.max_hit_timer, this.max_hit_alpha, 0);

          push();
          rectMode(CORNER);
          noStroke();
          fill(255, 0, 0, this.hit_alpha);
          rect(0, 0, width, height);
          pop();
        }

        if (this.game_over) {
          if (this.end.timer < this.end.max_timer) {
            this.end.timer++;
          }

          this.end.alpha = map(this.end.timer, 0, this.end.c1, 0, 255);
          this.end.txt_alpha = map(this.end.timer, this.end.c1, this.end.c2, 0, 255);

          if (this.end.timer > this.end.c2 + 15 && frameCount % 5 == 0 && this.end.txt_index1 < this.end.txt1.length) {
            this.end.txt_index1++;
            sound.keystroke.play();
          }

          if (this.end.timer > this.end.c2 + this.end.txt1.length * 5 + 30 && frameCount % int(map(this.end.txt2.length - this.end.txt_index2, 0, this.end.txt2.length, 40, 6)) == 0 && this.end.txt_index2 < this.end.txt2.length) {
            this.end.txt_index2++;
            sound.keystroke.play();
          }
          
          //if(this.end.txt_index2 >= this.end.txt2.length) {
            //noLoop();
            //window.location.replace("https://docs.google.com/forms/d/e/1FAIpQLScPozeRs2d68OXZUHiZ-4Iucmo4eV3_4mX6O51XCkG9oh9WJA/viewform?usp=sf_link"); 
          //}

          push();
          rectMode(CORNER);
          noStroke();
          fill(0, this.end.alpha);
          rect(0, 0, width, height);

          rectMode(CENTER);
          textAlign(CENTER, CENTER);
          textFont(font);
          fill(255, this.end.txt_alpha);
          textSize(50 * ratio.x);
          text(this.end.title, width / 2, height * 0.2);
          fill(255);
          textSize(20 * ratio.x);
          text(this.end.txt1.substring(0, this.end.txt_index1), width * 0.5, height * 0.5, width * 0.9, height);
          textSize(35 * ratio.x);
          text(this.end.txt2.substring(0, this.end.txt_index2), width / 2, height * 0.7);
          textSize(15 * ratio.x);
          text("press f5 to replay", width / 2, height * 0.93);
          pop();
        }
      }
    }
  }

  optimize() {
    this.settings.weapons.gun = map(this.wave, 1, this.max_waves, 2, 35);
    this.settings.weapons.rifle = map(this.wave, 1, this.max_waves, 1, 20);
    this.settings.weapons.shotgun = map(this.wave, 1, this.max_waves, 1, 12);

    this.settings.infected.infect_rate = map(this.wave, 1, this.max_waves, 0.4, 0.9);
    this.settings.infected.speed = map(this.wave, 1, this.max_waves, 0.35, 0.45);
    this.settings.infected.transformation_rate = map(this.wave, 1, this.max_waves, 1, 0.4);
    this.settings.infected.hp = map(this.wave, 1, this.max_waves, 50, 140);


    this.settings.spawn.count = int(map(this.wave, 1, this.max_waves, 2, 5));
    this.settings.spawn.rate = int(map(this.settings.spawn.count, 2, 4, 600, 1000));

    this.settings.spawn.orb_n = map(this.wave, 1, this.max_waves, 1, 2);
    this.settings.spawn.orb_x = map(this.wave, 1, this.max_waves, 3, 6);

    this.settings.spawn.min_healthy = this.wave;

    // PLAYER
    let sgs = environment.menu.segments;

    // WEAPON
    // Accuracy 0
    this.weapons.player.offset = map(sgs[0].levels, 0, sgs[0].max_levels, 6, 0);

    // Reload Speed 1
    this.weapons.player.freq = int(map(sgs[1].levels, 0, sgs[1].max_levels, 28, 10));

    // Healing Power 2 
    this.weapons.player.heal = map(sgs[2].levels, 0, sgs[2].max_levels, 16, 40);

    // Fuel Efficiency 3
    this.weapons.player.fuel_consumption = map(sgs[3].levels, 0, sgs[3].max_levels, 8, 2);

    // Projectile Speed 4
    this.weapons.player.speed = map(sgs[4].levels, 0, sgs[4].max_levels, 7, 14);

    // PROTECTION
    // Mask 5
    this.player.max_hp = map(sgs[5].levels, 0, sgs[5].max_levels, 100, 200);
    this.settings.healthy.regen_rate = map(sgs[5].levels, 0, sgs[5].max_levels, 0.1, 0.45);

    // SPECIAL
    // Curing Chamber 6
    this.player.special.effect_radius = map(sgs[6].levels, 0, sgs[6].max_levels, 100, 140);
    this.player.special.heal = map(sgs[6].levels, 0, sgs[6].max_levels, 0.5, 1);
    this.player.special.max_timer = map(sgs[6].levels, 0, sgs[6].max_levels, 300, 400);
  }

  gameLoop() {
    if (this.down == false) {
      // WAVE HAPPENING
      if (this.wave_timer < this.max_wave_timer) {
        this.wave_timer++;
      } else {
        if (this.pass_wave) {
          Instantiate("downtime", 0, 0);

          this.player.reset();

          for (let i = this.healthy.length - 1; i >= 0; i--) {
            if (this.healthy[i]) {
              if (dist(this.healthy[i].position.x, this.healthy[i].position.y, 0, 0) < this.safe_spot_rad) {
                Instantiate("healthy_taken", this.healthy[i].position.x, this.healthy[i].position.y);
                environment.shake(5);
                this.player.orbs += 1;
                this.healthy.splice(i, 1);
              }
            }
          }

          this.infected = [];
          this.down_timer = 0;
          this.down = true;
        } else {
          this.game_over = true;
          this.end.title = "You Lost."
          this.end.txt1 = "You've caused more people to get infected than you cured. Leave the job of fighting the virus to our doctor and nurses."
        }

        if (this.wave >= 15) {
          this.game_over = true;
          this.end.title = "You Won!"
          this.end.txt1 = "Or did you? ... This is not about what a single person does, this is about what we do as a whole community. We need your help."
        }
      }
    } else {
      // DOWNTIME
      if (this.down_timer < this.max_down_timer) {
        this.down_timer++;
      } else {
        this.wave_timer = 0;
        this.wave++;
        this.ui.wave.timer = 0;

        this.down = false;
      }
    }

  }



  spawn(pos) {
    if (pos) {
      let n = random(100);
      let w;
      if (n < this.settings.weapons.rifle) {
        w = this.weapons.rifle;
      } else if (n > this.settings.weapons.rifle && n < this.settings.weapons.rifle + this.settings.weapons.shotgun) {
        w = this.weapons.shotgun;
      } else if (n > this.settings.weapons.shotgun && n < this.settings.weapons.shotgun + this.settings.weapons.gun) {
        w = this.weapons.gun;
      } else {
        w = null;
      }

      this.infected.push(new Infected(pos.x, pos.y, w));
    } else {
      for (let i = 0; i < this.settings.spawn.count; i++) {
        let angle = random(360);
        let r = 1366 * 0.75;

        let x = r * cos(angle);
        let y = r * sin(angle);

        let n = random(100);
        let w;
        if (n < this.settings.weapons.rifle) {
          w = this.weapons.rifle;
        } else if (n > this.settings.weapons.rifle && n < this.settings.weapons.rifle + this.settings.weapons.shotgun) {
          w = this.weapons.shotgun;
        } else if (n > this.settings.weapons.shotgun && n < this.settings.weapons.shotgun + this.settings.weapons.gun) {
          w = this.weapons.gun;
        } else {
          w = null;
        }

        this.infected.push(new Infected(x, y, w));

      }
    }

  }





  shake(mag) {
    this.shake_timer = this.max_shake_timer;
    this.shake_mag = mag;
  }

  cameraShake() {
    if (this.shake_timer > 0) {
      this.shake_timer--;
      this.cam_offset = createVector(random(-this.shake_mag, this.shake_mag), random(-this.shake_mag, this.shake_mag));
    }
  }

}