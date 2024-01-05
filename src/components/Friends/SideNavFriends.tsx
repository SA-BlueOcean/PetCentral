import Link from "next/link";
import Image from "next/image";
import { api } from "@/utils/api";

export default function SideNavFriends() {
  const friends = api.friends.getFriends.useQuery();

  return (
    <nav className="relative mt-2 flex flex-col items-center justify-center rounded-lg bg-primary-content text-neutral">
      <Link
        href={"/friends"}
        className="flex w-full items-center justify-center  p-4">
        <h2 className="p-4 text-2xl link-hover">Friends</h2>
      </Link>
      <div className="relative max-h-[40vh] w-full overflow-y-auto">
        {friends.isLoading ? (
          <ul className="flex flex-col divide-y px-3">
            {new Array(3).fill(0).map((_, i) => (
              <li key={i} className="flex w-full items-center gap-3 py-2">
                <div className="skeleton h-10 w-10 rounded-lg bg-secondary ring-1 ring-base-200"></div>
                <div className="skeleton relative h-6 w-3/5 bg-primary opacity-50"></div>

              </li>
            ))}
          </ul>
        ) : (
          <ul className="flex flex-col divide-y px-3">
            {(friends?.data?.friends?.length ?? 0) > 0 ? (
              <>
                {friends.data?.friends.map((friend) => (
                  <li key={friend.friendB.name} className="flex w-full py-3">
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
                ))}
              </>
            ) : (
              <li className="flex w-full justify-center py-3">
                You have no friends
              </li>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
}
