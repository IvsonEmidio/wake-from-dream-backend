import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

const rateLimitConfig = {
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again after a minute"
}

export default function publicRoutesMiddleware(app: Application) {
    app.use(helmet());
    app.use(cors());
    app.use(rateLimit(rateLimitConfig));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
}