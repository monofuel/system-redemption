import {
  CanvasTexture,
  Face3,
  FrontSide,
  Geometry,
  Matrix4,
  Mesh,
  MeshPhongMaterial,
  Texture,
  Vector2,
  Vector3,
} from 'three';
import { PlanetTiles, TileHeights } from '../types/SR';
import { toHexColor } from '../util';

interface MeshOpts {
  wireframe: boolean;
  zScale: number;
}

export function getTileMesh(
  tiles: PlanetTiles,
  cliffColor: number,
  tileTex: Texture,
  opts: Partial<MeshOpts> = {},
): Mesh {
  const geom = new Geometry();

  for (let y = 0; y < tiles.size; y++) {
    for (let x = 0; x < tiles.size; x++) {
      const tile = tiles.grid[x][y];
      const matrix = new Matrix4().makeTranslation(x, y, 0);
      geom.merge(getGeomForTile(tile, opts.zScale), matrix);
    }
  }

  // geom.mergeVertices();
  geom.computeFaceNormals();
  geom.computeVertexNormals();

  geom.rotateX(-Math.PI / 2);

  const landMaterial = new MeshPhongMaterial({
    // color: landColor,
    shininess: 0,
    side: FrontSide,
    map: tileTex,
    flatShading: true,

    wireframe: opts.wireframe || false,
  });
  const cliffMaterial = new MeshPhongMaterial({
    color: cliffColor,
    side: FrontSide,
    flatShading: true,
    shininess: 0,
    wireframe: opts.wireframe || false,
  });

  const mesh = new Mesh(geom, [landMaterial, cliffMaterial]);
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
