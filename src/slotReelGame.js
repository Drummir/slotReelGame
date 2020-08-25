import * as PIXI from 'pixi.js';
// import { Application } from '@pixi/app'
//import UI from './UI'; Пока что под вопросом будет это или нетnp

let Sprite    = PIXI.Sprite,
    loader    = PIXI.Loader.shared,
    Textures  = PIXI.Textures;

export default class slotReelGame {

  constructor() {
    if(!document.body) {
      throw new Error('window is not ready');
    };
  }

  setup() {
    this.app = new PIXI.Application({
      width: 800,
      height: 640,
      backgroundColor: 0x1099bb,
    });
    document.body.appendChild(this.app.view);

    // Загрузка текстур
    this.textures = loader.resources['images/spritesheet.json'].textrures; 

    this.configureLineNumbers();

    const container = new PIXI.Container();
    container.addChild(this.numberOfReel); // Добавление спрайтов
  
    container.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
    this.app.stage.addChild(container);
  }

  configureLineNumbers() { // Создание спрайтов
    for (let i = 0; i <= 9; i++) {
      const sprite = new Sprite(this.textures[`${i}.png`]);
      sprite.anchor.set(0.5);
      sprite.scale.set(0.5);
      this.numberOfReel[i] = sprite;
    }
  };

    // this.state = this.play;
    // this.app.ticker.add((delta) => this.gameLoop(delta));
}

loader 
  .add("images/spritesheet.json")
  .load(setup);