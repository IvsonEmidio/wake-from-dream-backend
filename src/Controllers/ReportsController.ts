import {
    IReportPostParameters,
} from "../Interfaces/IReports";
import {
    body,
    check,
    param,
    ValidationChain,
    validationResult,
} from "express-validator";
import { Request, Response } from "express";
import ReportsService from "../Services/ReportsService";

export default class ReportsController {
    reportsService: ReportsService;

    constructor() {
        this.reportsService = new ReportsService();
    }

    /**
     * Adds a new single report on database.
     * @param {Request} req
     * @param {Response} req
     */
    public async createReport(req: Request, res: Response) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: 0,
                    message: 'Check the fields and try again',
                    errors: errors.array(),
                });
            }

            let data: IReportPostParameters = req.body;
            let dbOperation = await this.reportsService.createSingleReport(data);
            if (dbOperation.success) {
                return res.status(200).json({
                    status: 1,
                    message: 'New report successfully created on database',
                    data: {
                        id: dbOperation.newId
                    }
                });
            } else {
                return res.status(500).json({
                    status: 0,
                    errors: {
                        message: 'An error has occurred when creating a new report on database',
                    }
                });
            }
        } catch (err) {
            res.status(500).json({
                status: 0,
                errors: {
                    message: "An unknown error has occurred when validating the fields.",
                }
            });
        }
    }

    public async getReport(req: Request, res: Response) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: 0,
                    message: "Check the fields and try again...",
                    errors: errors.array()
                });
            }

            let reportId = parseInt(req.params.id);
            let dbOperation = await this.reportsService.getSingleReport(reportId);
            if (dbOperation.success) {
                res.status(200).json({
                    status: 1,
                    message: "Success",
                    data: dbOperation.data
                })
            } else {
                let errorMsg = dbOperation.errors?.message;
                let statusCode: number = 500;
                if (errorMsg === "The report has not found, please, check the id and try again.") {
                    statusCode = 404;
                }

                res.status(statusCode).json({
                    status: 0,
                    errors: dbOperation.errors
                })
            }
        } catch (err) {
            return res.status(500).json({
                status: 0,
                errors: {
                    message: "An unknown error has occurred, please, try again later",
                }
            })
        }
    }

    public validateParams(method: string): Array<ValidationChain> {
        switch (method) {
            case "getReport":
                return [
                    param('id', 'the report id need to be an integer.').isInt()
                ];
            default:
                return []
        }
    }

    public validateBody(method: string): Array<ValidationChain> {
        switch (method) {
            case "createReport":
                return [
                    body("title", `Invalid field 'title'.`)
                        .isString()
                        .isLength({ min: 10, max: 255 }),
                    body("author_id", `Invalid field 'author_id'.`).optional().isInt(),
                    body("category_id", `Invalid field 'category_id'.`).isInt(),
                    body("date", `invalid field 'date'`).isDate(),
                    body("full_text", `invalid field 'full_text'`)
                        .isString()
                        .isLength({ min: 50 }),
                    body("final_things", `invalid field 'final_things'`)
                        .optional()
                        .isString(),
                    body("events", `invalid field 'events'`)
                        .optional()
                        .isArray({ min: 1 }),
                    check("events.*", `Invalid event, check list of allowed events.`)
                        .isString()
                        .isIn(allowedEvents),
                ];
            default:
                return [];
        }
    }
}

export const allowedEvents: Array<string> = [
    "lights",
    "out_of_body",
    "seen_spirits",
    "tunnel_vision",
    "watched_life_movie",
    "feel_peace_and_love",
    "dont_want_come_back",
    "no_more_death_fear",
    "seen_death_parents",
    "other_dimension",
    "need_finish_mission",
];