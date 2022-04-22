import { IReportItemDetails, IReportRowObject } from "../Interfaces/IReports";

/**
 * Receives an object and parses to query items
 * It can be very useful on update query's
 * @param {object} object the object that will be transformed in string
 * @param {number} initial the initial param number [ex: $1 or $2 etc...]
 * @returns {string} the usable string on query
 */
export function parseObjToUpdateQueryItems(
  object: object,
  initial: number = 1
): string {
  let query: string = ``;
  let paramNum: number = initial;

  Object.keys(object).forEach((itemName) => {
    query = query + `${itemName} = $${paramNum},`;
    paramNum++;
  });

  return query.slice(0, -1); //Removes unnecessary last comma;
}

/**
 * Receives an object and extract only values into an array
 * @returns {Array<T>}
 */
export function parseEventsObjToQueryValues<T>(object: object): Array<T> {
  let responseArray: Array<T> = Object.values(object).map((value) => {
    return value;
  });

  return responseArray;
}

export function parseRowObjToResponseObj(row: IReportRowObject): IReportItemDetails {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    category_info: {
      category_id: row.category_id,
      category_name: row.category_name,
    },
    author_info: {
      author_id: row.author_id,
      author_name: row.author_name,
      author_nationality: row.author_nationality,
    },
    texts: {
      full_text: row.full_text,
      final_things: row.final_things,
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
      need_finish_mission: row.need_finish_mission,
    }
  };
}