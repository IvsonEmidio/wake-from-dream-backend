import pool from "../Database/pool";
import Reports from "../Domain/ReportsContext";
import { IReportEventsObj, IReportPostParameters } from "../Interfaces/IReports";
import { body, check, Result, ValidationChain, validationResult } from "express-validator";
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
                return res.status(400).json(
                    {
                        status: 0,
                        message: `Check the fields and try again`,
                        errors: errors.array()
                    });
            }
            let data: IReportPostParameters = req.body;

            try {
                await pool.query('BEGIN');

                //Insert new row on 'reports' table.
                let reportQuery = `INSERT INTO reports (title, author_id, category_id, date) VALUES($1, $2, $3, $4) RETURNING id`;
                let reportQueryValues = [data.title, data.author_id, data.category_id, data.date];
                let insertReport = await pool.query(reportQuery, reportQueryValues);
                const generatedReportId = insertReport.rows[0].id;

                //Insert new row on 'reports_texts' table.
                let reportTextQuery = `INSERT INTO reports_texts (report_id, full_text, final_things) VALUES($1, $2, $3)`;
                let reportTextQueryValues = [generatedReportId, data.full_text, data.final_things];
                await pool.query(reportTextQuery, reportTextQueryValues);

                //Insert new row on 'reports_events' table
                let events: IReportEventsObj = this.reportsService.parseEventsArrayToObject(data.events);
                let eventQuery = `INSERT INTO reports_events (report_id, lights, out_of_body, seen_spirits, tunnel_vision, watched_life_movie, feel_peace_and_love, dont_want_come_back, no_more_death_fear, seen_death_parents, other_dimension, need_finish_mission) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;
                let eventQueryValues = [
                    generatedReportId, events.light, events.out_of_body, events.seen_spirits,
                    events.tunnel_vision, events.watched_life_movie, events.feel_peace_and_love,
                    events.dont_want_come_back, events.no_more_death_fear, events.seen_death_parents,
                    events.other_dimension, events.need_finish_mission];
                await pool.query(eventQuery, eventQueryValues)

                await pool.query('COMMIT');

                return res.status(201).json({
                    status: 1,
                    message: 'Successfully created new report.',
                    data: {
                        id: generatedReportId
                    }
                });
            } catch (err) {
                await pool.query('ROLLBACK');
                res.status(502).json({
                    status: 0,
                    message: 'Failed to insert new report on database, check the fields and try again.',
                    errors: err,
                })
            }
        } catch (err) {
            res.status(500).json({
                status: 0,
                message: 'An unknown error has occurred when validating the fields.',
                errors: err,
            })
        }
    }


    public validateBody(method: string): Array<ValidationChain> {
        const allowedEvents: Array<string> = [
            'lights', 'out_of_body', 'seen_spirits', 'tunnel_vision', 'watched_life_movie',
            'feel_peace_and_love', 'dont_want_come_back', 'no_more_death_fear', 'seen_death_parents',
            'other_dimension', 'need_finish_mission'
        ];

        switch (method) {
            case 'createReport':
                return [
                    body('title', `Invalid field 'title'.`).isString().isLength({ min: 10, max: 255 }),
                    body('author_id', `Invalid field 'author_id'.`).optional().isInt(),
                    body('category_id', `Invalid field 'category_id'.`).isInt(),
                    body('date', `invalid field 'date'`).isDate(),
                    body('full_text', `invalid field 'full_text'`).isString().isLength(({ min: 50 })),
                    body('final_things', `invalid field 'final_things'`).optional().isString(),
                    body('events', `invalid field 'events'`).optional().isArray({ min: 1 }),
                    check('events.*', `Invalid event, check list of allowed events.`).isString().isIn(allowedEvents)
                ];
            default:
                return [];
        }
    }
}