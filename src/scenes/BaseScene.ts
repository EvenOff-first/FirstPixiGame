
import { Container } from 'pixi.js';
import { App } from '../core/App';
import { sound } from '@pixi/sound';

export class BaseScene extends Container {
    constructor(backgroundColor: number = 0x1e2a38) {
        super();
        App.app.renderer.background.color = backgroundColor;
        sound.volume('menu-sound', 0.05);
        sound.volume('level-sound', 0.01);
        sound.volume('pause-sound', 0.01);
        sound.volume('enemy-death', 0.15);
        sound.volume('game-over-sound', 0.01);
        sound.volume('victory-sound', 0.01);
    }
}