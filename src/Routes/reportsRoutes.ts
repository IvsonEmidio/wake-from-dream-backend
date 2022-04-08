import { Application, Request, Response, NextFunction } from "express";
import ReportsController from "../Controllers/ReportsController";
import { body, validationResult } from "express-validator";

/**
 * Routes for /reports endpoint.
 * @param {Express.Application} app 
 */
export default function reportsRoutes(app: Application) {
    app.get(
        "/reports/:category?",
        (req: Request, res: Response) => {
            let category = req.params.category;
            let controller = new ReportsController();
            let reports = controller.getReportsByCategory(category);

            if (reports) {
                return res.status(200).json(reports);
            } else {
                return res.status(500).json({
                    message: 'An internal error has occurred.'
                });
            }
        }
    );

    app.post(
        "/report",
        validatePostBody,
        (req: Request, res: Response, next: NextFunction) => {
            //Check middleware errors.
            let errors = validationResult(req);
            let qntErrors = errors.array().length;

            if (qntErrors === 0) {
                next();
            } else {
                return res.status(500).json({
                    message: 'Check the fields and try again...',
                })
            }
        },
        (req: Request, res: Response) => {
            let controller = new ReportsController();
            let addReport = controller.addReport(req.body);

            if (addReport) {
                return res.status(200).json(addReport);
            }

            return res.status(500).json({
                message: 'An internal error has ocurred.'
            });
        }
    );

}

const validatePostBody = [
    body("title").isString().isLength({ max: 255 }),
    body("author").isString().isLength({ max: 255 }),
    body("date").isDate(),
    body("category").isString()
];
