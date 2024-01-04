import SideNav from "@/components/Nav/SideNav";
import TopNav from "@/components/Nav/TopNav";
import { useGlobalContext } from "@/providers/GlobalContext";
import type { AppProps } from "next/app";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import SideNavElements from "./Nav/SideNavElements";
import Chat from "./Chat";

const inter = Inter({ subsets: ["latin"] });

type Provider = {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
};

const Container = ({ Component, pageProps }: AppProps) => {
  const { displayLoginModal, setDisplayLoginModal } = useGlobalContext();
  const { data: sessionData } = useSession();
  const [providers, setProviders] = useState<Record<string, Provider>>();

  //disables scroll if modal is open
  useEffect(() => {
    if (displayLoginModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [displayLoginModal]);

  useEffect(() => {
    const getProvidersData = async () => {
      const providersData = await getProviders();
      setProviders(providersData ?? undefined);
    };
    getProvidersData().catch((err) => console.error(err));
  }, []);

  return (
    <div className={inter.className}>
      {displayLoginModal && (
        <div className="fixed inset-0 z-[99] bg-black/80 backdrop-blur-md">
          <div className="card absolute left-1/2 top-1/2 w-96 -translate-x-1/2 -translate-y-1/2 bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Login</h2>
              <div className="card-actions flex flex-col items-center justify-center">
                {providers &&
                  Object.values(providers).map((provider: Provider) => {
                    if (provider.name) {
                      return (
                        <div
                          key={provider.name}
                          className="flex justify-center"
                        >
                          <button
                            className="btn btn-primary my-1"
                            onClick={() =>
                              signIn(provider.id, {
                                callbackUrl: `${window.location.origin}`,
                              })
                            }
                          >
                            Sign in with {provider.name}
                          </button>
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
            <button
              className="btn btn-accent absolute right-2 top-2"
              onClick={() => setDisplayLoginModal(false)}
            >
              X
            </button>
          </div>
        </div>
      )}

      <div className="drawer">
        <input
          id="primary-drawer"
          type="checkbox"
          className="drawer-toggle"
          onChange={(e) => {
            const isChecked = e.target.checked;
            if (isChecked) {
              document.body.classList.add("overflow-hidden");
            } else {
              document.body.classList.remove("overflow-hidden");
            }
          }}
        />
        <div className="drawer-content">
          <div className="mx-auto flex max-w-7xl justify-center md:grid md:grid-cols-[1fr,36rem,1fr]">
            <div className="sticky top-4 hidden items-end self-start p-4 md:flex md:flex-col">
              <div className=" w-full max-w-56">
                <SideNav />
                <div>component a</div>
              </div>
            </div>
            <div className="relative col-span-1 w-full max-w-xl">
              <header className="sticky top-0 z-10 h-16 w-full">
                <TopNav />
              </header>
              <main className="min-h-[calc(100vh-4rem)] bg-base-300 p-3">
                <Component {...pageProps} />
              </main>
            </div>
            <div className="sticky top-4 hidden self-start p-4 md:block">
              <div>component b</div>
              <div>component c</div>
            </div>
          </div>
          {/* TODO: remove this button, for demo only */}
          
          <div className="fixed bottom-0 right-10">
            <Chat />
          </div>
        </div>
        <div className="drawer-side z-20">
          <label
            htmlFor="primary-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu min-h-full w-80 bg-base-200 p-4">
            <label
              htmlFor="primary-drawer"
              aria-label="close sidebar"
              className=""
            >
              x
            </label>
            <SideNavElements />
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Container;
