import { Application, Request, Response, NextFunction } from "express";
import ReportsController from "../Controllers/ReportsController";
import expressValidator, { body, check, sanitizeBody, validationResult } from "express-validator";

/**
 * Routes for /reports endpoint.
 * @param {Express.Application} app 
 */
export default function reportsRoutes(app: Application) {
    //Get
    app.get(
        "/reports/:category?",
        (req: Request, res: Response) => {
            let categoryInput = req.params.category;
            let controller = new ReportsController();
            let reportByCategory = controller.getReports(categoryInput);

            if (reportByCategory) {
                return res.status(200).json(reportByCategory);
            } else {
                return res.status(500).json({
                    message: 'An internal error has occurred.'
                });
            }
        }
    );

    //Post
    app.post(
        "/report",
        validatePostBody, (req: Request, res: Response, next: NextFunction) => {
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
        (req: Request, res: Response, next: NextFunction) => {
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

};

const validatePostBody = [
    body("title").isString().isLength({ max: 255 }),
    body("author").isString().isLength({ max: 255 }),
    body("date").isDate(),
    body("category").isString()
];
