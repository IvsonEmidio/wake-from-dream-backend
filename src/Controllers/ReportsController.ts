import {
  IReportPostParameters,
  IReportUpdateParameters,
} from "../Interfaces/IReports";
import {
  body,
  check,
  param,
  query,
  ValidationChain,
  validationResult,
} from "express-validator";
import { Request, Response } from "express";
import ReportsService from "../Services/ReportsService";
import { parseEventsArrayToObject } from "../Helpers/arrayManipulation";

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
          message: "Check the fields and try again",
          errors: errors.array(),
        });
      }

      let data: IReportPostParameters = req.body;
      let dbOperation = await this.reportsService.createSingleReport(data);
      if (dbOperation.success) {
        return res.status(200).json({
          status: 1,
          message: "New report successfully created on database",
          data: {
            id: dbOperation.newId,
          },
        });
      } else {
        return res.status(500).json({
          status: 0,
          errors: {
            message:
              "An error has occurred when creating a new report on database",
          },
        });
      }
    } catch (err) {
      res.status(500).json({
        status: 0,
        errors: {
          message: "An unknown error has occurred when validating the fields.",
        },
      });
    }
  }

  /**
   * Get a single report details by ID.
   * @param {Request} req
   * @param {Response} res
   */
  public async getReport(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 0,
          message: "Check the fields and try again...",
          errors: errors.array(),
        });
      }

      let reportId = parseInt(req.params.id);
      let dbOperation = await this.reportsService.getSingleReport(reportId);
      if (dbOperation.success) {
        res.status(200).json({
          status: 1,
          message: "Success",
          data: dbOperation.data,
        });
      } else {
        let errorMsg = dbOperation.errors?.message;
        let statusCode: number = 500;
        if (
          errorMsg ===
          "The report has not found, please, check the id and try again."
        ) {
          statusCode = 404;
        }

        res.status(statusCode).json({
          status: 0,
          errors: dbOperation.errors,
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: 0,
        errors: {
          message: "An unknown error has occurred, please, try again later",
        },
      });
    }
  }

  /**
   * Delete a single report by ID.
   * @param {Request} req
   * @param {Response} res
   */
  public async deleteReport(req: Request, res: Response) {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 0,
          message: "Check the fields and try again...",
          errors: errors.array(),
        });
      }

      let reportId = parseInt(req.params.id);
      let code: number = 200;
      let message: string = "Successfully deleted the report.";
      let dbOperation = await this.reportsService.deleteSingleReport(reportId);
      let { success, found } = dbOperation;

      if (success) {
        if (!found) {
          message =
            "The report id has not encountered, please, check the field 'id' and try again.";
          code = 404;
        }
      } else {
        message =
          "Unfortunately an error has occurred on database, please, try again later.";
        code = 500;
      }

      return res.status(code).json({
        status: found ? 1 : 0,
        message,
      });
    } catch (err) {
      return res.status(500).json({
        status: 0,
        message: "An unknown error has occurred, please, try again later.",
      });
    }
  }

  /**
   * Update an single report basic details.
   * @param {Request} req
   * @param {Response} res
   */
  public async updateReport(req: Request, res: Response) {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 0,
          message: "Check the fields and try again...",
          errors: errors.array(),
        });
      }

      let data: IReportUpdateParameters = {
        id: parseInt(req.params.id),
        title: req.body.title,
        date: req.body.date,
        author_id: req.body.author_id,
        category_id: req.body.category_id,
        texts: {
          full_text: req.body.full_text,
          final_things: req.body.final_things,
        },
        events: req.body.events
          ? parseEventsArrayToObject(req.body.events)
          : null,
      };

      let dbOperation = await this.reportsService.updateSingleReport(data);
      let { errors: operationErrors } = dbOperation;
      let msg = "Successfully updated report details";
      let statusCode = 200;

      if (operationErrors) {
        if (operationErrors instanceof Error) {
          let { message } = operationErrors;
          if (message === 'id not found') {
            msg = 'The report ID has not found, check the fields and try again.';
            statusCode = 404;
          }
        } else {
          msg = 'An unknown error has occurred when updating the report on database, please, try again later';
          statusCode = 500;
        }
      }

      return res.status(statusCode).json({
        status: statusCode === 200 ? 1 : 0,
        message: msg,
      });

    } catch (err) {
      return res.status(500).json({
        status: 0,
        message: 'An unknown error has occurred, please, try again later.',
      });
    }
  }

  /**
   * Get all reports
   */
  public async getAllReports(
    req: Request,
    res: Response
  ) {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: 0,
          message: "Check the fields and try again...",
          errors: errors.array(),
        });
      }

      let page = parseInt(req.params.pageNum);
      let itemsPerPage = 50;
      let result = {
        statusCode: 200,
        message: 'Successfully found report items',
      };

      let dbOperation = await this.reportsService.getAllReports(page, itemsPerPage);
      let { success, data } = dbOperation;
      if (success && data.length === 0) {
        result.statusCode = 404;
        result.message = 'No results found, check your query and try again.';
      } else if (!success) {
        result.statusCode = 500;
        result.message = 'An error has occurred, please try again later.';
      }

      return res.status(result.statusCode).json({
        status: success ? 1 : 0,
        message: result.message,
        qntItems: data ? data.length : 0,
        data
      });

    } catch (err) {
      return res.status(500).json({
        status: 0,
        message: 'An unknown error has occurred, please, try again later.',
      });
    }
  }

  public validateParams(method: string): Array<ValidationChain> {
    switch (method) {
      case "getReport":
        return [param("id", "the report id need to be an integer.").isInt()];
      case "deleteReport":
        return [param("id", "the report id need to be an integer.").isInt()];
      case "updateReport":
        return [param("id", "the report id need to be an integer.").isInt()];
      case "getAllReports":
        return [param("pageNum", "PageNum needs to be an valid integer.").isInt()];
      default:
        return [];
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
      case "updateReport":
        return [
          body('title', 'field "title" need to be a string with minimum 7 characters')
            .optional().isString().isLength({ min: 7 }),
          body('date', 'field "date" needs to be in date format. EG: "2000-03-27"')
            .optional().isDate(),
          body('author_id', 'field "author_id" needs to be a integer')
            .optional().isInt(),
          body('category_id', 'field "category_id" needs to a integer')
            .optional().isInt(),
          body('full_text', 'field "full_text" needs to be a string with minimum 50 characters')
            .optional().isString().isLength({ min: 50 }),
          body('final_things', 'field "final_things" needs to be a string with minimum 7 characters')
            .optional().isString().isLength({ min: 7 }),
          body('events', 'the field "events" needs to be a array of strings')
            .optional().isArray({ min: 1 }),
          body('events.*', 'events array must have valid events, check the list of valid events and try again')
            .isString().isIn(allowedEvents)
        ]
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
