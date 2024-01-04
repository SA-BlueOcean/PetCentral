import Head from "next/head";
import Link from "next/link";

import { api } from "@/utils/api";


export default function Home() {


  return (
    <>
      <Head>
        <title>Search | PetCentral</title>
        <meta name="description" content="App description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto">
        Hello from Search Results
      </div>
    </>
  );
}

