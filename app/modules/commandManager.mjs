import path from 'node:path'

export default class CommandManager {
    constructor(client){
        this.client = client;
        this.commands = ['up', 'cd', 'ls'];
    }

    execute(command, args){
        if(this.commands.includes(command)){
            switch(command){
                case 'up': this.up()
                break

            case '.exit':
                this.client.sayGoodbuy();
                break;
    
              default:
                console.log('there is no fn yet for such command')
                break
            }

        } else {
            console.log('Invalid input. Please try again')
        }
    }

    print(){
        if(this.commands.length > 0){
            this.commands.map(command => console.log(command))
        }
    }

    up(){
        const currentDirectory = this.client.getCurrentDirectory();
        const upDirectory = path.resolve(currentDirectory, '..');
        this.client.setCurrentDirectory(upDirectory);
    }

}