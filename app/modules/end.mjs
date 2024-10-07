import { argv } from 'node:process';
import readline from 'node:readline';

const sayGoodBuy = () => {
    const userNameArg = argv.slice(2).find(arg => arg.startsWith('--username='));
    const userName = userNameArg ? userNameArg.split('=')[1] : 'user';

    const readLine = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const showGoodbuy = () => {
        console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
        process.exit();
    }

    process.on('SIGINT', showGoodbuy);
    readLine.on('line', (input) => {
        if(input === '.exit') showGoodbuy()
    });
};

export default sayGoodBuy;