import { useGlobalContext } from "@/providers/GlobalContext";
import type { AppProps } from "next/app";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Provider = {
  id: string;
  name: string;
};

const Container = ({ Component, pageProps }: AppProps) => {
  const { displayLoginModal, setDisplayLoginModal } = useGlobalContext();
  const router = useRouter();
  const { data: sessionData } = useSession();

  //disables scroll if modal is open
  useEffect(() => {
    if (displayLoginModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [displayLoginModal]);

  // const [providers, setProviders] = useState([]);
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
      console.log(res);
    })().catch(console.error);
  }, []);

  return (
    <>
      {displayLoginModal && (
        <div className="fixed inset-0 z-[99] bg-black/80 backdrop-blur-md">
          <div className="card absolute left-1/2 top-1/2 w-96 -translate-x-1/2 -translate-y-1/2 bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Login</h2>
              <div className="card-actions flex flex-col items-center justify-center">
                {Object.values(providers).map((provider: Provider) => {
                  if (provider.name) {
                    return (
                      <div key={provider.name} className="flex justify-center">
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
          </div>
        </div>
      )}
      <div className="pointer-events-none fixed top-0 z-10 flex h-20 w-full justify-center">
        <div className="pointer-events-auto w-full max-w-xl bg-primary-content ">
          SEARCH
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl justify-center">
        {!router.pathname.includes("auth") && (
          <div className="sticky top-0 hidden flex-grow self-start md:block">
            <nav>navigation</nav>
            <div>component a</div>
          </div>
        )}
        <div className="relative w-full max-w-xl">
          <main className="mt-20 min-h-[calc(100vh-5rem)] bg-base-300 p-3">
            <Component {...pageProps} />
          </main>
        </div>
        {!router.pathname.includes("auth") && (
          <div className="sticky top-0 hidden flex-grow self-start md:block">
            <div>component b</div>
            <div>component c</div>
          </div>
        )}
      </div>
      {/* TODO: remove this button, for demo only */}
      <button
        className="btn btn-ghost fixed bottom-0 right-0"
        onClick={() => setDisplayLoginModal(true)}
      >
        toggle login modal
      </button>
      {sessionData && (
        <button
          className="btn btn-ghost fixed bottom-0 left-0"
          onClick={() => signOut()}
        >
          Sign Out
        </button>
      )}
    </>
  );
};

export default Container;
