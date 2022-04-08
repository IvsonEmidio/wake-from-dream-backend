import { IReportPostParameters } from "../../../Interfaces/IReports";
import IReportStrategy from "../../StrategyInterfaces/IReportsStrategy";

export default class AmericanStrategy implements IReportStrategy {
    public getReports = (): object => {
        return {
            strategyName: "American"
        }
    };

    public addReport = (data: IReportPostParameters): object => {
        return {
            message: 'Sucessfull added report to database American',
            data: data
        }
    };
}