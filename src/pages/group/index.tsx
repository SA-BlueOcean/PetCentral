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
      <div className="flex flex-col gap-4 w-full">
        {groupsList.data?.groups.map((group) => (
          <div key={group.id} className="flex ring-base-500 rounded-lg bg-base-100 ring-1 p-3">
            <Link href={`/${group.id}`} className="relative h-10 w-10 overflow-clip rounded-lg bg-secondary ring-1 ring-base-200">
              <Image src={`${group.photoUrl}`} alt={`Image for ${group.name}`} width={50} height={50} unoptimized={true}/>
            </Link>
            <div className="flex flex-col mx-4">
              <Link href={`/${group.id}`} >
                  <h1>{group.name}</h1>
              </Link>
              <p>{group.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
