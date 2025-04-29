import { Container, Graphics, Text, TextStyle } from 'pixi.js';

interface GameButtonOptions {
    label: string;
    width?: number;
    height?: number;
    onClick: () => void;
    fillColor?: number;
    textColor?: number;
}

export class GameButton extends Container {
    constructor({
        label,
        width = 200,
        height = 50,
        onClick,
        fillColor = 0x3a3a3c,
        textColor = 0xffffff
    }: GameButtonOptions) {
        super();

        const background = new Graphics()
            .fill(fillColor)
            .rect(0, 0, width, height)

        const text = new Text({
            text: label,
            style: new TextStyle({
                fill: textColor,
                fontSize: 20,
                fontWeight: 'bold',
            }),
        });

        this.addChild(background, text);

        this.eventMode = 'static';
        this.cursor = 'pointer';
        this.on('pointertap', onClick);
    }
}
