export default class InputController {
    private _dragX: number = 0;
    private _dragY: number = 0;
    private _mouseButton: number = -1;
    private _zoom = 1;

    private _mouseX = 0;
    private _mouseY = 0;

    private _altKey = false;
    private _ctrlKey = false;
    private _shiftKey = false;

    private mousemove(ev: MouseEvent) {
        if (this._mouseButton == 1 || this._mouseButton == 0 && this._altKey) {
            this._dragX += ev.movementX;
            this._dragY += ev.movementY;
        }

        this._mouseX = ev.x;
        this._mouseY = ev.y - 50;
    }
    
    private mousedown(ev: MouseEvent) {
        this._mouseButton = ev.button;
    }
    
    private mouseup(ev: MouseEvent) {
        this._mouseButton = -1;
    }

    private wheel(ev: WheelEvent) {
        this._zoom += ev.deltaY * -0.002;
        this._zoom = Math.min(Math.max(.125, this._zoom), 4);
    }

    private scroll(ev: Event) {
        ev.preventDefault();
    }

    private keydown(ev: KeyboardEvent) {
        this._altKey = ev.altKey;
        this._ctrlKey = ev.ctrlKey;
        this._shiftKey = ev.shiftKey;
    }

    constructor() {
        window.addEventListener("mousemove", ev => this.mousemove(ev));

        window.addEventListener("mousedown", ev => this.mousedown(ev));

        window.addEventListener("mouseup", ev => this.mouseup(ev));

        window.addEventListener("wheel", ev => this.wheel(ev));

        window.addEventListener("scroll", ev => this.scroll(ev));

        window.addEventListener("keydown", ev => this.keydown(ev));
    }

    get dragX() {
        const ret = this._dragX;
        this._dragX = 0;
        return ret;
    }

    get dragY() {
        const ret = this._dragY;
        this._dragY = 0;
        return ret;
    }

    get zoom() {
        const ret = this._zoom;
        this._zoom = 1;
        return ret;
    }

    get mouseButton() {
        return this._mouseButton;
    }

    get mouseX() {
        return this._mouseX;
    }

    get mouseY() {
        return this._mouseY;
    }

    get altKey() {
        return this._altKey;
    }

    get ctrlKey() {
        return this._ctrlKey;
    }

    get shiftKey() {
        return this._shiftKey;
    }
}