import { Sprite, Text, TextStyle, Texture } from "pixi.js";
import { SceneManager } from "../core/SceneManager";
import { GameScene } from "./GameScene";
import { BaseScene } from "./BaseScene";
import { sound } from '@pixi/sound';

export class MenuScene extends BaseScene {
    constructor() {
        super(0x81ecec);
        const style = new TextStyle({
            fill: 'white',
            fontFamily: 'Arial',
            fontSize: '50px'
        })
        const startText = new Text({
            text: 'START GAME',
            style,
        });

        startText.eventMode = 'dynamic';
        startText.anchor.set(0.5);
        startText.interactive = true;
        startText.cursor = 'pointer';
        startText.x = window.innerWidth / 2;
        startText.y = window.innerHeight / 2;

        startText.on('pointerdown', () => {
            SceneManager.changeScene(new GameScene(1))
            sound.stop('menu-sound');
        });

        const texture = Texture.from(`bg-main-menu`);
        const background = new Sprite(texture);
        background.width = window.innerWidth;
        background.height = window.innerHeight;
        this.addChildAt(background, 0);

        this.addChild(startText);

        this.backgroundSound();
    }

    backgroundSound() {
        sound.play('menu-sound', {
            loop: true
        });
    }
}
