import Head from "next/head";
import Link from "next/link";
import { api } from "@/utils/api";
// import { useRouter } from "next/router";
import Image from "next/image";
import { useGlobalContext } from "@/providers/GlobalContext";

export default function MyGroups() {
  const { setDisplayLoginModal } = useGlobalContext();
  const groupsList = api.groups.fetchGroups.useQuery();

  const commonHead = (
    <Head>
      <title>My Groups | PetCentral</title>
      <meta name="description" content="App description" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );

  if (groupsList.isLoading) {
    return (
      <>
      {commonHead}
        <div>Loading Groups...</div>
      </>
    )
  }
  if (groupsList.isError) {
    setDisplayLoginModal(true)
    return (
      <>
      {commonHead}
        <div>eError: Unable to fetch groups. Please log in.</div>
      </>
    )
  }
  return (
    <>
      {commonHead}
        <div className="flex flex-col gap-4 w-full">
        {groupsList.data?.groups?.map((group) => (
          <div key={group.id} className="flex ring-base-500 rounded-lg bg-base-100 ring-1 p-3">
            <Link href={`/${group.id}`} className="relative h-10 w-10 overflow-clip rounded-lg bg-secondary ring-1 ring-base-200">
              <Image src={`${group.photoUrl}`} alt={`Image for ${group.name}`} width={50} height={50} unoptimized={true}/>
            </Link>
            <div className="flex flex-col mx-4">
              <Link href={`/${group.id}`} passHref>
                <h2>{group.name}</h2>
              </Link>
              <p>{group.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}