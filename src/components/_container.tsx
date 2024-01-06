import SideNav from "@/components/Nav/SideNav";
import TopNav from "@/components/Nav/TopNav";
import { useGlobalContext } from "@/providers/GlobalContext";
import type { AppProps } from "next/app";
import { signIn, getProviders, useSession } from "next-auth/react";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import SideNavElements from "./Nav/SideNavElements";
import SideNavFriends from "./Friends/SideNavFriends";
import Chat from "./Chat";
import SideNavGroups from "./Group/SideNavGroups";
import FriendsMonitor from "./Profile/FriendsMonitor";
import SidNavFindFriends from "./Friends/SideNavFindFriends";
import { X } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

type Provider = {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
};

const Container = ({ Component, pageProps }: AppProps) => {
  const session = useSession();
  const { displayLoginModal, setDisplayLoginModal } = useGlobalContext();
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
    <div className={`overflow-x-clip ${inter.className}`}>
      {session.status == "authenticated" && <FriendsMonitor />}
      {displayLoginModal && (
        <div className="fixed inset-0 z-[99] bg-black/80 backdrop-blur-md">
          <div className="card absolute left-1/2 top-1/2 w-96 -translate-x-1/2 -translate-y-1/2 bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-2xl font-bold">Login</h2>
              <div className="card-actions flex flex-col items-center justify-center">
                {providers &&
                  Object.values(providers).map((provider: Provider) => {
                    if (provider.name) {
                      return (
                        <div
                          key={provider.name}
                          className="flex justify-center w-full"
                        >
                          <button
                            className="w-full btn btn-accent my-1 rounded-full text-base-100"
                            onClick={() =>
                              signIn(provider.id)
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
              className="btn btn-accent absolute right-2 top-2 h-10 w-12 rounded-full p-0"
              onClick={() => setDisplayLoginModal(false)}
            >
              <X className="h-8 w-8" />
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
                {session.status == "authenticated" && <SideNavFriends />}
              </div>
            </div>
            <div className="relative col-span-1 w-full max-w-xl">
              <header className="sticky top-0 z-50 h-16 w-full">
                <TopNav />
              </header>
              <main className="min-h-[calc(100vh-4rem)] bg-base-300 p-3">
                <Component {...pageProps} />
              </main>
            </div>
            <div className="sticky top-4 hidden self-start p-4 md:block">
              <SidNavFindFriends />
              <SideNavGroups />
            </div>
          </div>
          <div className="pointer-events-none fixed bottom-0 right-0 z-50 sm:right-10">
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
