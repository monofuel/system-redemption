import { ThreeSceneElement } from "./threeScene";
import { HemisphereLight, FBXLoader, LoadingManager, IFbxSceneGraph, AxesHelper, Mesh, BoxHelper, BoundingBoxHelper, GLTFLoader, GLTF, Object3D, OrbitControls, PlaneHelper, Plane, Vector3 } from "three";

export class ModelViewElement extends ThreeSceneElement {
    constructor() {
        super();

        this.camera.position.set(-7, 5, -7);
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

        const loader = new GLTFLoader(manager);
        const str = zip.find(/gltf\/tanks\/LightTankLvl1\/LightTankLvl1Blue.gltf$/);
        console.log(str);
        loader.load(str[0], (obj: GLTF) => {
            console.log('loaded');
            console.log(obj);
            this.scene.add(new AxesHelper());
            this.scene.traverse((obj: Object3D) => {
                // LightTankLvl1BlueAlbedoAO.png
            })

            // object.scene.children[0] is the TestExportScene object
            this.scene.add(obj.scene);
            this.scene.add(new PlaneHelper(new Plane(new Vector3(0, 1, 0)), 3))
        }, () => { }, (event: ErrorEvent) => {
            console.log(event);
        });

    }
}