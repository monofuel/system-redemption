import fs from 'fs';

export async function loadFile(path: string): Promise<string | Buffer> {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
}
