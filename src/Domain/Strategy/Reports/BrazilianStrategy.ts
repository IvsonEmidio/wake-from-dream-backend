import { IReportPostParameters } from "../../../Interfaces/IReportStrategy";
import IReportStrategy from "../../StrategyInterfaces/IReportsStrategy";

export default class BrazilianStrategy implements IReportStrategy {
    public getReports = (): object => {
        return {
            strategyName: "Brazilian"
        }
    };

    public addReport = (data: IReportPostParameters): object => {
        return {
            message: 'Sucessfull added report to database Brazilian',
            data: data
        }
    };
}