export default class InputController {
    private dragXValue: number = 0;
    private dragYValue: number = 0;
    private mouseButtonValue: number = -1;
    private zoomValue = 1;

    public mouseX = 0;
    public mouseY = 0;

    private mousemove(ev: MouseEvent) {
        if (this.mouseButtonValue == 1) {
            this.dragXValue += ev.movementX;
            this.dragYValue += ev.movementY;
        }

        this.mouseX = ev.x;
        this.mouseY = ev.y - 50;
    }
    
    private mousedown(ev: MouseEvent) {
        this.mouseButtonValue = ev.button;
    }
    
    private mouseup(ev: MouseEvent) {
        this.mouseButtonValue = -1;
    }

    private wheel(ev: WheelEvent) {
        this.zoomValue += ev.deltaY * -0.002;
        this.zoomValue = Math.min(Math.max(.125, this.zoomValue), 4);
    }

    private scroll(ev: Event) {
        ev.preventDefault();
    }

    constructor() {
        window.addEventListener("mousemove", ev => this.mousemove(ev));

        window.addEventListener("mousedown", ev => this.mousedown(ev));

        window.addEventListener("mouseup", ev => this.mouseup(ev));

        window.addEventListener("wheel", ev => this.wheel(ev));
        window.addEventListener("scroll", ev => this.scroll(ev));
    }

    get dragX() {
        const ret = this.dragXValue;
        this.dragXValue = 0;
        return ret;
    }

    get dragY() {
        const ret = this.dragYValue;
        this.dragYValue = 0;
        return ret;
    }

    get mouseButton() {
        return this.mouseButtonValue;
    }

    get zoom() {
        const ret = this.zoomValue;
        this.zoomValue = 1;
        return ret;
    }
}