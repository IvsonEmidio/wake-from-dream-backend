import IReportStrategy from "./StrategyInterfaces/IReportsStrategy";

export default class ReportsContext {
    reportStrategy: IReportStrategy;

    public constructor(reportStrategy: IReportStrategy) {
        this.reportStrategy = reportStrategy;
    }

    /**
     * Get all records from an strategy.
     * @returns {object}
     */
    public getReports(): object {
        return this.reportStrategy.getReports();
    }


}

