import { api } from "@/utils/api";
import Image from "next/image";
import { PenSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
// import { useTransition } from "react";

export function ProfileHeader({ profileId }: { profileId: string }) {
  // const profileId = router.query.profileId as string;
  const user = api.profile.get.useQuery(
    { profileId },
    { enabled: !!profileId },
  );
  const router = useRouter();
  const session = useSession();
  // confirm that this is actually the friends list...
  const friendsList = user.data?.friendsA.concat(user.data?.friendsB);

  session.data?.user?.id === user.data?.id;

  return (
    <>
      <div>
        {/* PROFILE BANNER */}
        <Image
          src={
            user.data?.profilePhotoUrl ??
            "https://cdn.thewirecutter.com/wp-content/media/2021/06/20210617_doggie_dna_topart_2x1.jpg?auto=webp&quality=75&crop=1.91:1&width=1200"
          }
          alt="Background"
          width={700}
          height={200}
          className="h-auto max-h-[200px] max-w-full max-w-full object-cover"
          unoptimized={true}
        ></Image>
        {/* PROFILE PICTURE */}
        <div className="avatar mt-[-5rem]">
          <div className="relative w-20 overflow-hidden rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 sm:w-40">
            <Image
              src={
                user.data?.profilePhotoUrl ??
                "https://clipart-library.com/images/BiaEg4n8T.jpg"
              }
              alt="profile picture"
              unoptimized={true}
              fill={true}
            />
          </div>
        </div>
        <div>
          {/* PROFILE NAME */}
          <div className="ml-44 mt-[-5rem]">
            <p className="pl-5 text-xl font-bold">
              {user.data?.firstName
                ? user.data?.firstName + " " + user.data?.lastName
                : user.data?.name}
              {session.data?.user?.id === user.data?.id ? (
                <button
                  className="float-right mr-2 rounded-lg border-none bg-neutral p-1 hover:bg-accent/20"
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
              <span className="px-4"> Petstown, USA </span>|
              <span className="px-4"> {user.data?.pets.length} Pets </span>|
              <span className="px-4"> {friendsList?.length} Pals </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
