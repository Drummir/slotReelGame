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

    this.scaleene = new PIXI.Container();
    this.scaleene.position.set(0, 0);
    this.app.stage.addChild(this.scaleene);

    this.containerscaleene = new PIXI.Container();
    this.containerscaleene.position.set(172, this.app.view.height / 2);
    this.scaleene.addChild(this.containerscaleene);

    this.configureRandomLine();
    this.configureButton();
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
        this.containerscaleene.addChild(this.lines[i][j]);
        // this.tweens[i] = [];
        // this.tweens[i][j] = gsap.fromTo(this.lines[i][j], {y: -300}, {y: 300, duration: 1, repeat: -1, paused: true, ease: "linear"});
        // this.tweens[i][j].progress(progressPerSymbol * (j + 1));
        gsap
          .fromTo(this.lines[i][j], {y: -300}, {y: 300, duration: 1 + (i * 0.2), repeat: -1, ease: "linear"})
          .progress(progressPerSymbol * (j + 1));
        // console.log(progressPerSymbol * (j + 1));
        // console.log(`width = ${this.lines[i][j].width} + position.x = ${this.lines[i][j].position.x} = ${this.lines[i][j].width + this.lines[i][j].position.x}`);
      }
      // Animation
    }
  } 

  configureButton() {
    //const btn = new PIXI.Graphics();

    // btn.lineStyle(2, 0xFEEB77, 0.6);
    // btn.beginFill(0xff0000, 1);
    // btn.drawCircle(86, this.app.view.height - 100, 35);
    // btn.endFill();

    // btn.pivot.set(20, 20);
    this.btn = new Button(BUTTONS.SPINBUTTON);
    this.btn.alphaha = 0.8;
    //this.btn2 = new Button(2, 0, 0xf9f300, 35, 1);
    this.btn2 = new Button(BUTTONS.SPINBUTTONSTROKE);
    this.scaleene.addChild(this.btn2);
    this.scaleene.addChild(this.btn);
    



    this.btn
      .on('pointerdown',      () => this.onClick(this.btn))          // При нажатии
      .on('pointerup',        () => this.onClickAfter(this.btn))     // При отпускании
      .on('pointerupoutside', () => this.onClickAfter(this.btn))     // При отпускании за пределами границы кнопки
      .on('pointerover',      () => this.onPointerOver(this.btn))    // Курсор на кнопке
      .on('pointerout',       () => this.onPointerOut(this.btn));    // За кнопкой
  }

  onClick(btn) {
    console.log('click');
  }
  onClickAfter(btn) {
    console.log('After');
    
  }
  onPointerOver(btn) {
    console.log('Over');
    btn.alpha = 1.1;
    //btn.tint = 0x0ff273a;
  }
  onPointerOut(btn) {
    console.log('Out');
    btn.alpha = 0.8;
    //btn.tint = 0xff98b5;
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


class Button {
  constructor(options) {
    this.options = options;
    // this.widthStroke = widthStroke;     // Толщина линии обводки
    // this.isFilled = isFilled;             // Делать заливку или нет
    // this.bg = bg;             // Начальный цвет 
    // this.size = size;             // Начальный размер
    // this.alpha = alpha;           // Альфа канал

    const btn = new PIXI.Graphics();

    // Boolean(isFilled) ? btn.beginFill(this.bg, this.alpha) : btn.lineStyle(this.widthStroke, this.bg, 1).beginFill();

    if(this.options.widthStroke) {
      btn.lineStyle(this.options.widthStroke, this.options.bg, 1)
    } 

    if(this.options.isFilled) {
      btn.beginFill(this.options.bg, this.options.alpha);
    } else {
      btn.beginFill();
    }

    btn
      .drawCircle(86, 500, this.options.size)
      .endFill()
      .pivot.set(20, 20);

    
    // Действие на кнопку
    btn.interactive = true;
    btn.buttonMode = true;

    return btn;
  }
}