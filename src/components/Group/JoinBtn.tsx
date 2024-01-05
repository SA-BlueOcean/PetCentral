import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";

export default function JoinButton({ id }: { id: string }) {
  const user = useSession().data?.user?.id;
  const mutation = api.users.updateUserGroups.useMutation({});
  const disconnect = api.users.removeUserGroup.useMutation({});
  const userIsMember = api.groups.fetchIsMember.useQuery(
    {
      groupId: id,
    },
    {
      enabled: !!id && !!user,
    },
  );
  const getMemberIds = api.groups.fetchMembers.useQuery(
    { groupId: id },
    { enabled: !!id },
  );

  const membersCount = getMemberIds?.data?.usersIds?.length;
  const utils = api.useUtils();

  const updateUserGroups = async () => {
    if (userIsMember.isLoading) {
      return;
    }
    if (userIsMember.data === false) {
      mutation.mutate(
        { groupId: id },
        {
          onSuccess() {
            void utils.groups.fetchMembers.invalidate({ groupId: id });
            void utils.groups.fetchIsMember.invalidate({ groupId: id });
          },
        },
      );
    } else {
      disconnect.mutate(
        { groupId: id },
        {
          onSuccess() {
            void utils.groups.fetchMembers.invalidate({ groupId: id });
            void utils.groups.fetchIsMember.invalidate({ groupId: id });
          },
        },
      );
    }
  };

  return (
    <>
      <div className="ml-auto flex flex-col">
        <span className="r-0 basis-2/5 text-right text-xs text-gray-400">
          {membersCount} {membersCount === 1 ? <>Member</> : <>Members</>}
        </span>
        <button
          disabled={
            mutation.isLoading || disconnect.isLoading || userIsMember.isLoading
          }
          className={cn(
            "btn btn-xs basis-1/5 rounded-btn uppercase text-white",
            userIsMember.data === true ? "btn-secondary" : "btn-primary",
          )}
          onClick={() => updateUserGroups()}
        >
          {mutation.isLoading || disconnect.isLoading || userIsMember.isFetching || userIsMember.isLoading ? (
            <Loader size={12} className="animate-spin" />
          ) : userIsMember.data === true ? (
            "Leave"
          ) : userIsMember.data === false ? (
            "Join"
          ) : (
            ""
          )}
        </button>
      </div>
    </>
  );
}
