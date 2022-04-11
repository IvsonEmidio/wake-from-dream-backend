import { allowedEvents } from "../Controllers/ReportsController";
import pool from "../Database/pool";
import AmericanStrategy from "../Domain/Strategy/Reports/AmericanStrategy";
import BrazilianStrategy from "../Domain/Strategy/Reports/BrazilianStrategy";
import IReportStrategy from "../Domain/StrategyInterfaces/IReportsStrategy";
import { parseArrayToQueryStringLine, parseEventsArrayToObject } from "../Helpers/arrayManipulation";
import { IReportEventsObj, IReportPostParameters } from "../Interfaces/IReports";

export default class ReportsService {

    /**
     * Creates a new report on database. 
     * @param {IReportPostParameters} data 
     */
    public async createSingleReport(data: IReportPostParameters): Promise<{
        success: boolean,
        newId?: number,
        errors?: unknown
    }> {
        try {
            await pool.query("BEGIN");

            //Insert new row on 'reports' table.
            let reportQuery = `INSERT INTO reports
             (title, author_id, category_id, date)
              VALUES($1, $2, $3, $4) RETURNING id`;
            let reportQueryValues = [
                data.title,
                data.author_id,
                data.category_id,
                data.date,
            ];
            let insertReport = await pool.query(reportQuery, reportQueryValues);
            const generatedReportId = insertReport.rows[0].id;

            //Insert new relational row on 'reports_texts' table.
            let reportTextQuery = `INSERT INTO reports_texts
             (report_id, full_text, final_things)
              VALUES($1, $2, $3)`;
            let reportTextQueryValues = [
                generatedReportId,
                data.full_text,
                data.final_things,
            ];
            await pool.query(reportTextQuery, reportTextQueryValues);

            //Insert new relational row on 'reports_events' table
            let events: IReportEventsObj = parseEventsArrayToObject(data.events);
            let eventQuery = `INSERT INTO reports_events
             (report_id, lights, out_of_body, seen_spirits, tunnel_vision, watched_life_movie,
                 feel_peace_and_love, dont_want_come_back, no_more_death_fear, seen_death_parents,
                  other_dimension, need_finish_mission)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;
            let eventQueryValues = [
                generatedReportId,
                events.light,
                events.out_of_body,
                events.seen_spirits,
                events.tunnel_vision,
                events.watched_life_movie,
                events.feel_peace_and_love,
                events.dont_want_come_back,
                events.no_more_death_fear,
                events.seen_death_parents,
                events.other_dimension,
                events.need_finish_mission,
            ];
            await pool.query(eventQuery, eventQueryValues);

            await pool.query("COMMIT");

            return {
                success: true,
                newId: generatedReportId
            };
        } catch (err) {
            await pool.query("ROLLBACK");
            return {
                success: false,
                errors: err,
            };
        }
    }

    /**
     * Finds an report by ID.
     * @param {number} id 
     */
    public async getSingleReport(id: number): Promise<{
        success: boolean,
        data?: object,
        errors?: { message: string }
    }> {
        try {
            let eventsLine = parseArrayToQueryStringLine(allowedEvents);
            let query = `
            SELECT title, date, category_id, author_id,
            reports_categories.name AS category_name,
            reports_authors.name AS author_name, reports_authors.nationality AS author_nationality,
            full_text, final_things,
            ${eventsLine}
            FROM     reports
            JOIN     reports_categories
            ON       reports_categories.id = category_id
            JOIN     reports_authors
            ON       reports_authors.id = author_id
            JOIN     reports_texts
            ON       reports_texts.report_id = reports.id
            JOIN     reports_events
            ON       reports_events.report_id = reports.id
            WHERE    reports.id = $1
            `;
            let values = [id];

            let response = await pool.query(query, values);
            if (response.rowCount > 0) {
                let row = response.rows[0];
                return {
                    success: true,
                    data: {
                        title: row.title,
                        date: row.date,
                        category_info: {
                            category_id: row.category_id,
                            category_name: row.category_name
                        },
                        author_info: {
                            author_id: row.author_id,
                            author_name: row.author_name,
                            author_nationality: row.author_nationality,
                        },
                        texts: {
                            full_text: row.full_text,
                            final_things: row.final_things
                        },
                        events: {
                            lights: row.lights,
                            out_of_body: row.out_of_body,
                            seen_spirits: row.seen_spirits,
                            tunnel_vision: row.tunnel_vision,
                            watched_life_movie: row.watched_life_movie,
                            feel_peace_and_love: row.feel_peace_and_love,
                            dont_want_come_back: row.dont_want_come_back,
                            no_more_death_fear: row.no_more_death_fear,
                            seen_death_parents: row.seen_death_parents,
                            other_dimension: row.other_dimension,
                            need_finish_mission: row.need_finish_mission
                        }
                    }
                }
            } else {
                return {
                    success: false,
                    errors: {
                        message: "The report has not found, please, check the id and try again."
                    }
                }
            }
        } catch (err) {
            return {
                success: false,
                errors: {
                    message: "An unknown error has occurred on database, please, try again later."
                }
            }
        }
    }

    /**
     * Get an instance of IReportsStrategy Interface -
     * according to report category name.
     * @param {string} category
     * @returns {object}
     */
    public getStrategyByCategory(category: string): IReportStrategy {
        switch (category) {
            case 'American':
                return new AmericanStrategy();
            case 'Brazilian':
                return new BrazilianStrategy();
            default:
                return new BrazilianStrategy();
        }
    }
}