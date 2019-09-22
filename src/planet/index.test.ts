import { getFlatMap } from './tiles';
import { assert } from 'chai';
import { getTile, getChunkForTile } from '.';
import { getHash } from '../services/hash';

describe('getTile', () => {
  const map = getFlatMap('tileTest', 4, 4, 1);
  it('should work for happy cases', () => {
    // TODO validate the tiles are correct (should use something other than a flat map)
    getTile(map, '0:0');
    getTile(map, '1:0');
    getTile(map, '0:1');
    getTile(map, getHash(0, 4 * 4 - 1));
    getTile(map, getHash(4 * 4 - 1, 0));
  });

  it('should fail for bound errors', () => {
    assert.throws(() => getTile(map, '-1:0'));
    assert.throws(() => getTile(map, '0:-1'));

    assert.throws(() => getTile(map, getHash(0, 4 * 4)));
    assert.throws(() => getTile(map, getHash(4 * 4, 0)));
  });
});

describe('getChunkForTile', () => {
  // map will have 4 chunks of 4x4
  const map = getFlatMap('tileTest', 4, 4, 1);

  it('should work for happy cases', () => {
    // TODO validate the chunks are correct
    getChunkForTile(map, '0:0');
    getChunkForTile(map, '4:0');
    getChunkForTile(map, '0:4');
    getChunkForTile(map, '4:4');
    getChunkForTile(map, getHash(0, 4 * 4 - 1));
    getChunkForTile(map, getHash(4 * 4 - 1, 0));
    getChunkForTile(map, getHash(4 * 4 - 1, 4 * 4 - 1));
  });

  it('should handle bounds checking', () => {
    assert.throws(() => getChunkForTile(map, '-1:0'));
    assert.throws(() => getChunkForTile(map, '0:-1'));

    assert.throws(() => getChunkForTile(map, getHash(0, 4 * 4)));
    assert.throws(() => getChunkForTile(map, getHash(4 * 4, 0)));
    assert.throws(() => getChunkForTile(map, getHash(4 * 4, 4 * 4)));
  });
});
