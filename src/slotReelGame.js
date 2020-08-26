import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { PixiPlugin } from "gsap/PixiPlugin";

// register the plugin
gsap.registerPlugin(PixiPlugin);

// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);

let Sprite    = PIXI.Sprite,
    loader    = PIXI.Loader.shared;
    
export default class slotReelGame {

  constructor() {
    if(!document.body) {
      throw new Error('window is not ready');
    };

    this.numberOfReel = [];
    this.lines = []
  }

  init() {
    loader
      .add('./assets/images/spritesheet.json')
      .load(() => {
        this.setup()}
      );
  }

  setup() {
    this.app = new PIXI.Application({
      width: 800,
      height: 640,
      backgroundColor: 0x1099bb,
    });
    document.body.appendChild(this.app.view);

    this.scene = new PIXI.Container();
    this.app.stage.addChild(this.scene);

    this.configureRandomLine();
  }

  configureRandomLine() {
    // Загрузка текстур
    const sheetID = loader.resources['./assets/images/spritesheet.json'].spritesheet;
    const reel = new Reel(sheetID);

    for (let i = 0; i <= 5; i++) {
      this.lines[i] = reel.randomFill();

      for (let j = 0; j <= 9; j++) {
        this.lines[i][j].position.set(100 * (i + 1), 30 + j * 70);
        this.scene.addChild(this.lines[i][j]);
      }
      // Animation
      gsap.to(this.lines[i], {y: 600, duration: 1 + i * 0.2, repeat: -1, yoyo: true });
    }
  } 
}

class Reel {
  constructor(sheetID) {
    this.sheetID = sheetID;
  }

  randomFill() {
    const arr = [];
    const a = [...Array(10).keys()];  // a === [0, 1, 2, .... , 9]
    for(let i = 0; i <= 9; i++) {
         //Случайно выбираем индекс из оставшихся в массиве индексов
        const index = Math.floor(Math.random() * a.length);
        //Определяем число
        const sprite = new Sprite(this.sheetID.textures[`${a[index]}.png`]);
        sprite.anchor.set(0.5);
        sprite.scale.set(0.4);
        arr[i] = sprite;
        //Отбрасываем использованный индекс
        a.splice(index, 1);  
    }

    return arr;
  }
}