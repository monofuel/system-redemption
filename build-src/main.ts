
import fs, { Stats } from 'fs';
import { ncp, Options } from 'ncp';
import JSZip from 'jszip';
// @ts-ignore
const zipdir = require('zip-dir');

async function copyDir(source: string, destination: string, options: Options) {
    await new Promise((resolve, reject) => {
        ncp(source, destination, options, (err: Error) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        })
    })
}

async function main() {
    console.log('starting build script');

    const stat = fs.statSync("./node_modules");
    if (!stat || !stat.isDirectory) {
        throw new Error('main.ts must be ran from project root');
    }
    if (!fs.existsSync('./build')) {
        fs.mkdirSync('./build');
    }
    if (!fs.existsSync('./build/client')) {
        fs.mkdirSync('./build/client');
    }


    await copyFiles();

    await packageAssets();
}

async function copyFiles() {
    const opts: Options = {
        clobber: false,
        stopOnErr: true,
    }
    await copyDir("node_modules/@webcomponents/webcomponentsjs", "build/client/webcomponentsjs", opts);
    await copyDir("node_modules/@fortawesome/fontawesome-free", "build/client/fontawesome-free", opts);

    await copyDir("node_modules/three/build", "build/client/three", opts);
    fs.copyFileSync("node_modules/three/examples/js/loaders/GLTFLoader.js", "build/client/GLTFLoader.js");
    fs.copyFileSync("node_modules/lodash/lodash.min.js", "build/client/lodash.min.js");
    fs.copyFileSync("node_modules/lodash/lodash.js", "build/client/lodash.js");
    fs.copyFileSync("node_modules/dat.gui/build/dat.gui.min.js", "build/client/dat.gui.min.js");
    fs.copyFileSync("node_modules/three-ziploader/build/ziploader.min.js", "build/client/ziploader.min.js");

    console.log('copied files');
}

async function packageAssets() {
    const zip = new JSZip();

    const folders = [
        /gltf/,
    ];

    await new Promise((resolve, reject) => {
        zipdir('./rts-assets/', {
            saveTo: './build/client/assets.zip',
            each: (filePath: string) => {
                console.log('packaging: ' + filePath);
            },
            filter: (filePath: string, stat: Stats) => {
                return /gltf/.test(filePath);

            }
        }, (err: Error) => {
            if (err) {
                return reject(err);
            }
            resolve();
        })
    })
    /*
    await new Promise((resolve, reject) => {
        zip
            .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
            .pipe(fs.createWriteStream('build/client/assets.zip'))
            .on('finish', resolve)
            .on('error', reject);
    });
    */
    console.log('prepared assets');

}


main().catch((err) => {
    console.error(err);
    process.exit(-1);
});