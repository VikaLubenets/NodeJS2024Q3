const { createHash } = await import('node:crypto');
import { createReadStream } from 'node:fs';
import { access, constants } from 'node:fs/promises';
import path from 'node:path';

export default class HashManager {
    constructor(client, emitter) {
        this.client = client;
        this.emitter = emitter;
        this.commands = [
            { name: 'hash', description: 'Calculate hash for file and print it into console' },
        ];
    }

    async hash(args) {
        if (!args || !Array.isArray(args) || args.length !== 1) {
            console.log('Operation failed: please provide a single valid file path');
            return;
        }

        const pathToFile = args[0];
        const currentDirectory = this.client.getCurrentDirectory();
        const targetFilePath = path.isAbsolute(pathToFile)
            ? pathToFile
            : path.resolve(currentDirectory, pathToFile);

        try {
            await access(targetFilePath, constants.F_OK);

            const hash = createHash('sha256');
            const output = createReadStream(targetFilePath);

            output.on('data', (chunk) => {
                hash.update(chunk);
            });

            output.on('end', () => {
                console.log(hash.digest('hex'));
                this.client.showPath();
            });

            output.on('error', (err) => {
                console.log(`Operation failed: ${err.message}`);
            });

        } catch (err) {
            console.log('Operation failed: file does not exist');
        }
    }
}
