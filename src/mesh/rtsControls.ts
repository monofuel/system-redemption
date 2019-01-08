import { Camera } from "three";

export class RTSControls {
    constructor(camera: Camera, el: HTMLElement) {
        el.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        el.addEventListener('mouseup', this.onMouseUp.bind(this), false);
        el.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    }

    onMouseDown(e: MouseEvent) {
        e.preventDefault();
        console.log(e.button);
        switch (e.button) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
        }
    }

    onMouseMove(e: MouseEvent) {

    }
    onMouseUp(e: MouseEvent) {

    }
}