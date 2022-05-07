import Phaser from 'phaser';

import Theme from 'Theme';

export default class Panel extends Phaser.GameObjects.Container {
    constructor(scene, x, y, params) {
        super(scene, x, y);

        this.setSize(params.size+params.padding, params.size+params.padding);

        this._rect = scene.add.rectangle(0, 0, params.size, params.size);
        this.add(this._rect);

        this._text = scene.add.text(0, 0, params.number.toString(10))
            .setOrigin(0.5)
            .setFontFamily('Arial, "sans-serif"')
            .setFontSize(0.6 * params.size);
        this.add(this._text);

        this._number = params.number;

        this.tint(false);
    }

    get number() { return this._number; }
    get col() { return this._col; }
    set col(val) { this._col = val; }
    get row() { return this._row; }
    set row(val) { this._row = val; }

    tint(on) {
        const c1 = Theme.MAIN_DARK;
        const c2 = on ? Theme.PANEL_TINT : Theme.PANEL_NORMAL;

        this._rect.setFillStyle(c2);
        this._rect.setStrokeStyle(10, c2);
        this._text.setFill(`#${c1.toString(16)}`);
    }
}
