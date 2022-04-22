import { IReportEventsObj } from "../../../Interfaces/IReports";

describe("Check whether we can manipulate objects correctly", () => {
  test("Should parse an object to string in query update format.", () => {
    //Set
    let receivedObject: IReportEventsObj = {
      lights: true,
      out_of_body: false,
      seen_spirits: true,
      tunnel_vision: true,
      watched_life_movie: true,
      feel_peace_and_love: false,
      dont_want_come_back: true,
      no_more_death_fear: false,
      seen_death_parents: true,
      other_dimension: true,
      need_finish_mission: true,
    };
    let query: string = ``;
    let paramNum: number = 1;

    //Act
    Object.keys(receivedObject).forEach((itemName) => {
      query = query + `${itemName} = $${paramNum},`;
      paramNum++;
    });

    let expectedString: string = `lights = $1,out_of_body = $2,seen_spirits = $3,tunnel_vision = $4,watched_life_movie = $5,feel_peace_and_love = $6,dont_want_come_back = $7,no_more_death_fear = $8,seen_death_parents = $9,other_dimension = $10,need_finish_mission = $11`;
    //Assert
    expect(query.slice(0, -1)).toStrictEqual(expectedString);
  });

  test("Should parse an object to array with only values", () => {
    let receivedObject = {
      light: true,
      out_of_body: false,
      seen_spirits: true,
      tunnel_vision: false,
      watched_life_movie: false,
      feel_peace_and_love: true,
      dont_want_come_back: true,
      no_more_death_fear: true,
      seen_death_parents: false,
      other_dimension: true,
    };
    let newArray: Array<boolean> = Object.values(receivedObject).map(
      (value) => {
        return value;
      }
    );

    expect(newArray).toStrictEqual([
      true,
      false,
      true,
      false,
      false,
      true,
      true,
      true,
      false,
      true,
    ]);
  });
});
