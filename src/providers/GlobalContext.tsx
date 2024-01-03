import { useState, createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";

type GlobalContextType = {
  displayLoginModal: boolean;
  setDisplayLoginModal: Dispatch<SetStateAction<boolean>>;
};

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined,
);

export const GlobalContextProvider = (
  props: React.PropsWithChildren<object>,
) => {
  const [displayLoginModal, setDisplayLoginModal] = useState(false);

  return (
    <GlobalContext.Provider value={{ displayLoginModal, setDisplayLoginModal }}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider",
    );
  }
  return context;
};
