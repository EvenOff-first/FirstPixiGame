import { sound } from '@pixi/sound';
import { Container, Text, Sprite, Texture } from 'pixi.js';
import { GameButton } from '../components/button';
import { Modal } from '../components/modal';
import { gsap } from 'gsap';

interface IVictoryMenuOptions {
    onNextLevel: () => void;
    onReplay: () => void;
    onExit: () => void;
}

export class VictoryMenu extends Container {
    private modal: Modal;

    constructor({ onNextLevel, onExit, onReplay }: IVictoryMenuOptions) {
        super();
        this.modal = new Modal();

        const title = new Text({
            text: 'Victory!',
            style: { fontSize: 48, fill: 0xffffff, align: "center" },
        });

        this.modal.addContent(title)
        this.modal.addContent(new GameButton({ label: 'Next Level', onClick: onNextLevel, textColor: 0x000000 }));
        this.modal.addContent(new GameButton({ label: 'Replay', onClick: onReplay, textColor: 0x000000 }))
        this.modal.addContent(new GameButton({ label: 'Exit to Menu', onClick: onExit, textColor: 0x000000 }))

        this.addChild(this.modal);
    }

    public toggleOpen() {
        this.modal.toggleState();
        sound.stop('level-sound');
        sound.play('victory-sound');
    }

    private createStars(stars: number) {
        const totalStars = 3;
        const starSpacing = 80;
        const starSize = 50;
        const container = new Container();

        for (let i = 0; i < totalStars; i++) {
            const texture = Texture.from(i < stars ? 'full-star' : 'empty-star');
            const star = new Sprite(texture);
            star.anchor.set(0.5);

            const baseScale = starSize / Math.max(texture.width, texture.height);

            star.scale.set(0);

            star.x = i * starSpacing;
            container.addChild(star);

            gsap.to(star.scale, {
                x: baseScale,
                y: baseScale,
                duration: 0.5,
                delay: i * 0.3,
                ease: 'bounce.out'
            });
        }

        container.pivot.set(container.width / 2, 0);
        container.x = window.innerWidth / 2;
        container.y = window.innerHeight / 2 + 150;

        this.addChild(container);
    }

    public updateStars(stars: number) {
        this.createStars(stars);
    }
}
