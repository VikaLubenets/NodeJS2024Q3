import { argv } from 'node:process';

const sayHello = () => {
    const userNameArg = argv.slice(2).find(arg => arg.startsWith('--username='));
    const userName = userNameArg ? userNameArg.split('=')[1] : 'user';
    console.log(`Welcome to the File Manager, ${userName ?? 'user'}!`);
};

export default sayHello;