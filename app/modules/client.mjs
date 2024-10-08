import os from 'node:os';
import path from 'node:path';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output, argv, cwd  } from 'node:process';
import process from 'node:process';
import CommandManager from './commandManager.mjs';

export default class Client {
    constructor(){
        this.rl = readline.createInterface({ input, output });
        this.rootDirectory = path.parse(cwd()).root;
        this.currentDirectory = os.homedir();
        this.userNameArg = argv.slice(2).find(arg => arg.startsWith('--username='));
        this.userName = this.userNameArg ? this.userNameArg.split('=')[1] : 'user';
        this.commandManager = new CommandManager(this);
    }

    run (){
        this.sayHello();
        this.showPath(this.homeDirectory);
        this.commandManager.print();

        this.rl.on('line', (input) => {
            if(input !== '.exit') {
                const [command, ...args] = input.trim().split(' ');
                this.commandManager.execute(command, args);
                this.showPath();
            }
        });

        this.sayGoodbuy();
    }

    getCurrentDirectory(){
        return this.currentDirectory
    }

    setCurrentDirectory(directory){
        const pathResolved = path.resolve(directory);

        if (pathResolved === this.rootDirectory) {
            console.log("You are already at the root directory.");
        } else if(pathResolved.startsWith(this.rootDirectory)){
            this.currentDirectory = pathResolved;
        } else {
            console.log("Wrong directory. Try again");
        }
    }

    sayHello(){
        console.log(`Welcome to the File Manager, ${this.userName}!`);
    }

    showPath() {
        console.log(`You are currently in ${this.currentDirectory}`);
    }

    sayGoodbuy(){
        process.on('SIGINT', process.exit);

        this.rl.on('line', (input) => {
            if(input === '.exit') {
                process.exit();
            }
        });

        process.on('exit', () => {
            console.log(`Thank you for using File Manager, ${this.userName}, goodbye!`);
        })
    }
}