import { api } from "@/utils/api";
import { useSession } from "next-auth/react";

export default function JoinButton({ id }: { id: string }) {
  const mutation = api.users.updateUserGroups.useMutation({});
  const disconnect = api.users.removeUserGroup.useMutation({});

  const getMemberIds = api.groups.fetchMembers.useQuery(
    { groupId: id },
    { enabled: !!id },
  );

  const memberIdArr = getMemberIds?.data?.users?.map((user) => user.id);
  const members = getMemberIds?.data?.users?.length;
  const user = useSession().data?.user?.id;
  const utils = api.useUtils();
  const userIsMember = memberIdArr?.includes(user ?? "");

  const updateUserGroups = async () => {
    if (userIsMember) {
      disconnect.mutate(
        { groupId: id },
        {
          onSuccess() {
            void utils.groups.fetchMembers.invalidate();
          },
        },
      );
    } else {
      mutation.mutate(
        { groupId: id },
        {
          onSuccess() {
            void utils.groups.fetchMembers.invalidate();
          },
        },
      );
    }
  };

  return (
    <>
      <div className="ml-auto flex flex-col">
        <span className="r-0 basis-2/5 text-right text-xs text-gray-400">
          {members} {members === 1 ? <>Member</> : <>Members</>}
        </span>
        {userIsMember ? (
          <button
            className="btn btn-secondary btn-xs basis-1/5 rounded-btn uppercase text-white"
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
    </>
  );
}
