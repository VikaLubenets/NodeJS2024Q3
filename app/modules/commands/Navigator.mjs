import path from 'node:path';
import { access, constants, readdir } from 'node:fs/promises';

export default class Navigator {
    constructor(client, emitter) {
        this.client = client;
        this.emitter = emitter;
    }

    up(args) {
        if(args && args?.length > 0){
            console.log('Operation failed: you do not have to pass any arguments to up command');
            return
        }
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

    ls(args) {
        if (args && args.length > 0) {
            console.log('Operation failed: you do not have to pass any arguments to ls command');
            return;
        }
    
        const currentDirectory = this.client.getCurrentDirectory();
        
        access(currentDirectory, constants.F_OK)
            .then(() => {
                return readdir(currentDirectory, { withFileTypes: true });
            })
            .then((files) => {
                const tableToShow = files.map(file => ({
                    name: file.name,
                    type: file.isFile() ? 'file' : 'directory'
                }));
                console.table(tableToShow.sort((a, b) => a.type.localeCompare(b.type)));
            })
            .catch((err) => {
                console.log('Operation failed: target directory does not exist');
            });
    }
    
}

