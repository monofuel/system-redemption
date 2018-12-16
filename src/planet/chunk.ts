import { PlanetChunk, TileType } from '../types/SR';
import { delay } from '../util';
const Alea = require('alea');
const SimplexNoise = require('simplex-noise');

const waterHeight = 0;
const cliffDelta = 0.7;
const water = true;
const bigNoise = 0.005;
const medNoise = 0.037;
const smallNoise = 0.1;
const bigNoiseScale = 20;
const medNoiseScale = 6;
const smallNoiseScale = 1;

interface GenerateChunkOpts {
    x: number;
    y: number;
    size: number;
}
export function getChunkGenerator(seed: number) {
    const waterFudge = 0.15;
    const smoothness = 4.5;

    const bigNoiseGenerator = new SimplexNoise(new Alea(seed));
    const medNoiseGenerator = new SimplexNoise(new Alea(seed * 6543));
    const smallNoiseGenerator = new SimplexNoise(new Alea(seed * 5749438));

    return async function generateChunk({ x, y, size }: GenerateChunkOpts): Promise<PlanetChunk> {

        const grid: number[][] = [];
        const navGrid: TileType[][] = [];

        for (let i = 0; i <= size; i++) {
            const tileX = x * size + i;
            grid.push([]);
            for (let j = 0; j <= size; j++) {
                const tileY = y * size + j;
                let height = 0;
                /*

                // @grid[x][y] = Math.round(point * smoothness) / smoothness
                chunk.grid[i].push(Math.round(height * smoothness) / smoothness);
                */

                height += bigNoiseGenerator.noise2D(tileX * bigNoise, tileY * bigNoise) * bigNoiseScale;
                height += medNoiseGenerator.noise2D(tileX * medNoise, tileY * medNoise) * medNoiseScale;
                height += smallNoiseGenerator.noise2D(tileX * smallNoise, tileY * smallNoise) * smallNoiseScale;

                // fudge land near the water height to look butter
                if (height - waterHeight > -waterFudge && height - waterHeight < waterFudge) {
                    height = waterHeight + waterFudge;
                }
                grid[i].push(Math.round(height * smoothness) / smoothness);

            }
            // force a delay to make this async
            await delay(0);
        }

        // TODO nav grid

        return { x, y, size, grid, navGrid };
    };
}
