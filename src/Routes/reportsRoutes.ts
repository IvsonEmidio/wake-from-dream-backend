import { Application } from "express";
import ReportsController from "../Controllers/ReportsController";

/**
 * Routes for /report endpoint.
 * @param {Express.Application} app
 */
export default function reportsRoutes(app: Application) {
    const controller = new ReportsController();

    app.post(
        "/report",
        controller.validateBody("createReport"),
        controller.createReport.bind(controller)
    );

    app.get(
        "/report/:id",
        controller.validateParams("getReport"),
        controller.getReport.bind(controller)
    );

    app.delete(
        "/report/:id",
        controller.validateParams("deleteReport"),
        controller.deleteReport.bind(controller)
    );

    app.put(
        "/report/:id",
        controller.validateBody("updateReport"),
        controller.validateParams("updateReport"),
        controller.updateReport.bind(controller)
    );

    app.get(
        "/reports/:pageNum",
        controller.validateParams('getAllReports'),
        controller.getAllReports.bind(controller),
    );
}
