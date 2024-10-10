import os from 'node:os';

export default class OSManager {
    constructor(client, emitter) {
        this.client = client;
        this.emitter = emitter;
        this.commands = [
            {name: 'os', description: 'Operating system info', example: 'os --EOL | os --cpus'},
        ]
        this.flags = ['--EOL', '--cpus', '--homedir', '--username', '--architecture']
    }

    async os(args){
        if(args && args?.length !== 1){
            console.log('Operation failed: please provide a flag of the os system info you want to know (e.g. --EOL, --cpus, etc.)');
            return
        }

        const flag = args[0];

        if(this.isFlagValid(flag)){
            switch(flag){
                case '--EOL':
                    console.log(JSON.stringify(os.EOL));
                    this.client.showPath();
                    break;
                case '--cpus':
                    const cpusInfo = os.cpus();
                    console.log(`Overall amount of CPUs is ${cpusInfo.length}`);
                    cpusInfo.forEach((cpu, index) => {
                        console.log(`CPU ${index + 1}: ${cpu.model}, ${cpu.speed / 1000} GHz`);
                    });
                    break;
                case '--homedir':
                    console.log('--homedir is', os.homedir() ?? '')
                    this.client.showPath();
                    break;
                case '--username':
                    console.log('--username is', os.userInfo().username)
                    this.client.showPath();
                    break;
                case '--architecture':
                    console.log('--architecture is', os.arch())
                    this.client.showPath();
                    break;
                default:
                    console.log('There is no such flag');
                    break;
            }
        } else {
            console.log('Invalid flag. Please try again.');
        }
        
    }

    isFlagValid(flag){
        if(this.flags.includes(flag)){
            return true
        } else {
            return false
        }
    }
}