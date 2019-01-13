import { DoubleSide, Face3, FrontSide, Geometry, Mesh, MeshBasicMaterial, MeshPhongMaterial, Vector3, MeshLambertMaterial, BackSide } from 'three';
import { TileHeights } from '../types/SR';

interface HilightOpts {
  color: number;
  cornerColors?: [number, number, number, number];

  zScale: number;
}

export function getHilightMesh({ color, cornerColors }: HilightOpts): Mesh {
  // TODO respect corners
  cornerColors = cornerColors || [color, color, color, color];
  const geom = new Geometry();
  const heightOffset = 0.02;
  const c1 = cornerGeom.clone();
  geom.merge(c1);

  const c2 = cornerGeom.clone();
  c2.faces.forEach((f) => f.materialIndex = 1);
  c2.rotateZ(Math.PI / 2);
  c2.translate(1, 0, 0);
  geom.merge(c2);

  const c3 = cornerGeom.clone();
  c3.faces.forEach((f) => f.materialIndex = 2);
  c3.rotateZ(Math.PI);
  c3.translate(1, 1, 0);
  geom.merge(c3);

  const c4 = cornerGeom.clone();
  c4.faces.forEach((f) => f.materialIndex = 3);
  c4.rotateZ(-Math.PI / 2);
  c4.translate(0, 1, 0);
  geom.merge(c4);

  const materials = cornerColors.map((color) => {
    return new MeshBasicMaterial({
      side: BackSide,
      color,
      flatShading: true,
      transparent: true,
      opacity: 0.5,

    });
  });

  const hilightMaterial =
    geom.rotateX(-Math.PI / 2);
  geom.translate(-0.5, heightOffset, 0.5);
  const mesh = new Mesh(geom, materials);
  return mesh;
}


export function hilightCornerGeom() {
  const geom = new Geometry();
  geom.vertices.push(
    new Vector3(0, 0, 0), // 0
    new Vector3(0, 0.4, 0), // 1
    new Vector3(0.2, 0.2, 0), // 2
    new Vector3(0.2, 0.4, 0), // 3
  );

  geom.faces.push(new Face3(3, 1, 0, undefined, undefined, 0));
  geom.faces.push(new Face3(0, 2, 3, undefined, undefined, 0));

  geom.vertices.push(
    new Vector3(0, 0, 0.1), // 4
    new Vector3(0, 0.4, 0.1), // 5
    new Vector3(0.2, 0.2, 0.1), // 6
    new Vector3(0.2, 0.4, 0.1), // 7
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
  halfGeom.translate(0, 0, 0.1);

  geom.merge(halfGeom);
  geom.mergeVertices();
  return geom;
}

const cornerGeom = hilightCornerGeom();