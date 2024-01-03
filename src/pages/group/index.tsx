import Head from "next/head";
// import Link from "next/link";
import { api } from "@/utils/api";
// import { useRouter } from "next/router";

export default function GroupsSearch() {
  const groupsList = api.groups.findAllGroups.useQuery();
  console.log("+++", groupsList.data?.groups);
  return (
    <>
      <Head>
        <title>Groups Search | PetCentral</title>
        <meta name="description" content="App description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b ">
        {groupsList.data?.groups.map((group) => (
          <div key={group.id}>
            <h1>{group.name}</h1>
            <p>{group.description}</p>
          </div>
        ))}
      </main>
    </>
  );
}
