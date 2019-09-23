import { getFlatMap } from '../planet/tiles';
import { getPlanetObject, clearChunkCache, invalidateChunkCache } from './tiles';

describe('tile meshes', () => {
  it('getPlanetObject', () => {
    const gameMap = getFlatMap('getPlanetObject', 4, 4, 2);
    getPlanetObject({
      gameMap,
      cache: false,
      wireframe: false,
    });
  });

  it('getPlanetObject with cache', () => {
    const gameMap = getFlatMap('getPlanetObject', 4, 4, 2);
    getPlanetObject({
      gameMap,
      cache: true,
      wireframe: false,
    });

    // TODO test that cached values are used
    getPlanetObject({
      gameMap,
      cache: true,
      wireframe: false,
    });
  });

  it('getPlanetObject with cache invalidating', () => {
    const gameMap = getFlatMap('getPlanetObject', 4, 4, 2);
    getPlanetObject({
      gameMap,
      cache: true,
      wireframe: false,
    });

    invalidateChunkCache('1:1');
    getPlanetObject({
      gameMap,
      cache: true,
      wireframe: false,
    });
  });

  it('getPlanetObject with cache clearing', () => {
    const gameMap = getFlatMap('getPlanetObject', 4, 4, 2);
    getPlanetObject({
      gameMap,
      cache: true,
      wireframe: false,
    });

    clearChunkCache();
    getPlanetObject({
      gameMap,
      cache: true,
      wireframe: false,
    });
  });
});
