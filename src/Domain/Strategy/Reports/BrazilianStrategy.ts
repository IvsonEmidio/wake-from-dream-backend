import IReportStrategy from "../../StrategyInterfaces/IReportsStrategy";

export default class BrazilianStrategy implements IReportStrategy {
    public getReports = (): object => {
        return {
            strategyName: "Brazilian"
        }
    };
}