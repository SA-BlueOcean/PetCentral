import TopNav from "@/components/Nav/TopNav";
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
          <div className="pointer-events-none fixed top-0 z-10 flex h-16 w-full justify-center">
            <header className="pointer-events-auto w-full max-w-xl">
              <TopNav />
            </header>
          </div>
          <div className="mx-auto flex max-w-7xl justify-center">
            <div className="sticky top-0 hidden flex-grow self-start md:block">
              <nav>navigation</nav>
              <div>component a</div>
            </div>
            <div className="relative w-full max-w-xl">
              <main className="mt-16 min-h-[calc(100vh-4rem)] bg-base-300 p-3">
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
            sidebar content
          </ul>
        </div>
      </div>
    </>
  );
};

export default Container;
