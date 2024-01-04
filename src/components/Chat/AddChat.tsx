import { useGlobalContext } from "@/providers/GlobalContext";
import { api } from "@/utils/api";
import { Loader, MessageCircle } from "lucide-react";

export default function AddChat({ userId }: { userId?: string }) {
  const mutation = api.chat.joinChat.useMutation();
  const { triggerOpenChat } = useGlobalContext();
  return (
    <button
      className="btn"
      disabled={mutation.isLoading}
      aria-label="chat"
      onClick={() =>
        userId &&
        mutation.mutate(
          { userId },
          {
            onError(error, variables, context) {
            },
            onSuccess(data, variables, context) {
              triggerOpenChat();
            },
          },
        )
      }
    >
      {mutation.isLoading ? (
        <Loader className="animate-spin" />
      ) : (
        <MessageCircle />
      )}
    </button>
  );
}
