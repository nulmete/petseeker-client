/* eslint-disable camelcase */
export interface IComment {
  author_uuid: string;
  author_name: string;
  content: string;
  created_date: string;
  publication_id: number;
}

export interface ISighting {
  author_uuid: string;
  author_name: string;
  content: string;
  location: string;
  publication_id: number;
  timestamp: string;
}

export interface IPublication {
  title: string;
  publication_id?: number;
  author_uuid: string;
  author_name: string;
  pet_location: string;
  pet_name: string;
  pet_pic_url: string[];
  pet_race: string;
  pub_type: number;
  comments: IComment[];
  sightings: ISighting[];
}
