import Reports from "../Domain/Reports";
import AmericanStrategy from "../Domain/Strategy/Reports/AmericanStrategy";
import BrazilianStrategy from "../Domain/Strategy/Reports/BrazilianStrategy";
import IReportStrategy from "../Domain/StrategyInterfaces/IReportsStrategy";
import { IReportPostParameters } from "../Interfaces/IReportStrategy";

export default class ReportsController {
    /**
     * Get all reports by category name.
     * @param {string} category 
     * @returns {object | false}
     */
    public getReports(category: string): object | false {
        let instance = this.getStrategyInstance(category);
        let reportItems = instance.getReports();
        if (reportItems) {
            return reportItems;
        }

        return false;
    }

    public addReport(data: IReportPostParameters): object | false {
        let instance = this.getStrategyInstance(data.category);
        let response = instance.addReport(data);

        if (response) {
            return response;
        }

        return false;
    }

    /**
     * Get an instance of IReportsStrategy Interface..
     * @param {string} category
     * @returns {object | false}
     */
    private getStrategyInstance(category: string): IReportStrategy {
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