
import fs from 'fs';
import { ncp } from 'ncp';
import { promisify } from 'util';

const copyDir = promisify(ncp);

async function main() {
    console.log('starting build script');

    const stat = fs.statSync("./node_modules");
    if (!stat || !stat.isDirectory) {
        throw new Error('main.ts must be ran from project root');
    }
    if (!fs.existsSync('./build/client')) {
        fs.mkdirSync('./build/client');
    }
    await copyDir("node_modules/@webcomponents/webcomponentsjs", "build/client/webcomponentsjs");
    await copyDir("node_modules/@fortawesome/fontawesome-free", "build/client/fontawesome-free");
    await copyDir("node_modules/three/build", "build/client/three");
    await copyDir("node_modules/lodash/lodash.min.js", "build/client/lodash.min.js");
    await copyDir("node_modules/lodash/lodash.js", "build/client/lodash.js");
    await copyDir("node_modules/dat.gui/build/dat.gui.min.js", "build/client/dat.gui.min.js");

    // TODO package 3D assets
}

main().catch((err) => {
    console.error(err);
    process.exit(-1);
});