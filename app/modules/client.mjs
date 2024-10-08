import os from 'node:os';
import { argv, cwd } from 'node:process';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import process from 'node:process';
import CommandManager from './commandManager.mjs';

export default class Client {
    constructor(){
        this.rl = readline.createInterface({ input, output });
        this.homeDirectory = os.homedir();
        this.currentDirectory = cwd();
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
                this.commandManager.executeCommand(command, args);
                this.showPath();
            }
        });

        this.sayGoodbuy();
    }

    sayHello(){
        console.log(`Welcome to the File Manager, ${this.userName}!`);
    }

    showPath(direcory) {
        console.log(`You are currently in ${direcory ?? this.currentDirectory}`);
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