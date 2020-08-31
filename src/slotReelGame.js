import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { PixiPlugin } from "gsap/PixiPlugin";

// register the plugin
gsap.registerPlugin(PixiPlugin);

// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);

let Sprite    = PIXI.Sprite,
    loader    = PIXI.Loader.shared;

const BUTTONS = {
  SPINBUTTON: {widthStroke: 0, isFilled: true, bg: 0xff2239, size: 34, alpha: 0.8},
  SPINBUTTONSTROKE: {widthStroke: 2, isFilled: false, bg: 0xf9f300, size: 35, alpha: 1}
}

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
    this.containerScene.position.set(184, this.app.view.height / 2);
    this.scene.addChild(this.containerScene);

    this.configureRandomLine();
    this.configureButton();
    this.configureMaskOnContainer();
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
        this.tweens[i][j] = gsap.fromTo(this.lines[i][j], {y: -300}, {y: 300, duration: 2 - (i * 0.2), repeat: -1, paused: true, ease: "linear"});
        this.tweens[i][j].progress(progressPerSymbol * (j + 1));
        // gsap
        //   .fromTo(this.lines[i][j], {y: -300}, {y: 300, duration: 2 - (i * 0.2), repeat: -1, paused: true ,ease: "linear"})
        //   .progress(progressPerSymbol * (j + 1));
        // console.log(progressPerSymbol * (j + 1));
        //console.log(`width = ${this.lines[i][j].width} + position.x = ${this.lines[i][j].position.x} = ${this.lines[i][j].width + this.lines[i][j].position.x}`);
      }
      // Animation
    }
  

  } 

  configureButton() {
    this.btnStart = new Button(BUTTONS.SPINBUTTON);
    this.btnStop = new Button(BUTTONS.SPINBUTTON);
    this.btnStartFake = new Button(BUTTONS.SPINBUTTONSTROKE);

    this.btnStart.alpha = 0.8;
    this.btnStop.alpha = 0.8;
    this.btnStart.visible = true;
    this.btnStop.visible = false;
    // this.btnStart.interactive = true;
    // this.btnStop.interactive = false;


    this.scene.addChild(this.btnStartFake);
    this.scene.addChild(this.btnStop);
    this.scene.addChild(this.btnStart);
    
   
    



    this.btnStart
      .on('pointerdown',      this.onClick.bind(this, this.btnStop, true))          // При нажатии
      .on('pointerup',        this.onClickAfter.bind(this))     // При отпускании
      .on('pointerupoutside', this.onClickAfter.bind(this))     // При отпускании за пределами границы кнопки
      .on('pointerover',      this.onPointerOver.bind(this))    // Курсор на кнопке
      .on('pointerout',       this.onPointerOut.bind(this));    // За кнопкой

    this.btnStop
      .on('pointerdown',      this.onClick.bind(this, this.btnStart, false))          // При нажатии
      .on('pointerup',        this.onClickAfter.bind(this))     // При отпускании
      .on('pointerupoutside', this.onClickAfter.bind(this))     // При отпускании за пределами границы кнопки
      .on('pointerover',      this.onPointerOver.bind(this))    // Курсор на кнопке
      .on('pointerout',       this.onPointerOut.bind(this));    // За кнопкой


  }
  

  onClick(secondBtn,bool) {
    //console.log('click', this.btnStart);
    if(bool) {
      console.log("Start");
      this.btnStart.visible = !bool;
      secondBtn.visible = bool;
    } else {
      console.log("Stop");
      secondBtn.visible = !bool;
      this.btnStop.visible = bool;
    }
    
  }
  onClickAfter() {
    console.log('After');
    console.log(this.btnStop.visible);
    if(this.btnStop.visible) {
      for(let i = 0; i <= 4; i++) {
        for(let j = 0; j <= 9; j++) {
          this.tweens[i][j] = gsap
            .fromTo(this.lines[i][j], { y: -300 }, { y: 300, duration: 2 - (i * 0.2), repeat: -1, ease: "linear" })
            .progress((58.4 / 600) * (j + 1));
        }
      }
    } else {
      for(let i = 0; i <= 4; i++) {
        for(let j = 0; j <= 9; j++) {
          this.tweens[i][j].pause();
          // gsap
          //   .fromTo(this.lines[i][j], { y: -300 }, { y: 300, duration: 2 - (i * 0.2), pause,  ease: "linear" })
          //   .progress((58.4 / 600) * (j + 1));
        }
      }
    }
    
  }
  onPointerOver() {
    console.log('Over', );
    this.btnStart.alpha = 1.2;  
    this.btnStop.alpha = 1.2;
  }
  onPointerOut() {
    console.log('Out');
    this.btnStart.alpha = 0.8;
    this.btnStop.alpha = 0.8;
  }
  
  configureMaskOnContainer() {
    const mask = new PIXI.Graphics;
    mask.pivot.set(0, 200);
    mask.beginFill(0xff0000, 1);
    mask.drawRect(-33, 0, 457, 250);
    mask.endFill();
    this.containerScene.mask = mask;
    this.containerScene.addChild(mask);
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


class Button extends PIXI.Graphics {
  constructor(options) {
    super();
    this.options = options;

    if(this.options.widthStroke) {
      this.lineStyle(this.options.widthStroke, this.options.bg, 1)
    } 

    if(this.options.isFilled) {
      this.beginFill(this.options.bg, this.options.alpha);
    } else {
      this.beginFill();
    }

    this
      .drawCircle(86, 500, this.options.size)
      .endFill()
      .pivot.set(20, 20);

    
    // Действие на кнопку
    this.interactive = true;
    this.buttonMode = true;
  }
}