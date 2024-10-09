import { createReadStream } from 'node:fs';
import { access, constants } from 'node:fs/promises';
import path from 'node:path';

export default class FileManager {
    constructor(client, emitter){
        this.client = client;
        this.emitter = emitter;
        this.commands = [
            {name: 'cat', description: "Read file and print it's content in console"},
        ]
    }

    cat(args) {
        if (!args || !Array.isArray(args) || args.length !== 1) {
            console.log('Operation failed: please provide a single valid file path');
            return;
        }

        const pathToFile = args[0];
        const currentDirectory = this.client.getCurrentDirectory();
        const targetFilePath = path.isAbsolute(pathToFile)
            ? pathToFile
            : path.resolve(currentDirectory, pathToFile);

        access(targetFilePath, constants.F_OK)
            .then(() => {
                const stream = createReadStream(targetFilePath);

                stream.on('data', (chunk) => {
                    process.stdout.write(chunk);
                });

                stream.on('end', () => {
                    console.log('\n');
                    this.client.showPath();
                });

                stream.on('error', (err) => {
                    console.log(`Operation failed: ${err.message}`);
                });
            })
            .catch(() => {
                console.log('Operation failed: file does not exist');
            });
    }

}