import path from 'node:path';
import { access, constants } from 'node:fs/promises';

export default class Navigator {
    constructor(client, emitter) {
        this.client = client;
        this.emitter = emitter;
    }

    up() {
        const currentDirectory = this.client.getCurrentDirectory();
        const upDirectory = path.resolve(currentDirectory, '..');
        this.emitter.emit('changeDirectory', upDirectory);
    }

    cd(args) {
        if (!args || !Array.isArray(args) || args.length !== 1) {
            console.log('Operation failed: please provide a single valid directory path');
            return;
        }
    
        const directory = args[0];
        const currentDirectory = this.client.getCurrentDirectory();
        const targetDirectory = path.isAbsolute(directory)
            ? directory
            : path.resolve(currentDirectory, directory);
    
        access(targetDirectory, constants.F_OK)
            .then(() => {
                this.emitter.emit('changeDirectory', targetDirectory);
            })
            .catch(() => {
                console.log('Operation failed: target directory does not exist');
            });
    }

    ls() {
        // Реализация команды ls
    }
}

