import { IReportPostParameters } from "../Interfaces/IReports";
import IReportStrategy from "./StrategyInterfaces/IReportsStrategy";

export default class Reports {
    reportStrategy: IReportStrategy;

    public constructor(reportStrategy: IReportStrategy) {
        this.reportStrategy = reportStrategy;
    }

    /**
     * Get all records from an strategy.
0    * @returns {object}
     */
    public getReports(): object {
        return this.reportStrategy.getReports();
    }

    /**
     * Adds a new record on a strategy.
     * @param {IReportPostParameters} data 
     * @returns {object}
     */
    public addReport(data: IReportPostParameters): object {
        return this.reportStrategy.addReport(data);
    }


}

