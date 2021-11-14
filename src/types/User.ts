export interface IUser {
  // id: number;
  names: string;
  surnames: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phoneNum: string;
  picPath: string;
  // We get email from Auth0, so not really needed
  email: string;
}
