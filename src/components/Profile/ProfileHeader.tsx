import Avatar from "@/components/Feed/Avatar";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import { Camera, PenSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import AddChat from "../Chat/AddChat";
import AddFriend from "./AddFriend";

export function ProfileHeader({ profileId }: { profileId: string }) {
  const user = api.profile.get.useQuery(
    { profileId },
    { enabled: !!profileId },
  );
  const session = useSession();
  const friendsList = user.data?.friendsA;

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
            <div className="skeleton h-full w-full rounded-none"></div>
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

        <div className="relative z-10 flex flex-col items-center justify-center pt-52 text-center sm:flex-row sm:items-start sm:justify-normal sm:pl-5 sm:text-left">
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
                  "relative h-32 w-32 overflow-hidden rounded-full ring-4 ring-base-300 ring-offset-base-100   sm:h-40 sm:w-40",
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

          <div className="p-2 sm:m-3 sm:mx-auto sm:ml-3 sm:w-full sm:p-0">
            <p className="relative text-2xl font-bold">
              {user.data?.firstName
                ? user.data?.firstName + " " + user.data?.lastName
                : user.data?.name}
              {session.data?.user?.id === user.data?.id ? (
                <button
                  className="absolute right-0 top-0 mr-5 rounded-lg border-none bg-neutral p-1 hover:bg-accent"
                  onClick={() =>
                    (
                      document.getElementById(
                        "my_modal_4",
                      ) as HTMLDialogElement | null
                    )?.showModal?.()
                  }
                >
                  <PenSquare size={25} strokeWidth={1} absoluteStrokeWidth />
                </button>
              ) : (
                ""
              )}
            </p>
            <div className="flex items-baseline gap-4 text-base-700">
              {user.data?.location?.locationName && (
                <>
                  <span>{user.data?.location?.locationName} </span>|
                </>
              )}
              <span className=""> {user.data?.pets.length} Pets </span>|
              <span className=""> {friendsList?.length} Pals </span>
            </div>
          </div>
          {session.data?.user.id !== profileId && (
            <div className="flex flex-row items-center justify-center gap-2 sm:absolute sm:right-5 sm:-mt-6">
              <AddFriend userId={profileId} />
              <AddChat userId={user.data?.id} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
