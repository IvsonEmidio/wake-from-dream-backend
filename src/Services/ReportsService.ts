import { Result } from "express-validator";
import { allowedEvents } from "../Controllers/ReportsController";
import pool from "../Database/pool";
import AmericanStrategy from "../Domain/Strategy/Reports/AmericanStrategy";
import BrazilianStrategy from "../Domain/Strategy/Reports/BrazilianStrategy";
import IReportStrategy from "../Domain/StrategyInterfaces/IReportsStrategy";
import {
  parseArrayToQueryStringLine,
  parseEventsArrayToObject,
} from "../Helpers/arrayManipulation";
import {
  parseEventsObjToQueryValues,
  parseObjToUpdateQueryItems,
  parseRowObjToResponseObj,
} from "../Helpers/objectManipulation";
import {
  IReportEventsObj,
  IReportItemDetails,
  IReportPostParams,
  IReportUpdateParameters,
} from "../Interfaces/IReports";

export default class ReportsService {
  public async createOnDatabase(data: IReportPostParams): Promise<{
    success: boolean;
    generatedID: number | null;
    errors: unknown;
  }> {
    try {
      await pool.query("BEGIN");

      //Insert new row on 'reports' table as 't1'.
      let t1Query = `
      INSERT INTO reports
      (title, author_id, category_id, date)
      VALUES($1, $2, $3, $4) RETURNING id`;
      let t1QueryValues = [
        data.title,
        data.author_id,
        data.category_id,
        data.date,
      ];
      let insertReport = await pool.query(t1Query, t1QueryValues);
      const generatedReportId = insertReport.rows[0].id;

      //Insert new row on 'reports_texts' table as 't2'.
      let t2Query = `
      INSERT INTO reports_texts
      (report_id, full_text, final_things)
      VALUES($1, $2, $3)`;
      let t2QueryValues = [
        generatedReportId,
        data.full_text,
        data.final_things,
      ];
      await pool.query(t2Query, t2QueryValues);

      //Insert new row on 'reports_events' table as 't3'
      let eventsObj = parseEventsArrayToObject(data.events);
      let eventsColumns = parseArrayToQueryStringLine(allowedEvents);
      let eventColumnsValues = parseEventsObjToQueryValues(eventsObj);

      let t3Query = `
      INSERT INTO reports_events
      (report_id, ${eventsColumns})
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;
      let t3QueryValues = [generatedReportId, ...eventColumnsValues];
      await pool.query(t3Query, t3QueryValues);

      await pool.query("COMMIT");

      return {
        success: true,
        generatedID: generatedReportId,
        errors: null,
      };
    } catch (err) {
      await pool.query("ROLLBACK");
      return {
        success: false,
        generatedID: null,
        errors: err,
      };
    }
  }

  /**
   * Finds an report by ID.
   * @param {number} id
   */
  public async getFromDatabase(id: number): Promise<{
    success: boolean;
    data: object | null;
    errors: { message: string } | null;
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
        let rowParsed = parseRowObjToResponseObj(row);
        return {
          success: true,
          data: rowParsed,
          errors: null,
        };
      } else {
        return {
          success: false,
          data: null,
          errors: {
            message:
              "The report has not found, please, check the id and try again.",
          },
        };
      }
    } catch (err) {
      return {
        success: false,
        data: null,
        errors: {
          message:
            "An unknown error has occurred on database, please, try again later.",
        },
      };
    }
  }

  /**
   * Deletes a single report by ID.
   * @param {number} id
   */
  public async deleteSingleReport(id: number): Promise<{
    success: boolean;
    found: boolean;
  }> {
    let query = `DELETE FROM reports WHERE id = $1`;
    let queryValues = [id];

    return pool
      .query(query, queryValues)
      .then((result) => {
        let qntRows = result.rowCount;

        if (qntRows > 0) {
          return {
            success: true,
            found: true,
          };
        } else {
          return {
            success: true,
            found: false,
          };
        }
      })
      .catch(() => {
        return {
          success: false,
          found: false,
        };
      });
  }

  /**
   * Update a single report details
   * @param {IReportEventsObj} data
   */
  public async updateOnDatabase(data: IReportUpdateParameters): Promise<{
    success: boolean;
    errors: unknown;
  }> {
    try {
      //Update 'reports' table as 't1'
      await pool.query("BEGIN");
      let t1Query = `
        UPDATE reports SET
        title = COALESCE(NULLIF($1, ''), title),
        category_id = COALESCE(NULLIF($2, 0), category_id),
        author_id = COALESCE(NULLIF($3, 0), author_id),
        date = COALESCE(NULLIF($4, DATE '1200-03-27'), date)
        WHERE id = $5
        `;
      let t1Values = [
        data.title ?? "",
        data.category_id ?? 0,
        data.author_id ?? 0,
        data.date ?? "1200-03-27",
        data.id,
      ];
      await pool.query(t1Query, t1Values).then((result) => {
        if (result.rowCount === 0) {
          throw new Error("id not found");
        }
      });

      //Update 'reports_texts' table as 't2'
      if (data.texts) {
        let t2Query = `
        UPDATE reports_texts SET
        full_text = COALESCE(NULLIF($1, ''), full_text),
        final_things = COALESCE(NULLIF($2, ''), final_things)
        WHERE report_id = $3
        `;
        let t2Values = [
          data.texts.full_text ?? "",
          data.texts.final_things ?? "",
          data.id,
        ];
        await pool.query(t2Query, t2Values);
      }

      //Update 'reports_events' table as t3
      if (data.events) {
        let t3Items = parseObjToUpdateQueryItems(data.events);
        let t3ItemsValues: Array<boolean> =
          parseEventsObjToQueryValues<boolean>(data.events);
        let lastParamNumber = t3ItemsValues.length + 1;

        let t3Query: string = `
        UPDATE reports_events SET
        ${t3Items} 
        WHERE report_id = $${lastParamNumber}`;

        let t3QueryValues = [...t3ItemsValues, data.id];

        await pool.query(t3Query, t3QueryValues);
      }

      await pool.query("COMMIT");

      return {
        success: true,
        errors: null,
      };
    } catch (err) {
      await pool.query("ROLLBACK");

      return {
        success: true,
        errors: err,
      };
    }
  }

  /**
   * Get all available reports
   * @param page - Pagination of items per page.
   * @param itemsPerPage - Amount of items per page
   */
  public async getAllReports(
    page: number,
    itemsPerPage: number
  ): Promise<{
    success: boolean;
    data: Array<IReportItemDetails> | [];
    errors: unknown;
  }> {
    //TODO - Recreate.
    let eventsColumns = parseArrayToQueryStringLine(allowedEvents);
    let query = `
    SELECT reports.id, title, date, category_id, author_id,
    reports_categories.name AS category_name,
    reports_authors.name AS author_name,
    reports_authors.nationality AS author_nationality,
    full_text, final_things, ${eventsColumns}
    FROM reports
    JOIN reports_categories
    ON reports_categories.id = reports.category_id
    JOIN reports_authors
    ON reports_authors.id = reports.author_id
    JOIN reports_texts
    ON reports_texts.report_id = reports.id
    JOIN reports_events
    ON reports_events.report_id = reports.id
    ORDER BY reports.id
    LIMIT $2
    OFFSET ($1 - 1) * $2;`;
    let values = [page, itemsPerPage];

    return pool
      .query(query, values)
      .then((result) => {
        let items = result.rows.map((row) => {
          return parseRowObjToResponseObj(row);
        });

        return {
          success: true,
          data: items,
          errors: null,
        };
      })
      .catch((err) => {
        return {
          success: false,
          data: [],
          errors: err,
        };
      });
  }

  /**
   * Get an instance of IReportsStrategy Interface -
   * according to report category name.
   * @param {string} category
   * @returns {object}
   */
  public getStrategyByCategory(category: string): IReportStrategy {
    switch (category) {
      case "American":
        return new AmericanStrategy();
      case "Brazilian":
        return new BrazilianStrategy();
      default:
        return new BrazilianStrategy();
    }
  }
}
