import pool from "../../Database/pool";

describe("check whether we can get a report by id", () => {
    test("should get an report by ID from database", async () => {
        //Set
        let reportId = 107;
        let query = `
            SELECT title, date, category_id, author_id,
            reports_categories.name AS category_name,
            reports_authors.name AS author_name, reports_authors.nationality AS author_nationality,
            full_text, final_things, lights, out_of_body, seen_spirits, tunnel_vision, watched_life_movie,
            feel_peace_and_love, dont_want_come_back, no_more_death_fear, seen_death_parents, other_dimension, 
            need_finish_mission
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
        let response = await pool.query(query, values);

        //Assert
        let expectedResponse = {
            author_id: 1,
            author_name: "Anonymous",
            author_nationality: null,
            category_id: 2,
            category_name: "American",
            date: new Date("2000-03-27T03:00:00.000Z"),
            dont_want_come_back: false,
            feel_peace_and_love: false,
            final_things: "Busquem o amor acima de tudo",
            full_text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
            lights: false,
            need_finish_mission: true,
            no_more_death_fear: false,
            other_dimension: false,
            out_of_body: false,
            seen_death_parents: false,
            seen_spirits: false,
            title: "Vi a luz e obtive amor",
            tunnel_vision: true,
            watched_life_movie: false,
        }

        expect(response.rows[0]).toStrictEqual(expectedResponse)
    });
});