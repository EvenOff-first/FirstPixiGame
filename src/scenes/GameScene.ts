import { Container, Graphics, Rectangle, Sprite, Texture, Ticker } from 'pixi.js';
import { sound } from '@pixi/sound';
import levels from '../config/levels.json';
import { ILevel } from '../types/game.types';
import { BaseScene } from './BaseScene';
import { Enemy } from '../game/entities/Enemy';
import { VictoryMenu } from '../game/systems/VictoryMenu';
import { DefeatMenu } from '../game/systems/DefeatMenu';
import { SceneManager } from '../core/SceneManager';
import { MenuScene } from './MenuScene';
import { Header } from '../game/components/header';
import { PauseMenu } from '../game/systems/PauseMenu';

export class GameScene extends BaseScene {
    private levelData: ILevel;
    private enemies: Sprite[] = [];
    private timeLeft: number;
    private timerInterval!: ReturnType<typeof setInterval>;
    private destroyedEnemies: number = 0;
    private isGameOver: boolean = false;
    private isPaused = false;
    private header!: Header;
    private enemyContainer: Container;
    private movementBounds: Rectangle;
    private pauseMenu: PauseMenu;
    private defeatMenu: DefeatMenu;
    private victoryMenu: VictoryMenu;

    private readonly horizontalPadding = 50;
    private readonly verticalPadding = 50;
    private readonly topOffset = 140;

    constructor(levelId: number) {
        super(0x1e2a38);
        this.levelData = levels.find(l => l.id === levelId)!;
        this.timeLeft = this.levelData.timeLimit;

        this.pauseMenu = new PauseMenu(
            () => this.replayLevel(),
            () => this.togglePause(),
            () => this.exitToMenu()
        );

        this.defeatMenu = new DefeatMenu(
            () => this.replayLevel(),
            () => this.exitToMenu()
        );

        this.victoryMenu = new VictoryMenu(
            {
                onNextLevel: () => this.goToNextLevel(),
                onReplay: () => this.replayLevel(),
                onExit: () => this.exitToMenu(),
            }
        );
        this.enemyContainer = new Container();
        this.addChild(this.enemyContainer);

        const movementArea = new Graphics();
        const areaWidth = window.innerWidth - this.horizontalPadding * 2;
        const areaHeight = window.innerHeight - this.topOffset - this.verticalPadding * 2;

        movementArea.fill(0x000000);
        movementArea.rect(0, 0, areaWidth, areaHeight);

        this.enemyContainer.addChild(movementArea);

        this.movementBounds = new Rectangle(
            this.horizontalPadding,
            this.topOffset + this.verticalPadding,
            areaWidth,
            areaHeight
        );

        this.enemyContainer.position.set(
            this.movementBounds.x,
            this.movementBounds.y
        );

        this.loadBackground(this.levelData.location);
        this.createHeader();
        this.backgroundSound();
        this.createEnemies();
        this.startTimer();
        this.addEscKeyListener();
    }

    private loadBackground(name: string) {
        const texture = Texture.from(`bg-${name}`);
        const background = new Sprite(texture);
        background.width = window.innerWidth;
        background.height = window.innerHeight;
        this.addChildAt(background, 0);
    }

    private createHeader() {
        this.header = new Header({
            onPauseClick: () => {
                this.togglePause();
            },
            onBoosterClick: () => {
                const bonus = Math.floor(this.levelData.timeLimit / 3);
                this.timeLeft += bonus;
                this.header.updateTime(this.timeLeft);
            },
            levelTime: this.levelData.timeLimit
        });
        this.header.updateTime(this.timeLeft);
        this.addChild(this.header);

    }

    private createEnemies() {
        console.log('Movement bounds:', this.movementBounds);

        for (const enemyData of this.levelData.enemies) {
            const enemy = new Enemy(this.movementBounds);

            const maxX = this.movementBounds.width - enemy.width;
            const maxY = this.movementBounds.height - enemy.height;

            enemy.x = Math.min(Math.max(enemyData.x, 0), maxX);
            enemy.y = Math.min(Math.max(enemyData.y, 0), maxY);

            enemy.on('pointerdown', () => {
                enemy.die();
                this.incrementDestroyedEnemies();
            });

            this.enemyContainer.addChild(enemy);
            this.enemies.push(enemy);
        }
    }

    private startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.isGameOver || this.isPaused) return;

            this.timeLeft--;
            this.header.updateTime(this.timeLeft);

            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                this.isGameOver = true;
                this.showDefeatMenu();
            }

            if (this.destroyedEnemies === this.levelData.enemies.length) {
                this.isGameOver = true;
                clearInterval(this.timerInterval);
                this.showVictoryMenu();
            }
        }, 1000);
    }

    private incrementDestroyedEnemies() {
        this.destroyedEnemies++;
        this.header.updateDestroyedEnemies(this.destroyedEnemies);
    }

    private togglePause() {
        this.isPaused = !this.isPaused;

        if (this.isPaused) {
            Ticker.shared.stop();
            clearInterval(this.timerInterval);
            this.pauseMenu.togglePause();
            sound.stop('level-sound');
            sound.play('pause-sound');
            this.addChild(this.pauseMenu);
            this.enemies.forEach(enemy => (enemy as Enemy).pause());
        } else {
            Ticker.shared.start();
            this.startTimer();
            this.pauseMenu.togglePause();
            this.enemies.forEach(enemy => (enemy as Enemy).resume());
        }
    }

    private addEscKeyListener() {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.togglePause();
            }
        });
    }

    private showVictoryMenu() {
        const stars = this.calculateStars();
        this.victoryMenu.updateStars(stars);
        this.victoryMenu.toggleOpen();
        this.addChild(this.victoryMenu);
    }

    private showDefeatMenu() {
        this.defeatMenu.toggleOpen();
        Ticker.shared.stop();
        this.enemies.forEach(enemy => (enemy as Enemy).pause());
        this.addChild(this.defeatMenu);
    }

    private backgroundSound() {
        sound.play('level-sound', {
            loop: true
        });
    }


    private goToNextLevel() {
        const nextLevelId = this.levelData.id + 1;
        const nextLevel = levels.find(l => l.id === nextLevelId);

        if (nextLevel) {
            sound.stopAll();
            SceneManager.changeScene(new GameScene(nextLevelId));
        } else {
            this.exitToMenu();
        }
    }

    private replayLevel() {
        sound.stopAll();
        SceneManager.changeScene(new GameScene(this.levelData.id));
    }

    private exitToMenu() {
        sound.stopAll();
        sound.volumeAll = 1;
        SceneManager.changeScene(new MenuScene());
    }

    private calculateStars(): number {
        const fullTime = this.levelData.timeLimit;
        const timeUsed = fullTime - this.timeLeft;
        const timeEfficiency = timeUsed / fullTime;

        if (timeEfficiency <= 0.5) {
            return 3;
        } else if (timeEfficiency <= 0.8) {
            return 2;
        } else {
            return 1;
        }
    }
}
