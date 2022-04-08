import Reports from "../Domain/Reports";
import AmericanStrategy from "../Domain/Strategy/Reports/AmericanStrategy";
import BrazilianStrategy from "../Domain/Strategy/Reports/BrazilianStrategy";
import IReportStrategy from "../Domain/StrategyInterfaces/IReportsStrategy";
import { IReportPostParameters } from "../Interfaces/IReports";

export default class ReportsController {
    /**
     * Get all reports by category name.
     * @param {string} category 
     * @returns {object}
     */
    public getReportsByCategory(category: string): object {
        let strategy = this.getStrategyByCategory(category);
        let reports = new Reports(strategy);

        let response = reports.getReports();

        if (response) {
            return response;
        } else {
            return {
                status: 0,
                msg: 'generic error'
            }
        }
    }

    /**
     * Adds a new report on database.
     * @param {IReportPostParameters} data  
     * @returns {object}
     */
    public addReport(data: IReportPostParameters): object {
        let strategy = this.getStrategyByCategory(data.category);
        let reports = new Reports(strategy);

        let response = reports.addReport(data);

        if (response) {
            return response;
        } else {
            return {
                status: 0,
                msg: 'generic error'
            }
        }
    }

    /**
     * Get an instance of IReportsStrategy Interface..
     * @param {string} category
     * @returns {object}
     */
    private getStrategyByCategory(category: string): IReportStrategy {
        switch (category) {
            case 'American':
                return new AmericanStrategy;
            case 'Brazilian':
                return new BrazilianStrategy;
            default:
                return new BrazilianStrategy;
        }
    }
}