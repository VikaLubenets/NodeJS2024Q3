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
        this.commandManager = new CommandManager();
    }

    run(){
        this.sayHello();
        this.commandManager.print();

        this.rl.on('line', (input) => {
            if(input !== '.exit') {
                this.commandManager.execute(input);
            }
        });

        this.sayGoodbuy();
    }

    sayHello(){
        console.log(`Welcome to the File Manager, ${this.userName}!`);
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