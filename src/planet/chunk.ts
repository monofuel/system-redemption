import { PlanetChunk } from '../types/SR';

interface GenerateChunkOpts {
    x: number;
    y: number;
    size: number;
}
function generateChunk({ x, y, size }: GenerateChunkOpts): PlanetChunk {
    return { x, y, size, grid: [], navGrid: [] };
}
