import Head from "next/head";
import Link from "next/link";
import { api } from "@/utils/api";
// import { useRouter } from "next/router";
import Image from "next/image";

export default function GroupsSearch() {
  const groupsList = api.groups.findAllGroups.useQuery();

  return (
    <>
      <Head>
        <title>Groups Search | PetCentral</title>
        <meta name="description" content="App description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
<<<<<<< HEAD
      <div className="flex flex-col gap-4 w-full">
        {groupsList.data?.groups.map((group) => (
          <div key={group.id} className="flex ring-base-500 rounded-lg bg-base-100 ring-1 p-3">
            <Link href={`/${group.id}`} className="relative h-10 w-10 overflow-clip rounded-lg bg-secondary ring-1 ring-base-200">
              <Image src={`${group.photoUrl}`} alt={`Image for ${group.name}`} width={50} height={50} unoptimized={true}/>
=======
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b ">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight  sm:text-[5rem]">
            Group page no group!
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-primary-content p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl  font-bold">First Steps →</h3>
              <div className="text-lg">
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-secondary p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
              <div className="text-lg">
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
>>>>>>> origin
            </Link>
            <div className="flex flex-col mx-4">
              <Link href={`/${group.id}`} >
                  <h1>{group.name}</h1>
              </Link>
              <p>{group.description}</p>
            </div>
          </div>
<<<<<<< HEAD
        ))}
=======
          <p className="text-2xl ">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
          <Example />
        </div>
>>>>>>> origin
      </div>
    </>
  );
}
