import { GraphicalComponent, updateGraphicalComponent, dispose } from "./graphical";
import { ThreeSceneElement } from "../threeScene";

export interface Component {
    key: string;
}

// TODO consider pooling for components
export class ECS {
    private sceneElement: ThreeSceneElement;
    public graphical: { [key: string]: GraphicalComponent } = {};
    constructor(sceneElement: ThreeSceneElement) {
        this.sceneElement = sceneElement;
    }

    addGraphicalComponent(comp: GraphicalComponent) {
        if (this.graphical[comp.key]) {
            this.removeGraphicalComponent(comp.key);
        }
        this.graphical[comp.key] = comp;
        updateGraphicalComponent(this.sceneElement, comp);
    }
    removeGraphicalComponent(key: string) {
        const comp = this.graphical[key];
        if (!comp) {
            return;
        }
        dispose(this.sceneElement, comp);
        delete this.graphical[key];
    }

    public update() {
        for (const key in this.graphical) {
            const g = this.graphical[key];
            updateGraphicalComponent(this.sceneElement, g);

        }
    }
}