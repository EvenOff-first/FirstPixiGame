import { Container } from "pixi.js";
import { App } from "./App";

export class SceneManager {
    private static currentScene: Container;

    public static changeScene(newScene: Container): void {
        if (SceneManager.currentScene) {
            SceneManager.currentScene.destroy({ children: true, texture: true, });
            App.app.stage.removeChild(SceneManager.currentScene);
        }

        SceneManager.currentScene = newScene;
        App.app.stage.addChild(SceneManager.currentScene);
    }
}