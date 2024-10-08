import { cwd } from 'node:process';

export class Command {
    constructor(){

    }

    showPath(){
        console.log(`You are currently in ${cwd()}`);
    }
}