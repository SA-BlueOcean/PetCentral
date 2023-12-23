import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className="flex w-screen justify-center ">
        <nav className=" w-[240px]">Left</nav>
        <div className="w-[700px]">
          <div className="bg-primary-content h-20 w-full">SEARCH</div>
          <main className="bg-base-300 w-full p-3">
            <Component {...pageProps} />
          </main>
        </div>
        <aside className="w-[340px]">Right</aside>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
