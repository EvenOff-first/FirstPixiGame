import { Container, Text, Graphics } from 'pixi.js';
import { GameButton } from '../components/button';
import { Modal } from '../components/modal';
import { sound } from '@pixi/sound';

export class PauseMenu extends Container {
    private modal: Modal;

    constructor(onRetry: () => void, unPause: () => void, onExit: () => void) {
        super();

        this.modal = new Modal();

        const background = new Graphics()
            .fill(0x000000)
            .rect(0, 0, window.innerWidth, window.innerHeight);
        this.addChild(background);

        const title = new Text({
            text: 'Pause',
            style: { fontSize: 48, fill: 0xffffff, align: 'center' },
        });

        const resumeButton = new GameButton({
            label: 'Continue',
            onClick: () => {
                unPause();
                sound.stop('pause-sound');
                sound.play('level-sound');
            }
        });

        const restartButton = new GameButton({
            label: 'Restart',
            onClick: onRetry
        });

        const exitButton = new GameButton({
            label: 'Exit',
            onClick: onExit
        });

        this.modal.addContent(title)
        this.modal.addContent(resumeButton)
        this.modal.addContent(restartButton)
        this.modal.addContent(exitButton)

        this.addChild(this.modal);
    }

    public togglePause() {
        this.modal.toggleState()
    }
}
