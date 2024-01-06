import { api } from "@/utils/api";
import {
  Loader,
  UserRoundCheck,
  UserRoundCog,
  UserRoundPlus,
} from "lucide-react";
import { useState } from "react";
import useAddFriend from "./useAddFriend";

export default function AddFriend({ userId }: { userId: string }) {
  const utils = api.useUtils();
  const friendStatus = api.friends.getStatus.useQuery({ userId });
  const friendState = friendStatus.data;
  const [loading, setLoading] = useState(false);
  const { addFriend } = useAddFriend();

  const handleButton = async () => {
    if (!loading && friendStatus.isFetched && friendState === undefined) {
      setLoading(true);
      try {
        await addFriend(
          userId,
          () => {},
          (data) => {
            utils.friends.getStatus.setData({ userId }, () => data);
          },
        );
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
  };

  const friendStatusMessage =
    friendState === "PENDING"
      ? "pending"
      : friendState === "ACCEPTED"
        ? "friends"
        : "add friend";

  return (
    <div className="tooltip" data-tip={friendStatusMessage}>
      <button
        disabled={!friendStatus.isFetched || loading}
        className="btn btn-circle"
        aria-label={friendStatusMessage}
        onClick={handleButton}
      >
        {loading === true ? (
          <Loader className="animate-spin" />
        ) : friendState === "PENDING" ? (
          <UserRoundCog />
        ) : friendState === "ACCEPTED" ? (
          <UserRoundCheck />
        ) : (
          <UserRoundPlus />
        )}
      </button>
    </div>
  );
}
