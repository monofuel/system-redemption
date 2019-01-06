import { ThreeSceneElement } from "./threeScene";
import { HemisphereLight, FBXLoader, LoadingManager, IFbxSceneGraph, AxesHelper, Mesh, BoxHelper, BoundingBoxHelper, GLTFLoader, GLTF, Object3D, OrbitControls, PlaneHelper, Plane, Vector3, TextureLoader, MeshStandardMaterial, DirectionalLight, Texture } from "three";

export class ModelViewElement extends ThreeSceneElement {
    constructor() {
        super();

        const controls = new OrbitControls(this.camera);
        controls.target.set(0, 0, 0);
        controls.update();

        this.camera.position.set(7, 5, -7);
        this.camera.lookAt(0, 0, 0);
        this.scene.add(new HemisphereLight(0xffffff, undefined, 0.3));

        const sun = new DirectionalLight(0xffffff, 1);
        sun.translateY(10);
        sun.translateX(10);
        sun.lookAt(0, 0, 0);
        this.scene.add(sun);

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
        const txStr = zip.find(/gltf\/tanks\/LightTankLvl1\/LightTankLvl1BlueAlbedoAO.png$/)
        const albedoAO: Texture = await new Promise((resolve, reject) => {

            new TextureLoader(manager).load(txStr[0], resolve, () => { }, reject);
        })
        loader.load(str[0], (gltf: GLTF) => {
            console.log('loaded');
            console.log(gltf);
            this.scene.add(new AxesHelper());
            const obj = gltf.scene.children[0];
            // LightTankLvl1BlueAlbedoAO.png
            if (!(obj instanceof Mesh)) {
                return;
            }
            console.log(obj);
            const mat = obj.material as MeshStandardMaterial;
            const normals = mat.normalMap as Texture;
            const bak = albedoAO.image;
            albedoAO.copy(normals); // HACK need to figure out exactly what fields are needed for mapping to be correct?
            albedoAO.image = bak;
            mat.map = albedoAO;

            // object.scene.children[0] is the TestExportScene object
            this.scene.add(gltf.scene);
            this.scene.add(new PlaneHelper(new Plane(new Vector3(0, 1, 0)), 3))
        }, () => { }, (event: ErrorEvent) => {
            console.log(event);
        });

    }
}