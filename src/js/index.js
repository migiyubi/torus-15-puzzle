import 'main.css';

import Phaser from 'phaser';

import SceneMenu from './scene/SceneMenu';
import SceneGame from './scene/SceneGame';

class Game extends Phaser.Game {
    constructor() {
        super({
            type: Phaser.AUTO,
            width: 1080,
            height: 1920,
            backgroundColor: '#111111',
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            scene: [
                SceneMenu,
                SceneGame
            ]
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
