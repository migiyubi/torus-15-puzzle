import Phaser from 'phaser';

import Theme from 'Theme';
import DragManager from 'scene/DragManager';
import PanelManager from 'scene/PanelManager';
import TextButton from 'scene/object/TextButton';

export default class SceneGame extends Phaser.Scene {
    constructor() {
        super('game');
    }

    init(data) {
        this._cols = data.cols;
        this._rows = data.rows;
    }

    create() {
        const w = this.sys.game.config.width;
        const h = this.sys.game.config.height;

        this._textInst = this.add.text(0.5*w, h-370, `Swipe any row/column to order tiles from 1 to ${this._cols*this._rows}.`)
            .setOrigin(0.5)
            .setFontFamily('Arial, "sans-serif"')
            .setFontSize(40)
            .setFill(`#${Theme.MAIN_LIGHT.toString(16)}`);

        this._textComplete = this.add.text(0.5*w, 300, 'COMPLETE')
            .setOrigin(0.5)
            .setFontFamily('Arial, "sans-serif"')
            .setFontSize(120)
            .setFill(`#${Theme.PANEL_TINT.toString(16)}`);

        this._buttonBack = new TextButton(this, 0.28*w, h-200, 'BACK', 330, 110, 60);
        this._buttonBack.setOnClick(this._onClickBack.bind(this));
        this.add.existing(this._buttonBack);
    
        this._buttonReset = new TextButton(this, 0.72*w, h-200, 'RESET', 330, 110, 60);
        this._buttonReset.setOnClick(this._onClickReset.bind(this));
        this.add.existing(this._buttonReset);

        this._panelManager = new PanelManager(this, w, h, this._cols, this._rows);

        this._dragManager = new DragManager(this);
        this._dragManager.setOnDragStartCallback(this.onDragStart.bind(this));
        this._dragManager.setOnDragCallback(this.onDrag.bind(this));
        this._dragManager.setOnDragEndCallback(this.onDragEnd.bind(this));

        this.reset();
    }

    reset() {
        this._textComplete.setVisible(false);

        this._panelManager.tint(false);
        this._panelManager.enabled = true;
        this._panelManager.reset();
        this._panelManager.shuffle();
    }

    onDragStart(object) {
        this._panelManager.dragStart(object);
    }

    onDrag(object, horizontal, delta) {
        this._panelManager.drag(object, horizontal, delta);
    }

    onDragEnd(object) {
        this._panelManager.dragEnd(object);

        const complete = this._panelManager.isComplete();

        if (complete) {
            this._panelManager.enabled = false;
            this._panelManager.tint(true);

            this._textComplete.setVisible(true);
        }
    }

    _onClickReset() {
        this.reset();
    }

    _onClickBack() {
        this.scene.start('menu');
    }
}
