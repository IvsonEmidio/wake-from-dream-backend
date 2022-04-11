import express, { Application } from "express";
import reportsRoutes from "./Routes/reportsRoutes";
import publicRoutesMiddleware from "./Middlewares/publicRoutes";

const app: Application = express();
const port: number = 3000;

//Middlewares
publicRoutesMiddleware(app);

//Routes
reportsRoutes(app);

try {
    app.listen(port, (): void => {
        console.log(`Connected successfully on port ${port}`);
    });
} catch (error) {
    console.error(`Error occured: ${error}`);
}
