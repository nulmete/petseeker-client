/* eslint-disable camelcase */
type UserEvent = {
  event_type: "COMMENT_ADDED" | "SIGHTING_ADDED";
  publication_id: number;
  user_uuid: string;
  timestamp: string;
  read: boolean;
};

export interface IUser {
  id?: number;
  enabled?: boolean;
  events?: UserEvent[];
  user_uuid: string;
  names: string;
  surnames: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  phone_number: string;
  pic_path: string;
  // We get email from Auth0, so not really needed
  email: string;
}
