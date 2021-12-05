/* eslint-disable @typescript-eslint/no-empty-function */
import React, { Dispatch, SetStateAction } from "react";
import UserService from "../services/users";
import { IUser } from "../types/User";

interface UserContextValue {
  currentUser: IUser | null;
  setCurrentUser: Dispatch<SetStateAction<IUser | null>>;
  refetchUser: () => void;
}

const userCtxDefaultValue: UserContextValue = {
  currentUser: null,
  setCurrentUser: () => {},
  refetchUser: () => {},
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

  const eventsChanged = (fetchedUser: IUser) => {
    return (
      fetchedUser.events!.length > currentUser!.events!.length ||
      fetchedUser.events!.some((e1, i1) => {
        return currentUser!.events?.find((e2, i2) => {
          if (i1 !== i2) return false;
          return e2.read !== e1.read;
        });
      })
    );
  };

  const refetchUser = React.useCallback(() => {
    const uuid = currentUser?.user_uuid;
    if (!currentUser || !currentUser.user_uuid) return;
    UserService.getUserByUUID(uuid!)
      .then((user) => {
        if (
          user &&
          user.events &&
          currentUser &&
          currentUser.events &&
          eventsChanged(user)
        ) {
          setCurrentUser(user);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [currentUser]);

  return (
    <LocalStateProvider value={{ currentUser, setCurrentUser, refetchUser }}>
      {children}
    </LocalStateProvider>
  );
};

const useUserContext = () => {
  return React.useContext(LocalStateContext);
};

export { UserStateProvider, useUserContext };
