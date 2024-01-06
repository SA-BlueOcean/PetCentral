import { useState, createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";

type GlobalContextType = {
  displayLoginModal: boolean;
  setDisplayLoginModal: Dispatch<SetStateAction<boolean>>;
  triggerOpenChat: (userId?: string) => void;
  openChatTrigger: [number, string];
};

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined,
);

export const GlobalContextProvider = (
  props: React.PropsWithChildren<object>,
) => {
  const [displayLoginModal, setDisplayLoginModal] = useState(false);
  const [openChatTrigger, setOpenChatTrigger] = useState<[number, string]>([
    0,
    "",
  ]);
  const triggerOpenChat = (userId?: string) =>
    setOpenChatTrigger((t) => [t[0] + 1, userId ?? ""]);
  return (
    <GlobalContext.Provider
      value={{
        displayLoginModal,
        setDisplayLoginModal,
        openChatTrigger,
        triggerOpenChat,
      }}
    >
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
