import { IReportPostParameters } from "../Interfaces/IReportStrategy";
import IReportStrategy from "./StrategyInterfaces/IReportsStrategy";

export default class Reports {
    reportStrategy: IReportStrategy;

    public constructor(reportStrategy: IReportStrategy) {
        this.reportStrategy = reportStrategy;
    }

    public getAllReports(): object {
        return this.reportStrategy.getReports;
    }

    public addReport(data: IReportPostParameters): object {
        return this.reportStrategy.addReport;
    }


}

