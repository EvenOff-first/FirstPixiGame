import { AnimatedSprite, Point, Rectangle, Texture } from 'pixi.js';
import { sound } from '@pixi/sound';
import { Ticker } from 'pixi.js';

export class Enemy extends AnimatedSprite {
    private _isDead = false;
    private _isMoving = false;
    private _isPaused = false;
    private speed = 2;
    private target: Point = new Point(0, 0);
    private stopDuration = 500;
    private currentStopTime = 0;
    private movementArea: Rectangle;

    constructor(movementArea: Rectangle) {
        const idleFrames = Enemy.getIdleFrames();
        super(idleFrames);
        this.anchor.set(0.5);
        this.animationSpeed = 0.2;
        this.loop = true;
        this.interactive = true;
        this.cursor = 'pointer';
        this.movementArea = movementArea;

        this.on('pointerdown', () => this.die());
        this.play();

        // Delay movement start randomly to simulate delayed activation
        setTimeout(() => {
            this.chooseRandomTarget();
            Ticker.shared.add(this.updateMovement, this);
        }, Math.random() * 1000);
    }
    // Choose a random target point for the enemy to move towards
    private chooseRandomTarget() {
        const padding = 20;
        const randomX = this.movementArea.x + padding + Math.random() * (this.movementArea.width - padding * 2);
        const randomY = this.movementArea.y + padding + Math.random() * (this.movementArea.height - padding * 2);
        this.target.set(randomX, randomY);
    }

    private startMovement() {
        Ticker.shared.start();
    }

    private stopMovement() {
        Ticker.shared.stop();
    }

    // Update movement on each ticker frame
    private updateMovement(ticker: Ticker) {
        if (this._isDead || this._isPaused) return;

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = this.calculateDistance(this.x, this.y, this.target.x, this.target.y);

        if (distance < 10) {
            // Stop and pause for a while before moving to a new target
            if (this.currentStopTime <= 0) {
                this.isMoving = false;
                this.currentStopTime = this.stopDuration;
                this.chooseRandomTarget();
            } else {
                this.isMoving = false;
                this.currentStopTime -= ticker.deltaTime;
            }
            return;
        }

        this.isMoving = true;

        const length = Math.sqrt(dx * dx + dy * dy);
        const normX = dx / length;
        const normY = dy / length;
        // Move enemy towards target
        this.x += normX * this.speed * ticker.deltaTime;
        this.y += normY * this.speed * ticker.deltaTime;

        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;

        this.x = Math.max(this.movementArea.x + halfWidth, Math.min(this.movementArea.x + this.movementArea.width - halfWidth, this.x));
        this.y = Math.max(this.movementArea.y + halfHeight, Math.min(this.movementArea.y + this.movementArea.height - halfHeight, this.y));

        // Flip sprite horizontally based on movement direction
        this.scale.x = normX < 0 ? -1 : 1;
    }
    // Calculate distance between two points
    private calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    // Return walking animation frames
    private static getWalkingFrames(): Texture[] {
        return Enemy.createFramesFromStrip('knight-run', 8);
    }
    // Return idle animation frames
    private static getIdleFrames(): Texture[] {
        return Enemy.createFramesFromStrip('knight-idle', 15);
    }
    // Return death animation frames
    private getDeathFrames(): Texture[] {
        return Enemy.createFramesFromStrip('knight-death', 15);
    }
    // Switch between idle and walking animations
    private setEnemyMovingAnimation() {
        if (this._isMoving) {
            if (this.textures !== Enemy.getWalkingFrames()) {
                this.textures = Enemy.getWalkingFrames();
                this.play();
            }
        } else {
            if (this.textures !== Enemy.getIdleFrames()) {
                this.textures = Enemy.getIdleFrames();
                this.play();
            }
        }
    }
    // Trigger death animation and sound
    public die() {
        if (this._isDead) return;
        this._isDead = true;

        this.interactive = false;
        this.cursor = 'default';
        this.removeAllListeners('pointerdown');

        this.playDeathAnimation();
        this.playDeathSound();
    }

    public pause() {
        this._isPaused = true;
        this.eventMode = 'none';
        this.interactive = false;
        this.stopMovement();
    }

    public resume() {
        this._isPaused = false;
        this.eventMode = 'dynamic';
        this.interactive = true;
        this.startMovement();
    }
    // Play death animation then destroy enemy
    private playDeathAnimation() {
        this.textures = this.getDeathFrames();
        this.loop = false;
        this.animationSpeed = 0.2;
        this.play();
        this.onComplete = () => this.destroy();
    }
    // Play death sound effect
    private playDeathSound() {
        sound.play('enemy-death');
    }
    // Helper function to generate frames from sprite sheet
    private static createFramesFromStrip(textureName: string, frameCount: number): Texture[] {
        const texture = Texture.from(textureName);
        const frameWidth = texture.width / frameCount;
        const frameHeight = texture.height;
        const frames: Texture[] = [];

        for (let i = 0; i < frameCount; i++) {
            const frame = new Texture({
                source: texture.source,
                frame: new Rectangle(i * frameWidth, 0, frameWidth, frameHeight),
            });
            frames.push(frame);
        }

        return frames;
    }
    // Getter and setter to control animation when moving status changes
    get isMoving(): boolean {
        return this._isMoving;
    }

    set isMoving(value: boolean) {
        if (this._isMoving !== value) {
            this._isMoving = value;
            this.setEnemyMovingAnimation();
        }
    }

    get isDead(): boolean {
        return this._isDead;
    }
}
