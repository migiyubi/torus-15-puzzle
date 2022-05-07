import Phaser from 'phaser';

import Theme from 'Theme';

export default class TextButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, text, width, height, fontSize) {
        super(scene, x, y);

        this.setSize(width, height);

        this._rect = scene.add.rectangle(0, 0, width, height);
        this._rect.setStrokeStyle(5, Theme.MAIN_LIGHT);
        this._rect.setFillStyle(Theme.MAIN_DARK);
        this.add(this._rect);

        this._text = scene.add.text(0, 0, text)
            .setOrigin(0.5)
            .setFontFamily('Arial, "sans-serif"')
            .setFontSize(fontSize)
            .setFill(`#${Theme.MAIN_LIGHT.toString(16)}`);
        this.add(this._text);

        this.setInteractive();
    }

    setOnClick(listener) {
        this.on('pointerdown', listener);
    }
}
