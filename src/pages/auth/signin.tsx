import { getProviders, signIn } from "next-auth/react";
import Head from "next/head";

type Provider = {
  name: string;
  id: string;
};

export default function SignIn({ providers }: { providers: Provider[] }) {
  return (
    <>
      <Head>
        <title>Pet Pals Sign In</title>
        <meta name="description" content="App description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {Object.values(providers).map((provider: Provider) => {
          if (provider.name) {
            return (
              <div key={provider.name}>
                <button
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
    </>
  );
}
export const getServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};
