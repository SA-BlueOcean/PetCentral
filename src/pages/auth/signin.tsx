import { getProviders, signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

type Provider = {
  name: string;
  id: string;
};

export default function SignIn({ providers }: { providers: Provider[] }) {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") router.push("/").catch(console.error);
  }, [status]);

  return (
    <>
      <Head>
        <title>Pet Pals Sign In</title>
        <meta name="description" content="App description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
                      className="flex w-full justify-center"
                    >
                      <button
                        className="btn btn-accent my-1 w-full rounded-full text-base-100"
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
    </>
  );
}
export const getServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
