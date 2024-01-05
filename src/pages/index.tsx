import Head from "next/head";
import Feed from "@/components/Feed";

export default function Home() {
  return (
    <>
      <Head>
        <title>PetPals</title>
        <meta name="description" content="PetPals" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Feed mode="ALL" />
      </div>
    </>
  );
}

