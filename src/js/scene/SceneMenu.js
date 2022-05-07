import Phaser from 'phaser';

import Theme from 'Theme';
import TextButton from 'scene/object/TextButton';

export default class SceneMenu extends Phaser.Scene {
    constructor() {
        super('menu');
    }

    create() {
        const cw = 0.5 * this.sys.game.config.width;
        const ch = 0.5 * this.sys.game.config.height;

        const title = this.add.text(cw, 375, 'Torus 15 Puzzle')
            .setOrigin(0.5)
            .setFontFamily('Arial, "sans-serif"')
            .setFontSize(100)
            .setFill('#52ab98');

        const button3by3 = new TextButton(this, cw, ch-120, '3x3', 330, 110, 60);
        button3by3.setOnClick(() => { this._onClickButton(3); });
        this.add.existing(button3by3);

        const button4by4 = new TextButton(this, cw, ch+60, '4x4', 330, 110, 60);
        button4by4.setOnClick(() => { this._onClickButton(4); });
        this.add.existing(button4by4);
        
        const button5by5 = new TextButton(this, cw, ch+240, '5x5', 330, 110, 60);
        button5by5.setOnClick(() => { this._onClickButton(5); });
        this.add.existing(button5by5);
        
        const button6by6 = new TextButton(this, cw, ch+420, '6x6', 330, 110, 60);
        button6by6.setOnClick(() => { this._onClickButton(6); });
        this.add.existing(button6by6);
    }

    _onClickButton(size) {
        this.scene.start('game', {
            cols: size,
            rows: size
        });
    }
}
