import { IReportPostParameters } from "../../Interfaces/IReports";
export default interface IReportStrategy {
    getReports: () => object;
    addReport: (data: IReportPostParameters) => object;
}