import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import Image from "next/image";
import JoinButton from "./JoinBtn";

type GroupProps = {
  groupId: string; //Group | null;
};

const defaultBannerPhotoUrl = "https://placekitten.com/500/100";
const defaultPhotoUrl = "https://placekitten.com/300/300";

export function GroupHeader({ groupId }: GroupProps) {
  const groupQuery = api.groups.fetchDetails.useQuery({
    groupID: groupId,
  });

  const { bannerPhotoUrl, photoUrl, name, description } =
    groupQuery?.data?.group || {};

  return (
    <>
      <div className="relative -m-3 pb-4">
        {/* GROUP BANNER */}
        <div className="absolute h-20 w-full">
          {groupQuery.isLoading ? (
            <div className="skeleton h-full w-full rounded-none"></div>
          ) : (
            <Image
              src={bannerPhotoUrl ?? defaultBannerPhotoUrl}
              alt={`${name} banner background`}
              width={700}
              height={100}
              unoptimized={true}
              className="h-full max-h-20 max-w-full object-cover"
            ></Image>
          )}
        </div>

        <div className="z-10 flex w-full gap-4 px-10 pt-20">
          <div className="absolute top-0 translate-y-1/2">
            <div
              className={cn(
                "relative h-20 w-20 overflow-hidden rounded ring ring-base-300 ring-offset-2 ring-offset-base-300 ",
                groupQuery.isLoading && "skeleton",
              )}
            >
              {groupQuery.isFetched && (
                <Image
                  className="object-cover"
                  src={photoUrl || defaultPhotoUrl}
                  alt="group avatar"
                  unoptimized={true}
                  fill={true}
                />
              )}
            </div>
          </div>
          <div className="w-20"></div>

          <div className="flex w-full justify-between p-2">
            <div className="flex flex-col">
              <span className="text-l font-bold">{name}</span>
              <p className="text-sm">{description}</p>
            </div>
            <JoinButton id={groupId} />
          </div>
        </div>
      </div>
    </>
  );
}
