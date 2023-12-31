import AddChat from "@/components/Chat/AddChat";
import { useGlobalContext } from "@/providers/GlobalContext";
import { api } from "@/utils/api";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function FriendsBasePage() {
  const { setDisplayLoginModal } = useGlobalContext();
  const friendsList = api.friends.getFriends.useQuery();
  const friends = api.friends.getFriends.useQuery().data?.friends ?? [];

  const commonHead = (
    <Head>
      <title>My Friends | PetPals</title>
      <meta name="description" content="App description" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );

  if (friendsList.isLoading) {
    return (
      <>
        {commonHead}
        <div>Loading Friends...</div>
      </>
    );
  }
  if (friendsList.isError) {
    setDisplayLoginModal(true);
    return (
      <>
        {commonHead}
        <div>Error: Unable to fetch Friends. Please log in.</div>
      </>
    );
  }
  if (friendsList.data?.friends?.length === 0) {
    return (
      <>
        {commonHead}
        <div className="my-2 flex h-full w-full justify-center text-xl">
          You do not have any Friends.
        </div>
        <div className="flex h-full w-full justify-center text-xl">
          <Link href="/friends/find" className="text-primary-content underline">
            Find Friends
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      {commonHead}
      <div className="flex w-full flex-col gap-4">
        Your Friends
        {friends.map((friend) => (
          <div
            key={friend.friendB.id}
            className="flex items-center justify-between rounded-lg bg-base-100 p-3 ring-1 ring-base-500"
          >
            <div className="flex">
              <Link
                href={`/profile/${friend.friendB.name}`}
                className="relative h-10 w-10 overflow-clip rounded-full bg-secondary object-cover ring-1 ring-base-200"
              >
                <Image
                  src={`${friend.friendB.profilePhotoUrl}`}
                  alt={`Image for ${friend.friendB.name}`}
                  unoptimized={true}
                  className="object-cover"
                  fill
                />
              </Link>
              <div className="mx-4 flex flex-col justify-center">
                <Link href={`/profile/${friend.friendB.id}`}>
                  <h2 className="link-hover">{friend.friendB.name}</h2>
                </Link>
              </div>
            </div>
            <div className="justify-end">
              <AddChat userId={friend.friendB.id}></AddChat>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
