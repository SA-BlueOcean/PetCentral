import Link from "next/link";
import Image from "next/image";
import { api } from "@/utils/api";

export default function SideNavFriends() {
  const friends = api.friends.getFriends.useQuery().data?.friends ?? [];

  return (
    <nav className="relative mt-2 flex flex-col items-center justify-center rounded-lg bg-primary-content text-neutral">
      <h2 className="p-4 text-2xl">Friends</h2>
      <div className="relative max-h-[40vh] w-full overflow-y-auto">
        <ul className="divide-y px-3">
          {friends.length ? (
            friends.map((friend) => (
              <li
                key={friend.friendB.name}
                className="flex w-full justify-center py-3"
              >
                <Link
                  href={`/profile/${friend.friendB.id}`}
                  className="flex items-center gap-3 pl-px"
                >
                  <Image
                    src={`${friend.friendB.profilePhotoUrl}`}
                    alt={`Image for ${friend.friendB.name}`}
                    width={50}
                    height={50}
                    unoptimized={true}
                    className=" h-10 w-10 flex-none rounded-lg bg-secondary ring-1 ring-base-200"
                  />
                  {friend.friendB.name}
                </Link>
              </li>
            ))
          ) : (
            <li className="flex w-full justify-center py-3">
              You have no friends
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}