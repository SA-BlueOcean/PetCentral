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
      <div className="pointer-events-none fixed z-10 top-0 flex h-20 w-full justify-center">
        <div className="pointer-events-auto w-full max-w-xl bg-primary-content ">
          SEARCH
        </div>
      </div>
      <div className="flex justify-center mx-auto max-w-7xl">
        <div className="hidden md:block sticky top-0 self-start flex-grow">
          <nav>navigation</nav>
          <div>component a</div>
        </div>
        <div className="relative w-full max-w-xl">
          <main className="mt-20 p-3 min-h-[calc(100vh-5rem)] bg-base-300">
            <Component {...pageProps} />
          </main>
        </div>
        <div className="hidden md:block sticky top-0 self-start flex-grow">
          <div>component b</div>
          <div>component c</div>
        </div>
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
