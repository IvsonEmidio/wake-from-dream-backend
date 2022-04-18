import { allowedEvents } from "../../../Controllers/ReportsController";
import pool from "../../../Database/pool";
import { parseArrayToQueryStringLine, parseEventsArrayToObject } from "../../../Helpers/arrayManipulation";
import {
  parseEventsObjToQueryValues,
  parseObjToUpdateQueryItems,
  parseRowObjToResponseObj,
} from "../../../Helpers/objectManipulation";

describe('Reports service class methods', () => {
  test('should get an report by ID from database', async () => {
    //Set
    let reportId = 7;
    let events = parseArrayToQueryStringLine(allowedEvents);

    let query = `
            SELECT title, date, category_id, author_id,
            reports_categories.name AS category_name,
            reports_authors.name AS author_name, reports_authors.nationality AS author_nationality,
            full_text, final_things,
            ${events}
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
    let values = [reportId];

    //Act
    let response = await pool.query(query, values).then((result) => {
      let success = false, errors = null;
      if (result.rowCount > 0) {
        success = true;
      }

      return {
        success,
        errors
      }
    });

    //Assert
    let expectedResponse = {
      success: true,
      errors: null
    };


    expect(response).toStrictEqual(expectedResponse);
  });

  test('Should create a new item on database', async () => {
    let data = {
      title: "Nosso guia sempre está nos ajudando",
      author_id: 1,
      category_id: 2,
      date: new Date('2000-07-21'),
      full_text: "Lorem ipsum is a typography from france in 1990s that has made from a stratch it's a good thing for creating initial texts on databases that you don't know what to written",
      final_things: "",
      events: [
        'seen_spirits',
        'out_of_body'
      ]
    }
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
    let t3QueryValues = [
      generatedReportId,
      ...eventColumnsValues
    ];
    await pool.query(t3Query, t3QueryValues);

    let response = await pool.query("COMMIT")
      .then(() => {
        return {
          success: true,
          errors: false,
        };
      })
      .catch((err) => {
        return {
          success: false,
          errors: err,
        }
      })

    let expectedResponse = {
      success: true,
      errors: false,
    }

    expect(response).toStrictEqual(expectedResponse);

  });

});

describe("Check whether we can delete a report by id", () => {
  test("Should delete a report by ID", async () => {
    //Set
    let reportID = 3;
    let query = `DELETE FROM reports WHERE id = $1`;
    let queryValues = [reportID];

    //Act
    let response = await pool
      .query(query, queryValues)
      .then(() => {
        return {
          success: true,
        };
      })
      .catch(() => {
        return {
          success: false,
        };
      });

    //Assert
    let expectResponse = {
      success: true,
    };

    expect(response).toStrictEqual(expectResponse);
  });
});

describe("Check whether we can return an error on invalid report ID", () => {
  test("Should return an error when deleting a report ID", async () => {
    //Set
    let reportID = "random";
    let query = `DELETE FROM reports WHERE id = $1`;
    let queryValues = [reportID];

    //Act
    let response = await pool
      .query(query, queryValues)
      .then(() => {
        return {
          success: true,
          random: true,
        };
      })
      .catch(() => {
        return {
          success: false,
          random: false,
        };
      });

    //Assert
    let expectResponse = {
      success: false,
      random: false,
    };

    expect(response).toStrictEqual(expectResponse);
  });
});

describe("Check whether we can update an report by ID", () => {
  test("Should update a report by ID", async () => {
    //Set
    let newData = {
      id: 7,
      title: "The light is the everything forever.",
      date: "2008-03-27",
      author_id: 1,
      category_id: 2,
      texts: {
        full_text: "God is everything",
        final_things: "",
      },
      events: {
        lights: true,
        out_of_body: true,
        seen_spirits: false,
        tunnel_vision: true,
        watched_life_movie: false,
        feel_peace_and_love: false,
        dont_want_come_back: false,
        no_more_death_fear: false,
        seen_death_parents: false,
        other_dimension: true,
        need_finish_mission: false,
      },
    };

    //Act
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
      newData.title ?? "",
      newData.category_id ?? 0,
      newData.author_id ?? 0,
      newData.date ?? "1200-03-27",
      newData.id,
    ];

    let t1DbOperation = await pool
      .query(t1Query, t1Values)
      .then((result) => {
        let success = true,
          found = true;

        if (!result.rowCount) {
          found = false;
        }

        return { success, found, error: null };
      })
      .catch((err) => {
        return { success: false, found: false, error: err };
      });

    //Update 'reports_texts' table as 't2'
    let t2Query = `
        UPDATE reports_texts SET
        full_text = COALESCE(NULLIF($1, ''), full_text),
        final_things = COALESCE(NULLIF($2, ''), final_things)
        WHERE report_id = $3
        `;
    let t2Values = [
      newData.texts.full_text ?? "",
      newData.texts.final_things ?? "",
      newData.id,
    ];

    let t2DbOperation = await pool
      .query(t2Query, t2Values)
      .then((result) => {
        let success = true,
          found = true;

        if (!result.rowCount) {
          found = false;
        }

        return { success, found, error: null };
      })
      .catch((err) => {
        return { success: false, found: false, error: err };
      });

    //Update 'reports_events' table as t3
    let t3Items = parseObjToUpdateQueryItems(newData.events);
    let t3ItemsValues: Array<boolean> = parseEventsObjToQueryValues<boolean>(
      newData.events
    );
    let lastParamNumber: number = t3ItemsValues.length + 1;

    let t3Query: string = `
        UPDATE reports_events SET
        ${t3Items} 
        WHERE report_id = $${lastParamNumber}`;

    let t3QueryValues = [...t3ItemsValues, newData.id];

    let t3DbOperation = await pool
      .query(t3Query, t3QueryValues)
      .then((result) => {
        let success = true,
          found = true;

        if (!result.rowCount) {
          found = false;
        }

        return { success, found, error: null };
      })
      .catch((err) => {
        return { success: false, found: false, error: err };
      });

    await pool.query("COMMIT");

    //Assert
    let expectedResponse = {
      success: true,
      found: true,
      error: null,
    };

    expect(t1DbOperation).toStrictEqual(expectedResponse);
    expect(t2DbOperation).toStrictEqual(expectedResponse);
    expect(t3DbOperation).toStrictEqual(expectedResponse);
  });
});

describe("Check whether we can get all reports details with pagination", () => {
  test("Should return all reports details", async () => {
    //TODO - Test this.
    let data = {
      page: 1,
      itemsPerPage: 50
    };

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
    let values = [data.page, data.itemsPerPage];
    let response = await pool.query(query, values).then((result) => {
      let array = result.rows.map(row => {
        return parseRowObjToResponseObj(row);
      });

      if (array.length === 50) {
        return {
          success: true
        }
      }
    });

    let expectedResponse = {
      success: true
    };

    expect(response).toStrictEqual(expectedResponse);

  })
})