import { IReportPostParameters } from "../../Interfaces/IReports";
import ReportsService from "../../Services/ReportsService";

describe('Test whether a new record has created on database', () => {
  test('should create a new report on database', async () => {
    //Set
    let testingData: IReportPostParameters = {
      title: "Vi a luz e obtive amor",
      author_id: 1,
      category_id: 2,
      date: new Date("2000-03-27"),
      full_text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
      final_things: "Busquem o amor acima de tudo",
      events: [
        "tunnel_vision",
        "need_finish_mission"
      ]
    }

    //Act
    let service = new ReportsService();
    let response = await service.createSingleReport(testingData);


    //Assert
    expect(response.done).toBeTruthy();
  })
});

describe('Test whether a new record has rejected on database', () => {
  test('should database reject the report', async () => {
    //Set
    let testingData: IReportPostParameters = {
      title: "Vi a luz e obtive amor",
      author_id: 999999999,
      category_id: 99999999,
      date: new Date("2000-03-27"),
      full_text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
      final_things: "Busquem o amor acima de tudo",
      events: [
        "tunnel_vision",
        "need_finish_mission"
      ]
    }

    //Act
    let service = new ReportsService();
    let response = await service.createSingleReport(testingData);

    //Assert
    expect(response.done).toBeFalsy();
  })
});