import { ThreeSceneElement } from "./threeScene";
import { HemisphereLight, FBXLoader, LoadingManager, IFbxSceneGraph, AxesHelper, Mesh, BoxHelper, BoundingBoxHelper, GLTFLoader, GLTF, Object3D, OrbitControls, PlaneHelper, Plane, Vector3, TextureLoader, MeshStandardMaterial, DirectionalLight, Texture } from "three";
import { getZipManager, loadAssets, coloredModel, GameColors } from "../mesh/models";

export class ModelViewElement extends ThreeSceneElement {
    constructor() {
        super();

        const controls = new OrbitControls(this.camera);
        controls.target.set(0, 0, 0);
        controls.update();

        this.camera.position.set(7, 5, -7);
        this.camera.lookAt(0, 0, 0);
        const hemisphereLight = new HemisphereLight(0xcccccc, undefined, 1);
        this.scene.add(hemisphereLight);

        const sun = new DirectionalLight(0xffffff, 3);
        sun.translateY(10);
        sun.translateX(10);
        sun.lookAt(0, 0, 0);
        this.scene.add(sun);

        this.loadModel();
    }

    async loadModel() {
        const assets = await loadAssets((current: number, total: number) => {
            console.log(`ASSETS: ${current}/${total}`);
        });

        this.scene.add(new AxesHelper());
        this.scene.add(new PlaneHelper(new Plane(new Vector3(0, 1, 0)), 3))

        const mesh = coloredModel(assets.LightTankLvl1, GameColors.blue);
        this.scene.add(mesh);
    }
}