import Navigator from './commands/Navigator.mjs';

export default class CommandManager {
    constructor(client, emitter){
        this.client = client;
        this.emitter = emitter;
        this.commands = ['up', 'cd', 'ls'];
        this.navigator = new Navigator(client, emitter);
    }

    execute(command, args){
        if(this.commands.includes(command)){
            switch(command){
                case 'up':
                    this.navigator.up();
                    break;
                case 'cd':
                    this.navigator.cd(args);
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
            this.commands.map(command => console.log(command));
        }
    }
}
