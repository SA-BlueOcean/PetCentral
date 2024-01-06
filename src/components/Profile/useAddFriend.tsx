import { useGlobalContext } from "@/providers/GlobalContext";
import { api } from "@/utils/api";

export default function useAddFriend() {
  const { setDisplayLoginModal } = useGlobalContext();
  const mutation = api.friends.addFriend.useMutation();
  const addFriend = async (
    userId: string,
    onErrorCb?: (
      error: unknown,
      variables: {
        userId: string;
      },
      context: unknown,
    ) => void,
    onSuccessCb?: (
      data: "ACCEPTED" | "PENDING",
      variables: {
        userId: string;
      },
    ) => void,
  ) => {
    const m = await mutation.mutateAsync(
      { userId },
      {
        onError(error, variables, context) {
          if (error.message === "UNAUTHORIZED") {
            setDisplayLoginModal(true);
          }
          onErrorCb && onErrorCb(error, variables, context);
        },
        onSuccess(data, variables) {
          onSuccessCb && onSuccessCb(data, variables);
        },
      },
    );
    return m;
  };

  return {
    addFriend,
  };
}
