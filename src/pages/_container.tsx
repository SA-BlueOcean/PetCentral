import { useGlobalContext } from "@/providers/GlobalContext";
import type { AppProps } from "next/app";
import { useEffect } from "react";

const Container = ({ Component, pageProps }: AppProps) => {
  const { displayLoginModal, setDisplayLoginModal } = useGlobalContext();

  //disables scroll if modal is open
  useEffect(() => {
    if (displayLoginModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [displayLoginModal]);

  return (
    <>
      {displayLoginModal && (
        <div className="fixed inset-0 z-[99] bg-black/80 backdrop-blur-md">
          <div className="card absolute left-1/2 top-1/2 w-96 -translate-x-1/2 -translate-y-1/2 bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Login!</h2>
              <div className="card-actions justify-end">
                <button
                  className="btn btn-ghost"
                  onClick={() => setDisplayLoginModal(false)}
                >
                  No
                </button>
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
        <div className="sticky top-0 hidden flex-grow self-start md:block">
          <nav>navigation</nav>
          <div>component a</div>
        </div>
        <div className="relative w-full max-w-xl">
          <main className="mt-20 min-h-[calc(100vh-5rem)] bg-base-300 p-3">
            <Component {...pageProps} />
          </main>
        </div>
        <div className="sticky top-0 hidden flex-grow self-start md:block">
          <div>component b</div>
          <div>component c</div>
        </div>
      </div>
      {/* TODO: remove this button, for demo only */}
      <button
        className="btn btn-ghost fixed bottom-0 right-0"
        onClick={() => setDisplayLoginModal(true)}
      >
        toggle login modal
      </button>
    </>
  );
};

export default Container;
