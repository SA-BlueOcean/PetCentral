import { api } from "@/utils/api";
import Image from "next/image";
import { useSession } from "next-auth/react";
import JoinButton from "./JoinBtn";

type Group = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string | null;
  photoUrl: string | null;
  bannerPhotoUrl: string | null;
};

type GroupProps = {
  group: Group | null;
};

export function GroupHeader({ group }: GroupProps) {
  // Add a null check before destructuring
  let name, description;
  let id = "";
  let bannerPhotoUrl = "https://placekitten.com/500/100";
  let photoUrl = "https://placekitten.com/300/300";
  if (group) {
    id = group.id;
    name = group.name;
    description = group.description;
    photoUrl = group.photoUrl ?? photoUrl;
    bannerPhotoUrl = group.bannerPhotoUrl ?? bannerPhotoUrl;
  }

  const mutation = api.users.updateUserGroups.useMutation({});
  const disconnect = api.users.removeUserGroup.useMutation({});

  const getMemberIds = api.groups.fetchMembers.useQuery(
    { groupId: id },
    { enabled: !!id },
  );

  const memberIdArr = getMemberIds?.data?.users?.map((user) => user.id);
  const user = useSession().data?.user?.id;

  const userIsMember = memberIdArr?.includes(user ?? "");

  return (
    <>
      <div className="relative -m-3 pb-4">
        {/* GROUP BANNER */}
        <div className="absolute">
          <Image
            src={bannerPhotoUrl}
            alt={`${name} banner background`}
            width={700}
            height={100}
            unoptimized={true}
            className="h-full max-h-20 max-w-full object-cover"
          ></Image>
        </div>

        <div className="z-10 flex w-full pt-20 px-10 gap-4">
          <div className="absolute top-0 translate-y-1/2">
            <div className="relative h-20 w-20 overflow-hidden rounded ring ring-base-300 ring-offset-2 ring-offset-base-300 ">
              <Image
                src={photoUrl}
                alt="group avatar"
                unoptimized={true}
                fill={true}
              />
            </div>
          </div>
          <div className="w-20"></div>

          <div className="flex justify-between p-2 w-full">
            <div className="flex flex-col">
              <span className="text-l font-bold">{name}</span>
              <p className="text-sm">{description}</p>
            </div>
            <JoinButton id={id} />
          </div>
        </div>
      </div>
    </>
  );
}
