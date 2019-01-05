import { ThreeSceneElement } from "./threeScene";
import { HemisphereLight, FBXLoader, LoadingManager, IFbxSceneGraph, AxesHelper, Mesh, BoxHelper, BoundingBoxHelper } from "three";

export class ModelViewElement extends ThreeSceneElement {
    constructor() {
        super();

        this.camera.position.set(-100, 100, -100);
        this.camera.lookAt(0, 0, 0);
        this.scene.add(new HemisphereLight(0xffffff, undefined, 0.3));
        this.loadModel();
    }

    async loadModel() {
        const manager = new LoadingManager();
        // @ts-ignore
        const zipLoader = new THREE.ZipLoader();
        const zip = await zipLoader.load('/scripts/assets.zip');
        manager.setURLModifier(zip.urlResolver);

        const loader = new FBXLoader(manager);
        const str = zip.find(/tanks\/FBX\/LightTankLvl1\/LightTankLvl1Hull.fbx$/);
        console.log(str);
        loader.load(str[0], (obj: IFbxSceneGraph) => {
            console.log('loaded');
            console.log(obj);
            this.scene.add(new AxesHelper());
            const mesh: Mesh = obj.children[0] as any;
            mesh.geometry.computeBoundingBox();
            this.scene.add(new BoundingBoxHelper(obj));

            this.scene.add(obj);
        }, () => { }, (event: ErrorEvent) => {
            console.log(event);
        });

    }
}