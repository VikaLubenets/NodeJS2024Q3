import os from 'node:os';
import { argv } from 'node:process';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import process from 'node:process';

export default class Client {
    constructor(){
        this.homeDirectory = os.homedir()
        this.userNameArg = argv.slice(2).find(arg => arg.startsWith('--username='));
        this.userName = this.userNameArg ? this.userNameArg.split('=')[1] : 'user';
        this.rl = readline.createInterface({ input, output });
    }

    run(){


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