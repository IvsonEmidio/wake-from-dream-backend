export interface IReportPostParameters {
    title: string,
    author_id: number,
    category_id: number,
    date: Date,
    full_text: string,
    final_things: string,
    events: Array<string>
}

export interface IReportEventsObj {
    light: boolean,
    out_of_body: boolean,
    seen_spirits: boolean,
    tunnel_vision: boolean,
    watched_life_movie: boolean,
    feel_peace_and_love: boolean,
    dont_want_come_back: boolean,
    no_more_death_fear: boolean,
    seen_death_parents: boolean,
    other_dimension: boolean,
    need_finish_mission: boolean
}

export interface IReportItemDetails {
    title: string,
    date: Date,
    category_info: {
        category_id: number,
        category_name: string
    },
    author_info: {
        author_id: number,
        author_name: string,
        author_nationality: string | null
    },
    texts: {
        full_text: string,
        final_things: string | null
    },
    events: IReportEventsObj
}