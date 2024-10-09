import path from 'node:path';

export default class Navigator {
    constructor(client, emitter){
        this.client = client;
        this.emitter = emitter;
    }

    up(){
        const currentDirectory = this.client.getCurrentDirectory();
        const upDirectory = path.resolve(currentDirectory, '..');
        this.emitter.emit('changeDirectory', upDirectory);
    }

    cd(){
      
    }

    ls(){
       
    }
}
