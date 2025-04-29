import { App } from './core/App';
import { SceneManager } from './core/SceneManager';
import { MenuScene } from './scenes/MenuScene';

(async () => {
    await App.init();
    await App.preload();
    SceneManager.changeScene(new MenuScene());
})();