import { api } from "@/utils/api";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

type Group = {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  bannerPhotoUrl: string;
};

type GroupProps = {
  group: Group;
  members: number;
};

export function GroupHeader({ group, members }: GroupProps) {
  const { name, description, photoUrl, bannerPhotoUrl } = group;
  const groupId = group.id;
  const mutation = api.users.updateUserGroups.useMutation({});
  const disconnect = api.users.removeUserGroup.useMutation({});

  const getMemberIds = api.groups.fetchMembers.useQuery(
    { groupId: groupId },
    { enabled: !!groupId },
  );

  const memberIdArr = getMemberIds?.data?.users?.map((user) => user.id);
  const user = useSession().data?.user?.id;

  const userIsMember = memberIdArr?.includes(user ?? "");

  const updateUserGroups = async () => {
    if (userIsMember) {
      console.log("user is member");
      const result = await disconnect.mutateAsync({ groupId });
      console.log(result);
    } else {
      console.log("user is not member");
      const result = await mutation.mutateAsync({ groupId });
      console.log(result);
    }
  };

  return (
    <>
      <div>
        {/* GROUP BANNER */}
        <Image
          src={bannerPhotoUrl}
          alt={`${name} banner background`}
          width={700}
          height={100}
          unoptimized={true}
          className="h-20 w-full object-cover"
        ></Image>

        {/* GROUP AVATAR */}
        <div className="avatar mx-auto block max-h-28 w-11/12 sm:-mt-8">
          <div className="relative max-h-20 w-full overflow-hidden rounded ring ring-base-300 ring-offset-2 ring-offset-base-300 sm:w-20">
            <Image
              src={photoUrl}
              alt="group avatar"
              unoptimized={true}
              fill={true}
            />
          </div>
          {/* GROUP META */}
          <div className="-mt-10 ml-24 inline-block">
            <div className="flex flex-row">
              <span className="text-l basis-3/5 font-bold">{name}</span>
              <span className="basis-2/5 text-right">
                {members} {members === 1 ? <>Member</> : <>Members</>}
              </span>
            </div>
            <div className="flex flex-row">
              <p className="basis-4/5 text-sm">{description}</p>
              {userIsMember ? (
                <button
                  className="btn btn-primary btn-xs basis-1/5 rounded-btn uppercase text-white"
                  onClick={() => updateUserGroups()}
                >
                  Leave
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-xs basis-1/5 rounded-btn uppercase text-white"
                  onClick={() => updateUserGroups()}
                >
                  Join
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
