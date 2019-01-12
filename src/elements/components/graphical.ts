import { Component } from ".";
import { ThreeSceneElement } from "../threeScene";
import { Mesh, Vector3, Object3D } from "three";
import { Unit, GameColors, ModelType, Loc, FiniteMap } from "../../types/SR";
import { Asset, coloredModel } from "../../mesh/models";
import { getTile } from "../../planet";
import { getHilightMesh } from "../../mesh/hilight";

export enum GraphicalType {
    unit = 'unit',
    hilight = 'hilight'
}
export interface GraphicalComponent extends Component {
    mesh: Mesh;
    type: GraphicalType;
}

export function updateGraphicalComponent(sceneElement: ThreeSceneElement, comp: GraphicalComponent) {

    const map = getMap(sceneElement);
    if (!map.getObjectByName(comp.key)) {
        map.add(comp.mesh);
    }
    const planet = sceneElement.ctx.gameState.planet!;

    if (comp.type === GraphicalType.unit) {
        const { x, y, facing } = sceneElement.ctx.gameState.units[comp.key];

        placeOnMap(planet, comp.mesh, x, y);

        switch (facing) {
            case 'N':
                comp.mesh.rotation.y = -Math.PI;
                break;
            case 'S':
                comp.mesh.rotation.y = Math.PI;
                break;
            case 'E':
                comp.mesh.rotation.y = Math.PI / 2;
                break;
            case 'W':
                comp.mesh.rotation.y = -Math.PI / 2;
        }
    } else if (comp.type === GraphicalType.hilight) {
        const [x, y] = sceneElement.ctx.gameState.hilight!;
        placeOnMap(planet, comp.mesh, x, y);
    }
}

export function dispose(sceneElement: ThreeSceneElement, comp: GraphicalComponent) {
    const map = getMap(sceneElement);
    map.remove(comp.mesh);
}

export function getMap(sceneElement: ThreeSceneElement): Object3D {
    return sceneElement.scene.getObjectByName(sceneElement.ctx.gameState.planet!.name)!;
}

export function unitGraphicalComp(sceneElement: ThreeSceneElement, unit: Unit): GraphicalComponent {
    const unitDef = sceneElement.ctx.gameState.unitDefinitions[unit.type];
    if (!unitDef) {
        throw new Error(`missing definition for unit type ${unit.type}`);
    }
    if (!unitDef.graphical) {
        throw new Error(`missing definition for unit type ${unit.type}`);
    }
    const mesh = assetForEntity(sceneElement.assets, unitDef.graphical.model, unit.color || randomColor());
    mesh.name = unit.uuid;

    return {
        key: unit.uuid,
        type: GraphicalType.unit,
        mesh
    }
}
export function hilightGraphicalComp(sceneElement: ThreeSceneElement, key: string, loc: Loc, corners?: Array<0 | 1 | 2 | 3>): GraphicalComponent {
    const planet = sceneElement.ctx.gameState.planet!;
    const tile = getTile(planet, loc[0], loc[1]);

    // TODO cornerColors
    const mesh = getHilightMesh({
        corners: tile,
        zScale: planet.zScale,
        color: 0x555555
    });

    return {
        key,
        type: GraphicalType.hilight,
        mesh
    }
}

function assetForEntity(assets: Record<ModelType, Asset>, modelType: ModelType, color: GameColors): Mesh {
    switch (modelType) {
        case ModelType.LightTankLvl1:
            const model = coloredModel(assets[modelType], color);
            model.scale.copy(new Vector3(0.7, 0.7, 0.7));
            return model;
        default:
            throw new Error(`missing asset for ${modelType}`)
    }
}

export function randomColor(): GameColors {
    const num = Math.floor(Math.random() * Object.keys(GameColors).length);
    return (GameColors as any)[Object.keys(GameColors)[num]];

}
function placeOnMap(map: FiniteMap, obj: Object3D, x: number, y: number) {

    const tile = getTile(map, x, y);
    const height = (tile[0] + tile[1] + tile[2] + tile[3]) / 4;

    // TODO movement animations
    obj.position.x = x + 0.5;
    obj.position.y = height * map.zScale;
    obj.position.z = y + 0.5;
}