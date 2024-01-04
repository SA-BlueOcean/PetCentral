import { api } from "@/utils/api";
import Image from "next/image";
import Avatar from "@/components/Feed/Avatar";
import { PenSquare } from "lucide-react";
import { Camera } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export function ProfileHeader({ profileId }: { profileId: string }) {
  const user = api.profile.get.useQuery(
    { profileId },
    { enabled: !!profileId },
  );
  const router = useRouter();
  const session = useSession();
  const friendsList = user.data?.friendsA.concat(user.data?.friendsB);

  return (
    <>
      <div>
        {session.data?.user?.id === user.data?.id ? (
          <button
            onClick={() =>
              (
                document.getElementById(
                  "my_modal_3",
                ) as HTMLDialogElement | null
              )?.showModal?.()
            }
          >
            <Camera
              size={25}
              strokeWidth={1}
              absoluteStrokeWidth
              className="absolute right-4 z-10 mt-3 rounded-lg border-none bg-neutral p-1 hover:bg-accent"
            />
          </button>
        ) : (
          ""
        )}
        <Image
          src={
            user.data?.bannerPhotoUrl
              ? user.data?.bannerPhotoUrl
              : "https://cdn.thewirecutter.com/wp-content/media/2021/06/20210617_doggie_dna_topart_2x1.jpg?auto=webp&quality=75&crop=1.91:1&width=1200"
          }
          alt="Background"
          width={700}
          height={200}
          className="h-auto max-h-[200px] max-w-full object-cover"
          unoptimized={true}
        ></Image>
        <div className="avatar mt-[-5rem]">
          {session.data?.user?.id === user.data?.id ? (
            <button
              onClick={() =>
                (
                  document.getElementById(
                    "my_modal_5",
                  ) as HTMLDialogElement | null
                )?.showModal?.()
              }
            >
              <Camera
                size={25}
                strokeWidth={1}
                absoluteStrokeWidth
                className="absolute right-4 z-10 mr-[-.5rem] mt-[-4.5rem] rounded-lg border-none bg-neutral p-1 hover:bg-accent"
              />
            </button>
          ) : (
            ""
          )}
          {/* <Camera
            size={25}
            strokeWidth={1}
            absoluteStrokeWidth
            className="absolute right-4 z-10 mr-0 mt-2 rounded-lg border-none bg-neutral p-1 hover:bg-accent"
          /> */}
          <div className="relative w-20 overflow-hidden rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 sm:w-40">
            {user.data?.profilePhotoUrl ? (
              <Image
                src={user.data?.profilePhotoUrl}
                alt="profile picture"
                unoptimized={true}
                fill={true}
              />
            ) : (
              <Avatar />
            )}
          </div>
        </div>
        <div>
          <div className="ml-44 mt-[-5rem]">
            <p className="pl-5 text-2xl font-bold">
              {user.data?.firstName
                ? user.data?.firstName + " " + user.data?.lastName
                : user.data?.name}
              {session.data?.user?.id === user.data?.id ? (
                <button
                  className="float-right mr-2 rounded-lg border-none bg-neutral p-1 hover:bg-accent"
                  onClick={() =>
                    (
                      document.getElementById(
                        "my_modal_4",
                      ) as HTMLDialogElement | null
                    )?.showModal?.()
                  }
                >
                  <PenSquare
                    size={18}
                    strokeWidth={0.75}
                    absoluteStrokeWidth
                    className="m-0 p-0"
                  />
                </button>
              ) : (
                ""
              )}
            </p>
            <div>
              <span className="px-4">
                {" "}
                {user.data?.location?.locationName}{" "}
              </span>
              |<span className="px-4"> {user.data?.pets.length} Pets </span>|
              <span className="px-4"> {friendsList?.length} Pals </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
