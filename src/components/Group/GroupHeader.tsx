import { api } from "@/utils/api";
import Image from "next/image";
import { useSession } from "next-auth/react";

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
  members: number;
};

export function GroupHeader({ group, members }: GroupProps) {
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

  const updateUserGroups = async () => {
    if (userIsMember) {
      disconnect.mutate({ groupId: id });
    } else {
      mutation.mutate({ groupId: id });
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
          <div className="-mt-10 ml-24 inline-block h-24 w-5/6">
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
