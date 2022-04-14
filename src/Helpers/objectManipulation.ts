import { IReportEventsObj } from "../Interfaces/IReports";

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
