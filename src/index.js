import * as PIXI from 'pixi.js';
import slotReelGame from './slotReelGame.js';

window.onload = () => {
    const game = new slotReelGame();
    game.init();
}