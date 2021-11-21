import React, { Dispatch, SetStateAction } from "react";
import { IUser } from "../types/User";

interface UserContextValue {
  currentUser: IUser | null;
  setCurrentUser: Dispatch<SetStateAction<IUser | null>>;
}

const userCtxDefaultValue: UserContextValue = {
  currentUser: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentUser: () => {},
};

const LocalStateContext = React.createContext(userCtxDefaultValue);
const LocalStateProvider = LocalStateContext.Provider;

interface Props {
  children: React.ReactNode;
}

const UserStateProvider: React.FC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] = React.useState(
    userCtxDefaultValue.currentUser
  );

  return (
    <LocalStateProvider value={{ currentUser, setCurrentUser }}>
      {children}
    </LocalStateProvider>
  );
};

const useUserContext = () => {
  return React.useContext(LocalStateContext);
};

export { UserStateProvider, useUserContext };
