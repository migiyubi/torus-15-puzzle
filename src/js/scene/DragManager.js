export default class DragManager {
    constructor(scene) {
        this._onDrag = null;
        this._onDragEnd = null;
        this._direction = null;

        this._thresholdSwipe = 10;

        scene.input.on('dragstart', (pointer, object) => {
            this._direction = null;

            if (this._onDragStart !== null) {
                this._onDragStart(object);
            }
        });

        scene.input.on('drag', (pointer, object, x, y) => {
            const dx = pointer.x - pointer.downX;
            const dy = pointer.y - pointer.downY;

            if (this._direction === null) {
                const mx = Math.abs(dx);
                const my = Math.abs(dy);

                if (mx > this._thresholdSwipe) {
                    this._direction = 'H';
                }
                else if (my > this._thresholdSwipe) {
                    this._direction = 'V';
                }
            }
            else {
                if (this._onDrag !== null) {
                    const horizontal = this._direction === 'H';
                    const delta = horizontal ? dx : dy;

                    this._onDrag(object, horizontal, delta);
                }
            }
        });

        scene.input.on('dragend', (pointer, object) => {
            // workaround for uncaught error. (fixed in the latest beta.)
            scene.input.mousePointer.camera = scene.cameras.main;

            this._direction = null;

            if (this._onDragEnd !== null) {
                this._onDragEnd(object);
            }
        });
    }
    
    setOnDragStartCallback(callback) {
        this._onDragStart = callback;
    }

    setOnDragCallback(callback) {
        this._onDrag = callback;
    }

    setOnDragEndCallback(callback) {
        this._onDragEnd = callback;
    }
}
