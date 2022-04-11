import { IReportEventsObj } from "../Interfaces/IReports";

/**
 * Check if an string (needle) exists on array(haystack) 
 * @param {string} needle 
 * @param {Array<string>} haystack 
 * @returns {boolean}
 */
export function isStringOnArray(needle: string, haystack: Array<string>): boolean {
    if (haystack.includes(needle)) {
        return true;
    } else {
        return false;
    }
}

/**
* Parses array of events in object with boolean values.
* Only itens in array will be true, all others will be false.
* @param {Array<string>} events
* @returns {IReportEventsObj}
*/
export function parseEventsArrayToObject(events: Array<string>): IReportEventsObj {
    return {
        light: isStringOnArray('lights', events),
        out_of_body: isStringOnArray('out_of_body', events),
        seen_spirits: isStringOnArray('seen_spirits', events),
        tunnel_vision: isStringOnArray('tunnel_vision', events),
        watched_life_movie: isStringOnArray('watched_life_movie', events),
        feel_peace_and_love: isStringOnArray('feel_peace_and_love', events),
        dont_want_come_back: isStringOnArray('dont_want_come_back', events),
        no_more_death_fear: isStringOnArray('no_more_death_fear', events),
        seen_death_parents: isStringOnArray('seen_death_parents', events),
        other_dimension: isStringOnArray('other_dimension', events),
        need_finish_mission: isStringOnArray('need_finish_mission', events)
    }
}

/**
 * Parses an array of strings in a single line query string.
 * it are useful for creating query's from arrays
 * @param {Array<string>} array 
 */
export function parseArrayToQueryStringLine(array: Array<string>): string {
    let response = "";
    array.forEach((item, i) => {
        if (i === 0) {
            response = response + item;
        } else {
            response = response + ", " + item;
        }
    });

    return response;
}