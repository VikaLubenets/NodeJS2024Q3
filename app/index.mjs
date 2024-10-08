import Client from "./modules/client.mjs";

const App = () => {
    const client = new Client();
    client.sayHello();
    client.run();
    client.sayGoodbuy();
};

App();