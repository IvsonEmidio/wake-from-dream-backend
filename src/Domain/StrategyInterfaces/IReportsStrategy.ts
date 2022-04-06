import { IReportPostParameters } from "../../Interfaces/IReportStrategy";

export default interface IReportStrategy {
    getReports: () => object;
    addReport: (data: IReportPostParameters) => object;
}