import { sound } from '@pixi/sound';
import { Container, Text, Graphics } from 'pixi.js';
import { GameButton } from '../components/button';
import { Modal } from '../components/modal';

export class DefeatMenu extends Container {
    private modal: Modal;

    constructor(onRetry: () => void, onExit: () => void) {
        super();

        this.modal = new Modal();

        const background = new Graphics()
            .fill(0x000000)
            .rect(0, 0, window.innerWidth, window.innerHeight);
        this.addChild(background);

        const title = new Text({
            text: 'Defeat!',
            style: { fontSize: 48, fill: 0xffffff, align: 'center' },
        });

        const tryAgain = new GameButton({
            label: 'Try Again',
            onClick: onRetry,
        });

        const menuBtn = new GameButton({
            label: 'Exit to Menu',
            onClick: onExit,
        });

        this.modal.addContent(title)
        this.modal.addContent(tryAgain)
        this.modal.addContent(menuBtn)

        this.addChild(this.modal);
    }

    public toggleOpen() {
        this.modal.toggleState();
        sound.stop('level-sound');
        sound.play('game-over-sound');
    }
}
