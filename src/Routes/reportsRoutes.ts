import { Application } from "express";
import ReportsController from "../Controllers/ReportsController";

/**
 * Routes for /report and /reports endpoint.
 * @param {Express.Application} app
 */
export default function reportsRoutes(app: Application) {
    const controller = new ReportsController();

    app.get(
        '/reports/:page',
        controller.validateParams('all'),
        controller.getAllReports.bind(controller),
    );

    app.post(
        '/report',
        controller.validateBody('create'),
        controller.create.bind(controller)
    );

    app.get(
        '/report/:id',
        controller.validateParams('get'),
        controller.get.bind(controller)
    );

    app.delete(
        '/report/:id',
        controller.validateParams('delete'),
        controller.deleteReport.bind(controller)
    );

    app.put(
        '/report/:id',
        controller.validateBody('update'),
        controller.validateParams('update'),
        controller.updateReport.bind(controller)
    );


}
