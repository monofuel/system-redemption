import {
  CanvasTexture,
  Face3,
  FrontSide,
  Geometry,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Object3D,
  Texture,
  Vector2,
  Vector3,
} from 'three';
import { Direction, FiniteMap, PlanetTiles, TileHeights } from '../types/SR';
import { toHexColor } from '../util';

interface PlanetMeshOpts {
  gameMap: FiniteMap;
}

export function getPlanetObject({
  gameMap,
}: PlanetMeshOpts): Object3D {
  const {
    landColor, edgeColor, cliffColor, waterColor, waterHeight
  } = gameMap;
  const tileTexture = getTileTexture(landColor, edgeColor);

  const mapObj = new Object3D();
  mapObj.name = gameMap.name;

  for (let y = 0; y < gameMap.size; y++) {
    for (let x = 0; x < gameMap.size; x++) {
      const sides: Direction[] = [];
      if (x !== 0) {
        sides.push('W');
      }
      if (y !== 0) {
        sides.push('N');
      }
      if (x !== gameMap.size - 1) {
        sides.push('E');
      }
      if (y !== gameMap.size - 1) {
        sides.push('S');
      }

      const tiles = gameMap.grid[y][x];
      const chunk = getTileMesh({
        tiles,
        waterHeight,
        cliffColor,
        waterColor,
        skipSides: sides,
        tileTex: tileTexture,
      });
      chunk.translateX(x * gameMap.chunkSize);
      chunk.translateZ(y * gameMap.chunkSize);
      chunk.rotateY(-Math.PI / 2);
      mapObj.add(chunk);
    }
  }
  return mapObj;
}

interface MeshOpts {
  tiles: PlanetTiles;
  waterHeight: number;
  cliffColor: number;
  waterColor: number;
  skipSides: Direction[];
  tileTex: Texture;
  wireframe?: boolean;
  zScale?: number;
}
export function getTileMesh({
  tiles,
  waterHeight,
  cliffColor,
  waterColor,
  skipSides: sides,
  tileTex,
  wireframe = false,
  zScale,
}: MeshOpts): Mesh {
  const geom = new Geometry();

  for (let y = 0; y < tiles.grid.length; y++) {
    for (let x = 0; x < tiles.grid.length; x++) {
      const tile = tiles.grid[x][y];
      const matrix = new Matrix4().makeTranslation(x, y, 0);

      const tileGeom = getGeomForTile(tile, zScale);

      /*
      // Remove internal edges before merging into chunk
      // TODO this needs to check if the sides of the tile are
      // exposed as a cliff
      const oldTileFaces = tileGeom.faces;
      tileGeom.faces = oldTileFaces.slice(0, 2);
      if (y === 0) {
        tileGeom.faces.push(...oldTileFaces.slice(4, 6));
      }
      if (x === 0) {
        tileGeom.faces.push(...oldTileFaces.slice(2, 4));
      }
      if (x === tiles.size - 1) {
        tileGeom.faces.push(...oldTileFaces.slice(6, 8));
      }
      if (y === tiles.size - 1) {
        tileGeom.faces.push(...oldTileFaces.slice(8, 10));
      }
      */

      const waterGeom = getWaterGeomForTile(tile, waterHeight, zScale);

      geom.merge(tileGeom, matrix);
      if (waterGeom) {
        // Remove internal edges before merging into chunk
        const oldWaterFaces = waterGeom.faces;
        waterGeom.faces = oldWaterFaces.slice(0, 2);
        if (!sides.includes('W') && y === 0) {
          waterGeom.faces.push(...oldWaterFaces.slice(4, 6));
        }
        if (!sides.includes('N') && x === 0) {
          waterGeom.faces.push(...oldWaterFaces.slice(2, 4));
        }
        if (!sides.includes('S') && x === tiles.grid.length - 1) {
          waterGeom.faces.push(...oldWaterFaces.slice(6, 8));
        }
        if (!sides.includes('E') && y === tiles.grid.length - 1) {
          waterGeom.faces.push(...oldWaterFaces.slice(8, 10));
        }

        geom.merge(waterGeom, matrix);
      }
    }
  }

  geom.mergeVertices();
  geom.computeBoundingBox();
  geom.computeFaceNormals();
  geom.computeVertexNormals();

  geom.rotateX(-Math.PI / 2);

  const landMaterial = new MeshPhongMaterial({
    shininess: 0,
    side: FrontSide,
    map: tileTex,
    flatShading: true,
    wireframe,
  });
  const cliffMaterial = new MeshPhongMaterial({
    color: cliffColor,
    side: FrontSide,
    flatShading: true,
    shininess: 0,
    wireframe,
  });

  const waterMaterial = new MeshPhongMaterial({
    color: waterColor,
    side: FrontSide,
    flatShading: true,
    transparent: true,
    opacity: 0.8,
    // shininess: 0,
    wireframe,
  });

  const mesh = new Mesh(geom, [landMaterial, cliffMaterial, waterMaterial]);
  return mesh;
}

function getGeomForTile(corners: TileHeights, zScale: number = 0.4): Geometry {
  const geom = new Geometry();

  geom.vertices.push(
    new Vector3(0, 0, corners[0] * zScale), // 0
    new Vector3(0, 1, corners[1] * zScale), // 1
    new Vector3(1, 0, corners[2] * zScale), // 2
    new Vector3(1, 1, corners[3] * zScale), // 3
  );

  geom.faces.push(new Face3(3, 1, 0, undefined, undefined, 0));
  geom.faces.push(new Face3(0, 2, 3, undefined, undefined, 0));

  // add cliff around sides

  geom.vertices.push(
    new Vector3(0, 0, -1), // 4
    new Vector3(0, 1, -1), // 5
    new Vector3(1, 0, -1), // 6
    new Vector3(1, 1, -1), // 7
  );

  geom.faces.push(new Face3(4, 0, 5, undefined, undefined, 1));
  geom.faces.push(new Face3(0, 1, 5, undefined, undefined, 1));

  geom.faces.push(new Face3(2, 4, 6, undefined, undefined, 1));
  geom.faces.push(new Face3(4, 2, 0, undefined, undefined, 1));

  geom.faces.push(new Face3(3, 2, 6, undefined, undefined, 1));
  geom.faces.push(new Face3(6, 7, 3, undefined, undefined, 1));

  geom.faces.push(new Face3(1, 3, 7, undefined, undefined, 1));
  geom.faces.push(new Face3(5, 1, 7, undefined, undefined, 1));

  // set texture UV
  for (let i = 0; i < geom.faces.length; i += 2) {
    geom.faceVertexUvs[0][i] = [
      new Vector2(0, 0),
      new Vector2(0, 1),
      new Vector2(1, 1),
    ];

    geom.faceVertexUvs[0][i + 1] = [
      new Vector2(0, 0),
      new Vector2(1, 0),
      new Vector2(1, 1),
    ];
  }
  geom.computeFaceNormals();
  geom.computeFlatVertexNormals();

  geom.uvsNeedUpdate = true;
  return geom;
}

function getWaterGeomForTile(
  corners: TileHeights,
  waterHeight: number,
  zScale: number = 0.4,
): Geometry | null {
  if (corners.filter((corner) => corner > waterHeight).length === 4) {
    // if all 4 corners are above the water height, no water!
    return null;
  }
  const geom = new Geometry();

  geom.vertices.push(
    new Vector3(0, 0, waterHeight * zScale), // 0
    new Vector3(0, 1, waterHeight * zScale), // 1
    new Vector3(1, 0, waterHeight * zScale), // 2
    new Vector3(1, 1, waterHeight * zScale), // 3
  );

  geom.faces.push(new Face3(3, 1, 0, undefined, undefined, 2));
  geom.faces.push(new Face3(0, 2, 3, undefined, undefined, 2));

  // from water to tile underneath

  geom.vertices.push(
    new Vector3(0, 0, Math.min(corners[0] * zScale, waterHeight * zScale)), // 4
    new Vector3(0, 1, Math.min(corners[1] * zScale, waterHeight * zScale)), // 5
    new Vector3(1, 0, Math.min(corners[2] * zScale, waterHeight * zScale)), // 6
    new Vector3(1, 1, Math.min(corners[3] * zScale, waterHeight * zScale)), // 7
  );

  geom.faces.push(new Face3(4, 0, 5, undefined, undefined, 2));
  geom.faces.push(new Face3(0, 1, 5, undefined, undefined, 2));

  geom.faces.push(new Face3(2, 4, 6, undefined, undefined, 2));
  geom.faces.push(new Face3(4, 2, 0, undefined, undefined, 2));

  geom.faces.push(new Face3(3, 2, 6, undefined, undefined, 2));
  geom.faces.push(new Face3(6, 7, 3, undefined, undefined, 2));

  geom.faces.push(new Face3(1, 3, 7, undefined, undefined, 2));
  geom.faces.push(new Face3(5, 1, 7, undefined, undefined, 2));

  geom.computeFaceNormals();
  geom.computeFlatVertexNormals();

  // set texture UV
  // water doesn't have a texture yet, but this makes three.js happy.
  for (let i = 0; i < geom.faces.length; i += 2) {
    geom.faceVertexUvs[0][i] = [
      new Vector2(0, 0),
      new Vector2(0, 1),
      new Vector2(1, 1),
    ];

    geom.faceVertexUvs[0][i + 1] = [
      new Vector2(0, 0),
      new Vector2(1, 0),
      new Vector2(1, 1),
    ];
  }

  geom.uvsNeedUpdate = true;
  return geom;
}

export function getTileTexture(
  landColor: number,
  edgeColor: number,
): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.height = 32;
  canvas.width = 32;
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = toHexColor(edgeColor);
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = toHexColor(landColor);
  ctx.fillRect(1, 1, canvas.width - 2, canvas.height - 2);
  return new CanvasTexture(canvas);
}
