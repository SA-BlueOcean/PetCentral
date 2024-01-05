import Head from "next/head";
import Link from "next/link";
import { api } from "@/utils/api";
import Image from "next/image";
import CreateGroupModal from "@/components/Group/CreateGroupModal";
import JoinButton from "@/components/Group/JoinBtn";

export default function GroupsSearch() {
  const groupsList = api.groups.findAllGroups.useQuery();

  return (
    <>
      <Head>
        <title>Groups Search | PetPals</title>
        <meta name="description" content="App description" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex w-full flex-col gap-4">
        <CreateGroupModal />
        {groupsList.data?.groups.map((group) => (
          <div
            key={group.id}
            className="flex rounded-lg bg-base-100 p-3 ring-1 ring-base-500"
          >
            <Link
              href={`/group/${group.id}`}
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
              <Link href={`/group/${group.id}`}>
                <h2 className="link-hover">{group.name}</h2>
              </Link>
              <p>{group.description}</p>
            </div>
            <JoinButton id={group.id} />
          </div>
        ))}
      </div>
    </>
  );
}
