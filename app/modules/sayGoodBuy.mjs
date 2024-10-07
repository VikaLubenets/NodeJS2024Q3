import { argv } from 'node:process';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import process from 'node:process';

const sayGoodBuy = () => {
    const userNameArg = argv.slice(2).find(arg => arg.startsWith('--username='));
    const userName = userNameArg ? userNameArg.split('=')[1] : 'user';

    const rl = readline.createInterface({ input, output });

    process.on('SIGINT', () => {
        process.exit();
    });

    rl.on('line', (input) => {
        if(input === '.exit') {
            process.exit();
        }
    });

    process.on('exit', () => {
        console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
    })
};

export default sayGoodBuy;