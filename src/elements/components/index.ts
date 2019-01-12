import { GraphicalComponent, updateGraphicalComponent, dispose } from "./graphical";
import { ThreeSceneElement } from "../threeScene";

export interface Component {
    uuid: string;
}

export class ECS {
    private sceneElement: ThreeSceneElement;
    public graphical: { [key: string]: GraphicalComponent } = {};
    constructor(sceneElement: ThreeSceneElement) {
        this.sceneElement = sceneElement;
    }

    addGraphicalComponent(comp: GraphicalComponent) {
        if (this.graphical[comp.uuid]) {
            throw new Error(`component already exists ${comp.uuid}`);
        }
        this.graphical[comp.uuid] = comp;
    }
    removeGraphicalComponent(key: string) {
        const comp = this.graphical[key];
        dispose(comp);
        delete this.graphical[key];
    }

    public update() {
        for (const key in this.graphical) {
            const g = this.graphical[key];
            updateGraphicalComponent(this.sceneElement, g);

        }
    }
}