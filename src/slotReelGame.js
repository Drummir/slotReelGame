import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { PixiPlugin } from "gsap/PixiPlugin";

// register the plugin
gsap.registerPlugin(PixiPlugin);

// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);

let Sprite    = PIXI.Sprite,
    loader    = PIXI.Loader.shared;

/**
 * Class slotReelGame
 */
export default class slotReelGame {
  /**
   * slotReelGame constructor.
   */
  constructor() {
    if(!document.body) {
      throw new Error('window is not ready');
    };

    this.numberOfReel = [];
    this.lines = [];
    this.tweens = [];
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
    this.scene.position.set(0, 0);
    this.app.stage.addChild(this.scene);

    this.containerScene = new PIXI.Container();
    this.containerScene.position.set(172, this.app.view.height / 2);
    this.scene.addChild(this.containerScene);

    this.configureRandomLine();
  }

  /**
   * Configures a random line.
   */
  configureRandomLine() {
    // Загрузка текстур
    const sheetId = loader.resources['./assets/images/spritesheet.json'].spritesheet;
    const reel = new Reel(sheetId);
    const progressPerSymbol = 58.4 / 600;

    // Add 5 reels from 10 numbers
    for (let i = 0; i <= 4; i++) {
      this.lines[i] = reel.getArrayOfRandomSprites(); // Линейки

      for (let j = 0; j <= 9; j++) {
        this.lines[i][j].position.set(100 * (i), 0);
        this.containerScene.addChild(this.lines[i][j]);
        this.tweens[i] = [];
        this.tweens[i][j] = gsap.fromTo(this.lines[i][j], {y: -300}, {y: 300, duration: 1, repeat: -1, paused: true, ease: "linear"});
        this.tweens[i][j].progress(progressPerSymbol * (j + 1));
        console.log(progressPerSymbol * (j + 1));
        // console.log(`width = ${this.lines[i][j].width} + position.x = ${this.lines[i][j].position.x} = ${this.lines[i][j].width + this.lines[i][j].position.x}`);

      }
      // Animation

      //gsap.tweenTo()
    }
    
    console.log('countainer witdh = ' + this.containerScene.width);
  } 
}

/**
 * Class Reel
 */
class Reel {
  /**
   * Reel constructor. 
   * 
   * @param {number} sheetId Sheet ID
   */
  constructor(sheetId) {
    this.sheetID = sheetId;
  }

  /**
   * Returns an array of random sprites.
   * 
   * @returns {Sprite[]}
   */
  getArrayOfRandomSprites() {
    const arr = [];
    const a = [...Array(10).keys()];  // a === [0, 1, 2, .... , 9]
    for(let i = 0; i <= 9; i++) {
         //Случайно выбираем индекс из оставшихся в массиве индексов
        const index = Math.floor(Math.random() * a.length);
        //Определяем число
        const sprite = new Sprite(this.sheetID.textures[`${a[index]}.png`]);
        sprite.anchor.set(0.5);
        sprite.scale.set(0.33);
        arr[i] = sprite;
        //Отбрасываем использованный индекс
        a.splice(index, 1);  
    }

    return arr;
  }
}