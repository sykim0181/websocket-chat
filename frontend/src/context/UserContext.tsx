import { createContext, useContext, useEffect, useState } from "react";

export type User = {
  userName: string;
};

export const UserContext = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
} | null>(null);

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const user = sessionStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const userContext = useContext(UserContext);

  if (userContext === null) {
    throw new Error("UserContextProvider 내에서 사용해야합니다.");
  }

  return userContext;
};
