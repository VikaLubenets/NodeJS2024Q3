import { createReadStream, createWriteStream } from 'node:fs';
import { access, constants, writeFile, rename, unlink } from 'node:fs/promises';
import path from 'node:path';

export default class FileManager {
    constructor(client, emitter){
        this.client = client;
        this.emitter = emitter;
        this.commands = [
            {name: 'cat', description: "Read file and print it's content in console"},
            {name: 'add', description: "Create empty file in current working directory"},
            {name: 'rn', description: "Rename file"},
            {name: 'cp', description: "Copy file"},
            {name: 'mv', description: "Move file"},
            {name: 'rm', description: "Delete file"},
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

    async cp(args){
        if (!args || !Array.isArray(args) || args.length !== 2) {
            console.log('Operation failed: please provide a path to file and path to new directory');
            return;
        }

        const pathToFile = args[0];
        const pathToNewDirectory = args[1];

        const currentDirectory = this.client.getCurrentDirectory();
        const currentFilePath = path.isAbsolute(pathToFile)
            ? pathToFile
            : path.resolve(currentDirectory, pathToFile);
        const newFileDirectory = path.isAbsolute(pathToNewDirectory)
            ? pathToNewDirectory
            : path.resolve(currentDirectory, pathToNewDirectory);

        try {
            await access(currentFilePath, constants.F_OK);
            try {
                await access(newFileDirectory, constants.F_OK);
                const newFilePath = path.resolve(newFileDirectory, path.basename(currentFilePath));

                try {
                    await access(newFilePath, constants.F_OK);
                    console.log('Operation failed: this file already exits in new directory');
                } catch(err){
                    if(currentFilePath === newFilePath){
                        console.log('Operation failed: you are going to copy file in the same directory. Please add a path to new directory')
                    } else {
                        const streamReadable = createReadStream(currentFilePath);
                        const streamWritable = createWriteStream(newFilePath, { flags: 'w', encoding: 'utf-8' });
                        
                        streamReadable.pipe(streamWritable);

                        streamReadable.on('error', (err) => {
                            console.log(`Operation failed: ${err.message}`);
                        });
    
                        streamWritable.on('error', (err) => {
                            console.log(`Operation failed: ${err.message}`);
                        });
    
                        streamWritable.on('finish', () => {
                            console.log('File is copied!');
                            this.client.showPath();
                        });
                    }
                }
            } catch(err) {
                console.log('Operation failed: new file directory does not exist');
            }
        } catch {
            console.log('Operation failed: file does not exist');
        }
    }

    async mv(args){
        if (!args || !Array.isArray(args) || args.length !== 2) {
            console.log('Operation failed: please provide a path to file and path to new directory');
            return;
        }

        const pathToFile = args[0];
        const pathToNewDirectory = args[1];

        const currentDirectory = this.client.getCurrentDirectory();
        const currentFilePath = path.isAbsolute(pathToFile)
            ? pathToFile
            : path.resolve(currentDirectory, pathToFile);
        const newFileDirectory = path.isAbsolute(pathToNewDirectory)
            ? pathToNewDirectory
            : path.resolve(currentDirectory, pathToNewDirectory);

        try {
            await access(currentFilePath, constants.F_OK);
            try {
                await access(newFileDirectory, constants.F_OK);
                const newFilePath = path.resolve(newFileDirectory, path.basename(currentFilePath));

                try {
                    await access(newFilePath, constants.F_OK);
                    console.log('Operation failed: this file already exits in new directory');
                } catch(err){
                    if(currentFilePath === newFilePath){
                        console.log('Operation failed: you are going to move file in the same directory. Please add a path to new directory')
                    } else {
                        const streamReadable = createReadStream(currentFilePath);
                        const streamWritable = createWriteStream(newFilePath, { flags: 'w', encoding: 'utf-8' });
                        
                        streamReadable.pipe(streamWritable);

                        streamReadable.on('error', (err) => {
                            console.log(`Operation failed: ${err.message}`);
                        });
    
                        streamWritable.on('error', (err) => {
                            console.log(`Operation failed: ${err.message}`);
                        });
    
                        streamWritable.on('finish', async () => {
                            console.log('File is moved!');
                            this.client.showPath();
                            try {
                                await unlink(currentFilePath);
                            } catch (err) {
                                console.log(`Operation failed while deleting the original file: ${err.message}`);
                            }
                        });
                    }
                }
            } catch(err) {
                console.log('Operation failed: new file directory does not exist');
            }
        } catch {
            console.log('Operation failed: file does not exist');
        }
    }

    async rm(args){
        if (!args || !Array.isArray(args) || args.length !== 1) {
            console.log('Operation failed: please provide a single valid file path');
            return;
        }

        const pathToFile = args[0];
        const currentDirectory = this.client.getCurrentDirectory();
        const targetFilePath = path.isAbsolute(pathToFile)
            ? pathToFile
            : path.resolve(currentDirectory, pathToFile);

        try{
            await access(targetFilePath, constants.F_OK);
            try{
                await unlink(targetFilePath);
                console.log('File is deleted')
                this.client.showPath()
            } catch(err){
                console.log(`Operation failed: ${err.message}`);
            }

        } catch(err){
            console.log('Operation failed: file does not exist');
        }
    }

}