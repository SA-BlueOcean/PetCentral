import { useGlobalContext } from "@/providers/GlobalContext";
import { api } from "@/utils/api";
import { Loader, MessageCircle } from "lucide-react";

export default function AddChat({ userId }: { userId?: string }) {
  const mutation = api.chat.joinChat.useMutation();
  const { triggerOpenChat, setDisplayLoginModal } = useGlobalContext();
  return (
    <div className="tooltip" data-tip="message">
      <button
        className="btn btn-circle"
        disabled={mutation.isLoading}
        aria-label="chat"
        onClick={() =>
          userId &&
          mutation.mutate(
            { userId },
            {
              onError(error, variables, context) {
                if (error.message === "UNAUTHORIZED") {
                  setDisplayLoginModal(true);
                }
              },
              onSuccess(data, variables, context) {
                triggerOpenChat(userId);
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
    </div>
  );
}
