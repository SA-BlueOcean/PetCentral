import { api } from "@/utils/api";
import Image from "next/image";
import Avatar from "@/components/Feed/Avatar";
import { PenSquare } from "lucide-react";
import { Camera } from "lucide-react";
import { useSession } from "next-auth/react";
import AddFriend from "./AddFriend";
import AddChat from "../Chat/AddChat";
import { cn } from "@/utils/cn";

export function ProfileHeader({ profileId }: { profileId: string }) {
  const user = api.profile.get.useQuery(
    { profileId },
    { enabled: !!profileId },
  );
  const session = useSession();
  const friendsList = user.data?.friendsA.concat(user.data?.friendsB);

  return (
    <>
      <div className="relative -m-3">
        {session.data?.user?.id === user.data?.id ? (
          <button
            onClick={() =>
              (
                document.getElementById(
                  "my_modal_3",
                ) as HTMLDialogElement | null
              )?.showModal?.()
            }
            className="absolute right-4 z-20 mt-3 rounded-lg border-none bg-neutral p-1 hover:bg-accent"
          >
            <Camera size={25} strokeWidth={1} absoluteStrokeWidth />
          </button>
        ) : (
          ""
        )}
        <div className="absolute h-52 w-full">
          {user.isLoading ? (
            <div className="skeleton w-full h-full rounded-none"></div>
          ) : (
            <Image
              src={
                user.data?.bannerPhotoUrl
                  ? user.data?.bannerPhotoUrl
                  : "https://cdn.thewirecutter.com/wp-content/media/2021/06/20210617_doggie_dna_topart_2x1.jpg?auto=webp&quality=75&crop=1.91:1&width=1200"
              }
              alt="Background"
              width={700}
              height={200}
              className="h-full max-h-52 max-w-full object-cover"
              unoptimized={true}
            />
          )}
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center pt-52 sm:flex-row sm:items-start sm:justify-normal">
          <div className="absolute top-0 translate-y-[calc(-50%+13rem)]">
            <div className="relative h-32 w-32 rounded-full sm:h-40 sm:w-40">
              {session.data?.user?.id === user.data?.id ? (
                <button
                  onClick={() =>
                    (
                      document.getElementById(
                        "my_modal_5",
                      ) as HTMLDialogElement | null
                    )?.showModal?.()
                  }
                  className="absolute right-0 z-10 rounded-lg border-none bg-neutral p-1 hover:bg-accent"
                >
                  <Camera size={25} strokeWidth={1} absoluteStrokeWidth />
                </button>
              ) : (
                ""
              )}
              <div
                className={cn(
                  "relative h-32 w-32 overflow-hidden rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 sm:h-40 sm:w-40",
                  user.isLoading && "skeleton",
                )}
              >
                {user.isFetched && (
                  <Avatar profilePhotoUrl={user.data?.profilePhotoUrl} />
                )}
              </div>
            </div>
          </div>
          <div className="h-16 w-32 flex-none sm:h-20 sm:w-40"></div>

          <div className="mx-auto p-2 sm:m-3 sm:w-full sm:p-0">
            <p className="relative text-2xl font-bold">
              {user.data?.firstName
                ? user.data?.firstName + " " + user.data?.lastName
                : user.data?.name}
              {session.data?.user?.id === user.data?.id ? (
                <button
                  className="absolute right-0 top-0 rounded-lg border-none bg-neutral p-1 hover:bg-accent"
                  onClick={() =>
                    (
                      document.getElementById(
                        "my_modal_4",
                      ) as HTMLDialogElement | null
                    )?.showModal?.()
                  }
                >
                  <PenSquare size={18} strokeWidth={0.75} absoluteStrokeWidth />
                </button>
              ) : (
                ""
              )}
            </p>
            <div className="flex items-baseline gap-4">
              {user.data?.location?.locationName && (
                <>
                  <span className="">{user.data?.location?.locationName} </span>
                  |
                </>
              )}
              <span className=""> {user.data?.pets.length} Pets </span>|
              <span className=""> {friendsList?.length} Pals </span>
            </div>
          </div>
          {session.data?.user.id !== profileId && (
            <div className="-mt-6 mr-4 flex flex-col items-center justify-center gap-2">
              <AddFriend userId={profileId} />
              <AddChat userId={user.data?.id} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
