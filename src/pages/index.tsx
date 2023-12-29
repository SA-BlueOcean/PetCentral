import Head from "next/head";
import { api } from "@/utils/api";
import { Example } from "@/components/Example";
import Feed from "@/components/Feed";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "example hi" });

  return (
    <>
      <Head>
        <title>MyApp</title>
        <meta name="description" content="App description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <p className="text-2xl ">
          {hello.data ? hello.data.greeting : "Loading tRPC query..."}
        </p>
        <Feed mode="ALL" />
        <Example />
      </div>
    </>
  );
}

