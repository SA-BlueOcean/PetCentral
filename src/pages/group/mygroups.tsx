import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/utils/api";
import { useGlobalContext } from "@/providers/GlobalContext";

export default function MyGroups() {
  const { setDisplayLoginModal } = useGlobalContext();
  const groupsList = api.groups.fetchGroups.useQuery();

  const commonHead = (
    <Head>
      <title>My Groups | PetPals</title>
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
    );
  }
  if (groupsList.isError) {
    setDisplayLoginModal(true);
    return (
      <>
        {commonHead}
        <div>Error: Unable to fetch groups. Please log in.</div>
      </>
    );
  }
  if (groupsList.data?.groups?.length === 0) {
    return (
      <>
        {commonHead}
        <div className="my-2 flex h-full w-full justify-center text-xl">
          You are not a member of any groups.
        </div>
        <div className="flex h-full w-full justify-center text-xl">
          <Link href="/group" className="text-primary-content underline">
            Create one?
          </Link>
        </div>
      </>
    );
  }
  return (
    <>
      {commonHead}
      <div className="flex w-full flex-col gap-4">
        Your Groups
        {groupsList.data?.groups?.map((group) => (
          <div
            key={group.id}
            className="flex rounded-lg bg-base-100 p-3 ring-1 ring-base-400"
          >
            <Link
              href={`/${group.id}`}
              className="relative h-10 w-10 overflow-clip rounded-lg bg-secondary ring-1 ring-base-200"
            >
              <Image
                src={`${group.photoUrl}`}
                alt={`Image for ${group.name}`}
                width={50}
                height={50}
                unoptimized={true}
              />
            </Link>
            <div className="mx-4 flex flex-col">
              <Link href={`/${group.id}`} passHref>
                <h2 className="link-hover">{group.name}</h2>
              </Link>
              <p>{group.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
