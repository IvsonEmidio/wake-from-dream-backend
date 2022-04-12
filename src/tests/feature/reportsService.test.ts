import { IReportPostParameters } from "../../Interfaces/IReports";
import ReportsService from "../../Services/ReportsService";


const service = new ReportsService();

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
    let response = await service.createSingleReport(testingData);


    //Assert
    expect(response.success).toBeTruthy();
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
    let response = await service.createSingleReport(testingData);

    //Assert
    expect(response.success).toBeFalsy();
  })
});

describe('Test whether the user can get an report from database', () => {
  test('Should a report details be returned', async () => {
    //set
    let reportId = 107;

    //act
    let response = await service.getSingleReport(reportId);

    //assert
    let expectedResponse = {
      success: true,
      data: {
        title: "Vi a luz e obtive amor",
        date: new Date("2000-03-27T03:00:00.000Z"),
        category_info: {
          category_id: 2,
          category_name: "American"
        },
        author_info: {
          author_id: 1,
          author_name: "Anonymous",
          author_nationality: null
        },
        texts: {
          full_text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
          final_things: "Busquem o amor acima de tudo"
        },
        events: {
          lights: false,
          out_of_body: false,
          seen_spirits: false,
          tunnel_vision: true,
          watched_life_movie: false,
          feel_peace_and_love: false,
          dont_want_come_back: false,
          no_more_death_fear: false,
          seen_death_parents: false,
          other_dimension: false,
          need_finish_mission: true
        }
      }
    }

    expect(response).toStrictEqual(expectedResponse);
  })
})

describe('Test whether the report has not found', () => {
  test('Should a report be not found', async () => {
    //set
    let reportId = 100000;

    //act
    let response = await service.getSingleReport(reportId);

    //assert
    let expectedResponse = {
      success: false,
      errors: {
        message: "The report has not found, please, check the id and try again."
      }
    };


    expect(response).toStrictEqual(expectedResponse);
  })
})

describe('Test whether a user can delete an report', () => {
  test('Should delete an report by ID', async () => {
    //Set
    let reportId = 516;

    //Act
    let response = await service.deleteSingleReport(reportId);

    //Assert
    let expectedResponse = {
      success: true,
      found: true,
    }

    expect(response).toStrictEqual(expectedResponse);

  })
})