import { createReadStream } from 'node:fs';
import { access, constants, writeFile, rename } from 'node:fs/promises';
import path from 'node:path';

export default class FileManager {
    constructor(client, emitter){
        this.client = client;
        this.emitter = emitter;
        this.commands = [
            {name: 'cat', description: "Read file and print it's content in console"},
            {name: 'add', description: "Create empty file in current working directory"},
            {name: 'rn', description: "Rename file"},
        ]
    }

    async cat(args) {
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
            await access(targetFilePath, constants.F_OK)
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
        } catch(err){
            console.log('Operation failed: file does not exist');
        }
    }

    async add(args) {
        if (!args || !Array.isArray(args) || args.length !== 1) {
            console.log('Operation failed: please provide a single valid file name');
            return;
        }

        const fileName = args[0];
        const currentDirectory = this.client.getCurrentDirectory();
        const targetPath = path.resolve(currentDirectory, fileName);

        try {
            await access(targetPath, constants.F_OK);
            console.log('Operation failed: file already exists');
        } catch {
            try {
                await writeFile(targetPath, '');
                console.log(`File '${fileName}' created successfully.`);
                this.client.showPath();
            } catch (err) {
                console.log(`Operation failed: ${err.message}`);
            }
        }
    }

    async rn(args) {
        if (!args || !Array.isArray(args) || args.length !== 2) {
            console.log('Operation failed: please provide a path to the file and its new name');
            return;
        }

        const pathToFile = args[0];
        const newFileName = args[1];

        const currentDirectory = this.client.getCurrentDirectory();
        const targetFilePathOld = path.isAbsolute(pathToFile)
            ? pathToFile
            : path.resolve(currentDirectory, pathToFile);
        const targetFilePathNew = path.resolve(path.dirname(targetFilePathOld), newFileName);

        try {
            await access(targetFilePathOld, constants.F_OK);
            try {
                await access(targetFilePathNew, constants.F_OK);
                console.log('Operation failed: file with the new name already exists');
            } catch {
                await rename(targetFilePathOld, targetFilePathNew);
                console.log('Rename is completed successfully!');
                this.client.showPath();
            }
        } catch {
            console.log('Operation failed: file does not exist');
        }
    }

}