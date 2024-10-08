export default class CommandManager {
    constructor(){
        this.commands = [];
    }

    execute(command){
        
    }

    print(){
        if(this.commands.length > 0){
            this.commands.map(command => console.log(command))
        }
    }

}