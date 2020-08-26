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
    this.lineOne = [];
    this.lineTwo = [];
    this.lineThree = [];
    this.lineFour = [];
    this.lineFive = []; 
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
    this.lineOne = new Reel().arr;
    this.lineTwo = new Reel().arr;
    this.lineThree = new Reel().arr;
    this.lineFour = new Reel().arr;
    this.lineFive = new Reel().arr;

    for(let i = 0; i < 10; i++) {
      this.lineOne[i].position.set(100, 30 + i * 70);
      this.scene.addChild(this.lineOne[i]);
      this.lineTwo[i].position.set(200, 30 + i * 70);
      this.scene.addChild(this.lineTwo[i]);
      this.lineThree[i].position.set(300, 30 + i * 70);
      this.scene.addChild(this.lineThree[i]);
      this.lineFour[i].position.set(400, 30 + i * 70);
      this.scene.addChild(this.lineFour[i]);
      this.lineFive[i].position.set(500, 30 + i * 70);
      this.scene.addChild(this.lineFive[i]);
    }

    const time = 1;
    gsap.to(this.lineFive, {
      y: 600, duration: time, repeat: -1, yoyo: true,
    });

    gsap.to(this.lineFour, {
      y: 600, duration: time + 0.2, repeat: -1, yoyo: true,
    });
    gsap.to(this.lineThree, {
      y: 600, duration: time + 0.4, repeat: -1, yoyo: true,
    });
    gsap.to(this.lineTwo, {
      y: 600, duration: time + 0.6, repeat: -1, yoyo: true,
    });
    gsap.to(this.lineOne, {
      y: 600, duration: time + 0.8, repeat: -1, yoyo: true,
    });
    //this.lineOne[5].visible = false;
  } 
}

class Reel extends slotReelGame {
  constructor() {
    super();
    this.arr = [];
    this.randomFill();
  }

  randomFill() {
    // Загрузка текстур
    this.sheetID = loader.resources['./assets/images/spritesheet.json'].spritesheet;

    let a = [...Array(10).keys()];
    for(let i = 0; i < 10; i++) {
         //Случайно выбираем индекс из оставшихся в массиве индексов
        let index = Math.floor(Math.random() * a.length);
        //Определяем число
        this.arr[i] = new Sprite(this.sheetID.textures[`${a[index]}.png`]);
        this.arr[i].anchor.set(0.5);
        this.arr[i].scale.set(0.4);
        //Отбрасываем использованный индекс
        a.splice(index,1);  
    }
  }
}