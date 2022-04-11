import pool from "../Database/pool";
import AmericanStrategy from "../Domain/Strategy/Reports/AmericanStrategy";
import BrazilianStrategy from "../Domain/Strategy/Reports/BrazilianStrategy";
import IReportStrategy from "../Domain/StrategyInterfaces/IReportsStrategy";
import { parseEventsArrayToObject } from "../Helpers/arrayManipulation";
import { IReportEventsObj, IReportPostParameters } from "../Interfaces/IReports";

export default class ReportsService {

    public async createSingleReport(data: IReportPostParameters): Promise<{
        done: boolean,
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
                done: true,
                newId: generatedReportId
            };
        } catch (err) {
            await pool.query("ROLLBACK");
            return {
                done: false,
                errors: err,
            };
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