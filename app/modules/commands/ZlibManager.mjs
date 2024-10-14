import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { access, constants } from 'node:fs/promises';
import path from 'node:path';

export default class ZlibManager {
    constructor(client, emitter) {
        this.client = client;
        this.emitter = emitter;
        this.commands = [
            { name: 'compress', description: 'Compress file', example: 'compress ./text.txt ./text.br' },
            { name: 'decompress', description: 'Decompress file', example: 'decompress ./text.br ./text2.txt' },
        ];
    }

    async compress(args) {
        if (!args || !Array.isArray(args) || args.length !== 2) {
            console.log('Operation failed: please provide a path to file and path to destination');
            return;
        }

        const pathToFile = args[0];
        const pathToDestination = args[1];

        const currentDirectory = this.client.getCurrentDirectory();
        const currentFilePath = path.isAbsolute(pathToFile)
            ? pathToFile
            : path.resolve(currentDirectory, pathToFile);
        const destinationDir = path.isAbsolute(pathToDestination)
            ? path.dirname(pathToDestination)
            : path.resolve(currentDirectory, path.dirname(pathToDestination));
        const newFileDestination = path.resolve(destinationDir, path.basename(pathToDestination));

        try {
            await access(currentFilePath, constants.F_OK);

            try {
                await access(destinationDir, constants.F_OK)

                const brotli = createBrotliCompress();
                const source = createReadStream(currentFilePath);
                const destination = createWriteStream(newFileDestination);

                await pipeline(source, brotli, destination);
                console.log(`File compressed successfully: ${newFileDestination}`);
                this.client.showPath();

            } catch (err) {
                console.log(`Operation failed: ${err.message}`);
            }

        } catch (err) {
            console.log('Operation failed: file does not exist');
        }
    }

    async decompress(args) {
        if (!args || !Array.isArray(args) || args.length !== 2) {
            console.log('Operation failed: please provide a path to file and path to destination');
            return;
        }

        const pathToFile = args[0];
        const pathToDestination = args[1];

        const currentDirectory = this.client.getCurrentDirectory();
        const currentFilePath = path.isAbsolute(pathToFile)
            ? pathToFile
            : path.resolve(currentDirectory, pathToFile);
        const destinationDir = path.isAbsolute(pathToDestination)
            ? path.dirname(pathToDestination)
            : path.resolve(currentDirectory, path.dirname(pathToDestination));
        const newFileDestination = path.resolve(destinationDir, path.basename(pathToDestination));

        try {
            await access(currentFilePath, constants.F_OK);

            try {
                await access(destinationDir, constants.F_OK)

                const brotli = createBrotliDecompress();
                const source = createReadStream(currentFilePath);
                const destination = createWriteStream(newFileDestination);

                await pipeline(source, brotli, destination);
                console.log(`File decompressed successfully: ${newFileDestination}`);
                this.client.showPath();

            } catch (err) {
                console.log(`Operation failed: ${err.message}`);
            }

        } catch (err) {
            console.log('Operation failed: file does not exist');
        }
    }
}
