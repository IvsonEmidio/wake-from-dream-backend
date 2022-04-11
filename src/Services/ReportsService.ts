import AmericanStrategy from "../Domain/Strategy/Reports/AmericanStrategy";
import BrazilianStrategy from "../Domain/Strategy/Reports/BrazilianStrategy";
import IReportStrategy from "../Domain/StrategyInterfaces/IReportsStrategy";
import { isStringOnArray } from "../Helpers/arrayManipulation";
import { IReportEventsObj } from "../Interfaces/IReports";

export default class ReportsService {
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

    /**
     * Parses array of events in object with boolean values.
     * Only itens in array will be true, all others will be false.
     * @param {Array<string>} events
     * @returns {IReportEventsObj}
     */
    public parseEventsArrayToObject(events: Array<string>): IReportEventsObj {
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
}