import os from 'node:os';
import path from 'node:path';
import * as readline from 'node:readline/promises';
import { access, constants } from 'node:fs/promises';
import { stdin as input, stdout as output, argv, cwd  } from 'node:process';
import process from 'node:process';
import CommandManager from './commandManager.mjs';
import EventEmitter from 'node:events';

export default class Client {
    constructor(){
        this.rl = readline.createInterface({ input, output });
        this.rootDirectory = path.parse(process.cwd()).root;
        this.currentDirectory = os.homedir();
        this.userNameArg = argv.slice(2).find(arg => arg.startsWith('--username='));
        this.userName = this.userNameArg ? this.userNameArg.split('=')[1] : 'user';
        this.emitter = new EventEmitter();
        this.commandManager = new CommandManager(this, this.emitter);
    }

    run (){
        this.eventsListener();
        this.sayHello();
        this.showPath();
        this.commandManager.print();

        this.rl.on('line', (input) => {
            if(input !== '.exit') {
                const [command, ...args] = input.trim().split(' ');
                this.commandManager.execute(command, args);
            }
        });

        this.sayGoodbye();
    }

    eventsListener(){
        this.emitter.on('changeDirectory', (directory) => {
            this.setCurrentDirectory(directory);
        });
    }

    getCurrentDirectory(){
        return this.currentDirectory;
    }

    setCurrentDirectory(directory) {
        const targetPath = path.isAbsolute(directory)
            ? path.resolve(directory)
            : path.resolve(this.currentDirectory, directory);
    
        access(targetPath, constants.F_OK)
            .then(() => {
                if (targetPath === this.rootDirectory) {
                    console.log("You are already at the root directory.");
                }
                this.currentDirectory = targetPath;
                this.showPath();
            })
            .catch(() => {
                console.log("Wrong directory. Try again");
            });
    }

    sayHello(){
        console.log(`Welcome to the File Manager, ${this.userName}!`);
    }

    showPath() {
        console.log(`You are currently in ${this.currentDirectory}`);
    }

    sayGoodbye(){
        process.on('SIGINT', () => process.exit());

        this.rl.on('line', (input) => {
            if(input === '.exit') {
                process.exit();
            }
        });

        process.on('exit', () => {
            console.log(`Thank you for using File Manager, ${this.userName}, goodbye!`);
        });
    }
}
