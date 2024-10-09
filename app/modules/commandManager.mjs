import Navigator from './commands/Navigator.mjs';

export default class CommandManager {
    constructor(client, emitter){
        this.client = client;
        this.emitter = emitter;
        this.navigator = new Navigator(client, emitter);
        this.commands = [...this.navigator.commands];
        this.commandsNames = this.commands.map(el => el.name)
    }

    execute(command, args){
        if(this.commandsNames.includes(command)){
            switch(command){
                case 'up':
                    this.navigator.up(args);
                    break;
                case 'cd':
                    this.navigator.cd(args);
                    break;
                case 'ls':
                    this.navigator.ls(args);
                    break;
                case '.exit':
                    this.client.sayGoodbye();
                    break;
                default:
                    console.log('There is no function yet for such command');
                    break;
            }
        } else {
            console.log('Invalid input. Please try again');
        }
    }

    print(){
        if(this.commands.length > 0){
            console.table(this.commands)
        }
    }
}
