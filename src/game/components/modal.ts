import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import { gsap } from 'gsap';

export class Modal extends Container {
    private background: Sprite;
    private maskShape: Graphics;
    private contentContainer: Container;
    private widthSize: number;
    private heightSize: number;
    private padding: number = 20;
    private spacing: number = 10;
    private contentY: number = 0;

    constructor(width: number = 400, height: number = 400) {
        super();
        this.visible = false;
        this.widthSize = width;
        this.heightSize = height;

        const bgTexture = Texture.WHITE;
        this.background = new Sprite(bgTexture);
        this.background.tint = 0xe5e6ff;
        this.background.alpha = 0.5;
        this.background.width = this.widthSize;
        this.background.height = this.heightSize;
        this.addChild(this.background);

        this.maskShape = new Graphics();
        this.updateMask();
        this.addChild(this.maskShape);
        this.mask = this.maskShape;

        this.contentContainer = new Container();
        this.addChild(this.contentContainer);

        this.position.set(
            window.innerWidth / 2 - this.widthSize / 2,
            window.innerHeight / 2 - this.heightSize / 2
        );
    }

    private updateMask() {
        this.maskShape.clear();
        this.maskShape.roundRect(0, 0, this.widthSize, this.heightSize, 20);
        this.maskShape.fill({ color: 0xffffff });
    }


    public addContent(child: Container) {
        const bounds = child.getLocalBounds();

        child.x = (this.widthSize - bounds.width) / 2;
        child.y = this.padding + this.contentY;

        this.contentContainer.addChild(child);
        this.contentY += bounds.height + this.spacing;

        const newHeight = this.contentY + this.padding;
        if (newHeight > this.heightSize) {
            this.heightSize = newHeight;
            this.background.height = this.heightSize;
            this.updateMask();
        }
    }

    public toggleState() {
        this.visible = !this.visible;
        if (this.visible) {
            this.alpha = 0;
            gsap.to(this, { alpha: 1, duration: 0.3, ease: 'easeOut' });
        } else {
            gsap.to(this, {
                alpha: 0, duration: 0.3, ease: 'easeIn', onComplete: () => {
                    this.visible = false;
                }
            });
        }
    }
}
