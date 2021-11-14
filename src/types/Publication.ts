/* eslint-disable camelcase */
export interface IComment {
  author_id: number;
  author_name: string;
  content: string;
  created_date: string;
  publication_id: number;
}

export interface ISighting {
  authorId: number;
  authorName: string;
  location: string;
  publicationId: number;
  timestamp: string;
}

export interface IPublication {
  // publication_id will be undefined when adding a publication
  publication_id?: number;
  author_id: number;
  author_name: string;
  pet_location: string;
  pet_name: string;
  pet_pic_url: string[];
  pet_race: string;
  pub_type: number;
  comments: IComment[];
  sightings: ISighting[];
}
