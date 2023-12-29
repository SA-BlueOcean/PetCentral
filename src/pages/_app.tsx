import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import {
  GlobalContextProvider,
} from "@/providers/GlobalContext";
import Container from "./_container";

const MyApp: AppType<{ session: Session | null }> = (appProps) => {

  const { session } = appProps.pageProps;
  return (
    <SessionProvider session={session}>
      <GlobalContextProvider>
        <Container {...appProps} />
      </GlobalContextProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
