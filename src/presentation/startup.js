import App from "./app.js";

const app = new App();

app.configureMiddlewares();
app.configureEndpoints();
app.listen();
