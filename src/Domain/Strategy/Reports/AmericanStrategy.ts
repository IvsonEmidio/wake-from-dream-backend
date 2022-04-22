import IReportStrategy from "../../StrategyInterfaces/IReportsStrategy";

export default class AmericanStrategy implements IReportStrategy {
    public getReports = (): object => {
        return {
            strategyName: "American"
        }
    };
}