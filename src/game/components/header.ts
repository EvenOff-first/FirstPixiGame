import { sound } from '@pixi/sound';
import { Container, Text, Sprite, Texture } from 'pixi.js';

interface IHeaderOptions {
    onPauseClick: () => void;
    onBoosterClick: () => void;
    levelTime: number;
}

export class Header extends Container {
    private _timeLeft: number = 0;
    private _destroyedEnemies: number = 0;
    private timerText: Text;
    private destroyedEnemiesText: Text;
    private pauseButton: Sprite;
    private soundToggleButton: Sprite;
    private isSoundEnabled = true;
    private boosterButton: Sprite;
    private boosterUsed = false;
    private levelTime: number;

    constructor(options: IHeaderOptions) {
        super();

        this.levelTime = options.levelTime;

        const bg = new Sprite(Texture.WHITE);
        bg.tint = 0x1e2a38;
        bg.alpha = 0.8;
        bg.width = window.innerWidth;
        bg.height = 70;
        this.addChild(bg);

        this.timerText = new Text({
            text: this._timeLeft,
            style: {
                fontSize: 24,
                fill: 0xffffff,
            },
        });
        this.destroyedEnemiesText = new Text({
            text: `Enemies: ${this._destroyedEnemies}`,
            style: {
                fontSize: 24,
                fill: 0xffffff,
            },
        });

        this.pauseButton = new Sprite(Texture.from('pause-icon'));

        this.pauseButton.width = 32;
        this.pauseButton.height = 32;
        this.pauseButton.eventMode = 'static';
        this.pauseButton.cursor = 'pointer';
        this.pauseButton.on('pointerdown', options.onPauseClick);

        this.soundToggleButton = new Sprite(Texture.from('sound-on-icon'));
        this.soundToggleButton.width = 32;
        this.soundToggleButton.height = 32;
        this.soundToggleButton.eventMode = 'static';
        this.soundToggleButton.cursor = 'pointer';
        this.soundToggleButton.on('pointerdown', () => this.toggleSound());

        this.boosterButton = new Sprite(Texture.from('booster-icon'));
        this.boosterButton.width = 32;
        this.boosterButton.height = 32;
        this.boosterButton.eventMode = 'static';
        this.boosterButton.cursor = 'pointer';
        this.boosterButton.on('pointerdown', () => {
            if (!this.boosterUsed) {
                this.boosterUsed = true;
                this.boosterButton.alpha = 0.3;
                options.onBoosterClick();
            }
        });

        this.addChild(this.timerText, this.destroyedEnemiesText, this.pauseButton, this.soundToggleButton, this.boosterButton);

        this.layout();
    }

    private layout() {
        const padding = 20;
        const buttonSpacing = 10;

        this.timerText.anchor.set(0, 0);
        this.timerText.position.set(padding, padding);

        this.destroyedEnemiesText.anchor.set(0.5, 0);
        this.destroyedEnemiesText.position.set(window.innerWidth / 2, padding);

        this.pauseButton.anchor.set(1, 0);
        this.pauseButton.position.set(window.innerWidth - padding, padding);

        this.soundToggleButton.anchor.set(1, 0);
        this.soundToggleButton.position.set(window.innerWidth - padding - this.pauseButton.width - buttonSpacing, padding);

        this.boosterButton.position.set(this.soundToggleButton.x - this.soundToggleButton.width - buttonSpacing, padding);
        this.boosterButton.anchor.set(1, 0);
    }

    private toggleSound() {
        this.isSoundEnabled = !this.isSoundEnabled;
        sound.volumeAll = this.isSoundEnabled ? 1 : 0;
        const icon = this.isSoundEnabled ? 'sound-on-icon' : 'sound-off-icon';
        this.soundToggleButton.texture = Texture.from(icon);
    }

    set timeLeft(value: number) {
        this._timeLeft = value;
        this.timerText.text = `Time: ${this._timeLeft}`;
    }

    get timeLeft(): number {
        return this._timeLeft;
    }

    set destroyedEnemies(value: number) {
        this._destroyedEnemies = value;
        this.destroyedEnemiesText.text = `Enemies: ${this._destroyedEnemies}`;
    }

    get destroyedEnemies(): number {
        return this._destroyedEnemies;
    }

    public updateTime(timeLeft: number) {
        this.timeLeft = timeLeft;
    }

    public updateDestroyedEnemies(destroyedEnemies: number) {
        this.destroyedEnemies = destroyedEnemies;
    }
}
