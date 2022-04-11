import { Application } from "express";
import ReportsController from "../Controllers/ReportsController";

/**
 * Routes for /report endpoint.
 * @param {Express.Application} app 
 */
export default function reportsRoutes(app: Application) {
    const controller = new ReportsController();

    app.post(
        '/report',
        controller.validateBody('createReport'),
        controller.createReport.bind(controller)
    );

    app.get(
        '/report/{id}',

    )
}