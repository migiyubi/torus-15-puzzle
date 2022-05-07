import Panel from 'scene/object/Panel';

export default class PanelManager {
    constructor(scene, sceneWidth, sceneHeight, cols, rows) {
        this._scene = scene;
        this._cols = cols;
        this._rows = rows;

        this._margin = 30;
        this._innerPanelSize = (sceneWidth - (this._cols+1) * this._margin) / this._cols;
        this._panelSize = this._innerPanelSize + this._margin;
        this._x0 = 0.5 * (this._margin + this._panelSize);
        this._y0 = 0.5 * (sceneHeight - (this._rows-1) * this._panelSize);

        this._wrapH = this._panelSize * this._cols;
        this._wrapV = this._panelSize * this._rows;
        this._limitL = this._x0 - 0.5 * this._panelSize;
        this._limitR = this._limitL + this._wrapH;
        this._limitU = this._y0 - 0.5 * this._panelSize;
        this._limitB = this._limitU + this._wrapV;

        this._panels = [];

        const panelParams = {
            number: 0,
            size: this._innerPanelSize,
            padding: this._margin
        };

        for (let i = 0; i < this._rows * this._cols; i++) {
            panelParams.number = i + 1;

            const panel = new Panel(this._scene, 0, 0, panelParams);
            scene.add.existing(panel);
            panel.setInteractive();

            this._scene.input.setDraggable(panel, true);

            this._panels.push(panel);
        }

        this._temporalContainer = this._scene.add.container();

        this._lastTween = null;
        this._enabled = false;
    }

    get enabled() { return this._enabled; }
    set enabled(value) { this._enabled = value; }

    dragStart(object) {
        if (!this._enabled) {
            return;
        }

        if (this._lastTween !== null) {
            this._lastTween.stop();
            this._lastTween = null;
        }

        this._temporalContainer.x = 0;
        this._temporalContainer.y = 0;
    }

    drag(object, horizontal, delta) {
        if (!this._enabled) {
            return;
        }

        if (this._temporalContainer.list.length < 1) {
            const q = horizontal ? (p => p.row === object.row) : (p => p.col === object.col);
            const targets = this._panels.filter(q);
            this._temporalContainer.add(targets);
        }

        if (horizontal) {
            this._temporalContainer.x = delta;

            for (const p of this._temporalContainer.list) {
                if (p.x + this._temporalContainer.x < this._limitL) {
                    p.x += this._wrapH;
                }
                else if (p.x + this._temporalContainer.x > this._limitR) {
                    p.x -= this._wrapH;
                }
            }
        }
        else {
            this._temporalContainer.y = delta;

            for (const p of this._temporalContainer.list) {
                if (p.y + this._temporalContainer.y < this._limitU) {
                    p.y += this._wrapV;
                }
                else if (p.y + this._temporalContainer.y > this._limitB) {
                    p.y -= this._wrapV;
                }
            }
        }
    }

    dragEnd(object) {
        if (!this._enabled) {
            return;
        }

        const [colsMoved, rowsMoved] = this._getDraggedCoord();
        const destX = this._panelSize * colsMoved;
        const destY = this._panelSize * rowsMoved;

        for (const p of this._temporalContainer.list) {
            p.col = (p.col + colsMoved + this._cols) % this._cols;
            p.row = (p.row + rowsMoved + this._rows) % this._rows;
        }

        const post = () => { this._postDrag(object, colsMoved, rowsMoved); };

        this._lastTween = this._scene.tweens.add({
            targets: this._temporalContainer,
            x: destX,
            y: destY,
            duration: 100,
            ease: 'Power2',
            onComplete: post,
            onStop: post
        }, this._scene);
    }

    reset(refresh=true) {
        for (const [i, p] of this._panels.entries()) {
            p.col = i % this._cols;
            p.row = i / this._cols | 0;
        }

        if (refresh) {
            this.refresh();
        }
    }

    shuffle(iterations=1000, refresh=true) {
        const cs = this._cols;
        const rs = this._rows;

        for (let i = 0; i < iterations; i++) {
            if (Math.random() < 0.5) {
                const c = Math.random()*cs|0;
                const m = ((Math.random()*rs-1)|0)+1;
                this._panels.filter(p => p.col === c).forEach(p => {
                    p.row = (p.row + m) % rs;
                });
            }
            else {
                const r = Math.random()*rs|0;
                const m = ((Math.random()*cs-1)|0)+1;
                this._panels.filter(p => p.row === r).forEach(p => {
                    p.col = (p.col + m) % cs;
                });
            }
        }

        if (refresh) {
            this.refresh();
        }
    }

    isComplete() {
        for (const p of this._panels) {
            const expected = p.row * this._cols + p.col + 1;

            if (expected !== p.number) {
                return false;
            }
        }

        return true;
    }

    tint(on) {
        for (const p of this._panels) {
            p.tint(on);
        }
    }

    refresh() {
        for (const p of this._panels) {
            p.x = this._x0 + p.col * this._panelSize;
            p.y = this._y0 + p.row * this._panelSize;
        }
    }

    _postDrag(target, colsMoved, rowsMoved) {
        const destX = this._panelSize * colsMoved;
        const destY = this._panelSize * rowsMoved;

        for (const p of this._temporalContainer.list) {
            p.x += destX;
            p.y += destY;
        }

        this._temporalContainer.removeAll();
    }

    _getDraggedCoord() {
        const u = this._panelSize;
        const c = Math.floor((this._temporalContainer.x + 0.5*u) / u);
        const r = Math.floor((this._temporalContainer.y + 0.5*u) / u);

        return [c, r];
    }
}
