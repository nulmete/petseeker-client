/* eslint-disable camelcase */
export interface IComment {
  author_id: number;
  author_name: string;
  content: string;
  publicationId: number;
}

export interface ISighting {
  authorId: number;
  authorName: string;
  location: string;
  publicationId: number;
  timestamp: string;
}

export interface IPublication {
  author_id: number;
  author_name: string;
  comments: IComment[];
  pet_location: string;
  pet_name: string;
  pet_pic_url: string[];
  pet_race: string;
  pub_type: number;
  sightings: ISighting[];
}
