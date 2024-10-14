import Client from "./modules/client.mjs";

const App = () => {
    const client = new Client();
    client.run();
};

App();