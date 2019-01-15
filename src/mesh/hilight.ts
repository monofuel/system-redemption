import { DoubleSide, Face3, FrontSide, Geometry, Mesh, MeshBasicMaterial, MeshPhongMaterial, Vector3, MeshLambertMaterial, BackSide, BufferGeometry } from 'three';
import { TileHeights, FiniteMap, LocHash } from '../types/SR';
import { getTile } from '../planet';
import _ from 'lodash';
interface HilightOpts {
  planet: FiniteMap,
  loc: LocHash,
  color: number;
  cornerColors?: [number, number, number, number];
  zScale: number;
}

export function getHilightMesh({ planet, loc, color, cornerColors, zScale }: HilightOpts): Mesh {
  // TODO respect corners
  const tile = getTile(planet, loc).map((n) => n * zScale);
  const minHeight = _.min(tile)!;
  const height = tile.map((n) => (n - minHeight))


  cornerColors = cornerColors || [color, color, color, color];
  const geom = new Geometry();
  const heightOffset = 0.01;
  const c1 = cornerGeom.clone();
  c1.translate(0, 0, height[2])
  geom.merge(c1);

  const c2 = cornerGeom.clone();
  c2.faces.forEach((f) => f.materialIndex = 1);
  c2.rotateZ(Math.PI / 2);
  c2.translate(1, 0, height[3]);
  geom.merge(c2);

  const c3 = cornerGeom.clone();
  c3.faces.forEach((f) => f.materialIndex = 2);
  c3.rotateZ(Math.PI);
  c3.translate(1, 1, height[1]);
  geom.merge(c3);

  const c4 = cornerGeom.clone();
  c4.faces.forEach((f) => f.materialIndex = 3);
  c4.rotateZ(-Math.PI / 2);
  c4.translate(0, 1, height[0]);
  geom.merge(c4);

  const materials = cornerColors.map((color) => {
    return new MeshBasicMaterial({
      side: BackSide,
      color,
      flatShading: true,
      transparent: true,
      opacity: 0.8,

    });
  });

  const hilightMaterial =
    geom.rotateX(-Math.PI / 2);
  geom.translate(-0.5, heightOffset, 0.5);
  const bufferGeom = new BufferGeometry();
  bufferGeom.fromGeometry(geom);
  const mesh = new Mesh(bufferGeom, materials);
  return mesh;
}


export function hilightCornerGeom() {
  const width = 0.2;
  const height = 0.05;

  const geom = new Geometry();
  geom.vertices.push(
    new Vector3(0, 0, 0), // 0
    new Vector3(0, width, 0), // 1
    new Vector3(width / 2, width / 2, 0), // 2
    new Vector3(width / 2, width, 0), // 3
  );

  geom.faces.push(new Face3(3, 1, 0, undefined, undefined, 0));
  geom.faces.push(new Face3(0, 2, 3, undefined, undefined, 0));

  geom.vertices.push(
    new Vector3(0, 0, height), // 4
    new Vector3(0, width, height), // 5
    new Vector3(width / 2, width / 2, height), // 6
    new Vector3(width / 2, width, height), // 7
  );

  geom.faces.push(new Face3(7, 4, 5, undefined, undefined, 0));
  geom.faces.push(new Face3(4, 7, 6, undefined, undefined, 0));

  geom.faces.push(new Face3(4, 0, 5, undefined, undefined, 0));
  geom.faces.push(new Face3(0, 1, 5, undefined, undefined, 0));

  // internal face on triangle
  // geom.faces.push(new Face3(2, 4, 6, undefined, undefined, 0));
  // geom.faces.push(new Face3(4, 2, 0, undefined, undefined, 0));

  geom.faces.push(new Face3(3, 2, 6, undefined, undefined, 0));
  geom.faces.push(new Face3(6, 7, 3, undefined, undefined, 0));

  geom.faces.push(new Face3(1, 3, 7, undefined, undefined, 0));
  geom.faces.push(new Face3(5, 1, 7, undefined, undefined, 0));

  geom.computeFaceNormals();

  const halfGeom = geom.clone();
  halfGeom.rotateY(Math.PI);
  halfGeom.rotateZ(-Math.PI / 2);
  halfGeom.translate(0, 0, height);

  geom.merge(halfGeom);
  geom.mergeVertices();
  return geom;
}

const cornerGeom = hilightCornerGeom();