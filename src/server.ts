import express,  { Application } from "express";
import reportsRoutes from "./Routes/reportsRoutes";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app: Application = express();
const port: number = 3000;
const rateLimitConfig = {
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after a minute"
}

//Middlewares
app.use(helmet());
app.use(cors());
app.use(rateLimit(rateLimitConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
reportsRoutes(app);

try {
    app.listen(port, (): void => {
        console.log(`Connected successfully on port ${port}`);
    });
} catch (error) {
    console.error(`Error occured: ${error}`);
}
