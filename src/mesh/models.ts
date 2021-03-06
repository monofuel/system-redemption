/* global THREE */
import { LoadingManager, GLTFLoader, TextureLoader, Scene, Texture, GLTF, Object3D, MeshStandardMaterial, Mesh, Color, Vector3 } from "three";
import { GameColors, ModelType } from "../types/SR";

// NB. has to switch to /scripts/assets.zip to cache them locally
const ASSET_ZIP = '/scripts/static/assets.zip';

interface BasicAssetPath {
    type: 'basic';
    model: string;
}

interface SkinnedAssetPath {
    type: 'skinned';
    model: string;
    skins: Record<GameColors, string>;
}

// TODO split assets based on project
const assetsPaths: Record<ModelType, BasicAssetPath | SkinnedAssetPath> = {
    LightTankLvl1: {
        type: 'skinned',
        model: 'gltf/tanks/LightTankLvl1/LightTankLvl1Blue.gltf',
        skins: {
            blue: 'gltf/tanks/LightTankLvl1/LightTankLvl1BlueAlbedoAO.png',
            green: 'gltf/tanks/LightTankLvl1/LightTankLvl1GreenAlbedoAO.png',
            grey: 'gltf/tanks/LightTankLvl1/LightTankLvl1GreyAlbedoAO.png',
            red: 'gltf/tanks/LightTankLvl1/LightTankLvl1RedAlbedoAO.png',
            white: 'gltf/tanks/LightTankLvl1/LightTankLvl1WhiteAlbedoAO.png',
            yellow: 'gltf/tanks/LightTankLvl1/LightTankLvl1YellowAlbedoAO.png',
        }
    },
    LightTankLvl2: {
        type: 'skinned',
        model: 'gltf/tanks/LightTankLvl2/LightTankLvl2Blue.gltf',
        skins: {
            blue: 'gltf/tanks/LightTankLvl2/LightTankLvl2BlueAlbedoAO.png',
            green: 'gltf/tanks/LightTankLvl2/LightTankLvl2GreenAlbedoAO.png',
            grey: 'gltf/tanks/LightTankLvl2/LightTankLvl2GreyAlbedoAO.png',
            red: 'gltf/tanks/LightTankLvl2/LightTankLvl2RedAlbedoAO.png',
            white: 'gltf/tanks/LightTankLvl2/LightTankLvl2WhiteAlbedoAO.png',
            yellow: 'gltf/tanks/LightTankLvl2/LightTankLvl2YellowAlbedoAO.png',
        }
    },
    LightTankLvl3: {
        type: 'skinned',
        model: 'gltf/tanks/LightTankLvl3/LightTankLvl3Blue.gltf',
        skins: {
            blue: 'gltf/tanks/LightTankLvl3/LightTankLvl3BlueAlbedoAO.png',
            green: 'gltf/tanks/LightTankLvl3/LightTankLvl3GreenAlbedoAO.png',
            grey: 'gltf/tanks/LightTankLvl3/LightTankLvl3GreyAlbedoAO.png',
            red: 'gltf/tanks/LightTankLvl3/LightTankLvl3RedAlbedoAO.png',
            white: 'gltf/tanks/LightTankLvl3/LightTankLvl3WhiteAlbedoAO.png',
            yellow: 'gltf/tanks/LightTankLvl3/LightTankLvl3YellowAlbedoAO.png',
        }
    },
    HeavyTankLvl3: {
        type: 'skinned',
        model: 'gltf/tanks/HeavyTankLvl3/HeavyTankLvl3Blue.gltf',
        skins: {
            blue: 'gltf/tanks/HeavyTankLvl3/HeavyTankLvl3BlueAlbedoAO.png',
            green: 'gltf/tanks/HeavyTankLvl3/HeavyTankLvl3GreenAlbedoAO.png',
            grey: 'gltf/tanks/HeavyTankLvl3/HeavyTankLvl3GreyAlbedoAO.png',
            red: 'gltf/tanks/HeavyTankLvl3/HeavyTankLvl3RedAlbedoAO.png',
            white: 'gltf/tanks/HeavyTankLvl3/HeavyTankLvl3WhiteAlbedoAO.png',
            yellow: 'gltf/tanks/HeavyTankLvl3/HeavyTankLvl3YellowAlbedoAO.png',
        }
    },
    // Planefront
    tree_1: {
        type: 'basic',
        model: 'gltf/planefront/tree_1.gltf'
    },
     berry_bush: {
        type: 'basic',
        model: 'gltf/planefront/berry_bush.gltf'
    },
     gold_rock: {
        type: 'basic',
        model: 'gltf/planefront/gold_rock.gltf'
    },
     grass: {
        type: 'basic',
        model: 'gltf/planefront/grass.gltf'
    },
     green_guy: {
        type: 'basic',
        model: 'gltf/planefront/green_guy.gltf'
    },
    iron_rock: {
        type: 'basic',
        model: 'gltf/planefront/iron_rock.gltf'
    },
    rock: {
        type: 'basic',
        model: 'gltf/planefront/rock.gltf'
    }
}

export interface BasicAsset { // so basic
    model: Mesh;
}

export interface SkinnedAsset extends BasicAsset {
    skins: Record<GameColors, Texture>;
}

export type OnProgress = (current: number, total: number) => void;

let fetch: Promise<Record<ModelType, SkinnedAsset>> | null = null;

// NB only the first caller gets onProgress
export async function loadAssets(onProgress: OnProgress): Promise<Record<ModelType, SkinnedAsset>> {
    if (!fetch) {
        fetch = fetchAssets(onProgress);
    }
    return fetch;
}

async function fetchAssets(onProgress: OnProgress): Promise<Record<ModelType, SkinnedAsset>> {

    const total = Object.keys(ModelType).length * (Object.keys(GameColors).length + 1);
    let current = 0;

    const manager = new LoadingManager();
    
    // @ts-ignore
    const zipLoader = new THREE.ZipLoader();
    const zip = await zipLoader.load(ASSET_ZIP);
    manager.setURLModifier(zip.urlResolver);

    const gtlfLoader = new GLTFLoader(manager);
    const texLoader = new TextureLoader(manager);

    function findAsset(path: string | RegExp): string {
        const results: string[] = zip.find(path);
        if (results.length != 1) {
            throw new Error(`ambiguous asset path: ${path}, ${JSON.stringify(results)}`)
        }
        return results[0];
    }

    async function loadTexture(str: string): Promise<Texture> {
        const path = findAsset(str);
        const tex = await new Promise<Texture>((resolve, reject) => {
            new TextureLoader(manager).load(path, resolve, () => { }, reject);
        })
        onProgress(++current, total);
        return tex;
    }
    async function loadModel(str: string): Promise<Mesh> {
        const path = findAsset(str);
        const mesh = new Promise<Mesh>((resolve, reject) => {
            gtlfLoader.load(path, (gltf: GLTF) => {
                const children = gltf.scene.children;
                if (children.length !== 1) {
                    console.error(gltf);
                    throw new Error(`ambiguous object in GLTF scene: ${children.length}`);
                }
                resolve(gltf.scene.children[0] as Mesh);
            }, () => { }, reject);
        });
        onProgress(++current, total);
        return mesh;
    }

    const results: Partial<Record<ModelType, BasicAsset | SkinnedAsset>> = {};

    for (const key of Object.keys(assetsPaths)) {
        const type: ModelType = key as any;
        const paths = assetsPaths[type];
        if (paths.type === 'skinned') {
            results[type] = {
                model: await loadModel(paths.model),
                skins: {
                    blue: await loadTexture(paths.skins.blue),
                    green: await loadTexture(paths.skins.green),
                    grey: await loadTexture(paths.skins.grey),
                    red: await loadTexture(paths.skins.red),
                    white: await loadTexture(paths.skins.white),
                    yellow: await loadTexture(paths.skins.yellow),
                }
            } as SkinnedAsset;
        } else {
             results[type] = {
                model: await loadModel(paths.model),
            } as BasicAsset;
        }
    }
    return results as any;
}

export function coloredModel(asset: SkinnedAsset, color: GameColors): Mesh {

    // TODO medium and heavy tanks have treads, which need to be handled differently
    const result = asset.model.clone();
    const mat = (result.material as MeshStandardMaterial).clone();
    const normals = mat.normalMap as Texture;
    const tex = asset.skins[color];
    const bak = tex.image;
    // HACK need to figure out exactly what fields are needed for mapping to be correct?
    tex.copy(normals);
    tex.image = bak;
    mat.map = tex;
    result.traverse((obj) => {
        if (obj instanceof Mesh) {
            obj.material = mat;
        }
    });
    result.up = new Vector3(0, 1, 0);
    return result;
}

export function basicModel(asset: BasicAsset): Mesh {
        // TODO medium and heavy tanks have treads, which need to be handled differently
    const result = asset.model.clone();
    result.up = new Vector3(0, 1, 0);
    return result;
}
