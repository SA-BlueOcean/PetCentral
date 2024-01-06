import Container from "@/components/_container";
import { GlobalContextProvider } from "@/providers/GlobalContext";
import "@/styles/globals.css";
import { api } from "@/utils/api";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

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
