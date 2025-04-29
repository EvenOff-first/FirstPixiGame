import { Application, Assets } from "pixi.js";

export class App {
    public static app: Application;

    static async init(): Promise<void> {
        App.app = new Application();
        (globalThis as any).__PIXI_APP__ = App.app;
        await App.app.init({
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            antialias: true,
            resizeTo: window,
            background: '#1099bb',
        });

        document.body.appendChild(App.app.canvas);
    }

    static async preload(): Promise<void> {
        await Assets.load([
            {
                alias: 'enemy-death',
                src: '/assets/sounds/enemy-death.mp3'
            },
            {
                alias: 'menu-sound',
                src: '/assets/sounds/menu-bg-sound.mp3'
            },
            {
                alias: 'level-sound',
                src: '/assets/sounds/level-sound.ogg'
            },
            {
                alias: 'game-over-sound',
                src: '/assets/sounds/game-over-sound.ogg'
            },
            {
                alias: 'victory-sound',
                src: '/assets/sounds/victory-sound.ogg'
            },
            {
                alias: 'pause-sound',
                src: '/assets/sounds/pause-sound.ogg'
            },
            {
                alias: 'knight-idle',
                src: '/assets/images/knight-idle.png',
            },
            {
                alias: 'knight-death',
                src: '/assets/images/knight-death.png',
            },
            {
                alias: 'knight-run',
                src: '/assets/images/knight-run.png',
            },
            {
                alias: 'bg-castle-1',
                src: '/assets/images/bg-castle-1.jpg',
            },
            {
                alias: 'bg-castle-2',
                src: '/assets/images/bg-castle-2.jpg',
            },
            {
                alias: 'bg-village',
                src: '/assets/images/bg-village.jpg',
            },
            {
                alias: 'bg-main-menu',
                src: '/assets/images/bg-main-menu.jpg',
            },
            {
                alias: 'pause-icon',
                src: '/assets/images/pause-icon.svg'
            },
            {
                alias: 'full-star',
                src: '/assets/images/full-star.png'
            },
            {
                alias: 'empty-star',
                src: '/assets/images/empty-star.png'
            },
            {
                alias: 'sound-on-icon',
                src: '/assets/images/sound-on-icon.png'
            },
            {
                alias: 'sound-off-icon',
                src: '/assets/images/sound-off-icon.png'
            },
            {
                alias: 'booster-icon',
                src: '/assets/images/booster-icon.png'
            },
        ])
    }
}